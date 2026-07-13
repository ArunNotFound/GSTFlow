
import { exists, length } from "../fable_modules/fable-library-js.5.6.0/List.js";
import { fromParts, compare } from "../fable_modules/fable-library-js.5.6.0/Decimal.js";

export function emitSummaryJson(ir) {
    return `{
  "invoiceNumber": "${ir.SourceInvoice.InvoiceNumber}",
  "type": "${(ir.DerivedSupplyType.tag === 1) ? "B2C" : "B2B"}",
  "placeOfSupply": "${ir.PlaceOfSupply}",
  "taxClassification": "${ir.IsInterstate ? "IGST" : "CGST_SGST"}",
  "itemsCount": ${length(ir.SourceInvoice.Items)}
}`;
}

export function emitValidationReport(ir) {
    const expectedTax = ir.IsInterstate ? "IGST" : "CGST+SGST";
    const hasIgst = exists((i) => (compare(i.Tax.Igst, fromParts(0, 0, 0, false, 0)) > 0), ir.SourceInvoice.Items);
    const hasCgst = exists((i_1) => (compare(i_1.Tax.Cgst, fromParts(0, 0, 0, false, 0)) > 0), ir.SourceInvoice.Items);
    const hasSgst = exists((i_2) => (compare(i_2.Tax.Sgst, fromParts(0, 0, 0, false, 0)) > 0), ir.SourceInvoice.Items);
    const actualTax = ((hasIgst && !hasCgst) && !hasSgst) ? "IGST" : (((hasCgst && hasSgst) && !hasIgst) ? "CGST+SGST" : "MIXED_OR_INVALID");
    const status = (expectedTax === actualTax) ? "Passed" : "Failed";
    const grade = (status === "Passed") ? "Exact" : "Approximate";
    return `# GSTFlow Validation Report

## Invoice ${ir.SourceInvoice.InvoiceNumber}

Canonical GST IR: ${grade}
Summary JSON: ${grade}

## Verified Tax Logic

Seller state: ${ir.SourceInvoice.Seller.StateCode}
Place of supply: ${ir.PlaceOfSupply}
Supply type: ${ir.IsInterstate ? "Interstate" : "Intrastate"}
Expected tax: ${expectedTax}
Actual tax: ${actualTax}

Result: ${status}
`;
}

