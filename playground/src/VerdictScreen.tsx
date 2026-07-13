import React from 'react';
import { Share2, Download, CheckCircle, XCircle } from 'lucide-react';

export default function VerdictScreen({ 
  isSuccess, 
  violations, 
  invoiceData, 
  onReset 
}: { 
  isSuccess: boolean;
  violations: any[];
  invoiceData: any;
  onReset: () => void;
}) {
  
  const parsedData = invoiceData ? JSON.parse(invoiceData) : null;
  const sellerGstin = parsedData?.Seller?.Gstin || "N/A";
  const invoiceNumber = parsedData?.InvoiceNumber || "N/A";
  const invoiceDate = parsedData?.InvoiceDate || "N/A";
  
  const totalAmount = parsedData?.Items?.reduce((sum: number, item: any) => {
    return sum + item.TaxableValue + item.Tax.Igst + item.Tax.Cgst + item.Tax.Sgst;
  }, 0) || 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 p-6 overflow-y-auto">
      
      {/* WhatsApp Share Card Container */}
      <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col">
        
        {/* Header - Green for Pass, Red for Fail */}
        <div className={`p-6 flex flex-col items-center text-center ${isSuccess ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
          {isSuccess ? (
            <>
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Invoice Validated</h2>
              <p className="text-emerald-400 font-medium mt-1">Safe to file in GSTR-1</p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Validation Failed</h2>
              <p className="text-red-400 font-medium mt-1">{violations.length} Rule Violations Found</p>
            </>
          )}
        </div>

        {/* Invoice Summary Data */}
        <div className="p-6 bg-gray-800 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-700 pb-3">
            <span className="text-gray-400 text-sm">Invoice No.</span>
            <span className="text-white font-mono font-medium">{invoiceNumber}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-700 pb-3">
            <span className="text-gray-400 text-sm">Date</span>
            <span className="text-white font-mono">{invoiceDate}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-700 pb-3">
            <span className="text-gray-400 text-sm">Seller GSTIN</span>
            <span className="text-white font-mono">{sellerGstin}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="text-gray-400 text-sm">Total Value</span>
            <span className="text-emerald-400 font-bold text-lg">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Violations List (if failed) */}
        {!isSuccess && violations.length > 0 && (
          <div className="px-6 pb-6 space-y-3">
            <h3 className="text-red-400 text-sm font-bold uppercase tracking-wider mb-2">Errors</h3>
            {violations.map((v, i) => (
              <div key={i} className="bg-red-950/40 p-3 rounded-lg border border-red-900/50">
                <div className="text-red-400 text-xs font-mono font-bold mb-1">{v.Rule}</div>
                <div className="text-gray-300 text-sm leading-snug">{v.Description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Actions Footer */}
        <div className="p-6 bg-gray-900 border-t border-gray-700 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share to CA</span>
          </button>
          <button 
            onClick={onReset}
            className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 font-medium py-3 rounded-xl transition-colors"
          >
            <span>Scan Another</span>
          </button>
        </div>

      </div>
    </div>
  );
}
