import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { BrandMark } from './Header'
import { ArrowRight } from './Icons'

/**
 * Shared closing call-to-action band, with the school badge as the third
 * place the logo appears (header, footer, here).
 */
export default function CtaBand({
  title,
  accent,
  lead,
  primary = { label: 'Apply for admission', to: '/admissions' },
  secondary,
}) {
  const { settings } = useSite()

  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <div className="cta-band__body">
          <BrandMark className="cta-band__logo" />
          <div>
            <h2>
              {title} {accent && <span className="accent">{accent}</span>}
            </h2>
            {lead && <p>{lead}</p>}
          </div>
        </div>

        <div className="cta-band__actions">
          <Link className="btn btn--lg btn--gold" to={primary.to}>
            {primary.label} <ArrowRight className="arrow" />
          </Link>
          {secondary?.href ? (
            <a className="btn btn--lg btn--white" href={secondary.href}>
              {secondary.label}
            </a>
          ) : secondary ? (
            <Link className="btn btn--lg btn--white" to={secondary.to}>
              {secondary.label}
            </Link>
          ) : (
            <a className="cta-band__contact" href={`tel:${settings.phone}`}>
              Call {settings.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}