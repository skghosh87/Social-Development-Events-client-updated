import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules"; // Pagination মডিউল নিশ্চিত করা হয়েছে
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import Container from "../Container";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination"; // পেজিনেশন স্টাইল অবশ্যই ইমপোর্ট করতে হবে

const testimonialData = [
  {
    id: 1,
    name: "Rahat Islam",
    role: "Lead Volunteer",
    image: "https://i.pravatar.cc/150?u=rahat",
    comment:
      "SDEP-এর সাথে কাজ করা আমার জীবনের অন্যতম সেরা অভিজ্ঞতা। ইভেন্ট ম্যানেজমেন্ট এখন অনেক সহজ এবং কার্যকর হয়ে উঠেছে।",
    rating: 5,
  },
  {
    id: 2,
    name: "Sara Ahmed",
    role: "Event Organizer",
    image: "https://i.pravatar.cc/150?u=sara",
    comment:
      "কমিউনিটি ইভেন্ট হোস্ট করার জন্য এর চেয়ে ভালো প্ল্যাটফর্ম আমি দেখিনি। ড্যাশবোর্ড স্ট্যাটিসটিকসগুলো সত্যিই দারুণ!",
    rating: 5,
  },
  {
    id: 3,
    name: "Tanvir Hasan",
    role: "Regular Donor",
    image: "https://i.pravatar.cc/150?u=tanvir",
    comment:
      "খুবই স্বচ্ছ এবং প্রফেশনাল একটি সিস্টেম। আমি সহজেই দেখতে পাই আমার অবদান কোথায় এবং কীভাবে কাজে লাগছে।",
    rating: 4,
  },
  {
    id: 4,
    name: "Nabila Karim",
    role: "Social Worker",
    image: "https://i.pravatar.cc/150?u=nabila",
    comment:
      "প্ল্যাটফর্মটি ইউজার ফ্রেন্ডলি এবং এর ডার্ক মোড ডিজাইনটি অসাধারণ। কাজের প্রতি আগ্রহ বাড়িয়ে দেয় অনেক গুণ।",
    rating: 5,
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-base-200 dark:bg-slate-950/40 transition-colors duration-300">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Voices of Our <span className="text-secondary">Community</span>
          </h2>
          <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full"></div>
        </div>

        {/* Testimonials Slider */}
        <div className="testimonial-swiper-container">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              dynamicBullets: true, // ডটগুলো দেখতে আরও আধুনিক লাগবে
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            // !pb-14 ব্যবহার করা হয়েছে যাতে ডটগুলো কার্ডের গায়ে লেগে না যায়
            className="mySwiper !pb-14"
          >
            {testimonialData.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="card-pro p-8 relative flex flex-col h-[350px] group shadow-sm">
                  {/* প্রোফাইল ইনফো */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary/30 ring-4 ring-secondary/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-slate-800 dark:text-white leading-none mb-1 text-lg">
                        {item.name}
                      </h4>
                      <span className="text-xs text-secondary font-semibold uppercase tracking-wider">
                        {item.role}
                      </span>
                    </div>
                    <FaQuoteLeft className="text-3xl text-secondary/10 group-hover:text-secondary/20 transition-colors" />
                  </div>

                  {/* কমেন্ট */}
                  <div className="flex-grow">
                    <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-base">
                      "{item.comment}"
                    </p>
                  </div>

                  {/* রেটিং স্টার */}
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < item.rating
                                ? "text-amber-400"
                                : "text-slate-200 dark:text-slate-700"
                            }
                            size={18}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* পেজিনেশন কালার কাস্টমাইজ করার জন্য নিচের CSS টুকু আপনার index.css এ রাখতে পারেন */}
        <style jsx="true">{`
          .swiper-pagination-bullet-active {
            background: var(--color-secondary, #3b82f6) !important;
            width: 20px !important;
            border-radius: 5px !important;
          }
        `}</style>
      </Container>
    </section>
  );
};

export default TestimonialSection;
