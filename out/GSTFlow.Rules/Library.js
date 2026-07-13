
import { Record } from "../fable_modules/fable-library-js.5.6.0/Types.js";
import { list_type, decimal_type, record_type, option_type, bool_type, string_type } from "../fable_modules/fable-library-js.5.6.0/Reflection.js";
import { GSTCanonicalIR, Invoice, InvoiceItem, SupplyType, GSTINModule_value, Verification_VerdictEnvelope, DocumentType$, Party, GSTINModule_create, Verification_RuleOutcome, Verification_RuleResult, Verification_Evidence, Verification_EvidenceKind, Verification_RuleMetadata, Verification_RuleConfidence, Verification_VerdictEnvelope_$reflection, GSTCanonicalIR_$reflection, TaxAmount_$reflection } from "../GSTFlow.Core/Library.js";
import { map as map_1, max, sumBy, collect, length, isEmpty, cons, empty as empty_1, exists, ofArray, append, singleton } from "../fable_modules/fable-library-js.5.6.0/List.js";
import { empty } from "../fable_modules/fable-library-js.5.6.0/Map.js";
import { compare as compare_1, equals, Exception, disposeSafe, getEnumerator, comparePrimitives } from "../fable_modules/fable-library-js.5.6.0/Util.js";
import { FSharpSet__Contains, ofList } from "../fable_modules/fable-library-js.5.6.0/Set.js";
import { map, delay, toList } from "../fable_modules/fable-library-js.5.6.0/Seq.js";
import { isNullOrWhiteSpace, substring, printf, toText } from "../fable_modules/fable-library-js.5.6.0/String.js";
import { rangeDouble } from "../fable_modules/fable-library-js.5.6.0/Range.js";
import { op_Modulus, equals as equals_1, op_Addition, op_Subtraction, abs, op_Division, op_Multiply, round, compare, fromParts } from "../fable_modules/fable-library-js.5.6.0/Decimal.js";
import Decimal from "../fable_modules/fable-library-js.5.6.0/Decimal.js";
import { isMatch } from "../fable_modules/fable-library-js.5.6.0/RegExp.js";
import { FSharpResult$2 } from "../fable_modules/fable-library-js.5.6.0/Result.js";

export class RawParty extends Record {
    constructor(Gstin, StateCode, IsSez) {
        super();
        this.Gstin = Gstin;
        this.StateCode = StateCode;
        this.IsSez = IsSez;
    }
}

export function RawParty_$reflection() {
    return record_type("GSTFlow.Rules.RawParty", [], RawParty, () => [["Gstin", string_type], ["StateCode", string_type], ["IsSez", option_type(bool_type)]]);
}

export class RawInvoiceItem extends Record {
    constructor(Hsn, TaxableValue, GstRate, CessRate, Tax) {
        super();
        this.Hsn = Hsn;
        this.TaxableValue = TaxableValue;
        this.GstRate = GstRate;
        this.CessRate = CessRate;
        this.Tax = Tax;
    }
}

export function RawInvoiceItem_$reflection() {
    return record_type("GSTFlow.Rules.RawInvoiceItem", [], RawInvoiceItem, () => [["Hsn", string_type], ["TaxableValue", decimal_type], ["GstRate", decimal_type], ["CessRate", option_type(decimal_type)], ["Tax", TaxAmount_$reflection()]]);
}

export class RawInvoice extends Record {
    constructor(DocumentType$, InvoiceNumber, InvoiceDate, PlaceOfSupply, OriginalInvoiceNumber, OriginalInvoiceDate, Irn, ReverseCharge, Seller, Buyer, Items) {
        super();
        this.DocumentType = DocumentType$;
        this.InvoiceNumber = InvoiceNumber;
        this.InvoiceDate = InvoiceDate;
        this.PlaceOfSupply = PlaceOfSupply;
        this.OriginalInvoiceNumber = OriginalInvoiceNumber;
        this.OriginalInvoiceDate = OriginalInvoiceDate;
        this.Irn = Irn;
        this.ReverseCharge = ReverseCharge;
        this.Seller = Seller;
        this.Buyer = Buyer;
        this.Items = Items;
    }
}

