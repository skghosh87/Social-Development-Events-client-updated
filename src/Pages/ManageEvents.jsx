import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaCalendarCheck,
  FaPlus,
  FaUsers,
  FaArrowRight,
  FaUserShield,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import UpdateEventModal from "../Components/UpdateEventModal";
import { useAuth } from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAdmin from "../Hooks/useAdmin";

const ManageEvents = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const axiosSecure = useAxiosSecure();
  const [myEvents, setMyEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchMyEvents = async () => {
    if (!user?.email) return;
    try {
      setIsLoading(true);

      const res = await axiosSecure.get(`/api/events/manage/${user.email}`);
      setMyEvents(res.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("ইভেন্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAdminLoading && user) {
      fetchMyEvents();
    }
  }, [user, authLoading, isAdminLoading]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: isAdmin
        ? "অ্যাডমিন হিসেবে আপনি যেকোনো ইভেন্ট ডিলিট করতে পারেন!"
        : "একবার ডিলিট করলে এটি আর ফিরে পাওয়া যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল",
      customClass: {
        popup: "rounded-[2rem] p-8",
        confirmButton: "rounded-xl px-6 py-3 font-bold",
        cancelButton: "rounded-xl px-6 py-3 font-bold",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(
            `/api/events/${id}?email=${user.email}`
          );
          if (res.data.success || res.data.deletedCount > 0) {
            toast.success("ইভেন্টটি সফলভাবে ডিলিট করা হয়েছে।");
            fetchMyEvents();
          }
        } catch (error) {
          toast.error("ডিলিট করতে ব্যর্থ হয়েছে।");
        }
      }
    });
  };

  const handleUpdate = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  if (authLoading || isAdminLoading || isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-500 uppercase tracking-widest text-xs">
          Loading Management Panel...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 px-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
            {isAdmin ? (
              <FaUserShield className="text-red-500" />
            ) : (
              <FaCalendarCheck className="text-secondary" />
            )}
            {isAdmin ? "All System" : "Manage My"}{" "}
            <span className={isAdmin ? "text-red-500" : "text-secondary"}>
              Events
            </span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mt-1 ml-1">
            {isAdmin
              ? "Admin Control: Monitor and manage all platform activities"
              : "Organize and oversee your created activities"}
          </p>
        </div>
        {!isAdmin && (
          <Link
            to="/dashboard/create-event"
            className="flex items-center justify-center gap-2 bg-secondary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 text-xs"
          >
            <FaPlus /> Create New Event
          </Link>
        )}
      </div>

      {myEvents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-sm mx-4">
          <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">
            No Events Found
          </h3>
          <p className="text-slate-500 font-medium">
            কোনো ইভেন্ট খুঁজে পাওয়া যায়নি।
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mx-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Event Info
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Category
                  </th>
                  {isAdmin && (
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Organizer
                    </th>
                  )}
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                    Participants
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {myEvents.map((event) => (
                  <tr
                    key={event._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={event.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover shadow-sm"
                        />
                        <div>
                          <p className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm">
                            {event.eventName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-lg">
                        {event.category}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="p-6">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          {event.organizerEmail}
                        </p>
                      </td>
                    )}
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 font-black text-xs">
                        <FaUsers size={12} className="text-slate-400" />{" "}
                        {event.participants || 0}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdate(event)}
                          className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <UpdateEventModal
          event={selectedEvent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          onUpdateSuccess={fetchMyEvents}
          userEmail={user.email}
        />
      )}
    </div>
  );
};

export default ManageEvents;
