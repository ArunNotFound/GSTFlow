// ignore_for_file: camel_case_types, constant_identifier_names, non_constant_identifier_names, unnecessary_this
import '../fable_modules/fable_library/Array.dart' as array_2;
import '../fable_modules/fable_library/List.dart' as list;
import '../fable_modules/fable_library/Map.dart' as map;
import '../fable_modules/fable_library/RegExp.dart' as reg_exp;
import '../fable_modules/fable_library/Result.dart' as result;
import '../fable_modules/fable_library/Types.dart' as types;
import '../fable_modules/fable_library/Util.dart' as util;

class Verification_RuleConfidence implements types.Union, Comparable<Verification_RuleConfidence> {
    final int tag;
    const Verification_RuleConfidence(this.tag);
    @override
    bool operator ==(Object other) => (other is Verification_RuleConfidence) && (other.tag == tag);
    @override
    int get hashCode => tag.hashCode;
    @override
    int compareTo(Verification_RuleConfidence other) => tag.compareTo(other.tag);
}

class Verification_RuleOutcome implements types.Union, Comparable<Verification_RuleOutcome> {
    final int tag;
    const Verification_RuleOutcome(this.tag);
    @override
    bool operator ==(Object other) => (other is Verification_RuleOutcome) && (other.tag == tag);
    @override
    int get hashCode => tag.hashCode;
    @override
    int compareTo(Verification_RuleOutcome other) => tag.compareTo(other.tag);
}

