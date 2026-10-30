// Supplementary content attached to each concept by id: a quotable line and
// reading suggestions. Kept separate from concepts.ts so the main data file
// stays readable; concepts.ts merges these in after the array is defined.
export interface Enrichment {
  quote: { text: string; source: string }
  furtherReading: { title: string; author: string; note: string }[]
  keywords: string[]
}

export const enrichment: Record<string, Enrichment> = {
  cogito: {
    quote: { text: '我要把「我」从一切可怀疑之物中单独救出来，好让它成为唯一不可怀疑的地基。', source: '《第一哲学沉思集》大意' },
    furtherReading: [
      { title: '《笛卡尔哲学沉思》', author: '伯纳德·威廉斯', note: '把六个沉思逐条读透，它顺便解释了「透明主体」为什么从一开始就不牢靠。' },
      { title: '《主体性之后》', author: '阿兰·图海纳', note: '追索从笛卡尔到当代的主体谱系，适合作为整张图谱的对照。' },
    ],
    keywords: ['我思故我在', '主体', '理性主义', '怀疑论', '身心二元论'],
  },
  will: {
    quote: { text: '人以为自己被认识照亮，其实只是被意志拖着走时说出的那部分理由。', source: '《作为意志和表象的世界》大意' },
    furtherReading: [
      { title: '《叔本华与精神分析》', author: '托马斯·曼', note: '文学家的视角，一次把「意志」和「驱力」摆在一起看的尝试。' },
      { title: '《自传研究》', author: '弗洛伊德', note: '弗洛伊德自己承认叔本华是先行者的地方，语气很值得玩味。' },
    ],
    keywords: ['意志', '盲目冲动', '悲观主义', '表象', '欲望'],
  },
  unconscious: {
    quote: { text: '被压抑的东西不是消失了，它只是被安置在一个不允许它说话的位置上。', source: '《压抑》(1915) 大意' },
    furtherReading: [
      { title: '《精神分析引论》', author: '弗洛伊德', note: '最平易的入口，讲座体，适合第一次面对「无意识」这个概念的人。' },
      { title: '《无意识》', author: '弗洛伊德', note: '1915 年那篇论文，是定义无意识运作规则的硬核文本。' },
      { title: '《如何阅读拉康》', author: '斯拉沃热·齐泽克', note: '把拉康版的无意识讲得比拉康本人清楚，也顺手把弗洛伊德重新安置了一遍。' },
    ],
    keywords: ['无意识', '地形学', '本我', '审查', '被压抑者的回归'],
  },
  repression: {
    quote: { text: '压抑不是忘记，而是一种持续的、需要不断耗费力气的按住。', source: '《压抑》(1915)' },
    furtherReading: [
      { title: '《压抑、症状与焦虑》', author: '弗洛伊德', note: '三篇连读，能看到一个机制如何从「按住」变成「生产」。' },
      { title: '《病态社会与压抑》', author: '马尔库塞（相关章节）', note: '把压抑从个人层面推到社会层面，是后面福柯工作的前奏。' },
    ],
    keywords: ['压抑', '防御机制', '妥协形成', '焦虑'],
  },
  drive: {
    quote: { text: '驱力没有正确的对象，它只有目标；而目标，是可以被各种方式迂回抵达的。', source: '《性学三论》大意' },
    furtherReading: [
      { title: '《性学三论》', author: '弗洛伊德', note: '这件作品至今仍让人不适，正因为它拆掉了「正常」与「反常」之间那道看起来天然的分界。' },
      { title: '《性史：认知的意志》', author: '米歇尔·福柯', note: '从另一侧抵达同一问题：性不是等待释放的自然物，而是被生产出来的范畴。' },
    ],
    keywords: ['驱力', '爱欲', '性', '力比多', '婴儿性欲', '升华'],
  },
  dream: {
    quote: { text: '梦不是密码，它是一份被反复改写的草稿——而改动本身，就是无意识写下的内容。', source: '《梦的解析》大意' },
    furtherReading: [
      { title: '《梦的解析》', author: '弗洛伊德', note: '选读第二章「梦的解析方法」，一整个分析方法在那里诞生。' },
      { title: '《记忆、梦与思想》', author: '卡尔·荣格', note: '从「原型」而非「个体压抑」角度解梦，与弗洛伊德构成对照。' },
    ],
    keywords: ['显梦', '隐梦', '凝缩', '置换', '愿望满足', '梦的工作'],
  },
  collective: {
    quote: { text: '个人无意识的下面，还压着一层从来不属于任何个人、却属于所有人共同经验的东西。', source: '《原型与集体无意识》大意' },
    furtherReading: [
      { title: '《心理学与宗教》', author: '卡尔·荣格', note: '荣格把精神分析引向宗教与神话的入口，也是他与弗洛伊德分道扬镳的路线图。' },
      { title: '《弗洛伊德与荣格的通信》', author: '弗洛伊德、荣格', note: '看一场决裂如何逐封信地发生，比任何二手叙述都更具体。' },
    ],
    keywords: ['集体无意识', '原型', '阴影', '自性', '个体化'],
  },
  other: {
    quote: { text: '无意识不是藏在我里面的东西，而是我说话时那个不属于我的语言。', source: '《精神分析的四个基本概念》大意' },
    furtherReading: [
      { title: '《拉康选集》', author: '雅克·拉康', note: '读不懂是正常的；先读《镜像阶段》那一篇，至少能抓住一个动作。' },
      { title: '《精神分析的四个基本概念》', author: '雅克·拉康', note: '研讨班第十一讲，最接近「可读」的拉康。' },
    ],
    keywords: ['大他者', '象征秩序', '镜像阶段', '主体', '欲望'],
  },
  existence: {
    quote: { text: '此在总已先于自身：在「我」开口之前，它已经被抛入一个理解之中。', source: '《存在与时间》大意' },
    furtherReading: [
      { title: '《存在与时间》', author: '马丁·海德格尔', note: '选读「在世界之中存在」一节，感受与「无意识」平行的那个结构。' },
      { title: '《海德格尔与精神分析》', author: '（相关论文合集）', note: '讨论两者是真正同路，还是只是彼此的镜像。' },
    ],
    keywords: ['此在', '在世存在', '被抛', '在先性', '沉沦'],
  },
  'the-other': {
    quote: { text: '他者的面孔不是另一个对象，而是我无法消化的那道要求。', source: '《总体与无限》大意' },
    furtherReading: [
      { title: '《存在与虚无》', author: '让-保罗·萨特', note: '「他人即地狱」那一节，读原文才知道他说的是「被看」。' },
      { title: '《总体与无限》', author: '埃马纽埃尔·列维纳斯', note: '伦理在先于存在这一论断的奠基文本，门槛不低但值得。' },
    ],
    keywords: ['他者', '凝视', '伦理', '面孔', '主体间性'],
  },
  power: {
    quote: { text: '近代社会没有压抑性，它生产性——把性变成需要被说出、被分类、被管理的东西。', source: '《性史》第一卷大意' },
    furtherReading: [
      { title: '《性史：认知的意志》', author: '米歇尔·福柯', note: '第六章「性科学的部署」是直接对精神分析的回应。' },
      { title: '《规训与惩罚》', author: '米歇尔·福柯', note: '理解「权力是生产性的」这一命题的另一条路径。' },
    ],
    keywords: ['权力', '知识', '部署', '规训', '生命政治'],
  },
  'death-drive': {
    quote: { text: '人身上有一种不求满足的冲动：它不奔向快乐，只是想回到某种更早的状态。', source: '《超越快乐原则》大意' },
    furtherReading: [
      { title: '《超越快乐原则》', author: '弗洛伊德', note: '仅 60 余页，却是弗洛伊德最具哲学野心的一份文本。' },
      { title: '《爱欲与文明》', author: '赫伯特·马尔库塞', note: '把死亡驱力读成文明批判的工具，是法兰克福学派的汇合点。' },
    ],
    keywords: ['死亡驱力', '重复强迫', '爱欲', '升华', '文明'],
  },
  'desire-machine': {
    quote: { text: '欲望不是剧场，而是工厂。', source: '《反俄狄浦斯》大意' },
    furtherReading: [
      { title: '《反俄狄浦斯》', author: '德勒兹、加塔利', note: '难读，但前两章足以改变你对「欲望」这个词的直觉。' },
      { title: '《千高原》', author: '德勒兹、加塔利', note: '不必读完；从「块茎」那一章开始即可。' },
    ],
    keywords: ['欲望机器', '俄狄浦斯', '反精神分析', '块茎', '解域化'],
  },
  ideology: {
    quote: { text: '他们不知道自己正在做的事，但他们正在做。', source: '《意识形态与国家机器》大意' },
    furtherReading: [
      { title: '《意识形态与国家机器》', author: '路易·阿尔都塞', note: '二十几页的小文，却重写了「主体是如何被召唤的」。' },
      { title: '《意识形态的崇高客体》', author: '斯拉沃热·齐泽克', note: '把拉康和马克思缝在一起，也是在教你如何看穿「明知故犯」。' },
    ],
    keywords: ['意识形态', '召唤', '主体', '虚假意识', '崇高客体'],
  },
  alienation: {
    quote: { text: '工人创造的东西，最终站到了工人对面。', source: '《1844 年经济学哲学手稿》大意' },
    furtherReading: [
      { title: '《1844 年经济学哲学手稿》', author: '卡尔·马克思', note: '异化理论的原型文本，短而激烈。' },
      { title: '《精神现象学》（「自我意识」章）', author: '黑格尔', note: '读懂「主奴辩证法」，才能理解后来所有关于「被支配」的讨论。' },
    ],
    keywords: ['异化', '劳动', '对象化', '主奴辩证法', '自我意识'],
  },
  gender: {
    quote: { text: '一个人不是生下来就是女人，她是变成女人的。', source: '《第二性》' },
    furtherReading: [
      { title: '《第二性》', author: '西蒙娜·德·波伏娃', note: '第二卷写「神话」与「处境」的部分最锋利。' },
      { title: '《性别麻烦》', author: '朱迪斯·巴特勒', note: '对「性别表演性」的奠基性论述，同时对精神分析逐一回应。' },
    ],
    keywords: ['性别', '表演性', '他者', '内化', '建构'],
  },
}
