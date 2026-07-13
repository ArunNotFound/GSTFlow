import 'package:test/test.dart';
import 'package:gstflow/invoice_parser.dart';
import 'package:gstflow/fable_dart/Library.dart' as engine;
import 'dart:convert';
import 'dart:io';
import 'package:crypto/crypto.dart';

void main() {
  group('Flutter Matrix Tests (Dart Engine vs JSON Fixtures)', () {
    
    // Helper to run a fixture and return violations
    List<dynamic> runFixture(String filename) {
      final file = File('../fixtures/$filename');
      final jsonStr = file.readAsStringSync();
      final rawInvoice = InvoiceParser.parse(jsonStr);
      final hash = sha256.convert(utf8.encode(jsonStr)).toString();
      final result = engine.compileInvoice(rawInvoice, hash);
      return result.Envelope.Results.where((r) => r.Outcome.tag != 0).toList();
    }

    test('fixture_1_intrastate_b2b.json - Should pass', () {
      final violations = runFixture('fixture_1_intrastate_b2b.json');
      expect(violations.isEmpty, true, reason: 'Expected to pass');
    });

    test('fixture_2_intrastate_b2c.json - Should pass', () {
      final violations = runFixture('fixture_2_intrastate_b2c.json');
      expect(violations.isEmpty, true, reason: 'Expected to pass');
    });

    test('fixture_3_falsifier.json - Should fail with IGST_CGST_LAW', () {
      final violations = runFixture('fixture_3_falsifier.json');
      expect(violations.any((v) => v.Metadata.RuleId == 'IGST_CGST_LAW'), true);
    });

    test('fixture_4_bad_check_character.json - Should fail with GSTIN_FORMAT', () {
      final violations = runFixture('fixture_4_bad_check_character.json');
      expect(violations.any((v) => v.Metadata.RuleId == 'GSTIN_FORMAT'), true);
    });

    test('fixture_5_both_taxes.json - Should fail with IGST_CGST_LAW', () {
      final violations = runFixture('fixture_5_both_taxes.json');
      expect(violations.any((v) => v.Metadata.RuleId == 'IGST_CGST_LAW'), true);
    });

    test('fixture_6_off_slab.json - Should fail with RATE_SLAB', () {
      final violations = runFixture('fixture_6_off_slab.json');
      expect(violations.any((v) => v.Metadata.RuleId == 'RATE_SLAB'), true);
    });

    test('fixture_7_sanity.json - Should fail with GSTIN_FORMAT and INV_SANITY_ITEMS', () {
      final violations = runFixture('fixture_7_sanity.json');
      expect(violations.any((v) => v.Metadata.RuleId == 'GSTIN_FORMAT'), true);
      expect(violations.any((v) => v.Metadata.RuleId == 'INV_SANITY_ITEMS'), true);
    });

    test('fixture_8_rcm.json - Should pass', () {
      final violations = runFixture('fixture_8_rcm.json');
      expect(violations.isEmpty, true);
    });

    test('fixture_9_rcm_bad.json - Should fail with RCM_TAX_CHARGED', () {
      final violations = runFixture('fixture_9_rcm_bad.json');
      expect(violations.any((v) => v.Metadata.RuleId == 'RCM_TAX_CHARGED'), true);
    });

    // Real world invoices (Phase 1 engine fixed to allow them to pass)
    test('invoice_1_real.json - Should pass', () {
      final violations = runFixture('invoice_1_real.json');
      expect(violations.isEmpty, true);
    });
    
    test('invoice_2_real.json - Should pass', () {
      final violations = runFixture('invoice_2_real.json');
      expect(violations.isEmpty, true);
    });
    
    test('invoice_3_real.json - Should pass', () {
      final violations = runFixture('invoice_3_real.json');
      expect(violations.isEmpty, true);
    });
    
    test('invoice_4_real.json - Should pass', () {
      final violations = runFixture('invoice_4_real.json');
      expect(violations.isEmpty, true);
    });
    
    test('invoice_5_saas.json - Should pass', () {
      final violations = runFixture('invoice_5_saas.json');
      expect(violations.isEmpty, true);
    });
  });
}
