# Ready For Test (RFT) — Tiny Turners Play Way School

**Document:** `Rft.Md`
**Version:** 1.0
**Date:** 2026-11-03
**Project:** Tiny Turners Play Way School — Full Stack Website
**Stack:** React 18 (Vite) + Django 6 (Python) + SQLite + Firebase Hosting

---

## 1. Scope of this RFT

This document declares that the Tiny Turners website is **ready to be tested** against the test cases
listed in `casetest.Md`. It covers:

- Public website (11 pages, responsive)
- Admission enquiry form (validation + submission + reference number)
- Contact form
- Django admin panel (content + admissions management)
- React admissions dashboard (filters, search, status updates)
- JSON API (settings, home, programs, facilities, gallery, posts, testimonials, FAQs, admissions, contact)
- CORS, splash screen, mobile menu, 3D logo

## 2. Test environment

| Item | Value |
|---|---|
| OS | Windows 11 |
| Node | v24.19.0 |
| Python | 3.14.6 |
| Django | 6.1.2 |
| Browser (automation) | Chromium 1.64.1 (Playwright) |
| Frontend (local) | http://localhost:5173 |
| Backend (local) | http://127.0.0.1:8000 |
| Live site | https://tiny-turners-school.web.app |
| Admin login | `admin` / `school@123` |
| Admin API key | `tt-local-admin-key-2026` |

## 3. Prerequisites to run the tests

1. Start both servers: `.\start.bat` (or start manually).
2. Seed the database: `.\.venv\Scripts\python.exe backend\manage.py seed_data`.
3. Install Playwright browsers (one-time): `cd frontend && npx playwright install chromium`.
4. Run the suite: `cd frontend && npx playwright test`.

## 4. Test framework

- **Tool:** Playwright 1.64.1 (Chromium only)
- **Config:** `frontend/playwright.config.js`
- **Specs:**
  - `frontend/tests/site.spec.js` — public site (8 tests)
  - `frontend/tests/admin-panel.spec.js` — Django admin + React dashboard (10 tests)
  - `frontend/tests/api.spec.js` — JSON API (7 tests)
  - `frontend/tests/capture-evidence.spec.js` — evidence screenshots (14 tests)

## 5. Entry / exit criteria

**Entry:** both servers up, DB seeded, Playwright installed.
**Exit:** all 37 automated tests pass + manual smoke of the live Firebase URL.

## 6. Out of scope (not tested here)

- Performance / load testing
- Cross-browser (Firefox, Safari) — only Chromium
- Production (Firebase) form submission — backend not deployed yet
- Email / SMS notifications
- Payment / fee collection

## 7. Known limitations

- Gallery is empty until an admin uploads photos (empty state is tested).
- Admin panel is reachable only on `localhost` until the Django backend is deployed (Cloud Run / Render).
- Free Firebase Hosting serves only static files; `/api` and `/admin/` do not work on the live URL yet.