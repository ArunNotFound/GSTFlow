namespace GSTFlow.Emit

open GSTFlow.Core
open GSTFlow.Rules

open GSTFlow.Core.Verification

module Generators =
    let emitSummaryJson (ir: GSTCanonicalIR) =
        // Simplistic JSON payload for MVP
        let supplyTypeStr = match ir.DerivedSupplyType with B2B -> "B2B" | B2C -> "B2C"
        let taxType = if ir.IsInterstate then "IGST" else "CGST_SGST"
        
        let payload =
            {|
                invoiceNumber = ir.SourceInvoice.InvoiceNumber
                ``type`` = supplyTypeStr
                placeOfSupply = ir.PlaceOfSupply
                taxClassification = taxType
                itemsCount = ir.SourceInvoice.Items.Length
            |}
        let options = System.Text.Json.JsonSerializerOptions(WriteIndented = true)
        System.Text.Json.JsonSerializer.Serialize(payload, options)

    let emitValidationReport (ir: GSTCanonicalIR) =
        let expectedTax = if ir.IsInterstate then "IGST" else "CGST+SGST"
        let hasIgst = ir.SourceInvoice.Items |> List.exists (fun i -> i.Tax.Igst > 0m)
        let hasCgst = ir.SourceInvoice.Items |> List.exists (fun i -> i.Tax.Cgst > 0m)
        let hasSgst = ir.SourceInvoice.Items |> List.exists (fun i -> i.Tax.Sgst > 0m)
        
        let actualTax = 
            if hasIgst && not hasCgst && not hasSgst then "IGST"
            elif hasCgst && hasSgst && not hasIgst then "CGST+SGST"
            else "MIXED_OR_INVALID"
            
        let status = if expectedTax = actualTax then "Passed" else "Failed"
        let grade = if status = "Passed" then "Exact" else "Approximate"

        $"""# GSTFlow Validation Report

## Invoice {ir.SourceInvoice.InvoiceNumber}

Canonical GST IR: {grade}
Summary JSON: {grade}

## Verified Tax Logic

Seller state: {ir.SourceInvoice.Seller.StateCode}
Place of supply: {ir.PlaceOfSupply}
Supply type: {if ir.IsInterstate then "Interstate" else "Intrastate"}
Expected tax: {expectedTax}
Actual tax: {actualTax}

Result: {status}
"""

module CffPackager =
    open System
    open System.Text
    open System.Security.Cryptography

    let private sha256 (input: string) =
        using (SHA256.Create()) (fun alg ->
            let bytes = Encoding.UTF8.GetBytes(input)
            let hash = alg.ComputeHash(bytes)
            let sb = StringBuilder()
            hash |> Array.iter (fun b -> sb.Append(b.ToString("x2")) |> ignore)
            sb.ToString()
        )

    let generateCffManifestJson (invoice: RawInvoice) (envelope: VerdictEnvelope) =
        failwith "NotImplemented: Real CFF ZIP/Parquet generation and payload digest is planned for Gate 4 (P0.5 finding)"

module QrDecoder =
    type DecodedQrPayload = {
        SellerGstin: string
        BuyerGstin: string
        InvoiceNumber: string
        InvoiceDate: string
        TotalValue: decimal
        MainHsnCode: string
        IrnHash: string
        SignatureVerified: bool
    }

    let decodeOfflineQr (rawPayload: string) : DecodedQrPayload =
        failwith "NotImplemented: QR Signature Verification requires real NIC payload parser and cert chain (P0.6 finding)"
