import React from "react";
import Container from "../Container";
import {
  FaUserPlus,
  FaSearchLocation,
  FaHandshake,
  FaChartLine,
} from "react-icons/fa";

const steps = [
  {
    id: 1,
    icon: <FaUserPlus />,
    title: "Create Account",
    description:
      "কয়েক মিনিটের মধ্যে আপনার ভলান্টিয়ার বা অর্গানাইজার প্রোফাইল তৈরি করুন।",
  },
  {
    id: 2,
    icon: <FaSearchLocation />,
    title: "Find Events",
    description: "আপনার পছন্দের ক্যাটাগরি এবং এলাকা অনুযায়ী ইভেন্ট খুঁজে নিন।",
  },
  {
    id: 3,
    icon: <FaHandshake />,
    title: "Join & Contribute",
    description:
      "ইভেন্টে রেজিস্ট্রেশন করুন এবং সরাসরি সামাজিক কাজে অংশগ্রহণ করুন।",
  },
  {
    id: 4,
    icon: <FaChartLine />,
    title: "Track Success",
    description:
      "আপনার কাজের ইমপ্যাক্ট দেখুন এবং সার্টিফিকেট ও রিওয়ার্ড অর্জন করুন।",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-base-100 dark:bg-slate-950 transition-colors duration-300">
      <Container>
        {/* সেকশন হেডার */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight">
            How It <span className="text-secondary">Works</span>
          </h2>
          <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium pt-2">
            মাত্র চারটি সহজ ধাপে আমাদের সাথে আপনার যাত্রা শুরু করুন।
          </p>
        </div>

        {/* স্টেপস গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="card-pro p-8 relative flex flex-col h-full group border border-slate-100 dark:border-slate-800/50"
            >
              {/* স্টেপ নাম্বার ব্যাজ - আগের ডিজাইনগুলোর সাথে মিল রেখে */}
              <div className="absolute top-6 right-8 text-5xl font-black text-slate-200 dark:text-slate-800/40 group-hover:text-secondary/20 transition-colors">
                0{index + 1}
              </div>

              {/* আইকন - কাস্টম শেপসহ */}
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-3xl text-secondary mb-8 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-inner">
                {step.icon}
              </div>

              {/* টেক্সট কন্টেন্ট */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-secondary transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>

              {/* ডেকোরেটিভ বর্ডার লাইট (নিচে) */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-secondary group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* জয়েনিং বাটন */}
        <div className="mt-16 flex justify-center">
          <button className="btn-pro px-10 py-4 shadow-xl rounded-lg hover:shadow-secondary/20 transition-all active:scale-95">
            Start Your Journey
          </button>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;
