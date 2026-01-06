import React from "react";
import { Link } from "react-router-dom";
import logo from "/Logo.png";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
} from "react-icons/fa";
import Container from "./Container";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // আপনার নির্দিষ্ট সোশ্যাল মিডিয়া লিঙ্কগুলো এখানে সেট করুন
  const socialLinks = [
    { icon: FaFacebook, link: "https://facebook.com/your-username" },
    { icon: FaTwitter, link: "https://twitter.com/your-username" },
    { icon: FaInstagram, link: "https://instagram.com/your-username" },
    { icon: FaLinkedin, link: "https://linkedin.com/in/samir-kumar-ghosh" },
  ];

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-white/10 shadow-2xl transition-colors duration-300">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* ১. ব্র্যান্ডিং এবং বর্ণনা */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-white rounded-xl shadow-lg transition-transform group-hover:scale-110">
                <img
                  src={logo}
                  className="w-10 h-10 object-contain"
                  alt="SDEP Logo"
                />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white">
                SDEP
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              আমরা তৈরি করছি একটি সুন্দর সমাজ। আমাদের সাথে যুক্ত হয়ে স্থানীয়
              সামাজিক উন্নয়ন ও পরিবেশ রক্ষায় অবদান রাখুন।
            </p>

            {/* সোশ্যাল আইকন - এখানে আপডেট করা হয়েছে */}
            <div className="flex space-x-5">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank" // নতুন ট্যাবে খোলার জন্য
                  rel="noopener noreferrer" // নিরাপত্তার জন্য
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-secondary hover:text-white transition-all duration-300 text-slate-400 shadow-lg hover:-translate-y-1"
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* ২. কুইক লিংকস (বাকি অংশ একই থাকবে) */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-4 text-slate-400 font-medium">
              {[
                { name: "Upcoming Events", path: "/upcoming-events" },
                { name: "Create Event", path: "/create-event" },
                { name: "Manage Events", path: "/manage-events" },
                { name: "My Joined Events", path: "/joined-events" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="hover:text-secondary hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ৩. রিসোর্স এবং পলিসি */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              Resources
            </h3>
            <ul className="space-y-4 text-slate-400 font-medium">
              {["FAQ", "Guidelines", "Privacy Policy", "Terms of Service"].map(
                (item, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="hover:text-secondary hover:translate-x-1 inline-block transition-all duration-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* ৪. যোগাযোগ */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              Contact Us
            </h3>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start space-x-3 group">
                <FaEnvelope className="text-secondary mt-1 group-hover:scale-110 transition-transform" />
                <a
                  href="mailto:support@sdep.com"
                  className="text-sm font-medium hover:text-white transition-colors"
                >
                  support@sdep.com
                </a>
              </li>
              <li className="flex items-start space-x-3 group">
                <FaPhone className="text-secondary mt-1 group-hover:scale-110 transition-transform" />
                <a
                  href="tel:+8801721921623"
                  className="text-sm font-medium hover:text-white transition-colors"
                >
                  +880 17219 21623
                </a>
              </li>
              <li className="pt-2 text-sm italic font-light">
                Empowering Communities Worldwide
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {currentYear} <span className="text-secondary">SDEP</span>.
            All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Designed with ❤️ for a better community.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
