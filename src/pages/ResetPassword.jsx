import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import { FolderKanban, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(180deg, #041421 0%, #042630 100%)" }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            style={{ background: "#4c7273" }}
          >
            <FolderKanban className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">DevTrack Pro</h1>
          <p className="text-sm" style={{ color: "#86b9b0" }}>
            Choose a new password
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {done ? (
            <div className="text-center py-2">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: "#4c7273" }} />
              <p className="text-sm" style={{ color: "#042630" }}>
                Password reset successfully. Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#042630" }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: "#d0d6d6" }}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#042630" }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: "#d0d6d6" }}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
                style={{ background: "#4c7273" }}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <Link
                to="/login"
                className="block text-center text-sm"
                style={{ color: "#4c7273" }}
              >
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