class Verification_RuleMetadata implements types.Record, Comparable<Verification_RuleMetadata> {
    final String RuleId;
    final String Category;
    final types.Some<String>? EffectiveFrom;
    final types.Some<String>? EffectiveUntil;
    final types.Some<String>? Reference;
    final Verification_RuleConfidence Confidence;
    final String MessageKey;
    const Verification_RuleMetadata(this.RuleId, this.Category, this.EffectiveFrom, this.EffectiveUntil, this.Reference, this.Confidence, this.MessageKey);
    @override
    bool operator ==(Object other) => (other is Verification_RuleMetadata) && ((other.RuleId == RuleId) && ((other.Category == Category) && ((other.EffectiveFrom == EffectiveFrom) && ((other.EffectiveUntil == EffectiveUntil) && ((other.Reference == Reference) && ((other.Confidence == Confidence) && (other.MessageKey == MessageKey)))))));
    @override
    int get hashCode => util.combineHashCodes([RuleId.hashCode, Category.hashCode, EffectiveFrom.hashCode, EffectiveUntil.hashCode, Reference.hashCode, Confidence.hashCode, MessageKey.hashCode]);
    @override
    int compareTo(Verification_RuleMetadata other) {
        late int $r;
        if (($r = RuleId.compareTo(other.RuleId)) == 0) {
            if (($r = Category.compareTo(other.Category)) == 0) {
                if (($r = util.compareNullable(EffectiveFrom, other.EffectiveFrom, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
                    if (($r = util.compareNullable(EffectiveUntil, other.EffectiveUntil, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
                        if (($r = util.compareNullable(Reference, other.Reference, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
                            if (($r = Confidence.compareTo(other.Confidence)) == 0) {
                                $r = MessageKey.compareTo(other.MessageKey);
                            }
                        }
                    }
                }
            }
        }
        return $r;
    }
}

class Verification_EvidenceKind implements types.Union, Comparable<Verification_EvidenceKind> {
    final int tag;
    const Verification_EvidenceKind(this.tag);
    @override
    bool operator ==(Object other) => (other is Verification_EvidenceKind) && (other.tag == tag);
    @override
    int get hashCode => tag.hashCode;
    @override
    int compareTo(Verification_EvidenceKind other) => tag.compareTo(other.tag);
}

class Verification_Evidence implements types.Record, Comparable<Verification_Evidence> {
    final String Path;
    final Verification_EvidenceKind Kind;
    final types.Some<String>? Value;
    final types.Some<String>? Provenance;
    const Verification_Evidence(this.Path, this.Kind, this.Value, this.Provenance);
    @override
    bool operator ==(Object other) => (other is Verification_Evidence) && ((other.Path == Path) && ((other.Kind == Kind) && ((other.Value == Value) && (other.Provenance == Provenance))));
    @override
    int get hashCode => util.combineHashCodes([Path.hashCode, Kind.hashCode, Value.hashCode, Provenance.hashCode]);
    @override
    int compareTo(Verification_Evidence other) {
        late int $r;
        if (($r = Path.compareTo(other.Path)) == 0) {
            if (($r = Kind.compareTo(other.Kind)) == 0) {
                if (($r = util.compareNullable(Value, other.Value, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
                    $r = util.compareNullable(Provenance, other.Provenance, (types.Some<String> x, types.Some<String> y) => x.compareTo(y));
                }
            }
        }
        return $r;
    }
}

class Verification_RuleResult implements types.Record, Comparable<Verification_RuleResult> {
    final Verification_RuleMetadata Metadata;
    final Verification_RuleOutcome Outcome;
    final list.FSharpList<Verification_Evidence> Evidence;
    final map.FSharpMap<String, String> Parameters;
    const Verification_RuleResult(this.Metadata, this.Outcome, this.Evidence, this.Parameters);
    @override
    bool operator ==(Object other) => (other is Verification_RuleResult) && ((other.Metadata == Metadata) && ((other.Outcome == Outcome) && ((other.Evidence == Evidence) && (other.Parameters == Parameters))));
    @override
    int get hashCode => util.combineHashCodes([Metadata.hashCode, Outcome.hashCode, Evidence.hashCode, Parameters.hashCode]);
    @override
    int compareTo(Verification_RuleResult other) {
        late int $r;
        if (($r = Metadata.compareTo(other.Metadata)) == 0) {
            if (($r = Outcome.compareTo(other.Outcome)) == 0) {
                if (($r = Evidence.compareTo(other.Evidence)) == 0) {
                    $r = Parameters.compareTo(other.Parameters);
                }
            }
        }
        return $r;
    }
}

class Verification_VerdictEnvelope implements types.Record, Comparable<Verification_VerdictEnvelope> {
    final String SchemaVersion;
    final String EngineId;
    final String EngineVersion;
    final String RuleSetId;
    final String RuleSetVersion;
    final String SubjectType;
    final String SubjectHash;
    final list.FSharpList<Verification_RuleResult> Results;
    final Verification_RuleOutcome OverallOutcome;
    const Verification_VerdictEnvelope(this.SchemaVersion, this.EngineId, this.EngineVersion, this.RuleSetId, this.RuleSetVersion, this.SubjectType, this.SubjectHash, this.Results, this.OverallOutcome);
    @override
    bool operator ==(Object other) => (other is Verification_VerdictEnvelope) && ((other.SchemaVersion == SchemaVersion) && ((other.EngineId == EngineId) && ((other.EngineVersion == EngineVersion) && ((other.RuleSetId == RuleSetId) && ((other.RuleSetVersion == RuleSetVersion) && ((other.SubjectType == SubjectType) && ((other.SubjectHash == SubjectHash) && ((other.Results == Results) && (other.OverallOutcome == OverallOutcome)))))))));
    @override
    int get hashCode => util.combineHashCodes([SchemaVersion.hashCode, EngineId.hashCode, EngineVersion.hashCode, RuleSetId.hashCode, RuleSetVersion.hashCode, SubjectType.hashCode, SubjectHash.hashCode, Results.hashCode, OverallOutcome.hashCode]);
    @override
    int compareTo(Verification_VerdictEnvelope other) {
        late int $r;
        if (($r = SchemaVersion.compareTo(other.SchemaVersion)) == 0) {
            if (($r = EngineId.compareTo(other.EngineId)) == 0) {
                if (($r = EngineVersion.compareTo(other.EngineVersion)) == 0) {
                    if (($r = RuleSetId.compareTo(other.RuleSetId)) == 0) {
                        if (($r = RuleSetVersion.compareTo(other.RuleSetVersion)) == 0) {
                            if (($r = SubjectType.compareTo(other.SubjectType)) == 0) {
                                if (($r = SubjectHash.compareTo(other.SubjectHash)) == 0) {
                                    if (($r = Results.compareTo(other.Results)) == 0) {
                                        $r = OverallOutcome.compareTo(other.OverallOutcome);
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

String Hash_computeSha256(String str) => 'hash_not_computed';

int GstinValidation_charToValue(int c) {
    final int ci = c;
    if ((ci >= 48) && (ci <= 57)) {
        return ci - 48;
    } else if ((ci >= 65) && (ci <= 90)) {
        return (ci - 65) + 10;
    } else if ((ci >= 97) && (ci <= 122)) {
        return (ci - 97) + 10;
    } else {
        return throw types.ExceptionBase('Invalid character');
    }
}

int GstinValidation_valueToChar(int v) {
    if (v < 10) {
        return v + 48;
    } else {
        return (v - 10) + 65;
    }
}

int GstinValidation_calculateCheckDigit(String gstinWithoutCheck) {
    final int sum = array_2.sum<int>(array_2.mapIndexed<int, int>((int i, int c) {
        final int product = GstinValidation_charToValue(c) * ((i.remainder(2) == 0) ? 1 : 2);
        return (product ~/ 36) + product.remainder(36);
    }, gstinWithoutCheck.codeUnits), types.GenericAdder(() => 0, (int x, int y) => x + y));
    final int remainder = sum.remainder(36);
    return GstinValidation_valueToChar((remainder == 0) ? 0 : (36 - remainder));
}

bool GstinValidation_isValid(String gstin) {
    if (gstin.length != 15) {
        return false;
    } else {
        final String stateCode = gstin.substring(0, 2);
        if (!(reg_exp.isMatch(reg_exp.create(((stateCode == '99') || (stateCode == '97')) ? '^[0-9]{2}[A-Z0-9]{10}[1-9A-Z]{1}[A-Z][0-9A-Z]{1}\$' : '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z][0-9A-Z]{1}\$'), gstin))) {
            return false;
        } else {
            try {
                return GstinValidation_calculateCheckDigit(gstin.substring(0, 14)) == gstin.codeUnitAt(14);
            } catch (matchValue) {
                return false;
            }
        }
    }
}

abstract class GSTIN implements types.Union, Comparable<GSTIN> {
    final int tag;
    const GSTIN(this.tag);
}

class GSTIN_GSTIN extends GSTIN {
    final String Item;
    const GSTIN_GSTIN(this.Item): super(0);
    @override
    bool operator ==(Object other) => (other is GSTIN_GSTIN) && (other.Item == Item);
    @override
    int get hashCode => util.combineHashCodes([tag.hashCode, Item.hashCode]);
    @override
    int compareTo(GSTIN other) {
        if (other is GSTIN_GSTIN) {
            return Item.compareTo(other.Item);
        } else {
            return tag.compareTo(other.tag);
        }
    }
}

result.FSharpResult$2<GSTIN, String> GSTINModule_create(String str) {
    if (str == 'URP') {
        return result.FSharpResult$2_Ok<GSTIN, String>(GSTIN_GSTIN(str));
    } else if (GstinValidation_isValid(str)) {
        return result.FSharpResult$2_Ok<GSTIN, String>(GSTIN_GSTIN(str));
    } else {
        return const result.FSharpResult$2_Error<GSTIN, String>('Invalid GSTIN format or checksum');
    }
}

String GSTINModule_value(GSTIN _arg) {
    final _arg_1 = _arg as GSTIN_GSTIN;
    return _arg_1.Item;
}

class Party implements types.Record, Comparable<Party> {
    final GSTIN Gstin;
    final String StateCode;
    final bool IsSez;
    const Party(this.Gstin, this.StateCode, this.IsSez);
    @override
    bool operator ==(Object other) => (other is Party) && ((other.Gstin == Gstin) && ((other.StateCode == StateCode) && (other.IsSez == IsSez)));
    @override
    int get hashCode => util.combineHashCodes([Gstin.hashCode, StateCode.hashCode, IsSez.hashCode]);
    @override
    int compareTo(Party other) {
        late int $r;
        if (($r = Gstin.compareTo(other.Gstin)) == 0) {
            if (($r = StateCode.compareTo(other.StateCode)) == 0) {
                $r = util.compareBool(IsSez, other.IsSez);
            }
        }
        return $r;
    }
}

class SupplyType implements types.Union, Comparable<SupplyType> {
    final int tag;
    const SupplyType(this.tag);
    @override
    bool operator ==(Object other) => (other is SupplyType) && (other.tag == tag);
    @override
    int get hashCode => tag.hashCode;
    @override
    int compareTo(SupplyType other) => tag.compareTo(other.tag);
}

class TaxAmount implements types.Record, Comparable<TaxAmount> {
    final dynamic Igst;
    final dynamic Cgst;
    final dynamic Sgst;
    final types.Some<dynamic>? Cess;
    const TaxAmount(this.Igst, this.Cgst, this.Sgst, this.Cess);
    @override
    bool operator ==(Object other) => (other is TaxAmount) && (util.equalsDynamic(other.Igst, Igst) && (util.equalsDynamic(other.Cgst, Cgst) && (util.equalsDynamic(other.Sgst, Sgst) && (other.Cess == Cess))));
    @override
    int get hashCode => util.combineHashCodes([Igst.hashCode, Cgst.hashCode, Sgst.hashCode, Cess.hashCode]);
    @override
    int compareTo(TaxAmount other) {
        late int $r;
        if (($r = util.compareDynamic(Igst, other.Igst)) == 0) {
            if (($r = util.compareDynamic(Cgst, other.Cgst)) == 0) {
                if (($r = util.compareDynamic(Sgst, other.Sgst)) == 0) {
                    $r = util.compareNullable(Cess, other.Cess, (types.Some<dynamic> x, types.Some<dynamic> y) => x.compareTo(y));
                }
            }
        }
        return $r;
    }
}

class InvoiceItem implements types.Record, Comparable<InvoiceItem> {
    final String Hsn;
    final dynamic TaxableValue;
    final dynamic GstRate;
    final types.Some<dynamic>? CessRate;
    final TaxAmount Tax;
    const InvoiceItem(this.Hsn, this.TaxableValue, this.GstRate, this.CessRate, this.Tax);
    @override
    bool operator ==(Object other) => (other is InvoiceItem) && ((other.Hsn == Hsn) && (util.equalsDynamic(other.TaxableValue, TaxableValue) && (util.equalsDynamic(other.GstRate, GstRate) && ((other.CessRate == CessRate) && (other.Tax == Tax)))));
    @override
    int get hashCode => util.combineHashCodes([Hsn.hashCode, TaxableValue.hashCode, GstRate.hashCode, CessRate.hashCode, Tax.hashCode]);
    @override
    int compareTo(InvoiceItem other) {
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

class DocumentType$ implements types.Union, Comparable<DocumentType$> {
    final int tag;
    const DocumentType$(this.tag);
    @override
    bool operator ==(Object other) => (other is DocumentType$) && (other.tag == tag);
    @override
    int get hashCode => tag.hashCode;
    @override
    int compareTo(DocumentType$ other) => tag.compareTo(other.tag);
}

class Invoice implements types.Record, Comparable<Invoice> {
    final DocumentType$ DocumentType;
    final String InvoiceNumber;
    final String InvoiceDate;
    final types.Some<String>? OriginalInvoiceNumber;
    final types.Some<String>? OriginalInvoiceDate;
    final types.Some<String>? Irn;
    final bool ReverseCharge;
    final Party Seller;
    final types.Some<Party>? Buyer;
    final list.FSharpList<InvoiceItem> Items;
    const Invoice(this.DocumentType, this.InvoiceNumber, this.InvoiceDate, this.OriginalInvoiceNumber, this.OriginalInvoiceDate, this.Irn, this.ReverseCharge, this.Seller, this.Buyer, this.Items);
    @override
    bool operator ==(Object other) => (other is Invoice) && ((other.DocumentType == DocumentType) && ((other.InvoiceNumber == InvoiceNumber) && ((other.InvoiceDate == InvoiceDate) && ((other.OriginalInvoiceNumber == OriginalInvoiceNumber) && ((other.OriginalInvoiceDate == OriginalInvoiceDate) && ((other.Irn == Irn) && ((other.ReverseCharge == ReverseCharge) && ((other.Seller == Seller) && ((other.Buyer == Buyer) && (other.Items == Items))))))))));
    @override
    int get hashCode => util.combineHashCodes([DocumentType.hashCode, InvoiceNumber.hashCode, InvoiceDate.hashCode, OriginalInvoiceNumber.hashCode, OriginalInvoiceDate.hashCode, Irn.hashCode, ReverseCharge.hashCode, Seller.hashCode, Buyer.hashCode, Items.hashCode]);
    @override
    int compareTo(Invoice other) {
        late int $r;
        if (($r = DocumentType.compareTo(other.DocumentType)) == 0) {
            if (($r = InvoiceNumber.compareTo(other.InvoiceNumber)) == 0) {
                if (($r = InvoiceDate.compareTo(other.InvoiceDate)) == 0) {
                    if (($r = util.compareNullable(OriginalInvoiceNumber, other.OriginalInvoiceNumber, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
                        if (($r = util.compareNullable(OriginalInvoiceDate, other.OriginalInvoiceDate, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
                            if (($r = util.compareNullable(Irn, other.Irn, (types.Some<String> x, types.Some<String> y) => x.compareTo(y))) == 0) {
                                if (($r = util.compareBool(ReverseCharge, other.ReverseCharge)) == 0) {
                                    if (($r = Seller.compareTo(other.Seller)) == 0) {
                                        if (($r = util.compareNullable(Buyer, other.Buyer, (types.Some<Party> x, types.Some<Party> y) => x.compareTo(y))) == 0) {
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
        return $r;
    }
}

class GSTCanonicalIR implements types.Record, Comparable<GSTCanonicalIR> {
    final Invoice SourceInvoice;
    final SupplyType DerivedSupplyType;
    final String PlaceOfSupply;
    final bool IsInterstate;
    const GSTCanonicalIR(this.SourceInvoice, this.DerivedSupplyType, this.PlaceOfSupply, this.IsInterstate);
    @override
    bool operator ==(Object other) => (other is GSTCanonicalIR) && ((other.SourceInvoice == SourceInvoice) && ((other.DerivedSupplyType == DerivedSupplyType) && ((other.PlaceOfSupply == PlaceOfSupply) && (other.IsInterstate == IsInterstate))));
    @override
    int get hashCode => util.combineHashCodes([SourceInvoice.hashCode, DerivedSupplyType.hashCode, PlaceOfSupply.hashCode, IsInterstate.hashCode]);
    @override
    int compareTo(GSTCanonicalIR other) {
        late int $r;
        if (($r = SourceInvoice.compareTo(other.SourceInvoice)) == 0) {
            if (($r = DerivedSupplyType.compareTo(other.DerivedSupplyType)) == 0) {
                if (($r = PlaceOfSupply.compareTo(other.PlaceOfSupply)) == 0) {
                    $r = util.compareBool(IsInterstate, other.IsInterstate);
                }
            }
        }
        return $r;
    }
}

