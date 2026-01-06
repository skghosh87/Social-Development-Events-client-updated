import React from "react";
import {
  FaCalendarCheck,
  FaHandsHelping,
  FaHeart,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Container from "../Container";

const FeatureSection = () => {
  const features = [
    {
      icon: FaCalendarCheck,
      title: "Create & Host",
      description:
        "Any registered user can easily initiate and manage community events.",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Local Impact",
      description:
        "Discover and join events tailored to your local area and interests.",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      icon: FaHandsHelping,
      title: "Track Progress",
      description:
        "Monitor events you've joined and see the real social change you've created.",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
    {
      icon: FaHeart,
      title: "Community Driven",
      description:
        "A platform built on the passion and collaboration of local volunteers.",
      bgColor: "bg-rose-500/10",
      iconColor: "text-rose-500",
    },
  ];

  return (
    <section className="py-20 bg-base-200 dark:bg-slate-950/50 transition-colors duration-300">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Our Core <span className="text-secondary">Features</span>
          </h2>
          <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Empowering communities through seamless event management and
            collective action.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-pro p-8 text-center flex flex-col items-center group cursor-default"
            >
              {/* Icon Container */}
              <div
                className={`p-5 rounded-2xl ${feature.bgColor} ${feature.iconColor} mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
              >
                <feature.icon size={40} />
              </div>

              {/* Title - Automatic Blue/White based on Theme via index.css */}
              <h3 className="text-xl font-bold mb-3 dark:text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeatureSection;
