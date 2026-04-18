# 🛠️ DevTrack Pro — Backend & Database Implementation Roadmap

> **Project:** DevTrack Pro — Capstone Project Management System  
> **Frontend Stack:** React 19 + Vite 8 + Tailwind CSS 3  
> **Planned Backend Stack:** Node.js + Express.js + MySQL (via XAMPP / MariaDB)  
> **Date Created:** April 17, 2026

---

## ✅ System Readiness Check

| Tool            | Required | Detected Version  | Status   |
| --------------- | -------- | ----------------- | -------- |
| Node.js         | v18+     | v24.14.0          | ✅ Ready |
| npm             | v9+      | v11.9.0           | ✅ Ready |
| Git             | Latest   | v2.45.1 (Windows) | ✅ Ready |
| PHP (XAMPP)     | v7+      | v8.2.12           | ✅ Ready |
| MariaDB (XAMPP) | v10+     | v10.4.32          | ✅ Ready |
| XAMPP           | Latest   | Installed         | ✅ Ready |

> 🎉 **Your system is fully ready to implement a backend and database!**

---

## 🗺️ Roadmap Overview

```
Phase 1 → Database Design & Setup
Phase 2 → Backend API (Node.js + Express)
Phase 3 → Connect Frontend to Backend (API Integration)
Phase 4 → Authentication & Security
Phase 5 → Testing & Deployment
```

---

## 📋 Step-by-Step Checklist

---

### 🟦 Phase 1 — Database Design & Setup

- [x] **1.1** Start XAMPP — launch Apache and MySQL from XAMPP Control Panel
- [x] **1.2** Open phpMyAdmin at `http://localhost/phpmyadmin`
- [x] **1.3** Create a new database named `devtrack_pro`
- [x] **1.4** Design and create the following tables: ← **DONE**

  | Table        | Description                            |
  | ------------ | -------------------------------------- |
  | `users`      | Admin/user accounts                    |
  | `projects`   | Project records (name, status, budget) |
  | `tasks`      | Tasks linked to projects               |
  | `milestones` | Milestones linked to projects          |
  | `payments`   | Payment records per project            |
  | `meetings`   | Scheduled meetings                     |

- [x] **1.5** Write SQL `CREATE TABLE` scripts for each table
- [x] **1.6** Insert seed/mock data (migrate from `mockData.js`)
- [x] **1.7** Test all table relationships with foreign keys

---

### 🟩 Phase 2 — Backend API (Node.js + Express)

- [x] **2.1** Create a new `backend/` folder inside `devtrack-pro/`
- [x] **2.2** Initialize a new Node.js project:
  ```powershell
  cd C:\xampp\htdocs\devtrack-pro\backend
  npm init -y
  ```
- [x] **2.3** Install required backend packages:
  ```powershell
  npm install express mysql2 cors dotenv bcryptjs jsonwebtoken
  npm install --save-dev nodemon
  ```
- [x] **2.4** Create the backend folder structure:
  ```
  backend/
  ├── server.js          # Entry point
  ├── .env               # Environment variables (DB credentials, JWT secret)
  ├── config/
  │   └── db.js          # MySQL connection config
  ├── routes/
  │   ├── projects.js
  │   ├── tasks.js
  │   ├── payments.js
  │   ├── meetings.js
  │   └── auth.js
  ├── controllers/
  │   ├── projectsController.js
  │   ├── tasksController.js
  │   ├── paymentsController.js
  │   ├── meetingsController.js
  │   └── authController.js
  └── middleware/
      └── authMiddleware.js
  ```
- [x] **2.5** Configure `.env` file with DB credentials
- [x] **2.6** Set up MySQL connection pool in `config/db.js`
- [x] **2.7** Build REST API routes for each resource:

  | Method | Endpoint             | Action               |
  | ------ | -------------------- | -------------------- |
  | GET    | `/api/projects`      | Get all projects     |
  | POST   | `/api/projects`      | Create a new project |
  | GET    | `/api/projects/:id`  | Get single project   |
  | PUT    | `/api/projects/:id`  | Update project       |
  | DELETE | `/api/projects/:id`  | Delete project       |
  | GET    | `/api/payments`      | Get all payments     |
  | POST   | `/api/payments`      | Add payment          |
  | GET    | `/api/meetings`      | Get all meetings     |
  | POST   | `/api/meetings`      | Schedule meeting     |
  | POST   | `/api/auth/login`    | User login           |
  | POST   | `/api/auth/register` | User register        |

