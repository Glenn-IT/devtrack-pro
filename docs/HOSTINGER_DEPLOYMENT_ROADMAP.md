# 🌐 DevTrack Pro — Hostinger Deployment Roadmap & Checklist

> A step-by-step guide to deploying DevTrack Pro (React Frontend + Node.js Backend + MariaDB) live on the internet using **Hostinger**.

---

## 📦 What You're Deploying

| Layer    | Technology         | Deployment Target                            |
| -------- | ------------------ | -------------------------------------------- |
| Frontend | React + Vite (SPA) | Hostinger Static Files / hPanel File Manager |
| Backend  | Node.js + Express  | Hostinger VPS or Cloud Hosting (Node.js)     |
| Database | MariaDB / MySQL    | Hostinger MySQL Database (hPanel)            |

---

## 🛒 Phase 1 — Buy Domain & Hosting on Hostinger

### ✅ Checklist

- [ ] **Go to** https://www.hostinger.com
- [ ] **Register or log in** to your Hostinger account
- [ ] **Choose a domain name** (e.g., `devtrackpro.com`, `devtrack-pro.net`)
  - Use the domain search tool on Hostinger
  - `.com` domains are ~$10–15/year
  - `.site` or `.online` are cheaper alternatives
- [ ] **Choose a Hosting Plan** — ⚠️ IMPORTANT:
  - ❌ **Do NOT use Shared Hosting** — it does NOT support Node.js
  - ✅ **Use one of these plans instead:**

| Plan                     | Supports Node.js? | Database Included? | Recommended?       |
| ------------------------ | ----------------- | ------------------ | ------------------ |
| Shared Hosting (Premium) | ❌ No             | ✅ Yes             | ❌ Not for backend |
| Cloud Hosting            | ✅ Yes (limited)  | ✅ Yes             | ⚠️ Check plan      |
| **VPS Hosting (KVM 1+)** | ✅ Yes (full)     | ✅ Manual install  | ✅ **Best choice** |
| Business Hosting         | ✅ Node.js App    | ✅ Yes             | ✅ Good option     |

> 💡 **Recommended:** Start with **Business Hosting** or **VPS KVM 1** for full Node.js support.

- [ ] **Add domain to cart** (or use a free subdomain like `yourname.hostinger-free.com` to test first)
- [ ] **Complete purchase** and set up your account
- [ ] **Verify your email** and access **hPanel** at https://hpanel.hostinger.com

---

## 🗄️ Phase 2 — Set Up the Database on Hostinger

### ✅ Checklist

- [ ] **Log in to hPanel** → Go to **Databases → MySQL Databases**
- [ ] **Create a new database:**
  - Database name: `devtrack_pro` (or `u123456_devtrack`)
  - Note: Hostinger prefixes names with your account ID (e.g., `u123456_devtrack_pro`)
- [ ] **Create a database user:**
  - Username: `devtrack_user` (will also be prefixed)
  - Password: Choose a **strong password** and save it
- [ ] **Assign the user to the database** with **All Privileges**
- [ ] **Note down your credentials:**
  ```
  DB_HOST=localhost  (or the remote host Hostinger provides)
  DB_PORT=3306
  DB_NAME=u123456_devtrack_pro
  DB_USER=u123456_devtrack_user
  DB_PASS=your_strong_password
  ```
- [ ] **Open phpMyAdmin** from hPanel → Databases
- [ ] **Import the database schema:**
  - Go to the **Import** tab in phpMyAdmin
  - Upload your file: `docs/database.sql`
  - Click **Go** to run the SQL
- [ ] **Verify** all tables were created successfully (projects, tasks, milestones, payments, meetings, users)

---

## ⚙️ Phase 3 — Prepare the Backend for Production

### ✅ Checklist

#### 3.1 — Update Environment Variables

- [ ] **Create a production `.env` file** inside the `backend/` folder:

