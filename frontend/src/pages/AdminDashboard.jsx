import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import api from '../lib/api'
import {
  Search, Filter, ArrowRight, Phone, Mail, Pin, Settings as SettingsIcon,
  Users, FileText, ImageIcon, Megaphone, LayoutGrid, HelpCircle,
  MessageSquare, LogOut, Save, Check, AlertCircle, Sliders, BarChart3,
} from '../components/Icons'

const STATUS_LABEL = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  VISIT: 'School Visit',
  CONFIRMED: 'Confirmed',
  CLOSED: 'Closed',
}
const STATUSES = ['ALL', 'NEW', 'CONTACTED', 'VISIT', 'CONFIRMED', 'CLOSED']

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 /> },
  { id: 'settings', label: 'Site settings', icon: <SettingsIcon /> },
  { id: 'admissions', label: 'Admissions', icon: <Users /> },
  { id: 'posts', label: 'Posts & notices', icon: <Megaphone /> },
  { id: 'gallery', label: 'Gallery', icon: <ImageIcon /> },
  { id: 'programs', label: 'Programmes', icon: <LayoutGrid /> },
  { id: 'facilities', label: 'Facilities', icon: <Sliders /> },
  { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare /> },
  { id: 'faqs', label: 'FAQs', icon: <HelpCircle /> },
  { id: 'messages', label: 'Contact messages', icon: <Mail /> },
]

