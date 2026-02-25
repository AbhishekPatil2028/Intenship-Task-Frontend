import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {TaskProvider} from "./context/TaskContext";
import { AuthProvider } from "./Auth/AuthContext";
import { Toaster } from "react-hot-toast";



import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
    <TaskProvider>
      <AuthProvider>
    <App />
<Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
    }}
  />
      </AuthProvider>

    </TaskProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
