import React, { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import { toast } from "react-toastify";
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaTasks,
  FaHistory,
  FaUserEdit,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignout = () => {
    logOut()
      .then(() => {
        toast.success("Signed out from Dashboard");
        navigate("/login");
      })
      .catch((e) => toast.error(e.message));
  };

  // ড্যাশবোর্ড মেনু লিন্ক স্টাইল
  const navStyles = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-3 transition-all duration-300 rounded-lg mx-2 ${
      isActive
        ? "bg-secondary text-white shadow-lg shadow-blue-500/30"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  const sidebarLinks = (
    <div className="flex flex-col h-full justify-between py-6">
      <ul className="space-y-2">
        {/* সবার জন্য (Requirement 7: Sidebar Menu) */}
        <li>
          <NavLink to="/dashboard" end className={navStyles}>
            <FaTachometerAlt /> Overview
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/joined-events" className={navStyles}>
            <FaHistory /> Joined Events
          </NavLink>
        </li>

        {/* অ্যাডমিন/অর্গানাইজারদের জন্য (Requirement 7: Min 3 items) */}
        <div className="pt-4 mt-4 border-t border-slate-800">
          <p className="px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Organizer Tools
          </p>
          <li>
            <NavLink to="/dashboard/create-event" className={navStyles}>
              <FaPlusCircle /> Create Event
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-events" className={navStyles}>
              <FaTasks /> Manage My Events
            </NavLink>
          </li>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800">
          <p className="px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Account
          </p>
          <li>
            <NavLink to="/dashboard/profile-update" className={navStyles}>
              <FaUserEdit /> Update Profile
            </NavLink>
          </li>
        </div>
      </ul>

      {/* নিচের অংশ */}
      <div className="px-4 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-emerald-400 border border-slate-800 rounded-lg"
        >
          <FaHome /> Back to Home
        </Link>
        <button
          onClick={handleSignout}
          className="w-full flex items-center gap-3 px-6 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-base-200 dark:bg-slate-950">
      {/* ১. সাইডবার (ডেস্কটপ) */}
      <aside className="hidden lg:flex flex-col w-72 bg-primary text-white sticky top-0 h-screen shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-extrabold text-2xl tracking-tight">
              SDEP<span className="text-secondary">.</span>
            </span>
            <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-bold">
              DASHBOARD
            </span>
          </Link>
        </div>
        {sidebarLinks}
      </aside>

      {/* ২. মোবাইল সাইডবার (Overlay) */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-primary transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 flex justify-between items-center border-b border-slate-800">
            <span className="font-bold text-white">SDEP Dashboard</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white"
            >
              <FaTimes size={20} />
            </button>
          </div>
          {sidebarLinks}
        </aside>
      </div>

      {/* ৩. মেইন কন্টেন্ট এরিয়া */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* টপ নেভিগেশন (Requirement 7: Top Navbar) */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-primary dark:text-white p-2"
            >
              <FaBars size={22} />
            </button>
            <h2 className="text-xl font-bold text-primary dark:text-white hidden md:block">
              Welcome Back, {user?.displayName?.split(" ")[0]}!
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-primary dark:text-white">
                {user?.displayName}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                General User
              </p>
            </div>
            <img
              src={user?.photoURL || "/default-user.png"}
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-secondary p-0.5 shadow-sm"
            />
          </div>
        </header>

        {/* ডায়নামিক পেজ কন্টেন্ট */}
        <div className="p-6 md:p-10 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
