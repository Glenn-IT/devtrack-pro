const db = require("../config/db");
const axios = require("axios");

// GET /api/projects/:id/sync-github
const syncFromGitHub = async (req, res) => {
  const projectId = req.params.id;

  try {
    // 1. Get the project's repo URL from DB
    const [rows] = await db.query("SELECT * FROM projects WHERE id = ?", [
      projectId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = rows[0];

    if (!project.repo) {
      return res
        .status(400)
        .json({ error: "No GitHub repo URL saved for this project." });
    }

    // 2. Convert GitHub repo URL → extract owner/repo
    // e.g. https://github.com/Glenn-IT/my-repo  →  owner/repo
    let repoUrl = project.repo
      .trim()
      .replace(/\/$/, "")
      .replace(/\.git$/, "");

    if (!repoUrl.includes("github.com")) {
      return res
        .status(400)
        .json({ error: "Repo URL is not a valid GitHub URL." });
    }

    // Extract owner/repo from the URL
    const match = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
    if (!match) {
      return res
        .status(400)
        .json({ error: "Could not parse GitHub owner/repo from URL." });
    }

    const ownerRepo = match[1];

    // 3. Use GitHub API tree to find Progress.md anywhere in the repo (any branch, any subfolder)
    let fileContent = null;
    let rawUrl = null;

    const branches = ["main", "master"];
    for (const branch of branches) {
      if (fileContent) break;

      // Get the full file tree for this branch
      let tree;
      try {
        const treeRes = await axios.get(
          `https://api.github.com/repos/${ownerRepo}/git/trees/${branch}?recursive=1`,
          {
            timeout: 10000,
            headers: { Accept: "application/vnd.github+json" },
          },
        );
        tree = treeRes.data.tree;
      } catch (treeErr) {
        // Branch doesn't exist or API error — try next branch
        continue;
      }

      // Find any file named Progress.md (case-insensitive)
      const entry = tree.find(
        (f) =>
          f.type === "blob" && f.path.toLowerCase().endsWith("progress.md"),
      );

      if (!entry) continue;

      rawUrl = `https://raw.githubusercontent.com/${ownerRepo}/${branch}/${entry.path}`;
      try {
        const response = await axios.get(rawUrl, { timeout: 8000 });
        fileContent = response.data;
      } catch (fetchErr) {
        rawUrl = null;
        continue;
      }
    }

    if (!fileContent) {
      return res.status(404).json({
        error: `Progress.md not found in any branch or subfolder of the repo.`,
      });
    }

    // 4. Parse the fields from the file
    // Supports: progress: 75 / status: Ongoing / note: Some text here
    const parseField = (text, field) => {
      const regex = new RegExp(`^${field}\\s*:\\s*(.+)$`, "im");
      const match = text.match(regex);
      return match ? match[1].trim() : null;
    };

    const rawProgress = parseField(fileContent, "progress");
    const rawStatus = parseField(fileContent, "status");
    const rawNote = parseField(fileContent, "note");

    if (!rawProgress) {
      return res.status(422).json({
        error: "Progress.md found but missing required field: progress",
      });
    }

    const progress = Math.min(100, Math.max(0, parseInt(rawProgress, 10)));
    if (isNaN(progress)) {
      return res.status(422).json({
        error: "progress value in Progress.md is not a valid number.",
      });
    }

    // Validate status if provided
    const validStatuses = [
      "To Do",
      "Ongoing",
      "Completed",
      "On Hold",
      "Cancelled",
    ];
    const newStatus =
      rawStatus && validStatuses.includes(rawStatus)
        ? rawStatus
        : project.status;
    const syncNote = rawNote || null;
    const syncedAt = new Date();

    // 5. Update the DB
    await db.query(
      "UPDATE projects SET progress = ?, status = ?, last_synced_at = ?, last_sync_note = ? WHERE id = ?",
      [progress, newStatus, syncedAt, syncNote, projectId],
    );

    // 6. Return the updated values
    res.json({
      success: true,
      progress,
      status: newStatus,
      last_synced_at: syncedAt,
      last_sync_note: syncNote,
      raw_url: rawUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { syncFromGitHub };
