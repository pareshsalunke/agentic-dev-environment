# Sous — the DH Agentic Development Environment
### Interview prototype: PRD + Claude Code build brief
Paresh Salunke · for (Senior) PM, Agentic AI IDEs (Developer Tools), Tech Foundations · June 2026

**How to use this document.** Part A is the product PRD — it is your talking track and the "why" behind every pixel. Part B is the build brief — drop this whole file into an empty repo as `PRD.md`, open Claude Code, and use the kickoff prompt in §B9. Part C is the 3-minute demo script. The Appendix lists every opinionated decision I made so you can override any of them before building.

**The one-sentence strategy.** We are not building Delivery Hero an IDE. We are building the **DH layer** — context, policy, verification, and measurement — that makes *any* agentic IDE or CLI (Cursor, Claude Code, Copilot) safe, grounded, and provably valuable at DH scale. Buy the editor; build the moat. The prototype is that layer, experienced as a working environment.

---

# Part A — Product PRD (your talking track)

## A1. Problem statement

Most large engineering orgs in 2026, Delivery Hero included, have already distributed agentic coding tools. The gap is no longer availability — it is that generic agents fail in context-heavy, multi-brand environments, so usage plateaus at "fancy autocomplete" and the 100% daily AI-usage Northstar stalls. Four specific failure modes:

1. **Context starvation.** A raw agent doesn't know DH's internal APIs, the Engineering Manifesto, service ownership, ADRs, or incident history. It produces plausible-but-wrong code (hallucinated internal endpoints, convention violations). Engineers get burned twice, lose trust, and revert to manual work.
2. **The trust tax.** AI-generated code shifts the burden from writing to reviewing. Without structured verification, review load grows faster than authoring time shrinks — net velocity can go *down* while "AI usage" looks up.
3. **No paved road.** Every engineer prompts differently. Common tasks (add an API field, run a migration, backfill tests) get re-solved thousands of times with inconsistent quality across eFood, Glovo, and Talabat.
4. **Invisible ROI.** Seat counts and acceptance rates are vanity. Leadership can't see throughput impact; engineers can't see personal benefit; nobody can defend the budget.

The cost of not solving this: the Northstar misses, agentic spend gets framed as a tax instead of leverage, and DH's engineering velocity advantage erodes against competitors who crack adoption.

## A2. Product thesis and build-vs-buy stance

**Thesis:** Shift the unit of engineering work from *writing code* to *directing agents — approving plans and reviewing verified changes*. That is the "AI-assisted → AI-guided" transition in the JD, made concrete.

**Build-vs-buy:** The editor and the foundation models are commodities we buy and can swap (model routing keeps us un-locked-in). What we build is what no vendor can: the **DH Context Engine**, **policy-as-code from the Engineering Manifesto**, **verification artifacts**, **paved-road playbooks**, and **honest telemetry**. If asked "Cursor already indexes the codebase — what's left?": Cursor knows our *code*; it does not know our *organization* — the Manifesto, the ADR that explains why the data model looks like that, the Slack decision from May, the incident we must not repeat, who owns the service, or what the works council agreed about telemetry. That organizational context plus verification is the moat.

## A3. Users and jobs-to-be-done

Primary: backend/mobile/web engineers across eFood, Glovo, and Talabat. Core JTBD: *"Ship a well-scoped change in my service without re-explaining our stack to an AI every time, and without my reviewers paying for my speed."* Secondary: engineering managers (JTBD: see real throughput and risk, not vanity dashboards), platform & security (JTBD: enforce standards without becoming a bottleneck), and tech leadership (JTBD: defend the AI investment with metrics that survive scrutiny).

