import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaCalendarCheck,
  FaUsers,
  FaLayerGroup,
  FaArrowUp,
} from "react-icons/fa";

const DashboardHome = () => {
  // ডামি ডেটা
  const statsData = [
    { name: "Jan", events: 4, joined: 12 },
    { name: "Feb", events: 7, joined: 18 },
    { name: "Mar", events: 5, joined: 15 },
    { name: "Apr", events: 10, joined: 25 },
    { name: "May", events: 8, joined: 22 },
  ];

  const categoryData = [
    { name: "Social", value: 400 },
    { name: "Education", value: 300 },
    { name: "Charity", value: 300 },
    { name: "Workshop", value: 200 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#6366F1"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ১. ওভারভিউ কার্ডস (Enhanced with hover and dark mode) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Joined Events",
            val: "12",
            icon: <FaCalendarCheck />,
            color: "bg-blue-500",
            text: "text-blue-500",
          },
          {
            label: "Volunteers",
            val: "85",
            icon: <FaUsers />,
            color: "bg-emerald-500",
            text: "text-emerald-500",
          },
          {
            label: "Categories",
            val: "08",
            icon: <FaLayerGroup />,
            color: "bg-amber-500",
            text: "text-amber-500",
          },
          {
            label: "Engagement",
            val: "+24%",
            icon: <FaArrowUp />,
            color: "bg-indigo-500",
            text: "text-indigo-500",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-5"
          >
            <div className={`p-4 ${item.text} bg-opacity-10 rounded-2xl`}>
              {React.cloneElement(item.icon, { size: 24 })}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                {item.val}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* ২. চার্ট সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ইভেন্ট স্ট্যাটিসটিকস */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white">
            Monthly Participation
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#94a3b8"
                  strokeOpacity={0.2}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                  itemStyle={{ color: "#3B82F6" }}
                />
                <Area
                  type="monotone"
                  dataKey="joined"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#colorEvents)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ক্যাটাগরি ডিস্ট্রিবিউশন */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white">
            Event Categories
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ৩. রিসেন্ট অ্যাক্টিভিটি টেবিল */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Recent Joined Events
          </h3>
          <button className="text-blue-500 text-sm font-bold hover:text-blue-600 transition">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 font-bold">Event Name</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[1, 2, 3].map((item) => (
                <tr
                  key={item}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">
                    Winter Cloth Distribution
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                    Dec 15, 2025
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase rounded-lg tracking-wider">
                      Upcoming
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-500 group-hover:underline text-sm font-bold">
                      Details
                    </button>
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

export default DashboardHome;
