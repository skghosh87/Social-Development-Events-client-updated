import React, { useState, useEffect } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
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
  FaUsersCog,
  FaChartLine,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { useAuth } from "../Hooks/useAuth";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dbUser, setDbUser] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      setIsRoleLoading(true);
      axios
        .get(
          `https://social-development-events-seven.vercel.app/api/users/role/${user.email}`
        )
        .then((res) => {
          setDbUser(res.data);
          setIsRoleLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching role:", err);
          setIsRoleLoading(false);
        });
    }
  }, [user?.email]);

  const handleSignout = () => {
    logOut()
      .then(() => {
        toast.success("Signed out successfully");
        navigate("/login");
      })
      .catch((e) => toast.error(e.message));
  };

  const navStyles = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-3 transition-all duration-300 rounded-xl mx-3 font-medium text-[14px] ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  const sidebarLinks = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ১. স্ক্রলযোগ্য মেনু এরিয়া */}
      <div className="flex-1 overflow-y-auto pt-4 space-y-6 scrollbar-hide">
        <ul className="space-y-1">
          {/* জেনারেল সেকশন */}
          <li>
            <NavLink to="/dashboard" end className={navStyles}>
              <FaTachometerAlt className="text-lg" /> Overview
            </NavLink>
          </li>

          {/* ইউজার মেনু */}
          {!isRoleLoading && dbUser?.role === "user" && (
            <li>
              <NavLink to="/dashboard/joined-events" className={navStyles}>
                <FaHistory className="text-lg" /> Joined Events
              </NavLink>
            </li>
          )}

          {/* ইভেন্ট ম্যানেজমেন্ট (Admin/Organizer) */}
          {!isRoleLoading &&
            (dbUser?.role === "admin" || dbUser?.role === "organizer") && (
              <div className="pt-4">
                <p className="px-9 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Management
                </p>
                <div className="space-y-1">
                  <NavLink to="/dashboard/create-event" className={navStyles}>
                    <FaPlusCircle className="text-lg" /> Create Event
                  </NavLink>
                  <NavLink to="/dashboard/manage-events" className={navStyles}>
                    <FaTasks className="text-lg" /> My Events
                  </NavLink>
                </div>
              </div>
            )}

          {/* অ্যাডমিন প্যানেল */}
          {!isRoleLoading && dbUser?.role === "admin" && (
            <div className="pt-4">
              <p className="px-9 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Admin Settings
              </p>
              <div className="space-y-1">
                <NavLink to="/dashboard/all-users" className={navStyles}>
                  <FaUsersCog className="text-lg" /> Manage Users
                </NavLink>
                <NavLink to="/dashboard/all-donations" className={navStyles}>
                  <FaHandHoldingHeart className="text-lg" /> All Donations
                </NavLink>
                <NavLink to="/dashboard/statistics" className={navStyles}>
                  <FaChartLine className="text-lg" /> Reports
                </NavLink>
              </div>
            </div>
          )}

          {/* অ্যাকাউন্ট সেকশন */}
          <div className="pt-4">
            <p className="px-9 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              User Center
            </p>
            <NavLink to="/dashboard/profile-update" className={navStyles}>
              <FaUserEdit className="text-lg" /> Update Profile
            </NavLink>
          </div>
        </ul>
      </div>

      {/* ২. ফিক্সড বটম এরিয়া (সব সময় দৃশ্যমান) */}
      <div className="p-4 bg-[#0f172a] border-t border-slate-800">
        <div className="space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-5 py-2.5 text-slate-400 hover:text-blue-400 border border-slate-800 rounded-xl transition-all text-sm"
          >
            <FaHome /> Back to Site
          </Link>
          <button
            onClick={handleSignout}
            className="w-full flex items-center gap-3 px-5 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617]">
      {/* ডেস্কটপ সাইডবার */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0f172a] text-white sticky top-0 h-screen shadow-2xl border-r border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-slate-800/50">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-black text-2xl tracking-tighter text-white">
              SDEP<span className="text-blue-500">.</span>
            </span>
            <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md font-bold uppercase">
              {isRoleLoading ? "..." : dbUser?.role}
            </span>
          </Link>
        </div>
        {sidebarLinks}
      </aside>

      {/* মোবাইল সাইডবার */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-[#0f172a] transform transition-transform duration-300 flex flex-col ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 flex justify-between items-center border-b border-slate-800 shadow-sm">
            <span className="font-bold text-white tracking-tight">
              Dashboard
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-white transition p-2"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">{sidebarLinks}</div>
        </aside>
      </div>

      {/* মেইন কন্টেন্ট */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-slate-600 dark:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <FaBars size={22} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Overview
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                {user?.displayName}
              </p>
              <p className="text-[10px] text-blue-500 uppercase tracking-widest font-black">
                {isRoleLoading ? "Loading..." : dbUser?.role}
              </p>
            </div>
            <img
              src={user?.photoURL || "/default-user.png"}
              alt="User"
              className="w-11 h-11 rounded-full border-2 border-blue-500/20 shadow-sm object-cover p-0.5"
            />
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1 bg-slate-50 dark:bg-slate-950/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
