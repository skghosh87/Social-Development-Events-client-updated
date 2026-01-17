import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSpinner,
  FaRegCalendarTimes,
  FaCheckCircle,
  FaHashtag,
  FaExternalLinkAlt,
  FaTicketAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const JoinedEvents = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user?.email) {
      const fetchJoinedEvents = async () => {
        try {
          setLoading(true);

          const response = await axiosSecure.get(
            `/api/joined-events/${user.email}`
          );
          setEvents(response.data);
        } catch (error) {
          toast.error("আপনার ইভেন্টগুলি লোড করতে সমস্যা হয়েছে।");
        } finally {
          setLoading(false);
        }
      };
      fetchJoinedEvents();
    }
  }, [user, authLoading, axiosSecure]);

  // লোডিং স্টেট (প্রিমিয়াম লুক)
  if (loading || authLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <FaSpinner className="text-5xl text-secondary animate-spin" />
        <p className="font-black text-slate-500 uppercase tracking-widest text-xs">
          Loading Your Events...
        </p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-sm border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-24 h-24 bg-orange-50 dark:bg-orange-950/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaRegCalendarTimes className="text-4xl text-orange-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-4">
            No Events Joined Yet
          </h2>
          <p className="text-slate-500 font-medium mb-8">
            আপনি এখনো কোনো ইভেন্টে যুক্ত হননি। নতুন ইভেন্টগুলো খুঁজে দেখতে
            আমাদের ইভেন্ট তালিকায় যান।
          </p>
          <Link
            to="/upcoming-events"
            className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
          >
            Explore Events <FaExternalLinkAlt size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 px-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            My Joined <span className="text-secondary">Events</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mt-1">
            List of events you have successfully registered for
          </p>
        </div>
        <div className="px-6 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20">
          Total: {events.length} Events
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {events.map((event) => (
          <div
            key={event._id || event.event_id}
            className="group bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-full"
          >
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={
                  event.image ||
                  "https://placehold.co/600x400/2563eb/ffffff?text=Event"
                }
                alt={event.eventName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl border border-emerald-100">
                <FaCheckCircle /> Registered
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-grow">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-lg">
                  {event.category || "General"}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400 font-black text-[10px] uppercase">
                  <FaTicketAlt /> ID: {event.event_id?.slice(-6) || "N/A"}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 line-clamp-1 group-hover:text-secondary transition-colors uppercase tracking-tight">
                {event.eventName}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <FaCalendarAlt className="text-secondary" />
                  </div>
                  <span>
                    {new Date(event.eventDate).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <FaMapMarkerAlt className="text-red-500" />
                  </div>
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              {/* Transaction Badge */}
              {event.transactionId && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all">
                  <p className="text-[9px] uppercase text-slate-400 font-black mb-1 flex items-center gap-2">
                    <FaHashtag className="text-secondary" /> Transaction ID
                  </p>
                  <p className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 break-all select-all">
                    {event.transactionId}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Button */}
            <div className="p-8 pt-0">
              <Link
                to={`/event-details/${event.event_id || event._id}`}
                className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 dark:bg-slate-800 text-white font-black rounded-2xl hover:bg-secondary transition-all uppercase tracking-widest text-xs shadow-lg"
              >
                Details <FaExternalLinkAlt size={10} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinedEvents;
