// tests/capture-evidence.spec.js
// Captures screenshots of every page + admin panel for the casetest.Md evidence.
import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const EVIDENCE = path.join(process.cwd(), 'evidence')
if (!fs.existsSync(EVIDENCE)) fs.mkdirSync(EVIDENCE, { recursive: true })

async function shot(page, name) {
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(EVIDENCE, name + '.png'), fullPage: false })
}

test.describe('Evidence capture', () => {
  test('splash screen', async ({ page }) => {
    await page.goto('/')
    await shot(page, '01-splash-poster')
  })

  test('homepage', async ({ page }) => {
    await page.goto('/')
    await page.locator('.splash__close').click()
    await expect(page.locator('.splash')).toHaveCount(0)
    await shot(page, '02-home-hero')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await shot(page, '03-home-mid')
  })

  test('about', async ({ page }) => {
    await page.goto('/about')
    await shot(page, '04-about')
  })

  test('academics', async ({ page }) => {
    await page.goto('/academics')
    await shot(page, '05-academics')
  })

  test('facilities', async ({ page }) => {
    await page.goto('/facilities')
    await shot(page, '06-facilities')
  })

  test('gallery', async ({ page }) => {
    await page.goto('/gallery')
    await shot(page, '07-gallery')
  })

  test('notices', async ({ page }) => {
    await page.goto('/notices')
    await shot(page, '08-notices')
  })

  test('admissions', async ({ page }) => {
    await page.goto('/admissions')
    await shot(page, '09-admissions')
  })

  test('contact', async ({ page }) => {
    await page.goto('/contact')
    await shot(page, '10-contact')
  })

  test('django admin login', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/admin/login/?next=/admin/')
    await shot(page, '11-django-admin-login')
  })

  test('django admin dashboard', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/admin/login/?next=/admin/')
    await page.fill('#id_username', 'admin')
    await page.fill('#id_password', 'school@123')
    await page.click('input[type="submit"]')
    await shot(page, '12-django-admin-dashboard')
  })

  test('django admin admissions', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/admin/login/?next=/admin/')
    await page.fill('#id_username', 'admin')
    await page.fill('#id_password', 'school@123')
    await page.click('input[type="submit"]')
    await page.goto('http://127.0.0.1:8000/admin/core/admission/')
    await shot(page, '13-django-admin-admissions')
  })

  test('react admissions dashboard', async ({ page }) => {
    await page.goto('/admin')
    const close = page.locator('.splash__close')
    if (await close.isVisible().catch(() => false)) await close.click()
    const input = page.locator('#adminkey')
    if (await input.isVisible().catch(() => false)) {
      await input.fill('tt-local-admin-key-2026')
      await page.click('button[type="submit"]')
    }
    await page.waitForTimeout(1000)
    await shot(page, '14-react-admissions-dashboard')
  })

  test('mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 })
    await page.goto('/')
    const close = page.locator('.splash__close')
    if (await close.isVisible().catch(() => false)) await close.click()
    await shot(page, '15-mobile-home')
    await page.locator('.nav-toggle').click()
    await shot(page, '16-mobile-menu-open')
  })
})