- [x] **2.8** Enable CORS in `server.js` to allow frontend requests
- [x] **2.9** Test all API endpoints using **Postman** or **Thunder Client** (VS Code extension)
- [x] **2.10** Run backend server with: ← **YOU ARE HERE ✅**
  ```powershell
  nodemon server.js
  ```

---

### 🟨 Phase 3 — Connect Frontend to Backend (API Integration)

- [x] **3.1** Install `axios` in the frontend for HTTP requests:
  ```powershell
  cd C:\xampp\htdocs\devtrack-pro
  npm install axios
  ```
- [x] **3.2** Create a `src/api/` folder with an `axiosConfig.js` base instance
- [x] **3.3** Create API service files:
  ```
  src/api/
  ├── axiosConfig.js      # Base URL + interceptors
  ├── projectsApi.js
  ├── paymentsApi.js
  ├── meetingsApi.js
  └── authApi.js
  ```
- [x] **3.4** Replace all mock data imports in pages with real API calls
- [x] **3.5** Add loading states and error handling in each page
- [x] **3.6** Connect modals (Add Project, Schedule Meeting) to POST endpoints
- [x] **3.7** Test full CRUD operations end-to-end in the browser ✅

---

### 🟦 Phase 3 Extension — Full CRUD UI (Beyond Original Plan)

> **Completed:** All tables cleared. Full CRUD wired to live backend.

- [x] **3.8** Clear all seed data from DB — fresh start (`TRUNCATE` all tables)
- [x] **3.9** Create `milestonesController.js` + `routes/milestones.js` (GET, POST, PUT, DELETE)
- [x] **3.10** Register `/api/milestones` route in `backend/server.js`
- [x] **3.11** Create `src/api/milestonesApi.js` (getMilestones, createMilestone, updateMilestone, deleteMilestone)
- [x] **3.12** Create `src/api/tasksApi.js` (getTasksByProject, createTask, updateTask, deleteTask)
- [x] **3.13** Add `deletePayment` to `paymentsController.js` + `routes/payments.js`
- [x] **3.14** Add `deletePayment` to `src/api/paymentsApi.js`
- [x] **3.15** **Projects page** — Added Edit Project modal + Delete button per card
  - Edit: pre-filled modal → `PUT /api/projects/:id`
  - Delete: confirm dialog → `DELETE /api/projects/:id`
- [x] **3.16** **ProjectDetails page** — Full CRUD for Tasks, Milestones, and Payments
  - Tasks: Add (inline input + Enter key), toggle done (click checkbox), delete (hover trash icon)
  - Milestones: Add/Edit modal (title, date, done checkbox), delete with confirmation
  - Payments: Add/Edit modal (total, paid, status), delete per record
- [x] **3.17** **Payments page** — Full CRUD with Add/Edit/Delete
  - Add Payment: modal with project dropdown, total, paid, status
  - Edit: pencil icon per row → pre-filled modal
  - Delete: trash icon per row with confirmation

---

### 🟦 Phase 3 Extension 2 — Fixes & Meetings CRUD

- [x] **3.18** **Dashboard chart fix** — "Budget vs Paid" bar chart now aggregates correctly from `payments` table per project (not stale `p.paid` field)
- [x] **3.19** **Overall Progress fix** — `tasksController` now auto-recalculates `project.progress` on every task create/toggle/delete via `UPDATE projects SET progress=?`; `ProjectDetails` page reflects the updated value in real time
- [x] **3.20** **DB schema update** — Added `status ENUM('Scheduled','Done','Cancelled')` column to `meetings` table via `ALTER TABLE`
- [x] **3.21** Added `updateMeeting` to `meetingsController.js` + `PUT /:id` route in `routes/meetings.js`
- [x] **3.22** Added `updateMeeting` to `src/api/meetingsApi.js`
- [x] **3.23** **Meetings page** — Full CRUD + status management:
  - ✅ Mark as **Done** button per card
  - ❌ Mark as **Cancelled** button per card
  - 🔄 **Reschedule** button (resets Cancelled → Scheduled)
  - ✏️ **Edit** meeting modal (all fields + status dropdown)
  - 🗑️ **Delete** with confirmation
  - 🔽 **Filter** by status: All / Scheduled / Done / Cancelled

---

