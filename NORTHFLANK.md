# Deploying Spatium on Northflank

> **The recommended setup deploys only the _backend_ here and the _frontend_ to
> Cloudflare Pages — see [`DEPLOY.md`](./DEPLOY.md).** This file documents the
> all-on-Northflank alternative (frontend via Docker + nginx).


This repo deploys as **two Northflank services** built from Dockerfiles:

| Service    | Source dir | Dockerfile          | Port | Public? |
| ---------- | ---------- | ------------------- | ---- | ------- |
| `spatium-api` (backend) | `server/` | `server/Dockerfile` | 3000 | yes |
| `spatium-web` (frontend) | `client/` | `client/Dockerfile` | 8080 | yes |

**MongoDB** (Atlas) and **Cloudinary** stay external — only their credentials go
into the backend service's environment. Nothing is hardcoded.

---

## 0. Prerequisites

- A **Northflank** account with a project created.
- This repo pushed to **GitHub/GitLab** and connected to Northflank
  (Account → Git → link your provider).
- A **MongoDB Atlas** cluster (or use Northflank's MongoDB addon — see §6).
- A **Cloudinary** account (cloud name, API key, API secret).

---

## 1. Let Atlas accept Northflank

Northflank's outbound IPs are dynamic, so in **Atlas → Network Access** add
`0.0.0.0/0` (allow from anywhere). Access is still protected by the database
username/password in `MONGODB_URI`.

> For a locked-down setup later, use Northflank **static egress IPs** (paid) and
> whitelist just those, or Atlas private networking.

---

## 2. Deploy the backend (`spatium-api`)

1. **Create new → Service → Combined service** (build + deploy).
2. **Repository:** this repo, branch `main`.
3. **Build:**
   - Build type: **Dockerfile**
   - **Build context:** `/server`
   - **Dockerfile path:** `/server/Dockerfile`
4. **Networking → Ports:** add port **`3000`**, protocol HTTP, **Publicly exposed**.
   Northflank gives it a URL like `https://spatium-api--<project>.code.run`.
5. **Environment variables** (Settings → Environment) — add all of these:

   | Key | Value |
   | --- | ----- |
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `SESSION_SECRET` | a different long random string |
   | `CLOUDINARY_CLOUD_NAME` | … |
   | `CLOUDINARY_API_KEY` | … |
   | `CLOUDINARY_API_SECRET` | … |
   | `CLIENT_URL` | leave blank for now — set in §4 |

6. **Health check (recommended):** Settings → Health checks → HTTP, path
   `/health`, port `3000`.
7. **Deploy.** When it's live, copy its public URL (the **API URL**).

On first boot it auto-creates the default admin: **`admin` / `Password1234567.`**
(change it after first login).

---

## 3. Deploy the frontend (`spatium-web`)

1. **Create new → Service → Combined service.**
2. **Repository:** same repo, branch `main`.
3. **Build:**
   - Build type: **Dockerfile**
   - **Build context:** `/client`
   - **Dockerfile path:** `/client/Dockerfile`
   - **Build arguments:** add `VITE_API_URL` = **the API URL from §2**
     (e.g. `https://spatium-api--myproj.code.run`).
     > This is baked into the JS bundle at build time, so it must be set here,
     > not as a runtime env var.
4. **Networking → Ports:** add port **`8080`**, HTTP, **Publicly exposed**.
5. **Health check (optional):** HTTP path `/healthz`, port `8080`.
6. **Deploy.** Copy its public URL (the **WEB URL**).

---

## 4. Connect the two (CORS)

Go back to **`spatium-api` → Environment**, set:

```
CLIENT_URL = <WEB URL from §3>     e.g. https://spatium-web--myproj.code.run
```

Save and let the backend redeploy. CORS now allows the frontend origin. (You can
pass several origins comma-separated.)

That's it — open the **WEB URL**, go to `/login`, sign in with
`admin` / `Password1234567.`, and change the password under **Admin → Account**.

---

## 5. First-run content

The database starts empty except for the admin user. Either:

- Add content through the admin dashboard, **or**
- Run the legacy import once (uploads the old static images to Cloudinary).
  From a local machine pointed at the same Atlas DB:
  ```bash
  cd server && npm install && npm run import:content
  ```

---

## 6. (Optional) MongoDB on Northflank instead of Atlas

If you prefer not to use Atlas: **Create new → Addon → MongoDB**, then copy the
addon's connection string into the backend's `MONGODB_URI`. Internal addon
traffic stays on Northflank's private network (no IP whitelisting needed).

---

## 7. Redeploys

- Push to `main` → Northflank rebuilds (enable auto-deploy on the service, or
  click **Deploy**).
- Changing `VITE_API_URL` requires a **frontend rebuild** (build-time value).
- Changing backend env vars (`CLIENT_URL`, secrets) only needs a **restart**.

---

## Test it locally first (optional)

With Docker Desktop running, from the repo root:

```bash
docker compose up --build
# frontend  -> http://localhost:8080
# backend   -> http://localhost:3000/health
```

This builds the exact production images and runs them against your `server/.env`.

---

## Troubleshooting

- **Login shows "Cannot reach the server…"** → `VITE_API_URL` was wrong at build
  time, or the API isn't public. Rebuild the frontend with the correct API URL.
- **CORS error in the browser console** → `CLIENT_URL` on the backend doesn't
  match the frontend origin. Set it exactly (scheme + host, no trailing slash).
- **Backend logs "Could not connect to any servers in your MongoDB Atlas
  cluster"** → Atlas Network Access doesn't allow Northflank (see §1).
- **Cookies/sessions not sticking across the two domains** → expected on
  different subdomains; the app uses JWT Bearer tokens (localStorage) for auth,
  which works regardless. `NODE_ENV=production` already sets `SameSite=None;
  Secure` cookies for the session path.
- **Health check failing** → confirm the port (3000 backend / 8080 frontend) and
  path (`/health` / `/healthz`) match what's configured.