User stories, priority order:
- As a backend engineer at eFood, I want the agent to plan a ticket using our actual API catalog and conventions so that the generated change compiles against reality, not against the internet's average Kotlin.
- As an engineer, I want to edit and approve the agent's plan before any code is written so that I stay the director of the work and accountable for it.
- As a code reviewer, I want every agent change to arrive with passing tests, policy checks, and per-hunk provenance so that reviewing AI code takes less time than reviewing human code, not more.
- As an EM at Glovo, I want team-level adoption and counter-metrics so that I can spot where AI is creating review burden instead of removing it.
- As a security engineer, I want context sources permission-scoped and sanitized so that a poisoned internal doc can't steer the agent.

## A4. Differentiators vs. raw Cursor / Copilot / Claude Code

| # | Differentiator | What it is | Your evidence hook (interview) |
|---|---|---|---|
| D1 | **Context Engine — "mise en place"** | Leverage-ranked connectors: internal API catalog, Engineering Manifesto (machine-readable), ADRs, Slack decisions, GDrive specs, incident postmortems, CODEOWNERS. Grounded generation: the agent must *cite* context for non-trivial claims; uncited internal-API usage is flagged. | "I designed API contracts that unified four external operators behind one interface — same judgment: each context source is a contract with a freshness SLA and a security bar." |
| D2 | **Plan Gate — AI-guided, human-directed** | Ticket → agent proposes a plan (steps, files, risks, test strategy) → human edits/approves → agent executes. The human moves from typist to director. | "I drove an internal MVP to 100% adoption in six weeks by making the system path the default path — the Plan Gate makes the agentic path the default without removing human authority." |
| D3 | **Verified diffs** | Every change ships with generated tests, Manifesto policy checks, secrets/PII/license scans, a risk score, and per-hunk provenance, in an intent-grouped review UI. Goal: review time per PR flat-or-down while AI share rises. | "On my own AI product I built an offline eval harness to choose models on measured accuracy and cost — verification before vibes." |
| D4 | **Paved-road playbooks** | Versioned org workflows (add API field, expand–contract migration, test backfill, CVE bump): unified core, brand-flexible overlays — the JD's 'unified yet flexible' requirement, productized. | "I've built an expand–contract migration field manual from my VW platform work — that's playbook #2 in the gallery." |
| D5 | **Honest telemetry** | Outcome metrics (PR cycle time, AI-guided PR share, human-to-AI ratio) always paired with counter-metrics (review time/PR, change-failure rate, revert rate). Team-level aggregation only (n≥8) — works-council compatible by design. | "I cut a core cycle from ~10 to ~3 days with 60+ interviews and SQL/Grafana — measurement is how I earn the right to say no to feature asks." |

## A5. Why engineers adopt (the behavior-change model)

Adoption is a product, not a rollout. The funnel and its mechanism:
**Licensed → Activated** (first merged AI-guided PR): first-session value via a playbook that completes a *real* ticket in under 15 minutes, not a toy demo. **Activated → Habitual** (≥3 days/week): trust compounds through provenance ("I can see why it did that") and falling review burden; the paved road is wired into templates and CI so the agentic path is the default path. **Habitual → Daily**: a weekly personal recap ("Sous saved you ~3.2h") plus social proof inside teams. The product never blocks the old way — it makes the new way obviously cheaper.

## A6. Human-in-the-loop model

Two hard gates, always: **plan approval** (human edits/locks the plan before code is written) and **merge review** (nothing merges without human sign-off). Checkpoint interrupts mid-execution when the agent hits a flagged decision. Every PR carries an AI-provenance disclosure (model, plan edits, agent-authored LoC, checks) for audit and compliance. The agent runs least-privilege: it can propose, never merge.

## A7. Metrics: Northstar tree and definitions

**Northstar (rigorous definition):** % of engineers with **≥1 AI-guided unit of work per day** — a unit of work = an approved plan *or* a merged agent-authored diff. **Autocomplete acceptances are explicitly excluded** — they measure keystroke savings, not the workflow shift the Northstar is about; including them lets us hit 100% without changing anything.

