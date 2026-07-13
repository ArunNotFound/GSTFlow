using System;
using System.Runtime.InteropServices;
using System.Text;
using GSTFlow.Core;

namespace GSTFlow.NativeExports;

public static class Exports
{
    [UnmanagedCallersOnly(EntryPoint = "verify_gstin")]
    public static unsafe IntPtr VerifyGstin(byte* utf8Input)
    {
        try
        {
            string? gstin = Marshal.PtrToStringUTF8((IntPtr)utf8Input);
            if (string.IsNullOrWhiteSpace(gstin))
            {
                return AllocateUtf8String("{\"error\":\"Input cannot be empty\"}");
            }

            var result = GSTINModule.create(gstin);
            if (result.IsOk)
            {
                return AllocateUtf8String("{\"valid\":true}");
            }
            else
            {
                var error = result.ErrorValue;
                // Escape quotes in error message
                error = error.Replace("\"", "\\\"");
                return AllocateUtf8String("{\"valid\":false,\"error\":\"" + error + "\"}");
            }
        }
        catch (Exception ex)
        {
            return AllocateUtf8String("{\"error\":\"" + ex.Message.Replace("\"", "\\\"") + "\"}");
        }
    }

    [UnmanagedCallersOnly(EntryPoint = "free_string")]
    public static unsafe void FreeString(IntPtr ptr)
    {
        if (ptr != IntPtr.Zero)
        {
            NativeMemory.Free((void*)ptr);
        }
    }

    private static unsafe IntPtr AllocateUtf8String(string str)
    {
        int byteCount = Encoding.UTF8.GetByteCount(str);
        byte* buffer = (byte*)NativeMemory.Alloc((nuint)byteCount + 1);
        Encoding.UTF8.GetBytes(str, new Span<byte>(buffer, byteCount));
        buffer[byteCount] = 0; // null terminator
        return (IntPtr)buffer;
    }
}
