import { useNavigate } from "react-router-dom";

export default function ChatHome() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>ChatApp</h1>
        <p style={styles.subtitle}>
          Simple • Fast • Real-time
        </p>

        <button style={styles.primaryBtn} onClick={() => navigate("/chat-login")}>
          Continue to Chat
        </button>

        <p style={{ margin: "16px 0" }}>New here?</p>

        <button style={styles.secondaryBtn} onClick={() => navigate("/chat-signup")}>
          Create New Account
        </button>
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
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  },
  title: {
    marginBottom: 8,
    color: "#25D366" // WhatsApp green
  },
  subtitle: {
    color: "#666",
    marginBottom: 24
  },
  primaryBtn: {
    width: "100%",
    padding: 12,
    background: "#25D366",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 16,
    cursor: "pointer"
  },
  secondaryBtn: {
    width: "100%",
    padding: 12,
    background: "#fff",
    color: "#25D366",
    border: "2px solid #25D366",
    borderRadius: 6,
    fontSize: 16,
    cursor: "pointer"
  }
};
