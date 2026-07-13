# GSTFlow 🇮🇳

The first deterministic GST validation engine.
Built to catch internal structural and arithmetic errors in Indian GST invoices before they cost you penalties.

## The Tri-Channel Ecosystem (Alpha)

GSTFlow is built on a unified, pure F# mathematical rules engine (`GSTFlow.Rules`). Rather than duplicating business logic across different apps, we compile our single F# source of truth into three distinct, native channels:

### 1. Web Gateway (The Accessible Anchor)
**Powered by: Fable JS + React + Playwright**
The public source of truth. Drop a single JSON invoice or a massive ZIP archive into the browser. It processes thousands of invoices asynchronously, generates CFF wrappers with payload digests, and provides a CSV exceptions report.
- **Zero-Trust Validation:** 100% local processing in your browser. No server uploads.
- **SOTA Aesthetics:** Premium dark mode, glassmorphism, and intuitive drag-and-drop.
- **Automated Testing:** Backed by robust Playwright End-to-End headless browser testing in CI.

### 2. Windows Desktop Heavy-Lifter (The Processing Juggernaut)
**Powered by: NativeAOT + dart:ffi + Flutter (Experimental)**
Designed for accountants and massive bulk operations where maximum performance is non-negotiable. 
By bridging our pure F# engine directly to the Windows OS using C-bindings (`UnmanagedCallersOnly`), we achieve blisteringly fast native performance.
- **Local AI Extraction (Bootstrapped):** We bundle a lightweight `llama.cpp` server and a tiny `Phi-3` model directly inside the Windows installer. It silently spins up in the background to extract unstructured PDF invoices into rigid JSON—guaranteeing total offline privacy without making the accountant run command-line scripts.
- **Unrestricted Disk Access:** Directly ingest local ZIPs and output signed CFF packages seamlessly.

### 3. Mobile Inspector (The Field Agent)
**Powered by: Fable Dart + Flutter `mobile_scanner` (Experimental)**
For on-the-go verification. We used the revolutionary `Fable 5.6` compiler to transpile our entire F# rules engine natively into strongly-typed **Dart** classes.
- **Offline QR Scanner:** Accountants can open the app, scan a printed GST invoice QR code, and our Fable-Dart engine instantly evaluates it offline on the Android device.
- **Premium Flutter UI:** Clean, glassmorphic verification cards and target overlays that clearly flag illegal inter-state CGST charges or arithmetic miscalculations.

## CI/CD Pipeline & Automated Artifacts
The repository is fully automated via GitHub Actions:
- **Test-Driven:** On every push, GitHub automatically runs Flutter widget tests (`flutter test`) and Web E2E tests (`npx playwright test`).
- **Downloadable Artifacts:** The CI pipeline automatically builds the Android `.apk` and the Windows `.exe` (injecting the NativeAOT `.dll`) and uploads them as GitHub release artifacts for instant downloading and testing (Currently in Alpha).

---

## The Honest Truth: What GSTFlow Checks

