const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(
  cors({
    // Allow any localhost port — handles Vite auto port changes (5173, 5174, 5175...)
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────
app.use("/api/projects", require("./routes/projects"));
app.use("/api/projects", require("./routes/githubSync"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/milestones", require("./routes/milestones"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/meetings", require("./routes/meetings"));
app.use("/api/auth", require("./routes/auth"));

// ─── Health Check ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "🚀 DevTrack Pro API is running!", status: "OK" });
});

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 DevTrack Pro API running at http://localhost:${PORT}`);
  console.log(`📡 Accepting requests from http://localhost:5173\n`);
});
