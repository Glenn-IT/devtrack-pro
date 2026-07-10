import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { FolderKanban, Loader2, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
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
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
        >
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#042630" }}>
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium" style={{ color: "#042630" }}>
                Password
              </label>
              <Link to="/forgot-password" className="text-xs" style={{ color: "#4c7273" }}>
                Forgot password?
              </Link>
            </div>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
            style={{ background: "#4c7273" }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
