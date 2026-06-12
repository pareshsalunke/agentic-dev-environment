import { LeftRail } from './LeftRail'
import { CenterPane } from './CenterPane'
import { AgentRail } from './AgentRail'

/** §B3 layout: file tree + ticket · code/diff pane · agent timeline (380px). */
export function Workbench() {
  return (
    <div className="flex h-full min-h-0">
      <aside className="flex w-[252px] shrink-0 flex-col border-r border-hairline bg-panel">
        <LeftRail />
      </aside>
      <section className="flex min-w-0 flex-1 flex-col bg-canvas">
        <CenterPane />
      </section>
      <aside className="flex w-[380px] shrink-0 flex-col border-l border-hairline bg-panel">
        <AgentRail />
      </aside>
    </div>
  )
}
