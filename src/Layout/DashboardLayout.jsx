import React, { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
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
  FaUsersCog,
  FaChartLine,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { useAuth } from "../Hooks/useAuth";
import useAdmin from "../Hooks/useAdmin";

const DashboardLayout = () => {
  const { user, logOut, role, loading: authLoading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignout = () => {
    logOut()
      .then(() => {
        toast.success("Signed out successfully");
        navigate("/login");
      })
      .catch((e) => toast.error(e.message));
  };

  // নেভিগেশন স্টাইল
  const navStyles = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-3.5 transition-all duration-300 rounded-xl mx-3 text-[14px] tracking-wide mb-1 ${
      isActive
        ? "bg-secondary text-white font-bold shadow-lg shadow-blue-500/30 scale-[1.02]"
        : "text-slate-400 hover:bg-slate-800 hover:text-white font-semibold"
    }`;

  const sectionHeaderStyles =
    "px-9 text-[10px] font-black text-slate-600 uppercase tracking-[2.5px] mb-3 mt-8";

  const sidebarLinks = (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pt-6 scrollbar-hide">
        <ul className="space-y-1">
          <li>
            <NavLink to="/dashboard" end className={navStyles}>
              <FaTachometerAlt className="text-xl" /> <span>Overview</span>
            </NavLink>
          </li>

          {/* সাধারণ ইউজার সেকশন */}
          {role === "user" && !isAdmin && (
            <li>
              <NavLink to="/dashboard/joined-events" className={navStyles}>
                <FaHistory className="text-xl" /> <span>Joined Events</span>
              </NavLink>
            </li>
          )}

          {/* ইভেন্ট ম্যানেজমেন্ট (অর্গানাইজার বা অ্যাডমিন) */}
          {(isAdmin || role === "organizer") && (
            <div>
              <p className={sectionHeaderStyles}>Management</p>
              <NavLink to="/dashboard/create-event" className={navStyles}>
                <FaPlusCircle className="text-xl" /> <span>Create Event</span>
              </NavLink>
              <NavLink to="/dashboard/manage-events" className={navStyles}>
                <FaTasks className="text-xl" /> <span>My Events</span>
              </NavLink>
            </div>
          )}

          {/* অ্যাডমিন প্যানেল */}
          {isAdmin && (
            <div>
              <p className={sectionHeaderStyles}>Admin Control</p>
              <NavLink to="/dashboard/manage-users" className={navStyles}>
                <FaUsersCog className="text-xl" /> <span>Manage Users</span>
              </NavLink>
              <NavLink to="/dashboard/all-donations" className={navStyles}>
                <FaHandHoldingHeart className="text-xl" />{" "}
                <span>All Donations</span>
              </NavLink>
              <NavLink to="/dashboard/statistics" className={navStyles}>
                <FaChartLine className="text-xl" /> <span>Live Reports</span>
              </NavLink>
            </div>
          )}

          <p className={sectionHeaderStyles}>Personal</p>
          <NavLink to="/dashboard/profile-update" className={navStyles}>
            <FaUserEdit className="text-xl" /> <span>Update Profile</span>
          </NavLink>
        </ul>
      </div>

      {/* বটম ফিক্সড এরিয়া */}
      <div className="p-6 bg-slate-950 border-t border-slate-800/50">
        <Link
          to="/"
          className="flex items-center gap-3 px-6 py-3 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-all text-sm font-bold bg-slate-900 mb-3"
        >
          <FaHome /> Back to Home
        </Link>
        <button
          onClick={handleSignout}
          className="w-full flex items-center gap-3 px-6 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-black"
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </div>
  );

  if (authLoading || isAdminLoading) return null;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
      {/* ডেস্কটপ সাইডবার */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0f172a] text-white sticky top-0 h-screen shadow-2xl border-r border-slate-800">
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
          <Link
            to="/"
            className="font-black text-2xl tracking-tighter text-white"
          >
            SDEP<span className="text-secondary">.</span>
          </Link>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
        {sidebarLinks}
      </aside>

      {/* মোবাইল সাইডবার ড্রয়ার */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] transition-all duration-300 ${
          isSidebarOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-[#0f172a] transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <span className="font-black text-white text-xs tracking-widest uppercase">
              Navigation
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400"
            >
              <FaTimes size={20} />
            </button>
          </div>
          {sidebarLinks}
        </aside>
      </div>

      {/* মেইন এরিয়া */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-slate-600 dark:text-slate-300 p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <FaBars size={22} />
            </button>
            <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tight uppercase">
              {location.pathname.split("/").pop() || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800 dark:text-white leading-none mb-1">
                {user?.displayName}
              </p>
              <p className="text-[9px] text-secondary uppercase tracking-[2px] font-black">
                {isAdmin ? "Admin" : role}
              </p>
            </div>
            <div className="relative group">
              <img
                src={user?.photoURL || "/default-user.png"}
                alt="User"
                className="w-11 h-11 rounded-2xl border-2 border-secondary/20 object-cover shadow-md p-0.5 group-hover:border-secondary transition-all"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
