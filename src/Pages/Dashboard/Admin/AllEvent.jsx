import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaTrashAlt,
  FaEye,
  FaCheckCircle,
  FaExclamationCircle,
  FaSearch,
  FaFilter,
  FaUser,
} from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AllEvents = () => {
  const axiosSecure = useAxiosSecure();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ১. সব ইভেন্ট ফেচ করা
  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/api/admin/all-events");
      setEvents(response.data);
    } catch (error) {
      toast.error("ইভেন্টগুলো লোড করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, [axiosSecure]);

  // ২. ইভেন্ট ডিলিট লজিক
  const handleDelete = (id) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "একবার ডিলিট করলে এটি আর ফিরিয়ে আনা যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল",
      background: "#fff",
      customClass: {
        title: "font-black uppercase tracking-tighter",
        confirmButton:
          "rounded-xl font-bold uppercase tracking-widest text-xs px-6 py-3",
        cancelButton:
          "rounded-xl font-bold uppercase tracking-widest text-xs px-6 py-3",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/api/admin/events/${id}`);
          if (res.data.deletedCount > 0) {
            setEvents(events.filter((event) => event._id !== id));
            Swal.fire(
              "ডিলিট হয়েছে!",
              "ইভেন্টটি সফলভাবে মুছে ফেলা হয়েছে।",
              "success"
            );
          }
        } catch (error) {
          toast.error("ডিলিট করতে সমস্যা হয়েছে।");
        }
      }
    });
  };

  // সার্চ ফিল্টারিং
  const filteredEvents = events.filter(
    (event) =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 animate-fadeIn">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            Manage All <span className="text-secondary">Events</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mt-1">
            Global Control Panel for every event on the platform
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-12 pr-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 w-full md:w-80 font-bold text-sm transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="px-6 py-3.5 bg-secondary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-secondary/20">
            Total: {events.length}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Event Details
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Organizer
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Status
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Fee Paid
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredEvents.map((event) => (
                <tr
                  key={event._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={event.image}
                        alt=""
                        className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-700"
                      />
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight line-clamp-1">
                          {event.eventName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                          <FaCheckCircle className="text-secondary" size={10} />{" "}
                          {event.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {event.organizerName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium lowercase tracking-wider mt-0.5 italic">
                        {event.organizerEmail}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-500/20">
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-700 dark:text-slate-300">
                      ${event.organizerContribution || 0}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-secondary hover:text-white transition-all shadow-sm"
                        title="View Details"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Delete Event"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-20 text-center">
            <FaExclamationCircle className="mx-auto text-4xl text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              No Events Found Match Your Search
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEvents;
