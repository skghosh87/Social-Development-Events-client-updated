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
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const DashboardHome = () => {
  // ১. স্টেট ম্যানেজমেন্ট (খালি অ্যারে দিয়ে ইনিশিয়ালাইজ করা হয়েছে যাতে এরর না আসে)
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

  const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#6366F1"];

  // ২. ডাটা ফেচিং ফাংশন
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // স্ট্যাটস ডাটা আনা
        const res = await axios.get(
          `${SERVER_BASE_URL}/api/admin-stats?days=${filterDays}`
        );
        // নিশ্চিত করা হচ্ছে যে ডাটা অবজেক্টে chartData এবং categoryData আছে
        setStats({
          ...res.data,
          chartData: res.data.chartData || [],
          categoryData: res.data.categoryData || [],
        });

        // রিসেন্ট অ্যাক্টিভিটি আনা
        const joinsRes = await axios.get(`${SERVER_BASE_URL}/api/recent-joins`);
        setRecentJoins(joinsRes.data || []);
      } catch (err) {
        console.error("Dashboard Data Fetch Error:", err);
        toast.error("ডাটা লোড করতে সমস্যা হয়েছে।");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [filterDays]);

  // লোডিং স্টেট থাকলে স্পিনার দেখানো
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* ৩. হেডার এবং ফিল্টার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-sm text-slate-500">
            প্রজেক্টের রিয়েল-টাইম ওভারভিউ
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <FaFilter className="text-blue-500 ml-2" />
          <select
            value={filterDays}
            onChange={(e) => setFilterDays(Number(e.target.value))}
            className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 3 Months</option>
            <option value={365}>Last Year</option>
          </select>
        </div>
      </div>

      {/* ৪. কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Events",
            val: stats.totalEvents,
            icon: <FaCalendarCheck />,
            text: "text-blue-500",
          },
          {
            label: "Total Participants",
            val: stats.totalJoined,
            icon: <FaUsers />,
            text: "text-emerald-500",
          },
          {
            label: `Earnings (${filterDays}d)`,
            val: `$${stats.totalEarnings}`,
            icon: <FaDollarSign />,
            text: "text-amber-500",
          },
          {
            label: "Total Users",
            val: stats.totalUsers,
            icon: <FaLayerGroup />,
            text: "text-indigo-500",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-5"
          >
            <div className={`p-4 ${item.text} bg-opacity-10 rounded-2xl`}>
              {React.cloneElement(item.icon, { size: 24 })}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {item.label}
              </p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                {item.val}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* ৫. চার্ট সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Earnings Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData || []}>
                <defs>
                  <linearGradient
                    id="colorEarnings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  strokeOpacity={0.1}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#colorEarnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Event Categories</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData || []}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.categoryData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ৬. ট্রানজেকশন টেবিল */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">Participant</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentJoins?.map((join) => (
                <tr
                  key={join._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-6 py-4 font-semibold">
                    {join.userName || join.userEmail}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {join.eventName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                      ${join.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">
                    {join.transactionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentJoins.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              কোনো ডাটা পাওয়া যায়নি।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
