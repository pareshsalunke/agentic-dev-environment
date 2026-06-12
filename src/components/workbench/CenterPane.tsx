import { memo, useEffect, useMemo, useRef } from 'react'
import { DIFF_FILES, diffCounts, EDITOR_FILE } from '../../data/scenario'
import { useDemo } from '../../demo/DemoContext'
import {
  activeFile,
  centerMode,
  fileCardVisible,
  fileLinesShown,
  type CenterMode,
} from '../../demo/timeline'
import { ProvenanceChip } from '../ProvenanceChip'
import { ReviewPane } from './ReviewPane'
import { PrCard } from './PrCard'
import type { DiffFile } from '../../types'

const MODE_LABEL: Record<CenterMode, string> = {
  editor: 'editor',
  diff: 'verified diffs · streaming',
  review: 'review · grouped by intent',
  pr: 'pull request',
}

export function CenterPane() {
  const { state } = useDemo()
  const mode = centerMode(state, state.prOpened)
  const scrollRef = useRef<HTMLDivElement>(null)

  const totalShown = useMemo(
    () => DIFF_FILES.reduce((sum, _, f) => sum + fileLinesShown(state, f), 0),
    [state],
  )

  // follow the diff stream; jump to top when the view switches
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (mode === 'diff') el.scrollTop = el.scrollHeight
    else el.scrollTop = 0
  }, [mode, totalShown])

  return (
    <>
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-hairline bg-panel px-3">
        <span className="truncate font-mono text-[11px] text-mute">
          {mode === 'editor'
            ? 'menu-service / src/main/kotlin / dto / MenuItemDetailsDto.kt'
            : 'menu-service'}
        </span>
        <span className="ml-auto rounded border border-hairline px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-faint">
          {MODE_LABEL[mode]}
        </span>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {mode === 'editor' && <EditorView />}
        {mode === 'diff' && <DiffStream />}
        {mode === 'review' && <ReviewPane />}
        {mode === 'pr' && <PrCard />}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Pre-Beat-3: the untouched DTO file, so the canvas reads as an editor */
/* ------------------------------------------------------------------ */

function EditorView() {
  return (
    <div className="p-0">
      <div className="flex border-b border-hairline bg-panel">
        <span className="border-r border-hairline bg-canvas px-3 py-1.5 font-mono text-[11.5px] text-ink">
          {EDITOR_FILE.name}
        </span>
      </div>
      <pre className="px-0 py-3 font-mono text-xs leading-[1.6]">
        {EDITOR_FILE.lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="w-12 shrink-0 select-none pr-4 text-right text-faint">{i + 1}</span>
            <span className="whitespace-pre text-mute">{line || ' '}</span>
          </div>
        ))}
      </pre>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Beat 3 — diffs stream file-by-file with per-hunk provenance chips    */
/* ------------------------------------------------------------------ */

function DiffStream() {
  const { state } = useDemo()
  const streaming = activeFile(state)
  return (
    <div className="space-y-3 p-3">
      {DIFF_FILES.map((file, f) =>
        fileCardVisible(state, f) ? (
          <DiffFileCard
            key={file.path}
            file={file}
            shown={fileLinesShown(state, f)}
            streaming={streaming === f}
          />
        ) : null,
      )}
    </div>
  )
}

const DiffFileCard = memo(function DiffFileCard({
  file,
  shown,
  streaming,
}: {
  file: DiffFile
  shown: number
  streaming: boolean
}) {
  const { adds, dels } = diffCounts(file)
  let offset = 0
  return (
    <div className="rise overflow-hidden rounded-lg border border-hairline bg-panel">
      <div className="flex items-center gap-2 border-b border-hairline px-3 py-2">
        <span className="truncate font-mono text-[11.5px] text-ink">{file.path}</span>
        <span className="ml-auto shrink-0 font-mono text-[11px]">
          <span className="text-add">+{adds}</span>{' '}
          <span className="text-del">−{dels}</span>
        </span>
      </div>
      {file.hunks.map((hunk, h) => {
        const start = offset
        offset += hunk.lines.length
        const take = Math.max(0, Math.min(shown - start, hunk.lines.length))
        if (shown <= start && h > 0) return null
        return (
          <div key={h}>
            <div className="flex items-center gap-2 bg-canvas/60 px-3 py-1">
              <span className="font-mono text-[10.5px] text-faint">{hunk.header}</span>
              <span className="ml-auto">
                <ProvenanceChip icon={hunk.chip.icon} label={hunk.chip.label} />
              </span>
            </div>
            <pre className="font-mono text-[11.5px] leading-[1.55]">
              {hunk.lines.slice(0, take).map((line, i) => (
                <div
                  key={i}
                  className={[
                    'flex',
                    line.k === 'add'
                      ? 'bg-addbg/70 text-add'
                      : line.k === 'del'
                        ? 'bg-delbg/60 text-del'
                        : 'text-mute',
                  ].join(' ')}
                >
                  <span className="w-7 shrink-0 select-none text-center">
                    {line.k === 'add' ? '+' : line.k === 'del' ? '−' : ' '}
                  </span>
                  <span className="whitespace-pre pr-3">{line.s || ' '}</span>
                </div>
              ))}
            </pre>
          </div>
        )
      })}
      {streaming && (
        <div className="flex items-center gap-1 px-3 py-1.5">
          <span className="caret font-mono text-[11px] text-faint">sous · writing</span>
        </div>
      )}
    </div>
  )
})
