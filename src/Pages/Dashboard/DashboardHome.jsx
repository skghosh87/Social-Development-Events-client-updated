import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaCalendarCheck,
  FaUsers,
  FaLayerGroup,
  FaDollarSign,
  FaFilter,
  FaPlusCircle,
  FaTasks,
  FaHistory,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../Hooks/useAuth";
import useAdmin from "../../Hooks/useAdmin";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const DashboardHome = () => {
  const { user, loading: authLoading, role } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const axiosSecure = useAxiosSecure();
  const [filterDays, setFilterDays] = useState(7);

  const [stats, setStats] = useState({
    totalEvents: 0,
    totalJoined: 0,
    totalEarnings: 0,
    totalUsers: 0,
    chartData: [],
    categoryData: [],
  });
  const [recentJoins, setRecentJoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#6366F1"];

  useEffect(() => {
    if (authLoading || isAdminLoading) return;

    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const statsRes = await axiosSecure.get(
          `/api/admin-stats?days=${filterDays}`
        );
        setStats({
          totalEvents: statsRes.data.totalEvents || 0,
          totalJoined: statsRes.data.totalJoined || 0,
          totalEarnings: statsRes.data.totalEarnings || 0,
          totalUsers: statsRes.data.totalUsers || 0,
          chartData: statsRes.data.chartData || [],
          categoryData: statsRes.data.categoryData || [],
        });

        const joinsRes = await axiosSecure.get(`/api/recent-joins`);
        setRecentJoins(joinsRes.data || []);
      } catch (err) {
        console.error("Dashboard Error:", err);
        toast.error("ডাটা লোড করতে সমস্যা হয়েছে।");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [filterDays, isAdmin, authLoading, isAdminLoading, axiosSecure]);

  if (authLoading || isAdminLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
      </div>
    );
  }

  /* ==========================================
      ১. ইউজার ইন্টারফেস (User Dashboard View)
     ========================================== */
  if (!isAdmin) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-2 md:p-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-secondary p-8 md:p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">
              Hello, {user?.displayName.split(" ")[0]}! 👋
            </h2>
            <p className="opacity-70 text-lg font-medium max-w-md">
              আপনার ড্যাশবোর্ড থেকে ইভেন্ট ম্যানেজ করুন এবং সামাজিক কার্যক্রমে
              অংশ নিন।
            </p>
            <div className="mt-8 flex gap-4">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-widest border border-white/20">
                Role: {role || "User"}
              </span>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"></div>
        </div>

        {/* User Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/dashboard/create-event"
            className="group p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-secondary transition-all shadow-sm hover:shadow-xl"
          >
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaPlusCircle size={28} />
            </div>
            <h3 className="text-xl font-black dark:text-white mb-2">
              Create Event
            </h3>
            <p className="text-slate-500 text-sm italic">
              নতুন ইভেন্ট পাবলিশ করুন
            </p>
          </Link>

          <Link
            to="/dashboard/manage-events"
            className="group p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-sm hover:shadow-xl"
          >
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaTasks size={28} />
            </div>
            <h3 className="text-xl font-black dark:text-white mb-2">
              My Events
            </h3>
            <p className="text-slate-500 text-sm italic">
              আপনার তৈরি ইভেন্টগুলো দেখুন
            </p>
          </Link>

          <Link
            to="/dashboard/joined-events"
            className="group p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all shadow-sm hover:shadow-xl"
          >
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaHistory size={28} />
            </div>
            <h3 className="text-xl font-black dark:text-white mb-2">History</h3>
            <p className="text-slate-500 text-sm italic">
              অংশ নেওয়া ইভেন্টের তালিকা
            </p>
          </Link>
        </div>
      </div>
    );
  }

  /* ==========================================
      ২. অ্যাডমিন ইন্টারফেস (Admin Dashboard View)
     ========================================== */
  return (
    <div className="p-2 md:p-6 space-y-8 animate-in fade-in duration-700">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
            System Analytics
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[3px] mt-1">
            Overview of platform performance
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700">
          <FaFilter className="text-secondary" />
          <select
            value={filterDays}
            onChange={(e) => setFilterDays(Number(e.target.value))}
            className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer dark:text-white"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Events",
            val: stats.totalEvents,
            icon: <FaCalendarCheck />,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "Users",
            val: stats.totalUsers,
            icon: <FaUsers />,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
          },
          {
            label: "Earnings",
            val: `$${stats.totalEarnings}`,
            icon: <FaDollarSign />,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
          {
            label: "Total Joined",
            val: stats.totalJoined,
            icon: <FaLayerGroup />,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-sm"
          >
            <div
              className={`${item.color} ${item.bg} dark:bg-slate-800/50 p-4 rounded-2xl`}
            >
              {React.cloneElement(item.icon, { size: 24 })}
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest">
                {item.label}
              </p>
              <h3 className="text-2xl font-black dark:text-white tracking-tighter">
                {item.val}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Area Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest mb-8 dark:text-white opacity-50">
            Revenue Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.chartData}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 900 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 900 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "20px",
                  border: "none",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={4}
                fill="url(#colorAmt)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest mb-8 dark:text-white opacity-50">
            Popular Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoryData}
                innerRadius={80}
                outerRadius={110}
                paddingAngle={10}
                dataKey="value"
              >
                {stats.categoryData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800">
          <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">
            Recent Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="p-6">Member</th>
                <th className="p-6">Event Title</th>
                <th className="p-6">Amount</th>
                <th className="p-6">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {recentJoins.map((join) => (
                <tr
                  key={join._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="p-6 font-bold dark:text-white text-sm">
                    {join.userName || "Guest"}
                  </td>
                  <td className="p-6 text-slate-500 text-sm font-medium">
                    {join.eventName}
                  </td>
                  <td className="p-6 font-black text-emerald-500">
                    ${join.amount}
                  </td>
                  <td className="p-6 text-[10px] font-mono text-slate-400 group-hover:text-secondary transition-colors">
                    {join.transactionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentJoins.length === 0 && (
            <p className="p-10 text-center text-slate-400 font-bold italic">
              No recent activity found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
