import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi, useSite } from '../context/SiteContext'
import { PageHero } from '../components/Layout'
import CtaBand from '../components/CtaBand'
import ContactForm from '../components/ContactForm'
import api from '../lib/api'
import { Clock, Mail, Phone, Pin, WhatsApp } from '../components/Icons'

export default function Contact() {
  const { settings } = useSite()
  const { data: faqData } = useApi('/api/faqs/', [])
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const wa = `https://wa.me/${settings.whatsapp}`

  const submit = async (form) => {
    setSubmitting(true)
    setResult(null)
    try {
      const res = await api.post('/api/contact/', form)
      setResult(res)
    } catch (err) {
      setResult({ error: err.message, field_errors: err.fieldErrors })
    } finally {
      setSubmitting(false)
    }
  }

  const mapQuery = encodeURIComponent(`${settings.school_name} ${settings.address}`)

  return (
    <>
      <PageHero
        title="Contact us"
        lead="Questions about admissions, transport or a classroom visit? We are happy to help."
        breadcrumb={['Contact']}
      />

      <section className="section section--white">
        <div className="container contact-layout">
          <div className="stack-24">
            <div className="stack-16">
              <span className="eyebrow">Reach us</span>
              <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.1rem)' }}>
                We reply within one working day
              </h2>
              <p>
                Call the school office between 9:00 AM and 3:00 PM, send a WhatsApp message, or fill in
                the form — whichever is easiest for you.
              </p>
            </div>

            <div className="stack-12">
              <a className="contact-item" href={`tel:${settings.phone}`}>
                <span className="contact-item__icon">
                  <Phone size={18} />
                </span>
                <span>
                  <strong>School office</strong>
                  <span>{settings.phone}</span>
                </span>
              </a>

              <a className="contact-item" href={wa} target="_blank" rel="noreferrer">
                <span className="contact-item__icon" style={{ background: '#e7f9ef', color: '#128c4a' }}>
                  <WhatsApp size={18} />
                </span>
                <span>
                  <strong>WhatsApp</strong>
                  <span>Send us a quick message any time</span>
                </span>
              </a>

              {settings.email && (
                <a className="contact-item" href={`mailto:${settings.email}`}>
                  <span className="contact-item__icon">
                    <Mail size={18} />
                  </span>
                  <span>
                    <strong>Email</strong>
                    <span>{settings.email}</span>
                  </span>
                </a>
              )}

              <a className="contact-item" href={settings.map_url} target="_blank" rel="noreferrer">
                <span className="contact-item__icon">
                  <Pin size={18} />
                </span>
                <span>
                  <strong>Visit the campus</strong>
                  <span>{settings.address}</span>
                </span>
              </a>

              <div className="contact-item">
                <span className="contact-item__icon">
                  <Clock size={18} />
                </span>
                <span>
                  <strong>Office hours</strong>
                  <span>Mon – Fri · 9:00 AM – 3:00 PM</span>
                </span>
              </div>
            </div>

            <div className="map-frame">
              <iframe
                title="School location on Google Maps"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="stack-16">
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Send a message</span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2rem)' }}>How can we help?</h2>
            </div>
            <ContactForm
              onSubmit={submit}
              submitting={submitting}
              result={result}
              errors={result?.field_errors || {}}
            />
            <p style={{ fontSize: '0.9rem' }}>
              Looking to apply?{' '}
              <Link className="link-arrow" to="/admissions" style={{ display: 'inline-flex' }}>
                Use the full admission form <ArrowSmall />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {faqData?.faqs?.length > 0 && (
        <section className="section section--cream">
          <div className="container" style={{ maxWidth: 820 }}>
            <div className="section-head section-head--center">
              <span className="eyebrow">Before you call</span>
              <h2>Frequently asked questions</h2>
            </div>
            {faqData.faqs.map((faq) => (
              <details className="faq" key={faq.id}>
                <summary>{faq.question}</summary>
                <div className="faq__answer">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      <CtaBand
        title="Come and see"
        accent="for yourself"
        lead="Book a campus visit on any working day. Meet our teachers and watch a class in session."
        primary={{ label: 'Apply for admission', to: '/admissions' }}
      />
    </>
  )
}

function ArrowSmall() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}