# Deploying Spatium

- **Backend** → **Northflank** (Docker, `server/Dockerfile`)
- **Frontend** → **Cloudflare Pages** (Wrangler, static build of `client/`)
- **Database** → MongoDB Atlas · **Images** → Cloudinary (both external; only their
  credentials go into the backend env — nothing is hardcoded)

Deploy the **backend first** — you need its public URL to build the frontend.

---

## Part A — Backend on Northflank

### A1. Let Atlas accept Northflank
In **Atlas → Network Access**, add `0.0.0.0/0` (Northflank egress IPs are
dynamic; the DB is still protected by the user/password in `MONGODB_URI`).

### A2. Create the service
Northflank → **Create new → Service → Combined service**:
- **Repository:** this repo, branch `main`
- **Build type:** Dockerfile
- **Build context:** `/server`
- **Dockerfile path:** `/server/Dockerfile`
- **Networking → Ports:** add **`3000`**, HTTP, **Publicly exposed**
- **Health check:** HTTP, path `/health`, port `3000`

### A3. Environment variables
Add under the service's **Environment**:

| Key | Value |
| --- | ----- |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `MONGODB_URI` | your Atlas connection string |
| `JWT_SECRET` | long random string |
| `JWT_EXPIRES_IN` | `7d` |
| `SESSION_SECRET` | a different long random string |
| `CLOUDINARY_CLOUD_NAME` | … |
| `CLOUDINARY_API_KEY` | … |
| `CLOUDINARY_API_SECRET` | … |
| `CLIENT_URL` | leave blank for now (set in Part C) |

### A4. Deploy
Deploy, wait for green, and **copy the public URL** — call it the **API URL**
(e.g. `https://spatium-api--myproject.code.run`).

On first boot it auto-creates the admin **`admin` / `Password1234567.`**.

---

## Part B — Frontend on Cloudflare Pages

All commands run from `client/`.

### B1. Point the build at your backend
```bash
cd client
cp .env.production.example .env.production
# edit .env.production → VITE_API_URL=<the API URL from A4>
```
> `VITE_API_URL` is **baked into the bundle at build time**. If it's wrong, the
> app shows "Cannot reach the server…". Re-set it and rebuild to fix.

### B2. Authenticate Wrangler
```bash
npx wrangler login           # opens the browser for OAuth
# (CI alternative: export CLOUDFLARE_API_TOKEN=<token with "Pages: Edit">)
```

### B3. Create the Pages project (first time only)
```bash
npx wrangler pages project create spatium --production-branch main
```
(or create a project named **spatium** in the Cloudflare dashboard → Workers & Pages.)

### B4. Build & deploy
```bash
yarn deploy
```
This runs `predeploy` (`yarn build`) then `wrangler pages deploy ./dist
--project-name=spatium`. Copy the deployed URL — the **WEB URL** (e.g.
`https://spatium.pages.dev`).

The included `public/_redirects` (`/* /index.html 200`) makes deep links like
`/ro/admin/news/:id` resolve correctly.

---

## Part C — Connect them (CORS)

Back in Northflank → `spatium-api` → **Environment**, set:
```
CLIENT_URL = <WEB URL from B4>      e.g. https://spatium.pages.dev
```
Save → the backend restarts and now allows the frontend origin. (Comma-separate
to allow several origins, e.g. a custom domain or preview URLs.)

---

## Part D — First run

1. Open the **WEB URL** → `/login` → sign in `admin` / `Password1234567.`
2. **Change the password** under **Admin → Account**.
3. (Optional) import the legacy static content (uploads old images to Cloudinary)
   from a machine pointed at the same Atlas DB:
   ```bash
   cd server && npm install && npm run import:content
   ```

---

## Redeploying

| Change | What to do |
| ------ | ---------- |
| Backend code | push to `main` (enable auto-deploy on the Northflank service, or click Deploy) |
| Backend env (`CLIENT_URL`, secrets) | edit env → restart (no rebuild) |
| Frontend code | `cd client && yarn deploy` |
| Backend URL changed | update `client/.env.production` → `yarn deploy` (rebuild bakes the new URL) |

## Custom domains (optional)
- Frontend: Cloudflare Pages → your project → **Custom domains** → add e.g.
  `spatium.utm.md`. Then add that origin to the backend `CLIENT_URL`.
- Backend: add a custom domain on the Northflank service, then update
  `client/.env.production` `VITE_API_URL` and `yarn deploy` again.

## Troubleshooting
- **"Cannot reach the server…" on login** → wrong `VITE_API_URL` at build time, or
  backend not public. Fix `.env.production`, `yarn deploy`.
- **CORS error in console** → backend `CLIENT_URL` ≠ the exact frontend origin
  (scheme + host, no trailing slash).
- **Deep link 404s** → `public/_redirects` missing from the build (it's included).
- **Atlas "Could not connect…"** → Network Access doesn't allow Northflank (A1).

---

> Hosting the frontend on Northflank instead (Docker + nginx) is also possible —
> see `NORTHFLANK.md` and `client/Dockerfile`. The Cloudflare path above is the
> recommended setup.
