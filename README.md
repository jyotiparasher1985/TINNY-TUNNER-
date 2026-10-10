# Tiny Turners Play Way School — Website

Full-stack school website for **Tiny Turners Play Way School**, Barwala, Panchkula.

| Layer | Tech |
|---|---|
| Frontend | React 18 (Vite), React Router, plain CSS with design tokens |
| Backend | Django 6 + Python (JSON API) |
| Database | SQLite (switches to PostgreSQL with a one-line change) |
| Admin | Django admin (full CRUD) + a React admissions dashboard |

The original single-page design from Emergent has been rebuilt as a proper
multi-page site with a real database behind it.

---

## 1. Project layout

```
TINY TURNNER/
├── start.bat                    # one-click start of both servers
├── stop.bat                     # stop both servers
├── .venv/                       # Python virtual environment
│
├── backend/                     # Django project
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env                     # local secrets (copy from .env.example)
│   ├── config/                  # settings, urls, wsgi, asgi
│   │   ├── settings.py
│   │   └── urls.py
│   ├── core/                    # the one app
│   │   ├── models.py            # Admission, Post, GalleryImage, Program, ...
│   │   ├── views.py             # JSON API
│   │   ├── serializers.py
│   │   ├── admin.py             # content + admissions dashboard
│   │   ├── middleware.py        # dependency-free CORS
│   │   ├── urls.py
│   │   └── management/commands/seed_data.py
│   ├── media/                   # uploaded gallery / program photos
│   └── db.sqlite3
│
└── frontend/                    # React app
    ├── package.json
    ├── vite.config.js           # dev proxy → Django
    ├── .env
    └── src/
        ├── main.jsx
        ├── App.jsx              # routes
        ├── lib/api.js           # API client
        ├── context/SiteContext.jsx
        ├── components/          # Header, Footer, Layout, ContactForm, Icons
        ├── pages/               # Home, About, Academics, Facilities,
        │                        # Gallery, Notices, Admissions, Contact,
        │                        # AdminDashboard, LegalPages, NotFound
        └── styles/              # tokens.css, base.css, components.css
```

---

## 2. Run it locally

### Option A — one click

Double-click **`start.bat`**. It creates the venv, installs dependencies, runs
migrations, and opens both servers.

### Option B — manual

**Terminal 1 — backend**

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\.venv\Scripts\python.exe backend\manage.py migrate
.\.venv\Scripts\python.exe backend\manage.py seed_data
cd backend
..\.venv\Scripts\python.exe manage.py runserver 8000
```

**Terminal 2 — frontend**

```powershell
cd frontend
npm install
npm run dev
```

### URLs

| What | URL |
|---|---|
| Website | http://localhost:5173 |
| Django admin (content + admissions) | http://127.0.0.1:8000/admin/ |
| Admissions dashboard (React) | http://localhost:5173/admin |
| API root | http://127.0.0.1:8000/api/ |

**Default admin login:** `admin` / `school@123` — change this immediately.

> On `localhost:5173` the `/admin` route is the React dashboard and `/admin/`
> (trailing slash) is the Django admin. Vite's proxy only forwards the
> trailing-slash version.

---

## 3. Pages

| Route | Purpose |
|---|---|
| `/` | Home — hero, stats, why-us, programmes, facilities, transport, gallery preview, notices, testimonials, FAQs, admission form |
| `/about` | Story, values, school timeline, team, parent voices |
| `/academics` | Teaching approach, all programmes (from DB), daily routine |
| `/facilities` | Campus, safety, transport, timings |
| `/gallery` | Filterable photo grid (from DB) |
| `/notices` | Notices / News / Events with tabs and a read-more modal |
| `/admissions` | Process, fees, documents, full admission form |
| `/contact` | Contact details, map, message form, FAQs |
| `/privacy`, `/terms` | Legal pages |
| `/admin` | React admissions dashboard (filter, search, change status) |

---

## 4. Admin dashboard

### Django admin — `/admin/`

This is the main control room. Everything is editable here:

- **Admissions** — every submitted application, with search, filters
  (status / class / transport / "still open"), a date hierarchy, editable
  status column, and bulk actions (*Mark contacted / Confirmed / Closed*).
  Each application has a generated reference like `TT-AB0000`.
- **Site settings** — phone, WhatsApp, address, email, map link, admission
  session year and the homepage counters. Singleton row, cannot be deleted.
- **Posts** — Notices, News and Events (one model, three kinds). Featured and
  published toggles, cover image, event date/time/location.
- **Gallery images** — upload photos, caption, category, ordering.
- **Programmes** / **Facilities** — the content shown on Academics & Facilities.
- **Testimonials** / **FAQs** — homepage social proof and accordion.
- **Contact messages** — messages sent from the Contact page, read/unread.

### React dashboard — `localhost:5173/admin`

A lightweight read-mostly view of admissions: counters per status, status
filter, search, and inline status changes.

It needs the shared key. Set the same value in **both** files:

- `backend/.env` → `ADMIN_API_KEY=...`
- `frontend/.env` → `VITE_ADMIN_API_KEY=...`

Paste it into the "Enter admin key" box and it is remembered in the browser.

---

## 5. API reference

Base URL in development: `http://127.0.0.1:8000/api/`

