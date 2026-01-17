import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../Components/CheckoutForm";
import Container from "../Components/Container";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import axios from "axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaLock,
  FaExternalLinkAlt,
  FaUsers,
  FaTimes,
  FaDonate,
} from "react-icons/fa";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";

const EventDetails = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const [isJoined, setIsJoined] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  /* ===============================
      ১. ইভেন্ট ডাটা লোড করা (Public)
  =============================== */
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${SERVER_BASE_URL}/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        toast.error("ইভেন্ট খুঁজে পাওয়া যায়নি!");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) loadEvent();
  }, [id]);

  /* ===============================
      ২. রোল এবং পেমেন্ট স্ট্যাটাস চেক
=============================== */
  useEffect(() => {
    if (!user?.email || !id) return;

    const checkStatus = async () => {
      try {
        const roleRes = await axiosSecure.get(`/api/users/role/${user.email}`);
        setUserRole(roleRes.data.admin ? "admin" : "user");

        const joinedRes = await axiosSecure.get(
          `/api/joined-events/${user.email}`
        );

        const hasJoined = joinedRes.data.some(
          (joinedEvent) => joinedEvent.eventId === id || joinedEvent._id === id
        );

        if (hasJoined) {
          setIsJoined(true);

          const paymentData = joinedRes.data.find((e) => e.eventId === id);
          setPaymentInfo(paymentData);
        } else {
          setIsJoined(false);
        }
      } catch (err) {
        console.error("Status check error:", err);
      }
    };

    checkStatus();
  }, [user?.email, id, axiosSecure]);

  const isAdmin = userRole === "admin";
  const isOrganizer = user?.email === event?.organizerEmail;

  const handleJoinClick = () => {
    if (!user) {
      toast.warning("জয়েন করতে আগে লগইন করুন।");
      return navigate("/login");
    }
    setShowPaymentModal(true);
  };

  /* ===============================
      ৩. ইভেন্টে জয়েন করার ফাংশন
  =============================== */
  const proceedToJoin = async (transactionId, paidAmount) => {
    try {
      const joinData = {
        eventId: id,
        eventName: event.eventName,
        eventDate: event.eventDate,
        amount: Number(paidAmount),
        transactionId,
      };

      const res = await axiosSecure.post("/api/join-event", joinData);

      if (res.data.insertedId) {
        toast.success("অভিনন্দন! আপনি সফলভাবে ইভেন্টে যুক্ত হয়েছেন।");
        setIsJoined(true);
        setPaymentInfo({ transactionId });
        setShowPaymentModal(false);

        setEvent((prev) => ({
          ...prev,
          participants: (prev.participants || 0) + 1,
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "জয়েন করতে সমস্যা হয়েছে।");
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
      </div>
    );
  }

  if (!event)
    return (
      <div className="text-center py-20 font-bold">ইভেন্ট পাওয়া যায়নি!</div>
    );

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
          {/* Hero Section */}
          <div className="relative h-[400px]">
            <img
              src={event.image}
              className="w-full h-full object-cover"
              alt={event.eventName}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="px-4 py-1 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                {event.category}
              </span>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                {event.eventName}
              </h1>
            </div>
          </div>

          <div className="p-10">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <FaCalendarAlt className="text-secondary text-2xl" />
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    তারিখ
                  </p>
                  <p className="font-bold dark:text-white">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <FaMapMarkerAlt className="text-secondary text-2xl" />
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    স্থান
                  </p>
                  <p className="font-bold dark:text-white">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <FaUsers className="text-secondary text-2xl" />
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    অংশগ্রহণকারী
                  </p>
                  <p className="font-bold dark:text-white">
                    {event.participants || 0} জন যুক্ত
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4 dark:text-white">
                ইভেন্ট সম্পর্কে
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {event.description}
              </p>
            </div>

            {/* Action Buttons with Conditional Logic */}
            <div className="border-t dark:border-slate-800 pt-8">
              {isAdmin || isOrganizer ? (
                <button
                  onClick={() => navigate("/dashboard/manage-events")}
                  className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                >
                  <FaExternalLinkAlt /> এডমিন প্যানেল থেকে ম্যানেজ করুন
                </button>
              ) : isJoined ? (
                /* ইউজার আগে জয়েন করলে এই সেকশনটি দেখাবে */
                <div className="w-full py-6 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-[2rem] text-center">
                  <div className="flex items-center justify-center gap-3 text-green-600 dark:text-green-400 font-black uppercase tracking-widest text-lg mb-1">
                    <FaCheckCircle size={24} />
                    আপনি আগে থেকেই যুক্ত আছেন
                  </div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    ট্রানজেকশন আইডি:{" "}
                    <span className="text-slate-600 dark:text-slate-300">
                      {paymentInfo?.transactionId}
                    </span>
                  </p>
                </div>
              ) : (
                /* জয়েন না করলে বাটন দেখাবে */
                <button
                  onClick={handleJoinClick}
                  className="w-full py-5 bg-secondary hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all"
                >
                  <FaLock /> ইভেন্টে জয়েন করুন
                </button>
              )}
            </div>
          </div>
        </div>

        {/* পেমেন্ট মডাল */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              onClick={() => setShowPaymentModal(false)}
            />
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-white/20 animate-in zoom-in duration-300">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-8 right-8 text-slate-400 hover:text-secondary transition-all"
              >
                <FaTimes size={24} />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaDonate size={28} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                  পেমেন্ট সম্পন্ন করুন
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                  নিরাপদ পেমেন্ট গেটওয়ে
                </p>
              </div>

              <Elements stripe={stripePromise}>
                <CheckoutForm onPaymentSuccess={proceedToJoin} price={5} />
              </Elements>
            </div>
          </div>
        )}

        <ToastContainer theme="colored" position="bottom-right" />
      </Container>
    </div>
  );
};

export default EventDetails;
