import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import { FaShieldAlt } from "react-icons/fa";

const AdminRoute = ({ children }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading || (user && role === null)) {
    console.log("Auth Status:", {
      loading,
      userEmail: user?.email,
      userRole: role,
    });
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
          <FaShieldAlt className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary animate-pulse" />
        </div>
        <p className="font-black text-slate-500 uppercase tracking-widest text-[10px]">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  if (user && role === "admin") {
    return children;
  }

  return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default AdminRoute;
