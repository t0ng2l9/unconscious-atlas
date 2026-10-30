import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Archive from './pages/Archive'
import ConceptPage from './pages/ConceptPage'
import Essays from './pages/Essays'
import EssayPage from './pages/EssayPage'

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <ScrollReset />
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/archive/:id" element={<ConceptPage />} />
          <Route path="/essays" element={<Essays />} />
          <Route path="/essays/:slug" element={<EssayPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