export default function AdminDashboard() {
  const { settings: siteSettings } = useSite()
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  const [section, setSection] = useState('dashboard')

  // admissions state
  const [rows, setRows] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('ALL')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(null)

  // settings state
  const [settingsForm, setSettingsForm] = useState(null)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState(null)
  const [settingsErr, setSettingsErr] = useState(null)

  const loadAdmissions = useCallback(
    async (key, filters = {}) => {
      const useStatus = filters.status ?? status
      const useSearch = filters.search ?? search
      setLoading(true)
      setError(null)
      try {
        const qs = new URLSearchParams()
        if (useStatus !== 'ALL') qs.set('status', useStatus)
        if (useSearch) qs.set('search', useSearch)
        const res = await api.get(`/api/admissions/?${qs.toString()}`)
        setRows(res.admissions)
      } catch (err) {
        setError(err.message)
        setRows(null)
      } finally {
        setLoading(false)
      }
    },
    [status, search],
  )

  const loadSettings = useCallback(async () => {
    try {
      const res = await api.get('/api/settings/')
      setSettingsForm(res.settings)
    } catch (err) {
      setSettingsErr(err.message)
    }
  }, [])

  // Check if already logged in via session cookie
  useEffect(() => {
    let active = true
    api.get('/api/auth/me/')
      .then((res) => {
        if (active) {
          setUser(res.user)
          loadAdmissions(null, { status: 'ALL', search: '' })
          loadSettings()
        }
      })
      .catch(() => {
        if (active) setUser(null)
      })
      .finally(() => active && setAuthChecked(true))
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)
    try {
      const res = await api.post('/api/auth/login/', { username, password })
      setUser(res.user)
      await loadAdmissions(null, { status: 'ALL', search: '' })
      await loadSettings()
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout/', {})
    } catch (e) {
      /* ignore */
    }
    setUser(null)
    setRows(null)
    setSettingsForm(null)
    setUsername('')
    setPassword('')
  }

  const handleStatusChange = async (id, nextStatus) => {
    setSaving(id)
    try {
      await api.patch(`/api/admissions/${id}/update/`, { status: nextStatus })
      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: nextStatus, status_label: STATUS_LABEL[nextStatus] } : r,
        ),
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(null)
    }
  }

  const handleSettingsSave = async (e) => {
    e.preventDefault()
    setSettingsSaving(true)
    setSettingsMsg(null)
    setSettingsErr(null)
    try {
      const res = await api.patch('/api/settings/update/', settingsForm)
      setSettingsForm(res.settings)
      setSettingsMsg('Settings saved successfully.')
    } catch (err) {
      setSettingsErr(err.message)
    } finally {
      setSettingsSaving(false)
    }
  }

  const updateField = (key, value) => {
    setSettingsForm((prev) => ({ ...prev, [key]: value }))
  }

  const counts = (rows || []).reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})

  // ---------------- Login gate ----------------
  if (!authChecked) {
    return (
      <div className="admin-shell admin-shell--login">
        <div className="admin-login-card">
          <div className="admin-login-brand">
            <img src="/images/logo.png" alt="" width="64" height="64" />
            <div>
              <strong>Tiny Turners</strong>
              <span>Admin panel</span>
            </div>
          </div>
          <p className="admin-login-sub">Checking session…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="admin-shell admin-shell--login">
        <div className="admin-login-card">
          <div className="admin-login-brand">
            <img src="/images/logo.png" alt="" width="64" height="64" />
            <div>
              <strong>Tiny Turners</strong>
              <span>Admin panel</span>
            </div>
          </div>
          <h1>Sign in</h1>
          <p className="admin-login-sub">
            Enter your Django admin username and password to manage the school website.
          </p>
          {authError && <div className="alert alert--error">{authError}</div>}
          <form className="stack-16" onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button className="btn btn--block" type="submit" disabled={authLoading}>
              {authLoading ? <span className="spinner" /> : <Search size={16} />}
              {authLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <div className="admin-login-links">
            <a href="/admin/" target="_blank" rel="noreferrer">
              Open full Django admin ↗
            </a>
            <Link to="/">View website</Link>
          </div>
        </div>
      </div>
    )
  }

  // ---------------- Main shell ----------------
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <img src="/images/logo.png" alt="" width="40" height="40" />
          <div>
            <strong>Tiny Turners</strong>
            <span>Admin panel</span>
          </div>
        </div>
        <nav className="admin-sidebar__nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item${section === item.id ? ' is-active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__foot">
          <a className="admin-nav-item" href="/admin/" target="_blank" rel="noreferrer">
            <FileText size={16} />
            Full content admin ↗
          </a>
          <button className="admin-nav-item admin-nav-item--danger" onClick={handleLogout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main-area">
        <header className="admin-topbar">
          <div>
            <h1>{NAV.find((n) => n.id === section)?.label}</h1>
            <p>{siteSettings?.school_name} · {siteSettings?.phone}</p>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <Link className="btn btn--sm btn--outline" to="/">
              View website
            </Link>
          </div>
        </header>

        <div className="admin-content">
          {section === 'dashboard' && (
            <DashboardSection rows={rows} counts={counts} onGo={setSection} />
          )}
          {section === 'settings' && (
            <SettingsSection
              form={settingsForm}
              onChange={updateField}
              onSave={handleSettingsSave}
              saving={settingsSaving}
              msg={settingsMsg}
              err={settingsErr}
            />
          )}
          {section === 'admissions' && (
            <AdmissionsSection
              rows={rows}
              loading={loading}
              error={error}
              status={status}
              search={search}
              saving={saving}
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onApply={() => loadAdmissions(null)}
              onStatusUpdate={handleStatusChange}
              onReset={() => {
                setSearch('')
                setStatus('ALL')
                loadAdmissions(null, { status: 'ALL', search: '' })
              }}
            />
          )}
          {section === 'posts' && <ExternalSection title="Posts & notices" path="/admin/core/post/" />}
          {section === 'gallery' && <ExternalSection title="Gallery images" path="/admin/core/galleryimage/" />}
          {section === 'programs' && <ExternalSection title="Programmes" path="/admin/core/program/" />}
          {section === 'facilities' && <ExternalSection title="Facilities" path="/admin/core/facility/" />}
          {section === 'testimonials' && <ExternalSection title="Testimonials" path="/admin/core/testimonial/" />}
          {section === 'faqs' && <ExternalSection title="FAQs" path="/admin/core/faq/" />}
          {section === 'messages' && <ExternalSection title="Contact messages" path="/admin/core/contactmessage/" />}
        </div>
      </main>
    </div>
  )
}

