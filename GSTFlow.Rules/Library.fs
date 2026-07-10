namespace GSTFlow.Rules

open System
open GSTFlow.Core

// Raw representation for JSON parsing
type RawParty = {
    Gstin: string
    StateCode: string
}

type RawInvoiceItem = {
    Hsn: string
    TaxableValue: decimal
    GstRate: decimal
    Tax: TaxAmount
}

type RawInvoice = {
    InvoiceNumber: string
    InvoiceDate: string
    Seller: RawParty
    Buyer: RawParty option
    Items: RawInvoiceItem list
}

type RuleViolation = {
    Rule: string
    Description: string
    IsError: bool
}

type CompilationResult = {
    IR: GSTCanonicalIR option
    Violations: RuleViolation list
}

module Compiler =

    let validStateCodes = 
        Set.ofList [ for i in 1..38 -> sprintf "%02d" i ]

    let validRateSlabs = 
        Set.ofList [ 0m; 0.1m; 0.25m; 1.5m; 3m; 5m; 12m; 18m; 28m ]

    let isValidHsn (hsn: string) =
        System.Text.RegularExpressions.Regex.IsMatch(hsn, @"^(\d{4}|\d{6}|\d{8})$")

    let private validateGstin (raw: RawParty) (role: string) =
        if not (validStateCodes.Contains raw.StateCode) then
            Error { Rule = "STATE_CODE"; Description = sprintf "%s State Code '%s' is not in the valid vocabulary (01-38)" role raw.StateCode; IsError = true }
        else
            match GSTIN.create raw.Gstin with
            | Ok g -> 
                if raw.Gstin.Substring(0, 2) <> raw.StateCode then
                    Error { Rule = "GSTIN_STATE_MATCH"; Description = sprintf "%s GSTIN '%s' does not match State Code '%s'" role raw.Gstin raw.StateCode; IsError = true }
                else Ok { Party.Gstin = g; Party.StateCode = raw.StateCode }
            | Error e -> Error { Rule = "GSTIN_FORMAT"; Description = sprintf "%s GSTIN '%s' is invalid: %s" role raw.Gstin e; IsError = true }

    let private validateItem (isInterstate: bool) (item: RawInvoiceItem) =
        let mutable violations = []

        if not (isValidHsn item.Hsn) then
            violations <- { Rule = "HSN_FORMAT"; Description = sprintf "HSN '%s' must be exactly 4, 6, or 8 digits" item.Hsn; IsError = true } :: violations
            
        if not (validRateSlabs.Contains item.GstRate) then
            violations <- { Rule = "RATE_SLAB"; Description = sprintf "GST Rate %M is not a valid Indian slab (0, 0.1, 0.25, 1.5, 3, 5, 12, 18, 28)" item.GstRate; IsError = true } :: violations

        // Section 170: Rounding to the nearest Rupee applies at the total level, but item-level tax should be mathematically accurate to 2 decimals.
        let expectedTax = Math.Round(item.TaxableValue * (item.GstRate / 100m), 2)
        
        if isInterstate then
            if item.Tax.Cgst > 0m || item.Tax.Sgst > 0m then
                violations <- { Rule = "IGST_CGST_LAW"; Description = "Interstate supply cannot have CGST or SGST"; IsError = true } :: violations
            if Math.Abs(item.Tax.Igst - expectedTax) > 0.5m then
                violations <- { Rule = "TAX_AMOUNT"; Description = sprintf "Expected IGST approx %M but got %M (failed Sec 170 / item math)" expectedTax item.Tax.Igst; IsError = true } :: violations
        else
            if item.Tax.Igst > 0m then
                violations <- { Rule = "IGST_CGST_LAW"; Description = "Intrastate supply cannot have IGST"; IsError = true } :: violations
            let expectedSplit = Math.Round(expectedTax / 2m, 2)
            if Math.Abs(item.Tax.Cgst - expectedSplit) > 0.5m || Math.Abs(item.Tax.Sgst - expectedSplit) > 0.5m then
                violations <- { Rule = "TAX_AMOUNT"; Description = sprintf "Expected CGST/SGST approx %M but got C:%M S:%M" expectedSplit item.Tax.Cgst item.Tax.Sgst; IsError = true } :: violations
        violations

    let compile (raw: RawInvoice) : CompilationResult =
        let mutable violations = []
        
        let sellerRes = validateGstin raw.Seller "Seller"
        match sellerRes with
        | Error e -> violations <- e :: violations
        | _ -> ()

        let buyerRes = 
            match raw.Buyer with
            | Some b -> 
                match validateGstin b "Buyer" with
                | Ok b2 -> Some (Ok b2)
                | Error e -> 
                    violations <- e :: violations
                    Some (Error e)
            | None -> None

        if violations.Length > 0 then
            { IR = None; Violations = violations }
        else
            let seller = match sellerRes with Ok s -> s | _ -> failwith "unreachable"
            let buyer = match buyerRes with Some (Ok b) -> Some b | _ -> None
            
            let pos = 
                match buyer with
                | Some b -> b.StateCode
                | None -> seller.StateCode
                
            let isInterstate = seller.StateCode <> pos
            
            let supplyType = 
                match buyer with
                | Some _ -> B2B
                | None -> B2C
                
            let itemViolations = raw.Items |> List.collect (validateItem isInterstate)
            violations <- itemViolations @ violations
            
            // Section 170 Rounding Law: Total tax must be rounded to nearest Rupee
            let totalIgst = raw.Items |> List.sumBy (fun i -> i.Tax.Igst)
            let totalCgst = raw.Items |> List.sumBy (fun i -> i.Tax.Cgst)
            let totalSgst = raw.Items |> List.sumBy (fun i -> i.Tax.Sgst)
            
            // Allow if mathematically exact or rounded to nearest integer (Sec 170)
            let totalTaxable = raw.Items |> List.sumBy (fun i -> i.TaxableValue)
            let totalInvoiceValue = totalTaxable + totalIgst + totalCgst + totalSgst
            
            // The strict letter of Sec 170 requires tax to be rounded.
            // But real-world ERPs (like Amazon) retain fractional tax and round only the final total.
            // We flag an error ONLY if the final invoice total is not rounded.
            if totalInvoiceValue % 1m <> 0m then
                 violations <- { Rule = "SEC_170_ROUNDING"; Description = "Section 170 CGST Act: Final invoice total must be rounded off to the nearest Rupee."; IsError = true } :: violations
                 
            if violations |> List.exists (fun v -> v.IsError) then
                { IR = None; Violations = violations }
            else
                let validItems = raw.Items |> List.map (fun i -> { InvoiceItem.Hsn = i.Hsn; InvoiceItem.TaxableValue = i.TaxableValue; InvoiceItem.GstRate = i.GstRate; InvoiceItem.Tax = i.Tax })
                let ir = {
                    Invoice = {
                        InvoiceNumber = raw.InvoiceNumber
                        InvoiceDate = raw.InvoiceDate
                        Seller = seller
                        Buyer = buyer
                        Items = validItems
                    }
                    DerivedSupplyType = supplyType
                    PlaceOfSupply = pos
                    IsInterstate = isInterstate
                }
                { IR = Some ir; Violations = [] }
