import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../context/SiteContext'
import { PageHero } from '../components/Layout'
import CtaBand from '../components/CtaBand'
import { ArrowRight, Camera } from '../components/Icons'

export default function Gallery() {
  const [category, setCategory] = useState('All')
  const { data, loading } = useApi('/api/gallery/', [])
  const items = data?.gallery || []

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))],
    [items],
  )

  const visible = category === 'All' ? items : items.filter((i) => i.category === category)

  return (
    <>
      <PageHero
        title="Gallery"
        lead="A look inside our classrooms, playgrounds and everyday moments at Tiny Turners."
        breadcrumb={['Gallery']}
      />

      <section className="section section--white">
        <div className="container">
          <div className="spread" style={{ marginBottom: 28 }}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Life here</span>
              <h2>Small moments, big memories</h2>
            </div>
            {categories.length > 2 && (
              <div className="filter-row" style={{ marginBottom: 0 }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-chip${category === cat ? ' is-active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading && (
            <div className="empty-state">
              <strong>Loading photos…</strong>
              <span>Just a moment.</span>
            </div>
          )}

          {!loading && visible.length === 0 && (
            <div className="empty-state">
              <Camera size={34} />
              <strong>Photos are being uploaded</strong>
              <span>
                Our team adds new pictures regularly. Visit us in the meantime or follow our WhatsApp
                for daily updates.
              </span>
            </div>
          )}

          {visible.length > 0 && (
            <div className="gallery-grid">
              {visible.map((item) => (
                <figure className="gallery-item" key={item.id} style={{ margin: 0 }}>
                  <img src={item.image} alt={item.caption || 'Tiny Turners school'} loading="lazy" />
                  {(item.caption || item.category) && (
                    <figcaption className="gallery-item__caption">
                      {item.caption || item.category}
                      <ArrowRight className="arrow" size={16} />
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Pictures only tell"
        accent="half the story"
        lead="Come and spend a morning with us. You will see the rest for yourself."
        primary={{ label: 'Schedule a visit', to: '/admissions' }}
      />
    </>
  )
}