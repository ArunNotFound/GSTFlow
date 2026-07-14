module GSTFlow.Wasm.API

open GSTFlow.Core.Verification

open Fable.Core
open Fable.Core.JsInterop
open Thoth.Json
open GSTFlow.Core
open GSTFlow.Rules
open GSTFlow.Emit

let compileInvoice (jsonString: string) (hash: string) : obj =
    let extra = Extra.empty |> Extra.withDecimal
    let decodeInvoice = Decode.Auto.fromString<RawInvoice>(jsonString, extra = extra)
    match decodeInvoice with
    | Ok rawInvoice ->
        let result = Compiler.compile rawInvoice hash
        
        let serializeEnv (env: VerdictEnvelope) = Encode.Auto.toString(0, env, extra = extra)
        let violations =
            result.Envelope.Results
            |> List.filter (fun r -> r.Outcome = RuleOutcome.Fail)
            |> List.map (fun r -> {| Rule = r.Metadata.RuleId; Description = r.Metadata.MessageKey |})
            |> Array.ofList

        match result.IR with
        | Some ir ->
            let summary = Generators.emitSummaryJson ir
            let proof = Generators.emitValidationReport ir
            {|
                success = (violations.Length = 0)
                summary = summary
                proof = proof
                envelope = serializeEnv result.Envelope
                violations = violations
                error = null
            |} |> box
        | None ->
            {|
                success = false
                summary = null
                proof = null
                envelope = serializeEnv result.Envelope
                violations = violations
                error = "Validation failed"
            |} |> box
    | Error err ->
        {|
            success = false
            summary = null
            proof = null
            envelope = null
            violations = [||]
            error = err
        |} |> box

let routeNaturalLanguageSql (prompt: string) : obj =
    let res = SqlInference.routePromptToDuckDbSql prompt
    {|
        prompt = res.Prompt
        emittedSql = res.EmittedSql
        executionEngine = res.ExecutionEngine
        gbnfGrammarApplied = res.GbnfGrammarApplied
        explanation = res.Explanation
    |} |> box

let decodeOfflineQr (base64Payload: string) : obj =
    let decoded = QrDecoder.decodeOfflineQr base64Payload
    {|
        sellerGstin = decoded.SellerGstin
        buyerGstin = decoded.BuyerGstin
        documentNumber = decoded.InvoiceNumber
        totalValue = decoded.TotalValue
        irnHash = decoded.IrnHash
    |} |> box
