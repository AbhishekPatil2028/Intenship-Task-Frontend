import { useEffect, useState } from "react";
import { getWelcome } from "../services/protectedService";
import { logoutUser, getTokenInfo } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function PassportDashboard() {
  const [popupMsg, setPopupMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenTimeLeft, setTokenTimeLeft] = useState(30);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get user and start token timer
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Update token time every second
    const updateTokenTime = () => {
      const info = getTokenInfo();
      if (info) {
        setTokenTimeLeft(Math.max(0, info.expiresIn));
        
        // Auto-logout if token expired and no refresh token
        if (info.expiresIn <= 0 && !info.hasRefreshToken) {
          alert('Session expired. Please login again.');
          handleLogout();
        }
      }
    };

    updateTokenTime();
    const interval = setInterval(updateTokenTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const callProtectedApi = async () => {
    setLoading(true);
    try {
      const res = await getWelcome();
      setPopupMsg(res.message);
      setShowPopup(true);
      
      // Update token info
      const info = getTokenInfo();
      if (info) {
        setTokenTimeLeft(Math.max(0, info.expiresIn));
      }
    } catch (error) {
      alert(error.message || "Session expired. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  // Block back button
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      navigate("/passport-login", { replace: true });
    }
  };

  const showTokenDetails = () => {
    const info = getTokenInfo();
    
    if (info) {
      alert(`🔐 DUAL TOKEN SYSTEM STATUS\n
✅ Access Token: ${info.isExpired ? 'EXPIRED' : 'ACTIVE'}
⏰ Time Left: ${tokenTimeLeft} seconds
🔄 Refresh Token: ${info.hasRefreshToken ? 'PRESENT (in DB)' : 'MISSING'}
👤 User: ${user?.name} (${user?.email})
📅 Token Issued: ${info.issuedAt}
⏳ Token Expires: ${info.expiresAt}

📊 System: Dual Token Authentication
• Access Token: 30 seconds expiry
• Refresh Token: 7 days (MongoDB storage)
• Auto-refresh: Active via interceptor`);
    } else {
      alert('No token information available');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Passport.js Dashboard</h2>
        
        {/* User Info */}
        {user && (
          <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
            <p className="text-indigo-800 font-medium">Welcome, {user.name}!</p>
            <p className="text-sm text-indigo-600">{user.email}</p>
          </div>
        )}
        
        {/* Token Status Display */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Access Token:</span>
            <span className={`font-bold ${tokenTimeLeft > 10 ? 'text-green-600' : tokenTimeLeft > 5 ? 'text-yellow-600' : 'text-red-600'}`}>
              {tokenTimeLeft > 0 ? 'Active' : 'Expired'}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Time Left:</span>
            <span className="font-bold">{tokenTimeLeft}s</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            🔐 30s expiry • 🔄 Auto-refresh active • 🗄️ DB stored refresh token
          </div>
        </div>

        <p className="text-gray-600 mb-6">Protected area with Dual Token System</p>
          
        <div className="space-y-3">
          <button
            onClick={callProtectedApi}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Calling API..." : "Test Protected API"}
          </button>

          <button
            onClick={showTokenDetails}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Show Token Details
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Logout & Revoke Tokens
          </button>
        </div>
        
        {/* Info Footer */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-500">
            💡 Click "Test Protected API" when token expires to trigger auto-refresh
          </p>
        </div>
      </div>

      {/* API Response Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
            <h3 className="text-lg font-bold mb-2">Protected API Response</h3>
            <p className="text-gray-700 mb-4">{popupMsg}</p>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
              <p className="text-sm text-green-700 font-medium">✅ Dual Token System Working</p>
              <p className="text-xs text-green-600 mt-1">
                Access Token: {tokenTimeLeft > 0 ? 'Valid' : 'Expired'} ({tokenTimeLeft}s)
              </p>
            </div>
            
            <button
              onClick={() => setShowPopup(false)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}