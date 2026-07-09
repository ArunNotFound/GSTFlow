
import { Auto_generateBoxedDecoder_Z6670B51, fromString } from "./fable_modules/Thoth.Json.10.5.1/Decode.fs.js";
import { defaultOf, uncurry2 } from "./fable_modules/fable-library-ts.5.6.0/Util.ts";
import { GSTCanonicalIR, Invoice, Invoice_$reflection } from "./GSTFlow.Core/Library.ts";
import { FSharpResult$2_$union } from "./fable_modules/fable-library-ts.5.6.0/Result.ts";
import { int32 } from "./fable_modules/fable-library-ts.5.6.0/Int32.ts";
import { normalize } from "./GSTFlow.Rules/Library.ts";
import { emitProofReport, emitGstr1Json } from "./GSTFlow.Emit/Library.ts";

export function compileInvoice(jsonString: string): any {
    const decodeInvoice: FSharpResult$2_$union<Invoice, string> = fromString<Invoice>(uncurry2(Auto_generateBoxedDecoder_Z6670B51(Invoice_$reflection(), undefined, undefined)), jsonString);
    if ((decodeInvoice.tag as int32) === /* Error */ 1) {
        return {
            error: decodeInvoice.fields[0] as string,
            gstr1: defaultOf(),
            proof: defaultOf(),
            success: false,
        };
    }
    else {
        const ir: GSTCanonicalIR = normalize(decodeInvoice.fields[0] as Invoice);
        const gstr1: string = emitGstr1Json(ir);
        const proof: string = emitProofReport(ir);
        return {
            error: defaultOf(),
            gstr1: gstr1,
            proof: proof,
            success: true,
        };
    }
}

