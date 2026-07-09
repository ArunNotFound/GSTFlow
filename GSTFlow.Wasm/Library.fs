module GSTFlow.Wasm.API

open Fable.Core
open Fable.Core.JsInterop
open Thoth.Json
open GSTFlow.Core
open GSTFlow.Rules
open GSTFlow.Emit

let compileInvoice (jsonString: string) : obj =
    // Thoth Decoder for MVP
    let decodeInvoice = Decode.Auto.fromString<Invoice>(jsonString)
    match decodeInvoice with
    | Ok invoice ->
        let ir = Compiler.normalize invoice
        let gstr1 = Generators.emitGstr1Json ir
        let proof = Generators.emitProofReport ir
        
        {|
            success = true
            gstr1 = gstr1
            proof = proof
            error = null
        |} |> box
    | Error err ->
        {|
            success = false
            gstr1 = null
            proof = null
            error = err
        |} |> box
