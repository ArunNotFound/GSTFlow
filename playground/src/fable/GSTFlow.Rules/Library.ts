
import { Record } from "../fable_modules/fable-library-ts.5.6.0/Types.ts";
import { Exception, IComparable, IEquatable } from "../fable_modules/fable-library-ts.5.6.0/Util.ts";
import { bool_type, list_type, option_type, decimal_type, record_type, string_type, TypeInfo } from "../fable_modules/fable-library-ts.5.6.0/Reflection.ts";
import { equals, compare, fromParts, op_Division, op_Multiply, round, decimal } from "../fable_modules/fable-library-ts.5.6.0/Decimal.ts";
import { Invoice, InvoiceItem, SupplyType_$union, SupplyType_B2B, SupplyType_B2C, Party, GSTIN, GSTINModule_create, GSTCanonicalIR_$reflection, GSTCanonicalIR, TaxAmount_$reflection, TaxAmount } from "../GSTFlow.Core/Library.ts";
import { value, Option } from "../fable_modules/fable-library-ts.5.6.0/Option.ts";
import { map, exists, append, collect, length, cons, empty, FSharpList } from "../fable_modules/fable-library-ts.5.6.0/List.ts";
import { FSharpResult$2_Ok, FSharpResult$2_Error$, FSharpResult$2_$union } from "../fable_modules/fable-library-ts.5.6.0/Result.ts";
import { int32 } from "../fable_modules/fable-library-ts.5.6.0/Int32.ts";
import { printf, toText } from "../fable_modules/fable-library-ts.5.6.0/String.ts";

export class RawParty extends Record implements IEquatable<RawParty>, IComparable<RawParty> {
    readonly Gstin: string;
    readonly StateCode: string;
    constructor(Gstin: string, StateCode: string) {
        super();
        this.Gstin = Gstin;
        this.StateCode = StateCode;
    }
}

export function RawParty_$reflection(): TypeInfo {
    return record_type("GSTFlow.Rules.RawParty", [], RawParty, () => [["Gstin", string_type], ["StateCode", string_type]]);
}