// ---------------- Dashboard ----------------
function DashboardSection({ rows, counts, onGo }) {
  const cards = [
    { key: 'NEW', label: 'New applications', color: 'gold' },
    { key: 'CONTACTED', label: 'Contacted', color: 'sky' },
    { key: 'VISIT', label: 'School visit', color: 'violet' },
    { key: 'CONFIRMED', label: 'Confirmed', color: 'mint' },
  ]
  return (
    <div className="stack-24">
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat__label">Total applications</div>
          <div className="admin-stat__value">{rows ? rows.length : '—'}</div>
        </div>
        {cards.map((c) => (
          <div className="admin-stat" key={c.key}>
            <div className="admin-stat__label">{c.label}</div>
            <div className="admin-stat__value">{rows ? counts[c.key] || 0 : '—'}</div>
          </div>
        ))}
      </div>

      <div className="grid grid--2">
        <div className="card">
          <h3>Quick actions</h3>
          <div className="stack-12">
            <button className="btn btn--sm btn--outline" onClick={() => onGo('settings')}>
              <SettingsIcon size={15} /> Edit site settings
            </button>
            <button className="btn btn--sm btn--outline" onClick={() => onGo('admissions')}>
              <Users size={15} /> Review applications
            </button>
            <a className="btn btn--sm btn--outline" href="/admin/core/post/add/" target="_blank" rel="noreferrer">
              <Megaphone size={15} /> Add a notice
            </a>
            <a className="btn btn--sm btn--outline" href="/admin/core/galleryimage/add/" target="_blank" rel="noreferrer">
              <ImageIcon size={15} /> Upload a photo
            </a>
          </div>
        </div>
        <div className="card">
          <h3>Recent applications</h3>
          {!rows || rows.length === 0 ? (
            <p style={{ fontSize: '0.9rem' }}>No applications yet.</p>
          ) : (
            <ul className="admin-recent">
              {rows.slice(0, 5).map((r) => (
                <li key={r.id}>
                  <span className="ref">{r.reference}</span>
                  <span>{r.child_name}</span>
                  <span className={`status-pill status-pill--${r.status}`}>{r.status_label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------- Settings ----------------
function SettingsSection({ form, onChange, onSave, saving, msg, err }) {
  if (!form) {
    return (
      <div className="empty-state">
        <strong>Loading settings…</strong>
      </div>
    )
  }
  return (
    <form className="card stack-24" onSubmit={onSave}>
      <div className="admin-settings-grid">
        <div className="admin-settings-col">
          <h3>School identity</h3>
          <div className="field">
            <label htmlFor="school_name">School name</label>
            <input
              id="school_name"
              className="input"
              value={form.school_name || ''}
              onChange={(e) => onChange('school_name', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="tagline">Tagline</label>
            <input
              id="tagline"
              className="input"
              value={form.tagline || ''}
              onChange={(e) => onChange('tagline', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="established">Established (year)</label>
            <input
              id="established"
              className="input"
              value={form.established || ''}
              onChange={(e) => onChange('established', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="admission_session">Admission session</label>
            <input
              id="admission_session"
              className="input"
              value={form.admission_session || ''}
              onChange={(e) => onChange('admission_session', e.target.value)}
              placeholder="2026-27"
            />
          </div>
        </div>

        <div className="admin-settings-col">
          <h3>Contact details</h3>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              className="input"
              value={form.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="whatsapp">WhatsApp (with country code)</label>
            <input
              id="whatsapp"
              className="input"
              value={form.whatsapp || ''}
              onChange={(e) => onChange('whatsapp', e.target.value)}
              placeholder="919467403080"
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={form.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              className="input"
              value={form.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="map_url">Map URL</label>
            <input
              id="map_url"
              className="input"
              value={form.map_url || ''}
              onChange={(e) => onChange('map_url', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="admin-settings-col" style={{ gridColumn: '1 / -1' }}>
        <h3>Homepage counters</h3>
        <p style={{ fontSize: '0.85rem', marginBottom: 12 }}>
          These numbers appear on the homepage stats strip.
        </p>
        <div className="form-grid">
          {['students', 'years', 'teacher_ratio', 'activities'].map((k) => (
            <div className="field" key={k}>
              <label htmlFor={'stat_' + k}>{k.replace('_', ' ')}</label>
              <input
                id={'stat_' + k}
                className="input"
                value={(form.stats || {})[k] || ''}
                onChange={(e) =>
                  onChange('stats', { ...(form.stats || {}), [k]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      </div>

      {msg && <div className="alert alert--success">{msg}</div>}
      {err && <div className="alert alert--error">{err}</div>}

      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button className="btn btn--lg" type="submit" disabled={saving}>
          {saving ? <span className="spinner" /> : <Save size={17} />}
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  )
}

// ---------------- Admissions ----------------
function AdmissionsSection({
  rows, loading, error, status, search, saving,
  onStatusChange, onSearchChange, onApply, onStatusUpdate, onReset,
}) {
  return (
    <div className="stack-24">
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat__label">Total shown</div>
          <div className="admin-stat__value">{rows ? rows.length : '—'}</div>
        </div>
        {['NEW', 'CONTACTED', 'VISIT', 'CONFIRMED'].map((key) => (
          <div className="admin-stat" key={key}>
            <div className="admin-stat__label">{STATUS_LABEL[key]}</div>
            <div className="admin-stat__value">{rows ? (rows.filter((r) => r.status === key).length) : '—'}</div>
          </div>
        ))}
      </div>

      <div className="admin-toolbar">
        <select
          className="select"
          value={status}
          onChange={(e) => {
            onStatusChange(e.target.value)
            setTimeout(() => onApply(), 0)
          }}
          aria-label="Filter by status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === 'ALL' ? 'All statuses' : STATUS_LABEL[s]}
            </option>
          ))}
        </select>

        <input
          className="input"
          value={search}
          placeholder="Search name, phone or reference"
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApply()}
          aria-label="Search applications"
        />

        <button className="btn btn--sm btn--outline" onClick={() => onApply()}>
          <Filter size={15} /> Apply
        </button>
        <button
          className="btn btn--sm btn--outline"
          onClick={onReset}
        >
          Reset
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {loading && (
        <div className="empty-state">
          <strong>Loading applications…</strong>
        </div>
      )}

      {rows && rows.length === 0 && !loading && (
        <div className="empty-state">
          <strong>No applications found</strong>
          <span>Try clearing the filters.</span>
        </div>
      )}

      {rows && rows.length > 0 && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Child</th>
                <th>Class</th>
                <th>Parent</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="ref">{row.reference}</td>
                  <td>
                    <strong style={{ color: 'var(--navy-800)' }}>{row.child_name}</strong>
                    <div style={{ fontSize: '0.78rem' }}>{row.date_of_birth || row.gender || ''}</div>
                  </td>
                  <td>{row.class_applying}</td>
                  <td>
                    {row.parent_name}
                    <div style={{ fontSize: '0.78rem' }}>{row.relation}</div>
                  </td>
                  <td>
                    <a href={`tel:${row.phone}`}>{row.phone}</a>
                  </td>
                  <td>
                    <select
                      className="select"
                      style={{ minWidth: 130, padding: '7px 34px 7px 11px', fontSize: '0.84rem' }}
                      value={row.status}
                      disabled={saving === row.id}
                      onChange={(e) => onStatusUpdate(row.id, e.target.value)}
                    >
                      {STATUSES.filter((s) => s !== 'ALL').map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>
                    {new Date(row.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ---------------- External (Django admin) ----------------
function ExternalSection({ title, path }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p style={{ fontSize: '0.92rem' }}>
        This content is managed in the full Django admin, which has richer editing
        (image uploads, ordering, featured toggles, bulk actions).
      </p>
      <a className="btn" href={path} target="_blank" rel="noreferrer">
        Open {title} in full admin <ArrowRight className="arrow" />
      </a>
    </div>
  )
}