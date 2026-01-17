import React from "react";
import { FaUsers, FaHandsHelping, FaBullseye, FaGlobe } from "react-icons/fa";
import Container from "../Components/Container";
const AboutUs = () => {
  const stats = [
    {
      id: 1,
      label: "Events Organized",
      value: "500+",
      icon: <FaUsers className="text-secondary" size={30} />,
    },
    {
      id: 2,
      label: "Volunteers",
      value: "1200+",
      icon: <FaHandsHelping className="text-secondary" size={30} />,
    },
    {
      id: 3,
      label: "Impacted Lives",
      value: "50,000+",
      icon: <FaGlobe className="text-secondary" size={30} />,
    },
    {
      id: 4,
      label: "Success Rate",
      value: "98%",
      icon: <FaBullseye className="text-secondary" size={30} />,
    },
  ];

  return (
    <div className="bg-base-100 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-white overflow-hidden">
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Empowering Communities <br />
            <span className="text-secondary">Through Social Events</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-lg">
            SDEP is a platform dedicated to organizing and managing social
            development events that create real impact in the community.
          </p>
        </Container>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.id} className="card-pro p-6 text-center">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-primary dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-base-200 dark:bg-slate-900/50">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-l-4 border-secondary pl-4">
                Our Mission
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                আমাদের লক্ষ্য হলো সামাজিক পরিবর্তনের জন্য একটি ডিজিটাল
                প্ল্যাটফর্ম তৈরি করা, যেখানে মানুষ একত্রিত হয়ে বিভিন্ন
                উন্নয়নমূলক কাজ এবং ইভেন্টে অংশগ্রহণ করতে পারে। আমরা বিশ্বাস করি
                ছোট ছোট পদক্ষেপই বড় পরিবর্তন আনতে সক্ষম।
              </p>
              <button className="btn-pro">Join Our Mission</button>
            </div>
            <div className="card-pro p-2">
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Our Team"
                className="rounded-lg w-full h-[350px] object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Our Values Section */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Core Values We Live By</h2>
            <div className="h-1 w-20 bg-secondary mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-pro p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <h3 className="text-xl font-bold mb-4">Integrity</h3>
              <p className="text-slate-500">
                আমরা আমাদের প্রতিটি কাজে স্বচ্ছতা এবং সততা বজায় রাখতে
                প্রতিশ্রুতিবদ্ধ।
              </p>
            </div>
            <div className="card-pro p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <h3 className="text-xl font-bold mb-4">Inclusion</h3>
              <p className="text-slate-500">
                ধর্ম, বর্ণ বা পেশা নির্বিশেষে সবার জন্য আমাদের প্ল্যাটফর্ম
                উন্মুক্ত।
              </p>
            </div>
            <div className="card-pro p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <h3 className="text-xl font-bold mb-4">Sustainability</h3>
              <p className="text-slate-500">
                আমরা দীর্ঘমেয়াদী এবং টেকসই উন্নয়নের লক্ষ্যে কাজ করি।
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;
