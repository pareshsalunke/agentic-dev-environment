import { PR } from '../../data/scenario'

/** Beat 4 — the PR card with the verbatim AI-provenance block. */
export function PrCard() {
  return (
    <div className="rise mx-auto max-w-[640px] p-6">
      <div className="rounded-lg border border-hairline bg-panel p-5">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-add" aria-hidden>
            ⎇
          </span>
          <div>
            <div className="text-[15px] font-semibold leading-snug">{PR.title}</div>
            <div className="mt-1 font-mono text-xs text-mute">
              {PR.number} · base{' '}
              <code className="rounded border border-hairline/70 bg-raised px-1 py-px">
                {PR.base}
              </code>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-hairline pt-3 text-xs">
          <span className="text-mute">{PR.reviewersLabel}</span>
          {PR.reviewers.map((r) => (
            <span
              key={r}
              className="rounded border border-hairline bg-raised px-1.5 py-0.5 font-mono text-[11px] text-ink"
            >
              {r}
            </span>
          ))}
        </div>

        <div className="mt-3 rounded-md border border-accent/35 bg-accent/10 p-3">
          <div className="text-xs font-semibold text-ink">{PR.provenanceLabel}</div>
          <p className="mt-1 text-xs leading-relaxed text-ink/90">{PR.provenance}</p>
        </div>
      </div>
    </div>
  )
}
