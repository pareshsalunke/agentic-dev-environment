import { useDemo } from '../demo/DemoContext'
import { beatOf, demoFinished, nextActionLabel, STEP } from '../demo/timeline'

/** §B2 — bottom-right floating, subtle. ▶ Run demo · →/Space · R reset. */
export function DemoControls() {
  const { state, dispatch } = useDemo()
  const beat = beatOf(state)
  const finished = demoFinished(state)
  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-lg border border-hairline bg-panel/95 px-2 py-1.5 text-xs shadow-lg shadow-black/30">
      <button
        type="button"
        onClick={() => dispatch({ type: 'PLAY' })}
        className="rounded border border-hairline px-2 py-1 text-mute transition-colors duration-150 hover:bg-raised hover:text-ink"
      >
        {state.autoplay ? '⏸ Pause' : '▶ Run demo'}
      </button>
      <button
        type="button"
        disabled={finished || state.tab !== 'workbench'}
        onClick={() =>
          dispatch(state.stepIdx === STEP.IDLE ? { type: 'START_PLAN' } : { type: 'ADVANCE' })
        }
        className="flex items-center gap-1.5 rounded border border-hairline px-2 py-1 text-mute transition-colors duration-150 hover:bg-raised hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        <kbd className="rounded border border-hairline bg-raised px-1 font-mono text-[10px]">→</kbd>
        {nextActionLabel(state)}
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: 'RESET' })}
        className="flex items-center gap-1.5 rounded border border-hairline px-2 py-1 text-mute transition-colors duration-150 hover:bg-raised hover:text-ink"
        title="Reset to pre-Beat-1"
      >
        <kbd className="rounded border border-hairline bg-raised px-1 font-mono text-[10px]">R</kbd>
        Reset
      </button>
      <span className="pl-1 pr-0.5 font-mono text-[10px] text-faint">
        {beat.n === 0 ? 'Ready' : `Beat ${beat.n}/5 · ${beat.label}`}
      </span>
    </div>
  )
}
