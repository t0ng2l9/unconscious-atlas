export type TimelineLine = 'philosophy' | 'psychoanalysis' | 'both'

export interface TimelineEvent {
  year: number
  /** display label, e.g. 「1856」 or 「约 1641」 */
  label: string
  title: string
  detail: string
  line: TimelineLine
  /** concept id whose dossier this event opens, when there is one */
  concept?: string
}

/**
 * A deliberately selective chronology: only moments that changed what
 * 「无意识」 was allowed to be. Not a full history of psychoanalysis, and not
 * a full history of philosophy — a history of the seam between them.
 */
export const events: TimelineEvent[] = [
  {
    year: 1641,
    label: '1641',
    title: '「我思」成为地基',
    detail: '笛卡尔在《第一哲学沉思集》中把思维者确立为唯一不可怀疑的存在，人的内部从此被要求是透明的。',
    line: 'philosophy',
    concept: 'cogito',
  },
  {
    year: 1781,
    label: '1781',
    title: '先验结构登场',
    detail: '康德《纯粹理性批判》：经验不是从白板开始，而是被时间、空间、范畴等先验形式先行组织。一个「先于意识而运作的结构」第一次成为严格哲学命题。',
    line: 'philosophy',
  },
  {
    year: 1818,
    label: '1818',
    title: '意志被推到前台',
    detail: '叔本华《作为意志和表象的世界》把世界本质定为盲目的意志，意识只是它的表层工具。',
    line: 'philosophy',
    concept: 'will',
  },
  {
    year: 1879,
    label: '1879',
    title: '实验心理学诞生',
    detail: '冯特在莱比锡建立第一个心理学实验室。弗洛伊德后来的对手，从一开始就不是哲学而是这门新科学。',
    line: 'both',
  },
  {
    year: 1887,
    label: '1887',
    title: '「无意识」成为哲学题目',
    detail: '哈特曼《无意识的哲学》大卖，「无意识」以流行哲学的面貌进入公共语言，同时被科学界广泛嘲笑。',
    line: 'both',
  },
  {
    year: 1895,
    label: '1895',
    title: '《科学心理学计划》',
    detail: '弗洛伊德写给弗利斯的信件草稿，试图用神经元与能量解释心理，最后半途而废——但它留下了「驱力-压抑」的基本模型。',
    line: 'psychoanalysis',
  },
  {
    year: 1896,
    label: '1896',
    title: '第一次使用「精神分析」',
    detail: '弗洛伊德在论文中首次使用 Psychanalyse 一词，并公开提出「童年性创伤」假说（后来他自己也修改了它）。',
    line: 'psychoanalysis',
  },
  {
    year: 1900,
    label: '1900',
    title: '《梦的解析》',
    detail: '梦第一次被当作有结构的产物而非随机现象来处理。这本书首印 600 册，卖了八年。',
    line: 'psychoanalysis',
    concept: 'dream',
  },
  {
    year: 1905,
    label: '1905',
    title: '《性学三论》',
    detail: '性从生殖功能里被拆出来，变成从婴儿期开始的、可被各种方式组织的驱力。「正常」第一次显出它的偶然性。',
    line: 'psychoanalysis',
    concept: 'drive',
  },
  {
    year: 1913,
    label: '1913',
    title: '荣格决裂',
    detail: '荣格辞去国际精神分析协会主席，转向「集体无意识」与原型理论。精神分析内部的第一次结构性分裂。',
    line: 'both',
    concept: 'collective',
  },
  {
    year: 1915,
    label: '1915',
    title: '元心理学论文',
    detail: '《无意识》《压抑》《本能及其命运》三篇连发：无意识被从「一个地点」改写成「一整套运作方式」。',
    line: 'psychoanalysis',
    concept: 'repression',
  },
  {
    year: 1920,
    label: '1920',
    title: '《超越快乐原则》',
    detail: '死亡驱力登场：人身上有一种不追求满足、只求重复的冲力。快乐原则不再是最高原则。',
    line: 'psychoanalysis',
    concept: 'death-drive',
  },
  {
    year: 1923,
    label: '1923',
    title: '《自我与本我》',
    detail: '地形学被结构模型替换：本我、自我、超我不是三个房间，而是三种相互冲突的功能配置。',
    line: 'psychoanalysis',
    concept: 'unconscious',
  },
  {
    year: 1927,
    label: '1927',
    title: '《存在与时间》',
    detail: '海德格尔的「此在」总已先于自身。它与无意识平行，却选择了一条不同的道路：不是解释，而是倾听。',
    line: 'philosophy',
    concept: 'existence',
  },
  {
    year: 1933,
    label: '1933',
    title: '焚书与流亡',
    detail: '纳粹公开焚烧弗洛伊德著作，精神分析中心从柏林、维也纳迁往伦敦与纽约。法兰克福学派同样被迫流亡。',
    line: 'both',
  },
  {
    year: 1939,
    label: '1939',
    title: '弗洛伊德逝世',
    detail: '伦敦，摩西与一神教尚未完成。他的遗产分裂成临床、文化与哲学三条互不通邮的道路。',
    line: 'psychoanalysis',
  },
  {
    year: 1943,
    label: '1943',
    title: '《存在与虚无》',
    detail: '萨特把「他人的凝视」写成主体被物化的结构机制，「他人即地狱」由此获得精确含义。',
    line: 'philosophy',
    concept: 'the-other',
  },
  {
    year: 1953,
    label: '1953',
    title: '拉康开办研讨班',
    detail: '在巴黎，拉康开始用语言学重读弗洛伊德：「无意识是像语言一样被结构的」。',
    line: 'both',
    concept: 'other',
  },
  {
    year: 1955,
    label: '1955',
    title: '《爱欲与文明》',
    detail: '马尔库塞把精神分析接到文明批判上：现代社会的「多余压抑」不只是心理问题，而是政治问题。',
    line: 'both',
    concept: 'death-drive',
  },
  {
    year: 1966,
    label: '1966',
    title: '《词与物》《文集》同一年',
    detail: '福柯宣称「人将像海边沙滩上的脸一样被抹去」，拉康的《文集》出版。结构主义到达顶峰，也随即开始解体。',
    line: 'both',
  },
  {
    year: 1976,
    label: '1976',
    title: '《性史》第一卷',
    detail: '福柯正面回答《性学三论》：性是权力-知识生产出来的，精神分析本身也在这套装置之内。',
    line: 'both',
    concept: 'power',
  },
  {
    year: 1981,
    label: '1981',
    title: '拉康逝世',
    detail: '去世前一年解散了自己的学派。法国精神分析进入「后拉康」的碎片化时期。',
    line: 'psychoanalysis',
  },
]

