import { figures } from './figures'
import type { Line } from './concepts'

export type EdgeKind = '继承' | '对抗' | '合作' | '影响'

export interface PersonNode {
  /** slug used in URLs and edge references */
  id: string
  name: string
  years: string
  line: Line
  /** true when this person has a full profile on /figures */
  profiled: boolean
}

export interface RelationEdge {
  from: string
  to: string
  kind: EdgeKind
  note: string
}

/**
 * People who appear in the dialogue records but do not have their own
 * profile: they are still nodes, because a relation graph that hides
 * Freud would misrepresent the whole argument.
 */
const anchors: PersonNode[] = [
  { id: 'freud', name: '弗洛伊德', years: '1856–1939', line: 'psychoanalysis', profiled: false },
  { id: 'lacan', name: '拉康', years: '1901–1981', line: 'crossing', profiled: false },
  { id: 'sartre', name: '萨特', years: '1905–1980', line: 'philosophy', profiled: false },
  { id: 'marx', name: '马克思', years: '1818–1883', line: 'philosophy', profiled: false },
  { id: 'schopenhauer', name: '叔本华', years: '1788–1860', line: 'philosophy', profiled: false },
  { id: 'foucault', name: '福柯', years: '1926–1984', line: 'crossing', profiled: false },
  { id: 'proust', name: '普鲁斯特', years: '1871–1922', line: 'crossing', profiled: false },
]

/** names used inside dialogue notes → node ids */
const nameToId: Record<string, string> = {
  尼采: 'nietzsche',
  卡夫卡: 'kafka',
  阿多诺: 'adorno',
  本雅明: 'benjamin',
  马尔库塞: 'marcuse',
  弗洛姆: 'fromm',
  阿尔都塞: 'althusser',
  德勒兹: 'deleuze',
  德勒兹与加塔利: 'deleuze',
  加塔利: 'deleuze',
  波伏娃: 'beauvoir',
  克莱因: 'klein',
  温尼科特: 'winnicott',
  阿德勒: 'adler',
  齐泽克: 'zizek',
  赖希: 'reich',
  弗洛伊德: 'freud',
  拉康: 'lacan',
  萨特: 'sartre',
  马克思: 'marx',
  叔本华: 'schopenhauer',
  福柯: 'foucault',
  普鲁斯特: 'proust',
}

export const personNodes: PersonNode[] = [
  ...figures.map((f) => ({
    id: f.id,
    name: f.name,
    years: f.years,
    line: f.line,
    profiled: true,
  })),
  ...anchors,
]

const nodeById = new Map(personNodes.map((n) => [n.id, n]))

/**
 * Edges are derived from each profiled figure's `dialogue` list, with two
 * fixes applied by hand: direction (who moved toward whom) and kind.
 * Keeping them out of figures.ts means the profile copy stays readable.
 */
const edgeOverrides: Record<string, { kind: EdgeKind; reverse?: boolean }> = {
  'nietzsche>schopenhauer': { kind: '对抗' },
  'nietzsche>freud': { kind: '影响', reverse: true },
  'kafka>freud': { kind: '影响', reverse: true },
  'kafka>foucault': { kind: '影响', reverse: true },
  'adorno>marcuse': { kind: '对抗' },
  'adorno>freud': { kind: '对抗' },
  'benjamin>adorno': { kind: '影响', reverse: true },
  'benjamin>proust': { kind: '影响', reverse: true },
  'marcuse>freud': { kind: '对抗' },
  'marcuse>adorno': { kind: '对抗', reverse: true },
  'fromm>marcuse': { kind: '对抗', reverse: true },
  'fromm>freud': { kind: '对抗' },
  'althusser>lacan': { kind: '继承', reverse: true },
  'althusser>foucault': { kind: '影响' },
  'deleuze>lacan': { kind: '对抗' },
  'deleuze>freud': { kind: '对抗' },
  'beauvoir>sartre': { kind: '继承', reverse: true },
  'beauvoir>freud': { kind: '对抗' },
  'klein>freud': { kind: '继承', reverse: true },
  'klein>winnicott': { kind: '影响' },
  'winnicott>klein': { kind: '对抗' },
  'winnicott>freud': { kind: '对抗' },
  'adler>freud': { kind: '对抗' },
  'adler>nietzsche': { kind: '继承', reverse: true },
  'zizek>lacan': { kind: '继承', reverse: true },
  'zizek>marx': { kind: '继承', reverse: true },
  'reich>marcuse': { kind: '影响' },
  'reich>freud': { kind: '对抗' },
}

export const relations: RelationEdge[] = figures.flatMap((f) =>
  f.dialogue.flatMap((d) => {
    const target = nameToId[d.name]
    if (!target || target === f.id) return []
    const key = `${f.id}>${target}`
    const ov = edgeOverrides[key]
    if (!ov) return [{ from: f.id, to: target, kind: '影响' as EdgeKind, note: d.note }]
    return [
      {
        from: ov.reverse ? target : f.id,
        to: ov.reverse ? f.id : target,
        kind: ov.kind,
        note: d.note,
      },
    ]
  }),
)

/**
 * Both sides of a debate often list each other (阿多诺 writes about 马尔库塞
 * and vice versa), which would draw the same argument twice and collide on
 * React keys. Keep the first description, keyed by unordered pair + kind.
 */
const seen = new Set<string>()
export const deduped: RelationEdge[] = relations.filter((e) => {
  const pair = [e.from, e.to].sort().join('~')
  const key = `${pair}|${e.kind}`
  if (seen.has(key)) return false
  seen.add(key)
  return true
})

/** each person's position in the graph (for the overview layout) */
export const nodeDegree = (() => {
  const m = new Map<string, number>()
  for (const e of deduped) {
    m.set(e.from, (m.get(e.from) ?? 0) + 1)
    m.set(e.to, (m.get(e.to) ?? 0) + 1)
  }
  return m
})()

export const getPerson = (id: string) => nodeById.get(id)
export const getFigure = (id: string) => figures.find((f) => f.id === id)

/**
 * Development-time guard: every hand-written override must actually match a
 * dialogue entry, otherwise the rule is silently dead (this happened once
 * already with 本雅明→阿多诺, which was never in the source data).
 */
if (import.meta.env.DEV) {
  const produced = new Set(
    figures.flatMap((f) =>
      f.dialogue.flatMap((d) => {
        const t = nameToId[d.name]
        return t ? [`${f.id}>${t}`] : []
      }),
    ),
  )
  const dead = Object.keys(edgeOverrides).filter((k) => !produced.has(k))
  if (dead.length) {
    console.warn('[relations] override rules with no matching dialogue entry:', dead)
  }
}

/** relations touching a given person, normalised so `other` is the far end */
export function relationsOf(id: string) {
  return deduped
    .filter((e) => e.from === id || e.to === id)
    .map((e) => ({
      ...e,
      other: e.from === id ? e.to : e.from,
      outgoing: e.from === id,
    }))
}
