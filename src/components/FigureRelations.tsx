import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { lineMeta } from '../data/concepts'
import { getPerson, relationsOf, type EdgeKind } from '../data/relations'

const edgeStyle: Record<EdgeKind, { dash?: string; label: string }> = {
  继承: { label: '继承' },
  对抗: { dash: '3 5', label: '对抗' },
  合作: { label: '合作' },
  影响: { dash: '1 4', label: '影响' },
}

const W = 840
const HEIGHT = 460
const CX = W / 2
const CY = HEIGHT / 2
const PAD_Y = 92

/**
 * Relation map for one figure: people on the left pulled the figure forward,
 * people on the right pushed back. Arrow direction shows who moved toward
 * whom, which is the part a plain "related people" list always loses.
 */
export default function FigureRelations({ id }: { id: string }) {
  const [focus, setFocus] = useState<string | null>(null)
  const navigate = useNavigate()
  const person = getPerson(id)
  const rels = useMemo(() => relationsOf(id), [id])

  const placed = useMemo(() => {
    const lefts = rels.filter((r) => r.outgoing) // this person moved toward them
    const rights = rels.filter((r) => !r.outgoing)
    const out: { r: (typeof rels)[number]; x: number; y: number }[] = []
    const place = (list: typeof rels, side: 'l' | 'r') => {
      const k = list.length
      list.forEach((r, i) => {
        const t = k === 1 ? 0.5 : (i + 1) / (k + 1)
        const y = PAD_Y + (HEIGHT - PAD_Y * 2) * t
        out.push({ r, x: side === 'l' ? 78 : W - 78, y })
      })
    }
    place(lefts, 'l')
    place(rights, 'r')
    return out
  }, [rels])

  if (!person) return null
  const focused = placed.find((p) => p.r.other === focus)

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${HEIGHT}`}
        className="w-full select-none overflow-visible"
        role="group"
        aria-label={`${person.name} 的关系网络`}
      >
        <text
          x={40}
          y={26}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', fill: 'var(--color-mute-soft)' }}
        >
          他走向谁
        </text>
        <text
          x={W - 40}
          y={26}
          textAnchor="end"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', fill: 'var(--color-mute-soft)' }}
        >
          谁走向他
        </text>

        {placed.map(({ r, x, y }) => {
          const other = getPerson(r.other)
          if (!other) return null
          const isFocus = focus === r.other
          const dim = focus !== null && !isFocus
          const st = edgeStyle[r.kind]
          const arrowId = `arrow-${r.other}-${r.kind}`
          // arrow points toward the person the relation moves toward
          const pointsRight = r.outgoing
          return (
            <g key={`${r.kind}-${r.other}`} aria-hidden="true">
              <defs>
                <marker
                  id={arrowId}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-mute-soft)" />
                </marker>
              </defs>
              <path
                d={`M ${CX} ${CY} Q ${(CX + x) / 2} ${(CY + y) / 2} ${x + (pointsRight ? -38 : 38)} ${y}`}
                fill="none"
                stroke={isFocus ? 'var(--color-crimson)' : 'var(--color-line)'}
                strokeWidth={isFocus ? 1.6 : 1}
                strokeDasharray={st.dash}
                markerEnd={`url(#${arrowId})`}
                opacity={dim ? 0.25 : 1}
                style={{ transition: 'stroke 240ms, opacity 240ms' }}
              />
            </g>
          )
        })}

        <g transform={`translate(${CX},${CY})`} aria-hidden="true">
          <circle r={40} fill="var(--color-paper)" stroke={lineMeta[person.line].color} strokeWidth="1.5" />
          <text
            y={5}
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-display)', fontSize: 17, fill: 'var(--color-ink)', letterSpacing: '0.06em' }}
          >
            {person.name}
          </text>
        </g>

        {placed.map(({ r, x, y }) => {
          const other = getPerson(r.other)
          if (!other) return null
          const isFocus = focus === r.other
          const dim = focus !== null && !isFocus
          const meta = lineMeta[other.line]
          const r0 = isFocus ? 9 : 6
          return (
            <g
              key={other.id}
              transform={`translate(${x},${y})`}
              tabIndex={0}
              role={other.profiled ? 'link' : 'note'}
              aria-label={`${other.name}，${r.kind}`}
              className={other.profiled ? 'cursor-pointer outline-none' : 'cursor-help outline-none'}
              onMouseEnter={() => setFocus(other.id)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(other.id)}
              onBlur={() => setFocus(null)}
              onClick={() => other.profiled && navigate(`/figures#${other.id}`)}
              onKeyDown={(e) => {
                if (other.profiled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  navigate(`/figures#${other.id}`)
                }
              }}
              style={{ opacity: dim ? 0.4 : 1, transition: 'opacity 240ms' }}
            >
              <circle r={26} fill="transparent" />
              <circle
                r={r0}
                fill={isFocus ? meta.color : 'var(--color-paper)'}
                stroke={meta.color}
                strokeWidth={other.profiled ? 1.6 : 1}
                strokeDasharray={other.profiled ? undefined : '2 2'}
              />
              <text
                textAnchor="middle"
                y={-r0 - 14}
                style={{ fontFamily: 'var(--font-body)', fontSize: 13, fill: isFocus ? 'var(--color-ink)' : 'var(--color-mute)' }}
              >
                {other.name}
              </text>
              <text
                textAnchor="middle"
                y={r0 + 20}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', fill: isFocus ? meta.ink : 'var(--color-mute-soft)' }}
              >
                {r.kind}
              </text>
              {!other.profiled && (
                <text
                  textAnchor="middle"
                  y={r0 + 33}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fill: 'var(--color-mute-soft)', opacity: 0.8 }}
                >
                  无独立条目
                </text>
              )}
              <title>{r.note}</title>
            </g>
          )
        })}
      </svg>

      <div className="mt-3 min-h-[5rem] border-t border-line-soft pt-3" aria-live="polite">
        {focused ? (
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-display text-lg text-ink">{getPerson(focused.r.other)?.name}</span>
              <span className="label-mono text-mute">{focused.r.kind}</span>
              {getPerson(focused.r.other)?.profiled && (
                <Link
                  to={`/figures#${focused.r.other}`}
                  className="label-mono text-crimson transition-opacity hover:opacity-70"
                >
                  查看人物 →
                </Link>
              )}
            </div>
            <p className="max-w-[62ch] text-sm leading-relaxed text-mute">{focused.r.note}</p>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-mute-soft">
            悬停或 Tab 聚焦节点，查看这段关系的来龙去脉。悬停指向他的一方是他走向对方的关系（继承、影响），指向他的一方是对方走向他（对抗、合作）。
            <span className="ml-3 font-mono text-[0.68rem]">实线 继承 · 虚线 对抗 · 点线 影响 · 合作</span>
          </p>
        )}
      </div>
    </div>
  )
}
