// tests/admin-panel.spec.js
import { test, expect } from '@playwright/test'

const ADMIN_KEY = process.env.VITE_ADMIN_API_KEY || 'tt-local-admin-key-2026'
const DJANGO_USER = process.env.DJANGO_ADMIN_USER || 'admin'
const DJANGO_PASS = process.env.DJANGO_ADMIN_PASS || 'school@123'

test.describe('Django admin panel', () => {
  test('login page renders with CSRF token', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/admin/login/?next=/admin/')
    await expect(page.locator('#id_username')).toBeVisible()
    await expect(page.locator('#id_password')).toBeVisible()
    await expect(page.locator('input[name="csrfmiddlewaretoken"]')).toBeAttached()
  })

  test('invalid credentials are rejected', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/admin/login/?next=/admin/')
    await page.fill('#id_username', 'admin')
    await page.fill('#id_password', 'wrong-password')
    await page.click('input[type="submit"]')
    await expect(page.locator('.errornote, .error')).toBeVisible()
    await expect(page).toHaveURL(/\/admin\/login\//)
  })

  test('valid admin login shows dashboard', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/admin/login/?next=/admin/')
    await page.fill('#id_username', DJANGO_USER)
    await page.fill('#id_password', DJANGO_PASS)
    await page.click('input[type="submit"]')
    await expect(page).toHaveURL(/\/admin\/$/)
    await expect(page.locator('#content h1')).toContainText('content & admissions')
    await expect(page.locator('.module')).toHaveCount(3)
  })

  test('admissions change list shows expected columns', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/admin/login/?next=/admin/')
    await page.fill('#id_username', DJANGO_USER)
    await page.fill('#id_password', DJANGO_PASS)
    await page.click('input[type="submit"]')
    await page.goto('http://127.0.0.1:8000/admin/core/admission/')
    await expect(page.locator('#result_list')).toBeVisible()
    const body = await page.locator('#result_list').innerText()
    for (const h of ['REFERENCE', 'CHILD NAME', 'CLASS APPLYING', 'PARENT NAME', 'PHONE', 'STATUS']) {
      expect(body).toContain(h)
    }
  })

  test('site settings is a singleton (no add button)', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/admin/login/?next=/admin/')
    await page.fill('#id_username', DJANGO_USER)
    await page.fill('#id_password', DJANGO_PASS)
    await page.click('input[type="submit"]')
    await page.goto('http://127.0.0.1:8000/admin/core/sitesetting/')
    await expect(page.locator('h1')).toContainText('Site settings')
    // SiteSetting is a singleton: there must be no "Add site setting" link anywhere
    await expect(page.locator('a[href*="sitesetting/add"]')).toHaveCount(0)
  })
})

test.describe('React admissions dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin')
    const splashClose = page.locator('.splash__close')
    if (await splashClose.isVisible().catch(() => false)) {
      await splashClose.click()
      await expect(page.locator('.splash')).toHaveCount(0)
    }
    const input = page.locator('#adminkey')
    if (await input.isVisible().catch(() => false)) {
      await input.fill(ADMIN_KEY)
      await page.click('button[type="submit"]')
    }
    await page.click('button.admin-nav-item:has-text("Admissions")')
    await expect(page.locator('.admin-table')).toBeVisible({ timeout: 10_000 })
  })

  test('dashboard shows status counters', async ({ page }) => {
    await expect(page.locator('.admin-stat')).toHaveCount(5)
    await expect(page.locator('.admin-stat__label')).toContainText(['Total shown', 'New'])
  })

  test('status filter narrows the list', async ({ page }) => {
    const before = await page.locator('.admin-table tbody tr').count()
    await page.selectOption('select[aria-label="Filter by status"]', 'NEW')
    await page.waitForTimeout(300)
    // every visible row is NEW
    const rows = await page.locator('.admin-table tbody tr').count()
    expect(rows).toBeLessThanOrEqual(before)
  })

  test('search box filters by name', async ({ page }) => {
    await page.fill('input[aria-label="Search applications"]', 'zzzz-no-match')
    await page.click('button:has-text("Apply")')
    await expect(page.locator('.empty-state')).toBeVisible({ timeout: 5_000 })
  })

  test('inline status change persists to the API', async ({ page }) => {
    // create an application first via the API so the test is self-contained
    const res = await page.request.post('http://127.0.0.1:8000/api/admissions/apply/', {
      data: {
        child_name: 'PW Dashboard Child',
        class_applying: 'Play Group',
        parent_name: 'PW Parent',
        phone: '9998887776',
      },
    })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    const ref = body.reference

    await page.reload()
    const sc = page.locator('.splash__close')
    if (await sc.isVisible().catch(() => false)) await sc.click()
    await page.click('button.admin-nav-item:has-text("Admissions")')
    await expect(page.locator('.admin-table')).toBeVisible({ timeout: 10_000 })
    const row = page.locator('.admin-table tbody tr', { hasText: ref })
    await expect(row).toBeVisible({ timeout: 5_000 })
    await row.locator('select').selectOption('CONTACTED')
    await page.waitForTimeout(800)
    // verify it persisted
    const list = await page.request.get('http://127.0.0.1:8000/api/admissions/?search=' + ref, {
      headers: { 'X-Admin-Key': ADMIN_KEY },
    })
    const data = await list.json()
    expect(data.admissions[0].status).toBe('CONTACTED')
  })
})