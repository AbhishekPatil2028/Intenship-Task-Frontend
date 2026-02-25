import { useState } from "react";
import chatApi from "../chat/chatApi";
import { useNavigate } from "react-router-dom";

export default function ChatSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
  try {
    // 1️⃣ create account
    const res = await chatApi.post("/chatAuth/chat-signup", {
      name,
      email,
      password
    });

    // 2️⃣ AUTO LOGIN (🔥 IMPORTANT)
    localStorage.setItem("chatUser", JSON.stringify(res.data));

    // 3️⃣ redirect to chat
    navigate("/chat");
  } catch (err) {
    alert(err.response?.data?.message || "Signup failed");
  }
};


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Account</h2>

        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        
        <input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={styles.input}
/>

        <button style={styles.btn} onClick={signup}>
          Create Account
        </button>

        <p style={{ marginTop: 16 }}>
          Already have account?{" "}
          <span style={styles.link} onClick={() => navigate("/chat-login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f2f5"
  },
  card: {
    background: "#fff",
    padding: 32,
    borderRadius: 10,
    width: 320,
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  btn: {
    width: "100%",
    padding: 12,
    background: "#25D366",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  link: {
    color: "#25D366",
    cursor: "pointer"
  }
};