### 🟦 Phase 3 Extension 3 — Payment Mode & Date

- [x] **3.24** **DB schema update** — Added `paid_date DATE` and `payment_mode ENUM(Cash, GCash, Bank Transfer, Check, PayMaya, Other)` to `payments` table via `ALTER TABLE`
- [x] **3.25** **`paymentsController.js`** — `createPayment` and `updatePayment` now accept and save `paid_date` + `payment_mode`
- [x] **3.26** **Payments page** — Modal now includes:
  - 💳 **Payment Mode** dropdown (Cash, GCash, Bank Transfer, Check, PayMaya, Other)
  - 📅 **Date Paid** date picker
  - Table shows new **Mode** and **Date Paid** columns with colour-coded badges
- [x] **3.27** **ProjectDetails page** — Payment modal and payment cards updated with same `payment_mode` + `paid_date` fields

---

### 🟧 Phase 4 — Authentication & Security

- [ ] **4.1** Implement JWT-based login in the backend
- [ ] **4.2** Hash passwords with `bcryptjs` before storing in DB
- [ ] **4.3** Create a `Login.jsx` page in the frontend
- [ ] **4.4** Store JWT token in `localStorage` or `httpOnly` cookie
- [ ] **4.5** Create a `ProtectedRoute` component to guard all pages
- [ ] **4.6** Add token to Axios request headers via interceptor
- [ ] **4.7** Implement logout functionality (clear token + redirect)
- [ ] **4.8** Add token expiry handling with refresh logic (optional)

---

### 🟥 Phase 5 — Testing & Final Polish

- [ ] **5.1** Test all pages with live database data
- [ ] **5.2** Handle empty states (no projects, no payments, etc.)
- [ ] **5.3** Add form validation to modals (required fields, formats)
- [ ] **5.4** Ensure XAMPP MySQL is running before the backend starts
- [ ] **5.5** Write a final `.env.example` file for documentation
- [ ] **5.6** Update `README.md` with new backend setup instructions
- [ ] **5.7** (Optional) Deploy backend to a hosting service (Railway, Render, etc.)
- [ ] **5.8** (Optional) Deploy frontend to Vercel or Netlify

---

## 🗃️ Recommended Database Schema (Preview)

```sql
-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  client VARCHAR(100),
  status ENUM('Active', 'Completed', 'On Hold', 'Cancelled') DEFAULT 'Active',
  budget DECIMAL(10,2),
  paid DECIMAL(10,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  progress INT DEFAULT 0,
  github_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Payments Table
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('Paid', 'Partial', 'Unpaid') DEFAULT 'Unpaid',
  due_date DATE,
  paid_date DATE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Meetings Table
CREATE TABLE meetings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  platform VARCHAR(50),
  date DATE,
  time TIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📦 Full Tech Stack (After Backend Integration)

| Layer       | Technology               |
| ----------- | ------------------------ |
| Frontend    | React 19 + Vite 8        |
| Styling     | Tailwind CSS 3           |
| Routing     | React Router 7           |
| Charts      | Recharts                 |
| Icons       | Lucide React             |
| HTTP Client | Axios                    |
| Backend     | Node.js + Express.js     |
| Database    | MariaDB 10.4 (via XAMPP) |
| Auth        | JWT + bcryptjs           |
| API Testing | Postman / Thunder Client |
| Dev Server  | Nodemon                  |

---

## ⚠️ Important Notes

- Always start **XAMPP MySQL** before running the backend server
- Keep `.env` out of Git — add it to `.gitignore`
- Backend will run on `http://localhost:5000` (separate from Vite on `5173`)
- Use CORS to allow `http://localhost:5173` to talk to the backend
- This roadmap follows the **current project structure** — all backend code goes in a new `backend/` subfolder

---

## 📁 Final Project Structure (After Integration)

```
devtrack-pro/
├── backend/                  ← NEW: Node.js + Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env
│   └── server.js
├── docs/                     ← Documentation files
│   └── BACKEND_ROADMAP.md
├── public/
├── src/
│   ├── api/                  ← NEW: Axios API service files
│   ├── assets/
│   ├── components/
│   ├── data/                 ← Will be retired after integration
│   ├── layouts/
│   └── pages/
├── package.json
├── vite.config.js
└── README.md
```

---

_Next Step → Start with **Phase 1**: Set up the database in phpMyAdmin 🗄️_
