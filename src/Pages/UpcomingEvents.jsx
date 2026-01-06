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
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SERVER_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "social-development-events-seven.vercel.app";

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
      setEvents(response.data.events || []);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUpcomingEvents();
    }, 500); // সার্চে পারফরম্যান্স বাড়ানোর জন্য টাইমার

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filterCategory]);

  return (
    <div className="py-20 bg-base-100 dark:bg-slate-950 transition-colors duration-300 min-h-screen">
      <Container>
        {/* সেকশন হেডার */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight">
            Upcoming Social <span className="text-secondary">Events</span>
          </h1>
          <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium pt-2">
            আজই একটি ইভেন্টে যোগ দিন এবং আপনার কমিউনিটিতে ইতিবাচক পরিবর্তনের অংশ
            হোন।
          </p>
        </div>

        {/* সার্চ এবং ফিল্টার বার */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 p-6 card-pro border border-slate-100 dark:border-slate-800/50">
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event name..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-secondary/50 outline-none dark:text-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-secondary/50 outline-none dark:text-white appearance-none transition-all cursor-pointer"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Community">Community</option>
            </select>
          </div>
        </div>

        {/* কন্টেন্ট লোডিং স্টেট */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="text-5xl text-secondary animate-spin" />
            <p className="mt-4 text-slate-500 font-bold tracking-widest uppercase text-sm">
              Loading Events...
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 card-pro border-dashed border-2">
            <FaCalendarAlt className="text-6xl text-slate-300 dark:text-slate-800 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">
              No Event Found!
            </h2>
            <p className="text-slate-500 mt-2">
              অন্য কোনো নামে বা ক্যাটাগরিতে সার্চ করে দেখুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="card-pro group flex flex-col h-full border border-slate-100 dark:border-slate-800/50 transition-all duration-500"
              >
                {/* ইমেজ সেকশন */}
                <div className="relative h-56 overflow-hidden rounded-t-[--radius-card]">
                  <img
                    src={event.image}
                    alt={event.eventName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-secondary text-white text-xs font-bold rounded-full shadow-lg">
                      {event.category || event.eventType}
                    </span>
                  </div>
                </div>

                {/* কার্ড ডিটেইলস */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white group-hover:text-secondary transition-colors line-clamp-1">
                    {event.eventName}
                  </h2>

                  <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-secondary" />
                      {new Date(event.eventDate).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-secondary" />
                      {event.location}
                    </div>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 flex-grow">
                    {event.description}
                  </p>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-lg">
                      <FaUsers className="text-secondary" />
                      <span className="text-secondary font-bold text-sm">
                        {event.participants || 0} Joined
                      </span>
                    </div>
                    <Link to={`/event-details/${event._id}`}>
                      <button className="btn-pro px-6 py-2.5 text-sm font-bold shadow-md active:scale-95 transition-all">
                        Details & Join
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
