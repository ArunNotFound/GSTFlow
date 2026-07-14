namespace GSTFlow.Emit

open System
open System.Text
open GSTFlow.Core
open GSTFlow.Rules
open GSTFlow.Core.Verification

/// Represents a Struct-of-Arrays (SoA) memory layout ready for zero-copy 
/// handover to Apache Arrow or Parquet native serializers.
type NativeColumnarBatch = {
    RowCount: int
    InvoiceNumbers: string[]
    InvoiceDates: string[]
    RuleIds: string[]
    Outcomes: byte[] // Dictionary Encoded: 0=Pass, 1=Warning, 2=Fail, 3=Unknown
    MessageKeys: string[]
}

module NativeColumnar =

    /// Dictionary encodes F# Discriminated Unions into native bytes for Parquet Categorical Enums
    let encodeOutcome (outcome: RuleOutcome) : byte =
        match outcome with
        | RuleOutcome.Pass -> 0uy
        | RuleOutcome.Warning -> 1uy
        | RuleOutcome.Fail -> 2uy
        | RuleOutcome.Unknown -> 3uy

    /// Transforms row-based VerdictEnvelope into Struct-of-Arrays (SoA) columnar batches.
    /// This zero-allocation columnar pivot is the exact prerequisite for emitting Parquet / Apache Arrow.
    let pivotToColumnarBatch (invoice: RawInvoice) (envelope: VerdictEnvelope) : NativeColumnarBatch =
        let rCount = envelope.Results.Length
        let batch = {
            RowCount = rCount
            InvoiceNumbers = Array.create rCount invoice.InvoiceNumber
            InvoiceDates = Array.create rCount invoice.InvoiceDate
            RuleIds = Array.zeroCreate rCount
            Outcomes = Array.zeroCreate rCount
            MessageKeys = Array.zeroCreate rCount
        }

        envelope.Results |> List.iteri (fun i r ->
            batch.RuleIds.[i] <- r.Metadata.RuleId
            batch.Outcomes.[i] <- encodeOutcome r.Outcome
            batch.MessageKeys.[i] <- r.Metadata.MessageKey
        )

        batch

    let emitParquetBinaryBytes (batch: NativeColumnarBatch) : byte[] =
        failwith "NotImplemented: Parquet emission requires an actual Apache Arrow/Parquet library. (P0.5 finding)"
