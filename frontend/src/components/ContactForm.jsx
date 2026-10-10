import { useState } from 'react'
import { Check, Shield } from './Icons'

const ALERT_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16h.01" />
  </svg>
)

const OK_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m4.5 12.5 4.5 4.5L19.5 7" />
  </svg>
)

/**
 * Contact / admission enquiry form.
 * `variant="admission"` shows the full child + parent fields.
 */
export default function ContactForm({
  variant = 'contact',
  onSubmit,
  submitting = false,
  result = null,
  errors = {},
}) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    child_name: '',
    date_of_birth: '',
    gender: '',
    class_applying: '',
    previous_school: '',
    parent_name: '',
    relation: 'MOTHER',
    alternate_phone: '',
    address: '',
    city: 'Panchkula',
    preferred_contact: 'Phone',
    needs_transport: false,
  })

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit?.(form)
  }

  const hasError = (key) => errors[key]
  const cls = (key) => (hasError(key) ? ' input--error' : '')

  if (result?.ok) {
    return (
      <div className="card" style={{ gap: 16 }}>
        <div className="alert alert--success">
          <span className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
            {OK_ICON}
            <span>
              {result.message}
              {result.reference && (
                <span className="alert__ref">Reference: {result.reference}</span>
              )}
            </span>
          </span>
        </div>
        <p style={{ fontSize: '0.92rem' }}>
          Please save this reference number. Our admission team will call you within 24 hours during
          school hours (9:00 AM - 3:00 PM).
        </p>
      </div>
    )
  }

  const admission = variant === 'admission'

  return (
    <form className="card stack-24" onSubmit={handleSubmit} noValidate>
      <div className="form-note">
        <Shield size={18} />
        <span>Your details are used only for this enquiry. We never share them with anyone.</span>
      </div>

      {result?.error && (
        <div className="alert alert--error">
          <span className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
            {ALERT_ICON}
            <span>{result.error}</span>
          </span>
        </div>
      )}

      {admission ? (
        <>
          <h3>About your child</h3>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="child_name">
                Child&apos;s name<span className="req">*</span>
              </label>
              <input
                id="child_name"
                className={`input${cls('child_name')}`}
                value={form.child_name}
                onChange={set('child_name')}
                placeholder="e.g. Aarav"
                autoComplete="off"
              />
              {hasError('child_name') && <span className="field-error">{errors.child_name}</span>}
            </div>

            <div className="field">
              <label htmlFor="date_of_birth">Date of birth</label>
              <input
                id="date_of_birth"
                type="date"
                className={`input${cls('date_of_birth')}`}
                value={form.date_of_birth}
                onChange={set('date_of_birth')}
              />
              {hasError('date_of_birth') && (
                <span className="field-error">{errors.date_of_birth}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="gender">Gender</label>
              <select id="gender" className={`select${cls('gender')}`} value={form.gender} onChange={set('gender')}>
                <option value="">Prefer not to say</option>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="class_applying">
                Class applying for<span className="req">*</span>
              </label>
              <select
                id="class_applying"
                className={`select${cls('class_applying')}`}
                value={form.class_applying}
                onChange={set('class_applying')}
              >
                <option value="">Select a class</option>
                <option>Play Group</option>
                <option>Nursery</option>
                <option>Junior KG</option>
                <option>Senior KG</option>
                <option>Pre-Primary Bridge</option>
              </select>
              {hasError('class_applying') && (
                <span className="field-error">{errors.class_applying}</span>
              )}
            </div>

            <div className="field full">
              <label htmlFor="previous_school">Previous school (if any)</label>
              <input
                id="previous_school"
                className="input"
                value={form.previous_school}
                onChange={set('previous_school')}
                placeholder="Not applicable for Play Group / Nursery"
              />
            </div>
          </div>

          <hr className="divider" />

          <h3>Parent or guardian</h3>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="parent_name">
                Full name<span className="req">*</span>
              </label>
              <input
                id="parent_name"
                className={`input${cls('parent_name')}`}
                value={form.parent_name}
                onChange={set('parent_name')}
                autoComplete="name"
              />
              {hasError('parent_name') && (
                <span className="field-error">{errors.parent_name}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="relation">Relation to child</label>
              <select id="relation" className={`select${cls('relation')}`} value={form.relation} onChange={set('relation')}>
                <option value="MOTHER">Mother</option>
                <option value="FATHER">Father</option>
                <option value="GUARDIAN">Guardian</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="phone">
                Mobile number<span className="req">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                className={`input${cls('phone')}`}
                value={form.phone}
                onChange={set('phone')}
                placeholder="10-digit mobile number"
                autoComplete="tel"
              />
              {hasError('phone') && <span className="field-error">{errors.phone}</span>}
            </div>

            <div className="field">
              <label htmlFor="alternate_phone">Alternate number</label>
              <input
                id="alternate_phone"
                type="tel"
                className="input"
                value={form.alternate_phone}
                onChange={set('alternate_phone')}
              />
            </div>

            <div className="field full">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className={`input${cls('email')}`}
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
              {hasError('email') && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="field full">
              <label htmlFor="address">Home address</label>
              <textarea
                id="address"
                className="textarea"
                style={{ minHeight: 84 }}
                value={form.address}
                onChange={set('address')}
              />
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <input id="city" className="input" value={form.city} onChange={set('city')} />
            </div>

            <div className="field">
              <label htmlFor="preferred_contact">Preferred contact method</label>
              <select
                id="preferred_contact"
                className="select"
                value={form.preferred_contact}
                onChange={set('preferred_contact')}
              >
                <option>Phone</option>
                <option>WhatsApp</option>
                <option>Email</option>
                <option>School visit</option>
              </select>
            </div>
          </div>

          <hr className="divider" />

          <div className="field full">
            <label htmlFor="message">Anything we should know?</label>
            <textarea
              id="message"
              className="textarea"
              value={form.message}
              onChange={set('message')}
              placeholder="Allergies, transport requirements, or any questions for our team"
            />
          </div>

          <label className="checkbox">
            <input type="checkbox" checked={form.needs_transport} onChange={set('needs_transport')} />
            We are interested in school transport
          </label>
        </>
      ) : (
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">
              Your name<span className="req">*</span>
            </label>
            <input
              id="name"
              className={`input${cls('name')}`}
              value={form.name}
              onChange={set('name')}
              autoComplete="name"
            />
            {hasError('name') && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="phone">
              Mobile number<span className="req">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              className={`input${cls('phone')}`}
              value={form.phone}
              onChange={set('phone')}
              placeholder="10-digit mobile number"
              autoComplete="tel"
            />
            {hasError('phone') && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className={`input${cls('email')}`}
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
            />
            {hasError('email') && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              className="input"
              value={form.subject}
              onChange={set('subject')}
              placeholder="Admission enquiry"
            />
          </div>

          <div className="field full">
            <label htmlFor="message">
              Message<span className="req">*</span>
            </label>
            <textarea
              id="message"
              className={`textarea${cls('message')}`}
              value={form.message}
              onChange={set('message')}
            />
            {hasError('message') && <span className="field-error">{errors.message}</span>}
          </div>
        </div>
      )}

      <button className="btn btn--lg btn--block" type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <span className="spinner" />
            Sending...
          </>
        ) : (
          <>
            {admission ? 'Submit admission enquiry' : 'Send message'}
            <Check size={17} />
          </>
        )}
      </button>

      <p style={{ fontSize: '0.82rem', textAlign: 'center' }}>
        By submitting you agree to be contacted by the school regarding admissions.
      </p>
    </form>
  )
}