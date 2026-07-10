import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import { FolderKanban, Loader2, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
    } finally {
      setLoading(false);
      setSent(true);
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
            Reset your password
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {sent ? (
            <div className="text-center py-2">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: "#4c7273" }} />
              <p className="text-sm" style={{ color: "#042630" }}>
                If that email is registered, a reset link has been sent. Check your inbox.
              </p>
              <Link
                to="/login"
                className="inline-block mt-4 text-sm font-medium"
                style={{ color: "#4c7273" }}
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm" style={{ color: "#6b7c7c" }}>
                Enter your account email and we'll send you a link to reset your password.
              </p>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#042630" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: "#d0d6d6" }}
                  placeholder="you@gmail.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
                style={{ background: "#4c7273" }}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
