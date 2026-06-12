import { useState } from 'react'
import {
  COUNCIL_FOOTER,
  COUNTER_METRICS,
  FUNNEL,
  KPIS,
} from '../../data/dashboard'
import { TrendChart } from './TrendChart'

/** §B4 — Adoption & Impact. KPI row and counter-metrics row are visual equals. */
export function ImpactView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[1180px] space-y-3 p-4 pb-16">
        <KpiRow />
        <FunnelPanel />
        <CounterRow />
        <TrendChart />
        <p className="pt-1 text-center text-[11px] text-faint">{COUNCIL_FOOTER}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-hairline bg-panel p-4 ${className}`}>{children}</div>
  )
}

function KpiRow() {
  const [defOpen, setDefOpen] = useState(false)
  const ns = KPIS.northstar
  return (
    <div className="grid grid-cols-4 gap-3">
      <Card className="relative">
        <div className="flex items-center gap-1.5 text-xs text-mute">
          {ns.label}
          <button
            type="button"
            aria-label="Northstar definition"
            onClick={() => setDefOpen((v) => !v)}
            className="flex h-4 w-4 items-center justify-center rounded-full border border-hairline text-[9.5px] text-mute transition-colors duration-150 hover:bg-raised hover:text-ink"
          >
            i
          </button>
        </div>
        {defOpen && (
          <>
            <button
              type="button"
              aria-label="Close definition"
              className="fixed inset-0 z-20 cursor-default"
              onClick={() => setDefOpen(false)}
            />
            <div className="absolute left-3 top-9 z-30 w-72 rounded-md border border-hairline bg-raised p-3 text-xs leading-relaxed text-ink shadow-lg shadow-black/40">
              {ns.definition}
            </div>
          </>
        )}
        <div className="mt-1 font-mono text-[26px] font-medium leading-none text-accent">
          {ns.value}
        </div>
        <div className="mt-1.5 text-[11.5px] text-add">{ns.delta}</div>
        <div className="mt-2.5 h-1.5 rounded-full bg-raised">
          <div className="h-1.5 rounded-full bg-accent" style={{ width: `${ns.pct}%` }} />
        </div>
        <div className="mt-1 text-[10.5px] text-faint">{ns.target}</div>
      </Card>

      <Card>
        <div className="text-xs text-mute">{KPIS.prShare.label}</div>
        <div className="mt-1 font-mono text-[26px] font-medium leading-none">{KPIS.prShare.value}</div>
        <div className="mt-1.5 text-[11.5px] text-add">{KPIS.prShare.sub}</div>
      </Card>

      <Card>
        <div className="text-xs text-mute">{KPIS.cycleTime.label}</div>
        <div className="mt-1 font-mono text-[26px] font-medium leading-none">{KPIS.cycleTime.value}</div>
        <div className="mt-1.5 text-[11.5px] text-add">{KPIS.cycleTime.sub}</div>
      </Card>

      <Card>
        <div className="text-xs text-mute">{KPIS.ratio.label}</div>
        <div className="mt-1 font-mono text-[26px] font-medium leading-none">{KPIS.ratio.value}</div>
        <div className="mt-1.5 text-[11.5px] text-mute">{KPIS.ratio.sub}</div>
        <div className="mt-2.5 flex h-1.5 overflow-hidden rounded-full bg-raised">
          <div className="bg-mute/60" style={{ width: '62%' }} />
          <div className="bg-mute/25" style={{ width: '38%' }} />
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function FunnelPanel() {
  return (
    <Card>
      <div className="text-[13px] font-semibold">{FUNNEL.title}</div>
      <div className="mt-3 space-y-2">
        {FUNNEL.stages.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="w-56 shrink-0">
              <span className="text-xs text-ink">{s.label}</span>
              <span className="ml-1.5 text-[10.5px] text-faint">{s.detail}</span>
            </div>
            <div className="h-5 flex-1 rounded bg-raised/60">
              <div
                className={[
                  'h-5 rounded transition-none',
                  s.northstar ? 'bg-accent' : 'bg-mute/30',
                ].join(' ')}
                style={{ width: `${s.pct}%` }}
              />
            </div>
            <span className="w-12 shrink-0 text-right font-mono text-[13px]">{s.pct}%</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */

function CounterRow() {
  const cm = COUNTER_METRICS
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-2 px-0.5">
        <span className="text-[13px] font-semibold">{cm.title}</span>
        <span className="text-[11px] text-faint">{cm.subtitle}</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <Card className="col-span-2">
          <div className="text-xs text-mute">{cm.review.label}</div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {cm.review.brands.map((b) => (
              <ReviewBrandCell key={b.name} brand={b} />
            ))}
          </div>
        </Card>
        <Card>
          <div className="text-xs text-mute">{cm.changeFailure.label}</div>
          <div className="mt-1 font-mono text-[26px] font-medium leading-none">
            {cm.changeFailure.value}
          </div>
          <div className="mt-1.5 text-[11.5px] text-mute">{cm.changeFailure.sub}</div>
        </Card>
        <Card>
          <div className="text-xs text-mute">{cm.revertRate.label}</div>
          <div className="mt-1 font-mono text-[26px] font-medium leading-none">
            {cm.revertRate.value}
          </div>
          <div className="mt-1.5 text-[11.5px] text-mute">{cm.revertRate.sub}</div>
        </Card>
      </div>
    </div>
  )
}

function ReviewBrandCell({
  brand,
}: {
  brand: (typeof COUNTER_METRICS)['review']['brands'][number]
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <div className="text-[11px] text-faint">{brand.name}</div>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span className="font-mono text-[20px] font-medium leading-none">{brand.value}</span>
        <span className={`text-[11.5px] ${brand.good ? 'text-add' : 'text-del'}`}>{brand.delta}</span>
        {brand.warn && (
          <button
            type="button"
            aria-label={`${brand.name} annotation`}
            onClick={() => setOpen((v) => !v)}
            className="rounded border border-warn/50 bg-warn/10 px-1 text-[11px] leading-snug text-warn transition-colors duration-150 hover:bg-warn/20"
          >
            ⚠
          </button>
        )}
      </div>
      {brand.warn && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-1 text-left text-[10.5px] text-warn/90 underline decoration-warn/40 underline-offset-2 hover:decoration-warn"
        >
          Investigating…
        </button>
      )}
      {open && brand.annotation && (
        <>
          <button
            type="button"
            aria-label="Close annotation"
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-30 mt-1.5 w-72 rounded-md border border-warn/40 bg-raised p-3 text-xs leading-relaxed text-ink shadow-lg shadow-black/40">
            <span className="mr-1 text-warn">⚠</span>
            {brand.annotation}
          </div>
        </>
      )}
    </div>
  )
}
