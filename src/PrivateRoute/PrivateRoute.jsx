import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import { FaLock } from "react-icons/fa";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ১. লোডিং স্টেট ডিজাইন
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <div className="relative flex items-center justify-center">
          {/* বাইরের স্পিনার */}
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-r-2 border-b-4 border-l-2 border-secondary/30 border-t-secondary border-b-secondary"></div>

          {/* ভেতরের ছোট স্পিনার */}
          <div className="absolute animate-reverse-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>

          {/* সেন্ট্রাল আইকন */}
          <FaLock
            className="absolute text-secondary/50 animate-pulse"
            size={20}
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-800 dark:text-white text-sm font-black uppercase tracking-[0.3em] animate-pulse">
            Secure <span className="text-secondary">Gateway</span>
          </p>
          <div className="h-1 w-12 bg-secondary/20 mx-auto mt-2 rounded-full overflow-hidden">
            <div className="h-full bg-secondary w-1/2 animate-loading-slide"></div>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
