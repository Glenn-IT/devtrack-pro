# 🚀 DevTrack Pro — Capstone Project Management System

> A professional frontend prototype built with **React + Vite + Tailwind CSS**  
> Color Theme: **Teal Lightning** 🌊⚡

---

## 🎨 Color Palette — Teal Lightning

| Name    | Hex       | Preview       | Usage                          |
| ------- | --------- | ------------- | ------------------------------ |
| Darkest | `#041421` | ⬛ Deep Navy  | Primary text, headings         |
| Dark    | `#042630` | 🟦 Dark Teal  | Sidebar, buttons, backgrounds  |
| Mid     | `#4c7273` | 🟩 Teal       | Accents, icons, active states  |
| Light   | `#86b9b0` | 🩵 Light Teal | Subtle text, muted labels      |
| Pale    | `#d0d6d6` | ⬜ Soft Gray  | Borders, dividers, backgrounds |

---

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

| Tool    | Version | Download Link                  |
| ------- | ------- | ------------------------------ |
| Node.js | v18+    | https://nodejs.org/            |
| npm     | v9+     | Comes with Node.js             |
| Git     | Latest  | https://git-scm.com/           |
| XAMPP   | Latest  | https://www.apachefriends.org/ |

---

## 📁 Project Location

This project is located inside your XAMPP htdocs folder:

```
C:\xampp\htdocs\devtrack-pro\
```

---

## ⚡ How to Run

> ⚠️ This project now has a **Frontend + Backend**. You need to run **two servers** at the same time.

---

### 🗄️ Step 1 — Start XAMPP (MySQL)

1. Open **XAMPP Control Panel**
2. Click **Start** next to **Apache** and **MySQL**
3. Make sure the `devtrack_pro` database exists in **phpMyAdmin** → `http://localhost/phpmyadmin`

---

### 🖥️ Step 2 — Start the Backend API (Terminal 1)

Open a PowerShell terminal and run:

```powershell
cd C:\xampp\htdocs\devtrack-pro\backend
npm run dev
```

You should see:

```
🚀 DevTrack Pro API running at http://localhost:5000
📡 Accepting requests from http://localhost:5173
✅ Connected to MariaDB — devtrack_pro
```

> The backend API is now live at **http://localhost:5000**

---

### 🌐 Step 3 — Start the Frontend (Terminal 2)

Open a **second** PowerShell terminal and run:

```powershell
cd C:\xampp\htdocs\devtrack-pro
npm install
npm run dev
```

You should see:

```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4 — Open in Browser

Go to: **http://localhost:5173**

---

### 🧪 Step 5 — Test the API with Postman

Import and test the backend endpoints using **Postman**:

#### Base URL

```
http://localhost:5000
```

#### Health Check

| Method | URL                      | Expected Response    |
| ------ | ------------------------ | -------------------- |
| GET    | `http://localhost:5000/` | `{ "status": "OK" }` |

#### Projects

| Method | URL                 | Body (JSON)                                                              |
| ------ | ------------------- | ------------------------------------------------------------------------ |
| GET    | `/api/projects`     | —                                                                        |
| GET    | `/api/projects/:id` | —                                                                        |
| POST   | `/api/projects`     | `{ "name": "...", "client": "...", "status": "To Do", "budget": 50000 }` |
| PUT    | `/api/projects/:id` | `{ "name": "...", "progress": 80 }`                                      |
| DELETE | `/api/projects/:id` | —                                                                        |

#### Payments

| Method | URL                 | Body (JSON)                                                               |
| ------ | ------------------- | ------------------------------------------------------------------------- |
| GET    | `/api/payments`     | —                                                                         |
| POST   | `/api/payments`     | `{ "project_id": 1, "total": 50000, "paid": 25000, "status": "Partial" }` |
| PUT    | `/api/payments/:id` | `{ "paid": 50000, "status": "Paid" }`                                     |

#### Meetings

