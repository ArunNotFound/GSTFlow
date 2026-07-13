import 'dart:ffi';
import 'dart:io';
import 'package:ffi/ffi.dart';
import 'dart:convert';

typedef VerifyInvoiceC = Pointer<Utf8> Function(Pointer<Utf8> jsonPtr);
typedef VerifyInvoiceDart = Pointer<Utf8> Function(Pointer<Utf8> jsonPtr);

typedef FreeStringC = Void Function(Pointer<Utf8> ptr);
typedef FreeStringDart = void Function(Pointer<Utf8> ptr);

class GstFlowNative {
  static final GstFlowNative _instance = GstFlowNative._internal();
  factory GstFlowNative() => _instance;

  late DynamicLibrary _dylib;
  late VerifyInvoiceDart _verifyInvoice;
  late FreeStringDart _freeString;

  GstFlowNative._internal() {
    _dylib = _loadLibrary();
    _verifyInvoice = _dylib
        .lookup<NativeFunction<VerifyInvoiceC>>('verify_invoice')
        .asFunction();
    _freeString = _dylib
        .lookup<NativeFunction<FreeStringC>>('free_string')
        .asFunction();
  }

  DynamicLibrary _loadLibrary() {
    if (Platform.isWindows) {
      return DynamicLibrary.open('GSTFlow.Native.dll');
    } else if (Platform.isLinux) {
      return DynamicLibrary.open('GSTFlow.Native.so');
    } else if (Platform.isMacOS) {
      return DynamicLibrary.open('GSTFlow.Native.dylib');
    }
    throw UnsupportedError('This platform is not supported by GSTFlow NativeAOT');
  }

  Map<String, dynamic> verifyInvoice(String jsonInvoice) {
    // 1. Convert Dart String to C String (UTF-8 Pointer)
    final Pointer<Utf8> jsonPtr = jsonInvoice.toNativeUtf8();

    try {
      // 2. Call Native AOT function
      final Pointer<Utf8> resultPtr = _verifyInvoice(jsonPtr);

      try {
        // 3. Convert resulting C String back to Dart String
        final String resultJson = resultPtr.toDartString();
        
        // 4. Parse the tightly packed JSON response from F#
        return jsonDecode(resultJson) as Map<String, dynamic>;
      } finally {
        // 5. CRITICAL: Free the C String allocated by F# NativeAOT
        _freeString(resultPtr);
      }
    } finally {
      // 6. Free the C String allocated by Dart
      malloc.free(jsonPtr);
    }
  }
}
