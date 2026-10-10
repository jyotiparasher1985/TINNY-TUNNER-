import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const SiteContext = createContext(null)

/** Fallback values so the site still renders if the backend is offline. */
const FALLBACK = {
  school_name: 'Tiny Turners',
  tagline: 'Play Way School',
  phone: '9467403080',
  whatsapp: '919467403080',
  email: 'info@tinyturners.edu.in',
  address: 'Lala Wala Peer Road, Barwala, Panchkula',
  map_url:
    'https://www.google.com/maps/search/?api=1&query=Tiny+Turners+Play+Way+School+Lala+Wala+Peer+Road+Barwala',
  established: '2007',
  admission_session: '2026-27',
  stats: {},
}

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api
      .get('/api/settings/')
      .then((data) => {
        if (active && data.settings) setSettings({ ...FALLBACK, ...data.settings })
      })
      .catch(() => {
        /* keep fallback values */
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  return <SiteContext.Provider value={{ settings, loading }}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside SiteProvider')
  return ctx
}

/** Data-fetching helper with loading + error state. */
export function useApi(path, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = () => {
    let active = true
    setLoading(true)
    setError(null)
    api
      .get(path)
      .then((payload) => active && setData(payload))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }

  useEffect(reload, deps) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, reload }
}