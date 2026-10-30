import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { glossary } from '../data/glossary'
import { lineMeta, getConcept } from '../data/concepts'
import { Label } from '../components/primitives'

const LINE_FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'psychoanalysis', label: '精神分析' },
  { key: 'crossing', label: '交汇' },
  { key: 'philosophy', label: '哲学' },
] as const

type LineKey = (typeof LINE_FILTERS)[number]['key']

export default function Glossary() {
  const [q, setQ] = useState('')
  const [line, setLine] = useState<LineKey>('all')

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return glossary
      .filter((t) => (line === 'all' ? true : t.line === line))
      .filter((t) => {
        if (!needle) return true
        return (
          t.term.toLowerCase().includes(needle) ||
          (t.latin ?? '').toLowerCase().includes(needle) ||
          t.plain.toLowerCase().includes(needle) ||
          t.why.toLowerCase().includes(needle)
        )
      })
      .sort((a, b) => a.term.localeCompare(b.term, 'zh-Hans-CN'))
  }, [q, line])

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <header className="grid gap-10 border-b border-line pb-12 pt-14 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div>
          <Label>Glossary · 术语表</Label>
          <h1 className="mt-5 font-display text-4xl leading-[1.12] tracking-tight text-ink md:text-5xl">
            词是入口，不是答案
          </h1>
          <p className="mt-6 max-w-[46ch] leading-relaxed text-mute [text-wrap:pretty]">
            同一个词，在精神分析与哲学里常常是两件事。「自我」在康德与在本我-自我-超我模型里不是一回事；「他者」在萨特与在拉康那里也不是。这份术语表按「一句话释义 + 为什么重要」来写，尽量不把词写成标签。
          </p>
        </div>
        <div className="self-end border-l border-line pl-6 md:pl-8">
          <p className="font-serif-en text-lg italic leading-relaxed text-mute">
            “The word is the murder of the thing.”
          </p>
          <p className="mt-2 font-mono text-xs tracking-wider text-mute-soft">LACAN, ON HEGEL</p>
        </div>
      </header>

      {/* search + filter */}
      <div className="sticky top-16 z-30 -mx-5 border-b border-line bg-paper/95 px-5 py-3 backdrop-blur-[2px] md:-mx-10 md:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-3 border-b border-line-soft pb-1 md:w-[22rem]">
            <span className="label-mono text-mute-soft">检索</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="输入术语、释义或拉丁文…"
              className="w-full bg-transparent py-1 text-sm text-ink placeholder:text-mute-soft focus:outline-none"
              aria-label="检索术语"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ('')}
                className="label-mono text-mute-soft hover:text-crimson"
              >
                清除
              </button>
            )}
          </label>

          <div className="flex flex-wrap items-center gap-1">
            {LINE_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setLine(f.key)}
                aria-pressed={line === f.key}
                className={`rounded-full border px-3 py-1 label-mono transition-colors duration-300 ${
                  line === f.key ? 'border-ink bg-ink text-paper' : 'border-transparent text-mute-soft hover:border-line hover:text-ink'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        当前显示 {shown.length} 个术语。
      </p>

      <section className="py-10">
        {shown.length === 0 ? (
          <div className="grid place-items-center border border-dashed border-line px-6 py-24 text-center">
            <p className="font-display text-xl text-ink">没有匹配的术语</p>
            <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-mute">
              换个更短的关键词试试，比如「驱力」「压抑」「他者」。也可能这个词还没被收进这份术语表。
            </p>
            <button
              type="button"
              onClick={() => {
                setQ('')
                setLine('all')
              }}
              className="mt-6 border border-ink px-5 py-2 text-sm text-ink transition-colors hover:bg-ink hover:text-paper active:translate-y-px"
            >
              清空条件
            </button>
          </div>
        ) : (
          <dl key={`${line}-${q}`} className="grid gap-px bg-line md:grid-cols-2">
            {shown.map((t, i) => (
              <div
                key={t.term}
                className="cascade flex flex-col gap-4 bg-paper p-6 md:p-7"
                style={{ '--index': i } as React.CSSProperties}
              >
                <dt className="flex flex-wrap items-baseline gap-3">
                  <span className="font-display text-2xl tracking-tight text-ink">{t.term}</span>
                  {t.latin && (
                    <span className="font-serif-en text-sm italic tracking-wide text-mute-soft">{t.latin}</span>
                  )}
                  <span className="label-mono ml-auto" style={{ color: lineMeta[t.line].ink }}>
                    {lineMeta[t.line].label}
                  </span>
                </dt>
                <dd className="flex flex-col gap-3">
                  <p className="leading-relaxed text-ink/90">{t.plain}</p>
                  <p className="border-l border-line pl-4 text-sm leading-relaxed text-mute">{t.why}</p>
                  {t.concepts.length > 0 && (
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="label-mono text-mute-soft">相关档案</span>
                      {t.concepts.map((id) => {
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
                    </p>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </div>
  )
}
