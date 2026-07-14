import { cn } from '@/app/components/ui/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'icon'

/**
 * Every clickable control in the app renders through here, so focus, press and
 * hover feedback stay identical whether the element is a <button> or an <a>.
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded-control border font-medium ' +
  'transition duration-200 ease-out-soft ' +
  'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] ' +
  'disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary:
    'border-transparent bg-fg text-bg shadow-e1 hover:opacity-90 hover:shadow-e2',
  secondary:
    'border-border bg-surface text-fg hover:border-border-strong hover:bg-surface-hover',
  ghost:
    'border-transparent bg-transparent text-fg-muted hover:bg-surface-hover hover:text-fg',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  icon: 'size-9 shrink-0',
}

function styles(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

type CommonProps = { variant?: Variant; size?: Size; className?: string }

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}: CommonProps & React.ComponentPropsWithoutRef<'button'>) {
  return <button className={styles(variant, size, className)} {...props} />
}

/** Same chrome as Button, for links. External links get the safe rel by default. */
export function ButtonLink({
  variant = 'secondary',
  size = 'md',
  className,
  href,
  external,
  ...props
}: CommonProps &
  React.ComponentPropsWithoutRef<'a'> & { href: string; external?: boolean }) {
  return (
    <a
      href={href}
      className={styles(variant, size, className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  )
}
