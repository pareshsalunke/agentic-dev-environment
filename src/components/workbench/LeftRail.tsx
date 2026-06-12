import { DIFF_FILES, FILE_TREE, TICKET } from '../../data/scenario'
import { useDemo } from '../../demo/DemoContext'
import { activeFile, beatOf, fileLinesShown, STEP } from '../../demo/timeline'
import { md } from '../inline'
import type { TreeNode } from '../../types'

export function LeftRail() {
  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto py-2">
        <FileTree />
      </div>
      <TicketCard />
    </>
  )
}

function FileTree() {
  const { state } = useDemo()
  const streaming = activeFile(state)
  const streamingKey = streaming !== null ? DIFF_FILES[streaming].shortPath : null
  const touched = new Set(
    DIFF_FILES.filter((_, f) => fileLinesShown(state, f) > 0).map((d) => d.shortPath),
  )
  return (
    <div className="px-2">
      <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-faint">
        Explorer
      </div>
      <TreeRow node={FILE_TREE} depth={0} streamingKey={streamingKey} touched={touched} />
    </div>
  )
}

function TreeRow({
  node,
  depth,
  streamingKey,
  touched,
}: {
  node: TreeNode
  depth: number
  streamingKey: string | null
  touched: Set<string>
}) {
  const isDir = !!node.children
  const isStreaming = node.key != null && node.key === streamingKey
  const isTouched = node.key != null && touched.has(node.key)
  return (
    <div>
      <div
        className={[
          'flex items-center gap-1.5 rounded px-2 py-[3px] text-xs',
          isStreaming ? 'bg-raised text-ink' : isTouched ? 'text-ink' : isDir ? 'text-mute' : 'text-mute',
        ].join(' ')}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        <span className="w-3 shrink-0 text-center text-[9px] text-faint">
          {isDir ? '▾' : ''}
        </span>
        <span className="truncate">{node.name}</span>
        {isTouched && (
          <span className="ml-auto pr-1 font-mono text-[10px] text-accent" title="modified by Sous">
            M
          </span>
        )}
      </div>
      {node.children?.map((c) => (
        <TreeRow
          key={c.name}
          node={c}
          depth={depth + 1}
          streamingKey={streamingKey}
          touched={touched}
        />
      ))}
    </div>
  )
}

function TicketCard() {
  const { state, dispatch } = useDemo()
  const beat = beatOf(state)
  const statusLabel: Record<number, string> = {
    1: 'Sous is assembling context…',
    2: 'Plan Gate — awaiting your direction',
    3: 'Sous is executing the plan…',
    4: 'Verified change in review',
    5: 'AI-guided unit of work logged ✓',
  }
  return (
    <div className="shrink-0 border-t border-hairline p-3">
      <div className="font-mono text-[11px] text-mute">{TICKET.id}</div>
      <div className="mt-0.5 text-[13px] font-semibold leading-snug">{TICKET.title}</div>
      <div className="mt-1.5 inline-block rounded border border-hairline px-1.5 py-0.5 text-[10.5px] text-mute">
        {TICKET.tags}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-mute">{md(TICKET.body)}</p>
      {state.stepIdx === STEP.IDLE ? (
        <button
          type="button"
          onClick={() => dispatch({ type: 'START_PLAN' })}
          className="mt-3 w-full rounded-md bg-accent px-3 py-2 text-[13px] font-semibold text-accent-ink transition-opacity duration-150 hover:opacity-90"
        >
          {TICKET.cta}
        </button>
      ) : (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-hairline bg-canvas px-2.5 py-2 text-[11.5px] text-mute">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          {statusLabel[beat.n]}
        </div>
      )}
    </div>
  )
}
