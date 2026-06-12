/* §B4 — Adoption & Impact, exact fixture numbers */

export const KPIS = {
  northstar: {
    label: 'Daily AI-usage (Northstar)',
    value: '38%',
    delta: '▲ from 22% in Mar',
    pct: 38,
    target: 'target 100% · Dec 2026',
    definition:
      '% of engineers with ≥1 AI-guided unit of work per day. A unit of work = an approved plan or a merged agent-authored diff. Autocomplete acceptances are excluded.',
  },
  prShare: {
    label: 'AI-guided PR share',
    value: '23%',
    sub: 'of merged PRs ▲',
  },
  cycleTime: {
    label: 'Median PR cycle time',
    value: '18.2h',
    sub: '▼ from 26.4h baseline',
  },
  ratio: {
    label: 'Human-to-AI code ratio',
    value: '62 : 38',
    sub: '38% agent-authored lines in merged code',
  },
}

export const FUNNEL = {
  title: 'Adoption funnel',
  stages: [
    { label: 'Licensed', detail: '2,840 engineers', pct: 100 },
    { label: 'Activated', detail: 'first AI-guided PR', pct: 71 },
    { label: 'Habitual', detail: '≥3 days/wk', pct: 52 },
    { label: 'Daily', detail: '≥1 AI-guided unit of work / day', pct: 38, northstar: true },
  ],
}

export const COUNTER_METRICS = {
  title: 'Counter-metrics',
  subtitle: 'always paired with the KPIs above — ratios are diagnostics, never targets',
  review: {
    label: 'Review time / PR',
    brands: [
      { name: 'eFood', value: '41m', delta: '▼8%', good: true },
      { name: 'Talabat', value: '39m', delta: '▼3%', good: true },
      {
        name: 'Glovo',
        value: '47m',
        delta: '▲12%',
        good: false,
        warn: true,
        annotation:
          'Investigating: verbose diffs from playbook v1.1 suspected; v1.3 intent-grouping rolling out, re-check 24 Jun.',
      },
    ],
  },
  changeFailure: {
    label: 'Change-failure rate',
    value: '2.1%',
    sub: 'flat · threshold <2.5%',
  },
  revertRate: {
    label: 'Revert rate',
    value: '0.9%',
    sub: 'flat',
  },
}

/* Line chart (P1): Mar→Jun weekly points, hard-coded. */
export const TREND = {
  title: 'PR cycle time vs. review time / PR · Mar–Jun, weekly',
  cycleAxis: 'cycle time (h)',
  reviewAxis: 'review time (min)',
  weeks: ['Mar 2', 'Mar 9', 'Mar 16', 'Mar 23', 'Mar 30', 'Apr 6', 'Apr 13', 'Apr 20', 'Apr 27', 'May 4', 'May 11', 'May 18', 'May 25', 'Jun 1', 'Jun 8'],
  monthTicks: [0, 5, 9, 13],
  monthLabels: ['Mar', 'Apr', 'May', 'Jun'],
  cycle: [26.4, 26.1, 25.7, 25.2, 24.6, 23.9, 23.2, 22.4, 21.7, 20.9, 20.3, 19.6, 19.0, 18.5, 18.2],
  series: [
    { name: 'eFood', values: [44, 45, 44, 43, 44, 43, 42, 43, 42, 41, 42, 41, 41, 40, 41] },
    { name: 'Talabat', values: [40, 41, 40, 40, 39, 40, 39, 40, 39, 39, 38, 39, 39, 39, 39] },
    { name: 'Glovo', values: [42, 41, 42, 42, 43, 42, 43, 44, 43, 44, 45, 45, 46, 46, 47], warn: true },
  ],
}

export const COUNCIL_FOOTER =
  'Aggregated at team level (n≥8). No individual rankings. Definitions published. Reviewed with the works council.'
