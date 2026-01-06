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
  // ডামি ডেটা (পরবর্তীতে আপনি আপনার ব্যাকএন্ড থেকে এটি ফেচ করবেন)
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ১. ওভারভিউ কার্ডস (Requirement 7: Overview Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-pro p-6 flex items-center gap-5">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
            <FaCalendarCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Joined Events</p>
            <h3 className="text-2xl font-bold dark:text-white">12</h3>
          </div>
        </div>

        <div className="card-pro p-6 flex items-center gap-5">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Volunteers</p>
            <h3 className="text-2xl font-bold dark:text-white">85</h3>
          </div>
        </div>

        <div className="card-pro p-6 flex items-center gap-5">
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
            <FaLayerGroup size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Categories</p>
            <h3 className="text-2xl font-bold dark:text-white">08</h3>
          </div>
        </div>

        <div className="card-pro p-6 flex items-center gap-5">
          <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl">
            <FaArrowUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Engagement</p>
            <h3 className="text-2xl font-bold dark:text-white">+24%</h3>
          </div>
        </div>
      </div>

      {/* ২. চার্ট সেকশন (Requirement 7: Dynamic Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ইভেন্ট স্ট্যাটিসটিকস (Bar/Area Chart) */}
        <div className="card-pro p-6">
          <h3 className="text-lg font-bold mb-6 dark:text-white">
            Monthly Participation
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="joined"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorEvents)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ক্যাটাগরি ডিস্ট্রিবিউশন (Pie Chart) */}
        <div className="card-pro p-6">
          <h3 className="text-lg font-bold mb-6 dark:text-white">
            Event Categories
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
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

      {/* ৩. রিসেন্ট অ্যাক্টিভিটি টেবিল (Requirement 7: Dynamic Data Table) */}
      <div className="card-pro overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold dark:text-white">
            Recent Joined Events
          </h3>
          <button className="text-secondary text-sm font-semibold hover:underline">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Event Name</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[1, 2, 3].map((item) => (
                <tr
                  key={item}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium dark:text-white">
                    Winter Cloth Distribution
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    Dec 15, 2025
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 rounded-full text-xs font-bold">
                      Upcoming
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-secondary hover:text-blue-700 text-sm font-bold">
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
