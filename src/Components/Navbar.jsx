import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "/Logo.png";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import Container from "./Container";
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { useAuth } from "../Hooks/useAuth";

const DEFAULT_AVATAR = "/default-user.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logOut, loading } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleSignout = () => {
    logOut()
      .then(() => {
        toast.success("Signed out successfully");
        navigate("/login");
      })
      .catch((e) => toast.error(e.message));
  };

  // NavLink স্টাইল - ফন্ট আরও বোল্ড করা হয়েছে (font-semibold/font-bold)
  const navStyles = ({ isActive }) =>
    `relative py-1 transition-all duration-300 ${
      isActive
        ? "text-secondary font-bold after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-secondary"
        : "text-slate-700 dark:text-slate-200 font-semibold hover:text-secondary"
    }`;

  const menuLinks = (
    <>
      <li>
        <NavLink to="/" className={navStyles}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/upcoming-events" className={navStyles}>
          Upcoming Events
        </NavLink>
      </li>
      <li>
        <NavLink to="/about-us" className={navStyles}>
          About Us
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/dashboard" className={navStyles}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={navStyles}>
              Contact
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-950 py-3 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <Container className="flex items-center justify-between h-[50px]">
          <div className="w-32 skeleton-pro h-8"></div>
          <div className="hidden lg:flex gap-8">
            <div className="w-64 skeleton-pro h-4"></div>
          </div>
          <div className="w-10 skeleton-pro h-10 rounded-full"></div>
        </Container>
      </div>
    );
  }

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-all duration-300 shadow-sm">
      <Container className="flex items-center justify-between h-[70px]">
        {/* বাম পাশ: লোগো ও মোবাইল মেনু */}
        <div className="flex items-center gap-4">
          <div className="dropdown lg:hidden">
            <label
              tabIndex={0}
              className="btn btn-ghost lg:hidden text-primary dark:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow-xl bg-white dark:bg-slate-800 rounded-box w-52 space-y-2"
            >
              {menuLinks}
            </ul>
          </div>

          <Link to="/" className="flex gap-2 items-center group">
            <img
              src={logo}
              className="w-9 h-9 object-contain group-hover:scale-110 transition-transform"
              alt="Logo"
            />
            <span className="font-extrabold text-2xl text-primary dark:text-white tracking-tight">
              SDEP<span className="text-secondary">.</span>
            </span>
          </Link>
        </div>

        {/* মাঝখান: ডেস্কটপ মেনু */}
        <div className="hidden lg:flex">
          <ul className="flex items-center gap-8 uppercase text-[13px] tracking-wider">
            {menuLinks}
          </ul>
        </div>

        {/* ডান পাশ: থিম ও প্রোফাইল */}
        <div className="flex items-center gap-4">
          <div className="tooltip tooltip-bottom" data-tip="Switch Theme">
            <input
              type="checkbox"
              onChange={(e) => handleTheme(e.target.checked)}
              checked={theme === "dark"}
              className="toggle toggle-secondary toggle-sm md:toggle-md border-slate-400 bg-slate-200"
            />
          </div>

          {user ? (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar border-2 border-secondary/20 hover:border-secondary transition-all"
              >
                <div className="w-10 rounded-full">
                  <img alt="Profile" src={user?.photoURL || DEFAULT_AVATAR} />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl bg-white dark:bg-slate-800 rounded-xl w-60 border border-slate-100 dark:border-slate-700"
              >
                <div className="px-4 py-3 mb-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-bold text-primary dark:text-white truncate">
                    {user?.displayName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <li>
                  <Link to="/dashboard" className="py-2 font-semibold">
                    <FaTachometerAlt className="text-secondary" /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/profile-update"
                    className="py-2 font-semibold"
                  >
                    <FaUserCircle className="text-secondary" /> Update Profile
                  </Link>
                </li>
                <li className="mt-2">
                  <button
                    onClick={handleSignout}
                    className="btn btn-sm btn-error btn-outline w-full flex items-center justify-center gap-2 font-bold"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn-pro text-sm px-6 rounded-lg">
              Login
            </Link>
          )}
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
