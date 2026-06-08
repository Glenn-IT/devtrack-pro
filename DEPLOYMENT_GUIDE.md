# DevTrack Pro — Vercel Deployment Guide

## Stack Overview

| Layer    | Tech         | Where to Deploy     |
| -------- | ------------ | ------------------- |
| Frontend | React + Vite | Vercel (free)       |
| Backend  | Express.js   | Railway (free tier) |
| Database | MySQL        | Railway (free tier) |

> **Architecture:** Vercel hosts the frontend SPA. Railway hosts the Express API and MySQL database.
> They communicate over HTTPS.

---

## Is It Free?

### Vercel — Frontend

- **Free forever** on the Hobby plan
- Includes: custom domain, HTTPS, unlimited deployments, 100GB bandwidth/month
- No credit card required

### Railway — Backend + Database

- **Free tier**: $5 credit/month (no card required to start)
- A small Express app + MySQL DB typically uses **~$1–3/month** of credit
- If you exceed $5, the app sleeps until next month (or you add a card)
- **Practical reality**: For a portfolio/demo app with low traffic, the $5 credit is usually enough

### Alternatives (also free)

| Service                                | Use For            | Notes                                         |
| -------------------------------------- | ------------------ | --------------------------------------------- |
| [Render](https://render.com)           | Backend (Express)  | Free tier, but sleeps after 15 min inactivity |
| [PlanetScale](https://planetscale.com) | MySQL only         | 5GB free, no backend                          |
| [Supabase](https://supabase.com)       | Postgres + backend | Free, but Postgres not MySQL                  |
| [Aiven](https://aiven.io)              | MySQL only         | 1 free MySQL instance                         |

**Recommended combo (all free):** Vercel (frontend) + Railway (backend + MySQL)

---

## Prerequisites

Before deploying, make sure you have:

- [ ] A [GitHub](https://github.com) account
- [ ] Your code pushed to a GitHub repository
- [ ] A [Vercel](https://vercel.com) account (sign in with GitHub)
- [ ] A [Railway](https://railway.app) account (sign in with GitHub)

---

## Step 1 — Push Code to GitHub

```bash
git init  # skip if already a git repo
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/devtrack-pro.git
git push -u origin main
```

---

## Step 2 — Export Your Local MySQL Database

Run this in your XAMPP shell or Windows CMD while XAMPP MySQL is running:

```bash
mysqldump -u root -p devtrack_pro > devtrack_pro_backup.sql
```

Save this file — you'll import it into Railway's MySQL in Step 3.

---

## Step 3 — Deploy Backend + MySQL to Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `devtrack-pro` repository
4. Set **Root Directory** to `backend`
5. Railway will detect Node.js and deploy your Express server

### Add MySQL Database

6. In the same Railway project, click **+ New** → **Database** → **MySQL**
7. Railway will auto-create the database and inject connection variables

### Import Your Schema

8. Click on the MySQL service → **Connect** tab
9. Use the provided connection string to connect via a GUI tool:
   - [TablePlus](https://tableplus.com) (free tier available)
   - [DBeaver](https://dbeaver.io) (free)
10. Import your `devtrack_pro_backup.sql` file

### Set Environment Variables

11. Click on your Express service → **Variables** tab
12. Add these manually:

```
JWT_SECRET=your_strong_random_secret_here_min_32_chars
JWT_EXPIRES_IN=7d
```

> `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `PORT` are injected automatically by Railway.

13. Note your Railway backend public URL — looks like:
    `https://devtrack-pro-api-production.up.railway.app`

---

## Step 4 — Update CORS in Backend

Edit `backend/server.js` to allow your Vercel frontend URL:

```js
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        /^http:\/\/localhost:\d+$/,
        /^https:\/\/devtrack-pro.*\.vercel\.app$/, // your Vercel domain
      ];
      if (!origin || allowed.some((r) => r.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
```

Commit and push — Railway will auto-redeploy.

---

## Step 5 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → Import your `devtrack-pro` repo
3. Vercel auto-detects Vite. Confirm these settings:

| Setting          | Value           |
| ---------------- | --------------- |
| Framework Preset | Vite            |
| Root Directory   | `.` (default)   |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |

4. Under **Environment Variables**, add:

```
VITE_API_URL = https://your-railway-backend-url.up.railway.app/api
```

5. Click **Deploy**
6. Your app will be live at `https://devtrack-pro.vercel.app` (or similar)

---

## Step 6 — Final CORS Update

Once you have your Vercel URL, update the CORS regex in `backend/server.js` to match exactly:

```js
/^https:\/\/devtrack-pro-glennits-projects\.vercel\.app$/;
```

Or use a simpler allowlist:

```js
const allowedOrigins = [
  "http://localhost:5173",
  "https://YOUR-EXACT-VERCEL-URL.vercel.app",
];

origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
},
```

---

## Environment Variables Reference

### Frontend (set in Vercel dashboard)

| Variable       | Value                                         |
| -------------- | --------------------------------------------- |
| `VITE_API_URL` | `https://your-railway-url.up.railway.app/api` |

### Backend (set in Railway dashboard)

| Variable         | Value                            |
| ---------------- | -------------------------------- |
| `JWT_SECRET`     | Strong random string (32+ chars) |
| `JWT_EXPIRES_IN` | `7d`                             |
| `DB_HOST`        | Auto-injected by Railway         |
| `DB_USER`        | Auto-injected by Railway         |
| `DB_PASSWORD`    | Auto-injected by Railway         |
| `DB_NAME`        | Auto-injected by Railway         |
| `PORT`           | Auto-injected by Railway         |

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Local MySQL database exported (`devtrack_pro_backup.sql`)
- [ ] Railway project created with Express backend
- [ ] Railway MySQL database added and schema imported
- [ ] `JWT_SECRET` set in Railway environment variables
- [ ] CORS updated in `backend/server.js` to allow Vercel domain
- [ ] Vercel project created and connected to GitHub
- [ ] `VITE_API_URL` set in Vercel environment variables pointing to Railway backend
- [ ] Test login, create project, and GitHub sync after deployment

---

## Troubleshooting

**CORS errors in browser console**

- Make sure your Vercel URL is added to the CORS allowlist in `backend/server.js`
- Check that `VITE_API_URL` does not have a trailing slash

**API calls returning 404**

- Verify `VITE_API_URL` ends with `/api`
- Check Railway logs for startup errors

**Database connection errors**

- Railway injects DB variables automatically — do not hardcode them
- Make sure your `backend/server.js` reads from `process.env`

**Railway app sleeping**

- On the free tier, Railway doesn't sleep apps — but if you exceed $5/month credit, it will pause until next billing cycle

**White screen on Vercel**

- Run `npm run build` locally first to catch build errors before deploying
- Check Vercel build logs for errors
