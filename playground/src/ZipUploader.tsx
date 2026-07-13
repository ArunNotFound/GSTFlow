import React, { useState } from 'react';
import JSZip from 'jszip';
// @ts-ignore
import { compileInvoice } from './fable/Library.ts';

export default function ZipUploader() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setLogs([`Processing ${file.name}...`]);

    try {
      if (file.name.endsWith('.zip')) {
        const zip = await JSZip.loadAsync(file);
        const files = Object.keys(zip.files).filter(f => f.endsWith('.json'));
        setLogs(prev => [...prev, `Found ${files.length} JSON files in ZIP.`]);
        
        let passCount = 0;
        let failCount = 0;

        for (const fileName of files) {
          const content = await zip.files[fileName].async('string');
          const res = compileInvoice(content);
          if (res.success) {
            passCount++;
            setLogs(prev => [...prev, `✅ [PASS] ${fileName}`]);
          } else {
            failCount++;
            setLogs(prev => [...prev, `❌ [FAIL] ${fileName}: ${res.error}`]);
          }
        }
        
        setLogs(prev => [...prev, `Done. Passed: ${passCount}, Failed: ${failCount}`]);
      } else if (file.name.endsWith('.json')) {
        const text = await file.text();
        const res = compileInvoice(text);
        if (res.success) {
          setLogs(prev => [...prev, `✅ [PASS] ${file.name}`]);
        } else {
          setLogs(prev => [...prev, `❌ [FAIL] ${file.name}: ${res.error}`]);
        }
      } else {
        setLogs(prev => [...prev, `❌ Unsupported file type. Please upload a .json or .zip file.`]);
      }
    } catch (e: any) {
      setLogs(prev => [...prev, `❌ Error processing file: ${e.message}`]);
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col w-full h-full p-8 text-gray-200">
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-2xl bg-gray-900/50 p-10 hover:border-emerald-500/50 hover:bg-gray-800/50 transition-all cursor-pointer relative"
           onDragOver={(e) => e.preventDefault()}
           onDrop={(e) => {
             e.preventDefault();
             if (e.dataTransfer.files && e.dataTransfer.files[0]) {
               processFile(e.dataTransfer.files[0]);
             }
           }}
      >
        <input 
          type="file" 
          accept=".json,.zip" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processFile(e.target.files[0]);
            }
          }}
        />
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-xl">
          <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Drop JSON or ZIP File Here</h3>
        <p className="text-gray-500 max-w-md text-center">
          Upload a single invoice JSON, or a ZIP archive containing multiple JSON invoices for bulk offline verification.
        </p>
      </div>

      {logs.length > 0 && (
        <div className="mt-6 h-48 bg-black rounded-xl p-4 font-mono text-sm overflow-y-auto border border-gray-800 shadow-inner">
          {logs.map((log, i) => (
            <div key={i} className={`mb-1 ${log.includes('✅') ? 'text-emerald-400' : log.includes('❌') ? 'text-red-400' : 'text-gray-400'}`}>
              {log}
            </div>
          ))}
          {isProcessing && <div className="text-gray-500 animate-pulse mt-2">Processing...</div>}
        </div>
      )}
    </div>
  );
}
