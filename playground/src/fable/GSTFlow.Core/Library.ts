
import { Union, Record } from "../fable_modules/fable-library-ts.5.6.0/Types.ts";
import { IComparable, IEquatable } from "../fable_modules/fable-library-ts.5.6.0/Util.ts";
import { bool_type, list_type, option_type, decimal_type, union_type, record_type, string_type, TypeInfo } from "../fable_modules/fable-library-ts.5.6.0/Reflection.ts";
import { decimal } from "../fable_modules/fable-library-ts.5.6.0/Decimal.ts";
import { Option } from "../fable_modules/fable-library-ts.5.6.0/Option.ts";
import { FSharpList } from "../fable_modules/fable-library-ts.5.6.0/List.ts";

export class Party extends Record implements IEquatable<Party>, IComparable<Party> {
    readonly Gstin: string;
    readonly StateCode: string;
    constructor(Gstin: string, StateCode: string) {
        super();
        this.Gstin = Gstin;
        this.StateCode = StateCode;
    }
}

export function Party_$reflection(): TypeInfo {
    return record_type("GSTFlow.Core.Party", [], Party, () => [["Gstin", string_type], ["StateCode", string_type]]);
}

export type SupplyType_$union = 
    | SupplyType<0>
    | SupplyType<1>

export type SupplyType_$cases = {
    0: ["B2B", []],
    1: ["B2C", []]
}

export function SupplyType_B2B() {
    return new SupplyType<0>(0, []);
}

export function SupplyType_B2C() {
    return new SupplyType<1>(1, []);
}

export class SupplyType<Tag extends keyof SupplyType_$cases> extends Union<Tag, SupplyType_$cases[Tag][0]> {
    constructor(tag: Tag, fields: SupplyType_$cases[Tag][1]) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    readonly tag: Tag;
    readonly fields: SupplyType_$cases[Tag][1];
    cases() {
        return ["B2B", "B2C"];
    }
}

export function SupplyType_$reflection(): TypeInfo {
    return union_type("GSTFlow.Core.SupplyType", [], SupplyType, () => [[], []]);
}

export class TaxAmount extends Record implements IEquatable<TaxAmount>, IComparable<TaxAmount> {
    readonly Igst: decimal;
    readonly Cgst: decimal;
    readonly Sgst: decimal;
    constructor(Igst: decimal, Cgst: decimal, Sgst: decimal) {
        super();
        this.Igst = Igst;
        this.Cgst = Cgst;
        this.Sgst = Sgst;
    }
}

export function TaxAmount_$reflection(): TypeInfo {
    return record_type("GSTFlow.Core.TaxAmount", [], TaxAmount, () => [["Igst", decimal_type], ["Cgst", decimal_type], ["Sgst", decimal_type]]);
}

export class InvoiceItem extends Record implements IEquatable<InvoiceItem>, IComparable<InvoiceItem> {
    readonly Hsn: string;
    readonly TaxableValue: decimal;
    readonly GstRate: decimal;
    readonly Tax: TaxAmount;
    constructor(Hsn: string, TaxableValue: decimal, GstRate: decimal, Tax: TaxAmount) {
        super();
        this.Hsn = Hsn;
        this.TaxableValue = TaxableValue;
        this.GstRate = GstRate;
        this.Tax = Tax;
    }
}

export function InvoiceItem_$reflection(): TypeInfo {
    return record_type("GSTFlow.Core.InvoiceItem", [], InvoiceItem, () => [["Hsn", string_type], ["TaxableValue", decimal_type], ["GstRate", decimal_type], ["Tax", TaxAmount_$reflection()]]);
}

export class Invoice extends Record implements IEquatable<Invoice>, IComparable<Invoice> {
    readonly InvoiceNumber: string;
    readonly InvoiceDate: string;
    readonly Seller: Party;
    readonly Buyer: Option<Party>;
    readonly Items: FSharpList<InvoiceItem>;
    constructor(InvoiceNumber: string, InvoiceDate: string, Seller: Party, Buyer: Option<Party>, Items: FSharpList<InvoiceItem>) {
        super();
        this.InvoiceNumber = InvoiceNumber;
        this.InvoiceDate = InvoiceDate;
        this.Seller = Seller;
        this.Buyer = Buyer;
        this.Items = Items;
    }
}

export function Invoice_$reflection(): TypeInfo {
    return record_type("GSTFlow.Core.Invoice", [], Invoice, () => [["InvoiceNumber", string_type], ["InvoiceDate", string_type], ["Seller", Party_$reflection()], ["Buyer", option_type(Party_$reflection())], ["Items", list_type(InvoiceItem_$reflection())]]);
}

export class GSTCanonicalIR extends Record implements IEquatable<GSTCanonicalIR>, IComparable<GSTCanonicalIR> {
    readonly Invoice: Invoice;
    readonly DerivedSupplyType: SupplyType_$union;
    readonly PlaceOfSupply: string;
    readonly IsInterstate: boolean;
    constructor(Invoice: Invoice, DerivedSupplyType: SupplyType_$union, PlaceOfSupply: string, IsInterstate: boolean) {
        super();
        this.Invoice = Invoice;
        this.DerivedSupplyType = DerivedSupplyType;
        this.PlaceOfSupply = PlaceOfSupply;
        this.IsInterstate = IsInterstate;
    }
}

export function GSTCanonicalIR_$reflection(): TypeInfo {
    return record_type("GSTFlow.Core.GSTCanonicalIR", [], GSTCanonicalIR, () => [["Invoice", Invoice_$reflection()], ["DerivedSupplyType", SupplyType_$reflection()], ["PlaceOfSupply", string_type], ["IsInterstate", bool_type]]);
}

