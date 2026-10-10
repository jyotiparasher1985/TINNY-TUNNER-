import { Link } from 'react-router-dom'
import { useApi } from '../context/SiteContext'
import { PageHero } from '../components/Layout'
import CtaBand from '../components/CtaBand'
import { ArrowRight, Check, Clock, Sparkles } from '../components/Icons'

const APPROACH = [
  {
    title: 'Play with a purpose',
    body: 'Every activity has a learning intention behind it, but children never feel like they are being taught. The play is real; the learning is genuine.',
  },
  {
    title: 'Language through stories',
    body: 'Daily storytelling, songs and conversation build vocabulary, listening skills and a genuine love of books long before formal reading begins.',
  },
  {
    title: 'Numbers through play',
    body: 'Counting objects, sorting, patterns and simple games make early number sense feel natural rather than forced.',
  },
  {
    title: 'Confidence to try',
    body: 'We make space for mistakes. A child who is not afraid to get something wrong is a child who keeps trying — that is real learning.',
  },
]

const DAILY_ROUTINE = [
  { time: '8:30 – 9:00', label: 'Arrival & free choice', note: 'A calm, unhurried start with quiet activities.' },
  { time: '9:00 – 9:40', label: 'Circle time', note: 'Songs, rhymes, story and the day ahead.' },
  { time: '9:40 – 10:30', label: 'Activity stations', note: 'Art, blocks, clay and sensory play in small groups.' },
  { time: '10:30 – 11:00', label: 'Snack & outdoor play', note: 'Fresh fruit or biscuits, then the playground.' },
  { time: '11:00 – 12:00', label: 'Learning blocks', note: 'Phonics, early numbers and fine motor work.' },
  { time: '12:00 – 12:45', label: 'Lunch', note: 'Balanced meal, with parents welcome to join.' },
  { time: '12:45 – 1:30', label: 'Story & wrap-up', note: 'Quiet stories, sharing and goodbyes.' },
]

export default function Academics() {
  const { data, loading } = useApi('/api/programs/', [])
  const programs = data?.programs || []

  return (
    <>
      <PageHero
        title="Academics"
        lead="A UK-aligned Play Way curriculum that keeps children curious, capable and classroom-ready — without ever rushing them."
        breadcrumb={['Academics']}
      />

      {/* Approach */}
      <section className="section section--white">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How we teach</span>
            <h2>Play is the method. Learning is the result.</h2>
            <p>
              Our programme follows the early years framework, adapted for a Panchkula classroom and
              paced for real children.
            </p>
          </div>
          <div className="grid grid--2">
            {APPROACH.map((item, i) => (
              <article className="card card--hover" key={item.title}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div className={`card__icon card__icon--${['sky', 'gold', 'mint', 'red'][i % 4]}`}>
                    <Sparkles />
                  </div>
                  <span className="card__num">0{i + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="section section--cream" id="programmes">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Programmes</span>
            <h2>Choose the right starting point</h2>
            <p>
              Our teams keep class sizes small in every programme. Not sure which class is right?
              Call us and we will help you decide.
            </p>
          </div>

          {loading && (
            <div className="empty-state">
              <strong>Loading programmes…</strong>
              <span>Fetching the latest curriculum details.</span>
            </div>
          )}

          <div className="stack-32">
            {programs.map((program) => (
              <article className="split" id={program.slug} key={program.id}>
                <div className="split__media">
                  {program.image ? (
                    <img src={program.image} alt={program.name} />
                  ) : (
                    <div
                      className="gallery-empty"
                      style={{ height: '100%', border: 0, background: 'var(--blue-50)' }}
                    >
                      <strong>{program.name}</strong>
                      <span>{program.age_group}</span>
                    </div>
                  )}
                </div>

                <div className="stack-16">
                  <span className="badge badge--amber">{program.age_group}</span>
                  <h2 style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2rem)' }}>{program.name}</h2>
                  <p>{program.summary}</p>
                  {program.details && <p>{program.details}</p>}

                  {program.features?.length > 0 && (
                    <>
                      <h3 style={{ fontSize: '1.05rem' }}>What your child will do</h3>
                      <ul className="checks">
                        {program.features.map((feature) => (
                          <li key={feature}>
                            <Check size={16} /> {feature}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <div>
                    <Link className="btn" to="/admissions">
                      Apply for {program.name} <ArrowRight className="arrow" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!loading && programs.length === 0 && (
            <div className="empty-state">
              <strong>Programme details coming soon</strong>
              <span>Please check back shortly or call the school office.</span>
            </div>
          )}
        </div>
      </section>

      {/* Daily routine */}
      <section className="section section--sky">
        <div className="container split">
          <div className="stack-16">
            <span className="eyebrow">A day here</span>
            <h2>What a typical day looks like</h2>
            <p>
              Predictable rhythm, plenty of play and no long stretches of sitting still. Children do
              best when they know what comes next — and when they know they will move.
            </p>
            <span className="badge badge--mint">
              <Clock size={15} /> Monday to Friday · 8:30 AM – 1:30 PM
            </span>
            <div>
              <Link className="btn btn--outline" to="/admissions">
                Book a classroom visit <ArrowRight className="arrow" />
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="fee-table">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Activity</th>
                  <th scope="col" style={{ width: '45%' }}>
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {DAILY_ROUTINE.map((slot) => (
                  <tr key={slot.time}>
                    <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{slot.time}</td>
                    <td>{slot.label}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{slot.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaBand
        title="Ready when"
        accent="you are"
        lead="Tell us which class you are looking at and we will call you back within 24 hours."
        primary={{ label: 'Start your application', to: '/admissions' }}
      />
    </>
  )
}