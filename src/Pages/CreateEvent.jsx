import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Container from "../Components/Container";

import {
  FaCalendarPlus,
  FaRegCalendarAlt,
  FaEnvelope,
  FaUser,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Stripe Imports
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../Components/CheckoutForm";
import { useAuth } from "../Hooks/useAuth";

// আপনার Stripe Publishable Key এখানে দিন (Vite এর জন্য VITE_ prefix ব্যবহার করা হয়েছে)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CreateEvent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [eventDate, setEventDate] = useState(new Date());

  // পেমেন্ট ও মডাল স্টেট
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tempEventData, setTempEventData] = useState(null);

  const ORGANIZER_FEE = 5; // অর্গানাইজারের জন্য ফিক্সড ফি $৫.০০
  const SERVER_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://social-development-events-seven.vercel.app";

  // ১. ফর্ম সাবমিট হ্যান্ডলার (পেমেন্টের আগে ডাটা টেম্পোরারি সেভ করা)
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!user || !user.email) {
      toast.error("ইভেন্ট তৈরি করতে অনুগ্রহ করে লগইন করুন।");
      return;
    }

    const form = e.target;

    const eventData = {
      eventName: form.eventName.value,
      category: form.category.value,
      location: form.location.value,
      description: form.description.value,
      image: form.image.value,
      eventDate: eventDate.toISOString(),
      organizerName: user?.displayName,
      organizerEmail: user?.email,
      postedAt: new Date().toISOString(),
      participants: 0,
    };

    setTempEventData(eventData); // ডাটা সেভ করে রাখা হলো
    setShowPaymentModal(true); // পেমেন্ট মডাল ওপেন করা হলো
  };

  // ২. পেমেন্ট সফল হলে এই ফাংশনটি কল হবে (মডাল অটো বন্ধ হবে এখানে)
  const handlePaymentSuccess = async (transactionId) => {
    try {
      const finalEventData = { ...tempEventData, transactionId };

      const response = await axios.post(
        `${SERVER_BASE_URL}/api/events`,
        finalEventData
      );

      if (response.data.success) {
        toast.success("🎉 পেমেন্ট সফল এবং ইভেন্ট পাবলিশ হয়েছে!");

        // মডাল অটোমেটিক বন্ধ করা
        setShowPaymentModal(false);
        setTempEventData(null);

        // ২ সেকেন্ড পর ইভেন্ট লিস্টে পাঠিয়ে দেওয়া (ঐচ্ছিক)
        setTimeout(() => {
          navigate("/upcoming-events");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("সার্ভারে ডাটা সেভ করতে সমস্যা হয়েছে।");
    }
  };

  // লোডিং স্টেট
  if (loading) {
    return (
      <div className="text-center py-20">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <Container className="py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl border border-blue-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 flex items-center justify-center gap-3">
          <FaCalendarPlus className="text-blue-500" /> Create a New Social Event
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="eventName"
                placeholder="e.g., Park Cleanup"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Environment">Environment & Ecology</option>
                <option value="Education">Education & Skill Building</option>
                <option value="Health">Health & Wellness</option>
                <option value="Community">Community Building</option>
                <option value="Welfare">Social Welfare</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="url"
              name="image"
              placeholder="Image URL"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location/Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaRegCalendarAlt className="text-blue-500" /> Event Date & Time
            </label>
            <DatePicker
              selected={eventDate}
              onChange={(date) => setEventDate(date)}
              showTimeSelect
              dateFormat="Pp"
              minDate={new Date()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
              required
            />
          </div>

          <textarea
            name="description"
            rows="4"
            placeholder="Event Description..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
            required
          ></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-4 rounded-lg border border-blue-300">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaUser className="text-blue-600" /> Organizer:{" "}
              <strong>{user?.displayName}</strong>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaEnvelope className="text-blue-600" /> Email:{" "}
              <strong>{user?.email}</strong>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
          >
            Pay ${ORGANIZER_FEE} & Publish Event
          </button>
        </form>
      </div>

      {/* --- পেমেন্ট মডাল --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <FaTimes size={24} />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                অর্গানাইজার পেমেন্ট
              </h3>
              <p className="text-gray-500 mt-2">
                ইভেন্টটি পাবলিশ করতে <strong>${ORGANIZER_FEE}.00</strong>{" "}
                পেমেন্ট নিশ্চিত করুন।
              </p>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm
                price={ORGANIZER_FEE}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </Container>
  );
};

export default CreateEvent;
