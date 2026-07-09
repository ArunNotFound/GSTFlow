
import { value, Option } from "../fable_modules/fable-library-ts.5.6.0/Option.ts";
import { Invoice, GSTCanonicalIR, SupplyType_B2B, SupplyType_B2C, Party } from "../GSTFlow.Core/Library.ts";

export function normalize(invoice: Invoice): GSTCanonicalIR {
    let pos: string;
    const matchValue: Option<Party> = invoice.Buyer;
    pos = ((matchValue == null) ? invoice.Seller.StateCode : value(matchValue).StateCode);
    const isInterstate: boolean = invoice.Seller.StateCode !== pos;
    return new GSTCanonicalIR(invoice, (invoice.Buyer == null) ? SupplyType_B2C() : SupplyType_B2B(), pos, isInterstate);
}