export function RawInvoice_$reflection() {
    return record_type("GSTFlow.Rules.RawInvoice", [], RawInvoice, () => [["DocumentType", option_type(string_type)], ["InvoiceNumber", string_type], ["InvoiceDate", string_type], ["PlaceOfSupply", option_type(string_type)], ["OriginalInvoiceNumber", option_type(string_type)], ["OriginalInvoiceDate", option_type(string_type)], ["Irn", option_type(string_type)], ["ReverseCharge", option_type(string_type)], ["Seller", RawParty_$reflection()], ["Buyer", option_type(RawParty_$reflection())], ["Items", list_type(RawInvoiceItem_$reflection())]]);
}

export class CompilationResult extends Record {
    constructor(IR, Envelope) {
        super();
        this.IR = IR;
        this.Envelope = Envelope;
    }
}

export function CompilationResult_$reflection() {
    return record_type("GSTFlow.Rules.CompilationResult", [], CompilationResult, () => [["IR", option_type(GSTCanonicalIR_$reflection())], ["Envelope", Verification_VerdictEnvelope_$reflection()]]);
}

function Compiler_createRule(outcome, id, _arg) {
    return new Verification_RuleResult(new Verification_RuleMetadata(id, "GST", undefined, undefined, undefined, new Verification_RuleConfidence(0, []), id), outcome, singleton(new Verification_Evidence("", new Verification_EvidenceKind(1, []), undefined, "Compiler")), empty({
        Compare: (x, y) => (comparePrimitives(x, y) | 0),
    }));
}

const Compiler_failRule = (id) => ((arg20$0040) => Compiler_createRule(new Verification_RuleOutcome(2, []), id, arg20$0040));

const Compiler_warnRule = (id) => ((arg20$0040) => Compiler_createRule(new Verification_RuleOutcome(1, []), id, arg20$0040));

const Compiler_unknownRule = (id) => ((arg20$0040) => Compiler_createRule(new Verification_RuleOutcome(3, []), id, arg20$0040));

export const Compiler_validStateCodes = ofList(append(toList(delay(() => map((i) => toText(printf("%02d"))(i), rangeDouble(1, 1, 38)))), ofArray(["97", "99"])), {
    Compare: (x, y) => (comparePrimitives(x, y) | 0),
});

export const Compiler_validRateSlabs = ofList(ofArray([fromParts(0, 0, 0, false, 0), fromParts(1, 0, 0, false, 1), fromParts(25, 0, 0, false, 2), fromParts(15, 0, 0, false, 1), fromParts(3, 0, 0, false, 0), fromParts(5, 0, 0, false, 0), fromParts(12, 0, 0, false, 0), fromParts(18, 0, 0, false, 0), fromParts(28, 0, 0, false, 0)]), {
    Compare: (x, y) => (compare(x, y) | 0),
});

export function Compiler_isValidHsn(hsn) {
    return isMatch(/^(\d{4}|\d{6}|\d{8})$/gu, hsn);
}

function Compiler_validateParty(role, raw) {
    let arg_2, matchValue_1;
    const matchValue = GSTINModule_create(raw.Gstin);
    if (matchValue.tag === 1) {
        return new FSharpResult$2(1, [Compiler_failRule("GSTIN_FORMAT")(toText(printf("%s GSTIN \'%s\' is invalid: %s"))(role)(raw.Gstin)(matchValue.fields[0]))]);
    }
    else if (substring(raw.Gstin, 0, 2) !== raw.StateCode) {
        return new FSharpResult$2(1, [Compiler_failRule("GSTIN_STATE_MATCH")((arg_2 = substring(raw.Gstin, 0, 2), toText(printf("%s StateCode \'%s\' does not match GSTIN prefix \'%s\'"))(role)(raw.StateCode)(arg_2)))]);
    }
    else {
        return new FSharpResult$2(0, [new Party(matchValue.fields[0], raw.StateCode, (matchValue_1 = raw.IsSez, (matchValue_1 == null) ? false : matchValue_1))]);
    }
}

