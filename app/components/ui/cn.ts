/** Joins class names, dropping falsy values. Deliberately tiny — no clsx dependency. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
