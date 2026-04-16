# 🚀 DevTrack Pro — Capstone Project Management System

> A professional frontend prototype built with **React + Vite + Tailwind CSS**  
> Color Theme: **Teal Lightning** 🌊⚡

---

## 🎨 Color Palette — Teal Lightning

| Name       | Hex       | Preview        | Usage                          |
|------------|-----------|----------------|--------------------------------|
| Darkest    | `#041421` | ⬛ Deep Navy    | Primary text, headings         |
| Dark       | `#042630` | 🟦 Dark Teal    | Sidebar, buttons, backgrounds  |
| Mid        | `#4c7273` | 🟩 Teal         | Accents, icons, active states  |
| Light      | `#86b9b0` | 🩵 Light Teal   | Subtle text, muted labels      |
| Pale       | `#d0d6d6` | ⬜ Soft Gray    | Borders, dividers, backgrounds |

---

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

| Tool       | Version   | Download Link                          |
|------------|-----------|----------------------------------------|
| Node.js    | v18+      | https://nodejs.org/                    |
| npm        | v9+       | Comes with Node.js                     |
| Git        | Latest    | https://git-scm.com/                   |
| XAMPP      | Latest    | https://www.apachefriends.org/         |

---

## 📁 Project Location

This project is located inside your XAMPP htdocs folder:

```
C:\xampp\htdocs\devtrack-pro\
```

---

## ⚡ How to Run

### Step 1 — Open Terminal

Open **PowerShell** or **Command Prompt** and navigate to the project folder:

```powershell
cd C:\xampp\htdocs\devtrack-pro
```

### Step 2 — Install Dependencies (First Time Only)

```powershell
npm install
```

This installs all required packages:
- `react` + `react-dom`
- `react-router-dom`
- `recharts`
- `lucide-react`
- `tailwindcss`
- `vite`

### Step 3 — Start the Development Server

```powershell
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

## 🌐 Available Pages & Routes

| Page            | Route              | Description                                      |
|-----------------|--------------------|--------------------------------------------------|
| Dashboard       | `/`                | Overview cards, earnings chart, recent activity  |
| Projects        | `/projects`        | Project list with search, filter, add modal      |
| Project Details | `/projects/:id`    | Tasks, milestones, progress bar, project info    |
| Payments        | `/payments`        | Payment table with balances and status           |
| Meetings        | `/meetings`        | Meeting cards with schedule modal                |
| Analytics       | `/analytics`       | Charts for earnings, status, and completion      |

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

- This is a **frontend prototype only** — no backend, no database, no authentication
- All data is **static mock data** from `src/data/mockData.js`
- Modals are **UI demonstrations** — no data is actually saved
- Designed for **desktop-first** with responsive mobile support

---

## 🧑‍💻 Tech Stack

| Technology       | Purpose                  |
|------------------|--------------------------|
| React 19         | UI framework             |
| Vite 8           | Build tool & dev server  |
| Tailwind CSS 3   | Utility-first styling    |
| React Router 7   | Client-side routing      |
| Recharts         | Chart components         |
| Lucide React     | Icon library             |

---

## 🐛 Troubleshooting

**Problem:** `npm run dev` shows port already in use  
**Solution:**
```powershell
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

**Problem:** `node_modules` missing or corrupted  
**Solution:**
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

**Problem:** Tailwind styles not applying  
**Solution:** Make sure `tailwind.config.js` content paths are correct:
```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

---

## 👨‍🎓 About This Project

**DevTrack Pro** is a Capstone Project Management Dashboard built as a frontend prototype for UI/UX presentation purposes. It simulates a real project management system with a clean, modern design using the **Teal Lightning** color palette.

**Color Inspiration:** Deep ocean teal tones representing professionalism, clarity, and technical depth.

---

*Built with ❤️ using React + Vite + Tailwind CSS*
