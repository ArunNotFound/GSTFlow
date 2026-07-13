using System;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Linq;
using Thoth.Json.Net;
using Microsoft.FSharp.Core;

// F# project references
using GSTFlow.Core;
using GSTFlow.Rules;
using GSTFlow.Emit;

namespace GSTFlow.Native
{
    public static class NativeInterface
    {
        // Helper to convert C-style string to C# string
        private static string? PtrToString(IntPtr ptr)
        {
            if (ptr == IntPtr.Zero) return null;
            return Marshal.PtrToStringUTF8(ptr);
        }

        // Helper to convert C# string to C-style string pointer (UTF-8)
        private static IntPtr StringToPtr(string str)
        {
            if (string.IsNullOrEmpty(str)) return IntPtr.Zero;
            return Marshal.StringToCoTaskMemUTF8(str);
        }

        [UnmanagedCallersOnly(EntryPoint = "verify_invoice")]
        public static IntPtr VerifyInvoice(IntPtr jsonPtr)
        {
            try
            {
                string? jsonString = PtrToString(jsonPtr);
                if (string.IsNullOrWhiteSpace(jsonString))
                {
                    return StringToPtr("{\"success\":false,\"error\":\"Empty input\"}");
                }

                // Use Thoth.Json.Net to decode just like CLI
                var extra = Extra.withDecimal(Extra.empty);
                var decodeResult = Decode.Auto.fromString<RawInvoice>(jsonString, null, extra);

                if (decodeResult.IsOk)
                {
                    var rawInvoice = decodeResult.ResultValue;
                    string hash = Hash.computeSha256(jsonString);
                    var result = Compiler.compile(rawInvoice, hash);

                    var serializeEnv = new Func<GSTFlow.Core.Verification.VerdictEnvelope, string>(
                        env => System.Text.Json.JsonSerializer.Serialize(env)
                    );

                    var violationsList = result.Envelope.Results
                        .Where(r => r.Outcome.IsFail)
                        .Select(r => $"{{\"Rule\":\"{r.Metadata.RuleId}\",\"Description\":\"{r.Metadata.MessageKey}\"}}");
                    string violationsJson = $"[{string.Join(",", violationsList)}]";

                    if (result.IR != null && result.IR.Value != null)
                    {
                        var ir = result.IR.Value;
                        string summary = Generators.emitSummaryJson(ir);
                        string summaryEscaped = "\"" + summary.Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "") + "\"";
                        
                        string proof = Generators.emitValidationReport(ir);
                        string proofEscaped = "\"" + proof.Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "") + "\"";
                        
                        string envelopeStr = serializeEnv(result.Envelope);
                        
                        string outJson = $"{{\"success\":true,\"summary\":{summaryEscaped},\"proof\":{proofEscaped},\"envelope\":{envelopeStr},\"violations\":{violationsJson},\"error\":null}}";
                        return StringToPtr(outJson);
                    }
                    else
                    {
                        string envelopeStr = serializeEnv(result.Envelope);
                        string outJson = $"{{\"success\":false,\"summary\":null,\"proof\":null,\"envelope\":{envelopeStr},\"violations\":{violationsJson},\"error\":\"Validation failed\"}}";
                        return StringToPtr(outJson);
                    }
                }
                else
                {
                    string err = decodeResult.ErrorValue;
                    string escapedErr = err.Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "");
                    return StringToPtr($"{{\"success\":false,\"summary\":null,\"proof\":null,\"envelope\":null,\"violations\":[],\"error\":\"{escapedErr}\"}}");
                }
            }
            catch (Exception ex)
            {
                string err = ex.Message.Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "");
                return StringToPtr($"{{\"success\":false,\"summary\":null,\"proof\":null,\"envelope\":null,\"violations\":[],\"error\":\"{err}\"}}");
            }
        }

        [UnmanagedCallersOnly(EntryPoint = "free_string")]
        public static void FreeString(IntPtr ptr)
        {
            if (ptr != IntPtr.Zero)
            {
                Marshal.FreeCoTaskMem(ptr);
            }
        }
    }
}
