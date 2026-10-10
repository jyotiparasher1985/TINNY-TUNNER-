import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { BrandMark } from './Header'
import { Mail, Phone, Pin, WhatsApp } from './Icons'

export default function Footer() {
  const { settings } = useSite()
  const wa = `https://wa.me/${settings.whatsapp}`
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <BrandMark />
              <span className="brand__text">
                <span className="brand__name">{settings.school_name}</span>
                <span className="brand__tag">{settings.tagline}</span>
              </span>
            </div>
            <p style={{ maxWidth: '34ch' }}>
              A safe, joyful and nurturing early years school where children learn, explore, play
              and grow with confidence.
            </p>
            <p style={{ marginTop: 14, fontSize: '0.86rem' }}>Established {settings.established}</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/academics">Academics</Link>
              </li>
              <li>
                <Link to="/facilities">Facilities</Link>
              </li>
              <li>
                <Link to="/admissions">Admissions</Link>
              </li>
              <li>
                <Link to="/gallery">Gallery</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Important</h4>
            <ul className="footer-links">
              <li>
                <Link to="/notices?kind=EVENT">Events</Link>
              </li>
              <li>
                <Link to="/notices">News &amp; notices</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms &amp; conditions</Link>
              </li>
              <li>
                <Link to="/admin">Admin dashboard</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <div className="footer-contact">
              <a className="footer-contact__row" href={`tel:${settings.phone}`}>
                <Phone size={16} />
                {settings.phone}
              </a>
              <a className="footer-contact__row" href={wa} target="_blank" rel="noreferrer">
                <WhatsApp size={16} />
                WhatsApp us
              </a>
              {settings.email && (
                <a className="footer-contact__row" href={`mailto:${settings.email}`}>
                  <Mail size={16} />
                  {settings.email}
                </a>
              )}
              <a
                className="footer-contact__row"
                href={settings.map_url}
                target="_blank"
                rel="noreferrer"
              >
                <Pin size={16} />
                {settings.address}
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {settings.school_name} {settings.tagline}. All Rights Reserved.
          </span>
          <span className="footer-bottom__tag">Made for little beginnings</span>
        </div>
      </div>

      <a
        className="floating-wa"
        href={wa}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <WhatsApp size={26} />
      </a>
    </footer>
  )
}