import { useState } from "react";
import Card from "../components/Card";
import { exportDatabase } from "../api/exportApi";
import { Database, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const Settings = () => {
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error" | null

  const handleExport = async () => {
    setExporting(true);
    setStatus(null);
    try {
      const res = await exportDatabase();
      const blob = new Blob([res.data], { type: "application/sql" });
      const url = window.URL.createObjectURL(blob);
      const disposition = res.headers["content-disposition"];
      const match = disposition && disposition.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : `devtrack-pro-backup-${Date.now()}.sql`;

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#042630" }}>
        Settings
      </h1>
      <p className="text-sm mb-6" style={{ color: "#6b7c7c" }}>
        Manage system-level tools for DevTrack Pro.
      </p>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#e7efee" }}
          >
            <Database className="w-6 h-6" style={{ color: "#4c7273" }} />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-base" style={{ color: "#042630" }}>
              Export Database
            </h2>
            <p className="text-sm mt-1" style={{ color: "#6b7c7c" }}>
              Download a full SQL backup of your database — including table
              structures and all records — as a single .sql file.
            </p>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition disabled:opacity-60"
              style={{ background: "#4c7273" }}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {exporting ? "Exporting..." : "Export as SQL"}
            </button>

            {status === "success" && (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" /> Database exported successfully.
              </p>
            )}
            {status === "error" && (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" /> Export failed. Please try again.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
