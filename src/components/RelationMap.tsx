import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { lineMeta } from '../data/concepts'
import { personNodes, deduped as relations, nodeDegree, getPerson, type EdgeKind, type PersonNode } from '../data/relations'

const SIZE = 900
const C = SIZE / 2
const R = 360

const edgeStyle: Record<EdgeKind, { dash?: string; width: number }> = {
  继承: { width: 1.2 },
  对抗: { dash: '3 4', width: 1.2 },
  合作: { width: 1.6 },
  影响: { dash: '1 4', width: 1 },
}

/**
 * Whole-map overview. Freud sits at the centre (nearly every relation runs
 * through him); the profiled figures form a ring around him, and the few
 * people without a profile tuck inside that ring. Straight edges keep the
 * web readable — curved edges crossing the centre turned into spaghetti.
 */
export default function RelationMap() {
  const [hover, setHover] = useState<string | null>(null)
  const navigate = useNavigate()

  const { nodes, hub } = useMemo(() => {
    const hubId = 'freud'
    const profiled = personNodes
      .filter((p) => p.profiled)
      .sort((a, b) => (nodeDegree.get(b.id) ?? 0) - (nodeDegree.get(a.id) ?? 0))
    const inner = personNodes.filter((p) => !p.profiled && p.id !== hubId)

    const placed: (PersonNode & { x: number; y: number; degree: number })[] = []
    // ring: start at 12 o'clock, step evenly
    profiled.forEach((p, i) => {
      const a = (i / profiled.length) * Math.PI * 2 - Math.PI / 2
      placed.push({
        ...p,
        x: C + Math.cos(a) * R,
        y: C + Math.sin(a) * R,
        degree: nodeDegree.get(p.id) ?? 0,
      })
    })
    inner.forEach((p, i) => {
      const a = (i / inner.length) * Math.PI * 2 - Math.PI / 4
      placed.push({
        ...p,
        x: C + Math.cos(a) * R * 0.44,
        y: C + Math.sin(a) * R * 0.44,
        degree: nodeDegree.get(p.id) ?? 0,
      })
    })

    const hubNode = personNodes.find((p) => p.id === hubId)
    if (hubNode) {
      placed.push({ ...hubNode, x: C, y: C, degree: nodeDegree.get(hubId) ?? 0 })
    }
    return { nodes: placed, hub: hubId }
  }, [])

  const pos = new Map(nodes.map((n) => [n.id, n]))
  const activeEdges = hover
    ? new Set(relations.filter((e) => e.from === hover || e.to === hover).map((e) => `${e.from}|${e.to}`))
    : null

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full select-none overflow-visible"
        role="group"
        aria-label="所有人物之间的关系网络"
      >
        {relations.map((e) => {
          const a = pos.get(e.from)
          const b = pos.get(e.to)
          if (!a || !b) return null
          const key = `${e.from}|${e.to}`
          const on = activeEdges ? activeEdges.has(key) : false
          const dim = activeEdges ? !on : false
          const st = edgeStyle[e.kind]
          return (
            <path
              key={key}
              d={`M ${a.x.toFixed(1)} ${a.y.toFixed(1)} L ${b.x.toFixed(1)} ${b.y.toFixed(1)}`}
              fill="none"
              stroke={on ? 'var(--color-crimson)' : 'var(--color-line)'}
              strokeWidth={on ? 1.8 : st.width}
              strokeDasharray={st.dash}
              opacity={dim ? 0.12 : on ? 0.95 : 0.5}
              style={{ transition: 'opacity 200ms, stroke 200ms' }}
              aria-hidden="true"
            />
          )
        })}

        {nodes.map((n) => {
          const meta = lineMeta[n.line]
          const on = hover === n.id
          const near = activeEdges
            ? relations.some((e) => (e.from === n.id || e.to === n.id) && (e.from === hover || e.to === hover))
            : false
          const dim = activeEdges ? !on && !near : false
          // subtle size variation only: large differences turned the ring
          // into a cluster of blobs
          const r = n.id === hub ? 26 : 7 + Math.min(n.degree, 5) * 0.7
          return (
            <g
              key={n.id}
              transform={`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`}
              tabIndex={0}
              role={n.profiled ? 'link' : 'note'}
              aria-label={`${n.name}，${n.degree} 条关系`}
              className={n.profiled ? 'cursor-pointer outline-none' : 'cursor-help outline-none'}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n.id)}
              onBlur={() => setHover(null)}
              onClick={() => n.profiled && navigate(`/figures#${n.id}`)}
              onKeyDown={(e) => {
                if (n.profiled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  navigate(`/figures#${n.id}`)
                }
              }}
              style={{ opacity: dim ? 0.28 : 1, transition: 'opacity 200ms' }}
            >
              <circle r={26} fill="transparent" />
              <circle
                r={on ? r + 2 : r}
                fill={n.profiled ? meta.color : n.id === hub ? 'var(--color-ink)' : 'var(--color-paper)'}
                stroke={meta.color}
                strokeWidth={n.profiled ? 1 : 1.4}
                strokeDasharray={n.profiled || n.id === hub ? undefined : '2.5 2.5'}
              />
              <text
                x={0}
                y={n.id === hub ? 4 : -(r + 10)}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: on ? 14 : n.id === hub ? 13 : 12.5,
                  fill: n.id === hub ? 'var(--color-paper)' : on ? 'var(--color-ink)' : 'var(--color-mute)',
                  letterSpacing: '0.04em',
                }}
              >
                {n.name}
              </text>
              <title>{`${n.name} · ${n.years} · ${n.degree} 条关系${n.profiled ? '' : '（无独立条目）'}`}</title>
            </g>
          )
        })}
      </svg>

      <div className="mt-3 flex min-h-[3.5rem] flex-wrap items-center gap-x-6 gap-y-2 border-t border-line-soft pt-3">
        <span className="text-sm text-mute-soft">
          {hover
            ? `${getPerson(hover)?.name} · ${nodeDegree.get(hover) ?? 0} 条关系`
            : '悬停任一节点，只看它参与的关系；实心点为有独立条目的人物'}
        </span>
        <span className="ml-auto flex flex-wrap items-center gap-4">
          {(
            [
              ['继承', 'none'],
              ['对抗', '3 4'],
              ['影响', '1 4'],
            ] as const
          ).map(([label, dash]) => (
            <span key={label} className="flex items-center gap-2 font-mono text-[0.68rem] text-mute-soft">
              <svg width="24" height="6" aria-hidden="true">
                <line x1="0" y1="3" x2="24" y2="3" stroke="var(--color-line)" strokeWidth="1.4" strokeDasharray={dash === 'none' ? undefined : dash} />
              </svg>
              {label}
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}
