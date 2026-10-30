import { Link, useParams } from 'react-router-dom'
import { getConcept, lineMeta, eraMeta } from '../data/concepts'
import { Label, Field } from '../components/primitives'
import { LineBadge } from '../components/ConceptCard'
import RelationGraph from '../components/RelationGraph'

export default function ConceptPage() {
  const { id } = useParams()
  const concept = id ? getConcept(id) : undefined

  if (!concept) {
    return (
      <div className="mx-auto grid min-h-[60dvh] max-w-[1400px] place-items-center px-5">
        <div className="text-center">
          <p className="label-mono text-mute-soft">404</p>
          <p className="mt-3 font-display text-2xl text-ink">这条档案不在索引里</p>
          <Link
            to="/archive"
            className="mt-6 inline-block border border-ink px-5 py-2 text-sm transition-colors hover:bg-ink hover:text-paper"
          >
            返回档案
          </Link>
        </div>
      </div>
    )
  }

  const meta = lineMeta[concept.line]

  const [eraRange, lifespan] = `${eraMeta[concept.era].range} · ${concept.period}`.split(' · ')

  return (
    <article className="mx-auto max-w-[1400px] px-5 md:px-10">
      <nav className="flex items-center gap-2 pt-12 label-mono text-mute-soft">
        <Link to="/archive" className="transition-colors hover:text-crimson">
          档案
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-mute">{concept.index}</span>
      </nav>

      <header className="grid gap-12 border-b border-line pb-14 pt-8 md:grid-cols-[1.15fr_1.35fr] md:gap-16">
        <div>
          <LineBadge line={concept.line} />
          <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            {concept.term}
          </h1>
          <p className="mt-3 font-serif-en text-lg italic tracking-wide text-mute-soft">
            {concept.termLatin}
          </p>
          <p className="mt-10 max-w-[34ch] text-lg leading-relaxed text-ink/90">
            {concept.definition}
          </p>
        </div>

        <dl className="self-end">
          <Field label="提出者" value={concept.thinker} />
          <Field
            label="年代"
            value={
              <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span>{eraRange}</span>
                <span className="font-mono text-xs text-mute-soft">{lifespan}</span>
              </span>
            }
          />
          <Field label="所属线" value={<span style={{ color: meta.ink }}>{meta.label}</span>} />
          <Field
            label="原始文献"
            value={
              <span className="flex flex-col gap-1">
                {concept.works.map((w) => (
                  <span key={w.title}>
                    《{w.title}》<span className="font-mono text-xs text-mute-soft"> {w.year}</span>
                  </span>
                ))}
              </span>
            }
          />
        </dl>
      </header>

      {/* the question */}
      <section className="grid gap-6 border-b border-line py-14 md:grid-cols-[7rem_1fr]">
        <Label className="pt-2">问题</Label>
        <p className="font-display text-2xl leading-[1.55] tracking-tight text-crimson md:text-[1.9rem] md:leading-[1.45]">
          {concept.question}
        </p>
      </section>

      {/* body prose */}
      <section className="grid gap-10 py-14 md:grid-cols-[7rem_minmax(0,1fr)_15rem] md:gap-12 lg:gap-16">
        <div className="pt-1">
          <Label>释文</Label>
        </div>
        <div className="max-w-[62ch] md:max-w-none">
          {concept.body.map((p, i) => (
            <p
              key={i}
              className={`leading-[1.9] text-ink/90 ${i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-crimson' : 'mt-6'}`}
            >
              {p}
            </p>
          ))}
        </div>

        {/* pull quote + keywords sit beside the prose on wide screens */}
        <aside className="md:sticky md:top-24 md:h-fit">
          {concept.quote && (
            <blockquote className="border-l-2 border-crimson pl-5">
              <p className="font-display text-lg leading-[1.7] tracking-tight text-ink">
                {concept.quote.text}
              </p>
              <footer className="mt-3 label-mono text-mute-soft">{concept.quote.source}</footer>
            </blockquote>
          )}
          {concept.keywords && concept.keywords.length > 0 && (
            <div className="mt-8">
              <Label>关键词</Label>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {concept.keywords.map((k) => (
                  <li
                    key={k}
                    className="border border-line-soft px-2.5 py-1 text-xs text-mute"
                  >
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      {/* further reading */}
      {concept.furtherReading && concept.furtherReading.length > 0 && (
        <section className="border-t border-line py-14 md:grid md:grid-cols-[7rem_1fr] md:gap-16">
          <Label className="pt-1">延伸阅读</Label>
          <ul className="mt-4 grid gap-px bg-line md:mt-0 md:grid-cols-2">
            {concept.furtherReading.map((b, idx) => {
              // an odd number of cards would leave a grey gap in the 2-col grid
              const isLastOdd =
                concept.furtherReading!.length % 2 === 1 &&
                idx === concept.furtherReading!.length - 1
              return (
                <li
                  key={b.title}
                  className={`flex flex-col gap-2 bg-paper p-6 ${isLastOdd ? 'md:col-span-2' : ''}`}
                >
                  <p className="font-display text-lg leading-snug text-ink">{b.title}</p>
                  <p className="label-mono text-mute-soft">{b.author}</p>
                  <p className="text-sm leading-relaxed text-mute">{b.note}</p>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* the lever */}
      <section className="grid gap-8 border-t border-line py-14 md:grid-cols-[7rem_1fr]">
        <Label className="pt-2">翻转</Label>
        <div className="grid gap-px bg-line md:grid-cols-2">
          <div className="bg-paper p-6 md:p-8">
            <span className="label-mono text-mute-soft">在此之前</span>
            <p className="mt-4 text-lg leading-relaxed text-mute line-through decoration-line">
              {concept.lever.before}
            </p>
          </div>
          <div className="bg-paper p-6 md:p-8">
            <span className="label-mono" style={{ color: meta.ink }}>
              在此之后
            </span>
            <p className="mt-4 text-lg leading-relaxed text-ink">{concept.lever.after}</p>
          </div>
        </div>
      </section>

      {/* relations */}
      <section className="border-t border-line py-14">
        <div className="flex items-baseline justify-between">
          <Label>双线位置 · 关联</Label>
          <span className="font-mono text-xs text-mute-soft">
            {String(concept.refs.length).padStart(2, '0')} links
          </span>
        </div>

        {/* interactive map: geometry encodes relation kind */}
        <div className="mt-6 border border-line bg-[color-mix(in_srgb,var(--color-paper)_62%,white)] px-3 py-5 md:px-8 md:py-7">
          <RelationGraph concept={concept} />
        </div>

        <ul className="mt-8 md:mt-10 divide-y divide-line-soft border-y border-line-soft">
          {concept.refs.map((ref) => {
            const target = getConcept(ref.id)
            if (!target) return null
            return (
              <li key={ref.id}>
                <Link
                  to={`/archive/${target.id}`}
                  className="group grid gap-3 py-5 transition-colors md:grid-cols-[9rem_1fr_auto] md:items-baseline md:gap-8"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="inline-block h-[6px] w-[6px] rotate-45"
                      style={{ backgroundColor: lineMeta[target.line].color }}
                      aria-hidden="true"
                    />
                    <span className="label-mono text-mute">{ref.relation}</span>
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="font-display text-xl text-ink transition-colors group-hover:text-crimson">
                      {target.term}
                      <span className="ml-3 label-mono align-middle text-mute-soft">
                        {target.index}
                      </span>
                    </span>
                    <span className="max-w-[58ch] text-sm leading-relaxed text-mute">{ref.note}</span>
                  </span>
                  <span
                    className="label-mono hidden text-mute-soft transition-colors group-hover:text-crimson md:block"
                    aria-hidden="true"
                  >
                    查阅 →
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-line py-10">
        <Link to="/archive" className="text-sm text-mute transition-colors hover:text-crimson">
          ← 返回档案
        </Link>
        <Link to="/essays" className="text-sm text-mute transition-colors hover:text-crimson">
          阅读相关文章 →
        </Link>
      </div>
    </article>
  )
}
