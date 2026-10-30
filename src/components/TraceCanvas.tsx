import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export interface TracePoint {
  id: string
  x: number
  y: number
  color: string
  active: boolean
  label: string
  /** dossier facts shown on hover */
  term?: string
  definition?: string
  index?: string
}

const W = 1000
const H = 520

const xOf = (x: number) => 70 + x * (W - 150)
const yOf = (y: number) => 80 + y * (H - 170)

function buildPath(pts: TracePoint[], curve: number) {
  if (pts.length === 0) return ''
  let d = `M ${xOf(pts[0].x).toFixed(1)} ${yOf(pts[0].y).toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const mx = ((xOf(a.x) + xOf(b.x)) / 2).toFixed(1)
    const my = ((yOf(a.y) + yOf(b.y)) / 2 + curve).toFixed(1)
    d += ` Q ${mx} ${my} ${xOf(b.x).toFixed(1)} ${yOf(b.y).toFixed(1)}`
  }
  return d
}

/**
 * Scroll-linked SVG trace. Draws the philosophical line (teal), the
 * psychoanalytic line (crimson) and the crossings (ochre) as the reader
 * moves down the page. Only stroke-dashoffset and opacity animate.
 * Nodes are focusable links into the dossier.
 */
export default function TraceCanvas({ points }: { points: TracePoint[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [hover, setHover] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let raf = 0
    let last = -1
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight || 800
        const start = vh * 0.92
        const end = vh * 0.2
        const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + Math.min(r.height, vh) * 0.6)))
        if (Math.abs(p - last) > 0.002) {
          last = p
          setProgress(p)
        }
      })
    }
    update()
    // poll instead of relying on events: works for nested scrollers, history
    // restoration and programmatic jumps alike
    const poll = window.setInterval(update, 120)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(poll)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      ro.disconnect()
    }
  }, [])

  const phil = points.filter((p) => p.color === 'var(--color-teal)')
  const psy = points.filter((p) => p.color === 'var(--color-crimson)')
  const crs = points.filter((p) => p.color === 'var(--color-ochre)')

  const dPhil = buildPath(phil, -26)
  const dPsy = buildPath(psy, 30)
  const dCrs = buildPath(crs, 8)
  const crsProgress = Math.max(0, (progress - 0.55) / 0.45)

  const hovered = points.find((p) => p.id === hover)

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full overflow-visible select-none"
        role="group"
        aria-label="无意识图谱：哲学线与精神分析线的分岔与交汇。点击节点查看档案。"
      >
        <g opacity="0.26" aria-hidden="true">
          {[0.15, 0.35, 0.55, 0.75].map((r) => (
            <line
              key={r}
              x1={40}
              x2={W - 60}
              y1={yOf(r)}
              y2={yOf(r)}
              stroke="var(--color-line)"
              strokeWidth="0.6"
              strokeDasharray="1 6"
            />
          ))}
        </g>

        {[
          { d: dPhil, color: 'var(--color-teal)', width: 1.4, dash: '1 1', offset: 1 - progress },
          { d: dPsy, color: 'var(--color-crimson)', width: 1.4, dash: '1 1', offset: 1 - progress },
          { d: dCrs, color: 'var(--color-ochre)', width: 1.15, dash: '.006 .009', offset: 1 - crsProgress },
        ].map((l, i) => (
          <path
            key={i}
            d={l.d}
            fill="none"
            stroke={l.color}
            strokeWidth={l.width}
            strokeLinecap="round"
            opacity="0.92"
            pathLength={1}
            strokeDasharray={l.dash}
            strokeDashoffset={Math.max(0, l.offset)}
          />
        ))}

        {points.map((p) => {
          const own = points.filter((q) => q.color === p.color)
          const at = own.findIndex((q) => q.id === p.id)
          const isHover = hover === p.id
          const anyHover = hover !== null
          const active = p.active
          const r = active ? 7.5 : 5
          const labelDy = at % 2 === 1 ? r + 21 : -r - 12
          const pinnedStart = p.x < 0.12
          const dim = anyHover && !isHover
          return (
            <g
              key={p.id}
              transform={`translate(${xOf(p.x).toFixed(1)},${yOf(p.y).toFixed(1)})`}
              tabIndex={0}
              role="link"
              aria-label={`${p.label}：打开档案`}
              className="cursor-pointer outline-none"
              style={{
                opacity: progress > 0.1 + at * 0.17 ? (dim ? 0.45 : 1) : 0,
                transition: 'opacity 600ms cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(p.id)}
              onBlur={() => setHover(null)}
              onClick={() => navigate(`/archive/${p.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(`/archive/${p.id}`)
                }
              }}
            >
              <circle r={26} fill="transparent" />
              {active && (
                <circle r={r + 9} fill="none" stroke={p.color} strokeWidth="0.6" opacity={0.32}>
                  <animate
                    attributeName="r"
                    values={`${r + 5};${r + 17};${r + 5}`}
                    dur="5.5s"
                    repeatCount="indefinite"
                  />
                  <animate attributeName="opacity" values="0.4;0.05;0.4" dur="5.5s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                r={isHover ? r + 3 : r}
                fill={active ? p.color : isHover ? p.color : 'var(--color-paper)'}
                stroke={p.color}
                strokeWidth={isHover ? 1.8 : 1.3}
                style={{ transition: 'r 220ms cubic-bezier(0.16,1,0.3,1), fill 220ms' }}
              />
              <text
                x={0}
                y={pinnedStart ? r + 21 : labelDy}
                textAnchor={pinnedStart ? 'start' : 'middle'}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: active ? 14.5 : 12.5,
                  fill: isHover ? 'var(--color-ink)' : active ? 'var(--color-crimson)' : 'var(--color-mute)',
                  letterSpacing: '0.05em',
                  transition: 'fill 240ms',
                }}
              >
                {p.label}
              </text>
            </g>
          )
        })}

        <g transform={`translate(70, ${H - 26})`} style={{ opacity: 0.8 }} aria-hidden="true">
          {[
            { c: 'var(--color-teal)', t: '哲学线', x: 0 },
            { c: 'var(--color-crimson)', t: '精神分析线', x: 110 },
            { c: 'var(--color-ochre)', t: '交汇', x: 250 },
          ].map((l) => (
            <g key={l.t} transform={`translate(${l.x},0)`}>
              <line x1={0} y1={-4} x2={26} y2={-4} stroke={l.c} strokeWidth="1.4" />
              <text
                x={34}
                y={0}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  fill: 'var(--color-mute)',
                }}
              >
                {l.t}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* hover readout — keeps the figure itself uncluttered */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-2 px-4 transition-opacity duration-300 md:px-8 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <Link
          to={hovered ? `/archive/${hovered.id}` : '/'}
          tabIndex={-1}
          className="pointer-events-auto ml-auto flex max-w-[34rem] items-baseline gap-4 border border-line bg-paper/95 px-4 py-2.5 shadow-[0_10px_30px_-20px_rgba(28,26,23,0.6)]"
        >
          <span className="shrink-0 font-display text-sm text-ink">
            {hovered?.term ?? hovered?.label}
          </span>
          <span className="line-clamp-2 flex-1 text-xs leading-relaxed text-mute">
            {hovered?.definition}
          </span>
          <span className="shrink-0 label-mono text-crimson">打开 →</span>
        </Link>
      </div>
    </div>
  )
}
