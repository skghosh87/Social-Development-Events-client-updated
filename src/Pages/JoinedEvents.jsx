import React, { useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import Container from "../Components/Container";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSpinner,
  FaExclamationCircle,
  FaRegCalendarTimes,
  FaCheckCircle,
  FaHashtag,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

const SERVER_BASE_URL = "https://social-development-events-seven.vercel.app";

const JoinedEvents = () => {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user?.email) {
      const fetchJoinedEvents = async () => {
        try {
          setLoading(true);
          // আপনার এই এপিআই-টি ডাটাবেস থেকে ওই ইউজারের জয়েন করা ইভেন্টগুলো নিয়ে আসবে
          const response = await axios.get(
            `${SERVER_BASE_URL}/api/joined-events/${user.email}`
          );

          setEvents(response.data);
        } catch (error) {
          console.error("Failed to load joined events:", error);
          toast.error("আপনার যুক্ত হওয়া ইভেন্টগুলি লোড করতে ব্যর্থ।");
        } finally {
          setLoading(false);
        }
      };
      fetchJoinedEvents();
    } else if (!user && !authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // লোডিং স্টেট
  if (loading || authLoading) {
    return (
      <Container className="py-20 text-center">
        <FaSpinner className="text-5xl text-blue-500 animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">আপনার ইভেন্টগুলি লোড হচ্ছে...</p>
      </Container>
    );
  }

  // লগইন না থাকলে
  if (!user) {
    return (
      <Container className="py-20 text-center">
        <FaExclamationCircle className="text-6xl text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold mt-4 text-gray-700">লগইন করুন</h2>
        <p className="text-gray-500 mt-2">
          আপনার যুক্ত হওয়া ইভেন্টগুলি দেখতে অনুগ্রহ করে লগইন করুন।
        </p>
      </Container>
    );
  }

  // কোনো ইভেন্ট না থাকলে
  if (events.length === 0) {
    return (
      <Container className="py-20 text-center">
        <FaRegCalendarTimes className="text-6xl text-orange-500 mx-auto" />
        <h2 className="text-2xl font-bold mt-4 text-gray-700">
          আপনি এখনো কোনো ইভেন্টে যুক্ত হননি।
        </h2>
        <p className="text-gray-500 mt-2 mb-6">
          নতুন ইভেন্টগুলো খুঁজে দেখতে ইভেন্ট তালিকায় যান এবং ডোনেশন দিয়ে জয়েন
          করুন!
        </p>
        <Link
          to="/upcoming-events"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-bold shadow-lg"
        >
          সব ইভেন্ট দেখুন
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
          আমার যুক্ত হওয়া ইভেন্টসমূহ
        </h2>
        <p className="text-gray-500">
          আপনার সফলভাবে জয়েন করা ইভেন্টগুলোর তালিকা নিচে দেওয়া হলো
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event._id || event.event_id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-500 overflow-hidden border border-gray-100 flex flex-col h-full"
          >
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <img
                src={
                  event.image ||
                  `https://placehold.co/600x400/2563eb/ffffff?text=Event`
                }
                alt={event.eventName}
                className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
              />
              {/* পেমেন্ট ব্যাজ */}
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <FaCheckCircle /> Joined with Payment
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-grow">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-3">
                {event.category || "General Event"}
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 truncate">
                {event.eventName}
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <FaCalendarAlt className="text-blue-500" />
                  <span>
                    {new Date(event.eventDate).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              {/* ট্রানজেকশন আইডি বক্স */}
              {event.transactionId && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-[10px] uppercase text-gray-400 font-bold mb-1 flex items-center gap-1">
                    <FaHashtag /> Transaction ID
                  </p>
                  <p
                    className="text-xs font-mono text-gray-700 break-all select-all cursor-copy"
                    title="কপি করতে ক্লিক করুন"
                  >
                    {event.transactionId}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Section */}
            <div className="p-6 pt-0">
              <Link
                to={`/event-details/${event.event_id || event._id}`}
                className="block w-full text-center py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-blue-600 transition duration-300 shadow-md"
              >
                বিস্তারিত দেখুন
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default JoinedEvents;