| Method | URL                 | Body (JSON)                                                                                                            |
| ------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/meetings`     | —                                                                                                                      |
| POST   | `/api/meetings`     | `{ "project_id": 1, "client": "ABC", "type": "Review", "date": "2026-04-20", "time": "10:00 AM", "platform": "Zoom" }` |
| DELETE | `/api/meetings/:id` | —                                                                                                                      |

#### Authentication

| Method | URL                  | Body (JSON)                                                                     |
| ------ | -------------------- | ------------------------------------------------------------------------------- |
| POST   | `/api/auth/register` | `{ "name": "Admin", "email": "admin@devtrack.com", "password": "password123" }` |
| POST   | `/api/auth/login`    | `{ "email": "admin@devtrack.com", "password": "password123" }`                  |
| GET    | `/api/auth/me`       | Header: `Authorization: Bearer <token>`                                         |

> 💡 **Postman Tip:** After logging in, copy the `token` from the response and add it as a **Bearer Token** in the Authorization tab for protected routes.

---

## 🌐 Available Pages & Routes

| Page            | Route           | Description                                     |
| --------------- | --------------- | ----------------------------------------------- |
| Dashboard       | `/`             | Overview cards, earnings chart, recent activity |
| Projects        | `/projects`     | Project list with search, filter, add modal     |
| Project Details | `/projects/:id` | Tasks, milestones, progress bar, project info   |
| Payments        | `/payments`     | Payment table with balances and status          |
| Meetings        | `/meetings`     | Meeting cards with schedule modal               |
| Analytics       | `/analytics`    | Charts for earnings, status, and completion     |

---

## 🗂️ Project Structure

```
devtrack-pro/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Left sidebar navigation
│   │   ├── Card.jsx            # Reusable card container
│   │   ├── Table.jsx           # Reusable data table
│   │   ├── Modal.jsx           # Reusable modal dialog
│   │   └── StatusBadge.jsx     # Colored status pill
│   ├── pages/
│   │   ├── Dashboard.jsx       # Main dashboard overview
│   │   ├── Projects.jsx        # Project list page
│   │   ├── ProjectDetails.jsx  # Single project detail view
│   │   ├── Payments.jsx        # Payment records page
│   │   ├── Meetings.jsx        # Meetings scheduler page
│   │   └── Analytics.jsx       # Charts & analytics page
│   ├── data/
│   │   └── mockData.js         # All static/mock data
│   ├── layouts/
│   │   └── MainLayout.jsx      # Shell with sidebar + navbar
│   ├── App.jsx                 # React Router configuration
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles + Tailwind
├── tailwind.config.js           # Tailwind + custom colors
├── vite.config.js               # Vite configuration
├── package.json                 # Project dependencies
└── README.md                    # This file
```

---

## 🛠️ Build for Production

To create an optimized production build:

```powershell
npm run build
```

Output will be in the `dist/` folder. To preview the production build:

```powershell
npm run preview
```

---

## 📦 Installed Packages

```json
{
  "dependencies": {
    "react": "^19.x",
    "react-dom": "^19.x",
    "react-router-dom": "^7.x",
    "recharts": "^2.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "vite": "^8.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

---

## �� Features

### ✅ Dashboard

- Summary stat cards (Total Projects, Active, Completed, Earnings)
- Bar chart — Earnings per Project (Recharts)
- Recent Activity feed
- Recent Projects table with progress bars

### ✅ Projects

- Project cards with search and status filter
- Progress bar per project
- GitHub repo link
- View Details button → navigates to Project Details
- Add Project modal (UI only)

### ✅ Project Details

- Full project info (dates, budget, paid amount)
- Overall progress bar
- Task checklist (done / pending)
- Milestone timeline with visual indicators

### ✅ Payments

- Summary cards (Total, Collected, Pending)
- Full payment table with ₱ amounts
- Color-coded status badges (Paid / Partial / Unpaid)

### ✅ Meetings

- Meeting cards with platform badges
- Date, time, and notes display
- Schedule Meeting modal (UI only)

### ✅ Analytics

- Budget vs Earned grouped bar chart
- Project Status donut/pie chart
- Horizontal completion progress chart
- Summary stat cards

---

## ⚠️ Notes

- Backend API runs on **http://localhost:5000**
- Frontend runs on **http://localhost:5173**
- Always start **XAMPP MySQL** before starting the backend
- Keep `backend/.env` private — never commit it to Git
- Auth routes require a **Bearer Token** in the `Authorization` header

---

## 🧑‍💻 Tech Stack

| Layer       | Technology           | Purpose                   |
| ----------- | -------------------- | ------------------------- |
| Frontend    | React 19             | UI framework              |
| Build Tool  | Vite 8               | Dev server & bundler      |
| Styling     | Tailwind CSS 3       | Utility-first styling     |
| Routing     | React Router 7       | Client-side routing       |
| Charts      | Recharts             | Chart components          |
| Icons       | Lucide React         | Icon library              |
| Backend     | Node.js + Express.js | REST API server           |
| Database    | MariaDB 10.4 (XAMPP) | Data storage              |
| Auth        | JWT + bcryptjs       | Authentication & security |
| API Testing | Postman              | Endpoint testing          |

---

## 🐛 Troubleshooting

**Problem:** `npm run dev` (frontend) shows port already in use  
**Solution:**

```powershell
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

**Problem:** Backend shows `❌ Database connection failed`  
**Solution:** Make sure **XAMPP MySQL is running** before starting the backend server.

**Problem:** Backend port 5000 already in use  
**Solution:**

```powershell
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Problem:** Postman returns `401 Unauthorized` on `/api/auth/me`  
**Solution:** Add `Authorization: Bearer <your_token>` in the **Headers** tab in Postman. Get the token from the `/api/auth/login` response.

**Problem:** `node_modules` missing or corrupted  
**Solution:**

```powershell
# Frontend
Remove-Item -Recurse -Force node_modules
npm install

# Backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install
```

**Problem:** Tailwind styles not applying  
**Solution:** Make sure `tailwind.config.js` content paths are correct:

```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
```

---

## 👨‍🎓 About This Project

**DevTrack Pro** is a Capstone Project Management Dashboard built as a frontend prototype for UI/UX presentation purposes. It simulates a real project management system with a clean, modern design using the **Teal Lightning** color palette.

**Color Inspiration:** Deep ocean teal tones representing professionalism, clarity, and technical depth.

---

_Built with ❤️ using React + Vite + Tailwind CSS_
