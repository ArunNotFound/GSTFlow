# GSTFlow

**The Semantic GST Validation Engine.**  
GSTFlow is a strict, mathematical compiler that parses raw ERP invoices (JSON or extracted PDF) and mathematically proves their compliance with Indian GST law before they are emitted as a GSTR-1 payload.

## ⚠️ LEGAL DISCLAIMER

**THIS IS NOT TAX ADVICE.**  
GSTFlow (and CanonFlow) takes **zero liability** for your GSTR-1 filings, financial penalties, or tax disputes. This tool is an open-source structural validation engine provided "AS IS". The user assumes all responsibility for verifying the accuracy of the tax amounts, Place of Supply rules, and HSN classifications before filing with the Government of India portal. By using this software, you agree that you are solely responsible for your own compliance.

---

## 🏛️ The One-Engine Principle (D0)

GSTFlow is built in strict **F#**. The semantic rules are written once. 
1. It compiles to a **Native AOT CLI** for CI/CD and backend infrastructure.
2. It transpiles (via Fable) to pure **WebAssembly/JavaScript** to run 100% offline in the browser.

Our CI pipeline guarantees that both environments yield byte-identical verdicts. **The laws do not drift.**

## 🚀 Modes of Operation

### 1. The Native CLI (Infrastructure)
Run validations natively in your terminal.
```bash
# Validate an invoice
gstflow --validate invoice.json

# Emit a GSTR-1 payload
gstflow --emit-gstr1 invoice.json

# Generate a Cryptographic Proof of laws verified
gstflow --prove invoice.json
```

### 2. The Wasm Playground (Browser)
A fully offline React application that runs the strict F# core entirely in your browser. 
- **PDF Intake Engine:** Drop a raw PDF invoice. We use `pdf.js` to extract text locally and map heuristics, generating a confidence-scored confirmation screen.
- **Vernacular Verdicts:** If an invoice fails the law, the raw technical jargon (e.g. `IGST_CGST_LAW`) is mapped to plain-language, actionable hints in both **English and Hindi** for MSME owners.

## 🧪 Validated Rules (Phase G3)

GSTFlow strictly enforces:
- **GSTIN Structural Integrity:** Mod-36 Checksum verification.
- **State Code Boundary Enforcement:** Derives Intra-state vs Inter-state supply dynamically.
- **Mathematical Tax Splitting:** Enforces exact IGST vs (CGST + SGST) slab mechanics. Interstate supply cannot legally charge local taxes, and vice versa.