import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Container from "../Components/Container";
import {
  FaCalendarPlus,
  FaRegCalendarAlt,
  FaTimes,
  FaDollarSign,
  FaMapMarkerAlt,
  FaImage,
  FaLayerGroup,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Stripe Imports
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../Components/CheckoutForm";
import { useAuth } from "../Hooks/useAuth";

// Stripe Promise (কম্পোনেন্টের বাইরে রাখতে হবে)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CreateEvent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [eventDate, setEventDate] = useState(new Date());

  // পেমেন্ট ও মডাল স্টেট
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tempEventData, setTempEventData] = useState(null);

  const MIN_FEE = 5;
  const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!user || !user.email) {
      toast.error("ইভেন্ট তৈরি করতে অনুগ্রহ করে লগইন করুন।");
      return;
    }

    const form = e.target;

    // ডাটা অবজেক্ট তৈরি
    const eventData = {
      eventName: form.eventName.value,
      category: form.category.value,
      location: form.location.value,
      description: form.description.value,
      image: form.image.value,
      eventDate: eventDate?.toISOString() || new Date().toISOString(),
      organizerName: user?.displayName || "Anonymous",
      organizerEmail: user?.email,
      postedAt: new Date().toISOString(),
      participants: 0,
    };

    setTempEventData(eventData);
    setShowPaymentModal(true); // ফর্ম ভ্যালিড হলে মডাল ওপেন হবে
  };

  const handlePaymentSuccess = async (transactionId, paidAmount) => {
    if (!tempEventData) return;

    const loadingToast = toast.loading(
      "ইভেন্ট পাবলিশ হচ্ছে, দয়া করে অপেক্ষা করুন..."
    );

    try {
      const finalEventData = {
        ...tempEventData,
        transactionId,
        organizerContribution: Number(paidAmount),
      };

      const response = await axios.post(
        `${SERVER_BASE_URL}/api/events`,
        finalEventData
      );

      if (
        response.data.success ||
        response.status === 200 ||
        response.status === 201
      ) {
        toast.update(loadingToast, {
          render: `🎉 $${paidAmount} পেমেন্ট সফল এবং ইভেন্ট পাবলিশ হয়েছে!`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        setShowPaymentModal(false);
        setTempEventData(null);

        // ২ সেকেন্ড পর নেভিগেট হবে
        setTimeout(() => {
          navigate("/upcoming-events");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.update(loadingToast, {
        render: "সার্ভারে ডাটা সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
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
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 transition-all duration-300">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 flex items-center justify-center gap-3">
            <FaCalendarPlus className="text-blue-600 animate-bounce" /> Create
            New Event
          </h2>
          <p className="text-gray-500 mt-2">
            আপনার মহৎ উদ্যোগের বিস্তারিত তথ্য দিয়ে ফর্মটি পূরণ করুন
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <FaLayerGroup className="text-blue-500" /> Event Title
              </label>
              <input
                type="text"
                name="eventName"
                placeholder="উদা: শীতবস্ত্র বিতরণ অভিযান"
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <FaLayerGroup className="text-blue-500" /> Category
              </label>
              <select
                name="category"
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all cursor-pointer"
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
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <FaImage className="text-blue-500" /> Image URL
              </label>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <FaMapMarkerAlt className="text-red-500" /> Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="উদা: ধানমন্ডি লেক, ঢাকা"
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaRegCalendarAlt className="text-blue-500" /> Event Date & Time
              </label>
              <DatePicker
                selected={eventDate}
                onChange={(date) => setEventDate(date)}
                showTimeSelect
                dateFormat="Pp"
                minDate={new Date()}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="ইভেন্টের উদ্দেশ্য এবং বিস্তারিত এখানে লিখুন..."
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all shadow-xl hover:shadow-blue-200 active:scale-[0.99] flex items-center justify-center gap-2 text-lg"
          >
            <FaDollarSign /> Continue to Payment & Publish
          </button>
        </form>
      </div>

      {/* --- পেমেন্ট মডাল --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
            >
              <FaTimes size={20} />
            </button>

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <FaDollarSign size={36} />
              </div>
              <h3 className="text-2xl font-black text-gray-800">
                অর্গানাইজার ফি প্রদান
              </h3>
              <p className="text-gray-500 mt-3 text-sm leading-relaxed px-4">
                আপনার ইভেন্টটি পাবলিশ করার জন্য নূন্যতম{" "}
                <strong>${MIN_FEE}.00</strong> পেমেন্ট সম্পন্ন করুন।
              </p>
            </div>

            {/* Elements Wrapper with Key fix */}
            <div className="p-1">
              <Elements
                key={tempEventData?.eventName + amount}
                stripe={stripePromise}
              >
                <CheckoutForm onPaymentSuccess={handlePaymentSuccess} />
              </Elements>
            </div>

            <p className="mt-6 text-[11px] text-center text-gray-400 font-medium">
              🔒 পেমেন্ট সিকিউরড বাই স্ট্রাইপ এন্ড-টু-এন্ড এনক্রিপশন
            </p>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" theme="colored" />
    </Container>
  );
};

export default CreateEvent;
