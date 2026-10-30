import { Link } from 'react-router-dom'
import type { Concept } from '../data/concepts'
import { lineMeta, eraMeta } from '../data/concepts'

export function LineBadge({
  line,
  withLabel = true,
  invert = false,
}: {
  line: Concept['line']
  withLabel?: boolean
  invert?: boolean
}) {
  const meta = lineMeta[line]
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block h-[7px] w-[7px] rotate-45"
        style={{ backgroundColor: meta.color }}
        aria-hidden="true"
      />
      {withLabel && (
        <span className="label-mono" style={{ color: invert ? 'var(--color-paper)' : meta.ink }}>
          {meta.label}
        </span>
      )}
    </span>
  )
}

export function ConceptCard({
  concept,
  i,
}: {
  concept: Concept
  i: number
}) {
  const dark = concept.era === 'classical'
  const lineInk = 'var(--color-mute)'

  return (
    <Link
      to={`/archive/${concept.id}`}
      className={`cascade group flex h-full flex-col p-5 transition-[background-color,border-color] duration-500 md:p-6 ${
        dark ? 'border border-ink' : 'index-card'
      }`}
      style={
        {
          '--index': i,
          ...(dark
            ? {
                backgroundColor: 'var(--color-ink)',
                borderColor: 'var(--color-ink)',
              }
            : null),
        } as React.CSSProperties
      }
    >
      <div className="flex items-start justify-between">
        <span
          className="font-mono text-xs tracking-widest"
          style={{ color: dark ? 'rgba(233,229,219,0.42)' : lineInk }}
        >
          {concept.index}
        </span>
        <LineBadge line={concept.line} invert={dark} />
      </div>
      <h3
        className={`mt-6 font-display text-2xl tracking-tight ${dark ? 'text-paper' : 'text-ink'}`}
      >
        {concept.term}
      </h3>
      <p
        className="mt-0.5 font-serif-en text-sm italic tracking-wide"
        style={{ color: dark ? 'rgba(233,229,219,0.55)' : 'var(--color-mute-soft)' }}
      >
        {concept.termLatin}
      </p>
      <p
        className="mt-4 line-clamp-3 text-sm leading-relaxed"
        style={{ color: dark ? 'rgba(233,229,219,0.74)' : 'var(--color-mute)' }}
      >
        {concept.definition}
      </p>
      <div
        className="mt-auto flex items-baseline justify-between border-t pt-3"
        style={{
          marginTop: '1.5rem',
          borderColor: dark ? 'rgba(233,229,219,0.18)' : 'var(--color-line-soft)',
        }}
      >
        <span
          className="text-xs tracking-wide"
          style={{ color: dark ? 'var(--color-paper)' : 'rgba(28,26,23,0.8)' }}
        >
          {concept.thinker}
        </span>
        <span
          className="label-mono"
          style={{ color: dark ? 'rgba(233,229,219,0.5)' : lineInk }}
        >
          {eraMeta[concept.era].label}
        </span>
      </div>
    </Link>
  )
}
