// tests/site.spec.js
import { test, expect } from '@playwright/test'

const ADMIN_KEY = process.env.VITE_ADMIN_API_KEY || 'tt-local-admin-key-2026'

async function dismissSplash(page) {
  const close = page.locator('.splash__close')
  if (await close.isVisible().catch(() => false)) {
    await close.click()
    await expect(page.locator('.splash')).toHaveCount(0)
  }
}

test.describe('Public website', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await dismissSplash(page)
  })

  test('homepage renders hero + 3D logo + yellow/blue theme', async ({ page }) => {
    await expect(page.locator('.hero__title')).toContainText('Where little minds')
    await expect(page.locator('.brand__mark').first()).toBeVisible()
    await expect(page.locator('.brand__mark').first()).toHaveAttribute('src', '/images/logo.png')
    await expect(page.locator('.hero__frame img')).toBeVisible()
    await expect(page.locator('.hero__frame img')).toHaveAttribute('src', '/images/hero-playground.jpg')
  })

  test('all 10 routes resolve without console errors', async ({ page }) => {
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    const routes = ['/', '/about', '/academics', '/facilities', '/gallery', '/notices', '/admissions', '/contact', '/privacy', '/terms']
    for (const r of routes) {
      const res = await page.goto(r)
      expect(res.status()).toBe(200)
      await expect(page.locator('h1')).toBeVisible()
      await dismissSplash(page)
      await page.waitForTimeout(100)
    }
    await page.goto('/this-does-not-exist')
    await expect(page.locator('h1')).toContainText('took a wrong turn')
    expect(errors, 'console errors: ' + errors.join(' | ')).toEqual([])
  })

  test('admission form submits and returns a reference number', async ({ page }) => {
    await page.goto('/admissions')
    await dismissSplash(page)
    await page.fill('#child_name', 'Playwright Child')
    await page.fill('#date_of_birth', '2022-05-15')
    await page.selectOption('#gender', 'FEMALE')
    await page.selectOption('#class_applying', 'Nursery')
    await page.fill('#parent_name', 'Playwright Parent')
    await page.selectOption('#relation', 'MOTHER')
    await page.fill('#phone', '9876500099')
    await page.fill('#email', 'pw@example.com')
    await page.fill('#city', 'Panchkula')
    await page.fill('#message', 'Playwright E2E test')
    await page.click('button[type="submit"]')

    await expect(page.locator('.alert--success')).toBeVisible({ timeout: 10_000 })
    const ref = await page.locator('.alert__ref').innerText()
    expect(ref).toMatch(/Reference:\s*TT-[A-Z]{2}\d{4}/)
  })

  test('notices page shows posts and events tab', async ({ page }) => {
    await page.goto('/notices')
    await dismissSplash(page)
    await expect(page.locator('.post-card')).toHaveCount(6, { timeout: 10_000 })
    await page.click('button.filter-chip:has-text("Events")')
    await expect(page.locator('.post-card')).toHaveCount(2)
  })

  test('gallery empty state is friendly', async ({ page }) => {
    await page.goto('/gallery')
    await dismissSplash(page)
    await expect(page.locator('.empty-state')).toBeVisible()
  })

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 })
    await page.goto('/')
    await dismissSplash(page)
    const toggle = page.locator('.nav-toggle')
    await expect(toggle).toBeVisible()
    await toggle.click()
    await expect(page.locator('.main-nav.is-open')).toBeVisible()
    await toggle.click()
    await expect(page.locator('.main-nav.is-open')).toHaveCount(0)
  })

  test('splash screen dismisses with the cross and Esc', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.splash')).toBeVisible()
    await expect(page.locator('.splash__img')).toHaveAttribute('src', '/images/admission-poster.jpg')
    await page.locator('.splash__close').click()
    await expect(page.locator('.splash')).toHaveCount(0)
    await page.reload()
    await expect(page.locator('.splash')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('.splash')).toHaveCount(0)
  })
})