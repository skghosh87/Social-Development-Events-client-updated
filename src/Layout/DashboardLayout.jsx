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
        toast.success("Signed out from Dashboard");
        navigate("/login");
      })
      .catch((e) => toast.error(e.message));
  };

  // উন্নত মেনু স্টাইল (High Contrast & Clear Typography)
  const navStyles = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-3 transition-all duration-300 rounded-xl mx-3 font-medium text-[15px] ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const sidebarLinks = (
    <div className="flex flex-col h-full justify-between py-6">
      <ul className="space-y-1.5">
        <li>
          <NavLink to="/dashboard" end className={navStyles}>
            <FaTachometerAlt className="text-lg" /> Overview
          </NavLink>
        </li>

        {!isRoleLoading && dbUser?.role === "user" && (
          <li>
            <NavLink to="/dashboard/joined-events" className={navStyles}>
              <FaHistory className="text-lg" /> Joined Events
            </NavLink>
          </li>
        )}

        {!isRoleLoading &&
          (dbUser?.role === "admin" || dbUser?.role === "organizer") && (
            <div className="pt-6 mt-6 border-t border-slate-800/50">
              <p className="px-8 text-[11px] font-bold text-slate-500 uppercase tracking-[2px] mb-3">
                Management
              </p>
              <li className="space-y-1.5">
                <NavLink to="/dashboard/create-event" className={navStyles}>
                  <FaPlusCircle className="text-lg" /> Create Event
                </NavLink>
                <NavLink to="/dashboard/manage-events" className={navStyles}>
                  <FaTasks className="text-lg" /> My Events
                </NavLink>
                {dbUser?.role === "admin" && (
                  <NavLink to="/dashboard/all-users" className={navStyles}>
                    <FaUsersCog className="text-lg" /> All Users
                  </NavLink>
                )}
              </li>
            </div>
          )}

        <div className="pt-6 mt-6 border-t border-slate-800/50">
          <p className="px-8 text-[11px] font-bold text-slate-500 uppercase tracking-[2px] mb-3">
            Account Settings
          </p>
          <li>
            <NavLink to="/dashboard/profile-update" className={navStyles}>
              <FaUserEdit className="text-lg" /> Update Profile
            </NavLink>
          </li>
        </div>
      </ul>

      <div className="px-6 space-y-3 mt-auto">
        <Link
          to="/"
          className="flex items-center gap-3 px-5 py-3 text-slate-400 hover:text-blue-400 border border-slate-800 rounded-xl transition-all duration-300 hover:border-blue-400/30"
        >
          <FaHome /> Back Home
        </Link>
        <button
          onClick={handleSignout}
          className="w-full flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300"
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617]">
      {/* ১. ডেস্কটপ সাইডবার (Deep Slate Background for better contrast) */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0f172a] text-white sticky top-0 h-screen shadow-2xl border-r border-slate-800">
        <div className="p-8 mb-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-black text-2xl tracking-tighter text-white">
              SDEP<span className="text-blue-500">.</span>
            </span>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-bold uppercase">
              {isRoleLoading ? "..." : dbUser?.role}
            </span>
          </Link>
        </div>
        {sidebarLinks}
      </aside>

      {/* ২. মোবাইল সাইডবার */}
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
          className={`absolute left-0 top-0 h-full w-72 bg-[#0f172a] transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-8 flex justify-between items-center border-b border-slate-800">
            <span className="font-bold text-white tracking-tight">
              SDEP Dashboard
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-white transition"
            >
              <FaTimes size={20} />
            </button>
          </div>
          {sidebarLinks}
        </aside>
      </div>

      {/* ৩. মেইন কন্টেন্ট */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-slate-600 dark:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <FaBars size={22} />
            </button>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white hidden md:block">
              Dashboard Overview
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                {user?.displayName}
              </p>
              <p className="text-[10px] text-blue-500 dark:text-blue-400 uppercase tracking-widest font-black">
                {isRoleLoading ? "Verifying..." : dbUser?.role}
              </p>
            </div>
            <img
              src={user?.photoURL || "/default-user.png"}
              alt="User"
              className="w-11 h-11 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover"
            />
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
