import { Link } from 'react-router-dom'
import { linkify } from '../lib/linkify'

/**
 * Renders a paragraph, turning the first mention of known concepts, figures
 * and terms into a quiet inline link. `suppress` carries the terms already
 * linked earlier in the same section; `onLinked` reports the new ones so the
 * caller can extend that set. Method deliberately understated: a dotted
 * underline, not a coloured banner.
 */
export default function CrossLinked({
  text,
  className = '',
  suppress,
}: {
  text: string
  className?: string
  suppress?: ReadonlySet<string>
}) {
  const segments = linkify(text, suppress)

  return (
    <p className={className}>
      {segments.map((seg, i) =>
        seg.href ? (
          <Link
            key={i}
            to={seg.href}
            title={seg.title}
            className="text-ink underline decoration-line decoration-dotted underline-offset-[0.28em] transition-colors hover:text-crimson hover:decoration-crimson"
          >
            {seg.text}
          </Link>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </p>
  )
}