```env
# backend/.env (PRODUCTION)
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u123456_devtrack_pro
DB_USER=u123456_devtrack_user
DB_PASS=your_strong_password

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

> ⚠️ **Never commit this file to GitHub.** Make sure `.env` is in your `.gitignore`.

- [ ] **Open `backend/server.js`** and verify the CORS origin uses `process.env.FRONTEND_URL`:

```js
// Make sure this line exists in server.js
origin: process.env.FRONTEND_URL || "http://localhost:5173",
```

#### 3.2 — Update package.json Scripts

- [ ] **Open `backend/package.json`** and make sure a `start` script exists:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

#### 3.3 — Test Locally with Production Settings

- [ ] Run `npm start` (not `npm run dev`) in the backend folder to confirm it works without nodemon
- [ ] Make sure all API routes respond correctly
- [ ] Fix any errors before deploying

---

## 🏗️ Phase 4 — Build the Frontend for Production

### ✅ Checklist

#### 4.1 — Update API Base URL

- [ ] **Open `src/api/axiosConfig.js`** (or wherever your base URL is set)
- [ ] **Change the base URL** to point to your live backend:

```js
// src/api/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export default api;
```

- [ ] **Create a `.env` file** in the root of the frontend (not backend):

```env
# .env (Frontend root — for production)
VITE_API_URL=https://yourdomain.com/api
```

> 💡 If your backend and frontend are on the **same domain**, you can use `/api` as the base URL and set up a reverse proxy (explained in Phase 5).

#### 4.2 — Build the Frontend

- [ ] **Open a PowerShell terminal** in the project root:

```powershell
cd C:\xampp\htdocs\devtrack-pro
npm run build
```

- [ ] **Verify** that a `dist/` folder was created containing:
  - `index.html`
  - `assets/` folder with JS and CSS files
- [ ] **Test the production build locally:**

```powershell
npm run preview
```

- [ ] Open `http://localhost:4173` and confirm everything works correctly
- [ ] Test all pages: Dashboard, Projects, Payments, Meetings, Analytics

---

## 🚀 Phase 5 — Deploy to Hostinger (VPS Option — Recommended)

> Use this section if you purchased **Hostinger VPS Hosting**.

### ✅ Checklist

#### 5.1 — Access Your VPS

- [ ] **Go to hPanel** → VPS → Manage
- [ ] **Note your VPS IP address** (e.g., `123.45.67.89`)
- [ ] **Connect via SSH:**

```powershell
ssh root@123.45.67.89
```

- [ ] Enter your VPS root password (set during purchase or sent via email)

#### 5.2 — Set Up the VPS Server

- [ ] **Update the server packages:**

```bash
apt update && apt upgrade -y
```

- [ ] **Install Node.js (v18+):**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
node -v   # Should show v18.x.x
npm -v    # Should show v9+
```

- [ ] **Install PM2** (Node.js process manager — keeps your app running):

```bash
npm install -g pm2
```

- [ ] **Install Nginx** (reverse proxy — routes traffic to your Node app):

```bash
apt install -y nginx
```

- [ ] **Install MariaDB** (if not using hPanel database):

```bash
apt install -y mariadb-server
mysql_secure_installation
```

#### 5.3 — Upload Your Project to VPS

**Option A — Using Git (Recommended):**

- [ ] Make sure your project is on **GitHub** (push all changes)
- [ ] On VPS, clone your repo:

```bash
cd /var/www
git clone https://github.com/Glenn-IT/devtrack-pro.git
cd devtrack-pro
```

**Option B — Using SFTP (FileZilla):**

- [ ] Download **FileZilla**: https://filezilla-project.org/
- [ ] Connect: Host=`sftp://your-vps-ip`, User=`root`, Password=your VPS password, Port=`22`
- [ ] Upload the entire project to `/var/www/devtrack-pro/`

#### 5.4 — Set Up the Database on VPS

- [ ] **Log in to MariaDB:**

```bash
mysql -u root -p
```

- [ ] **Create database and user:**

