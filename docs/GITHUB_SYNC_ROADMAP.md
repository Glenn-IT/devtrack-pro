# 🔄 GitHub Progress Sync — Implementation Roadmap

> **Feature:** Push a `Progress.md` file to a project's GitHub repo and have DevTrack Pro automatically sync and update that project's progress bar.

---

## 🧠 How It Will Work (Overview)

```
Developer pushes Progress.md to GitHub repo
            ↓
GitHub hosts the raw file at:
https://raw.githubusercontent.com/<owner>/<repo>/main/Progress.md
            ↓
DevTrack Pro backend fetches that raw URL (bypasses CORS)
            ↓
Backend parses "progress: 75" from the file
            ↓
Backend updates projects.progress in MariaDB
            ↓
Frontend refreshes the progress bar instantly
```

---

## 📄 Progress.md Format (What You'll Push to GitHub)

```markdown
# Project Progress

progress: 75
status: Ongoing
note: Completed login module and dashboard layout.
```

| Field      | Required | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| `progress` | ✅ Yes   | Integer 0–100. Updates the progress bar.     |
| `status`   | ❌ No    | `To Do` / `Ongoing` / `Completed`            |
| `note`     | ❌ No    | Short update note shown as last sync message |

---

## ✅ Pre-Implementation Checklist

Go through each item **before** we start coding. Check them off one by one.

---

### 🗃️ Step 1 — Database

- [ ] **1.1** Confirm `projects` table has a `repo` column (it does — already saved when adding projects)
- [ ] **1.2** Add `last_synced_at DATETIME NULL` column to `projects` table
- [ ] **1.3** Add `last_sync_note TEXT NULL` column to `projects` table

**SQL to run in phpMyAdmin:**

```sql
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS last_synced_at DATETIME NULL,
  ADD COLUMN IF NOT EXISTS last_sync_note TEXT NULL;
```

---

### 🖥️ Step 2 — Backend (Express API)

- [ ] **2.1** Install `node-fetch` or confirm `axios` is available in backend (`npm install axios` inside `/backend`)
- [ ] **2.2** Create `backend/controllers/githubSyncController.js`
  - Accepts `GET /api/projects/:id/sync-github`
  - Reads the project's `repo` URL from DB
  - Converts GitHub repo URL → raw `Progress.md` URL
  - Fetches the raw file content
  - Parses `progress:`, `status:`, `note:` values
  - Updates `projects` row: `progress`, `status` (optional), `last_synced_at`, `last_sync_note`
  - Returns `{ progress, status, last_synced_at, last_sync_note }`
- [ ] **2.3** Create `backend/routes/githubSync.js`
  - Register route `GET /api/projects/:id/sync-github`
- [ ] **2.4** Register the new route in `backend/server.js`

---

### 🌐 Step 3 — Frontend (React)

- [ ] **3.1** Create `src/api/githubSyncApi.js`
  - Export `syncFromGitHub(projectId)` → calls `GET /api/projects/:id/sync-github`
- [ ] **3.2** Update `src/pages/ProjectDetails.jsx`
  - Add a **"Sync from GitHub"** button near the progress bar (with a `RefreshCw` icon)
  - On click: call `syncFromGitHub`, show loading spinner
  - On success: update `project.progress`, `project.status`, show last sync time + note
  - On error: show friendly error (e.g. `Progress.md not found in repo`)
- [ ] **3.3** Show a **"Last synced"** timestamp + sync note below the progress bar

---

### 📁 Step 4 — Your GitHub Repos (Manual, You Do This)

- [ ] **4.1** Pick one of your projects in DevTrack Pro that has a real GitHub repo URL saved
- [ ] **4.2** In that GitHub repo, create a file at the **root** called `Progress.md`
- [ ] **4.3** Use this exact format:

  ```markdown
  # Project Progress

  progress: 40
  status: Ongoing
  note: Set up project structure and installed dependencies.
  ```

- [ ] **4.4** Commit and push to the `main` branch
- [ ] **4.5** Verify the raw URL works in your browser:
      `https://raw.githubusercontent.com/<you>/<repo>/main/Progress.md`

---

### 🔗 Step 5 — Repo URL Format Requirement

The project's **Repo URL** in DevTrack Pro must be a standard GitHub URL:

```
✅ https://github.com/Glenn-IT/my-project
✅ https://github.com/Glenn-IT/my-project/
❌ https://github.com/Glenn-IT/my-project.git  (we'll strip .git automatically)
❌ A non-GitHub URL (GitLab, Bitbucket — not supported in v1)
```

---

### 🧪 Step 6 — Testing Checklist (After Build)

- [ ] **6.1** Project has a valid GitHub repo URL saved in DevTrack Pro
- [ ] **6.2** `Progress.md` exists and is pushed to `main` in that repo
- [ ] **6.3** Click "Sync from GitHub" button on Project Details
- [ ] **6.4** Progress bar updates to the value in `Progress.md`
- [ ] **6.5** "Last synced" timestamp appears below the bar
- [ ] **6.6** Edit `Progress.md`, push again, re-click sync → bar updates again
- [ ] **6.7** Test error case: project with no repo URL → shows "No repo URL set"
- [ ] **6.8** Test error case: `Progress.md` missing from repo → shows "Progress.md not found"

---

## 🗂️ Files To Be Created / Modified

| File                                          | Action                       |
| --------------------------------------------- | ---------------------------- |
| `backend/controllers/githubSyncController.js` | 🆕 Create                    |
| `backend/routes/githubSync.js`                | 🆕 Create                    |
| `backend/server.js`                           | ✏️ Add route registration    |
| `src/api/githubSyncApi.js`                    | 🆕 Create                    |
| `src/pages/ProjectDetails.jsx`                | ✏️ Add sync button + display |
| `database` (via phpMyAdmin)                   | ✏️ ALTER TABLE projects      |

---

## 🚦 Implementation Order

```
1. Run the SQL (Step 1)
2. Build backend controller + route (Step 2)
3. Restart backend
4. Create src/api/githubSyncApi.js (Step 3.1)
5. Update ProjectDetails.jsx (Step 3.2 + 3.3)
6. Push Progress.md to your GitHub repo (Step 4)
7. Test end-to-end (Step 6)
```

---

## ⚠️ Known Limitations (v1)

| Limitation         | Notes                                                             |
| ------------------ | ----------------------------------------------------------------- |
| Public repos only  | Private repos need a GitHub Personal Access Token (can add in v2) |
| Manual sync only   | Auto-sync on push needs GitHub Webhooks (can add in v2)           |
| `main` branch only | Branch name is hardcoded to `main` (configurable in v2)           |
| GitHub only        | GitLab/Bitbucket not supported in v1                              |

---

_Once you've gone through the checklist above and confirmed Steps 1–4 are ready, give the go signal and we'll start building._
