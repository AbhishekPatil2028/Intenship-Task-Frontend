import { Navigate } from "react-router-dom";

export default function GuestOnly({ children }) {
  const user = JSON.parse(localStorage.getItem("chatUser"));

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return children;
}
