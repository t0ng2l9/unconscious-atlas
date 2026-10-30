import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { concepts, lineMeta, eraMeta, type Line, type Era } from '../data/concepts'
import { ConceptCard } from '../components/ConceptCard'
import { Label, Rule } from '../components/primitives'

const lines: { key: Line | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'philosophy', label: '哲学线' },
  { key: 'psychoanalysis', label: '精神分析线' },
  { key: 'crossing', label: '交汇' },
]

const eras: { key: Era | 'all'; label: string }[] = [
  { key: 'all', label: '全部年代' },
  ...(Object.keys(eraMeta) as Era[]).map((k) => ({ key: k, label: eraMeta[k].label })),
]

// an editorial note for the empty cells of a filtered grid: the names that
// deliberately did not make it into this edition
const FILTER_NOTE: Partial<Record<Line, string>> = {
  psychoanalysis:
    '这一条线上还留着阿德勒的自卑情结、马尔库塞的爱欲与压抑、阿尔都塞的「无主体的主体性」，以及拉康之后的拉普朗什与格林。',
  philosophy:
    '尼采无法被塞进任何一个概念格：他更像烧掉整张格子的火源。梅洛-庞蒂的身体、德勒兹的欲望机器同样空着位置。',
}

export default function Archive() {
  const [params, setParams] = useSearchParams()
  const line = (params.get('line') as Line | null) ?? 'all'
  const era = (params.get('era') as Era | null) ?? 'all'
  const sort = (params.get('sort') as 'index' | 'era' | null) ?? 'index'

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params)
    if (v === 'all' || (k === 'sort' && v === 'index')) next.delete(k)
    else next.set(k, v)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const list = concepts.filter(
      (c) => (line === 'all' || c.line === line) && (era === 'all' || c.era === era),
    )
    if (sort === 'era') {
      const order = Object.keys(eraMeta) as Era[]
      return [...list].sort((a, b) => order.indexOf(a.era) - order.indexOf(b.era))
    }
    return list
  }, [line, era, sort])

  // keep the last row of the grid from trailing off into an empty gap
  const fillersNeeded =
    filtered.length === 0 ? 0 : (3 - (filtered.length % 3)) % 3

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: concepts.length }
    for (const c of concepts) m[c.line] = (m[c.line] ?? 0) + 1
    return m
  }, [])

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <header className="grid gap-10 border-b border-line pb-12 pt-14 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div>
          <Label>Index of Concepts · 概念档案</Label>
          <h1 className="mt-5 font-display text-4xl leading-[1.12] tracking-tight text-ink md:text-5xl">
            问题先于答案
          </h1>
          <p className="mt-6 max-w-[46ch] text-[0.98rem] leading-relaxed text-mute [text-wrap:pretty]">
            十二个概念，不是十二个定义，而是十二个被反复重新回答的问题。每条档案记录的是一个转折：某个人如何把前一个时代的话翻过来，以及这次翻转留下了什么。
          </p>
        </div>
        <div className="grid grid-cols-3 gap-px self-end border border-line bg-line">
          {(Object.keys(lineMeta) as Line[]).map((k) => (
            <div key={k} className="bg-paper p-4">
              <span className="font-mono text-2xl tracking-tight text-ink">
                {String(counts[k] ?? 0).padStart(2, '0')}
              </span>
              <p className="mt-1 label-mono" style={{ color: lineMeta[k].ink }}>
                {lineMeta[k].label}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* filters */}
      <div className="sticky top-16 z-30 -mx-5 border-b border-line bg-paper/95 px-5 backdrop-blur-[2px] md:-mx-10 md:px-10">
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            {lines.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => setParam('line', l.key)}
                aria-pressed={line === l.key}
                className={`group flex items-baseline gap-2 px-3 py-1.5 text-sm transition-colors duration-300 ${
                  line === l.key ? 'text-ink' : 'text-mute hover:text-ink'
                }`}
              >
                {l.key !== 'all' && (
                  <span
                    className="inline-block h-[6px] w-[6px] rotate-45 self-center transition-opacity duration-300"
                    style={{
                      backgroundColor: lineMeta[l.key as Line].color,
                      opacity: line === l.key ? 1 : 0.35,
                    }}
                    aria-hidden="true"
                  />
                )}
                <span>{l.label}</span>
                <span className="font-mono text-[0.65rem] text-mute-soft">
                  {String(counts[l.key] ?? 0).padStart(2, '0')}
                </span>
                {line === l.key && <span className="text-crimson">·</span>}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {eras.map((e) => (
              <button
                key={e.key}
                type="button"
                onClick={() => setParam('era', e.key)}
                aria-pressed={era === e.key}
                className={`rounded-full border px-3 py-1 label-mono transition-colors duration-300 ${
                  era === e.key
                    ? 'border-ink bg-ink text-paper'
                    : 'border-transparent text-mute-soft hover:border-line hover:text-ink'
                }`}
              >
                {e.label}
              </button>
            ))}

            <span className="mx-2 hidden h-4 w-px bg-line md:block" aria-hidden="true" />

            <div
              className="flex items-center rounded-full border border-line p-px"
              role="group"
              aria-label="排序方式"
            >
              {(
                [
                  ['index', '索引序'],
                  ['era', '编年序'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setParam('sort', k)}
                  aria-pressed={sort === k}
                  className={`rounded-full px-3 py-1 label-mono transition-colors duration-300 ${
                    sort === k ? 'bg-ink text-paper' : 'text-mute-soft hover:text-ink'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        当前显示 {filtered.length} 条档案，按{sort === 'era' ? '编年序' : '索引序'}排列。
      </p>

      <section className="py-10">
        {filtered.length === 0 ? (
          <div className="grid place-items-center border border-dashed border-line px-6 py-24 text-center">
            <p className="font-display text-xl text-ink">这一格档案暂时是空的</p>
            <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-mute">
              没有概念同时满足这两个条件。放宽其中一栏，或者回到全部年代重新开始。
            </p>
            <button
              type="button"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
              className="mt-6 border border-ink px-5 py-2 text-sm text-ink transition-colors hover:bg-ink hover:text-paper active:translate-y-px"
            >
              清除筛选
            </button>
          </div>
        ) : (
          <div
            key={`${line}-${era}-${sort}`}
            className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 md:grid-cols-3"
          >
            {filtered.map((c, i) => (
              <div key={c.id} className="bg-paper">
                <div className="relative h-full p-px">
                  <ConceptCard concept={c} i={i} />
                </div>
              </div>
            ))}

            {fillersNeeded > 0 && (
              <div
                className={`hidden bg-paper md:block ${fillersNeeded === 2 ? 'md:col-span-2' : ''}`}
              >
                <div className="flex h-full flex-col justify-between gap-8 p-6">
                  <div className="flex items-baseline justify-between">
                    <span className="label-mono text-mute-soft">Edition note</span>
                    <span className="font-mono text-xs text-mute-soft">
                      {String(fillersNeeded).padStart(2, '0')} empty
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-lg leading-snug text-ink">
                      未被收进这份档案的名字
                    </p>
                    <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-mute">
                      {FILTER_NOTE[line as Line] ??
                        '十二个概念只够搭出骨架。阿德勒的自卑情结、马尔库塞的爱欲、齐泽克的意识形态，都在门外候着。'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <Rule className="my-4" />
      <p className="py-8 text-sm leading-relaxed text-mute [text-wrap:pretty]">
        档案以「问题」而非「立场」为单位。同一个词在两条线上承担不同任务，
        点击任一概念可查看它在两条线上的前身、后继与反对者。
      </p>
    </div>
  )
}
