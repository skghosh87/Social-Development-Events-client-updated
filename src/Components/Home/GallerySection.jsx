import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Container from "../Container";

const galleryPhotos = [
  "https://i.ibb.co.com/Ngg3Nk2D/image.jpg",
  "https://i.ibb.co.com/Jw3k9YVZ/WSSAUWIN-kip-C-621x414-Live-Mint.webp",
  "https://i.ibb.co.com/gFJ0VKZT/images.jpg",
  "https://i.ibb.co.com/sJWLH4yQ/Tree-Planting-Campaigns-CSR-ESG-NGO-Sustainability-Earth5-R-Mumbai-1.jpg",
  "https://i.ibb.co.com/PZqK5qS1/images-2.jpg",
];

const GallerySection = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Moments of <span className="text-secondary">Impact</span>
          </h2>
          <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            A visual journey through our community initiatives and successful
            events.
          </p>
        </div>

        {/* Swiper Slider */}
        <div className="relative group">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true, dynamicBullets: true }}
            loop={true}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="mySwiper !pb-14"
          >
            {galleryPhotos.map((photo, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-72 md:h-80 rounded-[--radius-card] overflow-hidden group/item border-4 border-white dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <img
                    src={photo}
                    alt={`Event Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-secondary/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 dark:bg-slate-900/90 p-3 rounded-full transform translate-y-10 group-hover/item:translate-y-0 transition-transform duration-300">
                      <span className="text-secondary font-bold text-sm px-2">
                        View Event
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </section>
  );
};

export default GallerySection;
