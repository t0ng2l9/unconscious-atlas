import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getConcept, lineMeta, type Concept, type ConceptRef } from '../data/concepts'

interface Neighbor {
  ref: ConceptRef
  target: Concept
}

const W = 820
const HEIGHT = 440
const CX = W / 2
const CY = HEIGHT / 2
// keep node centres far enough from the edges that labels never clip
const PAD_X = 128
const PAD_Y = 96

/**
 * Radial relation graph for one concept. Nodes are placed so the geometry
 * carries meaning: predecessors above, successors below, antagonists left,
 * dissenters right. Hover/focus lifts a node and explains the link; click or
 * Enter opens that dossier.
 */
export default function RelationGraph({ concept }: { concept: Concept }) {
  const [focus, setFocus] = useState<string | null>(null)
  const navigate = useNavigate()

  const neighbors = useMemo<Neighbor[]>(
    () =>
      concept.refs
        .map((ref) => ({ ref, target: getConcept(ref.id) }))
        .filter((n): n is Neighbor => Boolean(n.target)),
    [concept],
  )

  const placed = useMemo(() => {
    const by = (kinds: ConceptRef['relation'][]) => neighbors.filter((n) => kinds.includes(n.ref.relation))
    const up = by(['延续']) // the tradition this concept continues
    const down = by(['引出', '回应', '转化']) // what it leads to or answers
    const left = by(['对抗']) // who it overthrows
    const right = by(['分歧']) // who breaks with it

    const out: { n: Neighbor; x: number; y: number }[] = []
    const spread = (list: Neighbor[], y: number) => {
      const k = list.length
      list.forEach((n, i) => {
        const t = k === 1 ? 0.5 : (i + 1) / (k + 1)
        out.push({ n, x: PAD_X + (W - PAD_X * 2) * t, y })
      })
    }
    spread(up, PAD_Y)
    spread(down, HEIGHT - PAD_Y)
    left.forEach((n, i) => out.push({ n, x: 74, y: CY + (i % 2 === 0 ? -70 : 70) }))
    right.forEach((n, i) => out.push({ n, x: W - 74, y: CY + (i % 2 === 0 ? 70 : -70) }))
    return out
  }, [neighbors])

  const focused = placed.find((p) => p.n.target.id === focus)
  const dashed = (rel: ConceptRef['relation']) => rel === '对抗' || rel === '分歧'

  // the hub must contain its own label: size the disc from the term length
  // instead of forcing long terms like「权力/知识」out of a fixed circle
  const len = concept.term.length
  const centerSize = len >= 5 ? 13 : 16
  const centerR = Math.max(36, (len * centerSize * 1.08) / 2 + 12)

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${HEIGHT}`}
        className="w-full select-none overflow-visible"
        role="group"
        aria-label={`${concept.term} 的关联概念图`}
      >
        {placed.map(({ n, x, y }) => {
          const isFocus = focus === n.target.id
          const dim = focus !== null && !isFocus
          return (
            <path
              key={`line-${n.target.id}`}
              d={`M ${CX} ${CY} Q ${(CX + x) / 2} ${(CY + y) / 2 + (y > CY ? 26 : -26)} ${x} ${y}`}
              fill="none"
              stroke={isFocus ? lineMeta[n.target.line].color : 'var(--color-line)'}
              strokeWidth={isFocus ? 1.6 : 1}
              strokeDasharray={dashed(n.ref.relation) ? '3 5' : undefined}
              opacity={dim ? 0.28 : 1}
              style={{ transition: 'stroke 240ms, opacity 240ms' }}
              aria-hidden="true"
            />
          )
        })}

        <g transform={`translate(${CX},${CY})`} aria-hidden="true">
          <circle r={centerR} fill="var(--color-paper)" stroke={lineMeta[concept.line].color} strokeWidth="1.4" />
          <text
            y={centerSize / 3}
            textAnchor="middle"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: centerSize,
              fill: 'var(--color-ink)',
              letterSpacing: '0.06em',
            }}
          >
            {concept.term}
          </text>
        </g>

        {placed.map(({ n, x, y }) => {
          const isFocus = focus === n.target.id
          const dim = focus !== null && !isFocus
          const r = isFocus ? 9 : 6
          const meta = lineMeta[n.target.line]
          const below = y > CY
          return (
            <g
              key={n.target.id}
              transform={`translate(${x},${y})`}
              tabIndex={0}
              role="link"
              aria-label={`${n.target.term}，关系：${n.ref.relation}`}
              onMouseEnter={() => setFocus(n.target.id)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(n.target.id)}
              onBlur={() => setFocus(null)}
              onClick={() => navigate(`/archive/${n.target.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(`/archive/${n.target.id}`)
                }
              }}
              className="cursor-pointer outline-none focus-visible:[&>circle:nth-of-type(2)]:stroke-[3px]"
              style={{ opacity: dim ? 0.4 : 1, transition: 'opacity 240ms' }}
            >
              <circle r={26} fill="transparent" />
              <circle r={r} fill={isFocus ? meta.color : 'var(--color-paper)'} stroke={meta.color} strokeWidth="1.3" />
              <text
                y={below ? r + 20 : -r - 12}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fill: isFocus ? 'var(--color-ink)' : 'var(--color-mute)',
                  letterSpacing: '0.04em',
                  transition: 'fill 200ms',
                }}
              >
                {n.target.term}
              </text>
              <text
                y={below ? r + 36 : -r - 28}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  fill: isFocus ? meta.ink : 'var(--color-mute-soft)',
                  transition: 'fill 200ms',
                }}
              >
                {n.ref.relation}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-3 min-h-[5rem] border-t border-line-soft pt-3" aria-live="polite">
        {focused ? (
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-baseline gap-3">
              <Link
                to={`/archive/${focused.n.target.id}`}
                className="font-display text-lg text-ink transition-colors hover:text-crimson"
              >
                {focused.n.target.term}
              </Link>
              <span className="label-mono" style={{ color: lineMeta[focused.n.target.line].ink }}>
                {lineMeta[focused.n.target.line].label} · {focused.n.ref.relation}
              </span>
            </div>
            <p className="max-w-[62ch] text-sm leading-relaxed text-mute">{focused.n.ref.note}</p>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-mute-soft">
            悬停或用 Tab 聚焦任一节点，查看关系说明；点击节点打开对应档案。
            <span className="ml-3 font-mono text-[0.68rem] text-mute-soft">实线 延续</span>
            <span className="ml-2 font-mono text-[0.68rem] text-mute-soft">虚线 对抗 / 分歧</span>
            <span className="ml-2 font-mono text-[0.68rem] text-mute-soft">上 前身 · 下 后继</span>
          </p>
        )}
      </div>
    </div>
  )
}
