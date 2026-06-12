import { useEffect, useMemo, useRef } from 'react'
import {
  CHECKS,
  CONTEXT_FOOTER,
  CONTEXT_HEADER,
  CONTEXT_SOURCES,
  PLAN,
  PLAN_STEP2_ORIGINAL_TAIL,
  PLAN_STEPS,
  PR,
} from '../../data/scenario'
import { STEP2_ORIGINAL, useDemo } from '../../demo/DemoContext'
import {
  chipState,
  contextFooterVisible,
  contextStarted,
  executeStarted,
  planHeaderVisible,
  planStepsShown,
  policyShown,
  riskShown,
  scriptedEdit,
  testsShown,
  STEP,
} from '../../demo/timeline'
import { PLAN_STEP2_PREFIX } from '../../data/scenario'
import { md } from '../inline'
import { ProvenanceChip } from '../ProvenanceChip'

export function AgentRail() {
  const { state } = useDemo()
  const scrollRef = useRef<HTMLDivElement>(null)

  const resolvedChips = CONTEXT_SOURCES.filter((_, i) => chipState(state, i) === 'resolved').length
  const railKey = useMemo(
    () =>
      [
        state.stepIdx,
        resolvedChips,
        planStepsShown(state),
        testsShown(state) > 0 ? 1 : 0,
        policyShown(state),
        riskShown(state) ? 1 : 0,
        state.prOpened ? 1 : 0,
        state.planLocked ? 1 : 0,
      ].join('-'),
    [state, resolvedChips],
  )
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [railKey])

  return (
    <>
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-hairline px-3">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-accent/15 font-mono text-[11px] font-bold text-accent">
          S
        </span>
        <span className="text-xs font-medium">Sous</span>
        <span className="text-[11px] text-faint">agent timeline</span>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {state.stepIdx === STEP.IDLE && (
          <p className="text-xs leading-relaxed text-faint">
            Standing by. Click <span className="text-mute">"Plan with Sous"</span> on the ticket —
            mise en place comes first.
          </p>
        )}
        {contextStarted(state) && <ContextBlock />}
        {planHeaderVisible(state) && <PlanBlock />}
        {executeStarted(state) && <ChecksBlock />}
        {state.prOpened && (
          <div className="rise text-[11.5px] text-mute">
            <span className="text-add">✓</span> PR {PR.number} opened · reviewers notified
          </div>
        )}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Beat 1 — context chips with skeleton shimmer → resolved              */
/* ------------------------------------------------------------------ */

const SKELETON_WIDTHS = [128, 168, 196, 172, 148, 120] // deterministic

function ContextBlock() {
  const { state, dispatch } = useDemo()
  return (
    <div className="rounded-lg border border-hairline bg-canvas p-2.5">
      <div className="pb-1.5 text-xs font-semibold text-ink">{CONTEXT_HEADER}</div>
      <div className="space-y-1">
        {CONTEXT_SOURCES.map((src, i) => {
          const cs = chipState(state, i)
          if (cs === 'hidden') return null
          if (cs === 'skeleton') {
            return (
              <div
                key={src.id}
                className="skel h-[22px] rounded-[5px] bg-raised"
                style={{ width: SKELETON_WIDTHS[i] }}
              />
            )
          }
          const expanded = state.expandedSource === src.id
          return (
            <div key={src.id} className="rise">
              <ProvenanceChip
                icon={src.icon}
                label={src.label}
                active={expanded}
                onClick={() => dispatch({ type: 'TOGGLE_SOURCE', id: src.id })}
              />
              {expanded && (
                <div className="mb-1 ml-1 mt-1 border-l-2 border-accent/30 pl-2">
                  <div className="font-mono text-[10.5px] text-faint">{src.sourceLine}</div>
                  <p className="mt-0.5 text-xs leading-snug text-ink/85">{md(src.excerpt)}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {contextFooterVisible(state) && (
        <div className="rise mt-2 border-t border-hairline pt-1.5 font-mono text-[10.5px] text-faint">
          {CONTEXT_FOOTER}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Beat 2 — the Plan Gate                                              */
/* ------------------------------------------------------------------ */

function PlanBlock() {
  const { state, dispatch } = useDemo()
  const shown = planStepsShown(state)
  const locked = state.planLocked

  return (
    <div
      className={[
        'rounded-lg border bg-canvas p-2.5',
        locked ? 'border-accent/40' : 'border-hairline',
      ].join(' ')}
    >
      <div className="flex items-center gap-1.5 pb-1.5">
        {locked && (
          <span className="text-[11px] text-accent" aria-hidden>
            ●
          </span>
        )}
        <span className="text-xs font-semibold text-ink">
          {locked ? PLAN.lockedHeader(state.planVersion, state.editCount) : PLAN.proposedHeader}
        </span>
      </div>
      <ol className="space-y-2.5">
        {PLAN_STEPS.slice(0, shown).map((step) => (
          <PlanStepRow key={step.n} n={step.n} />
        ))}
      </ol>
      {!locked && shown === PLAN_STEPS.length && (
        <div className="mt-3">
          <button
            type="button"
            disabled={state.cacheChoice === null}
            onClick={() => dispatch({ type: 'APPROVE_PLAN' })}
            className="w-full rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-ink transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {PLAN.approve}
          </button>
          {state.cacheChoice === null && (
            <div className="mt-1 text-center text-[10.5px] text-faint">{PLAN.approveHint}</div>
          )}
        </div>
      )}
    </div>
  )
}

function PlanStepRow({ n }: { n: number }) {
  const { state, dispatch } = useDemo()
  const step = PLAN_STEPS[n - 1]
  const locked = state.planLocked
  const edited = state.editCount > 0

  // step 2: scripted typewriter edit or manual textarea
  const scripted = scriptedEdit(state, STEP2_ORIGINAL, PLAN_STEP2_PREFIX)
  const isEditingThis = n === 2 && (scripted.active || state.manualEditing)

  const text =
    n === 2 ? (state.step2Text === STEP2_ORIGINAL && !edited ? step.text : state.step2Text) : step.text

  return (
    <li className="rise flex gap-2">
      <span className="mt-px w-3 shrink-0 text-right font-mono text-[10.5px] text-faint">
        {step.n}
      </span>
      <div className="min-w-0 flex-1">
        {isEditingThis ? (
          <Step2Editor scriptedActive={scripted.active} scriptedDraft={scripted.draft} typing={scripted.typing} />
        ) : (
          <div className="text-xs leading-relaxed text-ink/90">
            {md(text)}
            {n === 2 && !locked && !scripted.active && (
              <button
                type="button"
                onClick={() => dispatch({ type: 'OPEN_EDIT' })}
                className="ml-1.5 rounded border border-hairline px-1 py-px align-middle text-[10px] text-mute transition-colors duration-150 hover:bg-raised hover:text-ink"
                title="Edit this step"
              >
                ✎ edit
              </button>
            )}
          </div>
        )}

        {n === 2 && edited && !isEditingThis && (
          <div className="mt-1 flex items-start gap-1.5">
            <ProvenanceChip icon="±" label={`your edit · v${state.planVersion}`} />
            <span className="truncate text-[10.5px] text-faint line-through">
              {PLAN_STEP2_ORIGINAL_TAIL}
            </span>
          </div>
        )}

        {step.decision && (
          <div className="mt-1.5 space-y-1">
            {step.decision.map((opt) => {
              const selected = state.cacheChoice === opt.key
              return (
                <label
                  key={opt.key}
                  className={[
                    'flex cursor-pointer items-start gap-2 rounded-md border px-2 py-1.5 transition-colors duration-150',
                    selected ? 'border-accent/60 bg-accent/10' : 'border-hairline hover:bg-raised',
                    locked ? 'cursor-default' : '',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="cache-choice"
                    className="mt-0.5 accent-[var(--accent)]"
                    checked={selected}
                    disabled={locked}
                    onChange={() => dispatch({ type: 'SELECT_CHOICE', key: opt.key })}
                  />
                  <span className="text-[11.5px] leading-snug text-ink/90">
                    <span className="font-mono text-mute">({opt.key})</span> {md(opt.label)}
                    {opt.note && <span className="text-mute"> — {opt.note}</span>}
                  </span>
                </label>
              )
            })}
          </div>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {step.files.map((f) => (
            <span
              key={f}
              className="rounded border border-hairline px-1 py-px font-mono text-[10px] text-faint"
            >
              {f}
            </span>
          ))}
          {step.cites.map((id) => {
            const src = CONTEXT_SOURCES[id - 1]
            return (
              <ProvenanceChip
                key={id}
                icon={src.icon}
                label={src.chip}
                onClick={() => dispatch({ type: 'TOGGLE_SOURCE', id })}
              />
            )
          })}
          {step.playbook && <ProvenanceChip icon="📘" label={step.playbook} />}
        </div>
      </div>
    </li>
  )
}

function Step2Editor({
  scriptedActive,
  scriptedDraft,
  typing,
}: {
  scriptedActive: boolean
  scriptedDraft: string
  typing: boolean
}) {
  const { state, dispatch } = useDemo()
  if (scriptedActive) {
    return (
      <div className="rounded-md border border-accent/50 bg-raised p-2 text-xs leading-relaxed text-ink">
        <span className={typing ? 'caret' : ''}>{scriptedDraft}</span>
      </div>
    )
  }
  return (
    <div>
      <textarea
        autoFocus
        rows={4}
        value={state.manualDraft}
        onChange={(e) => dispatch({ type: 'SET_DRAFT', draft: e.target.value })}
        className="w-full resize-none rounded-md border border-accent/50 bg-raised p-2 text-xs leading-relaxed text-ink outline-none"
      />
      <div className="mt-1 flex gap-1.5">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SAVE_EDIT' })}
          className="rounded bg-accent px-2 py-1 text-[11px] font-semibold text-accent-ink transition-opacity duration-150 hover:opacity-90"
        >
          Save edit
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'CANCEL_EDIT' })}
          className="rounded border border-hairline px-2 py-1 text-[11px] text-mute transition-colors duration-150 hover:bg-raised hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Beat 3 — verification panel                                          */
/* ------------------------------------------------------------------ */

function ChecksBlock() {
  const { state } = useDemo()
  const tests = testsShown(state)
  const policy = policyShown(state)
  const risk = riskShown(state)
  const testsDone = tests === CHECKS.tests.total
  const sampleThresholds = [5, 10, 14]

  return (
    <div className="rise rounded-lg border border-hairline bg-canvas p-2.5">
      <div className="pb-1.5 text-xs font-semibold text-ink">{CHECKS.header}</div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-mute">{CHECKS.tests.label}</span>
        <span className="ml-auto font-mono text-[11.5px]">
          <span className={testsDone ? 'text-add' : 'text-ink'}>
            {tests}/{CHECKS.tests.total}
          </span>{' '}
          {testsDone && <span className="text-add">✓</span>}
        </span>
      </div>
      <div className="mt-1 space-y-0.5">
        {CHECKS.tests.samples.map((name, i) => {
          const done = tests >= sampleThresholds[i]
          return (
            <div key={name} className="flex items-start gap-1.5 font-mono text-[10.5px]">
              <span className={done ? 'text-add' : 'text-faint'}>{done ? '✓' : '·'}</span>
              <span className={done ? 'text-mute' : 'text-faint'}>{name}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-2 space-y-1 border-t border-hairline pt-2">
        {CHECKS.policy.map((p, i) => {
          const done = i < policy
          return (
            <div key={p} className="flex items-center gap-2 text-xs">
              <span className={done ? 'text-mute' : 'text-faint'}>{p}</span>
              <span className={['ml-auto font-mono text-[11px]', done ? 'text-add' : 'text-faint'].join(' ')}>
                {done ? '✓' : '·'}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-2 flex items-center gap-2 border-t border-hairline pt-2 text-xs">
        <span className="text-mute">{CHECKS.risk.label}</span>
        {risk ? (
          <span className="group relative ml-auto">
            <span className="rise cursor-default rounded border border-warn/50 bg-warn/10 px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-warn">
              {CHECKS.risk.level} ⓘ
            </span>
            <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-1.5 hidden w-64 rounded-md border border-hairline bg-panel p-2 text-[11px] leading-snug text-ink shadow-lg shadow-black/40 group-hover:block">
              {CHECKS.risk.tooltip}
            </span>
          </span>
        ) : (
          <span className="ml-auto font-mono text-[11px] text-faint">·</span>
        )}
      </div>
    </div>
  )
}
