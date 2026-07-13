// ignore_for_file: camel_case_types, constant_identifier_names, non_constant_identifier_names, unnecessary_this
import './GSTFlow.Core/Library.dart' as library_2;
import './GSTFlow.Emit/Library.dart' as library_1;
import './GSTFlow.Rules/Library.dart' as library;

library.CompilationResult compileInvoice(library.RawInvoice invoice, String hash) => library.Compiler_compile(invoice, hash);

String emitSummary(library_2.GSTCanonicalIR ir) => library_1.emitSummaryJson(ir);

String emitReport(library_2.GSTCanonicalIR ir) => library_1.emitValidationReport(ir);

