// App.jsx - FINAL DEBUGGED VERSION
import { Routes, Route , Navigate ,BrowserRouter as Router } from "react-router-dom";
import { useEffect } from 'react';
import TaskSheet from "./pages/TaskSheet";
import UserCard from './pages/UserCard';
import ContactList from "./pages/ContactList";
import ContactPage from "./pages/ContactPage";
import MailPage from "./pages/MailPage";
import UploadPage from "./pages/UploadPage";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import ChatHome from "./pages/ChatHome";
import ChatLogin from "./pages/ChatLogin";
import ChatSignup from "./pages/ChatSignup";
import ChatPage from "./pages/ChatPage"
import RequireAuth from "./Auth/ChatRequireAuth";
import GuestOnly from "./Auth/ChatGuestOnly";

import PassportLogin from './pages/PassportLogin';
import PassportRegister from './pages/PassportRegister';
import PassportDashboard from './pages/PassportDashboard';
import { isAuthenticated } from './services/authService';



import './App.css'

function App() {
 
  return (
    <Routes>
      <Route path="/" element={<TaskSheet/>} />
      <Route path="/usercard" element={<UserCard/>} />
      <Route path="/contacts" element={<ContactList />} />
      <Route path="/contacts/new" element={<ContactPage />} />
      <Route path="/contacts/edit/:id" element={<ContactPage />} />
      <Route path="/contactform" element={<ContactPage />} />
      <Route path="/mail" element={<MailPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/auth" element={<Login />} />
      <Route path="/signup" element={<Signup />}/>
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/chat-home" element={<ChatHome />} />
      <Route path="/chat-login" element={
        <GuestOnly>
          <ChatLogin />
        </GuestOnly>
      } />
      <Route path="/chat-signup" element={
        <GuestOnly>
          <ChatSignup />
        </GuestOnly>
      } />
      <Route path="/chat" element={
        <RequireAuth>
          <ChatPage />
        </RequireAuth>
      } />
      
      {/* Public Routes */}
        <Route path="/passport-login" element={<PassportLogin />} />
        <Route path="/passport-register" element={<PassportRegister />} />
        
        {/* Protected Route */}
        <Route 
          path="/passport-dashboard" 
          element={
            <ProtectedRoute>
              <PassportDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirects */}
        <Route path="/" element={<Navigate to="/passport-login" replace />} />
        <Route path="*" element={<Navigate to="/passport-login" replace />} />

    </Routes>
  );
}

export default App;