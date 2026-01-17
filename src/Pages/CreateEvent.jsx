import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Container from "../Components/Container";
import {
  FaCalendarPlus,
  FaTimes,
  FaDollarSign,
  FaCrown,
  FaUser,
  FaImage,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Stripe Imports
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../Components/CheckoutForm";
import { useAuth } from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CreateEvent = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [eventDate, setEventDate] = useState(new Date());
  const [userRole, setUserRole] = useState("user");

  // পেমেন্ট ও মডাল স্টেট
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tempEventData, setTempEventData] = useState(null);

  const MIN_FEE = 5;

  // ইউজার রোল ফেচ করা
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/api/users/role/${user.email}`)
        .then((res) => setUserRole(res.data.admin ? "admin" : "user"))
        .catch((err) => console.error("Error fetching role:", err));
    }
  }, [user, axiosSecure]);

  /* =============================================
      ১. ডাটাবেসে ইভেন্ট সেভ করার কমন ফাংশন
  ============================================= */
  const saveEventToDb = async (eventData, transactionId, paidAmount) => {
    const loadingToast = toast.loading("ইভেন্ট পাবলিশ হচ্ছে, অপেক্ষা করুন...");

    try {
      const finalEventData = {
        ...eventData,
        transactionId: transactionId,
        organizerContribution: Number(paidAmount),
      };

      const response = await axiosSecure.post("/api/events", finalEventData);

      if (response.data.insertedId) {
        toast.update(loadingToast, {
          render:
            userRole === "admin"
              ? "🎉 সরাসরি পাবলিশ করা হয়েছে!"
              : "🎉 পেমেন্ট সফল ও ইভেন্ট লাইভ হয়েছে!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        setShowPaymentModal(false);
        // ২ সেকেন্ড পর ইভেন্ট লিস্টে নিয়ে যাবে
        setTimeout(() => navigate("/upcoming-events"), 2000);
      }
    } catch (error) {
      toast.update(loadingToast, {
        render: error.response?.data?.message || "সার্ভারে সমস্যা হয়েছে।",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  /* =============================================
      ২. পেমেন্ট সাকসেস হ্যান্ডলার (CheckoutForm এর জন্য)
  ============================================= */
  const handlePaymentSuccess = (transactionId) => {
    if (tempEventData) {
      saveEventToDb(tempEventData, transactionId, MIN_FEE);
    } else {
      toast.error("ইভেন্ট ডাটা পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    }
  };

  /* =============================================
      ৩. ফর্ম সাবমিট হ্যান্ডলার
  ============================================= */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!user) return toast.error("অনুগ্রহ করে আগে লগইন করুন।");

    const form = e.target;
    const eventData = {
      eventName: form.eventName.value,
      category: form.category.value,
      location: form.location.value,
      description: form.description.value,
      image: form.image.value,
      eventDate: eventDate.toISOString(),
      organizerName: user?.displayName || "Anonymous",
      organizerEmail: user?.email,
    };

    if (userRole === "admin") {
      // এডমিন হলে সরাসরি সেভ হবে, পেমেন্ট লাগবে না
      saveEventToDb(eventData, "admin-bypass", 0);
    } else {
      setTempEventData(eventData);
      setShowPaymentModal(true);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen transition-all">
      <Container>
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3rem] shadow-2xl relative border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                Create <span className="text-secondary">New Event</span>
              </h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                Share your social initiative with the community
              </p>
            </div>

            <div
              className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                userRole === "admin"
                  ? "bg-amber-50 text-amber-600 border-amber-100 shadow-lg shadow-amber-200/20"
                  : "bg-blue-50 text-blue-600 border-blue-100"
              }`}
            >
              {userRole === "admin" ? (
                <>
                  <FaCrown /> Admin Direct Post
                </>
              ) : (
                <>
                  <FaUser /> Organizer Mode
                </>
              )}
            </div>
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-2">
                  Event Title
                </label>
                <input
                  type="text"
                  name="eventName"
                  placeholder="e.g. Save the Forest 2026"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-secondary/40 outline-none dark:text-white font-bold transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-2">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-secondary/40 outline-none dark:text-white font-bold transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Welfare">Social Welfare</option>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Health">Healthcare</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-2">
                  Image Link
                </label>
                <div className="relative">
                  <FaImage className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="url"
                    name="image"
                    placeholder="https://..."
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-secondary/40 outline-none dark:text-white font-bold transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-2">
                  Location
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    name="location"
                    placeholder="City, Country"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-secondary/40 outline-none dark:text-white font-bold transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-2">
                  Event Schedule
                </label>
                <DatePicker
                  selected={eventDate}
                  onChange={(date) => setEventDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-secondary/40 outline-none dark:text-white font-bold transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Tell us more about the goals..."
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-secondary/40 outline-none dark:text-white font-bold transition-all resize-none"
                  required
                ></textarea>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className={`w-full py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl ${
                  userRole === "admin"
                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                    : "bg-secondary hover:bg-blue-700 text-white shadow-blue-500/20"
                }`}
              >
                {userRole === "admin" ? (
                  <>
                    <FaCalendarPlus size={20} /> Publish Instantly
                  </>
                ) : (
                  <>
                    <FaDollarSign size={18} /> Pay ${MIN_FEE} & Go Live
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Stripe Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 backdrop-blur-xl p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 max-w-md w-full relative shadow-2xl">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-8 right-8 text-slate-400 hover:text-secondary transition-all"
              >
                <FaTimes size={20} />
              </button>
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                  <FaDollarSign size={36} />
                </div>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                  Secure Payment
                </h3>
                <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">
                  Publishing Fee:{" "}
                  <span className="text-secondary">${MIN_FEE}.00</span>
                </p>
              </div>

              <Elements stripe={stripePromise}>
                <CheckoutForm
                  onPaymentSuccess={handlePaymentSuccess}
                  price={MIN_FEE}
                />
              </Elements>
            </div>
          </div>
        )}
        <ToastContainer theme="colored" position="bottom-right" />
      </Container>
    </div>
  );
};

export default CreateEvent;