```sql
CREATE DATABASE devtrack_pro;
CREATE USER 'devtrack_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON devtrack_pro.* TO 'devtrack_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

- [ ] **Import your schema:**

```bash
mysql -u devtrack_user -p devtrack_pro < /var/www/devtrack-pro/docs/database.sql
```

#### 5.5 — Install Dependencies & Configure Backend

- [ ] **Install backend dependencies:**

```bash
cd /var/www/devtrack-pro/backend
npm install --production
```

- [ ] **Create the `.env` file** on the server:

```bash
nano .env
```

Paste your production environment variables (from Phase 3.1), then press `Ctrl+X`, `Y`, `Enter` to save.

- [ ] **Test the backend starts correctly:**

```bash
npm start
```

- [ ] Press `Ctrl+C` to stop it after confirming it works

#### 5.6 — Start Backend with PM2

- [ ] **Start with PM2:**

```bash
cd /var/www/devtrack-pro/backend
pm2 start server.js --name "devtrack-api"
pm2 save
pm2 startup
```

- [ ] **Run the command PM2 outputs** to make it auto-start on reboot
- [ ] **Verify PM2 status:**

```bash
pm2 status
pm2 logs devtrack-api
```

#### 5.7 — Build & Deploy Frontend

- [ ] **Install frontend dependencies:**

```bash
cd /var/www/devtrack-pro
npm install
npm run build
```

- [ ] **Verify the `dist/` folder exists** at `/var/www/devtrack-pro/dist/`

#### 5.8 — Configure Nginx

- [ ] **Create an Nginx config file:**

```bash
nano /etc/nginx/sites-available/devtrack-pro
```

- [ ] **Paste this configuration** (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Serve React frontend (built dist folder)
    root /var/www/devtrack-pro/dist;
    index index.html;

    # Handle React Router (SPA routing)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- [ ] **Enable the site:**

```bash
ln -s /etc/nginx/sites-available/devtrack-pro /etc/nginx/sites-enabled/
nginx -t   # Test config — should say "syntax is ok"
systemctl restart nginx
```

#### 5.9 — Point Your Domain to VPS

- [ ] **Go to Hostinger hPanel** → Domains → Manage
- [ ] **Click on DNS / Nameservers**
- [ ] **Add/Edit DNS A Records:**
  - Type: `A` | Host: `@` | Points to: `your-VPS-IP` | TTL: `3600`
  - Type: `A` | Host: `www` | Points to: `your-VPS-IP` | TTL: `3600`
- [ ] **Wait for DNS propagation** (can take 5 minutes to 48 hours)
- [ ] **Verify** by visiting `http://yourdomain.com`

---

## 🔒 Phase 6 — Enable HTTPS (Free SSL Certificate)

### ✅ Checklist

