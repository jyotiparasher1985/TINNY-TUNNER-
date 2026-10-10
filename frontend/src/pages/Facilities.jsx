import { Link } from 'react-router-dom'
import { useApi, useSite } from '../context/SiteContext'
import { PageHero } from '../components/Layout'
import CtaBand from '../components/CtaBand'
import { ArrowRight, Bus, Check, Shield, Users } from '../components/Icons'

const TINTS = ['sky', 'mint', 'gold', 'red']

const SAFETY = [
  { title: 'Verified entry & exit', body: 'Gated campus with sign-in, photo ID for pickup and never an unannounced visitor.' },
  { title: 'CCTV coverage', body: 'Monitored entry points, corridors and both playgrounds.' },
  { title: 'Trained staff', body: 'Every staff member is background-checked and trained in child safety and first aid.' },
  { title: 'Medical room', body: 'On-site first-aid room with a tie-up hospital a few minutes away.' },
  { title: 'Child-safe transport', body: 'GPS-tracked buses with a conductor and a verified attendant on every route.' },
  { title: 'Clean & hygienic', body: 'Daily sanitisation, hand-wash stations and strict food-handling practice.' },
]

const TIMINGS = [
  { time: '8:30 AM', label: 'School opens', note: 'Staff on duty from 8:15 AM.' },
  { time: '8:30 AM – 1:30 PM', label: 'School hours', note: 'Monday to Friday.' },
  { time: '1:30 PM – 3:00 PM', label: 'Extended hours', note: 'Optional, additional monthly charge.' },
  { time: 'Saturday', label: 'Closed', note: 'Weekend events may be announced in advance.' },
]

export default function Facilities() {
  const { settings } = useSite()
  const { data } = useApi('/api/facilities/', [])
  const facilities = data?.facilities || []

  return (
    <>
      <PageHero
        title="Facilities"
        lead="A campus that is safe, bright and thoughtfully built — because the right environment makes learning feel effortless."
        breadcrumb={['Facilities']}
      />

      {/* Facility grid */}
      <section className="section section--white">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our campus</span>
            <h2>Everything your child needs, in one place</h2>
          </div>

          <div className="grid grid--3">
            {facilities.map((f, i) => (
              <article className="card card--hover" key={f.id}>
                {f.image && (
                  <div
                    style={{
                      borderRadius: 'var(--r-md)',
                      overflow: 'hidden',
                      aspectRatio: '16 / 10',
                      marginBottom: 6,
                    }}
                  >
                    <img
                      src={f.image}
                      alt={f.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className={`card__icon card__icon--${TINTS[i % TINTS.length]}`}>
                  <Bus size={22} />
                </div>
                <h3>{f.name}</h3>
                <p>{f.description}</p>
              </article>
            ))}
          </div>

          {facilities.length === 0 && (
            <div className="empty-state">
              <strong>Facility list coming soon</strong>
              <span>Please check back shortly.</span>
            </div>
          )}
        </div>
      </section>

      {/* Safety */}
      <section className="section section--mint">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Safety first</span>
            <h2>Safe &amp; convenient school transport</h2>
            <p>
              Ask our school team about available transport options, routes and arrangements for your
              family.
            </p>
          </div>

          <div className="grid grid--3">
            {SAFETY.map((item, i) => (
              <article className="card" key={item.title}>
                <div className={`card__icon card__icon--${TINTS[i % TINTS.length]}`}>
                  <Shield />
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>

          <ul className="checks" style={{ justifyContent: 'center', marginTop: 26 }}>
            <li>
              <Check size={17} /> Child safety
            </li>
            <li>
              <Users size={17} /> Trained drivers
            </li>
            <li>
              <Bus size={17} /> Convenient routes
            </li>
          </ul>
        </div>
      </section>

      {/* Transport split */}
      <section className="section section--white">
        <div className="container split split--reverse">
          <div className="split__media">
            <img
              src="/images/hero-classroom.jpg"
              alt="A teacher welcoming children into the classroom"
            />
          </div>
          <div className="stack-16">
            <span className="eyebrow">Getting here</span>
            <h2>How our buses run</h2>
            <ul className="checks">
              <li>
                <Check size={17} /> Fixed routes across Barwala, Panchkula and nearby sectors
              </li>
              <li>
                <Check size={17} /> One bus and one conductor per route
              </li>
              <li>
                <Check size={17} /> Route card shared with every family each term
              </li>
              <li>
                <Check size={17} /> Flexible drop points within an assigned route
              </li>
              <li>
                <Check size={17} /> Late pickup arrangement on request
              </li>
            </ul>
            <div>
              <Link className="btn" to="/contact">
                Enquire about transport <ArrowRight className="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Timings */}
      <section className="section section--cream">
        <div className="container split">
          <div className="stack-16">
            <span className="eyebrow">Daily timings</span>
            <h2>When we are open</h2>
            <p>
              Extended hours are available for working parents at an additional monthly charge, subject
              to availability.
            </p>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="fee-table">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Detail</th>
                  <th scope="col">Note</th>
                </tr>
              </thead>
              <tbody>
                {TIMINGS.map((row) => (
                  <tr key={row.label}>
                    <td style={{ whiteSpace: 'nowrap' }}>{row.time}</td>
                    <td>{row.label}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaBand
        title="Visit the"
        accent="campus"
        lead="Walk the corridors, see a class in session, and ask us anything."
        primary={{ label: 'Schedule a visit', to: '/admissions' }}
      />
    </>
  )
}