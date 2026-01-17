import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSave, FaTimes, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const UpdateEventModal = ({ event, onClose, onUpdateSuccess, userEmail }) => {
  const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ইভেন্টের বর্তমান ডাটা দিয়ে স্টেট সেট করা
  const [formData, setFormData] = useState({
    eventName: event?.eventName || "",
    category: event?.category || "",
    location: event?.location || "",
    description: event?.description || "",
    image: event?.image || "",
  });

  const [eventDate, setEventDate] = useState(new Date(event.eventDate));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedEventData = {
      ...formData,
      eventDate: eventDate.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await axiosSecure.patch(
        `/api/events/${event._id}`,
        updatedEventData
      );

      if (response.data.modifiedCount > 0 || response.data.matchedCount > 0) {
        toast.success("✨ ইভেন্টটি সফলভাবে আপডেট করা হয়েছে!");
        onUpdateSuccess();
        onClose();
      } else {
        toast.info("কোনো পরিবর্তন করা হয়নি।");
      }
    } catch (error) {
      console.error("Update Error:", error);
      const errorMessage =
        error.response?.data?.message || "ইভেন্ট আপডেট করতে সমস্যা হয়েছে।";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden animate-zoomIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            Edit Event:{" "}
            <span className="text-secondary">{event.eventName}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form
          onSubmit={handleUpdate}
          className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Name */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">
                Event Title
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
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
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
              />
            </div>

            {/* Event Date Picker */}
            <div className="md:col-span-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1 flex items-center gap-2">
                <FaCalendarAlt className="text-secondary" /> Event Date & Time
              </label>
              <DatePicker
                selected={eventDate}
                onChange={(date) => setEventDate(date)}
                showTimeSelect
                dateFormat="Pp"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all cursor-pointer"
                required
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
                placeholder="https://..."
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-secondary transition-all"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] py-4 bg-secondary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <FaSpinner className="animate-spin text-lg" />
              ) : (
                <>
                  <FaSave className="text-lg" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEventModal;
