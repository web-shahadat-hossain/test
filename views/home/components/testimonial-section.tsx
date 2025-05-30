"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  title?: string;
  image: string;
  quote: string;
}

const testimonialData: Testimonial[] = [
  {
    id: 1,
    name: "Robiul Ahsan",
    title: "CEO, Company",
    image: "/images/testimonial-1.png",
    quote:
      "Thought it wouldn't ship to BD, but they made it happen. Really impressed with the service!",
  },
  {
    id: 2,
    name: "Rafiul Hasan",
    title: "CEO, Company",
    image: "/images/testimonial-1.png",
    quote:
      "Saved so much money compared to local stores. Genuine product, great packaging, and quick updates!",
  },
  {
    id: 3,
    name: "Emma Carter",
    title: "CEO, Company",
    image: "/images/testimonial-2.png",
    quote:
      "Got my product from the US in perfect condition. Super smooth process and excellent communication!",
  },
  {
    id: 4,
    name: "Farhan Rahman",
    title: "CEO, Company",
    image: "/images/testimonial-1.png",
    quote:
      "Finally a trusted service for US products in Bangladesh. Fast delivery and 100% authentic!",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const TestimonialSection = () => {
  return (
    <section className="relative px-4 py-16 overflow-hidden md:py-20 lg:py-24 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="max-w-[1592.97px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center w-full mb-12 sm:mb-16 md:mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-[120px] sm:w-[140px] md:w-[160px] h-[40px] sm:h-[44px] md:h-[48px] bg-gradient-to-r from-orange-500/10 to-orange-600/10 center rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mb-8 sm:mb-10"
          >
            <p className="text-base font-semibold text-transparent sm:text-lg md:text-xl bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text">
              Testimonials
            </p>
          </motion.div>
          <div className="max-w-4xl px-4 text-center sm:px-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6 text-3xl font-bold leading-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text"
            >
              Satisfied customers are our best Ad
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-3xl mx-auto text-base text-gray-600 sm:text-lg md:text-xl"
            >
              See what our customers have to say about their experience with us
            </motion.p>
          </div>
        </motion.div>

        {/* Testimonial Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 px-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-8 sm:px-4"
        >
          {testimonialData.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3 },
              }}
              className={cn(
                "group w-full h-full min-h-[340px] sm:min-h-[360px] lg:min-h-[380px] p-5 sm:p-6 lg:p-7 rounded-[2rem] hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 relative overflow-hidden backdrop-blur-sm",
                index === 2
                  ? "bg-gradient-to-br from-[#FF5C10] to-[#FF740C] shadow-xl shadow-orange-500/20"
                  : "bg-white/80 hover:bg-white shadow-lg hover:shadow-xl"
              )}
            >
              {/* Background Decoration */}
              <div className="absolute inset-0 transition-opacity duration-300 opacity-10 group-hover:opacity-20">
                <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 blur-2xl" />
              </div>

              <div className="relative z-10 flex flex-col h-full ">
                {/* Profile Section */}
                <div className="flex flex-col items-center mb-5 sm:mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative w-16 h-16 mb-4 overflow-hidden border-4 border-white shadow-lg sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:mb-5"
                  >
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      priority
                    />
                  </motion.div>
                  <motion.h3
                    className={cn(
                      "text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2",
                      index === 2 ? "text-white" : "text-gray-800"
                    )}
                  >
                    {testimonial.name}
                  </motion.h3>
                  <motion.p
                    className={cn(
                      "text-sm sm:text-base font-medium",
                      index === 2 ? "text-white/80" : "text-gray-600"
                    )}
                  >
                    {testimonial.title}
                  </motion.p>
                </div>

                {/* Quote */}
                <div className="relative flex-grow">
                  <svg
                    className={cn(
                      "w-8 h-8 absolute -top-4 -left-1 opacity-20",
                      index === 2 ? "text-white" : "text-gray-400"
                    )}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 11H6C5.46957 11 4.96086 10.7893 4.58579 10.4142C4.21071 10.0391 4 9.53043 4 9V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H8C8.53043 5 9.03914 5.21071 9.41421 5.58579C9.78929 5.96086 10 6.46957 10 7M18 11H14C13.4696 11 12.9609 10.7893 12.5858 10.4142C12.2107 10.0391 12 9.53043 12 9V7C12 6.46957 12.2107 5.96086 12.5858 5.58579C12.9609 5.21071 13.4696 5 14 5H16C16.5304 5 17.0391 5.21071 17.4142 5.58579C17.7893 5.96086 18 6.46957 18 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p
                    className={cn(
                      "text-base sm:text-lg leading-relaxed",
                      index === 2 ? "text-white" : "text-gray-700"
                    )}
                  >
                    {testimonial.quote}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-[1148px] w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] absolute top-0 left-1/2 -translate-x-1/2 rounded-[50px] border-[0.5px] bg-gradient-to-b from-gray-50/80 to-white/50 backdrop-blur-xl"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(255,92,16,0.05)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(255,116,12,0.05)_0%,transparent_50%)]" />
      </div>
    </section>
  );
};

export default TestimonialSection;
