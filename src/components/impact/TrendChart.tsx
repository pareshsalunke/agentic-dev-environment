import { TREND } from '../../data/dashboard'

/* P1 — PR cycle time (falling) overlaid with review time/PR
   (mostly flat, Glovo ticking up). Hand-rolled SVG, hard-coded points. */

const W = 1080
const H = 230
const PAD = { l: 44, r: 48, t: 16, b: 28 }
const plotW = W - PAD.l - PAD.r
const plotH = H - PAD.t - PAD.b

const CYCLE_MIN = 16
const CYCLE_MAX = 28
const REVIEW_MIN = 30
const REVIEW_MAX = 50

function x(i: number, n: number) {
  return PAD.l + (i / (n - 1)) * plotW
}
function yCycle(v: number) {
  return PAD.t + (1 - (v - CYCLE_MIN) / (CYCLE_MAX - CYCLE_MIN)) * plotH
}
function yReview(v: number) {
  return PAD.t + (1 - (v - REVIEW_MIN) / (REVIEW_MAX - REVIEW_MIN)) * plotH
}
function points(values: number[], y: (v: number) => number) {
  return values.map((v, i) => `${x(i, values.length).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
}

export function TrendChart() {
  const n = TREND.weeks.length
  return (
    <div className="rounded-lg border border-hairline bg-panel p-4">
      <div className="flex items-baseline gap-3">
        <span className="text-[13px] font-semibold">{TREND.title}</span>
        <div className="ml-auto flex items-center gap-3 text-[10.5px] text-mute">
          <LegendSwatch className="bg-ink" label="PR cycle time (h)" />
          <LegendSwatch className="bg-mute" label="review — eFood (m)" dashed />
          <LegendSwatch className="bg-faint" label="review — Talabat (m)" dashed />
          <LegendSwatch className="bg-warn" label="review — Glovo (m) ⚠" dashed />
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label={TREND.title}>
        {/* gridlines + cycle axis (left, hours) */}
        {[18, 22, 26].map((v) => (
          <g key={v}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={yCycle(v)}
              y2={yCycle(v)}
              stroke="var(--color-hairline)"
              strokeWidth="1"
            />
            <text
              x={PAD.l - 8}
              y={yCycle(v) + 3}
              textAnchor="end"
              className="fill-faint font-mono text-[10px]"
            >
              {v}h
            </text>
          </g>
        ))}
        {/* review axis (right, minutes) */}
        {[35, 40, 45].map((v) => (
          <text
            key={v}
            x={W - PAD.r + 8}
            y={yReview(v) + 3}
            textAnchor="start"
            className="fill-faint font-mono text-[10px]"
          >
            {v}m
          </text>
        ))}
        {/* month ticks */}
        {TREND.monthTicks.map((idx, i) => (
          <text
            key={idx}
            x={x(idx, n)}
            y={H - 8}
            textAnchor="middle"
            className="fill-faint font-mono text-[10px]"
          >
            {TREND.monthLabels[i]}
          </text>
        ))}
        {/* review series (right axis) */}
        {TREND.series.map((s) => (
          <polyline
            key={s.name}
            points={points(s.values, yReview)}
            fill="none"
            stroke={s.warn ? 'var(--color-warn)' : s.name === 'eFood' ? 'var(--color-mute)' : 'var(--color-faint)'}
            strokeWidth={s.warn ? 1.8 : 1.4}
            strokeDasharray="5 4"
          />
        ))}
        {/* cycle time (left axis) — the headline series */}
        <polyline
          points={points(TREND.cycle, yCycle)}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2"
        />
        {TREND.cycle.map((v, i) => (
          <circle key={i} cx={x(i, n)} cy={yCycle(v)} r="2.2" fill="var(--color-ink)" />
        ))}
        {/* axis captions */}
        <text x={PAD.l} y={PAD.t - 4} className="fill-faint font-mono text-[10px]">
          {TREND.cycleAxis}
        </text>
        <text x={W - PAD.r} y={PAD.t - 4} textAnchor="end" className="fill-faint font-mono text-[10px]">
          {TREND.reviewAxis}
        </text>
      </svg>
    </div>
  )
}

function LegendSwatch({
  className,
  label,
  dashed = false,
}: {
  className: string
  label: string
  dashed?: boolean
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block h-[2px] w-4 ${className} ${dashed ? 'opacity-80' : ''}`} />
      {label}
    </span>
  )
}
