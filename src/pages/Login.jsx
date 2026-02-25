import { useState } from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../firebase/auth.service";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔐 Email + Password Login
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await apiClient.post("/auth/login", {
        email,
        password,
      });

      login(res.data.token);
      toast.success("Login successful ✅");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Google Login (REAL SYSTEM UX)
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const token = await loginWithGoogle();
      login(token);

      toast.success("Logged in with Google ✅");
      navigate("/dashboard");
    } catch {
      toast.error("Google login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD WITH SHOW / HIDE */}
        <div className="relative mb-4">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2 text-sm text-indigo-600"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mt-3 border py-2 rounded flex justify-center gap-2 hover:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5"
            alt="Google"
          />
          Login with Google
        </button>

        {/* CREATE ACCOUNT */}
        <p
          className="text-sm text-center mt-4 cursor-pointer text-indigo-600 hover:underline"
          onClick={() => navigate("/signup")}
        >
          Create account
        </p>
      </div>
    </div>
  );
}
