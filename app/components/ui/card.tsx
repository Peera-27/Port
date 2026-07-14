import { cn } from '@/app/components/ui/cn'

/**
 * Surface container. `interactive` adds the lift + elevation used by anything
 * the user can click; static cards (skeletons, empty states) leave it off so
 * they don't advertise affordances they don't have.
 */
export function cardStyles(interactive?: boolean, className?: string) {
  return cn(
    'rounded-card border border-border bg-surface',
    interactive &&
      'group shadow-e1 transition duration-200 ease-out-soft ' +
        'hover:-translate-y-0.5 hover:border-border-strong hover:shadow-e2 ' +
        'active:translate-y-0 active:scale-[0.995]',
    className,
  )
}

export function Card({
  interactive,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & { interactive?: boolean }) {
  return <div className={cardStyles(interactive, className)} {...props} />
}
