import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const links = [
  { to: '/', label: '首页', en: 'Index' },
  { to: '/archive', label: '档案', en: 'Atlas' },
  { to: '/figures', label: '人物', en: 'Figures' },
  { to: '/timeline', label: '编年', en: 'Chronology' },
  { to: '/glossary', label: '术语', en: 'Glossary' },
  { to: '/essays', label: '文章', en: 'Essays' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [read, setRead] = useState(0)

  useEffect(() => {
    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        setScrolled(window.scrollY > 24)
        setRead(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
      })
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-500 ${
        scrolled
          ? 'border-line bg-paper/92 backdrop-blur-[2px]'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 md:px-10">
        <Link to="/" className="group flex shrink-0 items-baseline gap-3">
          <span className="font-display text-[1.05rem] tracking-wide text-ink">
            无意识图谱
          </span>
          <span className="label-mono hidden text-mute-soft transition-colors group-hover:text-crimson lg:inline">
            Unbewusstes Atlas
          </span>
        </Link>

        <nav className="-mr-1 flex items-center gap-3.5 sm:gap-5 md:gap-6 xl:gap-8" aria-label="主导航">
          {links.map((l) => {
            const active = l.to === '/' ? pathname === '/' : pathname.startsWith(l.to)
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`group relative flex items-baseline gap-2 pb-1 text-[0.88rem] transition-colors duration-300 md:text-[0.95rem] ${
                  active ? 'text-crimson' : 'text-mute hover:text-ink'
                }`}
              >
                <span>{l.label}</span>
                <span className="label-mono hidden text-[0.6rem] text-mute-soft xl:inline">
                  {l.en}
                </span>
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-crimson transition-all duration-500 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full group-hover:bg-mute'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            )
          })}
        </nav>
      </div>

      {/* reading progress — a hairline, not a chrome bar */}
      <div
        className="absolute inset-x-0 bottom-[-1px] h-px overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="h-full origin-left bg-crimson/70 transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${read})` }}
        />
      </div>
    </header>
  )
}
