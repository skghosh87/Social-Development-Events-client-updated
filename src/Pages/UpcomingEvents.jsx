import React, { useEffect, useState } from "react";
import Container from "../Components/Container";
import axios from "axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const fetchUpcomingEvents = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (filterCategory) params.append("category", filterCategory);

    const URL = `${SERVER_BASE_URL}/api/events/upcoming?${params.toString()}`;

    try {
      const response = await axios.get(URL);
      if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUpcomingEvents();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filterCategory]);

  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-500">
      <Container>
        {/* সেকশন হেডার */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeIn">
          <span className="text-secondary font-black uppercase tracking-[0.3em] text-[10px] bg-secondary/10 px-4 py-2 rounded-full mb-4 inline-block">
            Discover Opportunities
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tighter">
            Upcoming <span className="text-secondary">Events</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mt-4">
            আজই একটি ইভেন্টে যোগ দিন এবং আপনার কমিউনিটিতে ইতিবাচক পরিবর্তনের অংশ
            হোন।
          </p>
        </div>

        {/* সার্চ এবং ফিল্টার বার (Modern Glassy Look) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16 p-2 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="md:col-span-3 relative">
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events by name or keywords..."
              className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-secondary/30 outline-none dark:text-white font-bold transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-secondary/30 outline-none dark:text-white font-bold appearance-none cursor-pointer text-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="">Select Category</option>
              <option value="Welfare">Social Welfare</option>
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
              <option value="Health">Healthcare</option>
            </select>
          </div>
        </div>

        {/* কন্টেন্ট লোডিং স্টেট */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-slate-400 font-black tracking-widest uppercase text-[10px]">
              Syncing Events...
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="text-3xl text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
              No Events Found
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              আপনার সার্চের সাথে মেলে এমন কোনো ইভেন্ট পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event) => (
              <div
                key={event._id}
                className="group bg-white dark:bg-slate-900 rounded-[2.5rem] flex flex-col h-full border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                {/* ইমেজ সেকশন */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.image || "https://placehold.co/600x400"}
                    alt={event.eventName}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl">
                      {event.category || "Social"}
                    </span>
                  </div>
                </div>

                {/* কার্ড ডিটেইলস */}
                <div className="p-8 flex flex-col flex-grow">
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-secondary transition-colors line-clamp-1 uppercase tracking-tight mb-4">
                    {event.eventName}
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                      <FaCalendarAlt className="text-secondary" />
                      <span>
                        {new Date(event.eventDate).toLocaleDateString("bn-BD", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-8 font-medium">
                    {event.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden"
                          >
                            <img
                              src={`https://i.pravatar.cc/100?img=${i + 10}`}
                              alt=""
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-slate-400 font-black text-[10px] uppercase tracking-wider ml-1">
                        +{event.participants || 0} Joined
                      </span>
                    </div>

                    <Link
                      to={`/event-details/${event._id}`}
                      className="w-full sm:w-auto"
                    >
                      <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-2xl group-hover:bg-secondary transition-all shadow-lg active:scale-95 w-full sm:w-auto">
                        বিস্তারিত দেখুন <FaArrowRight className="text-[10px]" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default UpcomingEvents;