export class RawInvoiceItem extends Record implements IEquatable<RawInvoiceItem>, IComparable<RawInvoiceItem> {
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

export function RawInvoiceItem_$reflection(): TypeInfo {
    return record_type("GSTFlow.Rules.RawInvoiceItem", [], RawInvoiceItem, () => [["Hsn", string_type], ["TaxableValue", decimal_type], ["GstRate", decimal_type], ["Tax", TaxAmount_$reflection()]]);
}

export class RawInvoice extends Record implements IEquatable<RawInvoice>, IComparable<RawInvoice> {
    readonly InvoiceNumber: string;
    readonly InvoiceDate: string;
    readonly Seller: RawParty;
    readonly Buyer: Option<RawParty>;
    readonly Items: FSharpList<RawInvoiceItem>;
    constructor(InvoiceNumber: string, InvoiceDate: string, Seller: RawParty, Buyer: Option<RawParty>, Items: FSharpList<RawInvoiceItem>) {
        super();
        this.InvoiceNumber = InvoiceNumber;
        this.InvoiceDate = InvoiceDate;
        this.Seller = Seller;
        this.Buyer = Buyer;
        this.Items = Items;
    }
}

export function RawInvoice_$reflection(): TypeInfo {
    return record_type("GSTFlow.Rules.RawInvoice", [], RawInvoice, () => [["InvoiceNumber", string_type], ["InvoiceDate", string_type], ["Seller", RawParty_$reflection()], ["Buyer", option_type(RawParty_$reflection())], ["Items", list_type(RawInvoiceItem_$reflection())]]);
}

export class RuleViolation extends Record implements IEquatable<RuleViolation>, IComparable<RuleViolation> {
    readonly Rule: string;
    readonly Description: string;
    readonly IsError: boolean;
    constructor(Rule: string, Description: string, IsError: boolean) {
        super();
        this.Rule = Rule;
        this.Description = Description;
        this.IsError = IsError;
    }
}

export function RuleViolation_$reflection(): TypeInfo {
    return record_type("GSTFlow.Rules.RuleViolation", [], RuleViolation, () => [["Rule", string_type], ["Description", string_type], ["IsError", bool_type]]);
}

export class CompilationResult extends Record implements IEquatable<CompilationResult>, IComparable<CompilationResult> {
    readonly IR: Option<GSTCanonicalIR>;
    readonly Violations: FSharpList<RuleViolation>;
    constructor(IR: Option<GSTCanonicalIR>, Violations: FSharpList<RuleViolation>) {
        super();
        this.IR = IR;
        this.Violations = Violations;
    }
}

export function CompilationResult_$reflection(): TypeInfo {
    return record_type("GSTFlow.Rules.CompilationResult", [], CompilationResult, () => [["IR", option_type(GSTCanonicalIR_$reflection())], ["Violations", list_type(RuleViolation_$reflection())]]);
}

function Compiler_validateGstin(raw: RawParty, role: string): FSharpResult$2_$union<Party, RuleViolation> {
    const matchValue: FSharpResult$2_$union<GSTIN, string> = GSTINModule_create(raw.Gstin);
    if ((matchValue.tag as int32) === /* Error */ 1) {
        const e = matchValue.fields[0] as string;
        return FSharpResult$2_Error$<Party, RuleViolation>(new RuleViolation("GSTIN_FORMAT", toText(printf("%s GSTIN \'%s\' is invalid: %s"))(role)(raw.Gstin)(e), true));
    }
    else {
        return FSharpResult$2_Ok<Party, RuleViolation>(new Party(matchValue.fields[0] as GSTIN, raw.StateCode));
    }
}

function Compiler_validateTaxes(isInterstate: boolean, item: RawInvoiceItem): FSharpList<RuleViolation> {
    const expectedTax: decimal = round(op_Multiply(item.TaxableValue, op_Division(item.GstRate, fromParts(100, 0, 0, false, 0))), 2);
    let violations: FSharpList<RuleViolation> = empty<RuleViolation>();
    if (isInterstate) {
        if ((compare(item.Tax.Cgst, fromParts(0, 0, 0, false, 0)) > 0) ? true : (compare(item.Tax.Sgst, fromParts(0, 0, 0, false, 0)) > 0)) {
            violations = cons(new RuleViolation("IGST_CGST_LAW", "Interstate supply cannot have CGST or SGST", true), violations);
        }
        if (!equals(item.Tax.Igst, expectedTax)) {
            violations = cons(new RuleViolation("TAX_AMOUNT", toText(printf("Expected IGST %M but got %M"))(expectedTax)(item.Tax.Igst), true), violations);
        }
    }
    else {
        if (compare(item.Tax.Igst, fromParts(0, 0, 0, false, 0)) > 0) {
            violations = cons(new RuleViolation("IGST_CGST_LAW", "Intrastate supply cannot have IGST", true), violations);
        }
        const expectedSplit: decimal = round(op_Division(expectedTax, fromParts(2, 0, 0, false, 0)), 2);
        if (!equals(item.Tax.Cgst, expectedSplit) ? true : !equals(item.Tax.Sgst, expectedSplit)) {
            violations = cons(new RuleViolation("TAX_AMOUNT", toText(printf("Expected CGST/SGST %M but got C:%M S:%M"))(expectedSplit)(item.Tax.Cgst)(item.Tax.Sgst), true), violations);
        }
    }
    return violations;
}

export function Compiler_compile(raw: RawInvoice): CompilationResult {
    let copyOfStruct: FSharpResult$2_$union<Party, RuleViolation> = (undefined as any), b_1: Party = (undefined as any);
    let violations: FSharpList<RuleViolation> = empty<RuleViolation>();
    const sellerRes: FSharpResult$2_$union<Party, RuleViolation> = Compiler_validateGstin(raw.Seller, "Seller");
    if ((sellerRes.tag as int32) === /* Error */ 1) {
        const e = sellerRes.fields[0] as RuleViolation;
        violations = cons(e, violations);
    }
    let buyerRes: Option<FSharpResult$2_$union<Party, RuleViolation>>;
    const matchValue: Option<RawParty> = raw.Buyer;
    if (matchValue == null) {
        buyerRes = undefined;
    }
    else {
        const matchValue_1: FSharpResult$2_$union<Party, RuleViolation> = Compiler_validateGstin(value(matchValue), "Buyer");
        if ((matchValue_1.tag as int32) === /* Error */ 1) {
            const e_1 = matchValue_1.fields[0] as RuleViolation;
            violations = cons(e_1, violations);
            buyerRes = FSharpResult$2_Error$<Party, RuleViolation>(e_1);
        }
        else {
            buyerRes = FSharpResult$2_Ok<Party, RuleViolation>(matchValue_1.fields[0] as Party);
        }
    }
    if (length(violations) > 0) {
        return new CompilationResult(undefined, violations);
    }
    else {
        let seller: Party;
        if ((sellerRes.tag as int32) === /* Ok */ 0) {
            seller = (sellerRes.fields[0] as Party);
        }
        else {
            throw new Exception("unreachable");
        }
        const buyer: Option<Party> = (buyerRes != null) ? ((copyOfStruct = value(buyerRes), ((copyOfStruct.tag as int32) === /* Ok */ 0) ? ((b_1 = (copyOfStruct.fields[0] as Party), b_1)) : undefined)) : undefined;
        const pos: string = (buyer == null) ? seller.StateCode : value(buyer).StateCode;
        const isInterstate: boolean = seller.StateCode !== pos;
        const supplyType: SupplyType_$union = (buyer == null) ? SupplyType_B2C() : SupplyType_B2B();
        const itemViolations: FSharpList<RuleViolation> = collect<RawInvoiceItem, RuleViolation>((item: RawInvoiceItem): FSharpList<RuleViolation> => Compiler_validateTaxes(isInterstate, item), raw.Items);
        violations = append(itemViolations, violations);
        if (exists<RuleViolation>((v: RuleViolation): boolean => v.IsError, violations)) {
            return new CompilationResult(undefined, violations);
        }
        else {
            return new CompilationResult(new GSTCanonicalIR(new Invoice(raw.InvoiceNumber, raw.InvoiceDate, seller, buyer, map<RawInvoiceItem, InvoiceItem>((i: RawInvoiceItem): InvoiceItem => (new InvoiceItem(i.Hsn, i.TaxableValue, i.GstRate, i.Tax)), raw.Items)), supplyType, pos, isInterstate), empty<RuleViolation>());
        }
    }
}

