module GSTFlow.Cli.Program

open System
open System.IO
open Argu
open Thoth.Json.Net
open GSTFlow.Core
open GSTFlow.Rules
open GSTFlow.Emit

type CliArguments =
    | Validate of path:string
    | Emit_Gstr1 of path:string
    | Prove of path:string
    interface IArgParserTemplate with
        member s.Usage =
            match s with
            | Validate _ -> "Validate an invoice JSON file against GST rules."
            | Emit_Gstr1 _ -> "Emit the GSTR-1 payload for the given invoice JSON file."
            | Prove _ -> "Emit the PROOF.md report for the given invoice JSON file."

let readInvoice path =
    if not (File.Exists path) then
        printfn "Error: File not found at %s" path
        Environment.Exit(1)
        
    let jsonString = File.ReadAllText path
    let extra = Extra.empty |> Extra.withDecimal
    match Decode.Auto.fromString<RawInvoice>(jsonString, extra = extra) with
    | Ok rawInvoice -> rawInvoice
    | Error err ->
        printfn "Error parsing JSON: %s" err
        Environment.Exit(1)
        failwith "unreachable"

[<EntryPoint>]
let main argv =
    let parser = ArgumentParser.Create<CliArguments>(programName = "gstflow")
    
    try
        let results = parser.ParseCommandLine(inputs = argv, raiseOnUsage = true)
        
        if results.Contains(Validate) then
            let path = results.GetResult(Validate)
            let rawInvoice = readInvoice path
            let res = Compiler.compile rawInvoice
            
            match res.IR with
            | Some ir ->
                printfn "✅ Invoice %s validates successfully!" ir.Invoice.InvoiceNumber
                printfn "Supply Type: %A" ir.DerivedSupplyType
                printfn "Place of Supply: %s" ir.PlaceOfSupply
                printfn "Interstate: %b" ir.IsInterstate
                0
            | None ->
                printfn "❌ Validation Failed:"
                for v in res.Violations do
                    printfn "  [%s] %s" v.Rule v.Description
                1

        elif results.Contains(Emit_Gstr1) then
            let path = results.GetResult(Emit_Gstr1)
            let rawInvoice = readInvoice path
            let res = Compiler.compile rawInvoice
            
            match res.IR with
            | Some ir ->
                let gstr1 = Generators.emitGstr1Json ir
                printfn "%s" gstr1
                0
            | None ->
                printfn "Error: Cannot emit GSTR-1 for invalid invoice."
                for v in res.Violations do
                    printfn "  [%s] %s" v.Rule v.Description
                1

        elif results.Contains(Prove) then
            let path = results.GetResult(Prove)
            let rawInvoice = readInvoice path
            let res = Compiler.compile rawInvoice
            
            match res.IR with
            | Some ir ->
                let proof = Generators.emitProofReport ir
                printfn "%s" proof
                0
            | None ->
                printfn "Error: Cannot emit PROOF for invalid invoice."
                for v in res.Violations do
                    printfn "  [%s] %s" v.Rule v.Description
                1
        else
            printfn "%s" (parser.PrintUsage())
            1
            
    with e ->
        printfn "%s" e.Message
        1
