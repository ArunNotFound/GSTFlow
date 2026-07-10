namespace GSTFlow.Rules

open System
open GSTFlow.Core

// Raw representation for JSON parsing
type RawParty = {
    Gstin: string
    StateCode: string
    IsSez: bool option
}

type RawInvoiceItem = {
    Hsn: string
    TaxableValue: decimal
    GstRate: decimal
    CessRate: decimal option
    Tax: TaxAmount
}

type RawInvoice = {
    DocumentType: string option
    InvoiceNumber: string
    InvoiceDate: string
    PlaceOfSupply: string option
    OriginalInvoiceNumber: string option
    OriginalInvoiceDate: string option
    Irn: string option
    Seller: RawParty
    Buyer: RawParty option
    Items: RawInvoiceItem list
}

type RuleOutcome = 
    | Pass
    | Warning
    | Unknown
    | NotSupported
    | Fail

type RuleResult = {
    Rule: string
    Description: string
    Outcome: RuleOutcome
}

type CompilationResult = {
    IR: GSTCanonicalIR option
    Results: RuleResult list
}

module Compiler =

    let validStateCodes = 
        Set.ofList ([ for i in 1..38 -> sprintf "%02d" i ] @ [ "97"; "99" ])

    let validRateSlabs = 
        Set.ofList [ 0m; 0.1m; 0.25m; 1.5m; 3m; 5m; 12m; 18m; 28m ]

    let isValidHsn (hsn: string) =
        System.Text.RegularExpressions.Regex.IsMatch(hsn, @"^(\d{4}|\d{6}|\d{8})$")

    let private validateParty (role: string) (raw: RawParty) =
        match GSTIN.create raw.Gstin with
        | Ok g ->
            if raw.Gstin.Substring(0, 2) <> raw.StateCode then
                Error { Rule = "GSTIN_STATE_MATCH"; Description = sprintf "%s StateCode '%s' does not match GSTIN prefix '%s'" role raw.StateCode (raw.Gstin.Substring(0, 2)); Outcome = Fail }
            else
                let isSez = match raw.IsSez with Some x -> x | None -> false
                Ok { Party.Gstin = g; Party.StateCode = raw.StateCode; Party.IsSez = isSez }
        | Error e -> Error { Rule = "GSTIN_FORMAT"; Description = sprintf "%s GSTIN '%s' is invalid: %s" role raw.Gstin e; Outcome = Fail }

    let private isRcmHsn (hsn: string) =
        // GTA, Legal, Sponsorship, Security, etc.
        let prefixes = ["9965"; "9967"; "9973"; "9982"; "9983"; "9985"]
        prefixes |> List.exists (fun p -> hsn.StartsWith(p))

    let private validateItem (isInterstate: bool) (item: RawInvoiceItem) =
        let mutable violations = []

        if not (isValidHsn item.Hsn) then
            violations <- { Rule = "HSN_FORMAT"; Description = sprintf "HSN '%s' must be exactly 4, 6, or 8 digits" item.Hsn; Outcome = Fail } :: violations
            
        if not (validRateSlabs.Contains item.GstRate) then
            violations <- { Rule = "RATE_SLAB"; Description = sprintf "GST Rate %M is not a valid Indian slab (0, 0.1, 0.25, 1.5, 3, 5, 12, 18, 28)" item.GstRate; Outcome = Fail } :: violations

        // Section 170: Rounding to the nearest Rupee applies at the total level, but item-level tax should be mathematically accurate to 2 decimals.
        let expectedTax = Math.Round(item.TaxableValue * (item.GstRate / 100m), 2)
        
        let isRcmExempt = isRcmHsn item.Hsn && item.Tax.Igst = 0m && item.Tax.Cgst = 0m && item.Tax.Sgst = 0m

        if isInterstate then
            if item.Tax.Cgst > 0m || item.Tax.Sgst > 0m then
                violations <- { Rule = "IGST_CGST_LAW"; Description = "Interstate supply cannot have CGST or SGST"; Outcome = Fail } :: violations
            
            if not isRcmExempt && Math.Abs(item.Tax.Igst - expectedTax) > 0.5m then
                violations <- { Rule = "TAX_AMOUNT"; Description = sprintf "Expected IGST approx %M but got %M (failed Sec 170 / item math)" expectedTax item.Tax.Igst; Outcome = Fail } :: violations
        else
            if item.Tax.Igst > 0m then
                violations <- { Rule = "IGST_CGST_LAW"; Description = "Intrastate supply cannot have IGST"; Outcome = Fail } :: violations
            
            let expectedSplit = Math.Round(expectedTax / 2m, 2)
            if not isRcmExempt && (Math.Abs(item.Tax.Cgst - expectedSplit) > 0.5m || Math.Abs(item.Tax.Sgst - expectedSplit) > 0.5m) then
                violations <- { Rule = "TAX_AMOUNT"; Description = sprintf "Expected CGST/SGST approx %M but got C:%M S:%M" expectedSplit item.Tax.Cgst item.Tax.Sgst; Outcome = Fail } :: violations
                
        if isRcmExempt then
            violations <- { Rule = "REVIEW_REQUIRED"; Description = sprintf "Taxes are zero for HSN '%s' - Possible Reverse Charge Mechanism (RCM), review required." item.Hsn; Outcome = Unknown } :: violations
            
        match item.CessRate, item.Tax.Cess with
        | Some crate, Some cval ->
            let expectedCess = Math.Round(item.TaxableValue * (crate / 100m), 2)
            if Math.Abs(cval - expectedCess) > 0.5m then
                violations <- { Rule = "CESS_ARITHMETIC"; Description = sprintf "Expected Cess approx %M but got %M" expectedCess cval; Outcome = Fail } :: violations
        | None, Some cval when cval > 0m ->
            violations <- { Rule = "CESS_ARITHMETIC"; Description = "Cess amount provided but no CessRate specified"; Outcome = Fail } :: violations
        | Some _, None ->
            violations <- { Rule = "CESS_ARITHMETIC"; Description = "CessRate provided but no Cess amount specified"; Outcome = Fail } :: violations
        | _ -> ()

        violations

    let compile (raw: RawInvoice) : CompilationResult =
        let mutable violations = []
        
        let sellerRes = validateParty "Seller" raw.Seller
        match sellerRes with
        | Error e -> violations <- e :: violations
        | _ -> ()

        let docType =
            match raw.DocumentType with
            | Some "CRN" -> CRN
            | Some "DBN" -> DBN
            | Some "INV" | None -> INV
            | Some other ->
                violations <- { Rule = "DOC_TYPE"; Description = sprintf "Invalid DocumentType '%s'" other; Outcome = Fail } :: violations
                INV

        match docType with
        | CRN | DBN ->
            if raw.OriginalInvoiceNumber.IsNone || raw.OriginalInvoiceDate.IsNone then
                violations <- { Rule = "CDN_ORIGINAL_INV"; Description = "Credit/Debit Notes require OriginalInvoiceNumber and OriginalInvoiceDate"; Outcome = Fail } :: violations
        | INV -> ()
        
        match raw.Irn with
        | Some irn ->
            if irn.Length <> 64 || not (System.Text.RegularExpressions.Regex.IsMatch(irn, "^[a-fA-F0-9]{64}$")) then
                violations <- { Rule = "IRN_FORMAT"; Description = "IRN must be exactly 64 hexadecimal characters"; Outcome = Fail } :: violations
        | None -> ()

        let buyerRes = 
            match raw.Buyer with
            | Some b when String.IsNullOrWhiteSpace(b.Gstin) -> 
                if not (validStateCodes.Contains b.StateCode) then
                    let err = { Rule = "STATE_CODE"; Description = sprintf "Buyer State Code '%s' is not in the valid vocabulary (01-38, 97, 99)" b.StateCode; Outcome = Fail }
                    violations <- err :: violations
                    Some (Error err)
                else
                    // B2C with known POS
                    let urpGstin = match GSTIN.create "URP" with Ok g -> g | _ -> failwith "URP"
                    Some (Ok { Party.Gstin = urpGstin; Party.StateCode = b.StateCode; Party.IsSez = false })
            | Some b -> 
                match validateParty "Buyer" b with
                | Ok b2 -> Some (Ok b2)
                | Error e -> 
                    violations <- e :: violations
                    Some (Error e)
            | None -> None

        if violations.Length > 0 then
            { IR = None; Results = violations }
        else
            let seller = match sellerRes with Ok s -> s | _ -> failwith "unreachable"
            let buyer = match buyerRes with Some (Ok b) -> Some b | _ -> None
            
            let pos = 
                match raw.PlaceOfSupply with
                | Some p when validStateCodes.Contains p -> p
                | Some p -> 
                    violations <- { Rule = "PLACE_OF_SUPPLY"; Description = sprintf "Invalid PlaceOfSupply '%s'" p; Outcome = Fail } :: violations
                    p
                | None ->
                    match buyer with
                    | Some b when GSTIN.value b.Gstin <> "URP" -> b.StateCode
                    | _ -> 
                        violations <- { Rule = "PLACE_OF_SUPPLY_UNKNOWN"; Description = "Place of supply cannot be safely derived for unregistered buyer without explicit POS"; Outcome = Unknown } :: violations
                        "UNKNOWN"
                
            let isInterstate = 
                seller.StateCode <> pos || 
                seller.IsSez || 
                (match buyer with Some b -> b.IsSez | None -> false)
            
            let supplyType = 
                match buyer with
                | Some b when GSTIN.value b.Gstin <> "URP" -> B2B
                | _ -> B2C
                
            let itemViolations = raw.Items |> List.collect (validateItem isInterstate)
            violations <- itemViolations @ violations
            
            // Section 170 Rounding Law: Total tax must be rounded to nearest Rupee
            let totalIgst = raw.Items |> List.sumBy (fun i -> i.Tax.Igst)
            let totalCgst = raw.Items |> List.sumBy (fun i -> i.Tax.Cgst)
            let totalSgst = raw.Items |> List.sumBy (fun i -> i.Tax.Sgst)
            let totalCess = raw.Items |> List.sumBy (fun i -> match i.Tax.Cess with Some c -> c | None -> 0m)
            
            // Allow if mathematically exact or rounded to nearest integer (Sec 170)
            let totalTaxable = raw.Items |> List.sumBy (fun i -> i.TaxableValue)
            let totalInvoiceValue = totalTaxable + totalIgst + totalCgst + totalSgst + totalCess
            
            // The strict letter of Sec 170 requires tax to be rounded.
            // But real-world ERPs (like Amazon) retain fractional tax and round only the final total.
            // We flag a WARNING if the final invoice total is not rounded.
            // Telecom operators (Airtel, Jio) do not round their bills. If we block this, we reject all Wi-Fi expenses.
            if totalInvoiceValue % 1m <> 0m then
                 violations <- { Rule = "SEC_170_ROUNDING"; Description = "Section 170 CGST Act: Final invoice total must be rounded off to the nearest Rupee. Note: Telecom operators often ignore this."; Outcome = Warning } :: violations
                 
            if violations |> List.exists (fun v -> v.Outcome = Fail) then
                { IR = None; Results = violations }
            else
                let validItems = raw.Items |> List.map (fun i -> { InvoiceItem.Hsn = i.Hsn; InvoiceItem.TaxableValue = i.TaxableValue; InvoiceItem.GstRate = i.GstRate; InvoiceItem.CessRate = i.CessRate; InvoiceItem.Tax = i.Tax })
                let ir = {
                    Invoice = {
                        DocumentType = docType
                        InvoiceNumber = raw.InvoiceNumber
                        InvoiceDate = raw.InvoiceDate
                        OriginalInvoiceNumber = raw.OriginalInvoiceNumber
                        OriginalInvoiceDate = raw.OriginalInvoiceDate
                        Irn = raw.Irn
                        Seller = seller
                        Buyer = buyer
                        Items = validItems
                    }
                    DerivedSupplyType = supplyType
                    PlaceOfSupply = pos
                    IsInterstate = isInterstate
                }
                { IR = Some ir; Results = violations }
