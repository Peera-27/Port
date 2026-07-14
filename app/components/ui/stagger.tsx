import { cn } from '@/app/components/ui/cn'

/**
 * A single item in a staggered list. Must live inside a <Reveal> — the reveal's
 * `data-visible` is what releases the transition. Index drives the delay, so the
 * whole sequence costs zero JS and one CSS custom property.
 */
export function StaggerItem({
  index,
  className,
  children,
}: {
  index: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn('stagger-item', className)}
      style={{ '--i': index } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
