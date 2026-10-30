import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { concepts, lineMeta, type Line } from '../data/concepts'
import { essays } from '../data/essays'
import { events } from '../data/timeline'
import { glossary } from '../data/glossary'
import { figures } from '../data/figures'
import { ConceptCard } from '../components/ConceptCard'
import { Label } from '../components/primitives'
import TraceCanvas, { type TracePoint } from '../components/TraceCanvas'

/* ------------------------------------------------------------------ */
/* data for the opening trace                                          */
/* ------------------------------------------------------------------ */
type Pos = { x: number; y: number }

const positions: Record<string, Pos & { color: 'teal' | 'crimson' | 'ochre'; active: boolean; label: string }> = {
  cogito: { x: 0.02, y: 0.56, color: 'teal', active: false, label: '我思 · 1641' },
  will: { x: 0.17, y: 0.3, color: 'teal', active: false, label: '意志 · 1818' },
  unconscious: { x: 0.35, y: 0.82, color: 'crimson', active: true, label: '无意识 · 1900' },
  collective: { x: 0.5, y: 0.16, color: 'ochre', active: false, label: '集体无意识 · 1921' },
  existence: { x: 0.58, y: 0.42, color: 'teal', active: false, label: '存在 · 1927' },
  'the-other': { x: 0.66, y: 0.62, color: 'teal', active: false, label: '他者 · 1943' },
  other: { x: 0.72, y: 0.26, color: 'ochre', active: false, label: '大他者 · 1964' },
  'death-drive': { x: 0.86, y: 0.6, color: 'crimson', active: false, label: '死亡驱力 · 1920' },
  power: { x: 0.97, y: 0.3, color: 'ochre', active: false, label: '权力/知识 · 1976' },
}

const tracePoints: TracePoint[] = Object.entries(positions).map(([id, p]) => {
  const c = concepts.find((k) => k.id === id)
  return {
    id,
    x: p.x,
    y: p.y,
    color:
      p.color === 'teal' ? 'var(--color-teal)' : p.color === 'crimson' ? 'var(--color-crimson)' : 'var(--color-ochre)',
    active: p.active,
    label: p.label,
    term: c ? `${c.term} · ${c.thinker}` : undefined,
    definition: c?.definition,
    index: c?.index,
  }
})

/* ------------------------------------------------------------------ */
/* oscillating headline word                                           */
/* ------------------------------------------------------------------ */
const words = ['我思', '意志', '驱力', '无意识']

