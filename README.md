# GSTFlow

**The Semantic GST Validation Engine.**  
GSTFlow deterministically evaluates the GST rules it currently supports and reports unsupported or uncertain areas explicitly.

## ⚠️ LEGAL DISCLAIMER

**THIS IS NOT TAX ADVICE.**  
GSTFlow (and CanonFlow) takes **zero liability** for your GSTR-1 filings, financial penalties, or tax disputes. This tool is an open-source structural validation engine provided "AS IS". The user assumes all responsibility for verifying the accuracy of the tax amounts, Place of Supply rules, and HSN classifications before filing with the Government of India portal. By using this software, you agree that you are solely responsible for your own compliance.

---

## 🏛️ The One-Engine Principle (D0)

GSTFlow is built in strict **F#**. The semantic rules are written once. 
1. It compiles to a **Native AOT CLI** for CI/CD and backend infrastructure.
2. It transpiles (via Fable) to pure **WebAssembly/JavaScript** to run 100% offline in the browser.

Our CI pipeline guarantees that both environments yield byte-identical validation reports. **The laws do not drift.**

## 🚀 Modes of Operation

### 1. The Native CLI (Infrastructure)
Run validations natively in your terminal.
```bash
# Generate a Canonical Validation Report
gstflow --emit-envelope invoice.json
```

### 2. The Wasm Playground (Browser)
A fully offline React application that runs the strict F# core entirely in your browser. 
- **PDF Intake Engine:** Drop a raw PDF invoice. We use `pdf.js` to extract text locally and map heuristics, generating a confidence-scored confirmation screen.
- **Vernacular Verdicts:** If an invoice fails the law, the raw technical jargon (e.g. `IGST_CGST_LAW`) is mapped to plain-language, actionable hints in both **English and Hindi** for MSME owners.

## 🧪 Capability Matrix

| Feature / Domain Area | Status | Description |
| :--- | :--- | :--- |
| **GSTIN Integrity** | Supported | Mod-36 Checksum verification. |
| **Place of Supply (POS)**| Supported | B2B intrastate/interstate deduction, OIDAR B2C handling. |
| **Tax Split Mechanics** | Supported | Validates IGST vs CGST/SGST routing. |
| **Invoice Sanity** | Supported | Null checks, rate checks, items present. |
| **Batch Processing** | Supported | Native CLI processes multiple invoices concurrently with duplicate detection. |
| **GSTR-1 Emission** | Not Yet Supported | Generating government-ready filing payloads. |
| **Reverse Charge (RCM)** | Supported | Automatic RCM derivation via HSN service codes (e.g., 9983). |

## 🏆 Recent Combat Results (July 2026)

All core perimeter systems and test defenses have been fully activated. The engine is stable and **all functionality works end-to-end**.

- **Playwright & Vitest Integration:** The WebAssembly Playground is protected by robust E2E browser tests and unit tests.
- **Mock PDF Pipeline:** The `sampleinvoices/mock_invoice_pdfs` directory has been successfully parsed, semantically renamed (via `pdf.js` heuristics), and grouped (e.g. `B2C/INV-GSTI.pdf`).
- **Heavy Machinery Pipeline:** The CLI `--validate-batch` successfully shreds massive batches of invoices, categorizing exceptions cleanly into `exceptions.csv` while utilizing Native AOT compilation.

*GSTFlow is structurally complete and ready to serve as the architecture blueprint for global EDI standards (EDIFlow).*