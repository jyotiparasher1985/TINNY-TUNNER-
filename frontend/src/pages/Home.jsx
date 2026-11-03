import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi, useSite } from '../context/SiteContext'
import { PageHero } from '../components/Layout'
import CtaBand from '../components/CtaBand'
import ContactForm from '../components/ContactForm'
import api from '../lib/api'
import {
  ArrowRight,
  Book,
  Bus,
  Calendar,
  Check,
  Heart,
  Shield,
  Sparkles,
  Users,
} from '../components/Icons'

const SLIDES = [
  {
    badge: 'Admissions open for 2026-27',
    title: 'Where little minds turn into bright futures',
    lead: 'At Tiny Turners Play Way School, we create a safe, joyful and nurturing environment where children learn, explore, play and grow with confidence.',
    primary: { label: 'Apply for Admission', to: '/admissions' },
    secondary: { label: 'Explore our school', to: '/about' },
    image: '/images/hero-playground.jpg',
    alt: 'Children running and playing on the school playground',
  },
  {
    badge: 'Learning through every little moment',
    title: 'Growing curious, confident & kind',
    lead: 'Play-based learning, tiny hands and big imaginations. Our teachers guide every child at their own pace, in a class small enough to know them by name.',
    primary: { label: 'See our academics', to: '/academics' },
    secondary: { label: 'Visit the campus', to: '/facilities' },
    image: '/images/hero-classroom.jpg',
    alt: 'A teacher helping young children learn with books and building blocks',
  },
  {
    badge: 'A place to feel at home',
    title: 'Small classes. Big care.',
    lead: 'With a 1:8 teacher ratio in our early years, your child is encouraged every day and never lost in a crowd.',
    primary: { label: 'Why Tiny Turners', to: '/about' },
    secondary: { label: 'Talk to us', to: '/contact' },
    image: '/images/hero-handprints.jpg',
    alt: 'Happy children drawing, painting and stacking blocks in a bright classroom',
  },
]

const ICONS = {
  Users: <Users />,
  Shield: <Shield />,
  Sparkles: <Sparkles />,
  Heart: <Heart />,
  Book: <Book />,
  Bus: <Bus />,
  Calendar: <Calendar />,
  Check: <Check />,
}

const DIFFERENCE = [
  {
    num: '01',
    icon: <Users />,
    title: 'Experienced & caring teachers',
    body: 'Every teacher is trained in early childhood and stays with the same class all year — so your child always has a familiar, trusted adult.',
  },
  {
    num: '02',
    icon: <Shield />,
    title: 'Safe & secure campus',
    body: 'Gated entry, CCTV coverage, verified staff and a child-safe pickup policy. Safety is our first lesson every single day.',
  },
  {
    num: '03',
    icon: <Sparkles />,
    title: 'Activity-based learning',
    body: 'Art, music, movement and play are not breaks from learning — they are how your child learns to think, solve and express.',
  },
  {
    num: '04',
    icon: <Heart />,
    title: 'Happy, confident children',
    body: 'We nurture emotional growth as much as academic readiness, because a child who feels secure is a child who can flourish.',
  },
]

// icon tints taken from the school artwork
const DIFFERENCE_TINTS = ['mint', 'sky', 'gold', 'red']
const FACILITY_TINTS = ['sky', 'mint', 'gold', 'red', 'sky', 'mint']

