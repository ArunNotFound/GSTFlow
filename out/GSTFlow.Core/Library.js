
import { Record, Union } from "../fable_modules/fable-library-js.5.6.0/Types.js";
import { decimal_type, bool_type, class_type, list_type, record_type, option_type, string_type, union_type } from "../fable_modules/fable-library-js.5.6.0/Reflection.js";
import { Exception } from "../fable_modules/fable-library-js.5.6.0/Util.js";
import { mapIndexed, sum as sum_1 } from "../fable_modules/fable-library-js.5.6.0/Array.js";
import { substring } from "../fable_modules/fable-library-js.5.6.0/String.js";
import { create, isMatch } from "../fable_modules/fable-library-js.5.6.0/RegExp.js";
import { FSharpResult$2 } from "../fable_modules/fable-library-js.5.6.0/Result.js";

export class Verification_RuleConfidence extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Exact", "Derived", "Guessed"];
    }
}

export function Verification_RuleConfidence_$reflection() {
    return union_type("GSTFlow.Core.Verification.RuleConfidence", [], Verification_RuleConfidence, () => [[], [], []]);
}

export class Verification_RuleOutcome extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Pass", "Warning", "Fail", "Unknown"];
    }
}

export function Verification_RuleOutcome_$reflection() {
    return union_type("GSTFlow.Core.Verification.RuleOutcome", [], Verification_RuleOutcome, () => [[], [], [], []]);
}

export class Verification_RuleMetadata extends Record {
    constructor(RuleId, Category, EffectiveFrom, EffectiveUntil, Reference, Confidence, MessageKey) {
        super();
        this.RuleId = RuleId;
        this.Category = Category;
        this.EffectiveFrom = EffectiveFrom;
        this.EffectiveUntil = EffectiveUntil;
        this.Reference = Reference;
        this.Confidence = Confidence;
        this.MessageKey = MessageKey;
    }
}

export function Verification_RuleMetadata_$reflection() {
    return record_type("GSTFlow.Core.Verification.RuleMetadata", [], Verification_RuleMetadata, () => [["RuleId", string_type], ["Category", string_type], ["EffectiveFrom", option_type(string_type)], ["EffectiveUntil", option_type(string_type)], ["Reference", option_type(string_type)], ["Confidence", Verification_RuleConfidence_$reflection()], ["MessageKey", string_type]]);
}

export class Verification_EvidenceKind extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Direct", "Derived"];
    }
}

export function Verification_EvidenceKind_$reflection() {
    return union_type("GSTFlow.Core.Verification.EvidenceKind", [], Verification_EvidenceKind, () => [[], []]);
}

export class Verification_Evidence extends Record {
    constructor(Path, Kind, Value, Provenance) {
        super();
        this.Path = Path;
        this.Kind = Kind;
        this.Value = Value;
        this.Provenance = Provenance;
    }
}

export function Verification_Evidence_$reflection() {
    return record_type("GSTFlow.Core.Verification.Evidence", [], Verification_Evidence, () => [["Path", string_type], ["Kind", Verification_EvidenceKind_$reflection()], ["Value", option_type(string_type)], ["Provenance", option_type(string_type)]]);
}

export class Verification_RuleResult extends Record {
    constructor(Metadata, Outcome, Evidence, Parameters) {
        super();
        this.Metadata = Metadata;
        this.Outcome = Outcome;
        this.Evidence = Evidence;
        this.Parameters = Parameters;
    }
}

export function Verification_RuleResult_$reflection() {
    return record_type("GSTFlow.Core.Verification.RuleResult", [], Verification_RuleResult, () => [["Metadata", Verification_RuleMetadata_$reflection()], ["Outcome", Verification_RuleOutcome_$reflection()], ["Evidence", list_type(Verification_Evidence_$reflection())], ["Parameters", class_type("Microsoft.FSharp.Collections.FSharpMap`2", [string_type, string_type])]]);
}

