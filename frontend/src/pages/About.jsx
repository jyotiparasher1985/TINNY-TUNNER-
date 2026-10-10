import { Link } from 'react-router-dom'
import { useApi, useSite } from '../context/SiteContext'
import { PageHero } from '../components/Layout'
import CtaBand from '../components/CtaBand'
import { ArrowRight, Calendar, Check, Heart, Shield, Sparkles, Users } from '../components/Icons'

const VALUE_TINTS = ['gold', 'sky', 'mint', 'red']

const VALUES = [
  {
    icon: <Heart />,
    title: 'Child first, always',
    body: 'Every decision we make — from the layout of a room to the words on a notice board — starts with what a small child needs to feel safe.',
  },
  {
    icon: <Users />,
    title: 'Small classes, familiar faces',
    body: 'We keep ratios deliberately low so that every child is known, guided and celebrated by a consistent team of teachers.',
  },
  {
    icon: <Sparkles />,
    title: 'Learning through play',
    body: 'Children learn best when they are curious. Our curriculum uses play, story, song and movement to build real understanding.',
  },
  {
    icon: <Shield />,
    title: 'Safety without compromise',
    body: 'From gated entry to verified pickup, safety protocols are built into how our school runs every single day.',
  },
]

const TIMELINE = [
  { year: '2007', title: 'The beginning', body: 'Tiny Turners opens its doors in Barwala, Panchkula with a handful of children and one simple idea: learn through play.' },
  { year: '2013', title: 'Growing families', body: 'We expand to Nursery and Junior KG, adding a dedicated activity room and a proper library corner.' },
  { year: '2018', title: 'Safer campus', body: 'Full CCTV coverage, child-safe pickup points and verified transport routes across Panchkula.' },
  { year: '2023', title: 'New programme wing', body: 'Senior KG and our Pre-Primary Bridge programme open, taking children through to Grade 1 with confidence.' },
  { year: '2026', title: '320+ happy learners', body: 'Admissions open for the 2026-27 session across all Play Way programmes.' },
]

const TEAM = [
  { name: 'Sunita Teacher', role: 'Principal', note: '18 years in early childhood education.' },
  { name: 'Rakesh Verma', role: 'Academic Coordinator', note: 'UK-aligned curriculum design.' },
  { name: 'Anjali Rana', role: 'Play Group Lead', note: 'Certified in child psychology.' },
]

export default function About() {
  const { settings } = useSite()
  const { data } = useApi('/api/testimonials/', [])

  return (
    <>
      <PageHero
        title="Made for little beginnings"
        lead={`At ${settings.school_name} ${settings.tagline} we believe the earliest years decide how a child sees the world. Ours make it a joyful one.`}
        breadcrumb={['About']}
      />

      {/* Story */}
      <section className="section section--white">
        <div className="container split">
          <div className="stack-16">
            <span className="eyebrow">Our story</span>
            <h2>A school built around how children actually learn</h2>
            <p>
              Tiny Turners began in {settings.established} as a single play group in Barwala. What
              started as a handful of children on a mat has grown into a full Play Way school — but the
              method has not changed. Children here learn the way children naturally learn: by touching,
              trying, laughing, repeating and wondering.
            </p>
            <p>
              We keep our classes small, our teachers consistent and our expectations high. That
              combination is what lets a shy two-year-old find their voice and a curious five-year-old
              ask a hundred questions a day — both of them feeling completely at home.
            </p>
            <ul className="checks">
              <li>
                <Check size={17} /> Play Group to Pre-Primary Bridge
              </li>
              <li>
                <Check size={17} /> UK-aligned early years framework
              </li>
              <li>
                <Check size={17} /> Meals, transport and extended hours
              </li>
            </ul>
            <div>
              <Link className="btn" to="/academics">
                Explore our programmes <ArrowRight className="arrow" />
              </Link>
            </div>
          </div>

          <div className="split__media">
            <img
              src="/images/hero-handprints.jpg"
              alt="Young children proudly showing their painted hands after an art activity"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section--sky">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">What we stand for</span>
            <h2>Four things we never compromise on</h2>
          </div>
          <div className="grid grid--2">
            {VALUES.map((v, i) => (
              <article className="card card--hover" key={v.title}>
                <div className={`card__icon card__icon--${VALUE_TINTS[i % VALUE_TINTS.length]}`}>
                  {v.icon}
                </div>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="section section--white">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our journey</span>
            <h2>Growing carefully since {settings.established}</h2>
          </div>
          <div className="grid grid--3">
            {TIMELINE.map((item) => (
              <article className="card" key={item.year}>
                <span className="card__num">{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section--cream">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">The people</span>
            <h2>Meet the team you will meet</h2>
          </div>
          <div className="grid grid--3">
            {TEAM.map((person) => (
              <article className="card card--hover text-center" key={person.name}>
                <span className="quote__avatar" style={{ margin: '0 auto 6px', width: 62, height: 62, fontSize: '1.4rem' }}>
                  {person.name.charAt(0)}
                </span>
                <h3 style={{ marginTop: 6 }}>{person.name}</h3>
                <span className="badge badge--amber" style={{ alignSelf: 'center' }}>
                  {person.role}
                </span>
                <p style={{ fontSize: '0.9rem' }}>{person.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Parent voices */}
      {data?.testimonials?.length > 0 && (
        <section className="section section--white">
          <div className="container">
            <div className="section-head section-head--center">
              <span className="eyebrow">Parent voices</span>
              <h2>In their words</h2>
            </div>
            <div className="grid grid--3">
              {data.testimonials.slice(0, 3).map((t) => (
                <figure className="quote" key={t.id} style={{ margin: 0 }}>
                  <div className="quote__mark" aria-hidden="true">
                    &ldquo;
                  </div>
                  <blockquote style={{ margin: 0, flex: 1 }}>{t.quote}</blockquote>
                  <figcaption className="quote__by">
                    <span className="quote__avatar">{t.parent_name.charAt(0)}</span>
                    <span>
                      <span className="quote__name">{t.parent_name}</span>
                      <span className="quote__role">Parent · {t.child_class}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CtaBand
        title="Come and see"
        accent="for yourself"
        lead="Book a campus visit on any working day. Meet our teachers, walk through the classrooms and watch a class in session."
      />
    </>
  )
}