export default function Home() {
  const { settings } = useSite()
  const { data } = useApi('/api/home/', [])
  const { data: heroData } = useApi('/api/hero-slides/', [])
  const { data: diffData } = useApi('/api/difference-cards/', [])
  const [slide, setSlide] = useState(0)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const slides = (heroData?.slides?.length ? heroData.slides : SLIDES).map((s) => ({
    badge: s.badge,
    title: s.title,
    lead: s.lead,
    primary: { label: s.primary_label ?? s.primary?.label ?? 'Apply for Admission', to: s.primary_to ?? s.primary?.to ?? '/admissions' },
    secondary: { label: s.secondary_label ?? s.secondary?.label ?? 'Explore our school', to: s.secondary_to ?? s.secondary?.to ?? '/about' },
    image: s.image || s.image_url || SLIDES[0].image,
    alt: s.image_alt || 'Tiny Turners school',
  }))
  const current = slides[slide] || slides[0]

  const difference = diffData?.cards?.length
    ? diffData.cards.map((c, i) => ({
        num: c.num || String(i + 1).padStart(2, '0'),
        icon: ICONS[c.icon] || <Users />,
        title: c.title,
        body: c.body,
      }))
    : DIFFERENCE
  const stats = settings.stats || {}
  const statList = [
    { value: stats.students || '320+', label: 'Happy students' },
    { value: stats.years || '18+', label: 'Years of learning' },
    { value: stats.teacher_ratio || '1:8', label: 'Teacher ratio' },
    { value: stats.activities || '25+', label: 'Activities a year' },
  ]

  const submitEnquiry = async (form) => {
    setSubmitting(true)
    setResult(null)
    try {
      const res = await api.post('/api/admissions/apply/', form)
      setResult(res)
    } catch (err) {
      setResult({ error: err.message, field_errors: err.fieldErrors })
    } finally {
      setSubmitting(false)
    }
  }

  const go = (dir) => setSlide((s) => (s + dir + slides.length) % slides.length)

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="hero" id="home">
        <div className="container hero__inner">
          <div key={slide} className="rise">
            <span className="hero__eyebrow">
              <span className="dot dot--pulse" />
              {current.badge}
            </span>
            <h1 className="hero__title">{current.title}</h1>
            <p className="hero__lead">{current.lead}</p>
            <div className="hero__actions">
              <Link className="btn btn--lg btn--gold" to={current.primary.to}>
                {current.primary.label}
                <ArrowRight className="arrow" />
              </Link>
              <Link className="btn btn--lg btn--white" to={current.secondary.to}>
                <span style={{ display: 'inline-flex' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.5v13l10-6.5-10-6.5Z" />
                  </svg>
                </span>
                {current.secondary.label}
              </Link>
            </div>

            <div className="row" style={{ marginTop: 32, gap: 12 }}>
              <div className="hero__dots" role="tablist" aria-label="Hero slides">
                {slides.map((s, i) => (
                  <button
                    key={s.title}
                    role="tab"
                    aria-selected={i === slide}
                    aria-label={`Slide ${i + 1}`}
                    className={`hero__dot${i === slide ? ' is-active' : ''}`}
                    onClick={() => setSlide(i)}
                  />
                ))}
              </div>
              <button className="btn btn--sm btn--white" onClick={() => go(-1)} aria-label="Previous slide">
                ←
              </button>
              <button className="btn btn--sm btn--white" onClick={() => go(1)} aria-label="Next slide">
                →
              </button>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__frame" key={current.image}>
              <img src={current.image} alt={current.alt} />
            </div>
            <div className="hero__chip hero__chip--tl">
              <strong>{stats.years || '18+'}</strong> Years of care
            </div>
            <div className="hero__chip hero__chip--br">
              <strong>{stats.teacher_ratio || '1:8'}</strong> Small classes
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Stats strip ---------------- */}
      <section className="strip">
        <div className="container strip__grid">
          {statList.map((item) => (
            <div key={item.label}>
              <div className="strip__value">{item.value}</div>
              <div className="strip__label">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Why parents choose us ---------------- */}
      <section className="section section--sun" id="about">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The Tiny Turners difference</span>
            <h2>Why Parents Choose Tiny Turners</h2>
            <p>Thoughtful early years care that gives children room to be exactly who they are.</p>
          </div>

          <div className="grid grid--2">
            {difference.map((item, i) => (
              <article className="card card--hover" key={item.num + item.title}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div className={`card__icon card__icon--${DIFFERENCE_TINTS[i % DIFFERENCE_TINTS.length]}`}>
                    {item.icon}
                  </div>
                  <span className="card__num">{item.num}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 34 }}>
            <Link className="link-arrow" to="/about">
              Discover our school <ArrowRight className="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Programmes ---------------- */}
      {data?.programs?.length > 0 && (
        <section className="section section--white" id="academics">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Play way to UK</span>
              <h2>Programmes for every stage</h2>
              <p>A carefully structured path from first steps in the classroom to confident, school-ready learners.</p>
            </div>

            <div className="grid grid--3">
              {data.programs.slice(0, 3).map((program) => (
                <Link
                  className="card card--hover"
                  key={program.id}
                  to={`/academics#${program.slug}`}
                >
                  <span className="badge badge--amber">{program.age_group}</span>
                  <h3>{program.name}</h3>
                  <p>{program.summary}</p>
                  <span className="link-arrow mt-auto">
                    Learn more <ArrowRight className="arrow" />
                  </span>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: 34 }}>
              <Link className="link-arrow" to="/academics">
                View all programmes <ArrowRight className="arrow" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Facilities ---------------- */}
      <section className="section section--sky" id="facilities">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Everything they need</span>
            <h2>Safe, Bright & Built for Children</h2>
            <p>Our campus is designed so that every corner invites a child to explore, imagine and play.</p>
          </div>

          <div className="grid grid--3">
            {(data?.facilities || []).slice(0, 6).map((f, i) => (
              <article className="card card--hover" key={f.id}>
                <div className={`card__icon card__icon--${FACILITY_TINTS[i % FACILITY_TINTS.length]}`}>
                  <Book size={22} />
                </div>
                <h3>{f.name}</h3>
                <p>{f.description}</p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 34, textAlign: 'center' }}>
            <Link className="btn btn--outline" to="/facilities">
              See all facilities <ArrowRight className="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Transport feature ---------------- */}
      <section className="section section--white">
        <div className="container split">
          <div className="split__media">
            <img
              src="/images/hero-playground.jpg"
              alt="Children playing safely together on the school grounds"
            />
          </div>
          <div className="stack-16">
            <span className="eyebrow">Peace of mind for every journey</span>
            <h2>
              Safe &amp; convenient <span style={{ color: 'var(--amber-500)' }}>school transport</span>
            </h2>
            <p>
              Ask our school team about available transport options, routes and arrangements for your
              family. We run GPS-tracked buses with a conductor on every route.
            </p>
            <ul className="checks">
              <li>
                <Shield size={17} /> Child safety
              </li>
              <li>
                <Users size={17} /> Trained drivers
              </li>
              <li>
                <Bus size={17} /> Convenient routes
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

      {/* ---------------- Gallery preview ---------------- */}
      {data?.gallery?.length > 0 && (
        <section className="section section--cream" id="gallery">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">A peek inside</span>
              <h2>Life at Tiny Turners</h2>
            </div>
            <div className="gallery-grid">
              {data.gallery.slice(0, 4).map((g) => (
                <Link className="gallery-item" key={g.id} to="/gallery">
                  <img src={g.image} alt={g.caption || 'School photo'} />
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 34 }}>
              <Link className="link-arrow" to="/gallery">
                Open the gallery <ArrowRight className="arrow" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Notices ---------------- */}
      {data?.notices?.length > 0 && (
        <section className="section section--white" id="notices">
          <div className="container">
            <div className="spread" style={{ marginBottom: 34 }}>
              <div className="section-head" style={{ marginBottom: 0 }}>
                <span className="eyebrow">Stay informed</span>
                <h2>Latest Notices</h2>
              </div>
              <Link className="link-arrow" to="/notices">
                View all notices <ArrowRight className="arrow" />
              </Link>
            </div>

            <div className="grid grid--3">
              {data.notices.map((post) => (
                <article className="post-card" key={post.id}>
                  {post.image && (
                    <div className="post-card__media">
                      <img src={post.image} alt="" />
                    </div>
                  )}
                  <div className="post-card__body">
                    <div className="post-card__meta">
                      <span className="badge badge--amber">{post.kind_label}</span>
                      <span>{new Date(post.published_at).toLocaleDateString('en-IN')}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Testimonials ---------------- */}
      {data?.testimonials?.length > 0 && (
        <section className="section section--sun">
          <div className="container">
            <div className="section-head section-head--center">
              <span className="eyebrow">From our parents</span>
              <h2>What families say</h2>
            </div>
            <div className="grid grid--3">
              {data.testimonials.slice(0, 6).map((t) => (
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

      {/* ---------------- FAQs ---------------- */}
      {data?.faqs?.length > 0 && (
        <section className="section section--white">
          <div className="container" style={{ maxWidth: 820 }}>
            <div className="section-head section-head--center">
              <span className="eyebrow">Good to know</span>
              <h2>Frequently asked questions</h2>
            </div>
            {data.faqs.map((faq) => (
              <details className="faq" key={faq.id}>
                <summary>{faq.question}</summary>
                <div className="faq__answer">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- Admission form ---------------- */}
      <section className="section section--cream" id="admission-form">
        <div className="container">
          <div className="spread" style={{ alignItems: 'flex-start', marginBottom: 34 }}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Let&apos;s begin</span>
              <h2>Tell Us About Your Little One</h2>
              <p>
                Share a few details and our school team will get back to you within 24 hours.
              </p>
            </div>
            <div className="stack-12" style={{ minWidth: 240 }}>
              <span className="badge badge--mint">
                <Check size={15} /> Free counselling session
              </span>
              <span className="badge">
                <Calendar size={15} /> Campus visit any working day
              </span>
            </div>
          </div>

          <ContactForm
            variant="admission"
            onSubmit={submitEnquiry}
            submitting={submitting}
            result={result}
            errors={result?.field_errors || {}}
          />
        </div>
      </section>

      {/* ---------------- Closing band ---------------- */}
      <CtaBand
        title="Nurturing today,"
        accent="inspiring tomorrow"
        lead="Come and spend a morning with us at Barwala. Meet the teachers, see a class in session, and ask us anything."
        primary={{ label: 'Apply for admission', to: '/admissions' }}
        secondary={{ label: 'Talk to us', to: '/contact' }}
      />
    </>
  )
}