import type { Line } from './concepts'

export type Era =
  | 'classical'
  | 'interwar'
  | 'structural'
  | 'postwar'
  | 'contemporary'

export interface Figure {
  id: string
  name: string
  nameLatin: string
  /** lifespan or active range, e.g. '1844–1900' */
  years: string
  country: string
  line: Line
  era: Era
  /** one tag that says what they are known for */
  tagline: string
  /** why this person belongs in a book about the unconscious */
  why: string
  /** the single idea to walk away with */
  keyIdea: string
  works: { title: string; year: string }[]
  /** related concept ids */
  concepts: string[]
  /** who they argued with or built on */
  dialogue: { name: string; note: string }[]
}

export const eraLabel: Record<Era, string> = {
  classical: '奠基年代',
  interwar: '两次大战之间',
  structural: '结构主义年代',
  postwar: '战后批判',
  contemporary: '当代',
}

export const figures: Figure[] = [
  // ───────────────────────── 尼采：无意识的另一个源头 ─────────────────────────
  {
    id: 'nietzsche',
    name: '尼采',
    nameLatin: 'Friedrich Nietzsche',
    years: '1844–1900',
    country: '德意志',
    line: 'philosophy',
    era: 'classical',
    tagline: '把「真实的我」拆成一台欲望与权力的机器',
    why: '弗洛伊德反复说自己是「尼采的读者」。如果无意识有一个哲学原型，尼采那张牌一定在桌上：他先于弗洛伊德宣称「没有什么内在事实」，只有解释；先于所有人宣布「意识只是工具，而指挥它的是一个我们不知道的身体」。',
    keyIdea: '「身体是一个大理性，一个灵魂只是这大理性的一种小理性。」——意识不是主人，只是身体为了自我保护而发明的简化装置。',
    works: [
      { title: '快乐的科学', year: '1882' },
      { title: '查拉图斯特拉如是说', year: '1883–1885' },
      { title: '道德的谱系', year: '1887' },
    ],
    concepts: ['will', 'unconscious', 'drive'],
    dialogue: [
      { name: '叔本华', note: '尼采把叔本华的「意志」从悲观主义里解放出来，改成「求权力」的力量。' },
      { name: '弗洛伊德', note: '弗洛伊德在自传里承认尼采的直觉与精神分析「惊人地接近」，但坚持要用临床证据取代散文诗。' },
    ],
  },

  // ───────────────────────── 文学：卡夫卡 ─────────────────────────
  {
    id: 'kafka',
    name: '卡夫卡',
    nameLatin: 'Franz Kafka',
    years: '1883–1924',
    country: '奥匈帝国',
    line: 'crossing',
    era: 'classical',
    tagline: '把「罪感」写成一种无法申诉的程序',
    why: '《审判》里的 K 不知道罪名，《城堡》里的 K 永远进不了门。这两部小说是关于「超我」最准确的寓言：一种你不记得自己何时接受、却永远无法上诉的审判。弗洛伊德读卡夫卡读得很认真，卡夫卡却更愿意谈自己的失眠和写作的强迫性。',
    keyIdea: '「一个笼子在寻找一只鸟」——不是人在追求目标，是结构在寻找可以容纳它的个体。',
    works: [
      { title: '审判', year: '1925（遗作）' },
      { title: '城堡', year: '1926（遗作）' },
      { title: '饥饿艺术家', year: '1922' },
    ],
    concepts: ['the-other', 'unconscious', 'power'],
    dialogue: [
      { name: '弗洛伊德', note: '《审判》与《俄狄浦斯》被放在一起读：罪感先于罪行，这正是超我的结构。' },
      { name: '福柯', note: '后来福柯的「规训」几乎把卡夫卡的世界制度化了：外部的审判变成了内部的自我监视。' },
    ],
  },

  // ───────────────────────── 法兰克福学派 ─────────────────────────
  {
    id: 'adorno',
    name: '阿多诺',
    nameLatin: 'Theodor W. Adorno',
    years: '1903–1969',
    country: '德意志',
    line: 'crossing',
    era: 'postwar',
    tagline: '用精神分析解释法西斯主义的吸引力',
    why: '1947 年的《权威人格研究》把弗洛伊德的概念搬进了社会调查：为什么那么多人愿意把自由交出去？阿多诺把答案放在「无意识的怨恨」——一种被压抑的愤怒，最终转向弱者，而不是强者。',
    keyIdea: '「奥斯维辛之后，写诗是野蛮的。」这句被过度引用的话，原意指向：一种文化可以在健全的自我意识下完成屠杀，说明「自我」并不足以抵御结构。',
    works: [
      { title: '权威人格研究', year: '1950' },
      { title: '否定的辩证法', year: '1966' },
    ],
    concepts: ['power', 'death-drive', 'drive'],
    dialogue: [
      { name: '马尔库塞', note: '同为法兰克福学派，马尔库塞更乐观地把爱欲当成解放力量，阿多诺对此保持怀疑。' },
      { name: '弗洛伊德', note: '阿多诺对弗洛伊德又敬又疑：他借用了无意识，却不接受把社会问题还原成个人心理。' },
    ],
  },
  {
    id: 'benjamin',
    name: '本雅明',
    nameLatin: 'Walter Benjamin',
    years: '1892–1940',
    country: '德意志',
    line: 'crossing',
    era: 'interwar',
    tagline: '记忆不是档案，而是不断被重新照亮的碎片',
    why: '本雅明的「辩证意象」与弗洛伊德的「梦的工作」几乎是同一个动作：把淹没在日常里的碎片，重新摆成一个能被看见的构造。他的「灵光」（Aura）概念，也在讨论同一类问题：一个东西的「在场」是怎么被技术改变掉的。',
    keyIdea: '历史不是一条连续的河流，而是「当下」把过去的碎片点亮。理解过去，就是让它在此刻获得当下的意义。',
    works: [
      { title: '机械复制时代的艺术作品', year: '1936' },
      { title: '历史哲学论纲', year: '1940' },
      { title: '柏林童年', year: '1950' },
    ],
    concepts: ['dream', 'collective', 'power'],
    dialogue: [
      { name: '阿多诺', note: '两人是「法兰克福学派」的两个极端：一个要救赎碎片，一个坚持否定。' },
      { name: '普鲁斯特', note: '本雅明对「不由自主的记忆」的迷恋，与弗洛伊德对「遗忘」的关注是同一种兴趣。' },
    ],
  },
  {
    id: 'marcuse',
    name: '马尔库塞',
    nameLatin: 'Herbert Marcuse',
    years: '1898–1979',
    country: '德意志 / 美国',
    line: 'crossing',
    era: 'postwar',
    tagline: '把压抑从心理问题改写成文明的账单',
    why: '《爱欲与文明》把弗洛伊德的两个核心概念——压抑与死亡驱力——接上了社会批判：现代社会的问题不是压抑太少，而是「多余压抑」太多。他区分了「基本压抑」（维持文明所必需）与「多余压抑」（为维持统治而设），这个区分至今仍是批判理论最锋利的一把刀。',
    keyIdea: '人类不是天生要受苦才结实的。文明可以在不制造多余压抑的条件下运转，只是它没有这样做。',
    works: [
      { title: '爱欲与文明', year: '1955' },
      { title: '单向度的人', year: '1964' },
    ],
    concepts: ['death-drive', 'drive', 'power'],
    dialogue: [
      { name: '弗洛伊德', note: '马尔库塞自称「忠诚的异端」：用弗洛伊德反对弗洛伊德对于文明必然压抑的悲观结论。' },
      { name: '阿多诺', note: '阿多诺认为他太乐观；这场争论至今没有结论。' },
    ],
  },
  {
    id: 'fromm',
    name: '弗洛姆',
    nameLatin: 'Erich Fromm',
    years: '1900–1980',
    country: '德意志 / 美国',
    line: 'crossing',
    era: 'postwar',
    tagline: '逃避自由是一种无意识的选择',
    why: '弗洛姆把精神分析从「治疗个人」推向「理解社会」。《逃避自由》的核心洞见是：自由带来的是孤独和无助，人可能宁愿选择「被支配」，因为服从比不确定更安全。这与弗洛伊德晚期「人为何甘愿服从」的问题一脉相承。',
    keyIdea: '「现代人摆脱了旧的枷锁，却没能获得自由带来的安全。」自由与孤独是同一次出生的双胞胎。',
    works: [
      { title: '逃避自由', year: '1941' },
      { title: '爱的艺术', year: '1956' },
      { title: '为自己的人', year: '1947' },
    ],
    concepts: ['the-other', 'power', 'drive'],
    dialogue: [
      { name: '马尔库塞', note: '马尔库塞在《爱欲与文明》序言里公开批评弗洛姆「把弗洛伊德修正掉了」。' },
      { name: '弗洛伊德', note: '弗洛姆晚年转向「人道主义精神分析」，正是一次对弗洛伊德决定论的修正。' },
    ],
  },

  // ───────────────────────── 阿尔都塞：无意识与意识形态 ─────────────────────────
  {
    id: 'althusser',
    name: '阿尔都塞',
    nameLatin: 'Louis Althusser',
    years: '1918–1990',
    country: '法国',
    line: 'crossing',
    era: 'structural',
    tagline: '重新读马克思，顺带重新读了弗洛伊德',
    why: '阿尔都塞同时读《资本论》与《梦的解析》，得出一个惊人的结论：两者的结构是一样的——马克思揭示「看不见的生产关系」，弗洛伊德揭示「看不见的无意识」。区别在于，马克思主义的无意识不在心灵里，而在生产关系里。他还提出「没有主体的主体性」：人是被结构召唤为「主体」的。',
    keyIdea: '意识形态不是虚假的想法，而是人们「活在他们与真实世界的关系中」的那种想象性方式。',
    works: [
      { title: '保卫马克思', year: '1965' },
      { title: '读《资本论》', year: '1965' },
      { title: '意识形态与国家机器', year: '1970' },
    ],
    concepts: ['other', 'power', 'collective'],
    dialogue: [
      { name: '拉康', note: '阿尔都塞把拉康的结构主义当工具，把「大他者」改写为「意识形态」。' },
      { name: '福柯', note: '两人是「同一场结构主义革命」的两个不同方向：一个重读马克思，一个重写权力。' },
    ],
  },

  // ───────────────────────── 德勒兹与加塔利 ─────────────────────────
  {
    id: 'deleuze',
    name: '德勒兹与加塔利',
    nameLatin: 'Gilles Deleuze & Félix Guattari',
    years: '1925–1995 / 1930–1992',
    country: '法国',
    line: 'crossing',
    era: 'structural',
    tagline: '「反俄狄浦斯」：欲望不是匮乏，是生产',
    why: '《反俄狄浦斯》开篇第一句话就把弗洛伊德放在靶心上：它反对的从来不是无意识本身，而是精神分析的「家庭化」——把一切社会冲突翻译成「爸爸-妈妈-我」的三角关系。德勒兹与加塔利提出「欲望机器」：欲望不追求满足（那是匮乏的欲望），它生产、连接、中断。',
    keyIdea: '「欲望不是剧场，而是工厂。」欲望不来自缺失，它来自满溢。',
    works: [
      { title: '反俄狄浦斯', year: '1972' },
      { title: '千高原', year: '1980' },
    ],
    concepts: ['drive', 'power', 'other'],
    dialogue: [
      { name: '拉康', note: '德勒兹批评拉康把无意识变成了「家庭剧本」，把精神分析变成了「牧师」并强化了它的家庭化。' },
      { name: '弗洛伊德', note: '他们从不否认无意识的存在，只否认「无意识的内容是俄狄浦斯」。' },
    ],
  },

  // ───────────────────────── 女性主义 ─────────────────────────
  {
    id: 'beauvoir',
    name: '波伏娃',
    nameLatin: 'Simone de Beauvoir',
    years: '1908–1986',
    country: '法国',
    line: 'philosophy',
    era: 'postwar',
    tagline: '「女人不是天生的，而是被造成的」',
    why: '波伏娃把存在主义的核心问题——「人如何成为自己」——带进了性别：女性的「内化」不是天然的心理结构，而是社会把「他者」的位置分派给了她。她与精神分析的关系复杂：既用萨特式的自由概念批判「性别本质」，又借用了弗洛伊德的欲望概念。',
    keyIdea: '一个人并非生来就是女人，而是在社会生活过程中逐渐成为女人。',
    works: [
      { title: '第二性', year: '1949' },
      { title: '模糊性的伦理学', year: '1947' },
    ],
    concepts: ['the-other', 'other', 'drive'],
    dialogue: [
      { name: '萨特', note: '波伏娃把萨特的「他者」从哲学命题变成了具体的处境分析，也批判了他对性别问题的盲区。' },
      { name: '弗洛伊德', note: '《第二性》专设一章批判弗洛伊德，认为他的「阴茎羡嫉」把社会处境误读成了生理命运。' },
    ],
  },

  // ───────────────────────── 荣格之外的临床谱系 ─────────────────────────
  {
    id: 'klein',
    name: '克莱因',
    nameLatin: 'Melanie Klein',
    years: '1882–1960',
    country: '奥地利 / 英国',
    line: 'psychoanalysis',
    era: 'interwar',
    tagline: '婴儿也有无意识，而且比想象中更复杂',
    why: '克莱因把精神分析推进到一岁前的婴儿：她用「好乳房 / 坏乳房」「偏执-分裂心位」「抑郁心位」来描述早期心理结构。对弗洛伊德而言这是越界的：他把无意识追溯到童年，克莱因把它追溯到出生后的头几个月。',
    keyIdea: '「投射性认同」：一个人会把无法承受的东西放进另一个人里，然后在那里与它相处。',
    works: [
      { title: '儿童精神分析', year: '1932' },
      { title: '嫉羡与感恩', year: '1957' },
    ],
    concepts: ['repression', 'unconscious', 'drive'],
    dialogue: [
      { name: '弗洛伊德', note: '弗洛伊德承认她的儿童分析，但对她「早期幻想」的激进版本保持距离。' },
      { name: '温尼科特', note: '同在英国学会，却对克莱因的「婴儿攻击性」持温和的反对。' },
    ],
  },
  {
    id: 'winnicott',
    name: '温尼科特',
    nameLatin: 'Donald Winnicott',
    years: '1896–1971',
    country: '英国',
    line: 'psychoanalysis',
    era: 'postwar',
    tagline: '「没有婴儿这回事」',
    why: '温尼科特拒绝把婴儿当作孤立的心理单位：婴儿和心理环境是一体的。他提出「够好的母亲」「过渡性客体」「真自体 / 假自体」，这些词后来几乎接管了中文互联网对「自我」的日常讨论。他的核心不是驱力，而是关系如何让一个人能活得像自己。',
    keyIdea: '「假自体」不是病，而是一种防御性的经营：为了不被拒绝，一个孩子先学会了成为别人期待的样子。',
    works: [
      { title: '游戏与现实', year: '1971' },
      { title: '抱持与解释', year: '1987' },
    ],
    concepts: ['the-other', 'unconscious', 'drive'],
    dialogue: [
      { name: '克莱因', note: '克莱因关注婴儿内部的攻击，温尼科特关注环境能否承受它。' },
      { name: '弗洛伊德', note: '他从弗洛伊德出发，却把「驱力」几乎让位给了「关系」。' },
    ],
  },
  {
    id: 'adler',
    name: '阿德勒',
    nameLatin: 'Alfred Adler',
    years: '1870–1937',
    country: '奥地利',
    line: 'psychoanalysis',
    era: 'classical',
    tagline: '1907 年，第一个从内部正式离开的人',
    why: '阿德勒曾是弗洛伊德非正式小组的核心成员，1911 年带着「权力意志」退出：人的核心动力不是性驱力，而是「自卑与超越」——每个人都在补偿自己的不足。这个说法后来被简化成畅销书里的「个体心理学」，但它的问题意识依然锋利：如果人真的由驱力决定，那改变的动力从哪里来？',
    keyIdea: '症状不是为了满足过去的欲望（弗洛伊德），而是为了指向未来的目标（阿德勒）。',
    works: [
      { title: '自卑与超越', year: '1932' },
      { title: '理解人性', year: '1927' },
    ],
    concepts: ['drive', 'will', 'power'],
    dialogue: [
      { name: '弗洛伊德', note: '弗洛伊德称阿德勒的理论「只是心理学的简化」，阿德勒称弗洛伊德的「性」是唯一的神。' },
      { name: '尼采', note: '阿德勒坦承自己的「权力意志」直接来自尼采——精神分析与哲学的第一次公开接触。' },
    ],
  },

  // ───────────────────────── 当代 ─────────────────────────
  {
    id: 'zizek',
    name: '齐泽克',
    nameLatin: 'Slavoj Žižek',
    years: 'b. 1949',
    country: '斯洛文尼亚',
    line: 'crossing',
    era: 'contemporary',
    tagline: '用拉康读一切：电影、政治、以及你自己的欲望',
    why: '齐泽克把拉康从研讨班里拖出来，放进流行文化和意识形态批判。他的核心命题是「意识形态不是虚假意识，而是在我们行动中生效的无意识」：你一边说自己不相信什么，一边已经按照它生活。这个说法让「无意识」重新变成可以分析公共生活的工具。',
    keyIdea: '「意识形态不是掩盖真相，而是构建了我们所在的现实本身。」',
    works: [
      { title: '意识形态的崇高客体', year: '1989' },
      { title: '少于无', year: '2012' },
    ],
    concepts: ['other', 'power', 'drive'],
    dialogue: [
      { name: '拉康', note: '齐泽克是「后拉康」最有影响力的普及者，也是最常被批评为「过度解读」的人。' },
      { name: '马克思', note: '他的政治立场建立在「意识形态批判」与精神分析的交叉点上。' },
    ],
  },
  {
    id: 'reich',
    name: '赖希',
    nameLatin: 'Wilhelm Reich',
    years: '1897–1957',
    country: '奥地利 / 美国',
    line: 'psychoanalysis',
    era: 'interwar',
    tagline: '把性政治和身体能量接在一起',
    why: '赖希是最激进的弗洛伊德继承人之一：他把「性压抑」直接接到政治压迫上，提出「性格铠甲」——一个人为了抵御欲望，把身体组织成了一套防御姿态。他后来走向了「orgone 能量」的荒谬，最终在美国死于监狱，但前期那些关于「身体记忆」的论述至今仍有回响。',    keyIdea: '压抑不只在心理里，它会被组织进身体：紧绷的肩、屏住的呼吸，都是「无意识」的可见形态。',
    works: [
      { title: '性革命', year: '1929' },
      { title: '性格分析', year: '1933' },
    ],
    concepts: ['drive', 'repression', 'power'],
    dialogue: [
      { name: '马尔库塞', note: '马尔库塞继承了「解放身体」的思路，但去掉了赖希的生物学神秘。' },
      { name: '弗洛伊德', note: '弗洛伊德曾推荐他，后来也因他的政治化而疏远。' },
    ],
  },
]
