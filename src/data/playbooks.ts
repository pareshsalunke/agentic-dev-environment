/* §B5 — Playbooks gallery fixtures */

export interface Playbook {
  name: string
  version: string
  runs: string
  merged: string
  scope: string
  badge?: string
  encodes: string
}

export const PLAYBOOKS_HEADER = {
  title: 'Playbooks',
  subtitle: 'Versioned org workflows · unified core, brand-flexible overlays',
}

export const PLAYBOOKS: Playbook[] = [
  {
    name: 'Add field to a public API',
    version: 'v1.3',
    runs: '412 runs',
    merged: '94% merged',
    scope: 'Core + overlays (eFood, Glovo)',
    encodes: 'Manifesto §3.2, OpenAPI conventions, contract-test template.',
  },
  {
    name: 'DB migration (expand–contract)',
    version: 'v2.0',
    runs: '168 runs',
    merged: '91% merged',
    scope: 'Core',
    encodes: 'Expand–contract sequencing, dual-write gates, rollback plan template.',
  },
  {
    name: 'Test backfill to 80% coverage',
    version: 'v1.1',
    runs: '233 runs',
    merged: '89% merged',
    scope: 'Core',
    encodes: 'Coverage targets, test-pyramid conventions, flaky-test quarantine rules.',
  },
  {
    name: 'Dependency CVE bump',
    version: 'v1.0',
    runs: '301 runs',
    merged: '97% merged',
    scope: 'Core',
    badge: 'auto-eligible (human approve)',
    encodes: 'Dependency allowlist, SemVer policy, canary + rollback checks.',
  },
  {
    name: 'New service from golden template',
    version: 'v0.9 beta',
    runs: '47 runs',
    merged: '85% merged',
    scope: 'Core',
    encodes: 'Golden CI pipeline, service scaffold, ownership & on-call registration.',
  },
]
