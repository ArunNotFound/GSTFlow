import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { compileInvoice } from './src/fable/Library.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '../fixtures');
const fixtures = ['fixture_1_intrastate_b2b.json', 'fixture_2_intrastate_b2c.json', 'fixture_3_falsifier.json', 'fixture_4_bad_check_character.json', 'fixture_5_both_taxes.json', 'fixture_6_off_slab.json'];

let exitCode = 0;

for (const fixture of fixtures) {
    const jsonString = fs.readFileSync(path.join(fixturesDir, fixture), 'utf-8');
    const result = compileInvoice(jsonString, `sha256:dummy_hash_for_${fixture}`);
    
    console.log(`--- Testing ${fixture} ---`);
    if (result.success) {
        console.log(`✅ Validates successfully!`);
    } else {
        console.log(`❌ Validation Failed:`);
        if (result.violations) {
            for (const v of result.violations) {
                console.log(`  [${v.Rule}] ${v.Description}`);
            }
        } else {
            console.log(`  Error: ${result.error}`);
        }
    }
}

// Ensure fixture 3 fails with specific rule
const f3Json = fs.readFileSync(path.join(fixturesDir, 'fixture_3_falsifier.json'), 'utf-8');
const f3Res = compileInvoice(f3Json, 'sha256:dummy');
if (f3Res.success || !f3Res.violations.some((v: any) => v.Rule === 'IGST_CGST_LAW')) {
    console.error("CRITICAL: Fixture 3 did not produce expected IGST_CGST_LAW violation in JS!");
    exitCode = 1;
}

// Ensure fixture 4 fails with GSTIN format rule
const f4Json = fs.readFileSync(path.join(fixturesDir, 'fixture_4_bad_check_character.json'), 'utf-8');
const f4Res = compileInvoice(f4Json, 'sha256:dummy');
if (f4Res.success || !f4Res.violations.some((v: any) => v.Rule === 'GSTIN_FORMAT')) {
    console.error("CRITICAL: Fixture 4 did not produce expected GSTIN_FORMAT violation in JS!");
    exitCode = 1;
}

// Ensure fixture 5 fails with IGST_CGST_LAW
const f5Json = fs.readFileSync(path.join(fixturesDir, 'fixture_5_both_taxes.json'), 'utf-8');
const f5Res = compileInvoice(f5Json, 'sha256:dummy');
if (f5Res.success || !f5Res.violations.some((v: any) => v.Rule === 'IGST_CGST_LAW')) {
    console.error("CRITICAL: Fixture 5 did not produce expected IGST_CGST_LAW violation in JS!");
    exitCode = 1;
}

// Ensure fixture 6 fails with RATE_SLAB
const f6Json = fs.readFileSync(path.join(fixturesDir, 'fixture_6_off_slab.json'), 'utf-8');
const f6Res = compileInvoice(f6Json, 'sha256:dummy');
if (f6Res.success || !f6Res.violations.some((v: any) => v.Rule === 'RATE_SLAB')) {
    console.error("CRITICAL: Fixture 6 did not produce expected RATE_SLAB violation in JS!");
    exitCode = 1;
}

process.exit(exitCode);