function OscillatingWord() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((v) => (v + 1) % words.length), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="relative inline-grid overflow-hidden align-baseline">
      {words.map((w, idx) => (
        <span
          key={w}
          className="col-start-1 row-start-1 transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: idx === i ? 1 : 0,
            transform: idx === i ? 'translateY(0)' : idx < i ? 'translateY(-70%)' : 'translateY(70%)',
            color: 'var(--color-crimson)',
          }}
          aria-hidden={idx !== i}
        >
          {w}
        </span>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */
export default function Home() {
  const [params] = useSearchParams()
  const featuredLine = (params.get('line') as Line | null) ?? null

  const featured = useMemo(() => {
    const base = ['unconscious', 'drive', 'dream']
    return base.map((id) => concepts.find((c) => c.id === id)!).filter(Boolean)
  }, [])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      {/* ================= HERO ================= */}
      <section className="grid min-h-[86dvh] gap-12 pb-10 pt-10 md:grid-cols-[1.3fr_0.7fr] md:grid-rows-[1fr_auto_1fr] md:gap-10 md:pt-0">
        <div className="relative md:row-start-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-crimson" aria-hidden="true" />
            <Label className="[text-wrap:balance]">Unbewusstes Atlas · 一部关于无意识的档案</Label>
          </div>

          <h1 className="mt-8 font-display text-[2.2rem] leading-[1.22] tracking-tight text-ink [text-wrap:balance] md:text-[3.1rem] md:leading-[1.2] lg:text-[3.4rem]">
            弗洛伊德不是哲学的对立面，而是哲学终于开始听自己说话。
          </h1>

          <p className="mt-8 max-w-[50ch] text-[0.98rem] leading-[1.85] text-mute">
            在「<OscillatingWord />」被点名之前，近代哲学早已把人的内部安排成一间明亮的客厅。
            这份档案追踪的是那扇没有写门牌的房门：它何时被锁上，何时被听见，以及被听见之后，
            整个主体与历史的关系如何被重新摆置。
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/archive"
              className="group inline-flex items-center gap-3 bg-ink px-6 py-3 text-sm text-paper transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
            >
              打开档案
              <span className="label-mono text-paper/60 transition-colors group-hover:text-paper">
                12 个概念
              </span>
            </Link>
            <Link
              to="/essays"
              className="inline-flex items-center gap-3 border border-line px-6 py-3 text-sm text-ink transition-colors duration-300 hover:border-ink active:translate-y-px"
            >
              阅读三篇长文
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-line-soft pt-5">
            {[
              ['起点', '笛卡尔 · 1641'],
              ['分岔', '叔本华 · 1818'],
              ['汇合', '拉康 · 1964'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline gap-2">
                <span className="label-mono text-mute-soft">{k}</span>
                <span className="font-mono text-xs tracking-wider text-mute">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* right rail: a specimen card, deliberately not a photo */}
        <aside className="relative md:row-start-2 md:mt-16 md:justify-self-end md:self-center">
          <div className="index-card w-full max-w-[340px] p-6 md:p-8">
            <div className="flex items-start justify-between">
              <Label>Specimen · 主轴</Label>
              <span className="font-mono text-[0.65rem] tracking-widest text-mute-soft">03 / 12</span>
            </div>
            <p className="mt-8 font-display text-[3.2rem] leading-none tracking-tight text-ink">
              无意识
            </p>
            <p className="mt-2 font-serif-en text-sm italic tracking-wider text-mute-soft">
              Das Unbewusste
            </p>
            <p className="mt-6 border-t border-line-soft pt-4 text-sm leading-relaxed text-mute">
              一个被系统化压抑、却持续产生影响的心理区域：它的内容被阻止进入意识，却不因此停止运作。
            </p>
            <Link
              to="/archive/unconscious"
              className="mt-6 inline-flex items-center gap-2 text-sm text-crimson transition-opacity hover:opacity-70"
            >
              查看完整条目 <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-3 text-mute-soft">
            <span className="label-mono">Scroll</span>
            <span className="h-px w-16 bg-line" aria-hidden="true" />
          </div>
        </aside>
      </section>

      {/* ================= TRACE ================= */}
      <section className="border-t border-line pt-14">
        <div className="grid gap-6 md:grid-cols-[7rem_1fr]">
          <Label className="pt-2">双线</Label>
          <div className="max-w-[62ch]">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-ink [text-wrap:balance] md:text-4xl">
              一条线从「我思」出发，另一条线从「被压抑的东西」出发。
            </h2>
            <p className="mt-5 leading-relaxed text-mute [text-wrap:pretty]">
              它们在叔本华处擦肩，在荣格处分裂，在拉康与福柯处重新对峙。
              下图不是时间线，而是一张「谁在回应谁」的地形图。
            </p>
          </div>
        </div>

        <div className="mt-6 border border-line bg-[color-mix(in_srgb,var(--color-paper)_60%,white)] px-2 py-4 md:px-6">
          <TraceCanvas points={tracePoints} />
        </div>

        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
          <p className="label-mono text-mute-soft">Fig. 1 — 双线地形图 · 坐标并非年份比例</p>
          <button
            type="button"
            onClick={scrollTop}
            className="label-mono text-mute transition-colors hover:text-crimson"
          >
            ↑ 回到顶部
          </button>
        </div>
      </section>

      {/* ================= FEATURED CONCEPTS ================= */}
      <section className="mt-24 border-t border-line pt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-4">
            <Label>摘录</Label>
            <h2 className="font-display text-2xl tracking-tight text-ink">
              三条主轴：无意识 · 驱力 · 梦
            </h2>
          </div>
          <Link to="/archive" className="text-sm text-mute transition-colors hover:text-crimson">
            全部 12 条 →
          </Link>
        </div>

        <div className="mt-8 grid gap-px bg-line md:grid-cols-3">
          {featured.map((c, i) => (
            <div key={c.id} className="bg-paper">
              <div className="h-full p-px">
                <ConceptCard concept={c} i={i} />
              </div>
            </div>
          ))}
        </div>
        {featuredLine && (
          <p className="mt-4 text-sm text-mute">
            已按「{lineMeta[featuredLine].label}」引导，档案页将自动应用该筛选。
          </p>
        )}
      </section>

      {/* ================= ESSAYS ================= */}
      <section className="mt-24 border-t border-line pt-14">
        <div className="grid gap-10 md:grid-cols-[7rem_1fr]">
          <Label className="pt-2">文章</Label>
          <div>
            <h2 className="font-display text-3xl leading-tight tracking-tight text-ink [text-wrap:balance] md:text-4xl">
              七条线索，七篇文章。
            </h2>
            <p className="mt-5 max-w-[56ch] leading-relaxed text-mute [text-wrap:pretty]">
              档案负责密度，文章负责论证。前三篇沿时间轴展开：被赶出客厅的房间、无意识如何获得语法、「谁在说话」的路线之争；后四篇转向理论的裂缝与它在中国的处境。
            </p>
            <ul className="mt-10 divide-y divide-line-soft border-y border-line-soft">
              {essays.map((e) => (
                <li key={e.slug}>
                  <Link
                    to={`/essays/${e.slug}`}
                    className="group grid gap-2 py-5 transition-colors md:grid-cols-[3rem_1fr_auto] md:items-baseline md:gap-8"
                  >
                    <span className="font-serif-en text-2xl italic text-mute-soft transition-colors group-hover:text-crimson">
                      {e.index}
                    </span>
                    <span className="font-display text-xl leading-snug text-ink transition-colors group-hover:text-crimson md:text-2xl">
                      {e.title}
                    </span>
                    <span className="label-mono text-mute-soft">{e.period}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/essays"
              className="mt-6 inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-crimson"
            >
              全部 {essays.length} 篇 →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= NEW SECTIONS ================= */}
      <section className="mt-24 border-t border-line pt-14">
        <div className="grid gap-px bg-line md:grid-cols-3">
          <Link
            to="/figures"
            className="group flex flex-col justify-between gap-8 bg-paper p-6 transition-colors hover:bg-[color-mix(in_srgb,var(--color-paper)_55%,white)] md:p-8"
          >
            <div>
              <Label>Figures</Label>
              <h2 className="mt-3 font-display text-2xl tracking-tight text-ink transition-colors group-hover:text-crimson">
                人物：弗洛伊德之外
              </h2>
              <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-mute">
                尼采、卡夫卡、马尔库塞、阿尔都塞、德勒兹、巴特勒——{figures.length} 位人物，有的与弗洛伊德争辩，有的压根不承认自己和他有关系。
              </p>
            </div>
            <span className="font-mono text-xs tracking-wider text-mute-soft">
              {String(figures.length).padStart(2, '0')} figures →
            </span>
          </Link>
          <Link
            to="/timeline"
            className="group flex flex-col justify-between gap-8 bg-paper p-6 transition-colors hover:bg-[color-mix(in_srgb,var(--color-paper)_55%,white)] md:p-8"
          >
            <div>
              <Label>Chronology</Label>
              <h2 className="mt-3 font-display text-2xl tracking-tight text-ink transition-colors group-hover:text-crimson">
                编年：一条缝合线的时间
              </h2>
              <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-mute">
                从 1641 到 1981，收那些改变了「无意识可以被说成什么」的时刻——大多不是理论推演，而是战地、决裂和某个具体下午推动出来的。
              </p>
            </div>
            <span className="font-mono text-xs tracking-wider text-mute-soft">
              {String(events.length).padStart(2, '0')} events →
            </span>
          </Link>
          <Link
            to="/glossary"
            className="group flex flex-col justify-between gap-8 bg-paper p-6 transition-colors hover:bg-[color-mix(in_srgb,var(--color-paper)_55%,white)] md:p-8"
          >
            <div>
              <Label>Glossary</Label>
              <h2 className="mt-3 font-display text-2xl tracking-tight text-ink transition-colors group-hover:text-crimson">
                术语：词是入口，不是答案
              </h2>
              <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-mute">
                同一个词在两条线上常常是两件事。每个术语给一句话释义，再加一段「为什么重要」，并连回对应档案。
              </p>
            </div>
            <span className="font-mono text-xs tracking-wider text-mute-soft">
              {String(glossary.length).padStart(2, '0')} terms →
            </span>
          </Link>
        </div>
      </section>

      {/* ================= CLOSING THESIS ================= */}
      <section className="mt-24 border-t border-ink pt-14">
        <div className="grid gap-10 md:grid-cols-[7rem_1fr]">
          <Label className="pt-3">结语</Label>
          <blockquote className="font-display text-[1.9rem] leading-[1.38] tracking-tight text-ink [text-wrap:balance] md:text-[2.7rem] md:leading-[1.3]">
            精神分析不解释人。
            <br />
            它解释人<span className="text-crimson">如何在自己解释自己的时候出错</span>。
          </blockquote>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-px bg-line-soft border border-line-soft md:grid-cols-6">
          {[
            ['档案', String(concepts.length)],
            ['人物', String(figures.length)],
            ['术语', String(glossary.length)],
            ['文章', String(essays.length)],
            ['跨度', '1641—2026'],
            ['主轴', '无意识'],
          ].map(([k, v]) => (
            <div key={k} className="bg-paper p-5">
              <span className="label-mono text-mute-soft">{k}</span>
              <p className="mt-2 font-mono text-lg tracking-tight text-ink">{v}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
