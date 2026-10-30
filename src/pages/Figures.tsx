import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { figures, eraLabel, type Figure, type Era } from '../data/figures'
import { lineMeta, getConcept } from '../data/concepts'
import { Label } from '../components/primitives'

const LINE_TABS = [
  { key: 'all', label: '全部' },
  { key: 'philosophy', label: '哲学' },
  { key: 'psychoanalysis', label: '精神分析' },
  { key: 'crossing', label: '交汇' },
] as const

const ERA_ORDER: Era[] = ['classical', 'interwar', 'structural', 'postwar', 'contemporary']

export default function Figures() {
  const [line, setLine] = useState<(typeof LINE_TABS)[number]['key']>('all')
  const [era, setEra] = useState<Era | 'all'>('all')
  const [open, setOpen] = useState<string | null>(null)

  const shown = useMemo(
    () =>
      figures
        .filter((f) => (line === 'all' ? true : f.line === line))
        .filter((f) => (era === 'all' ? true : f.era === era))
        .sort((a, b) => ERA_ORDER.indexOf(a.era) - ERA_ORDER.indexOf(b.era)),
    [line, era],
  )

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <header className="grid gap-10 border-b border-line pb-12 pt-14 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div>
          <Label>Figures · 人物</Label>
          <h1 className="mt-5 font-display text-4xl leading-[1.12] tracking-tight text-ink md:text-5xl">
            弗洛伊德之外
          </h1>
          <p className="mt-6 max-w-[46ch] leading-relaxed text-mute [text-wrap:pretty]">
            如果无意识只属于一个人，它就不值得写成档案。这 {figures.length} 位，有的与弗洛伊德争辩，有的接过了他手上的问题，有的根本不想承认自己与精神分析有关系——但他们都在回答同一个问题：那个不被说出的部分，究竟属于谁。
          </p>
        </div>
        <div className="self-end border-l border-line pl-6 md:pl-8">
          <p className="font-serif-en text-lg italic leading-relaxed text-mute">
            “We are all in debt to Freud, if only because we still argue with him.”
          </p>
          <p className="mt-2 font-mono text-xs tracking-wider text-mute-soft">EDITION NOTE</p>
        </div>
      </header>

      {/* filters */}
      <div className="sticky top-16 z-30 -mx-5 border-b border-line bg-paper/95 px-5 py-3 backdrop-blur-[2px] md:-mx-10 md:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            {LINE_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setLine(t.key)}
                aria-pressed={line === t.key}
                className={`flex items-baseline gap-2 px-3 py-1.5 text-sm transition-colors duration-300 ${
                  line === t.key ? 'text-ink' : 'text-mute hover:text-ink'
                }`}
              >
                {t.key !== 'all' && (
                  <span
                    className="inline-block h-[6px] w-[6px] rotate-45 self-center"
                    style={{
                      backgroundColor: lineMeta[t.key].color,
                      opacity: line === t.key ? 1 : 0.35,
                    }}
                    aria-hidden="true"
                  />
                )}
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setEra('all')}
              aria-pressed={era === 'all'}
              className={`rounded-full border px-3 py-1 label-mono transition-colors ${
                era === 'all' ? 'border-ink bg-ink text-paper' : 'border-transparent text-mute-soft hover:border-line hover:text-ink'
              }`}
            >
              全部年代
            </button>
            {ERA_ORDER.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEra(e)}
                aria-pressed={era === e}
                className={`rounded-full border px-3 py-1 label-mono transition-colors ${
                  era === e ? 'border-ink bg-ink text-paper' : 'border-transparent text-mute-soft hover:border-line hover:text-ink'
                }`}
              >
                {eraLabel[e]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        当前显示 {shown.length} 位人物。
      </p>

      {/* portrait list */}
      <section className="py-8">
        {shown.length === 0 ? (
          <div className="grid place-items-center border border-dashed border-line px-6 py-20 text-center">
            <p className="font-display text-xl text-ink">这个位置暂时没有人</p>
            <p className="mt-2 text-sm text-mute">换一条线或一个年代看看。</p>
          </div>
        ) : (
          <ul key={`${line}-${era}`} className="grid gap-px bg-line md:grid-cols-2">
            {shown.map((f, i) => (
              <li key={f.id} className="bg-paper">
                <article
                  className="cascade group flex h-full flex-col p-6 md:p-8"
                  style={{ '--index': i } as React.CSSProperties}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className="label-mono"
                        style={{ color: lineMeta[f.line].ink }}
                      >
                        {lineMeta[f.line].label} · {eraLabel[f.era]}
                      </span>
                      <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-ink">
                        {f.name}
                      </h2>
                      <p className="mt-1 font-serif-en text-sm italic tracking-wide text-mute-soft">
                        {f.nameLatin}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs tracking-wider text-mute-soft">
                      {f.years}
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-mute [text-wrap:pretty]">
                    <span className="text-ink">{f.tagline}。</span>
                    {f.why}
                  </p>

                  <button
                    type="button"
                    onClick={() => setOpen(open === f.id ? null : f.id)}
                    aria-expanded={open === f.id}
                    aria-controls={`figure-${f.id}`}
                    className="mt-6 flex items-center justify-between border-t border-line-soft pt-3 text-left text-sm text-mute transition-colors hover:text-crimson"
                  >
                    <span>{open === f.id ? '收起' : '核心论点 · 作品 · 对话方'}</span>
                    <span
                      className="font-mono text-xs transition-transform duration-300"
                      style={{ transform: open === f.id ? 'rotate(45deg)' : 'none' }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  <div
                    id={`figure-${f.id}`}
                    hidden={open !== f.id}
                    className="mt-4 flex flex-col gap-5"
                  >
                    <blockquote className="border-l-2 border-crimson pl-4">
                      <p className="text-[0.95rem] leading-[1.8] text-ink/90">{f.keyIdea}</p>
                    </blockquote>

                    {f.works.length > 0 && (
                      <div>
                        <span className="label-mono text-mute-soft">代表作品</span>
                        <ul className="mt-2 flex flex-col gap-1">
                          {f.works.map((w) => (
                            <li key={w.title} className="text-sm text-mute">
                              《{w.title}》{' '}
                              <span className="font-mono text-xs text-mute-soft">{w.year}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {f.dialogue.length > 0 && (
                      <div>
                        <span className="label-mono text-mute-soft">对话与争执</span>
                        <ul className="mt-2 flex flex-col gap-2">
                          {f.dialogue.map((d) => (
                            <li key={d.name} className="text-sm leading-relaxed text-mute">
                              <span className="text-ink">{d.name}</span>——{d.note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {f.concepts.length > 0 && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="label-mono text-mute-soft">相关档案</span>
                        {f.concepts.map((id) => {
                          const c = getConcept(id)
                          if (!c) return null
                          return (
                            <Link
                              key={id}
                              to={`/archive/${id}`}
                              className="border-b border-line text-sm text-ink transition-colors hover:border-crimson hover:text-crimson"
                            >
                              {c.term}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="border-t border-line py-10">
        <p className="max-w-[64ch] text-sm leading-relaxed text-mute">
          这份名单是有立场的：它偏重那些把「无意识」从私人问题变成公共问题的人。如果你觉得漏了谁，那大概是漏了——
          <Link to="/archive" className="border-b border-line text-ink transition-colors hover:border-crimson hover:text-crimson">
            回档案看看
          </Link>
          ，或者在
          <Link to="/essays" className="border-b border-line text-ink transition-colors hover:border-crimson hover:text-crimson">
            文章
          </Link>
          里找找线索。
        </p>
      </div>
    </div>
  )
}

export type { Figure }