export class Verification_VerdictEnvelope extends Record {
    constructor(SchemaVersion, EngineId, EngineVersion, RuleSetId, RuleSetVersion, SubjectType, SubjectHash, Results, OverallOutcome) {
        super();
        this.SchemaVersion = SchemaVersion;
        this.EngineId = EngineId;
        this.EngineVersion = EngineVersion;
        this.RuleSetId = RuleSetId;
        this.RuleSetVersion = RuleSetVersion;
        this.SubjectType = SubjectType;
        this.SubjectHash = SubjectHash;
        this.Results = Results;
        this.OverallOutcome = OverallOutcome;
    }
}

export function Verification_VerdictEnvelope_$reflection() {
    return record_type("GSTFlow.Core.Verification.VerdictEnvelope", [], Verification_VerdictEnvelope, () => [["SchemaVersion", string_type], ["EngineId", string_type], ["EngineVersion", string_type], ["RuleSetId", string_type], ["RuleSetVersion", string_type], ["SubjectType", string_type], ["SubjectHash", string_type], ["Results", list_type(Verification_RuleResult_$reflection())], ["OverallOutcome", Verification_RuleOutcome_$reflection()]]);
}

export function Hash_computeSha256(str) {
    return "hash_not_computed";
}

export function GstinValidation_charToValue(c) {
    const ci = ~~c.charCodeAt(0) | 0;
    if ((ci >= 48) && (ci <= 57)) {
        return (ci - 48) | 0;
    }
    else if ((ci >= 65) && (ci <= 90)) {
        return ((ci - 65) + 10) | 0;
    }
    else if ((ci >= 97) && (ci <= 122)) {
        return ((ci - 97) + 10) | 0;
    }
    else {
        throw new Exception("Invalid character");
    }
}

export function GstinValidation_valueToChar(v) {
    if (v < 10) {
        return String.fromCharCode((v + ~~"0".charCodeAt(0)) & 0xFFFF);
    }
    else {
        return String.fromCharCode(((v - 10) + ~~"A".charCodeAt(0)) & 0xFFFF);
    }
}

export function GstinValidation_calculateCheckDigit(gstinWithoutCheck) {
    const remainder = (sum_1(mapIndexed((i, c) => {
        const product = (GstinValidation_charToValue(c) * (((i % 2) === 0) ? 1 : 2)) | 0;
        return (~~(product / 36) + (product % 36)) | 0;
    }, gstinWithoutCheck.split(""), Int32Array), {
        GetZero: () => 0,
        Add: (x, y) => ((x + y) | 0),
    }) % 36) | 0;
    return GstinValidation_valueToChar((remainder === 0) ? 0 : (36 - remainder));
}

export function GstinValidation_isValid(gstin) {
    if (gstin.length !== 15) {
        return false;
    }
    else {
        const stateCode = substring(gstin, 0, 2);
        if (!isMatch(create(((stateCode === "99") ? true : (stateCode === "97")) ? "^[0-9]{2}[A-Z0-9]{10}[1-9A-Z]{1}[A-Z][0-9A-Z]{1}$" : "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z][0-9A-Z]{1}$"), gstin)) {
            return false;
        }
        else {
            try {
                return GstinValidation_calculateCheckDigit(substring(gstin, 0, 14)) === gstin[14];
            }
            catch (matchValue) {
                return false;
            }
        }
    }
}

export class GSTIN extends Union {
    constructor(Item) {
        super();
        this.tag = 0;
        this.fields = [Item];
    }
    cases() {
        return ["GSTIN"];
    }
}

export function GSTIN_$reflection() {
    return union_type("GSTFlow.Core.GSTIN", [], GSTIN, () => [[["Item", string_type]]]);
}

export function GSTINModule_create(str) {
    if (str === "URP") {
        return new FSharpResult$2(0, [new GSTIN(str)]);
    }
    else if (GstinValidation_isValid(str)) {
        return new FSharpResult$2(0, [new GSTIN(str)]);
    }
    else {
        return new FSharpResult$2(1, ["Invalid GSTIN format or checksum"]);
    }
}

export function GSTINModule_value(_arg) {
    return _arg.fields[0];
}

