"use client";
import Image from "next/image";
import React from "react";
import IconInstagram from "../icon/icon-instagram";
import IconFacebook from "../icon/icon-facebook";
import IconLinkedin from "../icon/icon-linkedin";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
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
        damping: 10,
      },
    },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="relative overflow-hidden bg-white "
    >
      <div className="px-4 pt-8 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:pt-12 lg:pt-16">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:gap-0">
          {/* Contact and Payment Info */}
          <motion.div variants={itemVariants} className="flex-1">
            <h5 className="text-xl sm:text-2xl lg:text-[25px] font-bold text-black uppercase tracking-wide">
              americatobd.com
            </h5>
            <motion.p
              whileHover={{ scale: 1.02 }}
              className="mt-3 sm:mt-4 lg:mt-[14px] mb-6 sm:mb-8 lg:mb-12 text-lg sm:text-xl lg:text-[25px] font-normal text-black"
            >
              support@americatobd.com
            </motion.p>

            <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-9">
              {[
                {
                  src: "/footer-img/visa.png",
                  alt: "Visa",
                  width: 78,
                  height: 56,
                },
                {
                  src: "/footer-img/mastercard.png",
                  alt: "Mastercard",
                  width: 95,
                  height: 56,
                },
                {
                  src: "/footer-img/americanexp.png",
                  alt: "American Express",
                  width: 86,
                  height: 59,
                },
                {
                  src: "/footer-img/paypal.png",
                  alt: "PayPal",
                  width: 84,
                  height: 56,
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="w-16 sm:w-20 lg:w-[78px] h-auto"
                >
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={card.width}
                    height={card.height}
                    className="w-full h-auto"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex lg:flex-col gap-6 lg:gap-[26px] order-first lg:order-none"
          >
            {[
              { icon: <IconInstagram />, href: "" },
              { icon: <IconFacebook />, href: "" },
              { icon: <IconLinkedin />, href: "" },
            ].map((social, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={social.href}
                  className="transition-opacity hover:opacity-80"
                >
                  {social.icon}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Warehouse Location */}
        {/* <motion.p
          variants={itemVariants}
          className="max-w-[288px] w-full mt-8 sm:mt-12 lg:mt-[62px] text-lg sm:text-xl lg:text-[25px] font-normal text-black leading-tight"
        >
          Warehouse location here
        </motion.p> */}

        {/* Copyright and Links */}
        <motion.div
          variants={itemVariants}
          className="mt-12 sm:mt-16 lg:mt-[140px] pb-8 sm:pb-12 lg:pb-16"
        >
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end sm:gap-0">
            <motion.div whileHover={{ scale: 1.02 }}>
              <p className="text-base sm:text-lg lg:text-[18px] mb-2 sm:mb-3 text-gray-600">
                copyright
              </p>
              <p className="text-lg sm:text-xl lg:text-[25px] font-normal text-black">
                <span className="font-bold">
                  <Link
                    href="https://faarns.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blazeOrange"
                  >
                    @ {new Date().getFullYear()} FAARNS.
                  </Link>
                </span>{" "}
                All rights reserved
              </p>
            </motion.div>

            <div className="text-lg sm:text-xl lg:text-[25px] font-bold text-black flex flex-col sm:flex-row gap-2 sm:gap-4">
              {[
                { text: "Privacy Policy", href: "/privacy-policy" },
                { text: "Terms & Conditions", href: "/terms-and-conditions" },
              ].map((link, index) => (
                <React.Fragment key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={link.href}
                      target="_blank"
                      // rel="noopener noreferrer"
                      className="transition-colors hover:text-blazeOrange"
                    >
                      {link.text}
                    </Link>
                  </motion.div>
                  {index === 0 && <span className="hidden sm:inline">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Logo */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden cursor-pointer group"
      >
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "linear",
          }}
          whileHover={{
            transition: { duration: 30 },
          }}
          className="w-[200%] flex relative"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="w-full transform-gpu"
          >
            <Image
              src="/footer-logo/footerLogo.png"
              alt="Footer Logo"
              width={1553}
              height={484}
              className="object-cover w-full h-auto transition-all duration-300"
              priority
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="w-full transform-gpu"
          >
            <Image
              src="/footer-logo/footerLogo.png"
              alt="Footer Logo"
              width={1553}
              height={484}
              className="object-cover w-full h-auto transition-all duration-300"
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
