// tests/api.spec.js
import { test, expect } from '@playwright/test'

const ADMIN_KEY = process.env.VITE_ADMIN_API_KEY || 'tt-local-admin-key-2026'

test.describe('JSON API', () => {
  test('settings endpoint returns school details', async ({ request }) => {
    const r = await request.get('http://127.0.0.1:8000/api/settings/')
    expect(r.ok()).toBeTruthy()
    const body = await r.json()
    expect(body.ok).toBe(true)
    expect(body.settings.phone).toBe('9467403080')
    expect(body.settings.stats).toBeTruthy()
  })

  test('home endpoint bundles everything', async ({ request }) => {
    const r = await request.get('http://127.0.0.1:8000/api/home/')
    const body = await r.json()
    expect(body.programs.length).toBeGreaterThan(0)
    expect(body.facilities.length).toBeGreaterThan(0)
    expect(body.testimonials.length).toBeGreaterThan(0)
    expect(body.faqs.length).toBeGreaterThan(0)
  })

  test('admission form validates required fields', async ({ request }) => {
    const r = await request.post('http://127.0.0.1:8000/api/admissions/apply/', {
      data: { child_name: '', parent_name: 'P', phone: '12' },
    })
    expect(r.status()).toBe(400)
    const body = await r.json()
    expect(body.ok).toBe(false)
    expect(body.field_errors).toBeTruthy()
  })

  test('admission form rejects future date of birth', async ({ request }) => {
    const r = await request.post('http://127.0.0.1:8000/api/admissions/apply/', {
      data: {
        child_name: 'Future Child',
        class_applying: 'Nursery',
        parent_name: 'Parent X',
        phone: '9876500001',
        date_of_birth: '2099-01-01',
      },
    })
    expect(r.status()).toBe(400)
    const body = await r.json()
    expect(body.field_errors.date_of_birth).toContain('future')
  })

  test('admin list is protected without a key', async ({ request }) => {
    const r = await request.get('http://127.0.0.1:8000/api/admissions/')
    expect(r.status()).toBe(401)
  })

  test('admin list works with a valid key', async ({ request }) => {
    const r = await request.get('http://127.0.0.1:8000/api/admissions/', {
      headers: { 'X-Admin-Key': ADMIN_KEY },
    })
    expect(r.ok()).toBeTruthy()
    const body = await r.json()
    expect(Array.isArray(body.admissions)).toBe(true)
  })

  test('CORS preflight is answered', async ({ request }) => {
    const r = await request.fetch('http://127.0.0.1:8000/api/settings/', {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
      },
    })
    expect([200, 204]).toContain(r.status())
    expect(r.headers()['access-control-allow-origin']).toBe('http://localhost:5173')
  })
})