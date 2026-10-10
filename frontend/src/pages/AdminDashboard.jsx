import { useCallback, useEffect, useRef, useState } from 'react'
import api from '../lib/api'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { Search, Filter, ArrowRight } from '../components/Icons'

const STATUSES = ['ALL', 'NEW', 'CONTACTED', 'VISIT', 'CONFIRMED', 'CLOSED']

const STATUS_LABEL = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  VISIT: 'School Visit',
  CONFIRMED: 'Confirmed',
  CLOSED: 'Closed',
}

export default function AdminDashboard() {
  const { settings } = useSite()
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tt_admin_key') || '')
  const [keyInput, setKeyInput] = useState('')
  const [rows, setRows] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('ALL')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(null)

  const load = useCallback(
    async (key, filters = {}) => {
      const useStatus = filters.status ?? status
      const useSearch = filters.search ?? search
      setLoading(true)
      setError(null)
      try {
        const qs = new URLSearchParams()
        if (useStatus !== 'ALL') qs.set('status', useStatus)
        if (useSearch) qs.set('search', useSearch)
        const res = await api.get(`/api/admissions/?${qs.toString()}`, {
          headers: { 'X-Admin-Key': key },
        })
        setRows(res.admissions)
        if (key) {
          localStorage.setItem('tt_admin_key', key)
          setApiKey(key)
        }
      } catch (err) {
        setError(err.message)
        setRows(null)
      } finally {
        setLoading(false)
      }
    },
    [status, search],
  )

  // A key remembered from a previous visit loads the list straight away.
  useEffect(() => {
    if (apiKey) load(apiKey, { status: 'ALL', search: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function updateStatus(id, nextStatus) {
    setSaving(id)
    try {
      await api.patch(`/api/admissions/${id}/update/`, { status: nextStatus }, {
        'X-Admin-Key': apiKey,
      })
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: nextStatus, status_label: STATUS_LABEL[nextStatus] } : r)),
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(null)
    }
  }

  const counts = (rows || []).reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="admin-shell">
      <div className="admin-bar">
        <div className="container admin-bar__inner">
          <strong>Admissions Dashboard</strong>
          <div className="row" style={{ gap: 10 }}>
            <a className="btn btn--sm btn--white" href="/admin/" target="_blank" rel="noreferrer">
              Full content admin ↗
            </a>
            <Link className="btn btn--sm btn--amber" to="/">
              View website
            </Link>
          </div>
        </div>
      </div>

      <div className="container admin-main">
        <div className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat__label">Total shown</div>
            <div className="admin-stat__value">{rows ? rows.length : '—'}</div>
          </div>
          {['NEW', 'CONTACTED', 'VISIT', 'CONFIRMED'].map((key) => (
            <div className="admin-stat" key={key}>
              <div className="admin-stat__label">{STATUS_LABEL[key]}</div>
              <div className="admin-stat__value">{rows ? counts[key] || 0 : '—'}</div>
            </div>
          ))}
        </div>

        {/* Key gate */}
        {!apiKey && (
          <div className="card" style={{ maxWidth: 520 }}>
            {error && <div className="alert alert--error">{error}</div>}
            <h3>Enter admin key</h3>
            <p style={{ fontSize: '0.92rem' }}>
              This quick view uses the API key set in the backend <code>ADMIN_API_KEY</code>. For full
              editing of admissions, notices and gallery, use the Django admin.
            </p>
            <form
              className="stack-16"
              onSubmit={(e) => {
                e.preventDefault()
                load(keyInput)
              }}
              noValidate
            >
              <div className="field">
                <label htmlFor="adminkey">Admin API key</label>
                <input
                  id="adminkey"
                  className="input"
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Paste your ADMIN_API_KEY"
                />
              </div>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : <Search size={16} />} Load applications
              </button>
            </form>
          </div>
        )}

        {apiKey && (
          <>
            <div className="admin-toolbar">
              <select
                className="select"
                value={status}
                onChange={(e) => {
                  const next = e.target.value
                  setStatus(next)
                  load(apiKey, { status: next })
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
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && load(apiKey)}
                aria-label="Search applications"
              />

              <button className="btn btn--sm btn--outline" onClick={() => load(apiKey)}>
                <Filter size={15} /> Apply
              </button>
              <button
                className="btn btn--sm btn--outline"
                onClick={() => {
                  setSearch('')
                  setStatus('ALL')
                  load(apiKey, { status: 'ALL', search: '' })
                }}
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
                          <div style={{ fontSize: '0.78rem' }}>
                            {row.date_of_birth || row.gender || ''}
                          </div>
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
                            onChange={(e) => updateStatus(row.id, e.target.value)}
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

            <div className="card" style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <div>
                <strong style={{ color: 'var(--navy-800)' }}>Need to edit more?</strong>
                <p style={{ fontSize: '0.9rem' }}>
                  Add notes, change classes, manage notices, events and gallery photos in the full
                  content admin.
                </p>
              </div>
              <a className="btn btn--sm" style={{ marginLeft: 'auto' }} href="/admin/" target="_blank" rel="noreferrer">
                Open full admin <ArrowRight className="arrow" />
              </a>
            </div>
          </>
        )}

        <p style={{ fontSize: '0.84rem', marginTop: 26 }}>
          {settings.school_name} · {settings.phone}
        </p>
      </div>
    </div>
  )
}