import { Link, useParams } from 'react-router-dom'
import { getEssay, essays } from '../data/essays'
import { getConcept, lineMeta } from '../data/concepts'
import { Label } from '../components/primitives'

export default function EssayPage() {
  const { slug } = useParams()
  const essay = slug ? getEssay(slug) : undefined

  if (!essay) {
    return (
      <div className="mx-auto grid min-h-[60dvh] max-w-[1400px] place-items-center px-5">
        <div className="text-center">
          <p className="label-mono text-mute-soft">404</p>
          <p className="mt-3 font-display text-2xl text-ink">这篇文章不存在</p>
          <Link
            to="/essays"
            className="mt-6 inline-block border border-ink px-5 py-2 text-sm transition-colors hover:bg-ink hover:text-paper"
          >
            返回文章列表
          </Link>
        </div>
      </div>
    )
  }

  const others = essays.filter((e) => e.slug !== essay.slug)

  return (
    <article className="mx-auto max-w-[1400px] px-5 md:px-10">
      <nav className="flex items-center gap-2 pt-12 label-mono text-mute-soft">
        <Link to="/essays" className="transition-colors hover:text-crimson">
          文章
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-mute">{essay.index}</span>
      </nav>

      <header className="grid gap-10 border-b border-line pb-14 pt-8 md:grid-cols-[1.3fr_0.7fr]">
        <div className="min-w-0">
          <span className="label-mono text-crimson">{essay.kicker}</span>
          <h1 className="mt-5 font-display text-4xl leading-[1.16] tracking-tight text-ink [text-wrap:balance] md:text-[3rem] md:leading-[1.12]">
            {essay.title}
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-mute">{essay.subtitle}</p>
        </div>
        <dl className="self-end border-t border-line-soft md:border-t-0">
          <div className="flex items-baseline justify-between border-b border-line-soft py-3">
            <span className="label-mono text-mute-soft">年代</span>
            <span className="font-mono text-sm tracking-wider text-ink">{essay.period}</span>
          </div>
          <div className="flex items-baseline justify-between border-b border-line-soft py-3">
            <span className="label-mono text-mute-soft">篇幅</span>
            <span className="font-mono text-sm tracking-wider text-ink">{essay.readTime}</span>
          </div>
          <div className="flex items-baseline justify-between py-3">
            <span className="label-mono text-mute-soft">关联档案</span>
            <span className="font-mono text-sm tracking-wider text-ink">
              {String(essay.related.length).padStart(2, '0')}
            </span>
          </div>
        </dl>
      </header>

      <div className="grid gap-12 py-14 md:grid-cols-[8.5rem_1fr] md:gap-16">
        <aside className="hidden md:block">
          <div className="sticky top-28">
            <Label>目录</Label>
            <ol className="mt-4 flex flex-col gap-3">
              {essay.sections.map((s, i) => (
                <li key={i} className="grid grid-cols-[1.6rem_1fr] gap-1 text-sm leading-snug text-mute">
                  <span className="font-mono text-xs leading-5 text-mute-soft">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-pretty">{s.heading ?? '引言'}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="max-w-[64ch]">
          <p className="border-l-2 border-crimson pl-5 text-lg leading-[1.85] text-ink/90">
            {essay.lead}
          </p>

          {essay.sections.map((s, i) => (
            <section key={i} className="mt-14">
              {s.heading && (
                <h2 className="font-display text-2xl leading-snug tracking-tight text-ink md:text-[1.7rem]">
                  <span className="mr-3 font-mono text-sm align-middle text-mute-soft">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.heading}
                </h2>
              )}
              {s.paragraphs.map((p, j) => (
                <p key={j} className="mt-5 leading-[1.95] text-ink/90">
                  {p}
                </p>
              ))}
              {s.pull && (
                <blockquote className="my-10 grid grid-cols-[auto_1fr] gap-5 border-y border-line py-6">
                  <span className="font-serif-en text-4xl leading-none italic text-crimson" aria-hidden="true">
                    “
                  </span>
                  <p className="font-display text-xl leading-[1.6] tracking-tight text-ink md:text-[1.4rem]">
                    {s.pull}
                  </p>
                </blockquote>
              )}
            </section>
          ))}

          <section className="mt-16 border-t border-ink pt-8">
            <Label>结语</Label>
            <p className="mt-4 font-display text-xl leading-[1.7] tracking-tight text-ink">
              {essay.closing}
            </p>
          </section>

          <section className="mt-16">
            <Label>关联档案</Label>
            <ul className="mt-4 grid grid-cols-1 gap-px bg-line sm:grid-cols-2">
              {essay.related.map((id) => {
                const c = getConcept(id)
                if (!c) return null
                return (
                  <li key={id} className="flex bg-paper">
                    <Link
                      to={`/archive/${c.id}`}
                      className="group flex h-full flex-col justify-between gap-3 p-5 transition-colors hover:bg-[color-mix(in_srgb,var(--color-paper)_58%,white)]"
                    >
                      <span className="flex items-baseline justify-between">
                        <span className="font-display text-lg text-ink transition-colors group-hover:text-crimson">
                          {c.term}
                        </span>
                        <span className="font-mono text-xs text-mute-soft">{c.index}</span>
                      </span>
                      <span className="label-mono" style={{ color: lineMeta[c.line].ink }}>
                        {lineMeta[c.line].label} · {c.thinker}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>

          <nav className="mt-16 flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-8">
            <Link to="/essays" className="text-sm text-mute transition-colors hover:text-crimson">
              ← 全部文章
            </Link>
            {others[0] && (
              <Link
                to={`/essays/${others[0].slug}`}
                className="group text-right text-sm text-mute transition-colors hover:text-crimson"
              >
                下一篇
                <span className="mt-1 block font-display text-lg text-ink transition-colors group-hover:text-crimson">
                  {others[0].title} →
                </span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </article>
  )
}
