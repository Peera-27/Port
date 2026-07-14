export function Section({
  id,
  title,
  action,
  children,
}: {
  id: string
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    // No scroll-mt here: `html { scroll-padding-top }` already clears the sticky
    // header. Setting both stacks the offsets and overshoots the anchor.
    <section id={id} aria-labelledby={`${id}-heading`}>
      {/* Label + rule: the divider does the separating, so sections don't need
          to rely on whitespace alone to feel distinct. */}
      <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-border pb-3">
        <h2
          id={`${id}-heading`}
          className="font-mono text-xs font-medium uppercase tracking-widest text-fg-subtle"
        >
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
