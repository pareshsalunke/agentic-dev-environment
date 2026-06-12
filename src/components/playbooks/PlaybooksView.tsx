import { PLAYBOOKS, PLAYBOOKS_HEADER } from '../../data/playbooks'

/** §B5 — paved-road playbook gallery (P1). */
export function PlaybooksView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[1180px] p-4 pb-16">
        <div className="flex items-baseline gap-2 px-0.5">
          <span className="text-[15px] font-semibold">{PLAYBOOKS_HEADER.title}</span>
          <span className="text-xs text-faint">{PLAYBOOKS_HEADER.subtitle}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {PLAYBOOKS.map((pb) => (
            <div key={pb.name} className="rounded-lg border border-hairline bg-panel p-4">
              <div className="flex items-start gap-2">
                <span className="text-[13.5px] font-semibold leading-snug">{pb.name}</span>
                <span className="ml-auto shrink-0 rounded border border-hairline bg-raised px-1.5 py-0.5 font-mono text-[10.5px] text-mute">
                  {pb.version}
                </span>
              </div>
              <div className="mt-2 font-mono text-[11.5px] text-mute">
                {pb.runs} · <span className="text-ink">{pb.merged}</span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="rounded border border-hairline px-1.5 py-0.5 text-[10.5px] text-mute">
                  {pb.scope}
                </span>
                {pb.badge && (
                  <span className="rounded border border-warn/40 bg-warn/10 px-1.5 py-0.5 text-[10.5px] text-warn">
                    {pb.badge}
                  </span>
                )}
              </div>
              <p className="mt-2.5 border-t border-hairline pt-2 text-[11.5px] leading-relaxed text-mute">
                <span className="text-faint">Encodes:</span> {pb.encodes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
