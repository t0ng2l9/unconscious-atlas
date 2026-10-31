import { figures } from '../data/figures'
import { concepts } from '../data/concepts'
import { glossary } from '../data/glossary'

export interface LinkRule {
  /** the literal text to match */
  term: string
  href: string
  /** tooltip-ish title attribute */
  title: string
}

/**
 * Build the cross-reference dictionary once. Longer terms win over shorter
 * ones so that 「集体无意识」 is not chopped into 「无意识」, and terms that are
 * ambiguous in ordinary Chinese (自我, 主体, 性) are deliberately left out.
 */
const AMBIGUOUS = new Set([
  '自我',
  '主体',
  '性',
  '他者',
  '凝视',
  '权力/知识',
  '我思',
  '意志',
  '存在',
  '异化',
  '压抑',
  '梦',
  '创伤',
  '抵抗',
  '先验',
  '爱欲',
  '移情',
  '口误',
  '原型',
  '镜像阶段',
  '象征秩序',
  // 无意识 is the spine of the whole site: linking it once per section is
  // useful, and it is unambiguous in Chinese.
])

function buildRules(): LinkRule[] {
  const rules: LinkRule[] = []

  for (const c of concepts) {
    if (AMBIGUOUS.has(c.term)) continue
    rules.push({ term: c.term, href: `/archive/${c.id}`, title: `档案：${c.term}` })
  }
  for (const f of figures) {
    rules.push({ term: f.name, href: `/figures#${f.id}`, title: `人物：${f.name}` })
  }
  for (const g of glossary) {
    if (AMBIGUOUS.has(g.term)) continue
    // glossary has no per-term route; link to the glossary page with a query
    rules.push({ term: g.term, href: `/glossary?q=${encodeURIComponent(g.term)}`, title: `术语：${g.term}` })
  }

  return rules.sort((a, b) => b.term.length - a.term.length)
}

const RULES = buildRules()
const ruleByTerm = new Map(RULES.map((r) => [r.term, r]))

export type Segment = { text: string; href?: string; title?: string }

/**
 * Split a paragraph into plain text and link segments. Each term is linked
 * only on its first occurrence within the block passed in, which keeps prose
 * readable; callers pass one section at a time rather than a whole article.
 */
export function linkify(text: string, suppress: ReadonlySet<string> = new Set()): Segment[] {
  const out: Segment[] = []
  const used = new Set<string>(suppress)
  let i = 0
  let buffer = ''

  const flush = () => {
    if (buffer) {
      out.push({ text: buffer })
      buffer = ''
    }
  }

  while (i < text.length) {
    let matched = false
    for (const rule of RULES) {
      if (used.has(rule.term)) continue
      if (text.startsWith(rule.term, i)) {
        flush()
        out.push({ text: rule.term, href: rule.href, title: rule.title })
        used.add(rule.term)
        i += rule.term.length
        matched = true
        break
      }
    }
    if (!matched) {
      buffer += text[i]
      i++
    }
  }
  flush()
  return out
}

export { ruleByTerm }

/**
 * Pre-compute the suppression sets for an ordered list of paragraphs:
 * returned[i] holds every term linked before paragraph i. Doing this up front
 * keeps CrossLinked a pure function (no state updates during render).
 */
export function suppressionPlan(paragraphs: string[]): Set<string>[] {
  const plan: Set<string>[] = []
  const seen = new Set<string>()
  for (const p of paragraphs) {
    plan.push(new Set(seen))
    for (const seg of linkify(p, seen)) {
      if (seg.href) seen.add(seg.text)
    }
  }
  return plan
}
