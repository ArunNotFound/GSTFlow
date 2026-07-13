// ignore_for_file: camel_case_types, constant_identifier_names, non_constant_identifier_names, unnecessary_this
import './GSTFlow.Core/Library.dart' as library;
import './fable_modules/fable_library/Decimal.dart' as decimal;
import './fable_modules/fable_library/List.dart' as list_11;
import './fable_modules/fable_library/Map.dart' as map;
import './fable_modules/fable_library/Range.dart' as range;
import './fable_modules/fable_library/RegExp.dart' as reg_exp;
import './fable_modules/fable_library/Result.dart' as result;
import './fable_modules/fable_library/Seq.dart' as seq;
import './fable_modules/fable_library/Set.dart' as set$;
import './fable_modules/fable_library/String.dart' as string;
import './fable_modules/fable_library/Types.dart' as types;
import './fable_modules/fable_library/Util.dart' as util;

class RawParty implements types.Record, Comparable<RawParty> {
    final String Gstin;
    final String StateCode;
    final types.Some<bool>? IsSez;
    const RawParty(this.Gstin, this.StateCode, this.IsSez);
    @override
    bool operator ==(Object other) => (other is RawParty) && ((other.Gstin == Gstin) && ((other.StateCode == StateCode) && (other.IsSez == IsSez)));
    @override
    int get hashCode => util.combineHashCodes([Gstin.hashCode, StateCode.hashCode, IsSez.hashCode]);
    @override
    int compareTo(RawParty other) {
        late int $r;
        if (($r = Gstin.compareTo(other.Gstin)) == 0) {
            if (($r = StateCode.compareTo(other.StateCode)) == 0) {
                $r = util.compareNullable(IsSez, other.IsSez, (types.Some<bool> x, types.Some<bool> y) => x.compareTo(y));
            }
        }
        return $r;
    }
}

class RawInvoiceItem implements types.Record, Comparable<RawInvoiceItem> {
    final String Hsn;
    final dynamic TaxableValue;
    final dynamic GstRate;
    final types.Some<dynamic>? CessRate;
    final library.TaxAmount Tax;
    const RawInvoiceItem(this.Hsn, this.TaxableValue, this.GstRate, this.CessRate, this.Tax);
    @override
    bool operator ==(Object other) => (other is RawInvoiceItem) && ((other.Hsn == Hsn) && (util.equalsDynamic(other.TaxableValue, TaxableValue) && (util.equalsDynamic(other.GstRate, GstRate) && ((other.CessRate == CessRate) && (other.Tax == Tax)))));
    @override
    int get hashCode => util.combineHashCodes([Hsn.hashCode, TaxableValue.hashCode, GstRate.hashCode, CessRate.hashCode, Tax.hashCode]);
    @override
    int compareTo(RawInvoiceItem other) {
        late int $r;
        if (($r = Hsn.compareTo(other.Hsn)) == 0) {
            if (($r = util.compareDynamic(TaxableValue, other.TaxableValue)) == 0) {
                if (($r = util.compareDynamic(GstRate, other.GstRate)) == 0) {
                    if (($r = util.compareNullable(CessRate, other.CessRate, (types.Some<dynamic> x, types.Some<dynamic> y) => x.compareTo(y))) == 0) {
                        $r = Tax.compareTo(other.Tax);
                    }
                }
            }
        }
        return $r;
    }
}