### Read

| Method | Path | Notes |
|---|---|---|
| GET | `/api/settings/` | School contact details + stats |
| GET | `/api/home/` | Everything the homepage needs, one request |
| GET | `/api/programs/` | All programmes |
| GET | `/api/facilities/` | All facilities |
| GET | `/api/gallery/` | Photos; `?category=` to filter |
| GET | `/api/posts/` | `?kind=NOTICE\|NEWS\|EVENT\|ALL`, `?limit=` |
| GET | `/api/posts/<slug>/` | Single post |
| GET | `/api/testimonials/` | Parent quotes |
| GET | `/api/faqs/` | FAQ list |

### Write

| Method | Path | Body |
|---|---|---|
| POST | `/api/admissions/apply/` | child + parent details → returns a reference number |
| POST | `/api/contact/` | name, phone, message |

Errors come back as `{"ok": false, "error": "...", "field_errors": {...}}` so the
form can highlight individual inputs.

### Protected

| Method | Path | Auth |
|---|---|---|
| GET | `/api/admissions/` | `X-Admin-Key` header or logged-in session |
| PATCH | `/api/admissions/<id>/update/` | same |

Example:

```bash
curl -H "X-Admin-Key: tt-local-admin-key-2026" http://127.0.0.1:8000/api/admissions/
curl -X PATCH -H "X-Admin-Key: tt-local-admin-key-2026" \
     -H "Content-Type: application/json" \
     -d '{"status":"CONFIRMED"}' \
     http://127.0.0.1:8000/api/admissions/2/update/
```

---

## 6. Before you deploy

1. **Change the admin password**
   ```powershell
   .\.venv\Scripts\python.exe backend\manage.py changepassword admin
   ```

2. **Create `backend/.env` with production values**
   ```ini
   DJANGO_SECRET_KEY=<50+ random characters>
   DJANGO_DEBUG=0
   DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
   ADMIN_API_KEY=<another long random string>
   CORS_ALLOWED_ORIGINS=https://yourdomain.com
   ```

3. **Generate `frontend/.env`**
   ```ini
   VITE_API_URL=https://api.yourdomain.com
   VITE_ADMIN_API_KEY=<same as backend ADMIN_API_KEY>
   ```

4. **Collect static files**
   ```powershell
   .\.venv\Scripts\python.exe backend\manage.py collectstatic --noinput
   ```

   `DJANGO_DEBUG=0` automatically enables WhiteNoise compressed static files,
   secure cookies, and `X-Forwarded-Proto` support.

5. **Gallery / programme uploads** go to `backend/media/`. On a host with an
   ephemeral filesystem, switch to Cloud Storage — set `GCS_BUCKET` and
   `django-storages` takes over automatically (already wired in `settings.py`).

---

## 7. Hosting

### ✅ Frontend → Firebase Hosting (LIVE)

The React site is already published:

**https://tiny-turners-school.web.app**

Project console: https://console.firebase.google.com/project/tiny-turners-school/overview

To publish changes:

```powershell
.\deploy.bat
```

Or manually:

```powershell
cd frontend
npm run build
cd ..
firebase.cmd deploy --only hosting --project tiny-turners-school
```

> In PowerShell use `firebase.cmd` — the plain `firebase` command is blocked by
> the execution policy on this machine.

Config lives in `firebase.json`. The SPA rewrite sends every route to
`index.html`, so React Router works on hard refresh. Images get a one-year
immutable cache; `index.html` is always revalidated so new deploys show up.

### Backend → Cloud Run or Render

Firebase Hosting serves **static files only**, so the Django API (with its admin
panel, database and image uploads) needs a real server. Two prepared options:

**A. Cloud Run (Google, same console)**

1. Enable billing on the project — Cloud Run needs it even on the free tier:
   https://console.developers.google.com/billing
2. Enable the Cloud Run Admin API (the link Firebase prints on the first
   failing deploy).
3. Build the backend:
   ```powershell
   gcloud run deploy tiny-turners-api --source backend --region asia-south1
   ```
   `backend/Dockerfile` runs migrations, collects static files and starts
   gunicorn on `$PORT`.
