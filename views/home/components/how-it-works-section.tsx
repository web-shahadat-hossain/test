"use client";
import React from "react";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const features = [
    {
      title: "Fastest Delivery",
      description:
        "The majority have the best quality U.S. products with amazing offers",
      icon: "✈️",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: "Easy to Order",
      description: "Simple process to order any product from U.S. stores",
      icon: "🛍️",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      borderColor: "border-green-200",
    },
    {
      title: "Wide Coverage Map",
      description:
        "Delivery available across Bangladesh with real-time tracking",
      icon: "🌏",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      borderColor: "border-purple-200",
    },
    {
      title: "More Than 160+ Stores",
      description: "Access to hundreds of U.S. stores and millions of products",
      icon: "🏪",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      borderColor: "border-orange-200",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#F8F9FB] to-white">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <motion.div
          className="flex-col mb-16 sm:mb-20 lg:mb-24 xl:mb-28 center gap-y-4 sm:gap-y-6 lg:gap-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-[120px] h-[40px] sm:w-[136px] sm:h-[44px] lg:w-[160px] lg:h-[52px] bg-white center rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <p className="text-base sm:text-lg lg:text-xl font-medium text-[#465967]">
              Features
            </p>
          </motion.div>
          <motion.h1 className="max-w-[90%] sm:max-w-[636px] w-full text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center title_md radial_text_gradient">
            Why Choose AmericaToBD?
          </motion.h1>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col items-center text-center p-6 rounded-2xl border ${feature.borderColor} ${feature.bgColor} backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
            >
              <div
                className={`flex items-center justify-center w-16 h-16 mb-4 rounded-xl ${feature.iconBg} border ${feature.borderColor}`}
              >
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
