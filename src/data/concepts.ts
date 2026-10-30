import { enrichment } from './enrichment'

export type Line = 'philosophy' | 'psychoanalysis' | 'crossing'
export type Era =
  | 'antiquity'
  | 'early-modern'
  | 'romanticism'
  | 'classical'
  | 'interwar'
  | 'structural'
  | 'contemporary'

export interface ConceptRef {
  id: string
  relation: '引出' | '回应' | '延续' | '对抗' | '分歧' | '转化'
  note: string
}

export interface Concept {
  id: string
  index: string
  term: string
  termLatin: string
  line: Line
  era: Era
  thinker: string
  period: string
  definition: string
  question: string
  body: string[]
  /**
   * the lever: what actually changed because of this concept.
   * Each entry is shown as a before/after pair.
   */
  lever: { before: string; after: string }
  /**
   * Filled in from enrichment.ts after the array literal is defined, so the
   * authoring records below do not have to repeat them. Optional by design.
   */
  quote?: { text: string; source: string }
  furtherReading?: { title: string; author: string; note: string }[]
  keywords?: string[]
  works: { title: string; year: string }[]
  refs: ConceptRef[]
}

export const lineMeta: Record<
  Line,
  { label: string; short: string; color: string; ink: string }
> = {
  philosophy: {
    label: '哲学线',
    short: '哲',
    color: 'var(--color-teal)',
    ink: '#3c5d57',
  },
  psychoanalysis: {
    label: '精神分析线',
    short: '析',
    color: 'var(--color-crimson)',
    ink: '#8f2f2a',
  },
  crossing: {
    label: '交汇',
    short: '汇',
    color: 'var(--color-ochre)',
    ink: '#8a6a2f',
  },
}

export const eraMeta: Record<Era, { label: string; range: string }> = {
  antiquity: { label: '古典', range: '公元前' },
  'early-modern': { label: '近代', range: '17–18 世纪' },
  romanticism: { label: '浪漫主义', range: '19 世纪前半' },
  classical: { label: '古典精神分析', range: '19 世纪末–1910s' },
  interwar: { label: '两次大战之间', range: '1920s–1930s' },
  structural: { label: '结构主义年代', range: '1950s–1970s' },
  contemporary: { label: '当代', range: '1980s 以后' },
}

