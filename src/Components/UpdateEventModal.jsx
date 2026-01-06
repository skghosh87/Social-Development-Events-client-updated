import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSave, FaTimes, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateEventModal = ({
  event,
  onClose,
  onUpdateSuccess,
  SERVER_BASE_URL,
  userEmail,
}) => {
  const [formData, setFormData] = useState({
    eventName: event.eventName,
    category: event.category,
    location: event.location,
    description: event.description,
    image: event.image,
  });

  const [eventDate, setEventDate] = useState(new Date(event.eventDate));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedEventData = {
      ...formData,

      eventDate: eventDate.toISOString(),

      organizerEmail: userEmail,
    };

    try {
      const response = await axios.put(
        `${SERVER_BASE_URL}/api/events/${event._id}`,
        updatedEventData
      );

      if (response.data.success) {
        toast.success("✨ Event updated successfully!");
        onUpdateSuccess();
        onClose();
      } else {
        toast.error(response.data.message || "❌ Event update failed!");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred during update.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-2xl font-bold text-blue-700">
            Edit Event: {event.eventName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form
          onSubmit={handleUpdate}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          {/* Event Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Environment">Environment & Ecology</option>
                <option value="Education">Education & Skill Building</option>
                <option value="Health">Health & Wellness</option>
                <option value="Community">Community Building</option>
                <option value="Welfare">Social Welfare</option>
              </select>
            </div>
          </div>

          {/* Image URL & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Event Date/Time Picker */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" /> Event Date & Time
            </label>
            <DatePicker
              selected={eventDate}
              onChange={(date) => setEventDate(date)}
              showTimeSelect
              dateFormat="Pp"
              minDate={new Date()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>

          {/* Modal Footer / Buttons */}
          <div className="pt-4 flex justify-end space-x-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              <FaSave /> {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEventModal;
