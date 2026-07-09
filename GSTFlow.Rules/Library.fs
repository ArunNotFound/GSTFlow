namespace GSTFlow.Rules

open GSTFlow.Core

module Compiler =

    let normalize (invoice: Invoice) : GSTCanonicalIR =
        let pos = 
            match invoice.Buyer with
            | Some b -> b.StateCode
            | None -> invoice.Seller.StateCode // Simplified B2C fallback
            
        let isInterstate = invoice.Seller.StateCode <> pos
        
        let supplyType = 
            match invoice.Buyer with
            | Some _ -> B2B
            | None -> B2C
            
        {
            Invoice = invoice
            DerivedSupplyType = supplyType
            PlaceOfSupply = pos
            IsInterstate = isInterstate
        }
