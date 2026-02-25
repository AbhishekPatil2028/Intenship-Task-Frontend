import { useState, useRef, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";


export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const hasShownWelcome = useRef(false);


  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold"
      >
        A
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-2 text-sm text-gray-600 border-b">
            Signed in
          </div>

          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => window.location.href = "/dashboard"}
          >
            Dashboard
          </button>

          <button
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
