import { cn } from '@/app/components/ui/cn'

/**
 * Small, non-interactive labels. `pill` is the status marker in the hero;
 * `chip` is a skill tag — it lifts on hover purely to feel alive, not to imply
 * it is clickable (no cursor change, no href).
 */
export function Badge({
  shape = 'chip',
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'span'> & { shape?: 'chip' | 'pill' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 border border-border bg-surface text-xs font-medium text-fg-muted',
        shape === 'pill'
          ? 'rounded-full px-3 py-1'
          : 'group/chip rounded-control px-2.5 py-1.5 transition duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover hover:text-fg',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/** The pulsing availability dot. */
export function StatusDot() {
  return (
    <span className="relative flex size-1.5">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
      <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
    </span>
  )
}
