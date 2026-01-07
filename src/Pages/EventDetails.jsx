import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../Components/CheckoutForm";

// স্ট্রাইপ পাবলিশেবল কি লোড করা
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const EventDetails = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";

  // ১. ইভেন্ট ডাটা এবং ইউজারের রোল লোড করা
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        // ইভেন্ট ডিটেইলস আনা
        const eventRes = await axios.get(`${SERVER_BASE_URL}/api/events/${id}`);
        setEvent(eventRes.data.event);

        // ইউজারের রোল চেক করা
        if (user?.email) {
          const roleRes = await axios.get(
            `${SERVER_BASE_URL}/api/users/role/${user.email}`
          );
          setUserRole(roleRes.data.role);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("ইভেন্টের তথ্য লোড করতে সমস্যা হয়েছে।");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [id, user?.email]);

  if (isLoading || authLoading)
    return <div className="text-center py-20 font-bold">Loading...</div>;
  if (!event)
    return (
      <div className="text-center py-20 text-red-500">Event not found!</div>
    );

  const isAdmin = userRole === "admin";
  const isOrganizer = user?.email === event?.organizerEmail;

  // ২. জয়েন বাটনের লজিক
  const handleJoinClick = () => {
    if (!user) {
      toast.warning("এই ইভেন্টে জয়েন করতে আগে লগইন করুন।");
      return navigate("/login");
    }

    // অ্যাডমিন বা অর্গানাইজার হলে সরাসরি জয়েন
    if (isAdmin || isOrganizer) {
      proceedToJoin("free", 0);
    } else {
      // সাধারণ ইউজার হলে পেমেন্ট মডাল
      setShowPaymentModal(true);
    }
  };

  // ৩. ডাটাবেজে জয়েনিং এবং পেমেন্ট সেভ করার ফাংশন
  const proceedToJoin = async (transactionId, paidAmount = 0) => {
    try {
      const joinData = {
        eventId: event._id,
        eventName: event.eventName,
        userEmail: user.email,
        userName: user.displayName || "Anonymous",
        transactionId: transactionId || "free",
        amount: parseFloat(paidAmount),
        date: new Date().toISOString(),
      };

      const res = await axios.post(
        `${SERVER_BASE_URL}/api/join-event`,
        joinData
      );

      if (res.data.success) {
        toast.success(
          paidAmount > 0
            ? `$${paidAmount} পেমেন্ট এবং জয়েন সফল হয়েছে!`
            : "সফলভাবে জয়েন করেছেন!"
        );
        setShowPaymentModal(false);
        // জয়েন করার পর রিফ্রেশ বা রিডাইরেক্ট করতে পারেন
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info("আপনি ইতিমধ্যে এই ইভেন্টে জয়েন করেছেন।");
      } else {
        toast.error("জয়েন করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      }
      setShowPaymentModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <img
          src={event.image || "https://via.placeholder.com/800x400"}
          alt={event.eventName}
          className="w-full h-96 object-cover"
        />

        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-800">
              {event.eventName}
            </h1>
            <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold uppercase">
              {event.category || "General"}
            </span>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            {event.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-5 rounded-xl flex flex-col">
              <span className="text-blue-600 text-sm font-bold uppercase mb-1">
                Date & Time
              </span>
              <span className="text-gray-800 font-semibold">
                {event.eventDate}
              </span>
            </div>
            <div className="bg-emerald-50 p-5 rounded-xl flex flex-col">
              <span className="text-emerald-600 text-sm font-bold uppercase mb-1">
                Location
              </span>
              <span className="text-gray-800 font-semibold">
                {event.location}
              </span>
            </div>
          </div>

          <button
            onClick={handleJoinClick}
            className="w-full py-4 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700 hover:shadow-lg transition duration-300"
          >
            {isAdmin || isOrganizer ? "Access Event Panel" : "Join This Event"}
          </button>
        </div>
      </div>

      {/* পেমেন্ট মডাল */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition text-2xl"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                সহযোগিতার হাত বাড়িয়ে দিন
              </h2>
              <p className="text-gray-500 text-sm">
                ঢাকা শহরকে পরিষ্কার রাখতে এই ইভেন্টে অংশ নিতে নূন্যতম{" "}
                <strong className="text-green-600">$৫</strong> পেমেন্ট করুন।
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  price={5} // নূন্যতম ৫ ডলার প্রপস হিসেবে পাঠানো হচ্ছে
                  onPaymentSuccess={(trxId, amount) =>
                    proceedToJoin(trxId, amount)
                  }
                />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