Driver metrics: activation rate, time-to-first-value, weekly habitual rate, AI-guided PR share, playbook success rate. **Guardrail/counter-metrics (non-negotiable pairing):** review time per PR, change-failure rate, revert rate, escaped defects, engineer NPS, security findings in agent code, € cost per AI-guided unit of work. Rule: ratios are diagnostics, never targets — any single ratio is gameable (Goodhart).

## A8. Risks and mitigations

1. **Review bottleneck** — verification artifacts + intent-grouped diffs; track reviewer load as a first-class metric; throttle rollout where it spikes.
2. **Context staleness** — every connector has a freshness SLA and provenance dates visible in the UI; stale context is labeled, not hidden.
3. **Prompt injection / secret leakage via internal docs** — context is permission-scoped per engineer, sanitized on ingestion, and the agent has no autonomous merge or external-network authority; secrets scanning runs on both context and output.
4. **Works council (Betriebsrat)** — telemetry aggregated at team level (n≥8), no individual rankings, definitions published, reviewed with the works council before launch. This is an adoption feature, not just compliance.
5. **Model lock-in / cost** — routing layer + offline eval harness per task family; € per unit-of-work tracked next to hours saved.
6. **Skill atrophy** — playbooks encode the "why" (linked ADRs/Manifesto sections) so juniors learn the org's reasoning while the agent does the typing.

## A9. Non-goals (v0 demo and v1 product)

- **Not building an editor.** No forked VS Code, no custom LSP. The environment wraps/extends what engineers already run.
- **Not autonomous merging.** Even for "auto-eligible" playbooks (CVE bumps), a human approves; we earn autonomy with data, we don't assume it.
- **Not individual performance measurement.** Telemetry exists to improve the product and prove ROI, not to rank engineers.
- **Not all three brands at once.** Beachhead first (see A10); a unified core with brand overlays comes after the wedge proves out.

## A10. Beachhead and sequencing

Wedge: **backend service engineers + the "add a field to a public API" playbook**, demoed on eFood. Why: highest-frequency task, bounded blast radius, exercises every differentiator (catalog, Manifesto, ADR, incident history, tests), and produces a merged PR — the activation event — in one sitting. Fast, credible proof; then expand by playbook (migrations, test backfill), then by brand overlay.

## A11. JD requirement → demo element map

| JD asks for | Where the demo shows it |
|---|---|
| "AI-assisted → AI-guided feature generation" | Plan Gate: ticket becomes an editable, approvable plan; agent executes the plan, not vibes |
| Measurement beyond vanity; PR velocity, TTM, Human-to-AI ratio | Adoption & Impact view: NS definition popover, counter-metrics row, the Glovo ⚠ annotation |
| Contextual integration (APIs, Manifesto, Slack, GDrive) | Context chips with citations and per-hunk provenance |
| GTM / internal adoption | Funnel (Licensed→Activated→Habitual→Daily), playbook usage stats, "2.6h saved" toast |
| Security, reliability, scalability standards | Policy checks panel, risk score, least-privilege framing, privacy footnote |
| Unified yet flexible across brands | Brand switcher + "core + overlay" badges on playbooks |
| Evangelism / storytelling | The demo itself — built in one evening with the tools this role champions |

---

# Part B — Prototype build brief (for Claude Code)

## B0. What we are building — and explicitly not

A **single-page, fully client-side React demo** that *simulates* the Sous environment with hard-coded fixture data. It must feel like a real internal tool, run offline, and be deterministic for a live interview. **Not building:** a real editor, real model calls (P0), auth, backend, persistence, or responsiveness below 1280px. Optimize for: a flawless 3-minute scripted walkthrough at 1440×900 and on a projector.

## B1. Stack and repo

- Vite + React 18 + TypeScript + Tailwind CSS. No router needed (tab state in React). No localStorage/sessionStorage — all state in memory.
- All fixtures as typed data in `src/data/` (`scenario.ts`, `dashboard.ts`, `playbooks.ts`). Components in `src/components/`. One `src/App.tsx` shell.
- Zero network calls. `npm i && npm run dev` must work offline after install. No console errors.

