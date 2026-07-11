module GSTFlow.Cli.Program
open GSTFlow.Core.Verification

open System
open System.IO
open Argu
open Thoth.Json.Net
open GSTFlow.Core
open GSTFlow.Rules
open GSTFlow.Emit

type CliArguments =
    | Validate of path:string
    | Emit_Summary of path:string
    | Emit_Envelope of path:string
    | Prove of path:string
    interface IArgParserTemplate with
        member s.Usage =
            match s with
            | Validate _ -> "Validate an invoice JSON file against GST rules."
            | Emit_Summary _ -> "Emit the Summary JSON payload for the given invoice JSON file."
            | Emit_Envelope _ -> "Emit the Canonical VerdictEnvelope JSON for the given invoice JSON file."
            | Prove _ -> "Emit the VALIDATION_REPORT.md for the given invoice JSON file."

let readInvoice path =
    if not (File.Exists path) then
        printfn "Error: File not found at %s" path
        Environment.Exit(1)
        
    let jsonString = File.ReadAllText path
    let extra = Extra.empty |> Extra.withDecimal
    match Decode.Auto.fromString<RawInvoice>(jsonString, extra = extra) with
    | Ok invoice -> (invoice, Hash.computeSha256 jsonString)
    | Error msg ->
        printfn "Error parsing JSON: %s" msg
        Environment.Exit(1)
        failwith "unreachable"

[<EntryPoint>]
let main argv =
    let parser = ArgumentParser.Create<CliArguments>(programName = "gstflow")
    
    try
        let results = parser.ParseCommandLine(inputs = argv, raiseOnUsage = true)
        
        if results.Contains(Validate) then
            let path = results.GetResult(Validate)
            let (rawInvoice, hash) = readInvoice path
            let res = Compiler.compile rawInvoice hash
            
            match res.IR with
            | Some ir ->
                printfn "✅ Invoice %s validates successfully!" ir.Invoice.InvoiceNumber
                printfn "Supply Type: %A" ir.DerivedSupplyType
                printfn "Place of Supply: %s" ir.PlaceOfSupply
                printfn "Interstate: %b" ir.IsInterstate
                0
            | None ->
                printfn "❌ Validation Failed:"
                for v in res.Envelope.Results do
                    printfn "  [%s] %s" v.Metadata.RuleId (match v.Evidence |> List.tryHead with | Some e -> defaultArg e.Value "" | None -> "")
                1

        elif results.Contains(Emit_Summary) then
            let path = results.GetResult(Emit_Summary)
            let (rawInvoice, hash) = readInvoice path
            let res = Compiler.compile rawInvoice hash
            
            match res.IR with
            | Some ir ->
                let summary = Generators.emitSummaryJson ir
                printfn "%s" summary
                0
            | None ->
                printfn "Error: Cannot emit Summary for invalid invoice."
                for v in res.Envelope.Results do
                    printfn "  [%s] %s" v.Metadata.RuleId (match v.Evidence |> List.tryHead with | Some e -> defaultArg e.Value "" | None -> "")
                1

        elif results.Contains(Emit_Envelope) then
            let path = results.GetResult(Emit_Envelope)
            let (rawInvoice, hash) = readInvoice path
            let res = Compiler.compile rawInvoice hash
            let envelopeJson = CanonicalJson.serializeEnvelope res.Envelope
            printfn "%s" envelopeJson
            if res.Envelope.OverallOutcome = Fail then 1 else 0

        elif results.Contains(Prove) then
            let path = results.GetResult(Prove)
            let (rawInvoice, hash) = readInvoice path
            let res = Compiler.compile rawInvoice hash
            
            match res.IR with
            | Some ir ->
                let proof = Generators.emitValidationReport ir
                printfn "%s" proof
                0
            | None ->
                printfn "Error: Cannot emit VALIDATION REPORT for invalid invoice."
                for v in res.Envelope.Results do
                    printfn "  [%s] %s" v.Metadata.RuleId (match v.Evidence |> List.tryHead with | Some e -> defaultArg e.Value "" | None -> "")
                1
        else
            printfn "%s" (parser.PrintUsage())
            1
            
    with e ->
        printfn "%s" e.Message
        1
