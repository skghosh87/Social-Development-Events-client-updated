import React from "react";
import Container from "../Components/Container";
import {
  FaCalendarCheck,
  FaHandsHelping,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
// Swiper-এর জন্য প্রয়োজনীয় ফাইল ইম্পোর্ট করুন
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

// --- স্ট্যাটিক ডেটা ---

// গ্যালারির জন্য স্থির ছবি (উদাহরণ)
const galleryPhotos = [
  "https://i.ibb.co/30f2q39/event-1.jpg",
  "https://i.ibb.co/6P1t1Bq/event-2.jpg",
  "https://i.ibb.co/f4j2G7J/event-3.jpg",
  "https://i.ibb.co/10b2h1J/event-4.jpg",
  "https://i.ibb.co/3c6J0yN/event-5.jpg",
  "https://i.ibb.co/P4xW54T/event-6.jpg",
];

// ফিচার কার্ডের ডেটা
const features = [
  {
    icon: FaCalendarCheck,
    title: "Create & Host",
    description:
      "Any registered user can easily initiate and manage community events.",
    color: "text-blue-500",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Local Impact",
    description:
      "Discover and join events tailored to your local area and interests.",
    color: "text-green-500",
  },
  {
    icon: FaHandsHelping,
    title: "Track Progress",
    description:
      "Monitor events you've joined and see the real social change you've created.",
    color: "text-yellow-500",
  },
  {
    icon: FaHeart,
    title: "Community Driven",
    description:
      "A platform built on the passion and collaboration of local volunteers.",
    color: "text-red-500",
  },
];

const HomePage = () => {
  return (
    <div className="space-y-16 py-10">
      {/* ১. Banner Section (Hero) */}
      <section
        className="relative h-[60vh] md:h-[80vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://i.ibb.co/Qd5sN5z/hero-banner-social.jpg)`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <Container className="text-center text-white p-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-bounce">
              Be the Change You Wish to See
            </h1>
            <p className="text-lg md:text-xl font-light mb-8 max-w-3xl mx-auto">
              Connect with community-driven events—from road cleaning to tree
              plantation—and create lasting social impact.
            </p>
            <Link to="/upcoming-events">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-xl transform hover:scale-105">
                Explore Upcoming Events
              </button>
            </Link>
          </Container>
        </div>
      </section>

      {/* ২. Feature Section */}
      <section className="py-10">
        <Container>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 border-b-2 border-blue-500 inline-block mx-auto pb-1">
            Our Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] text-center border-t-4 border-blue-400"
              >
                <feature.icon
                  className={`text-5xl ${feature.color} mx-auto mb-4`}
                />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ৩. Gallery Section (Static) */}
      <section className="py-10 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 border-b-2 border-blue-500 inline-block mx-auto pb-1">
            Moments of Impact
          </h2>

          {/* Swiper Slider ব্যবহার করে গ্যালারি তৈরি */}
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="mySwiper"
          >
            {galleryPhotos.map((photo, index) => (
              <SwiperSlide key={index}>
                <div className="h-64 rounded-lg overflow-hidden shadow-lg border-4 border-white transition duration-300 hover:shadow-2xl">
                  <img
                    src={photo}
                    alt={`Event Gallery Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </section>

      {/* ৪. Newsletter Section (No functionality required) */}
      <section className="py-16 bg-blue-600">
        <Container className="text-center text-white max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Stay Updated on Social Events
          </h2>
          <p className="text-lg font-light mb-6">
            Subscribe to our newsletter and never miss an opportunity to
            volunteer and contribute to your community.
          </p>
          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full md:w-2/3 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
              required
            />
            <button
              type="submit"
              className="w-full md:w-1/3 bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-300 shadow-md"
            >
              Subscribe Now
            </button>
          </form>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
