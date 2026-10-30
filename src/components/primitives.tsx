import type { ReactNode } from 'react'

export function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`label-mono text-mute ${className}`}>{children}</span>
}

export function Rule({ className = '' }: { className?: string }) {
  return <div className={`paper-rule w-full opacity-70 ${className}`} aria-hidden="true" />
}

export function Field({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-t border-line-soft py-3 sm:grid-cols-[7rem_1fr]">
      <Label>{label}</Label>
      <div className="text-[0.95rem] leading-relaxed text-ink [text-wrap:pretty]">{value}</div>
    </div>
  )
}
