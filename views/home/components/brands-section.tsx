"use client";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface Brand {
  id: number;
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
}

const brands: Brand[][] = [
  [
    {
      id: 1,
      src: "/brands/adidas.png",
      width: 91,
      height: 51,
      alt: "Patagonia logo",
    },
    {
      id: 2,
      src: "/brands/bose.png",
      width: 88.89,
      height: 50,
      alt: "Bose logo",
    },
    {
      id: 3,
      src: "/brands/gnc.png",
      width: 64,
      height: 61,
      alt: "GNC logo",
    },
  ],
  [
    {
      id: 4,
      src: "/brands/adidas.png",
      width: 82.53,
      height: 59,
      alt: "Adidas logo",
    },
    {
      id: 5,
      src: "/brands/nike.png",
      width: 82.53,
      height: 59,
      alt: "Nike logo",
    },
    {
      id: 6,
      src: "/brands/nb.png",
      width: 114.67,
      height: 86,
      alt: "New Balance logo",
    },
  ],
  [
    {
      id: 7,
      src: "/brands/apple.png",
      width: 74.41,
      height: 74,
      alt: "Apple logo",
    },
    {
      id: 8,
      src: "/brands/amazon.png",
      width: 93.82,
      height: 36,
      alt: "Amazon logo",
    },
    {
      id: 9,
      src: "/brands/samsung.png",
      width: 106.23,
      height: 18,
      alt: "Samsung logo",
    },
  ],
  [
    {
      id: 10,
      src: "/brands/johnson.png",
      width: 121.33,
      height: 91,
      alt: "Johnson logo",
    },
    {
      id: 11,
      src: "/brands/puma.png",
      width: 86.39,
      height: 55,
      alt: "Puma logo",
    },
    {
      id: 12,
      src: "/brands/tommy.png",
      width: 78,
      height: 78,
      alt: "Tommy logo",
    },
  ],
  [
    {
      id: 13,
      src: "/brands/hp.png",
      width: 78,
      height: 78,
      alt: "HP logo",
    },
    {
      id: 14,
      src: "/brands/dell.png",
      width: 74,
      height: 74,
      alt: "Dell logo",
    },
    {
      id: 15,
      src: "/brands/walmart.png",
      width: 111.1,
      height: 21,
      alt: "Walmart logo",
    },
  ],
  [
    {
      id: 16,
      src: "/brands/gucci.png",
      width: 101.33,
      height: 76,
      alt: "Gucci logo",
    },
    {
      id: 17,
      src: "/brands/ralph.png",
      width: 131.56,
      height: 37,
      alt: "Ralph logo",
    },
    {
      id: 18,
      src: "/brands/jordan.png",
      width: 100,
      height: 75,
      alt: "Jordan logo",
    },
  ],
  [
    {
      id: 19,
      src: "/brands/rolex.png",
      width: 105.33,
      height: 79,
      alt: "Rolex logo",
    },
    {
      id: 20,
      src: "/brands/nestle.png",
      width: 92,
      height: 69,
      alt: "Nestle logo",
    },
    {
      id: 21,
      src: "/brands/ck.png",
      width: 60,
      height: 60,
      alt: "Calvin Klein logo",
    },
  ],
  [
    {
      id: 22,
      src: "/brands/blackCube.png",
      width: 57,
      height: 57,
      alt: "Black Cube logo",
    },
    {
      id: 23,
      src: "/brands/cerave.png",
      width: 110.14,
      height: 38,
      alt: "Cerave logo",
    },
    {
      id: 24,
      src: "/brands/beats.png",
      width: 88.89,
      height: 50,
      alt: "Beats logo",
    },
  ],
  [
    {
      id: 25,
      src: "/brands/gopro.png",
      width: 101.98,
      height: 43,
      alt: "GoPro logo",
    },
    {
      id: 26,
      src: "/brands/northface.png",
      width: 72,
      height: 72,
      alt: "North Face logo",
    },
    {
      id: 27,
      src: "/brands/levis.png",
      width: 85,
      height: 85,
      alt: "Levi's logo",
    },
  ],
  [
    {
      id: 28,
      src: "/brands/elf.png",
      width: 66.41,
      height: 46.93,
      alt: "Elf logo",
    },
    {
      id: 29,
      src: "/brands/paula.png",
      width: 85.2,
      height: 71,
      alt: "Paula's Choice logo",
    },
    {
      id: 30,
      src: "/brands/drunk.png",
      width: 78.9,
      height: 49,
      alt: "Drunk Elephant logo",
    },
  ],
];

const BrandsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative py-8 overflow-hidden sm:py-12 lg:py-16 xl:py-20"
    >
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
            Brands
          </p>
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="max-w-[90%] sm:max-w-[636px] w-full text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center title_md radial_text_gradient"
        >
          Shop from the US brands you love!
        </motion.h1>
      </motion.div>

      <motion.div variants={itemVariants} className="relative w-full">
        <Marquee className="[--gap:3px] sm:[--gap:4px] lg:[--gap:5px] xl:[--gap:7px]">
          <div className="w-full flex gap-[3px] sm:gap-[4px] lg:gap-[5px] xl:gap-[7px]">
            {brands.map((brandGroup, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col gap-y-[3px] sm:gap-y-[4px] lg:gap-y-[5px] xl:gap-y-[7px] even:mt-6 sm:even:mt-8 lg:even:mt-12 xl:even:mt-16"
              >
                {brandGroup.map((brand) => (
                  <motion.div
                    key={brand.id}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(0,0,0,0.05)",
                    }}
                    className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] xl:w-[127px] xl:h-[125px] flex items-center justify-center rounded-lg sm:rounded-xl lg:rounded-2xl bg-cloudGray hover:bg-cloudGray/90 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-center w-[80%] h-[80%]">
                      <Image
                        src={brand.src}
                        alt={brand.alt}
                        width={brand.width}
                        height={brand.height}
                        className={`w-auto h-auto max-w-[80%] max-h-[80%] object-contain transition-transform duration-300 hover:scale-110 ${
                          brand.className || ""
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </div>
        </Marquee>

        {/* Enhanced Gradient Overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[60px] sm:w-[80px] lg:w-[120px] xl:w-[150px] bg-gradient-to-r from-white via-white to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[60px] sm:w-[80px] lg:w-[120px] xl:w-[150px] bg-gradient-to-l from-white via-white to-transparent"></div>
      </motion.div>
    </motion.section>
  );
};

export default BrandsSection;
