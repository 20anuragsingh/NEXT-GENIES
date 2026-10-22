# NextGenies — Digital Growth Agency

NextGenies is a high-performance digital growth agency web application built with a modern React 19 frontend and an Express 5 / MySQL backend. The platform combines a refined minimalist neumorphic & glassmorphic design system, an interactive multi-step project questionnaire, case studies, FAQ rich-snippet SEO schema, a complete journal/blog system, and a JWT-secured admin workspace.

---

## 🌟 Key Features

### Frontend & Experience
* **Minimalist Neumorphic & Glassmorphic Design System**: Tactile neumorphic surfaces with soft, natural ambient shadows and crisp frosted-glass materials (`tokens.css`).
* **Zero-Glare Color Palette**: Carefully calibrated light (`#edf1f5`) and dark (`#15181f`) themes with a refined indigo accent (`#4355b9` / `#6574cc`) eliminating harsh white or neon glare.
* **Reactive Dark/Light Mode**: Subscribed via React 19 `useSyncExternalStore` for flicker-free theme detection with an animated sun/moon toggle and pre-paint local storage hydration.
* **Proven Outcomes & Case Studies**: Live metric cards showcasing client impact across content, web development, and branding.
* **Interactive FAQ Accordion**: Expandable Q&A with Schema.org `FAQPage` structured data for search engine rich snippets.
* **Scroll-Driven Services Stack**: Interactive pinned card stack on `/services` showing core deliverables with smooth progress tracking and reduced-motion fallbacks.
* **Interactive 9-Step Questionnaire (`/contact`)**:
  * Step-by-step project discovery wizard with keyboard accessibility and auto-focus management.
  * **Session Storage Draft Persistence**: Answers and step positions automatically survive accidental page refreshes.
  * Direct WhatsApp and email escape hatches for visitors wanting immediate contact.
* **Journal & Insights Engine (`/blogs`)**:
  * Category filtering and live search.
  * Social sharing buttons and reading time calculations.
  * Prerendered static blog pages for maximum SEO crawlability.
* **Mobile-First Responsiveness**: Handcrafted fluid layouts across narrow screens (320px–480px), tablets (768px–900px), and desktops, with touch-scrollable chip drawers and auto-fitting CTAs.

### Backend & CMS
* **Protected Admin Dashboard (`/admin`)**: JWT-authenticated management portal for writing, publishing, editing, and deleting articles.
* **Database-Backed Media Storage**: Image uploads stored safely in MySQL `MEDIUMBLOB` columns, ensuring persistence across cloud container redeployments.
* **Transactional Email Alerts**: Optional SMTP notifications sent to multiple agency inboxes upon project brief submissions.
* **Security & Hardening**: Helmet HTTP headers, CORS origin restrictions, rate-limiting on sensitive endpoints, and strict input validation.

---

## 🛠 Tech Stack

### Frontend
* **Core**: React 19, React DOM 19, React Router 7
* **Tooling**: Vite 8, Babel React Compiler, ESLint 10
* **Styles**: Native CSS variables & design tokens (zero heavy CSS framework overhead)
* **SEO**: Prerendered routes via `@rolldown/plugin-babel` and `scripts/generate-seo.mjs`

### Backend
* **Runtime**: Node.js 18+ with Express 5
* **Database**: MySQL 8 via `mysql2`
* **Authentication**: JSON Web Tokens (`jsonwebtoken`)
* **File Handling**: `multer` with MIME-type and size validation
* **Mailing**: `nodemailer`
* **Security**: `helmet`, `cors`, `express-rate-limit`

---

## 📁 Project Structure

