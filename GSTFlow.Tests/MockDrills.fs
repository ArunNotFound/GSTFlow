module GSTFlow.Tests.MockDrillsSpecs

open System
open Xunit
open FsCheck
open FsCheck.Xunit
open GSTFlow.Core
open GSTFlow.Rules

// ---------------------------------------------------------
// OPERATION DIVE: Submarine Torpedo Generators
// ---------------------------------------------------------

let createInvoice (sellerGstin: string) (sellerState: string) (buyerGstin: string option) (buyerState: string option) (igst: decimal) (cgst: decimal) (sgst: decimal) (hsn: string) (rate: decimal) =
    {
        InvoiceNumber = "TORPEDO-001"
        InvoiceDate = "2026-07-10"
        Seller = { Gstin = sellerGstin; StateCode = sellerState }
        Buyer = 
            match buyerGstin, buyerState with
            | Some bg, Some state -> Some { Gstin = bg; StateCode = state }
            | _ -> None
        Items = [
            {
                Hsn = hsn
                TaxableValue = 1000m
                GstRate = rate
                Tax = { Igst = igst; Cgst = cgst; Sgst = sgst }
            }
        ]
    }

// Torpedo 1-4: B2B Math
[<Property>]
let ``DIVE 01: Standard B2B Invoice math must pass`` (isInterstate: bool) =
    let sellerState = "27"
    let sellerGstin = "27AAPFU0939F1ZV"
    
    let buyerState, buyerGstin = 
        if isInterstate then "29", "29AAGCB7383J1Z4" 
        else "27", "27AAPFU0939F1ZV"
    
    let rate = 18m
    let expectedTax = 1000m * (rate / 100m)
    
    let igst = if isInterstate then expectedTax else 0m
    let cgst = if isInterstate then 0m else expectedTax / 2m
    let sgst = if isInterstate then 0m else expectedTax / 2m
    
    let raw = createInvoice sellerGstin sellerState (Some buyerGstin) (Some buyerState) igst cgst sgst "9983" rate
    let res = Compiler.compile raw
    
    let errors = res.Violations |> List.filter (fun v -> v.IsError)
    if errors.Length > 0 then
        for e in errors do
            printfn "Violation: %s - %s" e.Rule e.Description
        false
    else true

// Torpedo 5-8: RCM (Reverse Charge Mechanism)
[<Property>]
let ``DIVE 02: Reverse Charge (RCM) GTA Services must allow 0 tax on invoice`` (isInterstate: bool) =
    let sellerState = "27"
    let sellerGstin = "27AAPFU0939F1ZV"
    
    let buyerState, buyerGstin = 
        if isInterstate then "29", "29AAGCB7383J1Z4" 
        else "27", "27AAPFU0939F1ZV"
    
    let rate = 5m // GTA typically 5% without ITC
    
    // In RCM, the seller charges 0 tax on the invoice itself. The buyer pays it directly to Gov.
    let igst = 0m
    let cgst = 0m
    let sgst = 0m
    
    // GTA HSN code is 9965 or 9967
    let raw = createInvoice sellerGstin sellerState (Some buyerGstin) (Some buyerState) igst cgst sgst "9965" rate
    let res = Compiler.compile raw
    
    let errors = res.Violations |> List.filter (fun v -> v.IsError)
    if errors.Length > 0 then
        for e in errors do
            printfn "Violation: %s - %s" e.Rule e.Description
        false
    else true