function Compiler_isRcmHsn(hsn) {
    return exists((p) => hsn.startsWith(p), ofArray(["9965", "9967", "9973", "9982", "9983", "9985"]));
}

function Compiler_validateItem(isInterstate, isDocumentRcm, item) {
    let matchValue;
    let violations = empty_1();
    if (!Compiler_isValidHsn(item.Hsn)) {
        violations = cons(Compiler_failRule("HSN_FORMAT")(toText(printf("HSN \'%s\' must be exactly 4, 6, or 8 digits"))(item.Hsn)), violations);
    }
    if (!FSharpSet__Contains(Compiler_validRateSlabs, item.GstRate)) {
        violations = cons(Compiler_failRule("RATE_SLAB")(toText(printf("GST Rate %M is not a valid Indian slab (0, 0.1, 0.25, 1.5, 3, 5, 12, 18, 28)"))(item.GstRate)), violations);
    }
    const expectedTax = round(op_Multiply(item.TaxableValue, op_Division(item.GstRate, fromParts(100, 0, 0, false, 0))), 2);
    if (isDocumentRcm) {
        if ((((compare(item.Tax.Igst, fromParts(0, 0, 0, false, 0)) > 0) ? true : (compare(item.Tax.Cgst, fromParts(0, 0, 0, false, 0)) > 0)) ? true : (compare(item.Tax.Sgst, fromParts(0, 0, 0, false, 0)) > 0)) ? true : ((matchValue = item.Tax.Cess, (matchValue == null) ? false : (compare(matchValue, fromParts(0, 0, 0, false, 0)) > 0)))) {
            violations = cons(Compiler_failRule("RCM_TAX_CHARGED")("Invoice is marked for Reverse Charge (RCM). Seller cannot collect tax; tax amounts must be 0."), violations);
        }
    }
    else {
        if (Compiler_isRcmHsn(item.Hsn)) {
            violations = cons(Compiler_unknownRule("RCM_LAW_UNKNOWN")(toText(printf("HSN \'%s\' may fall under Reverse Charge, but applicability cannot be safely inferred without supplier and recipient context."))(item.Hsn)), violations);
        }
        if (isInterstate) {
            if ((compare(item.Tax.Cgst, fromParts(0, 0, 0, false, 0)) > 0) ? true : (compare(item.Tax.Sgst, fromParts(0, 0, 0, false, 0)) > 0)) {
                violations = cons(Compiler_failRule("IGST_CGST_LAW")("Interstate supply cannot have CGST or SGST"), violations);
            }
            if (compare(abs(op_Subtraction(item.Tax.Igst, expectedTax)), fromParts(5, 0, 0, false, 1)) > 0) {
                violations = cons(Compiler_failRule("TAX_AMOUNT")(toText(printf("Expected IGST approx %M but got %M (failed Sec 170 / item math)"))(expectedTax)(item.Tax.Igst)), violations);
            }
        }
        else {
            if (compare(item.Tax.Igst, fromParts(0, 0, 0, false, 0)) > 0) {
                violations = cons(Compiler_failRule("IGST_CGST_LAW")("Intrastate supply cannot have IGST"), violations);
            }
            const expectedSplit = round(op_Division(expectedTax, fromParts(2, 0, 0, false, 0)), 2);
            if ((compare(abs(op_Subtraction(item.Tax.Cgst, expectedSplit)), fromParts(5, 0, 0, false, 1)) > 0) ? true : (compare(abs(op_Subtraction(item.Tax.Sgst, expectedSplit)), fromParts(5, 0, 0, false, 1)) > 0)) {
                violations = cons(Compiler_failRule("TAX_AMOUNT")(toText(printf("Expected CGST/SGST approx %M but got C:%M S:%M"))(expectedSplit)(item.Tax.Cgst)(item.Tax.Sgst)), violations);
            }
        }
    }
    const matchValue_1 = item.CessRate;
    const matchValue_2 = item.Tax.Cess;
    let matchResult, crate, cval_1, cval_2;
    if (matchValue_1 == null) {
        if (matchValue_2 != null) {
            if (compare(matchValue_2, fromParts(0, 0, 0, false, 0)) > 0) {
                matchResult = 1;
                cval_2 = matchValue_2;
            }
            else {
                matchResult = 3;
            }
        }
        else {
            matchResult = 3;
        }
    }
    else if (matchValue_2 == null) {
        matchResult = 2;
    }
    else {
        matchResult = 0;
        crate = matchValue_1;
        cval_1 = matchValue_2;
    }
    switch (matchResult) {
        case 0: {
            if (!isDocumentRcm) {
                const expectedCess = round(op_Multiply(item.TaxableValue, op_Division(crate, fromParts(100, 0, 0, false, 0))), 2);
                if (compare(abs(op_Subtraction(cval_1, expectedCess)), fromParts(5, 0, 0, false, 1)) > 0) {
                    violations = cons(Compiler_failRule("CESS_ARITHMETIC")(toText(printf("Expected Cess approx %M but got %M"))(expectedCess)(cval_1)), violations);
                }
            }
            break;
        }
        case 1: {
            if (!isDocumentRcm) {
                violations = cons(Compiler_failRule("CESS_ARITHMETIC")("Cess amount provided but no CessRate specified"), violations);
            }
            break;
        }
        case 2: {
            if (!isDocumentRcm) {
                violations = cons(Compiler_failRule("CESS_ARITHMETIC")("CessRate provided but no Cess amount specified"), violations);
            }
            break;
        }
    }
    return violations;
}

