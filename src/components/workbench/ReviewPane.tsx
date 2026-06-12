import {
  CONTEXT_SOURCES,
  DIFF_FILES,
  diffCounts,
  PLAN_STEPS,
  REVIEW,
} from '../../data/scenario'
import { useDemo } from '../../demo/DemoContext'
import { md } from '../inline'
import { ProvenanceChip } from '../ProvenanceChip'

/** Beat 4 — intent-grouped review: grouped by plan step, not by file. */
export function ReviewPane() {
  const { state, dispatch } = useDemo()
  return (
    <div className="rise mx-auto max-w-[760px] p-4">
      <div className="mb-3 flex items-center gap-3">
        <div>
          <div className="text-[15px] font-semibold">Review changes</div>
          <div className="text-xs text-mute">{REVIEW.caption}</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-hairline px-3 py-1.5 text-xs text-mute transition-colors duration-150 hover:bg-raised hover:text-ink"
          >
            {REVIEW.requestChanges}
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'APPROVE_PR' })}
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-ink transition-opacity duration-150 hover:opacity-90"
          >
            {REVIEW.approvePr}
          </button>
        </div>
      </div>
      <div className="space-y-2.5">
        {PLAN_STEPS.map((step) => {
          const files = DIFF_FILES.filter((f) => f.planStep === step.n)
          const text =
            step.n === 2
              ? state.step2Text
              : step.n === 4
                ? 'Cache invalidation — decision (a): event-driven bust on `DietaryDataChanged`'
                : step.text
          return (
            <div key={step.n} className="rounded-lg border border-hairline bg-panel p-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-px shrink-0 rounded bg-raised px-1.5 py-0.5 font-mono text-[10.5px] text-mute">
                  step {step.n}
                </span>
                <div className="min-w-0">
                  <div className="text-[12.5px] leading-relaxed text-ink">{md(text)}</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {step.cites.map((id) => {
                      const src = CONTEXT_SOURCES[id - 1]
                      return <ProvenanceChip key={id} icon={src.icon} label={src.chip} />
                    })}
                    {step.playbook && <ProvenanceChip icon="📘" label={step.playbook} />}
                    {step.n === 2 && state.editCount > 0 && (
                      <ProvenanceChip icon="±" label="your plan edit" />
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-2.5 space-y-1 border-t border-hairline pt-2">
                {files.map((file) => {
                  const { adds, dels } = diffCounts(file)
                  return (
                    <div key={file.path} className="flex items-center gap-2">
                      <span className="truncate font-mono text-[11px] text-mute">{file.path}</span>
                      <span className="ml-auto shrink-0 font-mono text-[10.5px]">
                        <span className="text-add">+{adds}</span>{' '}
                        <span className="text-del">−{dels}</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
