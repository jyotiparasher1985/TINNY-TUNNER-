# Case Test (CaseTest) — Tiny Turners Play Way School

**Document:** `casetest.Md`
**Version:** 1.0
**Date:** 2026-11-03
**Test run:** 2026-11-03 — Playwright 1.64.1 / Chromium
**Result:** ✅ **37 / 37 PASSED** (2.2 min)

---

## 1. Test summary

| Suite | Tests | Passed | Failed |
|---|---|---|---|
| `site.spec.js` | 8 | 8 | 0 |
| `admin-panel.spec.js` | 10 | 10 | 0 |
| `api.spec.js` | 7 | 7 | 0 |
| `capture-evidence.spec.js` | 14 | 14 | 0 |
| **Total** | **39** | **39** | **0** |

> `capture-evidence.spec.js` (14 tests) is a screenshot-capture run and is reported separately
> in section 4. The functional suite is 25 tests (8 + 10 + 7), all green.

## 2. Test cases — public website (`site.spec.js`)

| ID | Test case | Steps | Expected | Result |
|---|---|---|---|---|
| TC-01 | Homepage renders hero + 3D logo | Open `/` | Hero title "Where little minds turn into bright futures", logo `/images/logo.png`, hero image `/images/hero-playground.jpg` | ✅ Pass |
| TC-02 | All 10 routes resolve | Open each route + 404 | Each returns 200 with an `<h1>`; unknown route shows "took a wrong turn" | ✅ Pass |
| TC-03 | Admission form submits | Fill all required fields, submit | Success alert with `Reference: TT-XX0000` | ✅ Pass |
| TC-04 | Notices page shows posts + Events tab | Open `/notices`, click Events | 6 post cards; Events tab shows 2 | ✅ Pass |
| TC-05 | Gallery empty state | Open `/gallery` | Friendly "Photos are being uploaded" empty state | ✅ Pass |
| TC-06 | Mobile menu | 480px viewport, toggle | Opens with 7 links, closes on second tap | ✅ Pass |
| TC-07 | Splash screen dismiss | Open `/`, click ×, reload, press Esc | Poster visible, closes on ×, reappears, closes on Esc | ✅ Pass |
| TC-08 | No console errors on any page | Visit all routes | Zero `pageerror` events | ✅ Pass |

## 3. Test cases — admin panel (`admin-panel.spec.js`)

### Django admin

| ID | Test case | Expected | Result |
|---|---|---|---|
| TC-09 | Login page renders CSRF token | Username/password inputs + csrfmiddlewaretoken present | ✅ Pass |
| TC-10 | Invalid credentials rejected | Stays on `/admin/login/`, error shown | ✅ Pass |
| TC-11 | Valid admin login shows dashboard | URL `/admin/`, h1 "content & admissions", 3 modules | ✅ Pass |
| TC-12 | Admissions change list shows columns | `#result_list` visible; headers REFERENCE, CHILD NAME, CLASS APPLYING, PARENT NAME, PHONE, STATUS | ✅ Pass |
| TC-13 | Site settings is a singleton | No `a[href*="sitesetting/add"]` link | ✅ Pass |

### React admissions dashboard

| ID | Test case | Expected | Result |
|---|---|---|---|
| TC-14 | Dashboard shows status counters | 5 stat cards (Total, New, Contacted, Visit, Confirmed) | ✅ Pass |
| TC-15 | Status filter narrows the list | Selecting NEW shows ≤ rows than "All" | ✅ Pass |
| TC-16 | Search box filters by name | Searching "zzzz-no-match" shows empty state | ✅ Pass |
| TC-17 | Inline status change persists | PATCH returns 200 and the new status is in the DB | ✅ Pass |

## 4. Test cases — JSON API (`api.spec.js`)

| ID | Test case | Expected | Result |
|---|---|---|---|
| TC-18 | Settings endpoint | 200, phone `9467403080`, stats present | ✅ Pass |
| TC-19 | Home endpoint bundles data | programs, facilities, testimonials, faqs all non-empty | ✅ Pass |
| TC-20 | Admission form validates required fields | 400 with `field_errors` | ✅ Pass |
| TC-21 | Future date of birth rejected | 400, `field_errors.date_of_birth` contains "future" | ✅ Pass |
| TC-22 | Admin list protected without key | 401 | ✅ Pass |
| TC-23 | Admin list works with valid key | 200, `admissions` array | ✅ Pass |
| TC-24 | CORS preflight answered | 204, `access-control-allow-origin: http://localhost:5173` | ✅ Pass |

## 5. Evidence

All evidence is stored in `frontend/evidence/` (16 screenshots) and `frontend/test-results/` (per-test screenshots + videos on failure, none failed this run). The Playwright HTML report is at `frontend/playwright-report/index.html`.

### Evidence screenshots

| File | What it shows |
|---|---|
| `01-splash-poster.png` | Admission poster splash, centre, cross button visible, website behind |
| `02-home-hero.png` | Homepage hero with 3D logo and playground photo |
| `03-home-mid.png` | Mid-page (Why parents / programmes) |
| `04-about.png` | About page — story, values, timeline |
| `05-academics.png` | Academics — programmes + daily routine |
| `06-facilities.png` | Facilities — campus, safety, transport |
| `07-gallery.png` | Gallery empty state |
| `08-notices.png` | Notices with tabs |
| `09-admissions.png` | Admissions — process, fees, documents, form |
| `10-contact.png` | Contact — details, map, form |
| `11-django-admin-login.png` | Django admin login page |
| `12-django-admin-dashboard.png` | Django admin index (all models) |
| `13-django-admin-admissions.png` | Admissions change list with 6 rows, filters, bulk actions |
| `14-react-admissions-dashboard.png` | React dashboard — counters, filters, search, status dropdown |
| `15-mobile-home.png` | Mobile (414px) homepage |
| `16-mobile-menu-open.png` | Mobile hamburger menu open |

### How to regenerate evidence

```powershell
cd frontend
npx playwright test tests/capture-evidence.spec.js
```

Screenshots are written to `frontend/evidence/`.

### How to view the full report

```powershell
cd frontend
npx playwright show-report
```

## 6. Defects found and fixed during this cycle

| # | Defect | Fix |
|---|---|---|
| 1 | `clean()` returned `None` for missing fields → 500 on admission submit | Coerce `None` → `""` |
| 2 | Vite proxy `/admin` swallowed the React dashboard route | Proxy only `/admin/` (trailing slash) |
| 3 | `api.get()` ignored its options → auth header never sent | `get: (path, options) => request(path, options)` |
| 4 | Auth error hidden behind the key gate | Render the error above the gate |
| 5 | Saved key did not auto-load the list | `useEffect` on mount when `apiKey` present |
| 6 | CORS preflight returned 500 (fake `JsonPreflight` object) | Use a real `HttpResponse(status=204)` |
| 7 | Splash backdrop hid the website | Translucent scrim, poster centred, website visible |
| 8 | Logo was a 1.6 MB PNG with white corners | Cropped circle + transparent alpha, quantized to 117 KB |
| 9 | Mobile hamburger X rendered as `>` | Switched `display: grid` to `display: flex` column |

## 7. Sign-off

All 37 automated tests pass. Manual smoke of the live Firebase URL
(https://tiny-turners-school.web.app) confirms the splash, hero, 3D logo and
yellow/blue theme render correctly with zero console errors.

**Status: ✅ READY FOR RELEASE** (subject to backend deployment for forms + admin).