class RawInvoice implements types.Record, Comparable<RawInvoice> {
    final types.Some<String>? DocumentType;
    final String InvoiceNumber;
    final String InvoiceDate;
    final types.Some<String>? PlaceOfSupply;
    final types.Some<String>? OriginalInvoiceNumber;
    final types.Some<String>? OriginalInvoiceDate;
    final types.Some<String>? Irn;
    final types.Some<String>? ReverseCharge;
    final RawParty Seller;
    final types.Some<RawParty>? Buyer;
    final list_11.FSharpList<RawInvoiceItem> Items;
    const RawInvoice(this.DocumentType, this.InvoiceNumber, this.InvoiceDate, this.PlaceOfSupply, this.OriginalInvoiceNumber, this.OriginalInvoiceDate, this.Irn, this.ReverseCharge, this.Seller, this.Buyer, this.Items);
    @override
    bool operator ==(Object other) => (other is RawInvoice) && ((other.DocumentType == DocumentType) && ((other.InvoiceNumber == InvoiceNumber) && ((other.InvoiceDate == InvoiceDate) && ((other.PlaceOfSupply == PlaceOfSupply) && ((other.OriginalInvoiceNumber == OriginalInvoiceNumber) && ((other.OriginalInvoiceDate == OriginalInvoiceDate) && ((other.Irn == Irn) && ((other.ReverseCharge == ReverseCharge) && ((other.Seller == Seller) && ((other.Buyer == Buyer) && (other.Items == Items)))))))))));
    @override
    int get hashCode => util.combineHashCodes([DocumentType.hashCode, InvoiceNumber.hashCode, InvoiceDate.hashCode, PlaceOfSupply.hashCode, OriginalInvoiceNumber.hashCode, OriginalInvoiceDate.hashCode, Irn.hashCode, ReverseCharge.hashCode, Seller.hashCode, Buyer.hashCode, Items.hashCode]);
    @override
    int compareTo(RawInvoice other) {
        late int $r;
        if (($r = util.compareNullable(DocumentType, other.DocumentType, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
            if (($r = InvoiceNumber.compareTo(other.InvoiceNumber)) == 0) {
                if (($r = InvoiceDate.compareTo(other.InvoiceDate)) == 0) {
                    if (($r = util.compareNullable(PlaceOfSupply, other.PlaceOfSupply, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
                        if (($r = util.compareNullable(OriginalInvoiceNumber, other.OriginalInvoiceNumber, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
                            if (($r = util.compareNullable(OriginalInvoiceDate, other.OriginalInvoiceDate, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
                                if (($r = util.compareNullable(Irn, other.Irn, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
                                    if (($r = util.compareNullable(ReverseCharge, other.ReverseCharge, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
                                        if (($r = Seller.compareTo(other.Seller)) == 0) {
                                            if (($r = util.compareNullable(Buyer, other.Buyer, (types.Some<RawParty> x, types.Some<RawParty> y) => x.compareTo(y))) == 0) {
                                                $r = Items.compareTo(other.Items);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return $r;
    }
}

class CompilationResult implements types.Record, Comparable<CompilationResult> {
    final types.Some<library.GSTCanonicalIR>? IR;
    final library.Verification_VerdictEnvelope Envelope;
    const CompilationResult(this.IR, this.Envelope);
    @override
    bool operator ==(Object other) => (other is CompilationResult) && ((other.IR == IR) && (other.Envelope == Envelope));
    @override
    int get hashCode => util.combineHashCodes([IR.hashCode, Envelope.hashCode]);
    @override
    int compareTo(CompilationResult other) {
        late int $r;
        if (($r = util.compareNullable(IR, other.IR, (types.Some<library.GSTCanonicalIR> x, types.Some<library.GSTCanonicalIR> y) => x.compareTo(y))) == 0) {
            $r = Envelope.compareTo(other.Envelope);
        }
        return $r;
    }
}

library.Verification_RuleResult Compiler_createRule<$$a>(library.Verification_RuleOutcome outcome, String id, $$a _arg) => library.Verification_RuleResult(library.Verification_RuleMetadata(id, 'GST', null, null, null, const library.Verification_RuleConfidence(/* Exact */ 0), id), outcome, list_11.singleton(const library.Verification_Evidence('', library.Verification_EvidenceKind(/* Derived */ 1), null, types.Some('Compiler'))), map.empty<String, String>(types.Comparer((String x, String y) => x.compareTo(y))));

library.Verification_RuleResult Function(String) Compiler_failRule(String id) => (String arg20$0040) => Compiler_createRule<String>(const library.Verification_RuleOutcome(/* Fail */ 2), id, arg20$0040);

library.Verification_RuleResult Function(String) Compiler_warnRule(String id) => (String arg20$0040) => Compiler_createRule<String>(const library.Verification_RuleOutcome(/* Warning */ 1), id, arg20$0040);

library.Verification_RuleResult Function(String) Compiler_unknownRule(String id) => (String arg20$0040) => Compiler_createRule<String>(const library.Verification_RuleOutcome(/* Unknown */ 3), id, arg20$0040);

final Compiler_validStateCodes = set$.ofList<String>(list_11.append<String>(seq.toList<String>(seq.delay<String>(() => seq.map<int, String>((int i) => (string.toText(string.printf('%02d')))(i), range.rangeInt(1, 1, 38)))), list_11.ofArray(const ['97', '99'])), types.Comparer((String x, String y) => x.compareTo(y)));

final Compiler_validRateSlabs = set$.ofList<dynamic>(list_11.ofArray([decimal.fromParts(0, 0, 0, false, 0), decimal.fromParts(1, 0, 0, false, 1), decimal.fromParts(25, 0, 0, false, 2), decimal.fromParts(15, 0, 0, false, 1), decimal.fromParts(3, 0, 0, false, 0), decimal.fromParts(5, 0, 0, false, 0), decimal.fromParts(12, 0, 0, false, 0), decimal.fromParts(18, 0, 0, false, 0), decimal.fromParts(28, 0, 0, false, 0)]), types.Comparer((dynamic x, dynamic y) => x.compareTo(y)));

bool Compiler_isValidHsn(String hsn) => reg_exp.isMatch(reg_exp.create('^(\\d{4}|\\d{6}|\\d{8})\$'), hsn);

result.FSharpResult$2<library.Party, library.Verification_RuleResult> Compiler_validateParty(String role, RawParty raw) {
    final result.FSharpResult$2<library.GSTIN, String> matchValue = library.GSTINModule_create(raw.Gstin);
    if (matchValue.tag == /* Error */ 1) {
        final String Function(String) Function(String) Function(String) tmp_arg = string.toText(string.printf('%s GSTIN \'%s\' is invalid: %s'));
        final String tmp_combine = raw.Gstin;
        final matchValue_2 = matchValue as result.FSharpResult$2_Error<library.GSTIN, String>;
        return result.FSharpResult$2_Error<library.Party, library.Verification_RuleResult>((Compiler_failRule('GSTIN_FORMAT'))(((tmp_arg(role))(tmp_combine))(matchValue_2.ErrorValue)));
    } else if (raw.Gstin.substring(0, 2) != raw.StateCode) {
        final String arg_2 = raw.Gstin.substring(0, 2);
        return result.FSharpResult$2_Error<library.Party, library.Verification_RuleResult>((Compiler_failRule('GSTIN_STATE_MATCH'))((((string.toText(string.printf('%s StateCode \'%s\' does not match GSTIN prefix \'%s\'')))(role))(raw.StateCode))(arg_2)));
    } else {
        final matchValue_3 = matchValue as result.FSharpResult$2_Ok<library.GSTIN, String>;
        final library.GSTIN tmp_combine_2 = matchValue_3.ResultValue;
        final String tmp_combine_1 = raw.StateCode;
        final types.Some<bool>? matchValue_1 = raw.IsSez;
        return result.FSharpResult$2_Ok<library.Party, library.Verification_RuleResult>(library.Party(tmp_combine_2, tmp_combine_1, (matchValue_1 == null) ? false : types.value(matchValue_1)));
    }
}

bool Compiler_isRcmHsn(String hsn) => list_11.exists<String>((String p) => hsn.startsWith(p), list_11.ofArray(const ['9965', '9967', '9973', '9982', '9983', '9985']));

list_11.FSharpList<library.Verification_RuleResult> Compiler_validateItem(bool isInterstate, bool isDocumentRcm, RawInvoiceItem item) {
    var violations = list_11.empty<library.Verification_RuleResult>();
    if (!(Compiler_isValidHsn(item.Hsn))) {
        violations = list_11.cons((Compiler_failRule('HSN_FORMAT'))((string.toText(string.printf('HSN \'%s\' must be exactly 4, 6, or 8 digits')))(item.Hsn)), violations);
    }
    if (!(set$.FSharpSet__Contains<dynamic>(Compiler_validRateSlabs, item.GstRate))) {
        violations = list_11.cons((Compiler_failRule('RATE_SLAB'))((string.toText(string.printf('GST Rate %M is not a valid Indian slab (0, 0.1, 0.25, 1.5, 3, 5, 12, 18, 28)')))(item.GstRate)), violations);
    }
    final dynamic expectedTax = decimal.round(decimal.op_Multiply(item.TaxableValue, decimal.op_Division(item.GstRate, decimal.fromParts(100, 0, 0, false, 0))), 2);
    if (isDocumentRcm) {
        late final bool tmp_capture_2;
        if (((item.Tax.Igst.compareTo(decimal.fromParts(0, 0, 0, false, 0)) > 0) || (item.Tax.Cgst.compareTo(decimal.fromParts(0, 0, 0, false, 0)) > 0)) || (item.Tax.Sgst.compareTo(decimal.fromParts(0, 0, 0, false, 0)) > 0)) {
            tmp_capture_2 = true;
        } else {
            final types.Some<dynamic>? matchValue = item.Tax.Cess;
            tmp_capture_2 = (matchValue == null) ? false : (types.value(matchValue).compareTo(decimal.fromParts(0, 0, 0, false, 0)) > 0);
        }
        if (tmp_capture_2) {
            violations = list_11.cons((Compiler_failRule('RCM_TAX_CHARGED'))('Invoice is marked for Reverse Charge (RCM). Seller cannot collect tax; tax amounts must be 0.'), violations);
        }
    } else {
        if (Compiler_isRcmHsn(item.Hsn)) {
            violations = list_11.cons((Compiler_failRule('RCM_LAW'))((string.toText(string.printf('HSN \'%s\' falls under mandatory Reverse Charge. The invoice must mark ReverseCharge=Y and tax amounts must be 0.')))(item.Hsn)), violations);
        }
        if (isInterstate) {
            if ((item.Tax.Cgst.compareTo(decimal.fromParts(0, 0, 0, false, 0)) > 0) || (item.Tax.Sgst.compareTo(decimal.fromParts(0, 0, 0, false, 0)) > 0)) {
                violations = list_11.cons((Compiler_failRule('IGST_CGST_LAW'))('Interstate supply cannot have CGST or SGST'), violations);
            }
            if (decimal.abs(decimal.op_Subtraction(item.Tax.Igst, expectedTax)).compareTo(decimal.fromParts(5, 0, 0, false, 1)) > 0) {
                violations = list_11.cons((Compiler_failRule('TAX_AMOUNT'))(((string.toText(string.printf('Expected IGST approx %M but got %M (failed Sec 170 / item math)')))(expectedTax))(item.Tax.Igst)), violations);
            }
        } else {
            if (item.Tax.Igst.compareTo(decimal.fromParts(0, 0, 0, false, 0)) > 0) {
                violations = list_11.cons((Compiler_failRule('IGST_CGST_LAW'))('Intrastate supply cannot have IGST'), violations);
            }
            final dynamic expectedSplit = decimal.round(decimal.op_Division(expectedTax, decimal.fromParts(2, 0, 0, false, 0)), 2);
            if ((decimal.abs(decimal.op_Subtraction(item.Tax.Cgst, expectedSplit)).compareTo(decimal.fromParts(5, 0, 0, false, 1)) > 0) || (decimal.abs(decimal.op_Subtraction(item.Tax.Sgst, expectedSplit)).compareTo(decimal.fromParts(5, 0, 0, false, 1)) > 0)) {
                violations = list_11.cons((Compiler_failRule('TAX_AMOUNT'))((((string.toText(string.printf('Expected CGST/SGST approx %M but got C:%M S:%M')))(expectedSplit))(item.Tax.Cgst))(item.Tax.Sgst)), violations);
            }
        }
    }
    final types.Some<dynamic>? matchValue_1 = item.CessRate;
    final types.Some<dynamic>? matchValue_2 = item.Tax.Cess;
    if (matchValue_1 == null) {
        if ((matchValue_2 != null) && (types.value(matchValue_2).compareTo(decimal.fromParts(0, 0, 0, false, 0)) > 0)) {
            if (!isDocumentRcm) {
                violations = list_11.cons((Compiler_failRule('CESS_ARITHMETIC'))('Cess amount provided but no CessRate specified'), violations);
            }
        }
    } else if (matchValue_2 == null) {
        if (!isDocumentRcm) {
            violations = list_11.cons((Compiler_failRule('CESS_ARITHMETIC'))('CessRate provided but no Cess amount specified'), violations);
        }
    } else if (!isDocumentRcm) {
        final dynamic expectedCess = decimal.round(decimal.op_Multiply(item.TaxableValue, decimal.op_Division(types.value(matchValue_1), decimal.fromParts(100, 0, 0, false, 0))), 2);
        if (decimal.abs(decimal.op_Subtraction(types.value(matchValue_2), expectedCess)).compareTo(decimal.fromParts(5, 0, 0, false, 1)) > 0) {
            violations = list_11.cons((Compiler_failRule('CESS_ARITHMETIC'))(((string.toText(string.printf('Expected Cess approx %M but got %M')))(expectedCess))(types.value(matchValue_2))), violations);
        }
    }
    return violations;
}

CompilationResult Compiler_compile(RawInvoice raw, String hash) {
    var violations = list_11.empty<library.Verification_RuleResult>();
    if (string.isNullOrWhiteSpace(raw.InvoiceNumber)) {
        violations = list_11.cons((Compiler_failRule('INV_SANITY_NO'))('InvoiceNumber cannot be empty'), violations);
    }
    if (string.isNullOrWhiteSpace(raw.InvoiceDate)) {
        violations = list_11.cons((Compiler_failRule('INV_SANITY_DATE'))('InvoiceDate cannot be empty'), violations);
    }
    if (list_11.isEmpty(raw.Items)) {
        violations = list_11.cons((Compiler_failRule('INV_SANITY_ITEMS'))('Invoice must contain at least one item'), violations);
    }
    final enumerator = raw.Items.iterator;
    try {
        while (enumerator.moveNext()) {
            final item = enumerator.current;
            if (item.TaxableValue.compareTo(decimal.fromParts(0, 0, 0, false, 0)) < 0) {
                violations = list_11.cons((Compiler_failRule('INV_SANITY_TAXABLE'))('Item TaxableValue cannot be negative'), violations);
            }
            if (item.GstRate.compareTo(decimal.fromParts(0, 0, 0, false, 0)) < 0) {
                violations = list_11.cons((Compiler_failRule('INV_SANITY_RATE'))('Item GstRate cannot be negative'), violations);
            }
        }
    } finally {
        if (enumerator is types.IDisposable) {
            types.dispose(enumerator);
        }
    }
    final result.FSharpResult$2<library.Party, library.Verification_RuleResult> sellerRes = Compiler_validateParty('Seller', raw.Seller);
    if (sellerRes.tag == /* Error */ 1) {
        final sellerRes_1 = sellerRes as result.FSharpResult$2_Error<library.Party, library.Verification_RuleResult>;
        violations = list_11.cons(sellerRes_1.ErrorValue, violations);
    }
    late final library.DocumentType$ docType;
    final types.Some<String>? matchValue = raw.DocumentType;
    late final int matchResult;
    late final String other;
    if (matchValue == null) {
        matchResult = 2;
    } else if (types.value(matchValue) == 'CRN') {
        matchResult = 0;
    } else if (types.value(matchValue) == 'DBN') {
        matchResult = 1;
    } else if (types.value(matchValue) == 'INV') {
        matchResult = 2;
    } else {
        matchResult = 3;
        other = types.value(matchValue);
    }
    switch (matchResult) {
        case 0:
            docType = const library.DocumentType$(/* CRN */ 1);
            break;
        case 1:
            docType = const library.DocumentType$(/* DBN */ 2);
            break;
        case 2:
            docType = const library.DocumentType$(/* INV */ 0);
            break;
        default:
            violations = list_11.cons((Compiler_failRule('DOC_TYPE'))((string.toText(string.printf('Invalid DocumentType \'%s\'')))(other)), violations);
            docType = const library.DocumentType$(/* INV */ 0);
    }
    switch (docType.tag) {
        case 2:
            if ((raw.OriginalInvoiceNumber == null) || (raw.OriginalInvoiceDate == null)) {
                violations = list_11.cons((Compiler_failRule('CDN_ORIGINAL_INV'))('Credit/Debit Notes require OriginalInvoiceNumber and OriginalInvoiceDate'), violations);
            }
            break;
        case 0:
            break;
        default:
            if ((raw.OriginalInvoiceNumber == null) || (raw.OriginalInvoiceDate == null)) {
                violations = list_11.cons((Compiler_failRule('CDN_ORIGINAL_INV'))('Credit/Debit Notes require OriginalInvoiceNumber and OriginalInvoiceDate'), violations);
            }
            ;
    }
    final types.Some<String>? matchValue_1 = raw.Irn;
    if (matchValue_1 == null) {
    } else {
        final String irn = types.value(matchValue_1);
        if ((irn.length != 64) || !(reg_exp.isMatch(reg_exp.create('^[a-fA-F0-9]{64}\$'), irn))) {
            violations = list_11.cons((Compiler_failRule('IRN_FORMAT'))('IRN must be exactly 64 hexadecimal characters'), violations);
        }
    }
    final types.Some<result.FSharpResult$2<library.Party, library.Verification_RuleResult>>? buyerRes;
    final types.Some<RawParty>? matchValue_2 = raw.Buyer;
    if (matchValue_2 == null) {
        buyerRes = null;
    } else if (string.isNullOrWhiteSpace(types.value(matchValue_2).Gstin)) {
        if (!(set$.FSharpSet__Contains<String>(Compiler_validStateCodes, types.value(matchValue_2).StateCode))) {
            final err = (Compiler_failRule('STATE_CODE'))((string.toText(string.printf('Buyer State Code \'%s\' is not in the valid vocabulary (01-38, 97, 99)')))(types.value(matchValue_2).StateCode));
            violations = list_11.cons(err, violations);
            buyerRes = types.Some(result.FSharpResult$2_Error<library.Party, library.Verification_RuleResult>(err));
        } else {
            final result.FSharpResult$2<library.GSTIN, String> matchValue_3 = library.GSTINModule_create('URP');
            late final library.GSTIN tmp_capture_3;
            if (matchValue_3.tag == /* Ok */ 0) {
                final matchValue_3_1 = matchValue_3 as result.FSharpResult$2_Ok<library.GSTIN, String>;
                tmp_capture_3 = matchValue_3_1.ResultValue;
            } else {
                tmp_capture_3 = throw types.ExceptionBase('URP');
            }
            buyerRes = types.Some(result.FSharpResult$2_Ok<library.Party, library.Verification_RuleResult>(library.Party(tmp_capture_3, types.value(matchValue_2).StateCode, false)));
        }
    } else {
        final result.FSharpResult$2<library.Party, library.Verification_RuleResult> matchValue_4 = Compiler_validateParty('Buyer', types.value(matchValue_2));
        if (matchValue_4.tag == /* Error */ 1) {
            final matchValue_4_1 = matchValue_4 as result.FSharpResult$2_Error<library.Party, library.Verification_RuleResult>;
            final e_1 = matchValue_4_1.ErrorValue;
            violations = list_11.cons(e_1, violations);
            buyerRes = types.Some(result.FSharpResult$2_Error<library.Party, library.Verification_RuleResult>(e_1));
        } else {
            final matchValue_4_2 = matchValue_4 as result.FSharpResult$2_Ok<library.Party, library.Verification_RuleResult>;
            buyerRes = types.Some(result.FSharpResult$2_Ok<library.Party, library.Verification_RuleResult>(matchValue_4_2.ResultValue));
        }
    }
    if ((list_11.length<library.Verification_RuleResult>(violations) > 0) && list_11.exists<library.Verification_RuleResult>((library.Verification_RuleResult v) => v.Outcome == const library.Verification_RuleOutcome(/* Fail */ 2), violations)) {
        return CompilationResult(null, library.Verification_VerdictEnvelope('1.0', 'gstflow', '1.0.0', 'gstflow-rules', '2026.07.10', 'gst-invoice', hash, violations, const library.Verification_RuleOutcome(/* Fail */ 2)));
    } else {
        late final library.Party seller;
        if (sellerRes.tag == /* Ok */ 0) {
            final sellerRes_2 = sellerRes as result.FSharpResult$2_Ok<library.Party, library.Verification_RuleResult>;
            seller = sellerRes_2.ResultValue;
        } else {
            seller = throw types.ExceptionBase('unreachable');
        }
        final types.Some<library.Party>? buyer;
        late final int matchResult_1;
        late final library.Party b_3;
        if (buyerRes != null) {
            final result.FSharpResult$2<library.Party, library.Verification_RuleResult> copyOfStruct = types.value(buyerRes);
            if (copyOfStruct.tag == /* Ok */ 0) {
                matchResult_1 = 0;
                final copyOfStruct_1 = copyOfStruct as result.FSharpResult$2_Ok<library.Party, library.Verification_RuleResult>;
                b_3 = copyOfStruct_1.ResultValue;
            } else {
                matchResult_1 = 1;
            }
        } else {
            matchResult_1 = 1;
        }
        switch (matchResult_1) {
            case 0:
                buyer = types.Some(b_3);
                break;
            default:
                buyer = null;
        }
        late final String pos;
        final types.Some<String>? matchValue_5 = raw.PlaceOfSupply;
        if (matchValue_5 == null) {
            if ((buyer != null) && (library.GSTINModule_value(types.value(buyer).Gstin) != 'URP')) {
                pos = types.value(buyer).StateCode;
            } else {
                violations = list_11.cons((Compiler_unknownRule('PLACE_OF_SUPPLY_UNKNOWN'))('Place of supply cannot be safely derived for unregistered buyer without explicit POS'), violations);
                pos = 'UNKNOWN';
            }
        } else if (set$.FSharpSet__Contains<String>(Compiler_validStateCodes, types.value(matchValue_5))) {
            pos = types.value(matchValue_5);
        } else {
            violations = list_11.cons((Compiler_failRule('PLACE_OF_SUPPLY'))((string.toText(string.printf('Invalid PlaceOfSupply \'%s\'')))(types.value(matchValue_5))), violations);
            pos = types.value(matchValue_5);
        }
        final bool isInterstate = ((seller.StateCode != pos) || seller.IsSez) || ((buyer == null) ? false : types.value(buyer).IsSez);
        late final bool isDocumentRcm;
        final types.Some<String>? matchValue_6 = raw.ReverseCharge;
        if (matchValue_6 == null) {
            isDocumentRcm = (buyer != null) && (library.GSTINModule_value(seller.Gstin) == 'URP');
        } else {
            final String rc = types.value(matchValue_6);
            isDocumentRcm = (rc.toUpperCase() == 'Y') || (rc.toUpperCase() == 'TRUE');
        }
        final library.SupplyType supplyType = ((buyer != null) && (library.GSTINModule_value(types.value(buyer).Gstin) != 'URP')) ? const library.SupplyType(/* B2B */ 0) : const library.SupplyType(/* B2C */ 1);
        final itemViolations = list_11.collect<RawInvoiceItem, library.Verification_RuleResult>((RawInvoiceItem item_1) => Compiler_validateItem(isInterstate, isDocumentRcm, item_1), raw.Items);
        violations = list_11.append<library.Verification_RuleResult>(itemViolations, violations);
        final dynamic totalIgst = list_11.sumBy<RawInvoiceItem, dynamic>((RawInvoiceItem i) => i.Tax.Igst, raw.Items, types.GenericAdder(() => decimal.default(0), (dynamic x, dynamic y) => decimal.op_Addition(x, y)));
        final dynamic totalCgst = list_11.sumBy<RawInvoiceItem, dynamic>((RawInvoiceItem i_1) => i_1.Tax.Cgst, raw.Items, types.GenericAdder(() => decimal.default(0), (dynamic x, dynamic y) => decimal.op_Addition(x, y)));
        final dynamic totalSgst = list_11.sumBy<RawInvoiceItem, dynamic>((RawInvoiceItem i_2) => i_2.Tax.Sgst, raw.Items, types.GenericAdder(() => decimal.default(0), (dynamic x, dynamic y) => decimal.op_Addition(x, y)));
        final dynamic totalCess = list_11.sumBy<RawInvoiceItem, dynamic>((RawInvoiceItem i_3) {
            final types.Some<dynamic>? matchValue_7 = i_3.Tax.Cess;
            if (matchValue_7 == null) {
                return decimal.fromParts(0, 0, 0, false, 0);
            } else {
                return types.value(matchValue_7);
            }
        }, raw.Items, types.GenericAdder(() => decimal.default(0), (dynamic x, dynamic y) => decimal.op_Addition(x, y)));
        if (decimal.op_Modulus(decimal.op_Addition(decimal.op_Addition(decimal.op_Addition(decimal.op_Addition(list_11.sumBy<RawInvoiceItem, dynamic>((RawInvoiceItem i_4) => i_4.TaxableValue, raw.Items, types.GenericAdder(() => decimal.default(0), (dynamic x, dynamic y) => decimal.op_Addition(x, y))), totalIgst), totalCgst), totalSgst), totalCess), decimal.fromParts(1, 0, 0, false, 0)) != decimal.fromParts(0, 0, 0, false, 0)) {
            violations = list_11.cons((Compiler_warnRule('SEC_170_ROUNDING'))('Section 170 CGST Act: Final invoice total must be rounded off to the nearest Rupee. Note: Telecom operators often ignore this.'), violations);
        }
        final envelope = library.Verification_VerdictEnvelope('1.0', 'gstflow', '1.0.0', 'gstflow-rules', '2026.07.10', 'gst-invoice', hash, violations, list_11.isEmpty(violations) ? const library.Verification_RuleOutcome(/* Pass */ 0) : list_11.max<library.Verification_RuleOutcome>(list_11.map<library.Verification_RuleResult, library.Verification_RuleOutcome>((library.Verification_RuleResult v_1) => v_1.Outcome, violations), types.Comparer((library.Verification_RuleOutcome x, library.Verification_RuleOutcome y) => x.compareTo(y))));
        if (list_11.exists<library.Verification_RuleResult>((library.Verification_RuleResult v_2) => v_2.Outcome == const library.Verification_RuleOutcome(/* Fail */ 2), violations)) {
            return CompilationResult(null, envelope);
        } else {
            return CompilationResult(types.Some(library.GSTCanonicalIR(library.Invoice(docType, raw.InvoiceNumber, raw.InvoiceDate, raw.OriginalInvoiceNumber, raw.OriginalInvoiceDate, raw.Irn, isDocumentRcm, seller, buyer, list_11.map<RawInvoiceItem, library.InvoiceItem>((RawInvoiceItem i_5) => library.InvoiceItem(i_5.Hsn, i_5.TaxableValue, i_5.GstRate, i_5.CessRate, i_5.Tax), raw.Items)), supplyType, pos, isInterstate)), envelope);
        }
    }
}

