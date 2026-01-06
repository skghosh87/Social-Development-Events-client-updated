import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUserShield, FaUserSlash, FaCheckCircle } from "react-icons/fa";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // সব ইউজার লোড করা
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "social-development-events-seven.vercel.app/api/users"
      );
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load users");
      setLoading(false);
    }
  };

  // ইউজারের রোল আপডেট করা (Make Admin)
  const handleMakeAdmin = async (id) => {
    try {
      const res = await axios.patch(
        `social-development-events-seven.vercel.app/api/users/role/${id}`,
        { role: "admin" }
      );
      if (res.data.modifiedCount > 0) {
        toast.success("User promoted to Admin!");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Error updating role");
    }
  };

  // ইউজার সাসপেন্ড বা অ্যাক্টিভ করা
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `social-development-events-seven.vercel.app/api/users/status/${id}`,
        { status: newStatus }
      );
      if (res.data.modifiedCount > 0) {
        toast.info(`User status updated to ${newStatus}`);
        fetchUsers();
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Users...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-primary dark:text-white">
          Manage All Users
        </h2>
        <p className="text-sm text-slate-500">Total Users: {users.length}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">User</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      src={user.photoURL || "/default-user.png"}
                      alt=""
                    />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      user.status === "suspended"
                        ? "text-red-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {user.status === "suspended" ? (
                      <FaUserSlash />
                    ) : (
                      <FaCheckCircle />
                    )}
                    {user.status || "active"}
                  </span>
                </td>
                <td className="text-center">
                  <div className="flex justify-center gap-2">
                    {/* Make Admin Button */}
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleMakeAdmin(user._id)}
                        className="btn btn-xs btn-outline btn-primary"
                        title="Make Admin"
                      >
                        <FaUserShield /> Admin
                      </button>
                    )}

                    {/* Suspend/Active Toggle */}
                    {user.status === "suspended" ? (
                      <button
                        onClick={() => handleStatusChange(user._id, "active")}
                        className="btn btn-xs btn-success text-white"
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleStatusChange(user._id, "suspended")
                        }
                        className="btn btn-xs btn-error btn-outline"
                        disabled={user.role === "admin"}
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
