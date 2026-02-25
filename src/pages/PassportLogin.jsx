import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function PassportLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await loginUser(email, password);
      
      if (result.success) {
        setMessage("Login successful! Redirecting...");
        
        // Show token info
        alert(`Dual Token System Activated!\n\nAccess Token: 30 seconds\nRefresh Token: 7 days (stored in DB)\n\nUser: ${result.user.name}`);
        
        // Navigate to dashboard
        setTimeout(() => {
          navigate("/passport-dashboard", { replace: true });
        }, 1000);
      }
    } catch (err) {
      setMessage(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[350px]">
        <h2 className="text-2xl font-bold text-center mb-6">Passport.js Login</h2>
        
        {/* Dual Token Info */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            <strong>Dual Token System:</strong> Access (30s) + Refresh (7 days)
          </p>
        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-3 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-3 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {message && (
          <p className={`text-sm mb-3 ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-sm">
          New user?{" "}
          <a href="/passport-register" className="text-indigo-600 font-semibold">
            Create account
          </a>
        </p>
        
        {/* System Info */}
        <div className="mt-6 pt-4 border-t text-xs text-gray-500">
          <p className="text-center">
            🔐 Access Token: 30 seconds expiry
          </p>
          <p className="text-center mt-1">
            🔄 Refresh Token: 7 days, stored in database
          </p>
        </div>
      </div>
    </div>
  );
}