export class Party extends Record {
    constructor(Gstin, StateCode, IsSez) {
        super();
        this.Gstin = Gstin;
        this.StateCode = StateCode;
        this.IsSez = IsSez;
    }
}

export function Party_$reflection() {
    return record_type("GSTFlow.Core.Party", [], Party, () => [["Gstin", GSTIN_$reflection()], ["StateCode", string_type], ["IsSez", bool_type]]);
}

export class SupplyType extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["B2B", "B2C"];
    }
}

export function SupplyType_$reflection() {
    return union_type("GSTFlow.Core.SupplyType", [], SupplyType, () => [[], []]);
}

export class TaxAmount extends Record {
    constructor(Igst, Cgst, Sgst, Cess) {
        super();
        this.Igst = Igst;
        this.Cgst = Cgst;
        this.Sgst = Sgst;
        this.Cess = Cess;
    }
}

export function TaxAmount_$reflection() {
    return record_type("GSTFlow.Core.TaxAmount", [], TaxAmount, () => [["Igst", decimal_type], ["Cgst", decimal_type], ["Sgst", decimal_type], ["Cess", option_type(decimal_type)]]);
}

export class InvoiceItem extends Record {
    constructor(Hsn, TaxableValue, GstRate, CessRate, Tax) {
        super();
        this.Hsn = Hsn;
        this.TaxableValue = TaxableValue;
        this.GstRate = GstRate;
        this.CessRate = CessRate;
        this.Tax = Tax;
    }
}

export function InvoiceItem_$reflection() {
    return record_type("GSTFlow.Core.InvoiceItem", [], InvoiceItem, () => [["Hsn", string_type], ["TaxableValue", decimal_type], ["GstRate", decimal_type], ["CessRate", option_type(decimal_type)], ["Tax", TaxAmount_$reflection()]]);
}

export class DocumentType$ extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["INV", "CRN", "DBN"];
    }
}

export function DocumentType$_$reflection() {
    return union_type("GSTFlow.Core.DocumentType", [], DocumentType$, () => [[], [], []]);
}

export class Invoice extends Record {
    constructor(DocumentType$, InvoiceNumber, InvoiceDate, OriginalInvoiceNumber, OriginalInvoiceDate, Irn, ReverseCharge, Seller, Buyer, Items) {
        super();
        this.DocumentType = DocumentType$;
        this.InvoiceNumber = InvoiceNumber;
        this.InvoiceDate = InvoiceDate;
        this.OriginalInvoiceNumber = OriginalInvoiceNumber;
        this.OriginalInvoiceDate = OriginalInvoiceDate;
        this.Irn = Irn;
        this.ReverseCharge = ReverseCharge;
        this.Seller = Seller;
        this.Buyer = Buyer;
        this.Items = Items;
    }
}

export function Invoice_$reflection() {
    return record_type("GSTFlow.Core.Invoice", [], Invoice, () => [["DocumentType", DocumentType$_$reflection()], ["InvoiceNumber", string_type], ["InvoiceDate", string_type], ["OriginalInvoiceNumber", option_type(string_type)], ["OriginalInvoiceDate", option_type(string_type)], ["Irn", option_type(string_type)], ["ReverseCharge", bool_type], ["Seller", Party_$reflection()], ["Buyer", option_type(Party_$reflection())], ["Items", list_type(InvoiceItem_$reflection())]]);
}

export class GSTCanonicalIR extends Record {
    constructor(SourceInvoice, DerivedSupplyType, PlaceOfSupply, IsInterstate) {
        super();
        this.SourceInvoice = SourceInvoice;
        this.DerivedSupplyType = DerivedSupplyType;
        this.PlaceOfSupply = PlaceOfSupply;
        this.IsInterstate = IsInterstate;
    }
}

export function GSTCanonicalIR_$reflection() {
    return record_type("GSTFlow.Core.GSTCanonicalIR", [], GSTCanonicalIR, () => [["SourceInvoice", Invoice_$reflection()], ["DerivedSupplyType", SupplyType_$reflection()], ["PlaceOfSupply", string_type], ["IsInterstate", bool_type]]);
}

