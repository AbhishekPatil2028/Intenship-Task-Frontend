import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function PassportRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (!email.includes('@')) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await registerUser({ 
        name: name.trim(), 
        email: email.trim(), 
        password: password.trim() 
      });
      
      console.log('Registration result:', result);
      
      // ✅ FIXED: Check for the correct success condition
      if (result.success || result.message?.includes('successful')) {
        // Store tokens if they exist
        if (result.accessToken) {
          localStorage.setItem('accessToken', result.accessToken);
        }
        if (result.refreshToken) {
          localStorage.setItem('refreshToken', result.refreshToken);
        }
        if (result.user?.id) {
          localStorage.setItem('userId', result.user.id);
        }
        if (result.user?.name) {
          localStorage.setItem('userName', result.user.name);
        }
        
        // Store basic user info even if no user object in response
        localStorage.setItem('userEmail', email.trim());
        localStorage.setItem('userDisplayName', name.trim());
        
        // Show success message
        alert(`Account Created Successfully!\n\nWelcome ${name.trim()}!`);
        
        // Navigate to dashboard
        console.log('Navigating to dashboard...');
        navigate("/passport-dashboard", { replace: true });
      } else {
        // If we get here but registration seemed successful, check response structure
        console.log('Unexpected response structure:', result);
        
        // Still try to navigate if we got any positive response
        if (result.message || result.success === true) {
          // Store email and name at minimum
          localStorage.setItem('userEmail', email.trim());
          localStorage.setItem('userDisplayName', name.trim());
          
          alert('Account created! Redirecting to dashboard...');
          navigate("/passport-dashboard", { replace: true });
        } else {
          setError(result.message || result.error || "Registration completed but no success confirmation");
        }
      }
    } catch (err) {
      console.error('Registration error details:', err);
      
      // More specific error messages
      if (err.response?.status === 400) {
        setError(err.response?.data?.error || 'Invalid input data');
      } else if (err.response?.status === 409) {
        setError('User already exists with this email');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.message?.includes('Network Error')) {
        setError('Network error. Check your connection and try again.');
      } else {
        setError(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[350px]">
        <h2 className="text-2xl font-bold text-center mb-6">Passport.js Register</h2>
        
        {/* System Info */}
        <div className="mb-6 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-700 text-center">
            <strong>Dual Token Authentication</strong>
          </p>
          <div className="text-xs text-purple-600 mt-1 text-center">
            <p>Access: 30s • Refresh: 7 days • DB Storage</p>
          </div>
        </div>

        <input
          placeholder="Full Name"
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
         
        <input
          type="password"
          placeholder="Password (min. 6 characters)"
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        )}
        
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : "Sign Up"}
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <a 
            href="/passport-login" 
            className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              if (!loading) navigate("/passport-login");
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}