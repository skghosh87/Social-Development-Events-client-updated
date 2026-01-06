import React from "react";
import Container from "../Container";
import Marquee from "react-fast-marquee";

const partners = [
  { id: 1, logo: "https://i.ibb.co.com/tTFsj6V5/Action-AId.png" },
  { id: 2, logo: "https://i.ibb.co.com/5hd6nGr0/Brac.png" },
  { id: 3, logo: "https://i.ibb.co.com/RT0fdYW0/Word-Vission.png" },
  { id: 4, logo: "https://i.ibb.co.com/Q3VyPK7s/Red-Crescent.png" },
  { id: 5, logo: "https://i.ibb.co.com/Myr65mHB/Care.png" },
  { id: 6, logo: "https://i.ibb.co.com/DPsKpn3F/Save.png" },
];

const PartnerSection = () => {
  return (
    <section className="py-24 bg-base-100 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <Container>
        {/* ১. সেকশন হেডার (আগের ডিজাইনের সাথে মিল রেখে) */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight">
            Our Trusted <span className="text-secondary">Partners</span>
          </h2>
          <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium pt-2 leading-relaxed">
            আমরা গর্বিত যে এই স্বনামধন্য প্রতিষ্ঠানগুলো আমাদের সামাজিক উন্নয়ন
            যাত্রার সহযাত্রী।
          </p>
        </div>

        {/* ২. লোগো ক্যারোসেল (Marquee Effect) */}
        <div className="relative py-10 bg-white/5 dark:bg-slate-900/20 rounded-[--radius-card] border border-slate-100 dark:border-slate-800/50 backdrop-blur-sm">
          <Marquee
            gradient={true}
            gradientColor={undefined} // এটি আপনার ডার্ক মোডের সাথে অটো অ্যাডজাস্ট করবে
            className="dark:gradient-dark"
            speed={50}
            pauseOnHover={true}
          >
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="mx-8 md:mx-16 group grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                <img
                  src={partner.logo}
                  alt="Partner Logo"
                  className="h-12 md:h-16 w-auto object-contain transition-transform group-hover:scale-110"
                />
              </div>
            ))}
          </Marquee>
        </div>

        {/* ৩. ছোট ইনফো টেক্সট */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase opacity-70">
            Collaborating for a better future
          </p>
        </div>
      </Container>
    </section>
  );
};

export default PartnerSection;