```text
NEXT-GENIES/
├── backend/
│   ├── server.js              # Express API, MySQL connection, auth, and upload handlers
│   ├── package.json           # Backend dependencies and scripts
│   └── README.md              # Backend-specific documentation
├── public/
│   ├── ng-logo-transparent.png# Vector brand logos
│   ├── ng-logo-192.png        # Favicons and PWA icons
│   ├── robots.txt             # Search crawler directives
│   ├── sitemap.xml            # Auto-generated XML sitemap
│   └── site.webmanifest       # PWA manifest
├── scripts/
│   └── generate-seo.mjs       # Static prerendering and sitemap generation script
├── src/
│   ├── assets/                # Visual media and art assets
│   ├── components/            # Reusable UI components
│   │   ├── ErrorBoundary.jsx  # Client error boundary
│   │   ├── Footer.jsx         # Site-wide footer with quick navigation
│   │   ├── Icon.jsx           # SVG icon library
│   │   ├── Navbar.jsx         # Glassmorphic navbar with mobile drawer & theme switcher
│   │   ├── Reveal.jsx         # Scroll animation observer wrapper
│   │   └── SEO.jsx            # Dynamic document head & JSON-LD injection
│   ├── data/
│   │   └── questionnaire.js   # Questionnaire steps, services, and scope options
│   ├── hooks/
│   │   ├── useReveal.js       # Intersection observer, count-up, & reduced motion hooks
│   │   └── useTheme.js        # useSyncExternalStore theme hook
│   ├── lib/
│   │   ├── analytics.js       # Google Analytics event dispatchers
│   │   ├── api.js             # Client API wrapper with timeout and AbortController
│   │   ├── auth.js            # Admin JWT token storage helpers
│   │   ├── blogStore.js       # In-memory blog state and caching
│   │   ├── site.js            # Site URLs, contacts, and formatting helpers
│   │   └── textUtils.js       # Reading time and text utility functions
│   ├── pages/                 # Route components
│   │   ├── Home.jsx           # Landing page with hero, stats, case studies, & FAQ
│   │   ├── Services.jsx       # Scroll-pinned interactive services stack
│   │   ├── About.jsx          # Agency story, mission, and core values
│   │   ├── Contact.jsx        # 9-step project questionnaire with draft saving
│   │   ├── Blogs.jsx          # Public blog index with category filter & search
│   │   ├── BlogPost.jsx       # Individual article reader with social share
│   │   ├── Admin.jsx          # Protected blog editor and lead inbox
│   │   ├── NotFound.jsx       # 404 error page
│   │   └── legal/             # Privacy Policy, Terms, Cookies, Disclaimer
│   ├── seo/
│   │   └── routes.js          # Route meta title, description, and canonical mappings
│   ├── styles/                # Modular CSS architecture
│   │   ├── tokens.css         # Design tokens, color schemes, and shadow definitions
│   │   ├── base.css           # Typography, reset, and layout containers
│   │   ├── components.css     # Buttons, glass surfaces, navbar, and input fields
│   │   ├── pages.css          # Page-specific hero, case studies, FAQs, and deck styles
│   │   └── genie.css          # Genie graphic ambient styling and animations
│   ├── App.jsx                # Route declarations and suspense fallbacks
│   └── main.jsx               # React DOM hydration entry point
├── .env                       # Local frontend environment (not committed)
├── package.json               # Frontend dependencies and build scripts
└── vite.config.js             # Vite configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **MySQL**: v8.0 or compatible database instance

### 2. Frontend Installation & Configuration

1. In the root directory, install dependencies:
   ```bash
   npm install
   ```

2. Create your frontend environment file (do not commit it):
   ```bash
   # Create a file named .env in the project root
   ```

   If `.env.example` is not present in your checkout, create `.env` manually.
3. Update `.env`:
   ```env
   VITE_SITE_URL=https://nextgenies.com
   VITE_API_URL=http://localhost:5000
   ```

   For a local same-origin setup, `VITE_API_URL` can be left blank when the
   backend is serving the frontend. For production, use the public API URL
   described in [Hostinger deployment](#hostinger-deployment).

### 3. Backend Installation & Configuration

1. Navigate to the `backend` folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=nextgenies_db
   DB_USER=root
   DB_PASSWORD=your_password

   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   ADMIN_JWT_SECRET=your_jwt_secret_key

   FRONTEND_ORIGINS=http://localhost:5173
   PORT=5000

   # Optional SMTP credentials for lead notification emails
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   EMAIL_FROM=NextGenies <no-reply@nextgenies.com>
   EMAIL_TO=team@nextgenies.com
   ```