## B2. App shell

Top bar: wordmark **"Sous"** + subtitle **"DH Agentic Development Environment"** + a quiet pill: **"Runs on your IDE & CLI · Cursor / Claude Code / Copilot + the DH layer"** (this pill is strategically load-bearing — it visually encodes buy-the-editor/build-the-layer). Right side: brand switcher (eFood · Glovo · Talabat) that retints the accent color and filters the dashboard; a fake avatar "PS".

Three tabs: **Workbench** (default) · **Playbooks** · **Adoption & Impact**.

Demo controls (bottom-right floating, subtle): `▶ Run demo` (autoplays Workbench beats with ~1.5–4s pacing), `→` / `Space` advance one beat, `R` reset. All animation deterministic — no randomness.

## B3. View 1 — Workbench (the core demo, 5 scripted beats)

Layout: left rail = repo file tree (`menu-service`, Kotlin/Spring structure) + ticket card; center = code/diff pane; right rail (380px) = **Sous agent timeline**.

**The ticket (fixture):**
> **DHX-4127 · Expose allergen information on menu item details API** — eFood · Menu Platform
> "EU Reg 1169/2011 requires allergen disclosure for prepared food. Surface allergen data on `GET /menu-items/{id}` for consumer apps. Coordinate with nutrition-svc."

### Beat 1 — Context assembly ("mise en place")
Click **"Plan with Sous"** on the ticket. Agent timeline shows six context chips appearing one by one (skeleton shimmer → resolved), each expandable to a 2-line excerpt + source line:

1. 🗂 **API Catalog** — `menu-items v1 · MenuItemDetailsDto` — "GET /v1/menu-items/{id} → name, price, description, dietaryFlags[]. Owner: Menu Platform (eFood)."
2. 📜 **Engineering Manifesto §3.2** — "Public API changes must be additive. Breaking changes require a major version and a 90-day deprecation window."
3. 📐 **ADR-118 · Nutritional & dietary data model** — "Allergens modeled as a closed enum of the 14 EU 1169/2011 codes. Source of truth: nutrition-svc."
4. 💬 **Slack #menu-platform · 12 May** — "Decision (J. Park): allergen data comes from nutrition-svc, not vendor feeds — vendor coverage is 61% and unreliable."
5. 🚨 **Postmortem PM-2291** — "Menu cache served stale dietary flags for 40 min. Open action: invalidate cache on dietary-data changes."
6. 👤 **CODEOWNERS** — "`menu-service` → @maria.k, @menu-platform-core."

Footer line under chips: *"6 sources · permission-scoped to you · freshness checked 11 Jun"*.

### Beat 2 — Plan proposal and the human edit (the Plan Gate)
Agent posts **"Proposed plan · 5 steps"** — each step shows files touched + cited chips:

1. Extend `MenuItemDetailsDto` with `allergens: List<AllergenCode>` (additive — Manifesto §3.2) · cites 1, 2
2. Populate from nutrition-svc client per platform decision; **if nutrition data unavailable → return empty list** · cites 3, 4
3. Expose on `GET /v2/menu-items/{id}` (additive minor bump); update OpenAPI spec · cites 1, 2
4. ⚠ **Needs your decision** — cache invalidation: (a) event-driven bust on `DietaryDataChanged` (recommended; closes PM-2291 action) or (b) 5-min TTL · cites 5
5. Tests: contract test for v2 schema, mapper unit tests, cache-invalidation test (per playbook "Add API field v1.3")

Interaction: user selects option (a) on step 4, then **edits step 2 inline** to: *"if nutrition data unavailable → set `allergenInfoAvailable=false`; never return an empty list that implies 'no allergens'."* (This is the food-safety judgment beat — a missing allergen list must read as *unknown*, not *none*.) Then click **"Approve plan"** → header flips to **"Plan locked · v2 · 1 human edit"** with a small diff marker on step 2.

