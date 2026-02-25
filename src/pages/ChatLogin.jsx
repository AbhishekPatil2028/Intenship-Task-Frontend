import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import chatApi from "../chat/chatApi";
import "./chatAuth.css"; // <-- css in same folder

export default function ChatLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {
      setLoading(true);
      const res = await chatApi.post("/chatAuth/chat-login", { email,password });
      setError("")
      localStorage.setItem("chatUser", JSON.stringify(res.data));
      navigate("/chat");
    } catch (err) {
setError(err.response?.data?.message || "Invalid email or password");    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p className="sub">Login to continue chatting</p>

        <input
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
{error && (
  <p style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
    {error}
  </p>
)}


        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="switch">
          New user? <Link to="/chat-signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}
