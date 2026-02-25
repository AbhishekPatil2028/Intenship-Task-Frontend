import apiClient from "../api/apiClient";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const hasWelcomed = useRef(false);

  useEffect(() => {
    apiClient
      .get("/auth/profile")
      .then((res) => {
        setUser(res.data);
        if (!hasWelcomed.current) {
          toast.success("Welcome back 👋");
          hasWelcomed.current = true;
        }
      })
      .catch(() => {
        toast.error("Session expired");
        logout();
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="text-xl font-bold text-indigo-600">
            RJ Dashboard
          </h1>
          <button
            onClick={logout}
            className="text-red-500 text-sm hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Account Type" value="Authenticated User" />
          <Card title="Login Status" value="Active" green />
          <Card title="User ID" value={user?.userId || "N/A"} />
        </div>

        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-3">Profile Data</h2>
          <pre className="bg-gray-50 p-4 rounded text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
}

function Card({ title, value, green }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p
        className={`text-lg font-semibold ${
          green ? "text-green-600" : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