### Beat 3 — Execution: verified diffs with provenance
Center pane streams diffs file-by-file (typewriter effect, ~15–25 changed lines each, realistic Kotlin/Spring + YAML). Files, in order, with mandatory anchor lines:

1. `src/main/kotlin/dto/MenuItemDetailsDto.kt` — adds `val allergens: List<AllergenCode> = emptyList()` and `val allergenInfoAvailable: Boolean = false` · hunk chip: *"per ADR-118 + your plan edit"*
2. `src/main/kotlin/service/MenuItemService.kt` — nutrition-svc client call, availability flag mapping · chip: *"per Slack decision 12 May"*
3. `src/main/kotlin/api/MenuItemController.kt` + `openapi/menu-items.yaml` — `GET /v2/menu-items/{id}` additive bump · chip: *"per Manifesto §3.2"*
4. `src/main/kotlin/cache/MenuCacheInvalidator.kt` — subscribes to `DietaryDataChanged` · chip: *"closes PM-2291 action"*
5. `src/test/kotlin/MenuItemServiceTest.kt` — chip: *"playbook: Add API field v1.3"*

Right rail check panel animates to: **Tests 14/14 ✓** (sample names visible: `returns allergens when nutrition data present`, `availability=false when nutrition-svc down`, `cache busts on DietaryDataChanged`) · **Policy: Manifesto §3.2 additive ✓ · Secrets ✓ · PII: none (product data) ✓ · OSS license ✓ · Coverage 78.4% → 80.1% ✓** · **Risk: MEDIUM** (tooltip: "touches cache path from PM-2291; mitigated by event-driven invalidation + contract test").

### Beat 4 — Review and PR
Center switches to an **intent-grouped review** (grouped by plan step, not by file). Buttons: "Request changes" / **"Approve & open PR"**. Approving renders a PR card:

> **feat(menu): expose allergen info on menu item details (v2, additive)** — #8841 · base `main`
> Reviewers (from CODEOWNERS): @maria.k · @menu-platform-core
> **🤖 AI provenance:** Planned by Sous v0.9 · plan human-edited (1 change: missing-data semantics) · 182 LoC agent-authored across 5 files · all checks passed · approved by P. Salunke

### Beat 5 — Impact tick
Toast bottom-left: **"✓ AI-guided unit of work logged · DHX-4127 · est. 2.6h saved vs. baseline"** with link "View in Adoption & Impact" → switches tab.

## B4. View 2 — Adoption & Impact (exact fixture numbers)

Header row of KPI cards:
- **Daily AI-usage (Northstar): 38%** ▲ from 22% in Mar · progress bar toward **100% by Dec 2026** · ⓘ popover with the verbatim definition: *"% of engineers with ≥1 AI-guided unit of work per day. A unit of work = an approved plan or a merged agent-authored diff. Autocomplete acceptances are excluded."*
- **AI-guided PR share: 23%** of merged PRs ▲
- **Median PR cycle time: 18.2h** ▼ from 26.4h baseline
- **Human-to-AI code ratio: 62 : 38** (38% agent-authored lines in merged code)

Adoption funnel (horizontal bars, filterable by brand): Licensed **100%** (2,840 engineers) → Activated (first AI-guided PR) **71%** → Habitual (≥3 days/wk) **52%** → Daily **38%**.

**Counter-metrics row (the honest part — must be visually equal to the KPI row, not a footnote):**
- Review time / PR: eFood **41m ▼8%** · Talabat **39m ▼3%** · Glovo **47m ▲12% ⚠** — annotation on the Glovo card: *"Investigating: verbose diffs from playbook v1.1 suspected; v1.3 intent-grouping rolling out, re-check 24 Jun."*
- Change-failure rate: **2.1%** (flat, threshold <2.5%) · Revert rate: **0.9%** (flat)

Line chart: PR cycle time (falling) overlaid with review time/PR (mostly flat, Glovo series ticking up) — Mar→Jun weekly points, hard-coded.