export const concepts: Concept[] = [
  {
    id: 'cogito',
    index: '01',
    term: '我思',
    termLatin: 'Cogito',
    line: 'philosophy',
    era: 'early-modern',
    thinker: '笛卡尔',
    period: '1596–1650',
    definition:
      '「我思故我在」确立了一个自足的、自身透明的理性主体：只要我在思考，我就不可能不存在。',
    question: '如果人是由自身理性构成的主体，那么不理性、不被自己知道的那部分，该归到哪里？',
    body: [
      '笛卡尔把「我」单独抽出来作为地基：怀疑一切之后，剩下不可怀疑的只有怀疑本身这个动作，而怀疑是一种思维。于是「思考着的东西」被立为存在者的基本样式。这一步确立了近代哲学的主体——一个对自身完全透明、可被清点、可被托付的主体。',
      '代价也很清楚：这个主体只能容纳「清楚明白的观念」。凡是说不清的、会自行出现的、违背本意的，都被推到主体之外，作为「错误」或「身体」或「激情」处理，而不是作为人的构成部分。',
      '弗洛伊德后来的一次著名致敬和一次著名背叛都在这里。致敬的是：我也承认有一个不透明的东西在运作，「我」不是最清楚的那一层。背叛的是：笛卡尔的怀疑最终被「我思」收服，而弗洛伊德发现的那个东西，永远不会被收服——它会以症状、梦、口误的方式回访。',
      '所以这张图谱把「我思」放在起点，不是因为无意识是它的延伸，而是因为无意识是它逐出的那个房间。',
    ],
    lever: {
      before: '人是理性主体，对自己完全透明。',
      after: '人有一个自己无权进入的内部——「我」不再是自己的主人。',
    },
    works: [{ title: '第一哲学沉思集', year: '1641' }],
    refs: [
      {
        id: 'unconscious',
        relation: '对抗',
        note: '弗洛伊德把笛卡尔逐出的「不透明」重新请回主体的核心，并宣布它不可被完全照亮。',
      },
      { id: 'will', relation: '引出', note: '一旦理性只剩一层薄壳，意志就被推到前面。' },
    ],
  },
  {
    id: 'will',
    index: '02',
    term: '意志',
    termLatin: 'Wille',
    line: 'philosophy',
    era: 'romanticism',
    thinker: '叔本华',
    period: '1788–1860',
    definition:
      '世界的本质不是理性，而是盲目的、无尽的求生存与求繁衍的意志；我们所能认识的一切，都是意志的客体化。',
    question: '如果世界的本质是欲望，那理性和意识在人的结构里还剩多少位置？',
    body: [
      '叔本华几乎从正面宣告了弗洛伊德的无意识：意志在黑暗中运作，不受理性指导，也不被理性约束；意识只是意志的表层。人是欲望的载体，而不是欲望的主人。「我们以为自己在选择，其实是被欲望选择」——这句话，在叔本华那里已经写成体系。',
      '弗洛伊德对此非常清楚。他在自传中指出，精神分析「并不是第一次发现无意识的心理学」，他点名承认了叔本华和尼采在这条道路上的先行。但他坚持一个关键差别：叔本华的意志是形而上学实体（可以骂、可以悲观、可以否定），弗洛伊德的驱力是生物性-心理性的事实，可以被观察、被临床检验、被分析。',
      '从意志到驱力，是这张图谱里最重要的「转化」之一：不是换个词，而是把「世界的本质」降格成「一个可被听见的东西」。这一降格，恰恰是精神分析能够成为一门实践的前提——形而上学无法治愈，症状可以。',
    ],
    lever: {
      before: '理性是世界和人的本质，欲望是需要被约束的杂质。',
      after: '欲望是世界和人的基底，理性只是它的表层工具。',
    },
    works: [
      { title: '作为意志和表象的世界', year: '1818' },
      { title: '论自然界中的意志', year: '1836' },
    ],
    refs: [
      { id: 'cogito', relation: '对抗', note: '把「我思」翻转为「我欲」：认识的根据变成了生的冲动。' },
      { id: 'unconscious', relation: '引出', note: '意志就是无意识的哲学前身——但弗洛伊德把形而上学实体改造成临床事实。' },
      { id: 'drive', relation: '转化', note: '意志被改写为驱力：世界的本质降格为可被分析、可被治愈的东西。' },
    ],
  },
  {
    id: 'unconscious',
    index: '03',
    term: '无意识',
    termLatin: 'Das Unbewusste',
    line: 'psychoanalysis',
    era: 'classical',
    thinker: '弗洛伊德',
    period: '1856–1939',
    definition:
      '一个被系统化压抑、却持续产生影响的心理区域：它的内容被阻止进入意识，却不因此停止运作。',
    question: '无意识为什么需要被「压抑」？它究竟是什么意义上的「无意识」？',
    body: [
      '无意识不是「暂时没注意到」的东西，也不是「将来会想起来的记忆」。它的定义里有三个紧咬在一起的词：系统的、被压抑的、有影响的。前两个确立了它的存在方式，最后一个确立了它不可被忽视的理由。',
      '早期的弗洛伊德用「地形学」区分三区：意识、前意识、无意识。无意识是被审查机制挡在门外的一间厢房，前意识是门厅，意识是客厅。问题在于——谁能看见门厅里发生了什么？这个模型很快撑不住了。1915 年的《无意识》是分界点：无意识被重新定义为「一整套心理过程，其运作方式与意识不同」，它的特征是置换、凝缩、无时间性、无矛盾律。到 1923 年《自我与本我》，地形学被结构模型替换：本我、自我、超我。压抑不再是「被赶出客厅」，而是「自我用本我的部分能量来压制本我」——这是一个结构内部的斗争。',
      '拉康后来给了最锋利的重新表述：无意识是「被结构得像语言一样的东西」。这一句把无意识从「黑暗的冲动储藏室」改写成「一套规则系统」：它不讲道理，但有语法；它不服从常识，但服从转喻和隐喻。',
      '所以这本档案的核心命题是：无意识不是一个「更深的地方」，而是一个「被系统性地排斥出去、却持续起作用的位置」。',
    ],
    lever: {
      before: '心灵是意识的，意识不到的是记忆缺失或生理残余。',
      after: '心灵是被压抑系统构造的；「未知的自己」不是缺陷，而是结构。',
    },
    works: [
      { title: '梦的解析', year: '1900' },
      { title: '无意识', year: '1915' },
      { title: '自我与本我', year: '1923' },
    ],
    refs: [
      { id: 'cogito', relation: '对抗', note: '「我思」的主体被证明有一个不透明的、不归「我」管的内部。' },
      { id: 'will', relation: '延续', note: '继承叔本华的「盲目冲动」，但坚持它是可被临床观察的事实。' },
      { id: 'repression', relation: '延续', note: '压抑是无意识得以存在和持续的机制。' },
      { id: 'drive', relation: '延续', note: '驱力是无意识真正的能量来源。' },
      { id: 'dream', relation: '延续', note: '梦是无意识「通往意识的大道」，验证它的存在方式。' },
      { id: 'collective', relation: '分歧', note: '荣格把个人无意识扩展为集体无意识，弗洛伊德视为对性驱力的背叛。' },
      { id: 'other', relation: '转化', note: '拉康：无意识是像语言一样被结构的大他者的话语。' },
    ],
  },
  {
    id: 'repression',
    index: '04',
    term: '压抑',
    termLatin: 'Verdrängung',
    line: 'psychoanalysis',
    era: 'classical',
    thinker: '弗洛伊德',
    period: '1856–1939',
    definition:
      '自我将无法与意识相容的冲动内容排斥出意识，并持续阻止其回返的心理机制。',
    question: '如果内容只是被「排斥」，为什么它总要回来？',
    body: [
      '压抑常被误读为「忘掉」。它不是忘记——被压抑的内容从未消失，它只是被持续地、费力地按住。这个「费力」是关键：压抑需要持续消耗能量，因此它不是消极的沉默，而是积极的劳动。',
      '1915 年的《压抑》给出了经典公式：冲动一开始面临两种命运——「否弃」（Verwerfung，整体拒绝）或者「压抑」（Verdrängung，把表象排斥出去但保留其情绪冲量）。被压抑的东西会通过三种渠道回返：作为替代表象（症状）、作为情感（焦虑）、以及作为梦境与口误。',
      '所以压抑是无意识最矛盾的结构：它生产了无意识，却也保证了无意识总有话要说。弗洛伊德把这个回返叫做「被压抑者的回归」（Wiederkehr des Verdrängten）。',
      '在《性学三论》的延长线上，压抑与社会的关系才真正清楚：不是每个人「自愿」压抑自己，而是文明通过教育、羞耻与规范系统性地制造压抑，然后再以疗效为掩盖。这也是为什么福柯在后面会接到这条线上。',
    ],
    lever: {
      before: '被压抑的东西等于不存在。',
      after: '被压抑的东西持续在场，并以症状的形式说话。',
    },
    works: [{ title: '压抑', year: '1915' }, { title: '性学三论', year: '1905' }],
    refs: [
      { id: 'unconscious', relation: '延续', note: '压抑是无意识成为「系统」的方式。' },
      { id: 'drive', relation: '延续', note: '被压抑的正是驱力表象。' },
      { id: 'dream', relation: '引出', note: '梦是被压抑者的回返形式之一。' },
    ],
  },
  {
    id: 'drive',
    index: '05',
    term: '驱力',
    termLatin: 'Trieb',
    line: 'psychoanalysis',
    era: 'classical',
    thinker: '弗洛伊德',
    period: '1856–1939',
    definition:
      '介于身体与心理之间的边界概念：身体内部的持续刺激所产生的心理需求，它没有固定对象，只有冲量。',
    question: '欲望的秩序从哪来？「正常」与「病态」的边界由谁划定？',
    body: [
      '弗洛伊德在《性学三论》中做了一件当时最冒犯的事：他把性从生殖功能里拆出来，变成一种从婴儿期就存在、经过口唇、肛门、生殖器等多重形式的「性冲动」（Trieb）。性不是成年的生理事件，而是从出生起就在塑形的组织原则。',
      '驱力（Trieb）有别于本能（Instinkt）：本能指向确定的对象和满足，而驱力只有「目标」（Ziel）——解除紧张——但「对象」（Objekt）是多样的、可替换的。这个区别的后果是巨大的：如果驱力没有天生的正确对象，那么「正常」性欲就不是天然的，而是某种组织化的结果。所谓正常，只是被成功组织起来的欲望。',
      '第二阶段从 1920 年《超越快乐原则》开始：弗洛伊德引入死亡驱力（Thanatos），与生之驱力（爱欲，Eros）并置。这一步使驱力理论从「追求满足」变成「有节奏地返回、重复、甚至毁灭」。',
      '弗洛伊德一直否认自己是哲学家，但这段说明了他的理论为何在哲学上如此重要：它把「人的本质是欲望」从形而上学命题变成了可分析的结构命题。',
    ],
    lever: {
      before: '性欲是成年、生理、以生殖为目的的本能。',
      after: '性欲是从婴儿期起的可组织冲动；「正常」是被组织出来的，不是自然给定的。',
    },
    works: [
      { title: '性学三论', year: '1905' },
      { title: '本能及其命运', year: '1915' },
      { title: '超越快乐原则', year: '1920' },
    ],
    refs: [
      { id: 'will', relation: '延续', note: '把叔本华的「意志」降格为可在临床中被观察、被分析之物。' },
      { id: 'repression', relation: '引出', note: '压抑的对象就是驱力的表象。' },
      { id: 'unconscious', relation: '延续', note: '驱力是无意识的能量来源。' },
      { id: 'death-drive', relation: '延续', note: '1920 年后，驱力理论分裂为爱欲与死亡驱力两条线。' },
      { id: 'power', relation: '回应', note: '福柯认为性不是被压抑的自然物，而是被权力生产、部署的产物。' },
    ],
  },
  {
    id: 'dream',
    index: '06',
    term: '梦',
    termLatin: 'Traum',
    line: 'psychoanalysis',
    era: 'classical',
    thinker: '弗洛伊德',
    period: '1856–1939',
    definition:
      '以显梦形式出现的「被压抑愿望的伪装满足」。解释梦，就是让隐梦重新获得言语。',
    question: '梦为什么必须被解释，而不是被记录？',
    body: [
      '1900 年，弗洛伊德称梦是「通往无意识的王道」。这句话常被误解为「梦藏着密码」。真正的立场更精确也更难：梦是一种心理产物，它遵循与本我不一样的规则——凝缩、置换、象征化、二次修订。解释梦不是查词典，而是把梦的「工作」（Traumarbeit）反过来做一遍：这才是他所说的「梦的解析」。',
      '梦之所以是「伪装」的愿望满足，是因为审查机制仍未松懈：若愿望直接出现，睡眠会被焦虑打断。于是梦「被允许出现」的条件是它必须穿着戏服。这一点让梦成为了解无意识结构的最直接窗口：它的伪装方式，就是无意识运作方式的样本。',
      '后来荣格与弗洛伊德的分裂，正是从这里开始的。荣格提供的是「解梦的另一条路」：梦不只是个人压抑的伪装，也可能是集体原型（Archetyp）的显现。',
    ],
    lever: {
      before: '梦是随机的、身体的、无意义的。',
      after: '梦是可以被解释的，解释的语法就是无意识的语法。',
    },
    works: [
      { title: '梦的解析', year: '1900' },
      { title: '论梦', year: '1901' },
    ],
    refs: [
      { id: 'unconscious', relation: '延续', note: '梦是无意识进入意识的最重要通道。' },
      { id: 'repression', relation: '延续', note: '梦的伪装正是压抑的产物。' },
      { id: 'collective', relation: '分歧', note: '荣格认为梦中还有原型维度，不全是个体压抑的伪装。' },
    ],
  },
  {
    id: 'collective',
    index: '07',
    term: '集体无意识',
    termLatin: 'Kollektives Unbewusstes',
    line: 'crossing',
    era: 'interwar',
    thinker: '荣格',
    period: '1875–1961',
    definition:
      '凌驾于个人无意识之上、由遗传而来的原型结构组成的心理层，在每个人身上重复出现。',
    question: '无意识是属于个人的，还是属于人类共有的？',
    body: [
      '荣格的分裂不只是一次人事冲突。它是对「无意识属于谁」的一次结构性异议。对弗洛伊德，无意识主要是个人生命史的沉积——儿时经验、家庭冲突、被压抑的欲望。对荣格，个人的无意识下面还压着一层更古老的东西：将人类共同的经验形式视为「原型」（如母亲、阴影、自性、英雄），由遗传而非个人经历承载。',
      '从治疗角度看，荣格的说法更宽容：他不再把无意识看成需要释放的压抑储藏室，而看成需要被整合的「互补面」。这与弗洛伊德的立场存在根本差异——对弗洛伊德而言，整合永远伴随着分析、解构和抵抗；对荣格，它更像是自我的扩展与接纳。',
      '为什么把它归入「交汇」？因为它本身是一场精神分析内部的争论，却让「无意识」在哲学上更接近「先于个体的结构」——这恰恰是结构主义后来要走的路。无论荣格本人的理论立场如何，这个问题意识被后来的结构主义者改写为：无意识不是个人的，而是符号系统的。',
    ],
    lever: {
      before: '无意识是个人的、私密的、由个人经历构成。',
      after: '存在一个先于个体的心理结构层，无意识可以是集体性的。',
    },
    works: [{ title: '心理类型', year: '1921' }, { title: '原型与集体无意识', year: '1959' }],
    refs: [
      { id: 'unconscious', relation: '分歧', note: '对弗洛伊德「无意识=个人压抑史」的根本反叛。' },
      { id: 'dream', relation: '对抗', note: '梦不只是个人愿望的伪装，也是原型显现的场所。' },
      { id: 'other', relation: '引出', note: '「先于个体的结构」这条思路，在拉康那里变成了「大他者」。' },
    ],
  },
  {
    id: 'other',
    index: '08',
    term: '大他者',
    termLatin: 'Grand Autre',
    line: 'crossing',
    era: 'structural',
    thinker: '拉康',
    period: '1901–1981',
    definition:
      '象征秩序本身的语言性结构：主体在其中被言说、被规定，却永远无法完全进入的那个位置。',
    question: '如果无意识是像语言一样被结构的，那么「说话的是谁」？',
    body: [
      '拉康的「回到弗洛伊德」并不是复古，而是把弗洛伊德的无意识推进到语言学平面上：「无意识是像语言一样被结构的」。这句话有两个后果。第一，无意识不再是黑暗的冲动，而是一套受规则支配的符号系统，它的运作遵循转喻和隐喻，弗洛伊德称之为置换和凝缩。第二，主体不再是自己的主人：主体在语言中被言说，而不是用语言言说。',
      '大他者（Grand Autre）是这个转向的核心。它不是具体的另一个人，而是语言与符号秩序本身——法律、文化、道德的「他者」。人的欲望总是「他者的欲望」：我们欲望别人欲望我们所是的东西。这是对笛卡尔式自我最彻底的清算：欲望从来不是「我」的。',
      '把精神分析与结构主义连接起来的，就是这个概念。拉康让无意识获得了社会性和结构性的维度，也为后来的意识形态批判（阿尔都塞、齐泽克）提供了工具：无意识不只是心理的，它也是政治的。',
    ],
    lever: {
      before: '主体是语言的主体，能说出自己的欲望。',
      after: '主体被语言结构所构造；欲望是他者的欲望，主体是「被言说的」。',
    },
    works: [
      { title: '文集', year: '1966' },
      { title: '精神分析的四个基本概念', year: '1964' },
    ],
    refs: [
      { id: 'unconscious', relation: '转化', note: '把无意识从「冲动储藏室」重写为「像语言一样被结构的系统」。' },
      { id: 'collective', relation: '对抗', note: '不是原型遗传，而是符号系统的结构优先级。' },
      { id: 'cogito', relation: '对抗', note: '拉康说过：「我思之处我不在」。' },
      { id: 'death-drive', relation: '延续', note: '死亡驱力被重新解读为符号对身体的固定。' },
    ],
  },
  {
    id: 'existence',
    index: '09',
    term: '存在',
    termLatin: 'Dasein / Existenz',
    line: 'philosophy',
    era: 'interwar',
    thinker: '海德格尔',
    period: '1889–1976',
    definition:
      '人的存在不是现成物，而是「在世界之中存在」：带着理解与筹划展开自身，总已先于自身而存在。',
    question: '如果存在的意义先于意识，那无意识的位置在哪里？',
    body: [
      '海德格尔从未认真面对精神分析，却与它严格平行。他的「此在」总是「先于自身」——被筹划、被抛入这个世界、被赋予一个先于反思的结构。这几乎是无意识的哲学等价物：你不是先有一个透明的自我，然后再去面对世界；你总是已经身在某个处境里，某个理解框架里。',
      '两者最显著的分歧在于处理「不可见之物」的道路。弗洛伊德把无意识当作需要被解释、被分析的「内容」；海德格尔认为日常性会以「闲谈」和「沉沦」掩盖本真的存在，但存在本身的展开不是分析，而是「倾听」和「居留」。一个要破译，一个要驻留。',
      '这也是为什么海德格尔没能成为精神分析的直接盟友：他的问题意识是本体论的，而精神分析关心的是「我怎么了」这样的实践问题。但要说无意识在二十世纪的哲学版图上有什么「平行的声音」，海德格尔是最清晰的一个。',
    ],
    lever: {
      before: '存在可以被意识完全把握，人首先是一个认知者。',
      after: '存在总已先于反思；人被抛入一个先于自己的处境和意义框架。',
    },
    works: [{ title: '存在与时间', year: '1927' }],
    refs: [
      { id: 'cogito', relation: '对抗', note: '此在不是「我思」的主体，而是总已先于自身的在世界之中存在。' },
      { id: 'unconscious', relation: '回应', note: '「先于反思」的结构与无意识平行，但路径不同：解释 vs 倾听。' },
    ],
  },
  {
    id: 'the-other',
    index: '10',
    term: '他者',
    termLatin: 'L\u2019Autre / L\u2019Autrui',
    line: 'philosophy',
    era: 'interwar',
    thinker: '萨特 · 列维纳斯',
    period: '1905–1980 · 1906–1995',
    definition:
      '「他者」既是构成自我的参照（萨特：他人即地狱），也是伦理上先于自我的绝对召唤（列维纳斯：他者的面孔）。',
    question: '他者是威胁自我，还是召唤自我？',
    body: [
      '萨特在《存在与虚无》中给出著名论断：「他人即地狱」。这通常被断章取义为反社会，原意却更精确：他人的凝视（regard）会把我变成一个对象、一个「被看的东西」，从而让我的自由暴露在别人的规定之下。自我在他人面前总是物化的——但这种物化也是我理解自身的方式之一。',
      '列维纳斯则走向了相反方向：他者不是威胁，而是对「我」的先在召唤，「他者的面孔」是一种无限的要求，无法被我的整全性消化。伦理发生在自我之前。',
      '回看精神分析，这条线变得清楚：弗洛伊德的「超我」其实已经内化了一个他者——父母的权威、社会的禁令。而这个「内在的他者」与「外在的他者」之间的张力，正是拉康用来重述精神分析的材料。如果无意识是他者的话语，那么「他者」这个哲学问题就是它的伦理面孔。',
    ],
    lever: {
      before: '他人只是我认识与利用的对象。',
      after: '他者构成自我、也召唤自我：自我与他者的关系先于自我本身。',
    },
    works: [
      { title: '存在与虚无', year: '1943' },
      { title: '总体与无限', year: '1961' },
    ],
    refs: [
      { id: 'cogito', relation: '对抗', note: '他人不是一个可被纳入的「对象」，而是建构自我凝视的力量。' },
      { id: 'other', relation: '引出', note: '萨特与列维纳斯的他者问题，在拉康那里变成了「谁是语言的发出者」。' },
      { id: 'collective', relation: '回应', note: '集体无意识同样坚持「先于个体的东西」——只是换了伦理的维度。' },
    ],
  },
  {
    id: 'power',
    index: '11',
    term: '权力/知识',
    termLatin: 'Pouvoir / Savoir',
    line: 'crossing',
    era: 'structural',
    thinker: '福柯',
    period: '1926–1984',
    definition:
      '知识并非中立发现，而是在特定权力布置（dispositif）中生产出来；权力本身也是生产性的，而非仅仅压抑性的。',
    question: '如果性不是被压抑的自然物，而是被权力生产出来的，那「性学三论」的框架还成立吗？',
    body: [
      '《性史》（1976）第一卷《认知的意志》几乎是对《性学三论》的正面回应。弗洛伊德说：性被压抑，压抑它的是文明，精神分析的任务是让被压抑的东西被言说。福柯说：不，近代社会不是「压抑」性，而是「生产」性——通过医学、法律、人口统计、教育，把性变成一个需要被说出、被分类、被管理的东西。性不是一个等待释放的自然物，而是一个被建构的范畴。',
      '这一批判不是要取消精神分析，而是给它换地基：精神分析之所以能运作，正是因为它嵌在这套「让其被言说」的装置里。弗洛伊德的诊所（躺椅、自由联想、医患关系）是一种典型的权力-知识配置——它让人不断地说，以取得「真相」。',
      '福柯与拉康的关系微妙而复杂：拉康曾邀请福柯到研讨班讲课，福柯本人也读过拉康。他们共享的洞见是「主体是被构造的」，分歧在于构造它的是什么——语言的他者，还是权力的装置。这个分歧本身，就是「无意识」在二十世纪下半叶分裂为两条路线的地方。',
    ],
    lever: {
      before: '性是被压抑的自然本能，精神分析负责解放它。',
      after: '性是权力-知识生产出来的范畴；精神分析也处在这套装置之中。',
    },
    works: [{ title: '性史：认知的意志', year: '1976' }],
    refs: [
      { id: 'unconscious', relation: '对抗', note: '精神分析本身也被列为一种生产性的知识装置。' },
      { id: 'other', relation: '对抗', note: '不是「语言的」他者，而是「权力装置」在构造主体。' },
      { id: 'drive', relation: '回应', note: '回应并反转了《性学三论》：性不是本能，而是部署。' },
    ],
  },
  {
    id: 'death-drive',
    index: '12',
    term: '死亡驱力',
    termLatin: 'Thanatos / Todestrieb',
    line: 'psychoanalysis',
    era: 'interwar',
    thinker: '弗洛伊德 · 马尔库塞 · 拉康',
    period: '1856–1979',
    definition:
      '一种朝向瓦解、回到无机状态、重复而不求满足的冲力；1920 年后成为驱力理论的另一半。',
    question: '为什么人会被不快乐的东西反复吸引？',
    body: [
      '1920 年的《超越快乐原则》是弗洛伊德理论最暧昧也最有力量的一步。他观察那些复从而不是消除创伤的梦：战争神经症患者一遍遍重演灾难，儿童的「Fort-Da」游戏一遍遍消失又出现。快乐原则无法解释这种「强迫重复」——它不带来愉悦，却顽固地持续。',
      '弗洛伊德因此推断存在一种更基本的驱力：它不追求满足，而追求回到先前状态、无机状态，也就是死亡。生命于是被理解为生之驱力（爱欲）与死亡驱力之间的永恒斗争。',
      '马尔库塞在《爱欲与文明》（1955）中把它转化成了文明批判：现代社会以「多余压抑」阻止爱欲的展开，把死亡驱力转化为生产与破坏。他的方案是让爱欲重新占据主导。',
      '拉康则把它彻底重写：死亡驱力不是「求死本能」，而是「符号对身体的固着」——一种对既定位置的顽固坚持（比如症状）。这也许是最富哲学意味的解读：死亡驱力是主体的「不在场证据」，是整个结构里那个无法被整合、无法被满足的点。',
    ],
    lever: {
      before: '人总是追求快乐、回避痛苦。',
      after: '人身上还有一种不求满足、反复回到不快乐之处的驱力：快乐原则不是一切。',
    },
    works: [
      { title: '超越快乐原则', year: '1920' },
      { title: '爱欲与文明', year: '1955' },
    ],
    refs: [
      { id: 'drive', relation: '延续', note: '驱力理论的第二期：从「追求满足」裂变为「重复与瓦解」。' },
      { id: 'unconscious', relation: '延续', note: '无意识最黑暗的一层：不以满足为目标的冲力。' },
      { id: 'power', relation: '回应', note: '权力装置如何把死亡驱力转化为社会性的破坏与顺从。' },
    ],
  },
]

// Merge the quotable line, reading list and keywords from enrichment.ts.
// Done here (rather than by hand in every record) so the two files can grow
// independently; enrichment imports only the *type*, so there is no cycle.
for (const c of concepts) {
  const extra = enrichment[c.id]
  if (!extra) continue
  c.quote = extra.quote
  c.furtherReading = extra.furtherReading
  c.keywords = extra.keywords
}

export const getConcept = (id: string) => concepts.find((c) => c.id === id)
