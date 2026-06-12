import { TOAST } from '../data/scenario'
import { useDemo } from '../demo/DemoContext'

/** Beat 5 (P1) — impact tick, bottom-left, with tab jump. */
export function Toast() {
  const { state, dispatch } = useDemo()
  if (!state.toastVisible) return null
  return (
    <div className="rise fixed bottom-4 left-4 z-50 w-[420px] rounded-lg border border-hairline bg-panel p-3 shadow-lg shadow-black/40">
      <div className="flex items-start gap-2.5">
        <span className="mt-px font-mono text-[13px] text-accent">✓</span>
        <div className="min-w-0 text-xs leading-relaxed text-ink">
          {TOAST.text}
          <div className="mt-1.5">
            <button
              type="button"
              onClick={() => dispatch({ type: 'VIEW_IMPACT' })}
              className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors duration-150 hover:decoration-accent"
            >
              {TOAST.link}
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => dispatch({ type: 'DISMISS_TOAST' })}
          className="ml-auto rounded px-1 text-mute transition-colors duration-150 hover:bg-raised hover:text-ink"
        >
          ×
        </button>
      </div>
    </div>
  )
}
