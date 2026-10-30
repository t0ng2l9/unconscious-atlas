import { useState } from 'react'
import { Link } from 'react-router-dom'
import { events, shelf, type TimelineLine } from '../data/timeline'
import { lineMeta, getConcept } from '../data/concepts'
import { Label } from '../components/primitives'

const FILTERS: { key: TimelineLine | 'all'; label: string; color?: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'philosophy', label: '哲学线', color: 'var(--color-teal)' },
  { key: 'psychoanalysis', label: '精神分析线', color: 'var(--color-crimson)' },
  { key: 'both', label: '交汇', color: 'var(--color-ochre)' },
]

const lineColor: Record<TimelineLine, string> = {
  philosophy: 'var(--color-teal)',
  psychoanalysis: 'var(--color-crimson)',
  both: 'var(--color-ochre)',
}

export default function Timeline() {
  const [filter, setFilter] = useState<TimelineLine | 'all'>('all')
  const shown = events.filter((e) => filter === 'all' || e.line === filter)

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <header className="grid gap-10 border-b border-line pb-12 pt-14 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div>
          <Label>Chronology · 编年</Label>
          <h1 className="mt-5 font-display text-4xl leading-[1.12] tracking-tight text-ink md:text-5xl">
            一条缝合线的时间
          </h1>
          <p className="mt-6 max-w-[46ch] leading-relaxed text-mute [text-wrap:pretty]">
            这不是一部精神分析史，也不是一部哲学史。这里只收那些改变了「无意识可以被说成什么」的时刻。它们大多不是理论内部的推演，而是被某个具体的下午、某场战争、某次决裂推动出来的。
          </p>
        </div>
        <div className="self-end border-l border-line pl-6 md:pl-8">
          <p className="font-serif-en text-lg italic leading-relaxed text-mute">
            “History has no unconscious — but it has symptoms.”
          </p>
          <p className="mt-2 font-mono text-xs tracking-wider text-mute-soft">EDITION NOTE, 2026</p>
        </div>
      </header>

      {/* filters */}
      <div className="sticky top-16 z-30 -mx-5 flex flex-wrap items-center gap-1 border-b border-line bg-paper/95 px-5 py-3 backdrop-blur-[2px] md:-mx-10 md:px-10">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`flex items-baseline gap-2 px-3 py-1.5 text-sm transition-colors duration-300 ${
              filter === f.key ? 'text-ink' : 'text-mute hover:text-ink'
            }`}
          >
            {f.color && (
              <span
                className="inline-block h-[6px] w-[6px] rotate-45 self-center"
                style={{ backgroundColor: f.color, opacity: filter === f.key ? 1 : 0.35 }}
                aria-hidden="true"
              />
            )}
            {f.label}
            <span className="font-mono text-[0.65rem] text-mute-soft">
              {String(f.key === 'all' ? events.length : events.filter((e) => e.line === f.key).length).padStart(2, '0')}
            </span>
          </button>
        ))}
      </div>

      {/* chronology */}
      <ol key={filter} className="relative border-l border-line md:ml-[7rem]">
        {shown.map((e, i) => {
          const c = e.concept ? getConcept(e.concept) : undefined
          return (
            <li key={`${e.year}-${e.title}`} className="cascade relative pl-8 md:pl-12" style={{ '--index': i } as React.CSSProperties}>
              <span
                className="absolute -left-[5px] top-[2.1rem] h-[9px] w-[9px] rotate-45"
                style={{ backgroundColor: lineColor[e.line] }}
                aria-hidden="true"
              />
              <div className="border-b border-line-soft py-9 md:grid md:grid-cols-[7rem_1fr] md:gap-10">
                <div className="flex items-baseline gap-3 md:block">
                  <span className="font-mono text-lg tracking-wider text-ink">{e.label}</span>
                  <span className="ml-3 label-mono md:ml-0 md:block" style={{ color: lineColor[e.line] }}>
                    {e.line === 'both' ? '交汇' : lineMeta[e.line].label}
                  </span>
                </div>
                <div>
                  <h2 className="mt-2 font-display text-2xl leading-snug tracking-tight text-ink md:mt-0">
                    {e.title}
                  </h2>
                  <p className="mt-3 max-w-[60ch] leading-relaxed text-mute">{e.detail}</p>
                  {c && (
                    <Link
                      to={`/archive/${c.id}`}
                      className="mt-4 inline-flex items-center gap-2 border-b border-line pb-0.5 text-sm text-ink transition-colors hover:border-crimson hover:text-crimson"
                    >
                      查看档案：{c.term} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      {/* reading shelf */}
      <section className="mt-20 border-t border-ink pt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl tracking-tight text-ink">必读书目</h2>
          <span className="label-mono text-mute-soft">{String(shelf.length).padStart(2, '0')} volumes</span>
        </div>
        <ul className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {shelf.map((b) => (
            <li key={b.title} className="flex flex-col justify-between gap-6 bg-paper p-6">
              <div>
                <span className="label-mono" style={{ color: lineColor[b.line] }}>
                  {b.line === 'both' ? '交汇' : lineMeta[b.line].label}
                </span>
                <p className="mt-3 font-display text-lg leading-snug text-ink">{b.title}</p>
                <p className="mt-1 text-sm text-mute">
                  {b.author} <span className="font-mono text-xs text-mute-soft">· {b.year}</span>
                </p>
              </div>
              <p className="text-sm leading-relaxed text-mute-soft">{b.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
