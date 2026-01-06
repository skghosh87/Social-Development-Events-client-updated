import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth"; // আপনার useAuth হুকের পাথ অনুযায়ী দিন

const AdminRoute = ({ children }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // ১. ডেটা লোড হওয়ার সময় একটি সুন্দর স্পিনার বা স্কেলিটন দেখাবে
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
      </div>
    );
  }

  // ২. যদি ইউজার লগইন থাকে এবং তার রোল 'admin' হয়, তবে তাকে পেজটি দেখতে দাও
  if (user && role === "admin") {
    return children;
  }

  // ৩. যদি অ্যাডমিন না হয়, তবে তাকে ড্যাশবোর্ডে পাঠিয়ে দাও (অথবা লগইন পেজে)
  return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default AdminRoute;
