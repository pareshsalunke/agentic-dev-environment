import type { ReactNode } from 'react'

/** Renders fixture strings with `code` and **bold** spans. */
export function md(text: string): ReactNode[] {
  const out: ReactNode[] = []
  // split on `code` first, then **bold** inside the plain segments
  const codeParts = text.split(/(`[^`]+`)/g)
  codeParts.forEach((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      out.push(
        <code
          key={`c${i}`}
          className="rounded border border-hairline/70 bg-raised px-1 py-px font-mono text-[0.88em]"
        >
          {part.slice(1, -1)}
        </code>,
      )
      return
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g)
    boldParts.forEach((b, j) => {
      if (b.startsWith('**') && b.endsWith('**') && b.length > 3) {
        out.push(
          <strong key={`b${i}-${j}`} className="font-semibold text-ink">
            {b.slice(2, -2)}
          </strong>,
        )
      } else if (b !== '') {
        out.push(b)
      }
    })
  })
  return out
}
