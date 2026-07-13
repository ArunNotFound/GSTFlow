
import { newGuid } from "./fable_modules/fable-library-js.5.6.0/Guid.js";
import { add } from "./fable_modules/fable-library-js.5.6.0/Map.js";
import { Auto_generateBoxedEncoder_437914C6, toString, decimal } from "./fable_modules/Thoth.Json.10.5.1/Encode.fs.js";
import { Auto_generateBoxedDecoder_Z6670B51, fromString, decimal as decimal_1 } from "./fable_modules/Thoth.Json.10.5.1/Decode.fs.js";
import { empty } from "./fable_modules/Thoth.Json.10.5.1/Extra.fs.js";
import { ExtraCoders } from "./fable_modules/Thoth.Json.10.5.1/Types.fs.js";
import { equals, defaultOf, uncurry2 } from "./fable_modules/fable-library-js.5.6.0/Util.js";
import { Compiler_compile, RawInvoice_$reflection } from "./GSTFlow.Rules/Library.js";
import { Verification_RuleOutcome, Verification_VerdictEnvelope_$reflection } from "./GSTFlow.Core/Library.js";
import { filter, map, toArray } from "./fable_modules/fable-library-js.5.6.0/List.js";
import { emitValidationReport, emitSummaryJson } from "./GSTFlow.Emit/Library.js";

export function compileInvoice(jsonString, hash) {
    let copyOfStruct, summary_2, proof_2, summary_1, proof_1, success;
    const extra_3 = new ExtraCoders((copyOfStruct = newGuid(), copyOfStruct), add("System.Decimal", [decimal, (path) => ((value_1) => decimal_1(path, value_1))], empty.Coders));
    const decodeInvoice = fromString(uncurry2(Auto_generateBoxedDecoder_Z6670B51(RawInvoice_$reflection(), undefined, extra_3)), jsonString);
    if (decodeInvoice.tag === 1) {
        return (summary_2 = defaultOf(), (proof_2 = defaultOf(), {
            envelope: defaultOf(),
            error: decodeInvoice.fields[0],
            proof: proof_2,
            success: false,
            summary: summary_2,
            violations: [],
        }));
    }
    else {
        const result = Compiler_compile(decodeInvoice.fields[0], hash);
        const serializeEnv = (env) => toString(0, Auto_generateBoxedEncoder_437914C6(Verification_VerdictEnvelope_$reflection(), undefined, extra_3, undefined)(env));
        const violations = toArray(map((r_1) => ({
            Description: r_1.Metadata.MessageKey,
            Rule: r_1.Metadata.RuleId,
        }), filter((r) => equals(r.Outcome, new Verification_RuleOutcome(2, [])), result.Envelope.Results)));
        const matchValue = result.IR;
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
            const ir = matchValue;
            const summary = emitSummaryJson(ir);
            const proof = emitValidationReport(ir);
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

