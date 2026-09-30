# NextGenies Website

The NextGenies website is a React/Vite frontend with an Express/MySQL backend. It includes the public agency website, contact form, SEO-friendly blog pages, and a protected admin workspace for publishing blog posts and uploading cover images.

## Features

- Responsive marketing website for NextGenies
- React Router pages for services, about, contact, legal pages, blogs, and admin
- Contact form backed by MySQL and optional SMTP notifications
- Public blog index at `/blogs`
- Individual blog articles at `/blogs/:slug`
- Admin blog workspace at `/admin`
- Admin login protected by signed JWT tokens
- Blog title, slug, SEO description, author, content, publish status, and cover image fields
- MySQL tables created automatically on backend startup
- Image uploads limited to 5 MB and common image formats
- SEO metadata, canonical URLs, `robots.txt`, and sitemap

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- ESLint
- React Compiler

### Backend

- Node.js with Express 5
- MySQL via `mysql2`
- JWT authentication
- Multer image uploads
- Nodemailer contact email notifications
- Helmet, CORS, and rate limiting

## Project Structure

```text
NEXT-GENIES/
├── backend/
│   ├── server.js          Express API, database setup, auth, uploads
│   ├── package.json       Backend dependencies and scripts
│   └── README.md          Backend-specific notes
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── uploads/           Runtime blog images
├── src/
│   ├── components/        Shared navigation, footer, SEO, and error UI
│   ├── pages/             Route-level React pages
│   ├── styles/main.css    Global styles
│   ├── App.jsx            Routes and page loading
│   └── main.jsx           Frontend entry point
├── .env.example           Frontend environment template
├── package.json           Frontend scripts and dependencies
└── vite.config.js
```

## Requirements

- Node.js 18 or newer
- npm
- MySQL 8 or a compatible MySQL server
- SMTP credentials if contact email notifications are required

## Local Setup

### 1. Install frontend dependencies

From the `NEXT-GENIES` directory:

```powershell
npm install
```

### 2. Configure the frontend

Copy the frontend environment template:

```powershell
Copy-Item .env.example .env
```

Leave `VITE_API_URL` empty when the frontend and backend share the same origin. When the API runs separately, set it to the API origin:

```env
VITE_API_URL=https://api.example.com
```

### 3. Configure the backend

Create `backend/.env`. Do not commit this file.

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database
DB_USER=your_database_user
DB_PASSWORD=your_database_password

ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=use-a-strong-password
ADMIN_JWT_SECRET=generate-a-long-random-secret

FRONTEND_ORIGINS=http://localhost:5173
PORT=5000

# Optional contact email settings
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
EMAIL_TO=
EMAIL_TO2=
EMAIL_TO3=
```

Generate a JWT secret in PowerShell with:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

The JWT secret signs admin session tokens. Keep it private. Changing it invalidates existing admin sessions.

### 4. Install backend dependencies

```powershell
cd backend
npm install
```

### 5. Start the backend

From the `backend` directory:

```powershell
npm run dev
```

The API runs on `http://localhost:5000` by default. It checks the MySQL connection and creates the `contacts` and `blogs` tables automatically.

### 6. Start the frontend

Open a second terminal in the `NEXT-GENIES` directory:

```powershell
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Blog Workflow

1. Open `/admin`.
2. Sign in with `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
3. Enter the blog title, optional slug, SEO description, content, and author.
4. Select an image up to 5 MB in JPEG, PNG, WebP, or GIF format.
5. Choose whether to publish immediately.
6. Published posts appear on `/blogs`.
7. Each article can be opened at `/blogs/:slug` by clicking its title, image, or Read article link.

Blog text and metadata are stored in MySQL. Uploaded images are stored in `public/uploads` on the backend server and are served through `/uploads/...`.

## API Endpoints

### Public

```text
GET  /api/health
GET  /api/blogs
GET  /api/blogs/:slug
POST /api/contacts
```

### Admin

These endpoints require `Authorization: Bearer <token>` after login:

```text
POST   /api/admin/login
GET    /api/admin/blogs
POST   /api/admin/blogs
DELETE /api/admin/blogs/:id
```

Admin login is rate-limited. Blog creation and deletion are protected by JWT authentication.

## Available Scripts

### Frontend

```powershell
npm run dev       # Start Vite development server
npm run build     # Create production build in dist/
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

### Backend

```powershell
npm run dev       # Start API with Node watch mode
npm start         # Start API normally
```

## Production Deployment

1. Push the repository to GitHub without committing `.env` files.
2. Build the frontend with `npm run build`.
3. Configure the backend environment variables on Hostinger or the selected server.
4. Install frontend and backend dependencies on the server.
5. Start the backend with `npm start`.
6. Serve the generated `dist` directory through the website domain.
7. Set `FRONTEND_ORIGINS` to the exact production frontend origin.
8. Set `VITE_API_URL` to the public backend URL when frontend and backend use different origins.
9. Confirm `/api/health`, `/blogs`, and `/admin` after deployment.

### Upload persistence

The current implementation stores images on local server disk. A normal code update should preserve them if the hosting platform keeps the same application directory, but a clean deployment can remove untracked runtime files. Before relying on this in production:

- Confirm Hostinger's deployment behavior for `public/uploads`.
- Back up the MySQL database and `public/uploads`.
- For larger or more reliable deployments, move images to persistent storage such as Cloudinary, Amazon S3, or an S3-compatible object store.

Public blog images must be readable by visitors for SEO. The upload and delete operations remain admin-only.

## SEO Files and Practices

- `public/robots.txt` allows public crawling and blocks `/admin`.
- `public/sitemap.xml` contains the main public routes and blog index.
- Page-level titles, descriptions, and canonical URLs are managed by `src/components/SEO.jsx`.
- Individual blog pages use their own title, description, and canonical URL.
- Use descriptive blog slugs and SEO descriptions when publishing.
- Submit `https://your-domain.com/sitemap.xml` to Google Search Console after deployment.

## Security Notes

- Never commit `.env`, database credentials, SMTP credentials, admin passwords, or JWT secrets.
- Use HTTPS in production.
- Use a unique, strong admin password.
- Keep `ADMIN_JWT_SECRET` only on the backend.
- Rotate credentials immediately if they are exposed.
- Keep database and upload backups separate from the Git repository.
- Restrict `FRONTEND_ORIGINS` in production instead of allowing arbitrary origins.

## Troubleshooting

### Backend exits during startup

Check that `backend/.env` contains all required database and admin variables, then verify that MySQL is reachable.

### Contact form fails

The contact record can still be stored when SMTP is unavailable, but confirmation emails require valid `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_TO` values.

### Blogs do not load

Check that the backend is running, `VITE_API_URL` points to the correct API origin, the frontend origin is listed in `FRONTEND_ORIGINS`, and `/api/health` reports a connected database.

### Images disappear after deployment

The deployment likely replaced the local upload directory. Restore from backup and move uploads to persistent disk or object storage.
