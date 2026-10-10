import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

/** Scrolls to the top on every route change. */
function ScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])
  return null
}

export default function Layout({ children }) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}

/** Compact hero used at the top of inner pages. */
export function PageHero({ title, lead, breadcrumb = [], children }) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {breadcrumb.map((crumb) => (
            <span key={crumb}>
              <span aria-hidden="true"> / </span>
              {crumb}
            </span>
          ))}
        </nav>
        <h1>{title}</h1>
        {lead && <p>{lead}</p>}
        {children}
      </div>
    </section>
  )
}