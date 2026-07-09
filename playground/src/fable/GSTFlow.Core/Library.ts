
import { isLetter, isDigit } from "../fable_modules/fable-library-ts.5.6.0/Char.ts";
import { IComparable, IEquatable, Exception } from "../fable_modules/fable-library-ts.5.6.0/Util.ts";
import { int32 } from "../fable_modules/fable-library-ts.5.6.0/Int32.ts";
import { mapIndexed, sum as sum_1 } from "../fable_modules/fable-library-ts.5.6.0/Array.ts";
import { create, isMatch } from "../fable_modules/fable-library-ts.5.6.0/RegExp.ts";
import { substring } from "../fable_modules/fable-library-ts.5.6.0/String.ts";
import { Record, Union } from "../fable_modules/fable-library-ts.5.6.0/Types.ts";
import { bool_type, list_type, option_type, decimal_type, record_type, union_type, string_type, TypeInfo } from "../fable_modules/fable-library-ts.5.6.0/Reflection.ts";
import { FSharpResult$2_$union, FSharpResult$2_Error$, FSharpResult$2_Ok } from "../fable_modules/fable-library-ts.5.6.0/Result.ts";
import { decimal } from "../fable_modules/fable-library-ts.5.6.0/Decimal.ts";
import { Option } from "../fable_modules/fable-library-ts.5.6.0/Option.ts";
import { FSharpList } from "../fable_modules/fable-library-ts.5.6.0/List.ts";

export function GstinValidation_charToValue(c: string): int32 {
    if (isDigit(c)) {
        return (~~c.charCodeAt(0) - ~~"0".charCodeAt(0)) | 0;
    }
    else if (isLetter(c)) {
        return ((~~c.toLocaleUpperCase().charCodeAt(0) - ~~"A".charCodeAt(0)) + 10) | 0;
    }
    else {
        throw new Exception("Invalid character");
    }
}

export function GstinValidation_valueToChar(v: int32): string {
    if (v < 10) {
        return String.fromCharCode((v + ~~"0".charCodeAt(0)) & 0xFFFF);
    }
    else {
        return String.fromCharCode(((v - 10) + ~~"A".charCodeAt(0)) & 0xFFFF);
    }
}

export function GstinValidation_calculateCheckDigit(gstinWithoutCheck: string): string {
    const remainder: int32 = (sum_1<int32>(mapIndexed<string, int32>((i: int32, c: string): int32 => {
        const product: int32 = (GstinValidation_charToValue(c) * (((i % 2) === 0) ? 1 : 2)) | 0;
        return (~~(product / 36) + (product % 36)) | 0;
    }, gstinWithoutCheck.split(""), Int32Array), {
        GetZero: (): int32 => 0,
        Add: (x: int32, y: int32): int32 => ((x + y) | 0),
    }) % 36) | 0;
    return GstinValidation_valueToChar((remainder === 0) ? 0 : (36 - remainder));
}

export function GstinValidation_isValid(gstin: string): boolean {
    if (gstin.length !== 15) {
        return false;
    }
    else if (!isMatch(create("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"), gstin)) {
        return false;
    }
    else {
        try {
            return GstinValidation_calculateCheckDigit(substring(gstin, 0, 14)) === gstin[14];
        }
        catch (matchValue: any) {
            return false;
        }
    }
}

export class GSTIN extends Union<0, "GSTIN"> {
    constructor(Item: string) {
        super();
        this.tag = 0;
        this.fields = [Item];
    }
    readonly tag: 0;
    readonly fields: [string];
    cases() {
        return ["GSTIN"];
    }
}

export function GSTIN_$reflection(): TypeInfo {
    return union_type("GSTFlow.Core.GSTIN", [], GSTIN, () => [[["Item", string_type]]]);
}

export function GSTINModule_create(str: string): FSharpResult$2_$union<GSTIN, string> {
    if (GstinValidation_isValid(str)) {
        return FSharpResult$2_Ok<GSTIN, string>(new GSTIN(str));
    }
    else {
        return FSharpResult$2_Error$<GSTIN, string>("Invalid GSTIN format or checksum");
    }
}

export function GSTINModule_value(_arg: GSTIN): string {
    return _arg.fields[0] as string;
}

export class Party extends Record implements IEquatable<Party>, IComparable<Party> {
    readonly Gstin: GSTIN;
    readonly StateCode: string;
    constructor(Gstin: GSTIN, StateCode: string) {
        super();
        this.Gstin = Gstin;
        this.StateCode = StateCode;
    }
}

export function Party_$reflection(): TypeInfo {
    return record_type("GSTFlow.Core.Party", [], Party, () => [["Gstin", GSTIN_$reflection()], ["StateCode", string_type]]);
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

