# NextGenies backend

## Start the API

1. Copy `.env.example` to `.env`.
2. In hPanel, open **Databases > Management** and copy the MySQL database username and password into `DB_USER` and `DB_PASSWORD`.
3. The supplied host (`srv1752.hstgr.io`) and database name (`u228244261_Nextgenies`) match your hosting account. Change them only if hPanel shows different values.
4. Run `npm install`, then `npm start`.

The server verifies the MySQL connection and creates the `contacts` and `blogs` tables automatically at startup.

## Admin blog publishing

Set these private values in the backend `.env` before starting the API:

```env
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=use-a-strong-password
ADMIN_JWT_SECRET=use-a-long-random-secret
```

Open `/admin` in the website to sign in. Blog images are limited to 5 MB and are stored in `public/uploads`; published posts appear at `/blogs` and the Blogs link is available in the footer.

## Frontend

Copy `Nextgenies/.env.example` to `Nextgenies/.env` for local development. For deployment, set `VITE_API_URL` to the public URL of this API (for example, `https://api.nextgenies.com`).
