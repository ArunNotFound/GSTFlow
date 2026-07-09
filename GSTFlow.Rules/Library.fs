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

    let private validateGstin (raw: RawParty) (role: string) =
        match GSTIN.create raw.Gstin with
        | Ok g -> Ok { Party.Gstin = g; Party.StateCode = raw.StateCode }
        | Error e -> Error { Rule = "GSTIN_FORMAT"; Description = sprintf "%s GSTIN '%s' is invalid: %s" role raw.Gstin e; IsError = true }

    let private validateTaxes (isInterstate: bool) (item: RawInvoiceItem) =
        let expectedTax = Math.Round(item.TaxableValue * (item.GstRate / 100m), 2)
        let mutable violations = []
        
        if isInterstate then
            if item.Tax.Cgst > 0m || item.Tax.Sgst > 0m then
                violations <- { Rule = "IGST_CGST_LAW"; Description = "Interstate supply cannot have CGST or SGST"; IsError = true } :: violations
            if item.Tax.Igst <> expectedTax then
                violations <- { Rule = "TAX_AMOUNT"; Description = sprintf "Expected IGST %M but got %M" expectedTax item.Tax.Igst; IsError = true } :: violations
        else
            if item.Tax.Igst > 0m then
                violations <- { Rule = "IGST_CGST_LAW"; Description = "Intrastate supply cannot have IGST"; IsError = true } :: violations
            let expectedSplit = Math.Round(expectedTax / 2m, 2)
            if item.Tax.Cgst <> expectedSplit || item.Tax.Sgst <> expectedSplit then
                violations <- { Rule = "TAX_AMOUNT"; Description = sprintf "Expected CGST/SGST %M but got C:%M S:%M" expectedSplit item.Tax.Cgst item.Tax.Sgst; IsError = true } :: violations
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
                
            let itemViolations = raw.Items |> List.collect (validateTaxes isInterstate)
            violations <- itemViolations @ violations
            
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
