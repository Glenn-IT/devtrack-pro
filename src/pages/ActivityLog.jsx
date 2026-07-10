import { useState, useEffect } from "react";
import { getActivities } from "../api/activitiesApi";
import Card from "../components/Card";
import {
  Loader2,
  FolderPlus,
  Pencil,
  Trash2,
  CheckSquare,
  ClipboardCheck,
  Activity,
} from "lucide-react";

const ICONS = {
  "folder-plus": FolderPlus,
  pencil: Pencil,
  "trash-2": Trash2,
  "check-square": CheckSquare,
  "clipboard-check": ClipboardCheck,
  activity: Activity,
};

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getActivities()
      .then((res) => setActivities(res.data))
      .catch(() => setError("Could not load activity log."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#4c7273" }} />
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: "#991b1b" }}>
          {error}
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "#041421" }}>
          Activity Log
        </h2>
        <p className="text-sm mt-1" style={{ color: "#4c7273" }}>
          Recent changes to Projects, Tasks, and the Weekly Tracker.
        </p>
      </div>

      <Card className="p-4">
        {activities.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "#86b9b0" }}>
            No activity recorded yet.
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: "#d0d6d6" }}>
            {activities.map((a) => {
              const Icon = ICONS[a.icon] || Activity;
              return (
                <div key={a.id} className="flex items-start gap-3 py-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#e0efee" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#042630" }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm" style={{ color: "#041421" }}>
                      {a.message}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#86b9b0" }}>
                      {a.user_name || "Unknown"} ·{" "}
                      {new Date(a.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ActivityLog;
