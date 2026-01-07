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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${SERVER_BASE_URL}/api/admin-stats?days=${filterDays}`
        );

        setStats({
          ...res.data,
          chartData: res.data.chartData || [],
          categoryData: res.data.categoryData || [],
        });

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border">
        <div>
          <h2 className="text-2xl font-bold uppercase">Admin Dashboard</h2>
          <p className="text-sm text-slate-500">
            প্রজেক্টের রিয়েল-টাইম ওভারভিউ
          </p>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-xl border">
          <FaFilter className="text-blue-500 ml-2" />
          <select
            value={filterDays}
            onChange={(e) => setFilterDays(Number(e.target.value))}
            className="bg-transparent outline-none text-sm font-semibold"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 3 Months</option>
            <option value={365}>Last Year</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Events",
            val: stats.totalEvents,
            icon: <FaCalendarCheck />,
          },
          {
            label: "Total Participants",
            val: stats.totalJoined,
            icon: <FaUsers />,
          },
          {
            label: `Earnings (${filterDays}d)`,
            val: `$${stats.totalEarnings}`,
            icon: <FaDollarSign />,
          },
          {
            label: "Total Users",
            val: stats.totalUsers,
            icon: <FaLayerGroup />,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border flex items-center gap-4"
          >
            {React.cloneElement(item.icon, { size: 24 })}
            <div>
              <p className="text-xs uppercase text-slate-500">{item.label}</p>
              <h3 className="text-2xl font-bold">{item.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Area Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border">
          <h3 className="font-bold mb-4">Earnings Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.chartData}>
              <defs>
                <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                fill="url(#earn)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border">
          <h3 className="font-bold mb-4">Event Categories</h3>

          {stats.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  innerRadius={70}
                  outerRadius={100}
                  dataKey="value"
                >
                  {stats.categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400">কোনো ডাটা নেই</p>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="p-6 font-bold">Recent Transactions</div>
        <table className="w-full text-left">
          <tbody>
            {recentJoins.map((join) => (
              <tr key={join._id} className="border-t">
                <td className="p-4">{join.userName || join.userEmail}</td>
                <td className="p-4">{join.eventName}</td>
                <td className="p-4">${join.amount}</td>
                <td className="p-4 text-xs">{join.transactionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardHome;
