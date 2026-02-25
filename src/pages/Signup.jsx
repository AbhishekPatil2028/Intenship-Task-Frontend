import { useState } from "react";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { passwordRules } from "../utils/passwordRules";
import toast from "react-hot-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const isValid = passwordRules.every((r) => r.test(password));

  const handleSignup = async () => {
    if (!isValid) {
      toast.error("Password does not meet requirements ❌");
      return;
    }

    try {
      await apiClient.post("/auth/signup", { email, password });
      toast.success("Account created successfully 🎉");
      navigate("/auth");
    } catch {
      toast.error("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-2">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2 text-sm text-indigo-600"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {/* PASSWORD RULES */}
        <ul className="text-xs mb-4">
          {passwordRules.map((r) => (
            <li
              key={r.label}
              className={r.test(password) ? "text-green-600" : "text-gray-400"}
            >
              ✔ {r.label}
            </li>
          ))}
        </ul>

        <button
          onClick={handleSignup}
          disabled={!isValid}
          className={`w-full py-2 rounded text-white ${
            isValid ? "bg-indigo-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
