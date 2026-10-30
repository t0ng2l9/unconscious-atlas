import { Link } from 'react-router-dom'
import { essays } from '../data/essays'
import { Label } from '../components/primitives'

export default function Essays() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <header className="grid gap-10 border-b border-line pb-12 pt-14 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div>
          <Label>Essays · 长文</Label>
          <h1 className="mt-5 font-display text-4xl leading-[1.12] tracking-tight text-ink md:text-5xl">
            七篇文章
          </h1>
          <p className="mt-6 max-w-[46ch] leading-relaxed text-mute [text-wrap:pretty]">
            档案让知识变得稠密，文章让观点变得可被反驳。前三篇沿时间轴展开，后四篇转向理论的裂缝、日常经验、战争，以及精神分析在中国的处境。
          </p>
        </div>
        <div className="self-end border-l border-line pl-6 md:pl-8">
          <p className="font-serif-en text-lg italic leading-relaxed text-mute">
            “The unconscious is the discourse of the Other.”
          </p>
          <p className="mt-2 font-mono text-xs tracking-wider text-mute-soft">
            JACQUES LACAN, 1964
          </p>
        </div>
      </header>

      <ol className="divide-y divide-line border-b border-line">
        {essays.map((e) => (
          <li key={e.slug}>
            <Link
              to={`/essays/${e.slug}`}
              className="group grid gap-6 py-12 transition-colors md:grid-cols-[4rem_1fr_12rem] md:items-start md:gap-10"
            >
              <span className="font-serif-en text-3xl italic leading-none text-mute-soft transition-colors group-hover:text-crimson">
                {e.index}
              </span>
              <div>
                <span className="label-mono text-mute-soft">{e.kicker}</span>
                <h2 className="mt-2 font-display text-2xl leading-snug tracking-tight text-ink transition-colors group-hover:text-crimson md:text-3xl">
                  {e.title}
                </h2>
                <p className="mt-3 max-w-[58ch] leading-relaxed text-mute">{e.subtitle}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  阅读 <span aria-hidden="true">→</span>
                </span>
              </div>
              <div className="flex flex-col gap-1 md:items-end md:text-right">
                <span className="label-mono text-mute-soft">{e.period}</span>
                <span className="font-mono text-xs text-mute">{e.readTime}</span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
