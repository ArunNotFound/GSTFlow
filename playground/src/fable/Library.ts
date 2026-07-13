
import { newGuid } from "./fable_modules/fable-library-ts.5.6.0/Guid.ts";
import { add } from "./fable_modules/fable-library-ts.5.6.0/Map.ts";
import { Auto_generateBoxedEncoder_437914C6, toString, decimal } from "./fable_modules/Thoth.Json.10.5.1/Encode.fs.js";
import { decimal as decimal_1 } from "./fable_modules/fable-library-ts.5.6.0/Decimal.ts";
import { Auto_generateBoxedDecoder_Z6670B51, fromString, decimal as decimal_2 } from "./fable_modules/Thoth.Json.10.5.1/Decode.fs.js";
import { FSharpResult$2_$union } from "./fable_modules/fable-library-ts.5.6.0/Result.ts";
import { ExtraCoders, ErrorReason_$union } from "./fable_modules/Thoth.Json.10.5.1/Types.fs.js";
import { empty } from "./fable_modules/Thoth.Json.10.5.1/Extra.fs.js";
import { MutableArray, equals, defaultOf, uncurry2 } from "./fable_modules/fable-library-ts.5.6.0/Util.ts";
import { CompilationResult, Compiler_compile, RawInvoice, RawInvoice_$reflection } from "./GSTFlow.Rules/Library.ts";
import { int32 } from "./fable_modules/fable-library-ts.5.6.0/Int32.ts";
import { GSTCanonicalIR, Verification_RuleOutcome_Fail, Verification_RuleResult, Verification_VerdictEnvelope, Verification_VerdictEnvelope_$reflection } from "./GSTFlow.Core/Library.ts";
import { filter, map, toArray } from "./fable_modules/fable-library-ts.5.6.0/List.ts";
import { value as value_7, Option } from "./fable_modules/fable-library-ts.5.6.0/Option.ts";
import { emitValidationReport, emitSummaryJson } from "./GSTFlow.Emit/Library.ts";

export function compileInvoice(jsonString: string): any {
    let copyOfStruct: string = (undefined as any), summary_2: any = (undefined as any), proof_2: any = (undefined as any), summary_1: any = (undefined as any), proof_1: any = (undefined as any), success: boolean = (undefined as any);
    const extra_3: ExtraCoders = new ExtraCoders((copyOfStruct = newGuid(), copyOfStruct), add<string, [((arg0: any) => any), ((arg0: string) => ((arg0: any) => FSharpResult$2_$union<any, [string, ErrorReason_$union]>))]>("System.Decimal", [decimal, (path: string): ((arg0: any) => FSharpResult$2_$union<decimal_1, [string, ErrorReason_$union]>) => ((value_1: any): FSharpResult$2_$union<decimal_1, [string, ErrorReason_$union]> => decimal_2(path, value_1))] as [((arg0: any) => any), ((arg0: string) => ((arg0: any) => FSharpResult$2_$union<any, [string, ErrorReason_$union]>))], empty.Coders));
    const decodeInvoice: FSharpResult$2_$union<RawInvoice, string> = fromString<RawInvoice>(uncurry2(Auto_generateBoxedDecoder_Z6670B51(RawInvoice_$reflection(), undefined, extra_3)), jsonString);
    if ((decodeInvoice.tag as int32) === /* Error */ 1) {
        const err = decodeInvoice.fields[0] as string;
        return (summary_2 = defaultOf(), (proof_2 = defaultOf(), {
            envelope: defaultOf(),
            error: err,
            proof: proof_2,
            success: false,
            summary: summary_2,
            violations: [],
        }));
    }
    else {
        const result: CompilationResult = Compiler_compile(decodeInvoice.fields[0] as RawInvoice, "hash_not_computed_in_wasm");
        const serializeEnv = (env: Verification_VerdictEnvelope): string => toString(0, Auto_generateBoxedEncoder_437914C6(Verification_VerdictEnvelope_$reflection(), undefined, extra_3, undefined)(env));
        const violations: MutableArray<{ Description: string, Rule: string }> = toArray<{ Description: string, Rule: string }>(map<Verification_RuleResult, { Description: string, Rule: string }>((r_1: Verification_RuleResult): { Description: string, Rule: string } => ({
            Description: r_1.Metadata.MessageKey,
            Rule: r_1.Metadata.RuleId,
        }), filter<Verification_RuleResult>((r: Verification_RuleResult): boolean => equals(r.Outcome, Verification_RuleOutcome_Fail()), result.Envelope.Results)));
        const matchValue: Option<GSTCanonicalIR> = result.IR;
        if (matchValue == null) {
            return (summary_1 = defaultOf(), (proof_1 = defaultOf(), {
                envelope: serializeEnv(result.Envelope),
                error: "Validation failed",
                proof: proof_1,
                success: false,
                summary: summary_1,
                violations: violations,
            }));
        }
        else {
            const ir: GSTCanonicalIR = value_7(matchValue);
            const summary: string = emitSummaryJson(ir);
            const proof: string = emitValidationReport(ir);
            return (success = (violations.length === 0), {
                envelope: serializeEnv(result.Envelope),
                error: defaultOf(),
                proof: proof,
                success: success,
                summary: summary,
                violations: violations,
            });
        }
    }
}

