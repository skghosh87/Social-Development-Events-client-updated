import React from "react";
import Container from "../Container";
import { FaPaperPlane, FaShieldAlt } from "react-icons/fa";

const NewsLetterSection = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // সাবস্ক্রিপশন লজিক
  };

  return (
    <section className="py-20 bg-base-100 dark:bg-slate-950 transition-colors duration-300">
      <Container>
        {/* মেইন কার্ড */}
        <div className="relative overflow-hidden bg-primary dark:bg-slate-900 rounded-[--radius-card] shadow-2xl px-6 py-16 md:px-16">
          {/* হালকা ডেকোরেটিভ গ্রেডিয়েন্ট */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent)] pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
            {/* ১. শিরোনাম ও বর্ণনা - আরও স্পষ্ট করা হয়েছে */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Stay Updated on{" "}
                <span className="text-secondary">Social Impact</span>
              </h2>
              <p className="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
                আমাদের কমিউনিটির সাথে যুক্ত হন। নতুন ইভেন্ট এবং ভলান্টিয়ারিং
                সুযোগের আপডেট সরাসরি আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন।
              </p>
            </div>

            {/* ২. ইনলাইন ফর্ম ডিজাইন - বাটনটি এখন ইনপুট ফিল্ডের শেষে */}
            <form onSubmit={handleSubscribe} className="w-full max-w-2xl">
              <div className="relative flex items-center bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-inner focus-within:ring-2 focus-within:ring-secondary/50 transition-all duration-300">
                <div className="flex items-center pl-4 flex-grow">
                  <FaPaperPlane className="text-slate-400 mr-3" />
                  <input
                    type="email"
                    placeholder="আপনার ইমেইল ঠিকানা লিখুন"
                    className="bg-transparent border-none text-slate-800 dark:text-white py-3 outline-none placeholder:text-slate-500 w-full font-medium"
                    required
                  />
                </div>

                {/* সাবস্ক্রাইব বাটন - ফিল্ডের একদম শেষে */}
                <button
                  type="submit"
                  className="bg-secondary hover:bg-blue-600 text-white font-bold py-3 px-6 md:px-10 rounded-xl transition-all duration-300 active:scale-95 shadow-lg whitespace-nowrap cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </form>

            {/* ৩. ট্রাস্ট এবং নিরাপত্তা তথ্য */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-slate-300">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FaShieldAlt className="text-secondary" />
                <span>আপনার ডাটা সুরক্ষিত</span>
              </div>
              <div className="hidden md:block h-4 w-[1.5px] bg-white/20"></div>
              <div className="text-sm font-semibold">
                ইতিমধ্যেই <span className="text-white text-base">৫,০০০+</span>{" "}
                সদস্য যুক্ত হয়েছেন
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default NewsLetterSection;