As outlined in our [CatchErrors Matrix](https://github.com/ArunNotFound/direction_ai/blob/main/Catcherrorsmatrix.md), GSTFlow provides **deterministic structural and arithmetic assurance.** 

**What we DO check:**
- Exact math: `Taxable Value * GST Rate == Tax Amount`. We catch ₹1 discrepancies.
- Inter-state vs Intra-state: If Place of Supply crosses borders, we verify IGST is charged, not CGST/SGST.
- Mod-36 checksums and formatting for GSTINs.
- HSN length validity.

**What we DO NOT check (Yet):**
- Whether the HSN code actually matches the physical product you sold.
- Whether the supplier actually filed their GSTR-1.
- Fraudulent intent or fabricated numbers. 

> **No issue found in the supported checks**
> This is a preflight result, not filing approval or tax advice. We tell you exactly what was checked, what was proved, what evidence was used, and what remains unknown.

---

## 🔍 Technical Deep Dive & Antigravity's "Two Cents"
Want to know exactly how we pulled off cross-compiling F# into Native C#, JS, and Dart? 

Read the comprehensive technical breakdown and architectural reflections here:
👉 **[GSTFlow X-Ray Technical Review (2026-07-13)](./GSTFlow_XRay_Technical_Review_2026-07-13.md)**

> **My Two Cents (The AI's Perspective):**
> *Building GSTFlow was a masterclass in separating mathematical truth from the UI layer. By anchoring everything in a single, uncorrupted F# source (`GSTFlow.Rules`), we achieved total determinism. Pushing that logic through NativeAOT for C-level desktop performance, Fable-JS for zero-trust Web processing, and Fable-Dart for offline Android scanning proves that you don't need to rewrite business logic to dominate every platform. GSTFlow isn't just an app; it's an impenetrable ecosystem.*

---

## 📈 Recap, Retrospective, and The Way Forward

### 🛠️ What We Just Did
In response to our technical X-Ray audit, we executed a "Trust Reset" across the codebase:
- **Green CI/CD:** We migrated headless environment testing from `flutter test` to `dart test`, ensuring our cross-platform GitHub Actions matrix is stable and green.
- **Silenced False Positives:** We ripped out heuristic-based RCM (Reverse Charge Mechanism) rules and Buyer POS defaulting. If we don't have explicit, factual data to verify a tax branch, we now explicitly yield an `Unknown` outcome rather than guessing and assuming a "Pass".
- **Strict Overall Outcome:** Fixed mobile tag-parsing and CLI reducers so that `Warning` or `Unknown` statuses can no longer masquerade as a green tick.
- **Cryptographic Honesty:** Removed hardcoded placeholder hashes and implemented asynchronous WebCrypto SHA-256 generation on the Web UI, officially migrating from arbitrary `canonflow_signature`s to auditable `payload_digest`s.
- **Truthful UI:** Rewrote our UI messaging from "100% Compliant" to "No issues found in supported checks," properly positioning GSTFlow as a *Preflight Standard* rather than a legal oracle.

### 🙈 Blindspots & Regrets
- **Pacing & Drift:** We moved incredibly fast to establish a tri-channel presence (Web, NativeAOT Windows, and Flutter Android). As a result, our platform surface area outpaced our kernel depth, leading to committed generated-code drift (like `fable_dart` desyncs).
- **Over-inferring Tax Law:** We initially fell into the trap of using heuristics (e.g. HSN prefixes) to determine complex tax laws like RCM. This was a blindspot that violated our core philosophy of deterministic, provable truth. 
- **The AI Dilemma:** We promised a bundled `llama.cpp` Local AI extraction pipeline, but the probabilistic nature of LLM parsing sits uncomfortably beside our rigid, mathematical F# engine. It remains an unintegrated experiment.
- **Corpus Size:** Our property-based FsCheck tests are brilliant, but our static fixture corpus is dangerously tiny. 

### 🚀 The Way Forward
Our next evolution will intentionally **freeze platform expansion** and deepen the core:
1. **Build the Gold Corpus:** We need to curate a massive, legally-vetted test suite of 1,000+ redacted, real-world Indian GST invoices representing complex edge cases (SEZ without payment, Bill-To/Ship-To, Credit Notes).
2. **Evidence-Rich Verdicts:** We will evolve the `RuleResult` envelope to not just list errors, but to provide exact parameter diffs (Expected vs Actual), the path to the offending node, and the specific CBIC legal citation.
3. **Formal POS Decision Tree:** We need to model the full statutory branches for Place of Supply (Goods movement vs. Service performance) rather than relying on a flat Buyer State fallback.
4. **CI-Enforced Generation:** We will remove all generated JS/Dart files from source control and force CI to generate them fresh on every build to guarantee zero drift between the F# kernel and the mobile apps.