/** The books that anchor the two lines, shown as a reading shelf. */
export const shelf = [
  { title: '《第一哲学沉思集》', author: '笛卡尔', year: '1641', line: 'philosophy' as const, note: '一切的起点：为什么主体必须是透明的。' },
  { title: '《作为意志和表象的世界》', author: '叔本华', year: '1818', line: 'philosophy' as const, note: '第一个把「盲目冲动」写进体系的哲学家。' },
  { title: '《梦的解析》', author: '弗洛伊德', year: '1900', line: 'psychoanalysis' as const, note: '无意识获得语法的地方。' },
  { title: '《性学三论》', author: '弗洛伊德', year: '1905', line: 'psychoanalysis' as const, note: '「正常」如何被证明是组织出来的。' },
  { title: '《超越快乐原则》', author: '弗洛伊德', year: '1920', line: 'psychoanalysis' as const, note: '死亡驱力，也是整本书里最暗的一页。' },
  { title: '《自我与本我》', author: '弗洛伊德', year: '1923', line: 'psychoanalysis' as const, note: '结构模型取代地形学。' },
  { title: '《存在与时间》', author: '海德格尔', year: '1927', line: 'philosophy' as const, note: '「先于自身」的存在论版本。' },
  { title: '《爱欲与文明》', author: '马尔库塞', year: '1955', line: 'both' as const, note: '压抑从个人问题变成文明问题。' },
  { title: '《性史：认知的意志》', author: '福柯', year: '1976', line: 'both' as const, note: '对精神分析最尖锐的一次反诘。' },
]
