# Production & Local Dual-Setup Guide (Railway + Vercel)

This guide explains how your School Management System runs simultaneously in **Local Development** (localhost) and **Live Production** (Railway + Vercel), allowing your client to test features live while you continue coding locally.

---

## 1. How the Dual Setup Works

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     LOCAL DEVELOPMENT (You)     │       │   LIVE PRODUCTION (Clients)     │
│                                 │       │                                 │
│  Frontend: http://localhost:3000│       │  Frontend: https://...vercel.app│
│  Backend:  http://localhost:8000│       │  Backend:  https://...railway.app│
│  Database: Local MySQL (XAMPP)  │       │  Database: Railway MySQL Plugin │
│  Env file: .env & .env.local    │       │  Env file: Dashboard Variables  │
└─────────────────────────────────┘       └─────────────────────────────────┘
                                ▲           ▲
                                │   Git     │
                                └─── Push ──┘
```

* **No Conflict:** Both `backend/.env` and `frontend/.env.local` are in `.gitignore`. When you run `git push`, your local passwords, localhost URLs, and database credentials are **never pushed to GitHub**.
* **Railway & Vercel** read their configurations directly from their online dashboard settings, independent of your machine.

---

## 2. Frontend Configuration (Vercel)

### On Your Local Machine:
File: [frontend/.env.local](file:///c:/Users/HP/Documents/GitHub/School-managment-system/frontend/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
*(Leave this as is. It connects your local Next.js to your local Laravel server).*

### On Vercel (Production):
1. Go to [vercel.com](https://vercel.com) $\rightarrow$ Your Project $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**.
2. Add the following variable:
   * **Key:** `NEXT_PUBLIC_API_URL`
   * **Value:** `https://<YOUR-RAILWAY-APP-NAME>.up.railway.app/api`
   * **Environments:** Check **Production**, **Preview**, and **Development**.
3. Click **Save** and trigger a **Redeploy** (Deployments $\rightarrow$ Redeploy).

---

## 3. Backend Configuration (Railway)

### On Your Local Machine:
File: [backend/.env](file:///c:/Users/HP/Documents/GitHub/School-managment-system/backend/.env)
```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=skoolms
DB_USERNAME=root
DB_PASSWORD=
CORS_ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
GEMINI_MODEL=gemini-3.8-flash
GEMINI_API_KEY=""
```

### On Railway (Production):
1. Go to [railway.app](https://railway.app) $\rightarrow$ Your Project $\rightarrow$ Backend Service $\rightarrow$ **Variables**.
2. Add/Verify the following variables:

| Variable | Recommended Production Value | Notes |
| :--- | :--- | :--- |
| `APP_NAME` | `Skoolms` | Platform name |
| `APP_ENV` | `production` | Enables production mode |
| `APP_KEY` | *(Same base64 key as local or generate with `php artisan key:generate`)* | Laravel encryption key |
| `APP_DEBUG` | `false` | Turn false for client security |
| `APP_URL` | `https://${{RAILWAY_PUBLIC_DOMAIN}}` | Your Railway public URL |
| `DB_CONNECTION` | `mysql` | MySQL |
| `DB_HOST` | `${{MYSQL.MYSQLHOST}}` *(or Railway MySQL host)* | Provided by Railway MySQL service |
| `DB_PORT` | `${{MYSQL.MYSQLPORT}}` *(or 3306)* | Railway MySQL port |
| `DB_DATABASE` | `${{MYSQL.MYSQLDATABASE}}` | Railway database name |
| `DB_USERNAME` | `${{MYSQL.MYSQLUSER}}` | Railway database user |
| `DB_PASSWORD` | `${{MYSQL.MYSQLPASSWORD}}` | Railway database password |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app,http://localhost:3000` | Replace with your exact Vercel URL |
| `GEMINI_MODEL` | `gemini-3.8-flash` | Free, fast, active Google model |
| `GEMINI_API_KEY` | `` | Gemini API key |

> **Note on CORS:** [backend/config/cors.php](file:///c:/Users/HP/Documents/GitHub/School-managment-system/backend/config/cors.php) has been configured with pattern matching for `#^https?://.*\.vercel\.app.*$#`. This means any Vercel URL (including preview branches) will automatically be accepted without throwing CORS errors!

---

## 4. Database Migration in Production (Railway)

When deploying to Railway for the first time or after adding new migrations:
1. In Railway, click on your Laravel service $\rightarrow$ Open the **Railway CLI** or **Web Terminal**.
2. Run:
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```
*(This creates all tables including the new school logos longtext column and seed data).*

---

## 5. Development Workflow

1. **Coding locally:**
   * Run local backend: `php artisan serve` in `backend/`
   * Run local frontend: `npm run dev` in `frontend/`
   * Your local browser points to `http://localhost:3000` and saves data to your local MySQL.
2. **Pushing to Live:**
   * Run:
     ```bash
     git add .
     git commit -m "Update features"
     git push origin main
     ```
   * Vercel will automatically build the new frontend.
   * Railway will automatically deploy the new backend.
   * Your client can immediately test the live site at `https://your-app.vercel.app`.