3. Generate a secure random JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### 4. Running Locally

* **Run Backend** (terminal 1):
  ```bash
  cd backend
  npm run dev
  ```
  *The backend automatically connects to MySQL and creates the `contacts` and `blogs` tables on startup.*

* **Run Frontend** (terminal 2):
  ```bash
  npm run dev
  ```
  *Visit `http://localhost:5173` in your browser.*

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with HMR. |
| `npm run build` | Builds the client bundle and generates static SEO prerendered routes. |
| `npm run lint` | Runs ESLint across all JavaScript/JSX source files. |
| `npm run preview` | Starts a local server to preview the production build in `dist/`. |
| `npm run seo` | Runs `scripts/generate-seo.mjs` to rebuild static sitemaps and route HTML. |

---

## 🌐 API Reference

### Public Endpoints
* `GET /api/health` — Returns server status and database connectivity.
* `GET /api/blogs` — Fetches list of published blog posts.
* `GET /api/blogs/:slug` — Fetches a single blog post by URL slug.
* `GET /api/blogs/:id/image` — Serves stored article cover images.
* `POST /api/contacts` — Submits questionnaire responses and sends email alerts.

### Protected Admin Endpoints
*Requires `Authorization: Bearer <token>` header.*
* `POST /api/admin/login` — Authenticates credentials and returns a signed JWT.
* `GET /api/admin/blogs` — Retrieves all articles (drafts and published).
* `POST /api/admin/blogs` — Creates or edits an article (supports `multipart/form-data`).
* `DELETE /api/admin/blogs/:id` — Deletes an article and its associated image data.

---

## 🎨 Design System Guide

The application uses native CSS custom properties defined in `src/styles/tokens.css`:

| Token | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--bg` | `#edf1f5` | `#15181f` | Primary viewport background |
| `--bg-2` | `#e3e8ef` | `#101217` | Card and secondary surfaces |
| `--ink` | `#111620` | `#edf0f5` | Primary body and heading typography |
| `--muted` | `#586374` | `#959fae` | Secondary copy, captions, and dates |
| `--accent` | `#4355b9` | `#6574cc` | Primary buttons, active tabs, highlights |
| `--sh-dark` | `rgba(158, 172, 193, 0.42)` | `rgba(0, 0, 0, 0.45)` | Neumorphic ambient drop shadow |
| `--sh-light`| `rgba(255, 255, 255, 0.72)` | `rgba(255, 255, 255, 0.035)`| Soft matte surface highlight (non-glare) |
| `--glass-bg`| `rgba(255, 255, 255, 0.58)`| `rgba(26, 30, 39, 0.55)` | Frosted glass card backdrop |

---

## 🚢 Hostinger Deployment

The recommended Hostinger setup runs the Express backend and the built
frontend in one Node.js application. The backend serves `dist/`, the API is
available under `/api`, and the website and API use the same origin:

```text
https://nextgenies.com
https://nextgenies.com/api/health
```

### 1. Create the Hostinger database

In hPanel, create a MySQL database and user, then grant the user access to
the database. Record the exact database host, name, username, password, and
port. The backend creates the `contacts` and `blogs` tables on first startup.

The local SQLite file is not migrated automatically. Export or manually
recreate any local blog posts and contacts that must be retained.

### 2. Configure production environment variables

Set these values in Hostinger's Node.js environment settings or in a private
`backend/.env` file. Never place secrets in `public/` or commit them.

