"use client";
import { motion } from "framer-motion";
import React from "react";
import ShippingCalculator from "./shipping-calculator";

const CtaSection = () => {
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

  return (
    <section
      className="overflow-hidden scroll-mt-[100px] py-40"
      id="calculator"
    >
      <div className="min-h-[500px] sm:min-h-[600px] w-full py-12 sm:py-16 lg:py-0 flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <ShippingCalculator />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
