import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:syncfusion_flutter_pdf/pdf.dart';

class PdfExtractorService {
  /// The local Ollama endpoint (must have ollama running locally with a model like llama3 or mistral)
  static const String _ollamaEndpoint = 'http://localhost:11434/api/generate';
  static const String _ollamaModel = 'llama3'; // Replace with preferred local model (e.g. phi3)

  /// The strict JSON schema we want the LLM to output
  static const String _jsonSchemaPrompt = '''
You are an expert Indian GST Invoice extraction AI.
Extract the invoice details from the text below into the following EXACT JSON structure.
Do not output any markdown, explanations, or text outside of the JSON. Only return raw JSON.

{
  "InvoiceNumber": "string",
  "InvoiceDate": "YYYY-MM-DD",
  "Seller": {
    "Gstin": "string",
    "StateCode": "string"
  },
  "Buyer": {
    "Gstin": "string",
    "StateCode": "string"
  },
  "Items": [
    {
      "Hsn": "string",
      "TaxableValue": number,
      "GstRate": number,
      "Tax": {
        "Igst": number,
        "Cgst": number,
        "Sgst": number
      }
    }
  ]
}

Invoice Text:
''';

  /// Extract text from a local PDF file
  Future<String> _extractTextFromPdf(String pdfPath) async {
    final File file = File(pdfPath);
    final List<int> bytes = await file.readAsBytes();
    
    // Load the PDF document
    final PdfDocument document = PdfDocument(inputBytes: bytes);
    
    // Extract text from all pages
    final PdfTextExtractor extractor = PdfTextExtractor(document);
    final String text = extractor.extractText();
    
    document.dispose();
    return text;
  }

  /// Send extracted text to a local LLM running via Ollama
  Future<String> _askLocalLlm(String invoiceText) async {
    final String prompt = '$_jsonSchemaPrompt\n$invoiceText';
    
    try {
      final response = await http.post(
        Uri.parse(_ollamaEndpoint),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'model': _ollamaModel,
          'prompt': prompt,
          'stream': false,
          'format': 'json', // Forces JSON output in newer Ollama versions
        }),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        return data['response'] as String;
      } else {
        throw Exception('Local LLM failed with status: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Could not connect to Local LLM. Ensure Ollama is running at localhost:11434. Error: $e');
    }
  }

  /// Main Pipeline: PDF File Path -> Extracted JSON String
  Future<String> processPdfToJson(String pdfPath) async {
    try {
      // 1. OCR / Text Extraction
      final String rawText = await _extractTextFromPdf(pdfPath);
      
      if (rawText.trim().isEmpty) {
        throw Exception('No text could be extracted from the PDF. It might be a scanned image without OCR layer.');
      }

      // 2. Local Privacy-Preserving LLM Extraction
      final String jsonResult = await _askLocalLlm(rawText);
      
      // 3. Return the JSON string (Ready to be fed into GstFlowNative)
      return jsonResult;
    } catch (e) {
      // Return a clean error JSON for the UI to handle
      return jsonEncode({
        "success": false,
        "error": "PDF Extraction Failed: ${e.toString()}"
      });
    }
  }
}
