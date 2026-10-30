import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div>
          <p className="font-display text-[1.1rem] tracking-wide text-ink">无意识图谱</p>
          <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-mute">
            弗洛伊德不是哲学的对立面，而是哲学终于开始听自己说话。
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="label-mono text-mute-soft">档案</span>
          <Link to="/archive" className="text-sm text-mute transition-colors hover:text-crimson">
            概念索引
          </Link>
          <Link to="/archive?line=philosophy" className="text-sm text-mute transition-colors hover:text-crimson">
            哲学线
          </Link>
          <Link to="/archive?line=psychoanalysis" className="text-sm text-mute transition-colors hover:text-crimson">
            精神分析线
          </Link>
          <Link to="/archive?line=crossing" className="text-sm text-mute transition-colors hover:text-crimson">
            交汇点
          </Link>
          <Link to="/timeline" className="text-sm text-mute transition-colors hover:text-crimson">
            编年
          </Link>
          <Link to="/glossary" className="text-sm text-mute transition-colors hover:text-crimson">
            术语表
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <span className="label-mono text-mute-soft">文章</span>
          <Link to="/essays" className="text-sm text-mute transition-colors hover:text-crimson">
            全部文章
          </Link>
          <Link to="/essays/feminine" className="text-sm text-mute transition-colors hover:text-crimson">
            弗洛伊德与女性
          </Link>
          <Link to="/essays/china" className="text-sm text-mute transition-colors hover:text-crimson">
            精神分析与中国
          </Link>
          <span className="mt-4 label-mono text-mute-soft">Edition</span>
          <span className="font-mono text-xs tracking-wider text-mute">
            No. 02 · 个人作品
          </span>
        </div>
      </div>
      <div className="border-t border-line-soft">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-baseline justify-between gap-2 px-5 py-5 md:px-10">
          <span className="label-mono text-mute-soft">无意识图谱 · A personal archive</span>
          <span className="label-mono text-mute-soft">仅供展示 · 2026</span>
        </div>
      </div>
    </footer>
  )
}