4. Switch the rewrites on:
   ```powershell
   Copy-Item firebase.json firebase.json.static -Force
   Copy-Item firebase.json.with-api firebase.json -Force
   .\deploy.bat
   ```
   `/api`, `/admin`, `/media` and `/static` now proxy to Cloud Run, so the
   whole site runs on **one URL with no CORS**.

**B. Render (no Google billing needed)**

`render.yaml` is a ready blueprint. Push the repo to GitHub, then in Render:
**New → Blueprint → select the repo**. It creates the Django web service plus a
free Postgres and wires `DATABASE_URL` for you.

Then set `VITE_API_URL` to the backend URL and redeploy the frontend.

### Environment variables for the backend

| Variable | Purpose |
|---|---|
| `DJANGO_SECRET_KEY` | Required in production |
| `DJANGO_DEBUG` | `0` in production |
| `DJANGO_ALLOWED_HOSTS` | `*` or your domains |
| `ADMIN_API_KEY` | Key for the React admissions dashboard |
| `CORS_ALLOWED_ORIGINS` | `https://tiny-turners-school.web.app` |
| `DATABASE_URL` | Postgres URL — **without this, SQLite is ephemeral** |
| `GCS_BUCKET` | Cloud Storage bucket for uploaded images |
| `DJANGO_SECURE_SSL_REDIRECT` | `0` behind Firebase/Cloud Run proxies |

> **Important:** on Cloud Run the container filesystem is wiped on every
> deploy. Set `DATABASE_URL` and `GCS_BUCKET`, or admission forms and gallery
> photos will disappear each time you push.

### Also works: Vercel / Netlify

If you prefer another static host, the `frontend/dist` build is portable.

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `VITE_API_URL`, `VITE_ADMIN_API_KEY`

Vercel handles the SPA rewrite automatically for Vite projects. If it does not,
add `frontend/vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Backend → Render (manual, if not using the blueprint)

1. Push the project to GitHub.
2. Render → **New** → **Web Service** → pick the repo.
3. Root directory: `backend`
4. Build command:
   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --noinput
   ```
5. Start command: `gunicorn config.wsgi:application`
6. Add `gunicorn` to `backend/requirements.txt` and add this block to `settings.py`:
   ```python
   import os
   if os.environ.get("RAILWAY_ENVIRONMENT") or os.environ.get("RENDER"):
       ALLOWED_HOSTS = ["*"]
   ```
7. Environment variables: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=0`,
   `DJANGO_ALLOWED_HOSTS`, `ADMIN_API_KEY`, `CORS_ALLOWED_ORIGINS`
8. SQLite lives inside the container. For a real deployment move
   `DATABASES` to PostgreSQL and add `dj-database-url` + `psycopg`.

> **Free-tier caveat:** Render's free web services sleep after inactivity and
> have an ephemeral disk, so uploaded images and the SQLite file will reset.
> For a school site that must keep admissions data, use Railway (persistent
> volume) or Supabase/Neon for PostgreSQL.

### Everything on one host (simplest)

Serve the built React app from Django itself:

```powershell
cd frontend
npm run build
```

Then in `backend/config/urls.py` add, **above** the catch-all:

```python
from django.views.static import serve
from pathlib import Path

FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"

urlpatterns += [
    re_path(r"^(?!api/|admin/|media/|static/).*$",
            serve, {"document_root": FRONTEND_DIST}),
]
```

This gives one URL, one server, no CORS, and the Django admin still at `/admin/`.
Use this if you prefer a single Render/Railway service.

---

## 8. Adding content without touching code

Most of the site is database-driven, so day-to-day changes need no code:

| To change | Go to |
|---|---|
| Phone / WhatsApp / address / map | Admin → Site settings |
| Homepage counters (320+, 1:8 …) | Admin → Site settings → *Stats* (JSON) |
| Notices, news, events | Admin → Posts |
| Admission year label | Admin → Site settings → *Admission session year* |
| Gallery photos | Admin → Gallery images |
| Programmes & fees | Admin → Programmes |
| FAQs, testimonials | Admin → FAQs / Testimonials |

To re-load the starter content at any time:

```powershell
.\.venv\Scripts\python.exe backend\manage.py seed_data
```

It is idempotent — it updates existing rows instead of duplicating them.

---

## 9. Troubleshooting

**Port already in use**
```powershell
Get-Process python, node | Stop-Process -Force
.\stop.bat
```

**`npm` blocked by PowerShell execution policy** — use `npm.cmd` instead of `npm`.

**Changes to `.env` not picked up** — restart the Django server; env is read at startup.

**Gallery images 404** — `DJANGO_DEBUG` must be `1` locally for Django to serve
`/media/`, or the files must be served by your host in production.

**Form says "Could not reach the server"** — the Django server on port 8000 is
down, or you built the frontend and are serving it from another origin without
setting `VITE_API_URL`.