```env
NODE_ENV=production
PORT=5000

VITE_SITE_URL=https://nextgenies.com
VITE_API_URL=
SEO_API_URL=https://nextgenies.com

DB_HOST=your_hostinger_mysql_host
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

ADMIN_USERNAME=your_real_admin_username
ADMIN_PASSWORD=your_long_unique_admin_password
ADMIN_JWT_SECRET=your_long_random_jwt_secret

FRONTEND_ORIGINS=https://nextgenies.com,https://www.nextgenies.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email_address
SMTP_PASS=your_google_app_password
EMAIL_FROM=NextGenies <your_email_address>
EMAIL_TO=your_business_email
```

Generate a JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Production startup intentionally fails when the admin secrets or required
MySQL settings are missing. Do not use the development defaults.

### 3. Build the application

From the project root:

```bash
npm install
npm run lint
npm run build
```

The build creates `dist/`, route-specific prerendered HTML, `dist/robots.txt`,
and `dist/sitemap.xml`. If published blog posts should be included in the
build-time sitemap and prerendered pages, make the production API available
at `SEO_API_URL` while running the build. The backend sitemap remains dynamic
after deployment.

Install backend dependencies as well:

```bash
cd backend
npm install
cd ..
```

### 4. Configure the Hostinger Node.js application

In hPanel, create or configure the Node.js application with:

```text
Application root: NEXT-GENIES
Startup file: backend/server.js
Environment: production
Node.js: 20 or newer
```

Upload the application source, `dist/`, and both package manifests. Do not
upload `node_modules/`, `.env`, `backend/.env`, `.git/`, or local database
files unless you intentionally migrate their data.

Restart the Node.js application after setting environment variables.

### 5. Configure the domain and HTTPS

Point `nextgenies.com` and, if required, `www.nextgenies.com` to the
Hostinger application. Enable SSL and force HTTPS. The canonical site URL
used by this project is `https://nextgenies.com`; redirect the `www` version
to it if that is your chosen primary domain.

If Hostinger requires a separate API subdomain instead, use:

```env
VITE_API_URL=https://api.nextgenies.com
SEO_API_URL=https://api.nextgenies.com
FRONTEND_ORIGINS=https://nextgenies.com,https://www.nextgenies.com
```

### 6. Verify the live deployment

Check these URLs after the application starts:

```text
https://nextgenies.com/
https://nextgenies.com/services/
https://nextgenies.com/blogs/
https://nextgenies.com/robots.txt
https://nextgenies.com/sitemap.xml
https://nextgenies.com/api/health
```

The health endpoint should return `"status": "ok"` and `"database": "mysql"`.
Also test the contact form, admin login at `/admin`, blog creation and image
upload, publishing, email delivery, mobile layouts, HTTPS redirects, and both
`www` and non-`www` hostnames.

## 📈 Google Analytics

The Google tag is included in `index.html`. Confirm that its Measurement ID
belongs to the intended Google Analytics 4 web data stream before deploying.
If it must be changed, update the `G-XXXXXXXXXX` value in `index.html` and
run `npm run build` again.

After deployment:

1. Open Google Analytics and select the correct GA4 property.
2. Open **Reports → Realtime**.
3. Visit the live website in another browser or a private window.
4. Confirm that the visit and page views appear.

The application also sends SPA route changes and selected interaction events
through `src/lib/analytics.js`.

## 🔎 Google Search Console

1. Open Google Search Console and add a **Domain** property for:
   `nextgenies.com`.
2. Copy the TXT verification record provided by Google.
3. Add the TXT record in Hostinger DNS.
4. Wait for DNS propagation and click **Verify**.
5. Keep the TXT record in DNS after verification.
6. Open **Sitemaps** and submit:
   `https://nextgenies.com/sitemap.xml`
7. Use **URL Inspection** for the home page and request indexing.

Before submitting, confirm that `robots.txt`, `sitemap.xml`, canonical tags,
page titles, descriptions, and HTTPS redirects all use the production domain.

---

## 📄 License

Private & proprietary to NextGenies. All rights reserved.
