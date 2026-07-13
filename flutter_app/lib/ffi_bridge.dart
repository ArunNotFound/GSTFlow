import 'dart:ffi' as ffi;
import 'dart:io' show Platform;
import 'package:ffi/ffi.dart';
import 'dart:convert';

typedef VerifyGstinC = ffi.Pointer<Utf8> Function(ffi.Pointer<Utf8> utf8Input);
typedef VerifyGstinDart = ffi.Pointer<Utf8> Function(ffi.Pointer<Utf8> utf8Input);

typedef FreeStringC = ffi.Void Function(ffi.Pointer<Utf8> ptr);
typedef FreeStringDart = void Function(ffi.Pointer<Utf8> ptr);

class FfiBridge {
  late ffi.DynamicLibrary _lib;
  late VerifyGstinDart _verifyGstin;
  late FreeStringDart _freeString;

  FfiBridge() {
    if (Platform.isAndroid) {
      _lib = ffi.DynamicLibrary.open('libgstflow.so');
    } else if (Platform.isWindows) {
      _lib = ffi.DynamicLibrary.open('gstflow.dll');
    } else if (Platform.isLinux) {
      _lib = ffi.DynamicLibrary.open('libgstflow.so');
    } else if (Platform.isMacOS) {
      _lib = ffi.DynamicLibrary.open('libgstflow.dylib');
    } else if (Platform.isIOS) {
      _lib = ffi.DynamicLibrary.executable(); // iOS uses statically linked executable
    } else {
      throw UnsupportedError('Unsupported platform');
    }

    _verifyGstin = _lib.lookupFunction<VerifyGstinC, VerifyGstinDart>('verify_gstin');
    _freeString = _lib.lookupFunction<FreeStringC, FreeStringDart>('free_string');
  }

  Map<String, dynamic> verifyGstin(String gstin) {
    final inputPtr = gstin.toNativeUtf8();
    final resultPtr = _verifyGstin(inputPtr);
    
    final resultStr = resultPtr.toDartString();
    
    // Free the memory allocated by NativeAOT and by Dart
    _freeString(resultPtr);
    malloc.free(inputPtr);
    
    return jsonDecode(resultStr);
  }
}

final ffiBridge = FfiBridge();
