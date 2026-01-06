import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { FaSeedling, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const sliderData = [
  {
    title: "Our mission is to stand by people.",
    slogan: "Ideas Unite. Futures are Built. 🌍",
    image: "https://i.ibb.co.com/YFJRfSwN/images-3.jpg",
    gradient: "from-blue-900/80 via-black/40 to-transparent",
  },
  {
    title: "Global Progress Forum",
    slogan: "Connecting Minds for Community Impact. 🤝",
    image: "https://i.ibb.co.com/x8X90kt2/G4bs-CK5-W0-AAj9-A6.jpg",
    gradient: "from-slate-900/80 via-black/40 to-transparent",
  },
  {
    title: "Plant Trees, Save Environment",
    slogan: "Driving Sustainable Development, One Event at a Time.",
    image: "https://i.ibb.co.com/j9XjxNbS/IMG-20190724-103607-Copy-Copy.jpg",
    gradient: "from-emerald-900/80 via-black/40 to-transparent",
  },
];

const BannerSection = () => {
  return (
    <div className="h-[70vh] md:h-[85vh] w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        effect={"fade"}
        loop={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="mySwiper w-full h-full"
      >
        {sliderData.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="h-full w-full relative group">
              {/* Background Image with Zoom Effect */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[5000ms] group-hover:scale-110"
              />

              {/* Dynamic Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} flex items-center justify-center p-6`}
              >
                <div className="text-center text-white max-w-4xl space-y-6">
                  {/* Icon Animation */}
                  <div className="flex justify-center animate-bounce">
                    <FaSeedling className="text-5xl md:text-6xl text-secondary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  </div>

                  {/* Title with tracking-tight */}
                  <h1 className="text-4xl md:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-2xl">
                    {slide.title}
                  </h1>

                  {/* Slogan */}
                  <p className="text-lg md:text-2xl font-medium text-slate-200 drop-shadow-lg max-w-2xl mx-auto italic">
                    {slide.slogan}
                  </p>

                  {/* Updated Button using your btn-pro class */}
                  <div className="pt-4">
                    <Link to="/upcoming-events">
                      <button className="btn-pro px-10 py-4 text-lg flex items-center gap-3 mx-auto group/btn cursor-pointer rounded-lg">
                        Explore Upcoming Events
                        <FaArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSection;
