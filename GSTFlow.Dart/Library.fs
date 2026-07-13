module GSTFlow.Dart.API

open GSTFlow.Core
open GSTFlow.Core.Verification
open GSTFlow.Rules
open GSTFlow.Emit

// We expose the core RawInvoice and Compiler to Dart.
// Fable will generate Dart classes for RawParty, RawInvoiceItem, RawInvoice, and VerdictEnvelope.
// The Flutter app can construct these objects directly using Dart syntax, and then pass them here.

let compileInvoice (invoice: RawInvoice) (hash: string) =
    Compiler.compile invoice hash

let emitSummary (ir: GSTCanonicalIR) =
    Generators.emitSummaryJson ir

let emitReport (ir: GSTCanonicalIR) =
    Generators.emitValidationReport ir
