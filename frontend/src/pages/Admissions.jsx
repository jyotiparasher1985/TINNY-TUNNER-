import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { PageHero } from '../components/Layout'
import CtaBand from '../components/CtaBand'
import ContactForm from '../components/ContactForm'
import api from '../lib/api'
import { ArrowRight, Calendar, Check, Phone } from '../components/Icons'

const STEPS = [
  {
    title: 'Submit the enquiry form',
    body: 'Fill in the details below. You will get a reference number immediately.',
  },
  {
    title: 'We call you back',
    body: 'Our admission team calls within 24 hours to understand what you are looking for.',
  },
  {
    title: 'Visit the campus',
    body: 'Tour the classrooms, meet the teachers and watch a class in session.',
  },
  {
    title: 'Confirm your seat',
    body: 'Pay the first instalment and your child is enrolled. Orientation happens before term.',
  },
]

const FEES = [
  { class: 'Play Group (Ages 2-3)', fee: 'To be confirmed' },
  { class: 'Nursery (Ages 3-4)', fee: 'To be confirmed' },
  { class: 'Junior KG (Ages 4-5)', fee: 'To be confirmed' },
  { class: 'Senior KG (Ages 5-6)', fee: 'To be confirmed' },
  { class: 'Registration fee (one-time)', fee: 'As per session' },
  { class: 'Extended hours (optional)', fee: 'Monthly, on request' },
]

const DOCUMENTS = [
  'Child&apos;s birth certificate (copy)',
  'Three passport-size photographs',
  'Immunisation / vaccination record',
  'Parent and guardian ID proof',
  'Address proof',
  'Previous school report (if applicable)',
]

export default function Admissions() {
  const { settings } = useSite()
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (form) => {
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

  return (
    <>
      <PageHero
        title="Admissions"
        lead={`Play Group to Senior KG admissions are now open for the ${settings.admission_session} session. Seats are limited to keep our classes small.`}
        breadcrumb={['Admissions']}
      >
        <span className="badge badge--live" style={{ marginTop: 20 }}>
          <span className="dot" />
          Admissions open for {settings.admission_session}
        </span>
      </PageHero>

      {/* Steps */}
      <section className="section section--white">
        <div className="container split">
          <div className="stack-16">
            <span className="eyebrow">How admission works</span>
            <h2>Four simple steps</h2>
            <div className="steps" style={{ marginTop: 8 }}>
              {STEPS.map((step, i) => (
                <div className="step" key={step.title}>
                  <span className="step__num">{i + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stack-16">
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="fee-table">
                <thead>
                  <tr>
                    <th scope="col">Class</th>
                    <th scope="col">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {FEES.map((row) => (
                    <tr key={row.class}>
                      <td>{row.class}</td>
                      <td>{row.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '0.88rem' }}>
              Exact fees for the {settings.admission_session} session are shared with parents after the
              counselling call. Transport and meals are charged separately.
            </p>

            <div className="card">
              <h3>Documents to keep ready</h3>
              <ul className="checks">
                {DOCUMENTS.map((doc) => (
                  <li key={doc}>
                    <Check size={16} /> {doc}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '0.86rem' }}>
                Originals are required only at the time of final confirmation.
              </p>
            </div>

            <div className="row">
              <a className="btn btn--outline" href={`tel:${settings.phone}`}>
                <Phone size={16} /> {settings.phone}
              </a>
              <span className="badge badge--mint">
                <Calendar size={15} /> Campus visits: Mon – Fri
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section section--cream" id="form">
        <div className="container">
          <div className="spread" style={{ alignItems: 'flex-start', marginBottom: 34 }}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Let&apos;s begin</span>
              <h2>Tell Us About Your Little One</h2>
              <p>
                Share a few details and our school team will get back to you within 24 hours. Your
                details are used only for this enquiry.
              </p>
            </div>
            <div className="stack-12" style={{ minWidth: 230 }}>
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
            onSubmit={submit}
            submitting={submitting}
            result={result}
            errors={result?.field_errors || {}}
          />
        </div>
      </section>

      {/* CTA */}
      <CtaBand
        title="Admissions open"
        accent="2026-27"
        lead="Play Way to UK. Give your child a joyful beginning and a strong foundation."
        primary={{ label: `Call ${settings.phone}`, to: '/contact' }}
        secondary={{ label: 'See our campus', to: '/facilities' }}
      />
    </>
  )
}