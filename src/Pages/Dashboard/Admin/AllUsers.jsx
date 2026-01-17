import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaTrashAlt,
  FaUserShield,
  FaSearch,
  FaUsersCog,
  FaUserCircle,
  FaShieldAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useAuth } from "../../../Hooks/useAuth";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ১. সব ইউজার ফেচ করা
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("ইউজার লিস্ট লোড করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [axiosSecure]);

  // ২. রোল টগল লজিক (Admin <-> User)
  const handleToggleRole = async (user) => {
    if (user.email === currentUser?.email) {
      return toast.warning("আপনি নিজের রোল পরিবর্তন করতে পারবেন না!");
    }

    const newRole = user.role === "admin" ? "user" : "admin";

    try {
      const res = await axiosSecure.patch(`/api/users/status/${user._id}`, {
        role: newRole,
      });
      if (res.data.modifiedCount > 0) {
        setUsers(
          users.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
        );
        toast.success(
          `${user.name} এখন একজন ${
            newRole === "admin" ? "অ্যাডমিন" : "সাধারণ ইউজার"
          }!`
        );
      }
    } catch (error) {
      toast.error("রোল পরিবর্তন করা যায়নি।");
    }
  };

  // ৩. স্ট্যাটাস টগল লজিক (Active <-> Suspended)
  const handleToggleStatus = async (user) => {
    if (user.email === currentUser?.email) {
      return toast.warning("আপনি নিজেকে সাসপেন্ড করতে পারবেন না!");
    }

    const newStatus = user.status === "active" ? "suspended" : "active";
    try {
      const res = await axiosSecure.patch(`/api/users/status/${user._id}`, {
        status: newStatus,
      });
      if (res.data.modifiedCount > 0) {
        setUsers(
          users.map((u) =>
            u._id === user._id ? { ...u, status: newStatus } : u
          )
        );
        toast.success(
          `${user.name} এখন ${newStatus === "active" ? "Active" : "Suspended"}`
        );
      }
    } catch (error) {
      toast.error("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।");
    }
  };

  // ৪. ইউজার ডিলিট লজিক
  const handleDeleteUser = (user) => {
    if (user.email === currentUser?.email) {
      return Swal.fire(
        "ভুল!",
        "আপনি নিজের অ্যাকাউন্ট ডিলিট করতে পারবেন না।",
        "error"
      );
    }

    Swal.fire({
      title: "ইউজার রিমুভ করবেন?",
      text: `${user.name}-কে কি স্থায়ীভাবে মুছে ফেলতে চান?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/api/users/${user._id}`);
          if (res.data.deletedCount > 0) {
            setUsers(users.filter((u) => u._id !== user._id));
            Swal.fire(
              "ডিলিট হয়েছে!",
              "ইউজার সফলভাবে রিমুভ হয়েছে।",
              "success"
            );
          }
        } catch (error) {
          toast.error("ডিলিট করতে সমস্যা হয়েছে।");
        }
      }
    });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-bars loading-lg text-secondary"></span>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 animate-fadeIn">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
            <FaUsersCog className="text-secondary" /> User{" "}
            <span className="text-secondary">Nexus</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">
            Full Access Control & Security Management
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-4 focus:ring-secondary/10 font-bold text-sm shadow-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  User Details
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  System Role
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                  Live Status
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                  Operations
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {u.photo ? (
                        <img
                          src={u.photo}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                          alt=""
                        />
                      ) : (
                        <FaUserCircle className="text-4xl text-slate-200" />
                      )}
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-white italic">
                          {u.name || "Anonymous"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold lowercase tracking-tight">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${
                        u.role === "admin"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-indigo-50 text-indigo-600 border-indigo-100"
                      }`}
                    >
                      {u.role === "admin" && (
                        <FaShieldAlt className="text-amber-500" />
                      )}
                      {u.role || "User"}
                    </span>
                  </td>

                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={u.status !== "suspended"}
                          disabled={u.email === currentUser?.email}
                          onChange={() => handleToggleStatus(u)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary disabled:opacity-50"></div>
                      </label>
                      <span
                        className={`text-[8px] font-black uppercase ${
                          u.status === "suspended"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {u.status || "active"}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3">
                      {/* Role Toggle Button */}
                      <button
                        onClick={() => handleToggleRole(u)}
                        disabled={u.email === currentUser?.email}
                        className={`p-3 rounded-2xl transition-all shadow-sm ${
                          u.role === "admin"
                            ? "bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-indigo-500 hover:text-white"
                        } ${
                          u.email === currentUser?.email &&
                          "opacity-30 cursor-not-allowed"
                        }`}
                        title={
                          u.role === "admin"
                            ? "Demote to User"
                            : "Promote to Admin"
                        }
                      >
                        <FaUserShield size={18} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteUser(u)}
                        disabled={u.email === currentUser?.email}
                        className={`p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm ${
                          u.email === currentUser?.email &&
                          "opacity-30 cursor-not-allowed"
                        }`}
                        title="Delete User"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
