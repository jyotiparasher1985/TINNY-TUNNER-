import { Link } from 'react-router-dom'
import { ArrowRight } from '../components/Icons'

export default function NotFound() {
  return (
    <section className="section section--white">
      <div className="container text-center" style={{ maxWidth: 620 }}>
        <span className="eyebrow eyebrow--plain">404</span>
        <h1 style={{ marginBottom: 14 }}>This page took a wrong turn</h1>
        <p style={{ marginBottom: 28 }}>
          The page you are looking for does not exist — or it has been moved. Let&apos;s get you back to
          the fun stuff.
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link className="btn" to="/">
            Back to home <ArrowRight className="arrow" />
          </Link>
          <Link className="btn btn--outline" to="/admissions">
            Apply for admission
          </Link>
        </div>
      </div>
    </section>
  )
}