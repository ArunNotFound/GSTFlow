// ignore_for_file: camel_case_types, constant_identifier_names, non_constant_identifier_names, unnecessary_this
import '../GSTFlow.Core/Library.dart' as library;
import '../fable_modules/fable_library/Decimal.dart' as decimal;
import '../fable_modules/fable_library/List.dart' as list_3;

String emitSummaryJson(library.GSTCanonicalIR ir) => '''{
  "invoiceNumber": "${ir.SourceInvoice.InvoiceNumber}",
  "type": "${(ir.DerivedSupplyType.tag == /* B2C */ 1) ? 'B2C' : 'B2B'}",
  "placeOfSupply": "${ir.PlaceOfSupply}",
  "taxClassification": "${ir.IsInterstate ? 'IGST' : 'CGST_SGST'}",
  "itemsCount": ${list_3.length<library.InvoiceItem>(ir.SourceInvoice.Items)}
}''';

String emitValidationReport(library.GSTCanonicalIR ir) {
    final String expectedTax = ir.IsInterstate ? 'IGST' : 'CGST+SGST';
    final bool hasIgst = list_3.exists<library.InvoiceItem>((library.InvoiceItem i) => i.Tax.Igst.compareTo(decimal.fromParts(0, 0, 0, false, 0)) > 0, ir.SourceInvoice.Items);
    final bool hasCgst = list_3.exists<library.InvoiceItem>((library.InvoiceItem i_1) => i_1.Tax.Cgst.compareTo(decimal.fromParts(0, 0, 0, false, 0)) > 0, ir.SourceInvoice.Items);
    final bool hasSgst = list_3.exists<library.InvoiceItem>((library.InvoiceItem i_2) => i_2.Tax.Sgst.compareTo(decimal.fromParts(0, 0, 0, false, 0)) > 0, ir.SourceInvoice.Items);
    final String actualTax = ((hasIgst && !hasCgst) && !hasSgst) ? 'IGST' : (((hasCgst && hasSgst) && !hasIgst) ? 'CGST+SGST' : 'MIXED_OR_INVALID');
    final String status = (expectedTax == actualTax) ? 'Passed' : 'Failed';
    final String grade = (status == 'Passed') ? 'Exact' : 'Approximate';
    return '''# GSTFlow Validation Report

## Invoice ${ir.SourceInvoice.InvoiceNumber}

Canonical GST IR: $grade
Summary JSON: $grade

## Verified Tax Logic

Seller state: ${ir.SourceInvoice.Seller.StateCode}
Place of supply: ${ir.PlaceOfSupply}
Supply type: ${ir.IsInterstate ? 'Interstate' : 'Intrastate'}
Expected tax: $expectedTax
Actual tax: $actualTax

Result: $status
''';
}