Footer note (small, deliberate): *"Aggregated at team level (n≥8). No individual rankings. Definitions published. Reviewed with the works council."*

## B5. View 3 — Playbooks

Gallery of cards: name, version, runs, merge success, scope badge (**Core** / **Core + brand overlay**):
1. **Add field to a public API** · v1.3 · 412 runs · 94% merged · Core + overlays (eFood, Glovo)
2. **DB migration (expand–contract)** · v2.0 · 168 runs · 91% · Core
3. **Test backfill to 80% coverage** · v1.1 · 233 runs · 89% · Core
4. **Dependency CVE bump** · v1.0 · 301 runs · 97% · Core · badge "auto-eligible (human approve)"
5. **New service from golden template** · v0.9 beta · 47 runs · 85% · Core

Each card has a one-line "encodes": e.g., #1 → "Manifesto §3.2, OpenAPI conventions, contract-test template."

## B6. Design direction (give Claude Code this verbatim)

Identity: a serious internal tool with one warm wink — the kitchen-brigade metaphor lives only in the name and microcopy, never in decoration. Dark editor canvas `#0E1116`, panel `#161B22`, hairline borders `#2A313C`, text `#E6EDF3` / muted `#8B949E`. One accent per brand: eFood `#D61F26`-adjacent red, Glovo `#FFC244`, Talabat `#FF5A00` — accent used only for primary actions, the Northstar, and provenance chips. Type: Inter for UI, JetBrains Mono for code/diffs/metrics figures (tabular numerals on the dashboard). Diff colors: muted green `#1F3D2B`/`#7EE2A8`, red `#3D1F23`/`#FF9AA2`. Motion: 150–250ms ease-out only — chips resolve, checks tick, diffs typewrite; respect `prefers-reduced-motion` by jumping to end state. The **signature element** is the provenance chip: a small bordered tag that appears in the context list, on plan steps, and on diff hunks — the same atom everywhere, because "grounding" is the product. No gradients, no glassmorphism, no confetti.

## B7. Determinism and demo safety

Every animation is a fixed timeline; `R` resets to pre-Beat-1; `→`/`Space` advances; `▶ Run demo` plays Beats 1–5 in ~75–90s with pauses at the Plan Gate (waits for the scripted edit/approve unless autoplay, in which case it performs them). No randomness, no Date.now()-dependent rendering, no network. Title bar shows "demo data" subtly to preempt "is this real?" confusion in the room — honesty also reads as seniority.

## B8. Priorities, cut lines, acceptance criteria

**P0 (must demo):** Workbench Beats 1–4 · minimal dashboard (KPI row + counter-metrics row + funnel) · brand switcher visual only · design direction applied.
**P1:** Beat 5 toast + tab jump · Playbooks view · line chart · Glovo annotation interaction · `▶ Run demo` autoplay.
**P2 (only if time):** fake terminal pane in Workbench running `sous run add-api-field --ticket DHX-4127` to mirror the flow (JD says "IDEs and CLIs") · live-model toggle wired to a real API call.

Acceptance checklist:
- [ ] `npm i && npm run dev` works offline post-install; zero console errors
- [ ] Beats advance by click and keyboard; `R` resets cleanly mid-beat
- [ ] All six context chips expand; plan step 2 is inline-editable; step 4 has the a/b choice; approval state visibly changes ("Plan locked · v2 · 1 human edit")
- [ ] Diffs stream with per-hunk provenance chips; checks animate to the exact fixture states; risk tooltip present
- [ ] PR card renders the provenance block verbatim
- [ ] Dashboard shows the NS definition popover, the Glovo ⚠ annotation, and the works-council footer
- [ ] Legible at 1440×900 and high-contrast enough for a projector; no layout breakage at 1280px

## B9. Claude Code kickoff prompt (paste this)

