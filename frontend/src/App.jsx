import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import Layout from './components/Layout'
import PosterSplash from './components/PosterSplash'
import { SiteProvider } from './context/SiteContext'

import Home from './pages/Home'
import About from './pages/About'
import Academics from './pages/Academics'
import Facilities from './pages/Facilities'
import Gallery from './pages/Gallery'
import Notices from './pages/Notices'
import Admissions from './pages/Admissions'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import LegalPage, { PRIVACY_SECTIONS, TERMS_SECTIONS } from './pages/LegalPages'

import NotFound from './pages/NotFound'

/** Handles in-page anchors such as /academics#programmes */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <SiteProvider>
      {/* Admission poster — shows on every visit, dismissed with the cross */}
      <PosterSplash />
      <ScrollManager />
      <Routes>
        {/* Admin dashboard uses its own shell */}
        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/academics" element={<Academics />} />
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/notices" element={<Notices />} />
                <Route path="/admissions" element={<Admissions />} />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/privacy"
                  element={
                    <LegalPage
                      title="Privacy policy"
                      lead="How we collect, use and protect the information you share with us."
                      updated="August 2026"
                      sections={PRIVACY_SECTIONS}
                    />
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <LegalPage
                      title="Terms & conditions"
                      lead="The terms that apply to admission and attendance at Tiny Turners."
                      updated="August 2026"
                      sections={TERMS_SECTIONS}
                    />
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </SiteProvider>
  )
}