import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaSpinner,
  FaSave,
  FaArrowLeft,
  FaImage,
} from "react-icons/fa";
import { useAuth } from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";
const EditEvent = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [eventData, setEventData] = useState({
    eventName: "",
    category: "",
    eventDate: "",
    location: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(`/api/events/${id}`);
        const ev = response.data.event;

        setEventData({
          eventName: ev.eventName || "",
          category: ev.category || "",
          eventDate: ev.eventDate
            ? new Date(ev.eventDate).toISOString().slice(0, 16)
            : "",
          location: ev.location || "",
          description: ev.description || "",
          image: ev.image || "",
        });
      } catch (error) {
        toast.error("ইভেন্ট ডেটা লোড করতে ব্যর্থ!");
        navigate("/dashboard/manage-events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, authLoading, navigate, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await axiosSecure.patch(`/api/events/${id}`, {
        ...eventData,
        updatedAt: new Date().toISOString(),
      });

      if (response.data.modifiedCount > 0 || response.data.matchedCount > 0) {
        toast.success("ইভেন্টটি সফলভাবে আপডেট করা হয়েছে!");
        navigate("/dashboard/manage-events");
      } else {
        toast.info("ডেটাতে কোনো পরিবর্তন করা হয়নি।");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "আপডেট ব্যর্থ হয়েছে!");
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <FaSpinner className="text-5xl text-secondary animate-spin" />
        <p className="font-black text-slate-500 uppercase tracking-widest text-xs">
          Loading Event Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white dark:bg-slate-900 shadow-sm rounded-2xl text-slate-500 hover:text-secondary transition-all"
        >
          <FaArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
          <FaEdit className="text-secondary" /> Edit Event
        </h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Preview Section */}
          <div className="relative h-48 w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700">
            {eventData.image ? (
              <img
                src={eventData.image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <FaImage size={40} className="mb-2" />
                <span className="text-xs font-bold uppercase">
                  No Image Preview
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Name */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2 block ml-2">
                Event Title
              </label>
              <input
                type="text"
                name="eventName"
                value={eventData.eventName}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2 block ml-2">
                Category
              </label>
              <select
                name="category"
                value={eventData.category}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
              >
                <option value="Welfare">Social Welfare</option>
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
                <option value="Health">Healthcare</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2 block ml-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2 block ml-2">
                Event Date & Time
              </label>
              <input
                type="datetime-local"
                name="eventDate"
                value={eventData.eventDate}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2 block ml-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={eventData.image}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
                placeholder="https://..."
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2 block ml-2">
                Full Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={eventData.description}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-secondary hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            {isUpdating ? (
              <FaSpinner className="animate-spin text-xl" />
            ) : (
              <>
                <FaSave /> Update Event
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
