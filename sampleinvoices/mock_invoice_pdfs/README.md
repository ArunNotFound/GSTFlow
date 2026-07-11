# Mock Invoice PDFs - Testing Payload

This directory serves as the **payload testing ground** for the GSTFlow ingestion pipeline. It contains 21 distinct PDF invoice structures (ranging from standard GST invoices to Proforma, Civil, Marketing, and Freight invoices).

## Strategic Purpose

The purpose of these PDFs is to validate the robustness of our **Intake Systems**. In a real-world environment, clients do not always provide clean canonical JSON. They provide raw, unstructured PDFs. 

Our systems must be capable of:
1. **Parsing** the raw text from the PDFs.
2. **Classifying** and mapping the extracted text into the `RawInvoice` JSON schema.
3. **Validating** the resulting JSON through the immutable `CanonFlow` core engine.

## Extraction Pipelines

We have established two primary mechanisms for handling these payloads:

### 1. Browser-Native Extraction (WASM Playground)
The React/Vite playground features a 100% offline `PdfUploader.tsx` component. 
- It uses `pdf.js` to extract text streams natively within the browser context.
- It applies advanced heuristic Regex mapping to identify GSTINs, HSN codes, Invoice Dates, and Invoice Numbers.
- It immediately pipes the resulting structure into the Fable-compiled F# Core for validation.

### 2. High-Fidelity Extraction (CLI / Firecrawl)
For complex, tabular data where simple heuristics fail, we utilize LLM-assisted parsing (e.g., `firecrawl-parse`) to semantically reconstruct the document into a strict JSON envelope before passing it to the `GSTFlow.Cli` `--validate-batch` processor.

## Victory Results 🏆

During the **Trinity Integration Phase**, these PDFs were successfully used to rig the Playwright End-to-End (E2E) testing framework. 
- The React Playground successfully intercepts mock invoice payloads.
- The Vitest & JSDOM suites verify the UI without crashing on web-worker instantiations.
- Playwright automatically types the extracted JSON structure and asserts the mathematical validation outcomes.

**Status:** ALL SYSTEMS GREEN. Ready for EDIFlow.
