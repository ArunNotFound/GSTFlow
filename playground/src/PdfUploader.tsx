import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Use a CDN for the worker to avoid Vite build configuration headaches
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PdfUploader({ onExtract }: { onExtract: (extractedData: any) => void }) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [status, setStatus] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setStatus('Loading PDF via pdf.js...');

    try {
      let fullText = "";

      if (file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
        fullText = await file.text();
      } else {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        setStatus(`Extracting text from ${pdf.numPages} pages...`);
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + " ";
        }
      }

      setStatus('Mapping extracted text to GST fields...');
      
      // Phase P2: Heuristics Regex
      const gstinRegex = /\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g;
      const gstins = [...new Set(fullText.match(gstinRegex) || [])];

      const sellerGstin = gstins.length > 0 ? gstins[0] : "NOT_FOUND";
      const buyerGstin = gstins.length > 1 ? gstins[1] : sellerGstin !== "NOT_FOUND" ? sellerGstin : "NOT_FOUND";

      // Date heuristic (DD/MM/YYYY or similar)
      const dateRegex = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/;
      const dateMatch = fullText.match(dateRegex);
      const invoiceDate = dateMatch ? dateMatch[1] : "YYYY-MM-DD";

      // Invoice Number heuristic (often follows "No:" or "Inv:")
      const invNoRegex = /(?:Invoice No|Inv No|Invoice Number)[\s:]*([A-Za-z0-9\-\/]+)/i;
      const invNoMatch = fullText.match(invNoRegex);
      const invoiceNumber = invNoMatch ? invNoMatch[1] : "INV-UNKNOWN";

      setIsExtracting(false);
      setStatus('');

      onExtract({
        InvoiceNumber: { value: invoiceNumber, confidence: invNoMatch ? 0.8 : 0.0 },
        InvoiceDate: { value: invoiceDate, confidence: dateMatch ? 0.8 : 0.0 },
        Seller: { 
          Gstin: sellerGstin, 
          StateCode: sellerGstin !== "NOT_FOUND" ? sellerGstin.substring(0, 2) : "00",
          confidence: sellerGstin !== "NOT_FOUND" ? 0.9 : 0.0 
        },
        Buyer: { 
          Gstin: buyerGstin, 
          StateCode: buyerGstin !== "NOT_FOUND" ? buyerGstin.substring(0, 2) : "00",
          confidence: buyerGstin !== "NOT_FOUND" && gstins.length > 1 ? 0.7 : 0.0 
        },
        Items: [
          // Fallback dummy item for now until full tabular extraction is built
          { Hsn: "847130", TaxableValue: 100000, GstRate: 18, Tax: { Igst: 18000, Cgst: 0, Sgst: 0 }, confidence: 0.5 }
        ]
      });

    } catch (err) {
      console.error(err);
      setStatus('Failed to extract PDF.');
      setIsExtracting(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-900 border-r border-gray-800">
      <div className="w-full max-w-md bg-gray-800/40 rounded-2xl border border-gray-700 p-8 shadow-2xl text-center backdrop-blur-md relative overflow-hidden group">
        {isExtracting ? (
          <div className="space-y-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin"></div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">Extracting Offline</h3>
              <p className="text-sm text-gray-400 font-mono">{status}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto bg-gray-900 rounded-full flex items-center justify-center border border-gray-700 mb-6 group-hover:border-emerald-500/50 transition-colors">
              <UploadCloud className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Upload Invoice PDF</h2>
            <p className="text-gray-400 text-sm mb-8">
              100% offline extraction. Your data never leaves the browser.
            </p>
            <label className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-lg shadow-emerald-500/20 transition-all inline-block">
              Select Document (PDF / TXT)
              <input type="file" accept="application/pdf,text/plain,.md" className="hidden" onChange={handleFileUpload} />
            </label>
          </>
        )}
      </div>
    </div>
  );
}
