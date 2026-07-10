namespace GSTFlow.Emit

open System
open Thoth.Json.Net
open GSTFlow.Rules

module CanonicalJson =

    let encodeRuleOutcome (outcome: RuleOutcome) =
        match outcome with
        | Pass -> Encode.string "Pass"
        | Warning -> Encode.string "Warning"
        | Unknown -> Encode.string "Unknown"
        | NotSupported -> Encode.string "NotSupported"
        | Fail -> Encode.string "Fail"

    let encodeRuleResult (r: RuleResult) =
        Encode.object [
            "RuleId", Encode.string r.RuleId
            "Outcome", encodeRuleOutcome r.Outcome
            "MessageKey", Encode.string r.MessageKey
            "Evidence", (match r.Evidence with | Some v -> Encode.string v | None -> Encode.nil)
            "Source", Encode.string r.Source
            "RegulationReference", (match r.RegulationReference with | Some v -> Encode.string v | None -> Encode.nil)
        ]

    let encodeVerdictEnvelope (env: VerdictEnvelope) =
        Encode.object [
            "SchemaVersion", Encode.string env.SchemaVersion
            "EngineVersion", Encode.string env.EngineVersion
            "RuleSetVersion", Encode.string env.RuleSetVersion
            "InvoiceHash", Encode.string env.InvoiceHash
            "Results", Encode.list (env.Results |> List.map encodeRuleResult)
            "OverallOutcome", encodeRuleOutcome env.OverallOutcome
        ]

    let serializeEnvelope (env: VerdictEnvelope) =
        // H6: Canonical JSON - No locale, UTF-8, spaces 2, explicit nulls
        // Thoth.Json.Net natively maintains property insertion order 
        // and stringifies decimals securely without locale issues.
        Encode.toString 2 (encodeVerdictEnvelope env)
