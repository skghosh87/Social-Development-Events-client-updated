import React from "react";
import Container from "../Container";
import {
  FaUsers,
  FaCalendarCheck,
  FaGlobe,
  FaHandHoldingHeart,
} from "react-icons/fa";

const statsData = [
  {
    id: 1,
    icon: <FaUsers className="text-blue-500" />,
    count: "5,000+",
    label: "Active Volunteers",
    description: "মানুষের কল্যাণে নিবেদিতপ্রাণ স্বেচ্ছাসেবক।",
  },
  {
    id: 2,
    icon: <FaCalendarCheck className="text-green-500" />,
    count: "1,200+",
    label: "Events Completed",
    description: "সফলভাবে সম্পন্ন হওয়া সামাজিক উদ্যোগ।",
  },
  {
    id: 3,
    icon: <FaGlobe className="text-purple-500" />,
    count: "45+",
    label: "Districts Reached",
    description: "দেশের বিভিন্ন প্রান্তে ছড়িয়ে থাকা নেটওয়ার্ক।",
  },
  {
    id: 4,
    icon: <FaHandHoldingHeart className="text-rose-500" />,
    count: "$250K",
    label: "Impact Funds",
    description: "সরাসরি কমিউনিটি উন্নয়নে ব্যবহৃত তহবিল।",
  },
];

const SuccessStatsSection = () => {
  return (
    <section className="py-24 bg-base-100 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <Container>
        {/* ১. সেকশন হেডার (উপরে - সেন্ট্রাল অ্যালাইনমেন্ট) */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight">
            Our Impact in <span className="text-secondary">Numbers</span>
          </h2>
          <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium pt-2 leading-relaxed">
            আমরা শুধু স্বপ্ন দেখি না, বাস্তবে পরিবর্তন নিয়ে আসি। আমাদের
            সংখ্যাগুলোই বলে দেয় আমরা কতটা পথ পাড়ি দিয়েছি।
          </p>
        </div>

        {/* ২. স্ট্যাটস কার্ড গ্রিড (নিচে - ৪টি কলামে) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              className="card-pro p-8 border border-slate-100 dark:border-slate-800/50 hover:border-secondary/30 transition-all duration-500 group flex flex-col items-center text-center"
            >
              {/* আইকন কন্টেইনার */}
              <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-secondary/10 transition-all duration-300 shadow-inner">
                {stat.icon}
              </div>

              {/* নাম্বার ও লেবেল */}
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                  {stat.count}
                </h3>
                <h4 className="text-base font-bold text-secondary uppercase tracking-widest">
                  {stat.label}
                </h4>
              </div>

              {/* বর্ণনা */}
              <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                {stat.description}
              </p>

              {/* নিচে একটি ডেকোরেটিভ লাইন */}
              <div className="mt-6 w-10 h-1 bg-slate-100 dark:bg-slate-800 group-hover:w-full group-hover:bg-secondary transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* ৩. কল টু অ্যাকশন বাটন */}
        <div className="mt-16 flex justify-center">
          <button className="btn-pro px-12 py-4 text-lg shadow-xl hover:shadow-secondary/20 transition-all active:scale-95 cursor-pointer rounded-lg">
            Become a Volunteer
          </button>
        </div>
      </Container>
    </section>
  );
};

export default SuccessStatsSection;