export function Compiler_compile(raw, hash) {
    let matchValue_3, copyOfStruct, b_8;
    let violations = empty_1();
    if (isNullOrWhiteSpace(raw.InvoiceNumber)) {
        violations = cons(Compiler_failRule("INV_SANITY_NO")("InvoiceNumber cannot be empty"), violations);
    }
    if (isNullOrWhiteSpace(raw.InvoiceDate)) {
        violations = cons(Compiler_failRule("INV_SANITY_DATE")("InvoiceDate cannot be empty"), violations);
    }
    if (isEmpty(raw.Items)) {
        violations = cons(Compiler_failRule("INV_SANITY_ITEMS")("Invoice must contain at least one item"), violations);
    }
    const enumerator = getEnumerator(raw.Items);
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            const item = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
            if (compare(item.TaxableValue, fromParts(0, 0, 0, false, 0)) < 0) {
                violations = cons(Compiler_failRule("INV_SANITY_TAXABLE")("Item TaxableValue cannot be negative"), violations);
            }
            if (compare(item.GstRate, fromParts(0, 0, 0, false, 0)) < 0) {
                violations = cons(Compiler_failRule("INV_SANITY_RATE")("Item GstRate cannot be negative"), violations);
            }
        }
    }
    finally {
        disposeSafe(enumerator);
    }
    const sellerRes = Compiler_validateParty("Seller", raw.Seller);
    if (sellerRes.tag === 1) {
        violations = cons(sellerRes.fields[0], violations);
    }
    let docType;
    const matchValue = raw.DocumentType;
    let matchResult, other;
    if (matchValue == null) {
        matchResult = 2;
    }
    else {
        switch (matchValue) {
            case "CRN": {
                matchResult = 0;
                break;
            }
            case "DBN": {
                matchResult = 1;
                break;
            }
            case "INV": {
                matchResult = 2;
                break;
            }
            default: {
                matchResult = 3;
                other = matchValue;
            }
        }
    }
    switch (matchResult) {
        case 0: {
            docType = (new DocumentType$(1, []));
            break;
        }
        case 1: {
            docType = (new DocumentType$(2, []));
            break;
        }
        case 2: {
            docType = (new DocumentType$(0, []));
            break;
        }
        default: {
            violations = cons(Compiler_failRule("DOC_TYPE")(toText(printf("Invalid DocumentType \'%s\'"))(other)), violations);
            docType = (new DocumentType$(0, []));
        }
    }
    switch (docType.tag) {
        case 0: {
            break;
        }
        default:
            if ((raw.OriginalInvoiceNumber == null) ? true : (raw.OriginalInvoiceDate == null)) {
                violations = cons(Compiler_failRule("CDN_ORIGINAL_INV")("Credit/Debit Notes require OriginalInvoiceNumber and OriginalInvoiceDate"), violations);
            }
    }
    const matchValue_1 = raw.Irn;
    if (matchValue_1 == null) {
    }
    else {
        const irn = matchValue_1;
        if ((irn.length !== 64) ? true : !isMatch(/^[a-fA-F0-9]{64}$/gu, irn)) {
            violations = cons(Compiler_failRule("IRN_FORMAT")("IRN must be exactly 64 hexadecimal characters"), violations);
        }
    }
    let buyerRes;
    const matchValue_2 = raw.Buyer;
    if (matchValue_2 == null) {
        buyerRes = undefined;
    }
    else if (isNullOrWhiteSpace(matchValue_2.Gstin)) {
        const b_1 = matchValue_2;
        if (!FSharpSet__Contains(Compiler_validStateCodes, b_1.StateCode)) {
            const err = Compiler_failRule("STATE_CODE")(toText(printf("Buyer State Code \'%s\' is not in the valid vocabulary (01-38, 97, 99)"))(b_1.StateCode));
            violations = cons(err, violations);
            buyerRes = (new FSharpResult$2(1, [err]));
        }
        else {
            buyerRes = (new FSharpResult$2(0, [new Party((matchValue_3 = GSTINModule_create("URP"), (matchValue_3.tag === 0) ? matchValue_3.fields[0] : (() => {
                throw new Exception("URP");
            })()), b_1.StateCode, false)]));
        }
    }
    else {
        const b_2 = matchValue_2;
        const matchValue_4 = Compiler_validateParty("Buyer", b_2);
        if (matchValue_4.tag === 1) {
            const e_1 = matchValue_4.fields[0];
            violations = cons(e_1, violations);
            buyerRes = (new FSharpResult$2(1, [e_1]));
        }
        else {
            buyerRes = (new FSharpResult$2(0, [matchValue_4.fields[0]]));
        }
    }
    if ((length(violations) > 0) && exists((v) => equals(v.Outcome, new Verification_RuleOutcome(2, [])), violations)) {
        return new CompilationResult(undefined, new Verification_VerdictEnvelope("1.0", "gstflow", "1.0.0", "gstflow-rules", "2026.07.10", "gst-invoice", hash, violations, new Verification_RuleOutcome(2, [])));
    }
    else {
        let seller;
        if (sellerRes.tag === 0) {
            seller = sellerRes.fields[0];
        }
        else {
            throw new Exception("unreachable");
        }
        const buyer = (buyerRes != null) ? ((copyOfStruct = buyerRes, (copyOfStruct.tag === 0) ? copyOfStruct.fields[0] : undefined)) : undefined;
        let pos;
        const matchValue_5 = raw.PlaceOfSupply;
        if (matchValue_5 == null) {
            let matchResult_1, b_5;
            if (buyer != null) {
                if (GSTINModule_value(buyer.Gstin) !== "URP") {
                    matchResult_1 = 0;
                    b_5 = buyer;
                }
                else {
                    matchResult_1 = 1;
                }
            }
            else {
                matchResult_1 = 1;
            }
            switch (matchResult_1) {
                case 0: {
                    violations = cons(Compiler_unknownRule("PLACE_OF_SUPPLY_ASSUMED")("Place of Supply defaulted to Buyer State, but goods movement termination and service POS branches were not verified."), violations);
                    pos = b_5.StateCode;
                    break;
                }
                default: {
                    violations = cons(Compiler_unknownRule("PLACE_OF_SUPPLY_UNKNOWN")("Place of supply cannot be safely derived for unregistered buyer without explicit POS"), violations);
                    pos = "UNKNOWN";
                }
            }
        }
        else if (FSharpSet__Contains(Compiler_validStateCodes, matchValue_5)) {
            const p_1 = matchValue_5;
            pos = p_1;
        }
        else {
            const p_2 = matchValue_5;
            violations = cons(Compiler_failRule("PLACE_OF_SUPPLY")(toText(printf("Invalid PlaceOfSupply \'%s\'"))(p_2)), violations);
            pos = p_2;
        }
        const isInterstate = (pos !== "UNKNOWN") && (((seller.StateCode !== pos) ? true : seller.IsSez) ? true : ((buyer == null) ? false : buyer.IsSez));
        let isDocumentRcm;
        const matchValue_6 = raw.ReverseCharge;
        if (matchValue_6 == null) {
            let matchResult_2;
            if (buyer != null) {
                if (GSTINModule_value(seller.Gstin) === "URP") {
                    matchResult_2 = 0;
                }
                else {
                    matchResult_2 = 1;
                }
            }
            else {
                matchResult_2 = 1;
            }
            switch (matchResult_2) {
                case 0: {
                    isDocumentRcm = true;
                    break;
                }
                default:
                    isDocumentRcm = false;
            }
        }
        else {
            const rc = matchValue_6;
            isDocumentRcm = ((rc.toUpperCase() === "Y") ? true : (rc.toUpperCase() === "TRUE"));
        }
        const supplyType = (buyer != null) ? ((GSTINModule_value(buyer.Gstin) !== "URP") ? ((b_8 = buyer, new SupplyType(0, []))) : (new SupplyType(1, []))) : (new SupplyType(1, []));
        const itemViolations = collect((item_1) => Compiler_validateItem(isInterstate, isDocumentRcm, item_1), raw.Items);
        violations = append(itemViolations, violations);
        const totalIgst = sumBy((i) => i.Tax.Igst, raw.Items, {
            GetZero: () => (new Decimal("0")),
            Add: op_Addition,
        });
        const totalCgst = sumBy((i_1) => i_1.Tax.Cgst, raw.Items, {
            GetZero: () => (new Decimal("0")),
            Add: op_Addition,
        });
        const totalSgst = sumBy((i_2) => i_2.Tax.Sgst, raw.Items, {
            GetZero: () => (new Decimal("0")),
            Add: op_Addition,
        });
        const totalCess = sumBy((i_3) => {
            const matchValue_7 = i_3.Tax.Cess;
            if (matchValue_7 == null) {
                return fromParts(0, 0, 0, false, 0);
            }
            else {
                return matchValue_7;
            }
        }, raw.Items, {
            GetZero: () => (new Decimal("0")),
            Add: op_Addition,
        });
        if (!equals_1(op_Modulus(op_Addition(op_Addition(op_Addition(op_Addition(sumBy((i_4) => i_4.TaxableValue, raw.Items, {
            GetZero: () => (new Decimal("0")),
            Add: op_Addition,
        }), totalIgst), totalCgst), totalSgst), totalCess), fromParts(1, 0, 0, false, 0)), fromParts(0, 0, 0, false, 0))) {
            violations = cons(Compiler_warnRule("SEC_170_ROUNDING")("Section 170 CGST Act: Final invoice total must be rounded off to the nearest Rupee. Note: Telecom operators often ignore this."), violations);
        }
        const envelope = new Verification_VerdictEnvelope("1.0", "gstflow", "1.0.0", "gstflow-rules", "2026.07.10", "gst-invoice", hash, violations, isEmpty(violations) ? (new Verification_RuleOutcome(0, [])) : max(map_1((v_1) => v_1.Outcome, violations), {
            Compare: (x_5, y_5) => (compare_1(x_5, y_5) | 0),
        }));
        if (exists((v_2) => equals(v_2.Outcome, new Verification_RuleOutcome(2, [])), violations)) {
            return new CompilationResult(undefined, envelope);
        }
        else {
            return new CompilationResult(new GSTCanonicalIR(new Invoice(docType, raw.InvoiceNumber, raw.InvoiceDate, raw.OriginalInvoiceNumber, raw.OriginalInvoiceDate, raw.Irn, isDocumentRcm, seller, buyer, map_1((i_5) => (new InvoiceItem(i_5.Hsn, i_5.TaxableValue, i_5.GstRate, i_5.CessRate, i_5.Tax)), raw.Items)), supplyType, pos, isInterstate), envelope);
        }
    }
}