> Read `PRD.md` in this repo — build exactly what Part B specifies, nothing more. Scaffold Vite + React + TS + Tailwind. Put all fixture text verbatim into `src/data/`. Build in this order: app shell → Workbench Beats 1–4 → dashboard P0 → then P1 items. After each milestone, run `npm run dev`, check for console errors, and commit. Use the design direction in §B6 as law: dark canvas, one accent, provenance chips as the signature element, no gradients. All animations deterministic per §B7. Do not add a backend, router, localStorage, or network calls. When P0 acceptance boxes in §B8 all pass, stop and summarize what's built vs. cut.

## B10. Deploy and demo-day logistics

`npm run build` → deploy to Vercel/Netlify for a shareable URL; also keep `npx serve dist` as the offline fallback on your laptop. Record a 60–90s Loom walkthrough tonight as the async artifact — if tomorrow's round format doesn't suit a live demo, you send the URL + Loom in your thank-you note instead, and nothing is wasted.

---

# Part C — The 3-minute demo script

1. *(Workbench, ticket visible)* "Quick framing: this isn't a proposal to build an IDE — DH should buy the editor. This is the DH layer that makes any agentic IDE worth 100% daily usage. I built it last night with the tools this role evangelizes."
2. *(Beat 1)* "First differentiator: mise en place. Before writing a line, Sous assembles *organizational* context — our API catalog, the Manifesto, the ADR, the Slack decision, the postmortem. Cursor knows our code; it doesn't know any of this."
3. *(Beat 2)* "Second: the Plan Gate. The agent proposes; I direct. Watch — I'm rejecting 'empty allergen list' because at a food company, missing data must read as *unknown*, never as *no allergens*. That's the human-in-the-loop doing product judgment, not typing."
4. *(Beat 3)* "Execution comes back verified: tests generated and passing, Manifesto policy checks, secrets and license scans, a risk score citing the postmortem. This is what keeps reviewer load flat while AI share rises — the counter-metric most rollouts ignore."
5. *(Beat 4)* "Every PR discloses AI provenance — what the agent wrote, what I changed, what passed. Audit-ready by default."
6. *(Dashboard)* "And the Northstar is defined so it survives scrutiny: a daily AI-guided unit of work — approved plan or merged agent diff. Autocomplete is excluded; that's keystrokes, not workflow change."
7. *(Point at Glovo ⚠)* "I deliberately shipped a problem in the demo data: Glovo's review time is up 12%. That's the metric I'd walk into Monday with — the dashboard exists to find this, not to look green."
8. *(Footer)* "Team-level aggregates only, works-council reviewed — in a Berlin-headquartered company, that's an adoption feature, not paperwork."
9. *(Close)* "The meta-point: communicating this vision used to cost a deck and three meetings. With agentic tools it cost one evening. That collapse in the cost of alignment is exactly the product I'd be managing."

---

# Appendix — Decisions I made for you (override any before building)

1. **Name: "Sous"** (sous-chef runs execution; the engineer is head chef). Deliberately food-coded for DH; CLI-friendly (`sous run …`). Avoided "Mise" — collides with the well-known `mise` dev-tool version manager. Fallback if you want neutral: "HeroDev".
2. **Wedge & scenario:** backend + "add API field," allergen disclosure on eFood, Kotlin/Spring (matches DH's Java/Kotlin stack signals). Override if you'd rather defend migrations or test backfill — say so and regenerate Beats 1–3 fixtures.
3. **Stack:** Vite + React + TS + Tailwind — your home turf, fastest with Claude Code.
4. **Northstar definition excludes autocomplete.** This is a defensible-but-spicy stance; be ready for pushback (see grilling Q4).
5. **Telemetry stance:** team-level only, n≥8, works-council framing. 
6. **Strategy stance:** buy editor, build layer — encoded in the top-bar pill so the demo can't be misread as "let's build VS Code."
7. **The demo deliberately shows one problem (Glovo ⚠)** — an all-green dashboard reads junior.
