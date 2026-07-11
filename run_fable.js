const fs = require('fs');
const api = require('./out/Library.js');

const fixtures = process.argv.slice(2);
for (const fixture of fixtures) {
    const jsonStr = fs.readFileSync(fixture, 'utf8');
    const res = api.compileInvoice(jsonStr);
    if (!res.success && !res.envelope) {
        console.error("Fable failed entirely on " + fixture + ": " + res.error);
        process.exit(1);
    }
    fs.writeFileSync(fixture + ".fable.json", res.envelope + "\n");
}
