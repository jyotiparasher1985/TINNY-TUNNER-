import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApi } from '../context/SiteContext'
import { PageHero } from '../components/Layout'
import CtaBand from '../components/CtaBand'
import { ArrowRight, Calendar, Close, Pin } from '../components/Icons'

const TABS = [
  { key: 'ALL', label: 'Everything' },
  { key: 'NOTICE', label: 'Notices' },
  { key: 'NEWS', label: 'News' },
  { key: 'EVENT', label: 'Events' },
]

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Notices() {
  const [params, setParams] = useSearchParams()
  const kind = (params.get('kind') || 'ALL').toUpperCase()
  const [open, setOpen] = useState(null)

  const query = kind === 'ALL' ? '/api/posts/?kind=ALL' : `/api/posts/?kind=${kind}`
  const { data, loading } = useApi(query, [kind])
  const posts = data?.posts || []

  const setKind = (next) => {
    if (next === 'ALL') setParams({})
    else setParams({ kind: next })
  }

  return (
    <>
      <PageHero
        title="News & Notices"
        lead="Important notices, school news and upcoming events — all in one place."
        breadcrumb={['Notices']}
      />

      <section className="section section--white">
        <div className="container">
          <div className="filter-row">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`filter-chip${kind === tab.key ? ' is-active' : ''}`}
                onClick={() => setKind(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="empty-state">
              <strong>Loading…</strong>
              <span>Fetching the latest updates.</span>
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="empty-state">
              <strong>Nothing here yet</strong>
              <span>Check back soon, or call the school office for the latest update.</span>
            </div>
          )}

          <div className="grid grid--3">
            {posts.map((post) => (
              <article className="post-card" key={post.id}>
                {post.image && (
                  <div className="post-card__media">
                    <img src={post.image} alt="" loading="lazy" />
                  </div>
                )}
                <div className="post-card__body">
                  <div className="post-card__meta">
                    <span className={`badge ${post.kind === 'EVENT' ? 'badge--mint' : 'badge--amber'}`}>
                      {post.kind_label}
                    </span>
                    <span>{post.event_date ? formatDate(post.event_date) : formatDate(post.published_at)}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.summary}</p>
                  {post.kind === 'EVENT' && post.location && (
                    <span className="row" style={{ gap: 7, fontSize: '0.84rem', color: 'var(--muted)' }}>
                      <Pin size={14} /> {post.location}
                      {post.event_time ? ` · ${post.event_time}` : ''}
                    </span>
                  )}
                  <button
                    className="link-arrow mt-auto"
                    style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer' }}
                    onClick={() => setOpen(post)}
                  >
                    Read more <ArrowRight className="arrow" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Events spotlight */}
      {posts.some((p) => p.kind === 'EVENT') && (
        <section className="section section--mint">
          <div className="container">
            <div className="section-head section-head--center">
              <span className="eyebrow">Mark your calendar</span>
              <h2>Upcoming events</h2>
            </div>
            <div className="grid grid--3">
              {posts
                .filter((p) => p.kind === 'EVENT')
                .map((post) => (
                  <article className="card" key={post.id}>
                    <span className="card__icon">
                      <Calendar />
                    </span>
                    <h3>{post.title}</h3>
                    <p>{post.summary}</p>
                    <div className="tag-list">
                      {post.event_date && <span className="tag">{formatDate(post.event_date)}</span>}
                      {post.event_time && <span className="tag">{post.event_time}</span>}
                      {post.location && <span className="tag">{post.location}</span>}
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="Every season here is"
        accent="worth showing up for"
        lead="Sports day, annual celebrations and parent orientation — come and be part of your child's first school memories."
        primary={{ label: 'Apply for admission', to: '/admissions' }}
        secondary={{ label: 'Talk to us', to: '/contact' }}
      />

      {/* Modal */}
      {open && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        >
          <div className="modal" style={{ position: 'relative' }}>
            <button className="modal__close" onClick={() => setOpen(null)} aria-label="Close">
              <Close size={19} />
            </button>
            {open.image && (
              <div className="modal__media">
                <img src={open.image} alt="" />
              </div>
            )}
            <div className="modal__body prose">
              <div className="post-card__meta">
                <span className="badge badge--amber">{open.kind_label}</span>
                <span>{formatDate(open.event_date || open.published_at)}</span>
              </div>
              <h2 style={{ fontSize: '1.7rem' }}>{open.title}</h2>
              {(open.body || open.summary).split('\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              {open.kind === 'EVENT' && (
                <div className="tag-list">
                  {open.event_date && <span className="tag">{formatDate(open.event_date)}</span>}
                  {open.event_time && <span className="tag">{open.event_time}</span>}
                  {open.location && <span className="tag">{open.location}</span>}
                </div>
              )}
              <div>
                <Link className="btn btn--outline" to="/admissions" onClick={() => setOpen(null)}>
                  Enquire about this <ArrowRight className="arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}