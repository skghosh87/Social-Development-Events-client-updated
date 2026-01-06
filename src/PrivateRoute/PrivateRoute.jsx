import React from "react";
import { Navigate, useLocation } from "react-router";

import { useAuth } from "../Context/AuthProvider";

const PrivateRoute = ({ children }) => {
  // FIX: useAuth হুক ব্যবহার করা হলো
  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mb-4"></div>
        <p className="text-gray-700 text-lg font-semibold">
          Checking authentication status...
        </p>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
