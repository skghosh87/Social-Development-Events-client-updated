import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      // অ্যাডমিন হিসেবে সব ইভেন্ট নিয়ে আসার API
      const res = await axios.get(
        "social-development-events-seven.vercel.app/api/admin/all-events"
      );
      setEvents(res.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch all events");
      setLoading(false);
    }
  };

  // ইভেন্ট ডিলিট করার হ্যান্ডলার (অ্যাডমিন যেকোনো ইভেন্ট মুছতে পারে)
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this event from the system!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `social-development-events-seven.vercel.app/api/events/${id}?organizerEmail=admin`
          );
          if (res.data.success) {
            toast.success("Event deleted by Admin");
            fetchAllEvents();
          }
        } catch (error) {
          toast.error("Failed to delete event");
        }
      }
    });
  };

  if (loading)
    return (
      <div className="p-10 text-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
        <div>
          <h2 className="text-xl font-bold text-primary dark:text-white">
            Global Event Tracking
          </h2>
          <p className="text-sm text-slate-500">
            Total Events Hosted: {events.length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4">Event Info</th>
              <th>Organizer</th>
              <th>Date & Location</th>
              <th>Participants</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {events.map((event) => (
              <tr
                key={event._id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      className="w-12 h-12 rounded-lg object-cover shadow-sm"
                      src={event.image}
                      alt=""
                    />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]">
                        {event.eventName}
                      </p>
                      <span className="badge badge-ghost badge-sm text-[10px] uppercase font-bold text-secondary">
                        {event.category || event.eventType}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {event.organizerName || "N/A"}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {event.organizerEmail}
                  </p>
                </td>
                <td>
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <p className="flex items-center gap-1">
                      <FaCalendarAlt className="text-secondary" />{" "}
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-secondary" />{" "}
                      {event.location}
                    </p>
                  </div>
                </td>
                <td className="text-center font-bold text-primary dark:text-white">
                  {event.participants || 0}
                </td>
                <td className="text-center">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/event-details/${event._id}`}
                      className="btn btn-square btn-ghost btn-sm text-emerald-500"
                      title="View Detail"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      to={`/dashboard/edit-event/${event._id}`}
                      className="btn btn-square btn-ghost btn-sm text-blue-500"
                      title="Edit Event"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="btn btn-square btn-ghost btn-sm text-red-500"
                      title="Delete Event"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEvents;
