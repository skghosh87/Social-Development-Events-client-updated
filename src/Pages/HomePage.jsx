import React from "react";

import BannerSection from "../Components/Home/BannerSection";
import FeatureSection from "../Components/Home/FeatureSection";
import GallerySection from "../Components/Home/GallerySection";
import NewsLetterSection from "../Components/Home/NewsLetterSection";
import TestimonialSection from "../Components/Home/TestimonialSection";
import SuccessStatsSection from "../Components/Home/SuccessStatsSection";
import HowItWorksSection from "../Components/Home/HowItWorksSection";
import PartnerSection from "../Components/Home/PartnerSection";

const HomePage = () => {
  return (
    <div>
      <BannerSection />
      <FeatureSection />
      <GallerySection />
      <TestimonialSection />
      <PartnerSection />
      <SuccessStatsSection />
      <HowItWorksSection />
      <NewsLetterSection />
    </div>
  );
};

export default HomePage;
