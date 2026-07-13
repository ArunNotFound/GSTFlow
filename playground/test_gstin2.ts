import { compileInvoice } from './src/fable/Library.ts';

const validInvoice = {
    "InvoiceNumber": "INV-100",
    "InvoiceDate": "2026-07-08",
    "Seller": {
      "Gstin": "29ABCDE1234F1ZW",
      "StateCode": "29"
    },
    "Buyer": {
      "Gstin": "33GSPTN0802G1ZL",
      "StateCode": "33"
    },
    "Items": [
      {
        "Hsn": "84713010",
        "TaxableValue": 100000,
        "GstRate": 18,
        "Tax": {
          "Igst": 18000,
          "Cgst": 0,
          "Sgst": 0
        }
      }
    ]
  };
const res = compileInvoice(JSON.stringify(validInvoice), "hash");
console.log(JSON.stringify(res, null, 2));
