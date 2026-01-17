import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import axios from "axios";
import { useAuth } from "../Hooks/useAuth";
import {
  FaUserCircle,
  FaShieldAlt,
  FaSave,
  FaKey,
  FaCamera,
} from "react-icons/fa";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

const ProfileUpdate = () => {
  const { user, loading, setUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";

  // ইউজার ডাটা লোড হলে স্টেট আপডেট করুন
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isPasswordUser = user?.providerData.some(
    (provider) => provider.providerId === "password"
  );

  const handleGeneralUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // ১. ফায়ারবেস প্রোফাইল আপডেট
      await updateProfile(user, { displayName, photoURL });

      const token = localStorage.getItem("access-token");
      await axios.patch(
        `${SERVER_BASE_URL}/api/users/update/${user.email}`,
        { displayName, photoURL },
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (setUser) {
        setUser({ ...user, displayName, photoURL });
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      return toast.error("Password needs 6+ chars, 1 uppercase & 1 lowercase.");
    }

    setIsPasswordUpdating(true);
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (error) {
      toast.error(
        error.code === "auth/wrong-password"
          ? "Wrong current password."
          : error.message
      );
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-10 animate-fadeIn">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-primary to-indigo-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden mb-12">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <img
              src={photoURL || "/default-user.png"}
              alt="Preview"
              className="w-32 h-32 rounded-3xl border-4 border-white/20 object-cover shadow-xl group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-2 -right-2 bg-secondary p-2 rounded-xl shadow-lg">
              <FaCamera className="text-white text-xs" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tighter uppercase">
              {user?.displayName || "Your Name"}
            </h2>
            <p className="text-indigo-200 font-medium">{user?.email}</p>
            <div className="inline-block mt-4 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
              Account Settings
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* General Info Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-secondary/10 text-secondary rounded-2xl">
              <FaUserCircle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">
                General Info
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Public identity
              </p>
            </div>
          </div>

          <form onSubmit={handleGeneralUpdate} className="space-y-6">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                Display Name
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
                placeholder="Full Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                Photo URL
              </label>
              <input
                type="url"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
                placeholder="https://image-link.com"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </div>
            <button
              disabled={isUpdating}
              type="submit"
              className="w-full bg-secondary hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 uppercase tracking-tighter"
            >
              {isUpdating ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FaSave />
              )}{" "}
              Save Profile
            </button>
          </form>
        </div>

        {/* Security Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
              <FaShieldAlt size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">
                Security
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Access control
              </p>
            </div>
          </div>

          {isPasswordUser ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                    Confirm
                  </label>
                  <input
                    type="password"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                disabled={isPasswordUpdating}
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-3 uppercase tracking-tighter"
              >
                {isPasswordUpdating ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <FaKey />
                )}{" "}
                Update Security
              </button>
            </form>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-dashed border-amber-200 dark:border-amber-900/50 p-8 rounded-3xl text-center">
              <p className="text-amber-700 dark:text-amber-500 text-sm font-bold">
                আপনি সোশ্যাল মিডিয়া দিয়ে লগইন করেছেন। পাসওয়ার্ড ম্যানেজমেন্ট
                আপনার প্রোভাইডার হ্যান্ডেল করছে।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
