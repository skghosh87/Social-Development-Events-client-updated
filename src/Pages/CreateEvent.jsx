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
  FaDollarSign,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Stripe Imports
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../Components/CheckoutForm";
import { useAuth } from "../Hooks/useAuth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CreateEvent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [eventDate, setEventDate] = useState(new Date());

  // পেমেন্ট ও মডাল স্টেট
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tempEventData, setTempEventData] = useState(null);

  const MIN_FEE = 5; // নূন্যতম ৫ ডলার
  const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";

  // ১. ফর্ম সাবমিট হ্যান্ডলার
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
      // অর্গানাইজারের কন্ট্রিবিউশন পরে পেমেন্ট সাকসেস হলে যোগ হবে
    };

    setTempEventData(eventData);
    setShowPaymentModal(true);
  };

  // ২. পেমেন্ট সফল হলে এই ফাংশনটি কল হবে
  const handlePaymentSuccess = async (transactionId, paidAmount) => {
    try {
      // ইভেন্ট ডাটার সাথে ট্রানজেকশন আইডি এবং অ্যামাউন্ট যোগ করা
      const finalEventData = {
        ...tempEventData,
        transactionId,
        organizerContribution: paidAmount,
      };

      const response = await axios.post(
        `${SERVER_BASE_URL}/api/events`,
        finalEventData
      );

      if (response.data.success) {
        toast.success(`🎉 $${paidAmount} পেমেন্ট সফল এবং ইভেন্ট পাবলিশ হয়েছে!`);
        setShowPaymentModal(false);
        setTempEventData(null);

        setTimeout(() => {
          navigate("/upcoming-events");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("সার্ভারে ডাটা সেভ করতে সমস্যা হয়েছে।");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <Container className="py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-3">
          <FaCalendarPlus className="text-blue-600" /> Create New Event
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                name="eventName"
                placeholder="e.g., Road Cleaning Drive"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              >
                <option value="">Select Category</option>
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Community">Community</option>
                <option value="Welfare">Welfare</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                placeholder="https://image-link.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Dhanmondi, Dhaka"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaRegCalendarAlt className="text-blue-500" /> Event Date & Time
            </label>
            <DatePicker
              selected={eventDate}
              onChange={(date) => setEventDate(date)}
              showTimeSelect
              dateFormat="Pp"
              minDate={new Date()}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Tell us about the event mission..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaUser className="text-blue-500" /> Organizer:{" "}
              <strong>{user?.displayName}</strong>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaEnvelope className="text-blue-500" /> Email:{" "}
              <strong>{user?.email}</strong>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <FaDollarSign /> Continue to Payment & Publish
          </button>
        </form>
      </div>

      {/* --- পেমেন্ট মডাল --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition"
            >
              <FaTimes size={20} />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaDollarSign size={30} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                অর্গানাইজার ফি
              </h3>
              <p className="text-gray-500 mt-2">
                ইভেন্টটি লিস্ট করতে নূন্যতম <strong>${MIN_FEE}.00</strong>{" "}
                পেমেন্ট করুন। আপনি চাইলে বেশি দিয়েও আমাদের সোশ্যাল ওয়ার্কে
                সাপোর্ট করতে পারেন।
              </p>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm onPaymentSuccess={handlePaymentSuccess} />
            </Elements>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </Container>
  );
};

export default CreateEvent;
