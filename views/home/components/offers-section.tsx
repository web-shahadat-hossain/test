"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const OffersSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="py-8 overflow-hidden sm:py-12 lg:py-16 xl:py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        {/* section header */}
        <motion.div
          variants={itemVariants}
          className="flex-col mb-16 sm:mb-20 lg:mb-24 xl:mb-28 center gap-y-4 sm:gap-y-6 lg:gap-y-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-[120px] h-[40px] sm:w-[136px] sm:h-[44px] lg:w-[160px] lg:h-[52px] bg-white center rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <p className="text-base font-medium text-gray-700 sm:text-lg lg:text-xl">
              Offers
            </p>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="max-w-[90%] sm:max-w-[636px] w-full text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center title_md radial_text_gradient"
          >
            US Products, Hassle-Free to Bangladesh.
          </motion.h1>
        </motion.div>

        {/* Slider */}
        <motion.div variants={itemVariants} className="mt-10 sm:mt-14 lg:mt-16">
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView="auto"
            spaceBetween={20}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 1.5,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 2.5,
                spaceBetween: 45,
              },
            }}
            className="!overflow-visible"
          >
            {/* Image Slides */}
            <SwiperSlide className="!w-full sm:!w-[450px] lg:!w-[591px]">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="w-full h-[250px] sm:h-[350px] lg:h-[451px] rounded-[30px] sm:rounded-[50px] lg:rounded-[80px] bg-[url('/images/slide-1.png')] bg-center bg-no-repeat bg-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </SwiperSlide>

            {/* Content Slides */}
            <SwiperSlide className="!w-full sm:!w-[350px] lg:!w-[424px]">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-[250px] sm:h-[350px] lg:h-[451px] rounded-[30px] sm:rounded-[50px] lg:rounded-[80px] bg-gradient-to-br from-[#FF740C] to-[#FF5C10] p-6 sm:p-8 lg:p-10 isolate overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="absolute top-0 left-6 sm:left-8 lg:left-10 text-[80px] sm:text-[100px] lg:text-[150px] font-bold bg-clip-text text-transparent bg-gradient-to-b from-white/20 to-white/10 z-10">
                  01
                </h3>

                <div className="relative z-20 flex flex-col gap-3 mt-10 text-left sm:gap-4 lg:gap-5 sm:mt-14 lg:mt-20">
                  <div className="relative">
                    <h4 className="text-xl sm:text-2xl lg:text-[35px] leading-[1.1] font-semibold text-white">
                      Impossible to Ship? We Make It Possible.
                    </h4>
                  </div>

                  <p className="text-sm font-light leading-relaxed sm:text-base text-white/90">
                    Shipping from the USA to Bangladesh is tough—many items are
                    restricted, get held at customs, or arrive damaged. We
                    specialize in handling those &ldquo;hard-to-ship&ldquo;
                    products, ensuring smooth delivery and full compliance with
                    local regulations.
                  </p>

                  <div className="w-full sm:w-[300px] lg:w-[338px] h-[4px] bg-white/30 rounded-full mt-auto">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "69.5%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-[4px] bg-white rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>

            {/* Repeat slides for loop */}
            <SwiperSlide className="!w-full sm:!w-[450px] lg:!w-[591px]">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="w-full h-[250px] sm:h-[350px] lg:h-[451px] rounded-[30px] sm:rounded-[50px] lg:rounded-[80px] bg-[url('/images/slide-1.png')] bg-center bg-no-repeat bg-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </SwiperSlide>

            <SwiperSlide className="!w-full sm:!w-[350px] lg:!w-[424px]">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-[250px] sm:h-[350px] lg:h-[451px] rounded-[30px] sm:rounded-[50px] lg:rounded-[80px] bg-gradient-to-br from-[#FF740C] to-[#FF5C10] p-6 sm:p-8 lg:p-10 isolate overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="absolute top-0 left-6 sm:left-8 lg:left-10 text-[80px] sm:text-[100px] lg:text-[150px] font-bold bg-clip-text text-transparent bg-gradient-to-b from-white/20 to-white/10 z-10">
                  02
                </h3>

                <div className="relative z-20 flex flex-col gap-3 mt-10 text-left sm:gap-4 lg:gap-5 sm:mt-14 lg:mt-20">
                  <div className="relative">
                    <h4 className="text-xl sm:text-2xl lg:text-[35px] leading-[1.1] font-semibold text-white">
                      Impossible to Ship? We Make It Possible.
                    </h4>
                  </div>

                  <p className="text-sm font-light leading-relaxed sm:text-base text-white/90">
                    Shipping from the USA to Bangladesh is tough—many items are
                    restricted, get held at customs, or arrive damaged. We
                    specialize in handling those &ldquo;hard-to-ship&ldquo;
                    products, ensuring smooth delivery and full compliance with
                    local regulations.
                  </p>

                  <div className="w-full sm:w-[300px] lg:w-[338px] h-[4px] bg-white/30 rounded-full mt-auto">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "69.5%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-[4px] bg-white rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>

            <SwiperSlide className="!w-full sm:!w-[450px] lg:!w-[591px]">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="w-full h-[250px] sm:h-[350px] lg:h-[451px] rounded-[30px] sm:rounded-[50px] lg:rounded-[80px] bg-[url('/images/slide-1.png')] bg-center bg-no-repeat bg-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </SwiperSlide>
          </Swiper>

          {/* Pagination Only */}
          <div className="flex items-center justify-center mt-6 sm:mt-8">
            <div className="swiper-pagination"></div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .swiper-pagination {
          position: relative;
          bottom: 0;
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: center;
        }
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d9d9d9;
          opacity: 1;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          width: 12px;
          height: 12px;
          background: #ff740c;
        }
      `}</style>
    </motion.section>
  );
};

export default OffersSection;
