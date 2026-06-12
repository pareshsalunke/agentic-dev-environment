import { SHELL } from '../data/scenario'
import { useDemo } from '../demo/DemoContext'
import type { Brand, TabId } from '../types'

export function TopBar() {
  const { state, dispatch } = useDemo()
  return (
    <header className="shrink-0 border-b border-hairline bg-panel">
      <div className="flex h-12 items-center gap-3 px-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-[17px] font-semibold tracking-tight">{SHELL.wordmark}</span>
          <span className="text-xs text-mute">{SHELL.subtitle}</span>
        </div>
        {/* strategically load-bearing: buy the editor, build the layer */}
        <span className="hidden rounded-full border border-hairline px-2.5 py-1 text-[11px] leading-none text-mute xl:inline-block">
          {SHELL.pill}
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="rounded border border-hairline border-dashed px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-faint">
            {SHELL.demoData}
          </span>
          <BrandSwitcher />
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-hairline bg-raised text-[11px] font-medium text-mute">
            {SHELL.avatar}
          </span>
        </div>
      </div>
      <nav className="flex h-9 items-end gap-1 px-4">
        {SHELL.tabs.map((t) => {
          const active = state.tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => dispatch({ type: 'SET_TAB', tab: t.id as TabId })}
              className={[
                'border-b-2 px-3 pb-2 text-[13px] transition-colors duration-150',
                active
                  ? 'border-ink font-medium text-ink'
                  : 'border-transparent text-mute hover:text-ink',
              ].join(' ')}
            >
              {t.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}

function BrandSwitcher() {
  const { state, dispatch } = useDemo()
  return (
    <div className="flex items-center rounded-md border border-hairline bg-canvas p-0.5">
      {SHELL.brands.map((b) => {
        const active = state.brand === b.id
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => dispatch({ type: 'SET_BRAND', brand: b.id as Brand })}
            className={[
              'flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors duration-150',
              active ? 'bg-raised font-medium text-ink' : 'text-mute hover:text-ink',
            ].join(' ')}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: b.dot, opacity: active ? 1 : 0.45 }}
            />
            {b.label}
          </button>
        )
      })}
    </div>
  )
}
