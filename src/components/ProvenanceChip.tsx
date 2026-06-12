/**
 * §B6 — the signature element: a small bordered tag used in the context
 * list, on plan steps, and on diff hunks. The same atom everywhere,
 * because "grounding" is the product.
 */
export function ProvenanceChip({
  icon,
  label,
  onClick,
  active = false,
  title,
}: {
  icon?: string
  label: string
  onClick?: () => void
  active?: boolean
  title?: string
}) {
  const cls = [
    'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-[5px] border px-1.5 py-[2.5px]',
    'text-[11px] font-medium leading-none text-accent',
    active ? 'border-accent/70 bg-accent/15' : 'border-accent/35 bg-accent/10',
    onClick ? 'cursor-pointer transition-colors duration-150 hover:border-accent/70 hover:bg-accent/15' : '',
  ].join(' ')
  const content = (
    <>
      {icon && <span className="text-[10px] leading-none grayscale">{icon}</span>}
      <span>{label}</span>
    </>
  )
  if (onClick) {
    return (
      <button type="button" className={cls} onClick={onClick} title={title}>
        {content}
      </button>
    )
  }
  return (
    <span className={cls} title={title}>
      {content}
    </span>
  )
}
