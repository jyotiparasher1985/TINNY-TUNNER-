import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { Pin, Phone, WhatsApp } from './Icons'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/academics', label: 'Academics' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/notices', label: 'Notices' },
  { to: '/contact', label: 'Contact' },
]

/** Circular school badge — used in the header and footer. */
export function BrandMark({ className = 'brand__mark' }) {
  return (
    <img
      className={className}
      src="/images/logo.png"
      srcSet="/images/logo.png 1x, /images/logo@2x.png 2x"
      width="62"
      height="62"
      alt={`Tiny Turners Play Way School, Barwala — logo`}
      loading="eager"
      decoding="async"
    />
  )
}

export default function Header() {
  const { settings } = useSite()
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const wa = `https://wa.me/${settings.whatsapp}`

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="topbar">
        <div className="container topbar__inner">
          <a className="topbar__item" href={`tel:${settings.phone}`}>
            <Phone size={15} />
            {settings.phone}
          </a>
          <span className="topbar__item topbar__address">
            <span className="topbar__sep">|</span>
            <Pin size={15} />
            {settings.address}
          </span>
          <a className="topbar__item" href={wa} target="_blank" rel="noreferrer">
            <WhatsApp size={15} />
            WhatsApp
          </a>
        </div>
      </div>

      <header className={`site-header${stuck ? ' is-stuck' : ''}`}>
        <div className="container site-header__inner">
          <button
            className={`nav-toggle${open ? ' is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`main-nav${open ? ' is-open' : ''}`}>
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `main-nav__link${isActive ? ' is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
            <Link className="btn btn--sm btn--gold main-nav__cta" to="/admissions">
              Apply Now
            </Link>
          </nav>

          {/* School logo — pinned to the top right */}
          <Link className="brand" to="/" aria-label="Tiny Turners Play Way School — home">
            <BrandMark />
            <span className="brand__text">
              <span className="brand__name">{settings.school_name}</span>
              <span className="brand__tag">{settings.tagline}</span>
            </span>
          </Link>
        </div>
      </header>
    </>
  )
}