- [ ] **Install Certbot** (free SSL from Let's Encrypt):

```bash
apt install -y certbot python3-certbot-nginx
```

- [ ] **Get your SSL certificate** (replace `yourdomain.com`):

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

- [ ] **Follow the prompts:**
  - Enter your email
  - Agree to terms
  - Choose option `2` to redirect HTTP to HTTPS automatically
- [ ] **Verify HTTPS works:** Visit `https://yourdomain.com`
- [ ] **Set up auto-renewal:**

```bash
certbot renew --dry-run
```

- [ ] **Confirm Nginx config was updated** by Certbot to include SSL settings

---

## 🌐 Phase 7 — (Alternative) Deploy Using Hostinger Business Hosting

> Use this section if you chose **Business Hosting** instead of VPS.

### ✅ Checklist

- [ ] **Log in to hPanel** → Go to **Advanced → Node.js**
- [ ] **Create a new Node.js application:**
  - Node.js version: `18.x`
  - Application root: `/public_html/backend`
  - Application URL: your domain or subdomain (e.g., `api.yourdomain.com`)
  - Application startup file: `server.js`
- [ ] **Upload backend files** via hPanel File Manager or FTP to `/public_html/backend/`
- [ ] **Create the `.env` file** in the application root using File Manager
- [ ] **Install dependencies** via the Node.js panel → "Install dependencies" button
- [ ] **Start the application** from the Node.js panel
- [ ] **Upload the built `dist/` folder** to `/public_html/` (root of your domain)
- [ ] **Create a `.htaccess` file** in `/public_html/` for React Router to work:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

- [ ] **Test your domain** — frontend should load at `https://yourdomain.com`
- [ ] **Enable Free SSL** from hPanel → SSL → Let's Encrypt

---

## ✅ Phase 8 — Post-Deployment Testing

### ✅ Checklist

- [ ] **Visit your live domain** — confirm the frontend loads
- [ ] **Test all pages:**
  - [ ] Dashboard (`/`)
  - [ ] Projects (`/projects`)
  - [ ] Project Details (`/projects/:id`)
  - [ ] Payments (`/payments`)
  - [ ] Meetings (`/meetings`)
  - [ ] Analytics (`/analytics`)
- [ ] **Test API endpoints** using Postman with your live domain:
  - [ ] `GET https://yourdomain.com/api/projects`
  - [ ] `POST https://yourdomain.com/api/auth/register`
  - [ ] `POST https://yourdomain.com/api/auth/login`
  - [ ] `GET https://yourdomain.com/api/auth/me` (with Bearer Token)
- [ ] **Test React Router** — navigate directly to `/projects` via URL (should not 404)
- [ ] **Test HTTPS redirect** — visiting `http://yourdomain.com` should redirect to `https://`
- [ ] **Check browser console** for any errors (F12 → Console tab)
- [ ] **Check API responses** in browser Network tab (F12 → Network)
- [ ] **Test login flow** end-to-end (register → login → access protected page)

---

## 🔧 Phase 9 — Ongoing Maintenance

### ✅ Checklist

#### Updating Your App After Code Changes

- [ ] **Pull latest code** on VPS (if using Git):

```bash
cd /var/www/devtrack-pro
git pull origin main
```

- [ ] **Rebuild frontend:**

```bash
npm run build
```

- [ ] **Restart backend** (PM2 auto-restarts, but force it if needed):

```bash
pm2 restart devtrack-api
```

#### Monitoring

- [ ] **Check backend logs:**

```bash
pm2 logs devtrack-api
```

- [ ] **Check Nginx logs:**

```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

- [ ] **Monitor server resources:**

```bash
pm2 monit
```

#### Backups

- [ ] **Set up automated database backups** via hPanel (Databases → Backups)
- [ ] **Enable Hostinger's automatic daily backups** for your hosting plan
- [ ] **Keep your GitHub repo updated** as an additional code backup

---

## 💰 Estimated Costs (Hostinger)

| Item                   | Cost (Approx.)    | Notes                               |
| ---------------------- | ----------------- | ----------------------------------- |
| Domain (.com)          | ~$10–15/year      | First year often discounted         |
| Business Hosting       | ~$3–7/month       | Easiest for beginners with Node.js  |
| VPS KVM 1              | ~$5–8/month       | More control, best for Node.js      |
| SSL Certificate        | **FREE**          | Let's Encrypt via hPanel or Certbot |
| **Total (first year)** | **~$50–100/year** | Domain + Hosting combined           |

---

## ⚠️ Common Issues & Fixes

| Problem                              | Solution                                                              |
| ------------------------------------ | --------------------------------------------------------------------- |
| Frontend loads but API calls fail    | Check CORS settings — `FRONTEND_URL` in `.env` must match your domain |
| React routes give 404 on refresh     | Add Nginx `try_files` rule or `.htaccess` for shared hosting          |
| Database connection refused          | Verify `DB_HOST`, `DB_USER`, `DB_PASS` in backend `.env`              |
| SSL certificate not working          | Re-run `certbot --nginx -d yourdomain.com`                            |
| PM2 app not running after VPS reboot | Run `pm2 startup` and `pm2 save` to enable auto-start                 |
| `npm run build` fails                | Check for ESLint errors — run `npm run build` locally first           |
| hPanel Node.js app shows error       | Check startup file is `server.js` and all `.env` vars are set         |

---

## 🗺️ Deployment Summary Map

```
Your Computer (Dev)
       │
       ▼
  GitHub Repo ──────────────────────────────────┐
       │                                         │
       ▼                                         ▼
  VPS / Hostinger Server               hPanel Business Hosting
  ┌─────────────────────┐              ┌─────────────────────┐
  │  Nginx (Port 80/443)│              │  Apache (.htaccess) │
  │    ├── /api/* ──────┼──────────►  │  Node.js App Panel  │
  │    │   └── Express  │              │  └── server.js      │
  │    └── /* ──────────┼──────────►  │  /public_html/dist  │
  │        └── dist/    │              └─────────────────────┘
  │  PM2 (process mgr)  │
  │  MariaDB            │
  └─────────────────────┘
         │
         ▼
  https://yourdomain.com  🌐
```

---

_Last updated: April 2026 | DevTrack Pro — Capstone Project Management System_
