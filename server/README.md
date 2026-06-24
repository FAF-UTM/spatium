# Spatium Server

Node.js / Express CMS API for the Spatium site. MongoDB (Mongoose), JWT auth,
MongoDB-backed sessions, and Cloudinary image uploads. It powers the public
site (News, Projects, Gallery, dynamic Pages) and the admin dashboard.

## Stack

- **Express 4** — HTTP server
- **Mongoose 8** — MongoDB ODM (`MONGODB_URI`)
- **JWT** — stateless auth (`JWT_SECRET`, `JWT_EXPIRES_IN`)
- **express-session + connect-mongo** — server-side sessions (`SESSION_SECRET`)
- **multer + cloudinary** — image upload to Cloudinary
- **helmet, cors, express-rate-limit** — hardening

## Setup

```bash
cd server
npm install
# .env is already provided (see .env.example for the required keys)
npm run dev      # nodemon, http://localhost:3000
# or
npm start
```

On first start the server auto-creates a default admin if none exists:

- **username:** `admin`  (or email `admin@spatium.md`)
- **password:** `Password1234567.`  ← change it after first login (Admin → Account)

### Migrate the legacy static content

Imports `client/public/json/*.json` into MongoDB and uploads every referenced
local image to Cloudinary:

```bash
npm run import:content          # only fills empty collections
npm run import:content -- --fresh   # wipe + re-import
```

## Environment variables

All config comes from `.env` (see `.env.example`). Required: `MONGODB_URI`,
`JWT_SECRET`, `SESSION_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`. The process exits at startup if any are missing. No
secrets are hardcoded. `CLIENT_URL` is the allowed CORS origin (comma-separated
list supported); localhost origins are always allowed for local dev.

## API

Base URL: `http://localhost:<PORT>` (default `3000`).

| Method | Route                     | Auth         | Description                       |
| ------ | ------------------------- | ------------ | --------------------------------- |
| GET    | `/health`                 | –            | Health check                      |
| POST   | `/auth/login`             | –            | Login (`identifier` = user/email) |
| POST   | `/auth/logout`            | –            | Destroy session                   |
| GET    | `/auth/me`                | Bearer       | Current user                      |
| PUT    | `/auth/change-password`   | Bearer       | Change own password               |
| GET    | `/users`                  | admin        | List users                        |
| POST   | `/users`                  | admin        | Create user                       |
| PUT    | `/users/:id`              | admin        | Update profile / role             |
| PUT    | `/users/:id/password`     | admin        | Reset a user's password           |
| DELETE | `/users/:id`              | admin        | Delete user                       |
| POST   | `/upload`                 | admin        | Upload one image (`image` field)  |
| GET    | `/news` `/projects` `/gallery` | –       | List items (`?all=true` = admin)  |
| POST   | `/news` `/projects` `/gallery` | admin   | Create (JSON or multipart+image)  |
| PUT    | `/news/:id` …             | admin        | Update                            |
| DELETE | `/news/:id` …             | admin        | Delete (+ Cloudinary asset)       |
| GET    | `/pages`                  | –            | List pages                        |
| GET    | `/pages/by-link/:link`    | –            | Page by slug (public render)      |
| POST   | `/pages`                  | admin        | Create page                       |
| PUT    | `/pages/:id`              | admin        | Update page                       |
| DELETE | `/pages/:id`              | admin        | Delete page                       |

Authenticate with `Authorization: Bearer <token>` or the session cookie.

## Project layout

```
src/
  config/      env, db, cloudinary, seed (default admin)
  middleware/  auth, upload, validate, errorHandler
  models/      User, News, Project, Gallery (shared cardSchema), Page
  controllers/ auth, user, content (factory), page, upload
  routes/      auth, users, upload, pages, contentRouter (factory)
  scripts/     createAdmin, importContent
  app.js       express wiring
  server.js    bootstrap (connect → seed → listen)
```

## Deploying on Oracle Cloud (notes)

- Run `npm ci && npm start` behind a process manager (pm2/systemd) on the VM,
  or containerise with a Node 18+ image.
- Put nginx in front for TLS; the app already calls `app.set('trust proxy', 1)`
  in production so secure session cookies work behind the proxy.
- Set `NODE_ENV=production` and `CLIENT_URL` to the deployed frontend origin
  (e.g. `https://spatium.utm.md`). Add extra origins comma-separated if needed.
- Point the built frontend's `VITE_API_URL` at this API's public URL.
- MongoDB Atlas works as-is via `MONGODB_URI`; whitelist the VM's IP.
```
