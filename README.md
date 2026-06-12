# Sous - DH Agentic Development Environment (interview prototype)

Single-page, fully client-side demo with hard-coded fixture data. No backend,
no router, no storage, no network calls deterministic by design. See
[PRD.md](PRD.md) for the full product brief.

```sh
npm i && npm run dev
```

Demo controls (bottom right): `▶ Run demo` autoplays Beats 1–5; `→` / `Space`
advances one beat; `R` resets. All data on screen is demo data.
# Sous the DH Agentic Development Environment


**▶ Live demo:** _add your Vercel URL here once deployed_
**⏱ Watch in 3 minutes:** start the demo, click **Plan with Sous** on the ticket, then follow the on-screen beats.

---

## The hypothesis behind it

The editor and the models are increasingly commoditized you can swap Cursor for Claude Code for Copilot. So the question I kept coming back to is **where the durable leverage actually sits.** My working hypothesis: less in the editor itself, more in the _layer_ around it the organizational context, the verification, and the measurement that make any agentic IDE safe, grounded, and provably valuable at 65-country scale. Buy the editor; build the layer. This prototype is one concrete expression of that hypothesis and exactly the kind of build-vs-buy question I'd want to pressure-test against DH's real constraints, not assume from outside.

The hard part of the 100% daily AI-usage Northstar isn't distributing licenses most large orgs already have these tools. It's **behavior change** across eFood, Glovo, and Talabat, and **proving ROI in metrics that survive scrutiny**. Sous is one possible answer to both.

## What the prototype demonstrates

This is a deterministic, client-side demo (fixture data, no backend) designed to be walked through live. It shows five product bets:

1. **Context Engine ("mise en place").** Before writing a line, the agent assembles _organizational_ context the internal API catalog, the Engineering Manifesto, an ADR, a Slack decision, an incident postmortem, CODEOWNERS. A general-purpose agent knows your _code_; the leverage is in giving it your _organization_. That's the layer worth building.
2. **The Plan Gate (AI-assisted → AI-guided).** The agent proposes a plan; the engineer **edits and approves it** before any code is written. The human moves from typist to director which is exactly the transition the JD calls for.
3. **Verified diffs with per-hunk provenance.** Every change ships with generated tests, Manifesto policy checks, secret/PII/license scans, a risk score, and a tag on each hunk showing _why_ it exists. This is what keeps reviewer load flat while AI-authored code share rises.
4. **Honest telemetry.** The Northstar is defined to survive scrutiny a daily AI-_guided_ unit of work (an approved plan or a merged agent diff), **excluding autocomplete acceptances**. Every headline metric is paired with a counter-metric. The demo deliberately surfaces _one problem_ (Glovo review time up 12%) an all-green dashboard reads junior.
5. **Paved-road playbooks.** Versioned org workflows (add an API field, expand–contract migration, CVE bump) with a unified core and brand-flexible overlays the JD's "unified yet flexible" requirement, productized.

## The demo storyline

An eFood engineer picks up ticket **DHX-4127** expose allergen information on the menu-item API (EU Reg 1169/2011). Watch the human-in-the-loop product judgment beat: the engineer **overrides the agent's plan** so that missing allergen data reads as _"unknown"_, never as _"no allergens"_ a food-safety call no generic agent would make on its own.

## Why this matters for the role

| The JD asks for | The prototype shows it |
|---|---|
| AI-assisted → AI-guided feature generation | The Plan Gate: a ticket becomes an editable, approvable plan |
| Measurement beyond vanity metrics | A defensible Northstar definition + a counter-metrics row |
| Contextual integration (APIs, Manifesto, Slack, GDrive) | Context chips with citations and per-hunk provenance |
| GTM / internal adoption | An adoption funnel and "hours saved" feedback loop |
| Unified yet flexible across brands | Brand switcher + "core + overlay" playbook badges |
| Evangelism / storytelling | This demo vision communicated in an evening, not a deck and three meetings |

> **Honest framing:** I haven't run an IDE rollout at 65-country scale. What this prototype shows is the platform-adoption thinking, first-hand agentic-developer empathy, and measurement rigor I'd bring plus a plan to learn DH's engineering culture fast.

---

## Run it locally

Requires Node.js 18+.

```bash
git clone https://github.com/<your-username>/sous-dh-agentic-ide.git
cd sous-dh-agentic-ide
npm install
npm run dev
```

Open the printed `localhost` URL. Best viewed at 1440×900. No accounts, no network calls it runs fully offline after install.

## Tech

Vite · React 18 · TypeScript · Tailwind CSS. All scenario data lives in `src/data/` as typed fixtures. No backend, no database, no auth this is an interview prototype, not a production build, and is scoped deliberately.

## Project structure

```
src/
  components/    UI: Workbench, dashboard, playbooks, agent timeline
  data/          All fixture content (scenario, dashboard metrics, playbooks)
  App.tsx        Tab shell + demo state
PRD.md           The product thinking behind every decision in this repo
```

> 📄 **`PRD.md`** is the real artifact it's the full product reasoning (problem framing, differentiators, metrics tree, risks, non-goals, sequencing) the prototype is built from. Read it if you want the "why" behind the "what."

## License

MIT see [`LICENSE`](./LICENSE). Fixtures and code are free to read, run, and learn from.

---

_Built by Paresh Salunke for Delivery Hero. Fixture data is illustrative and does not represent any real Delivery Hero system or metric._