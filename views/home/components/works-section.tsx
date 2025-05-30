"use client";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const Step = ({ step, className }: { step: string; className?: string }) => (
  <motion.div
    className={cn(
      "sm:size-[51px] size-[40px] bg-[url(/images/bgOverlayBlur.png)] bg-no-repeat bg-center bg-cover rounded-full z-10 center my-4 sm:my-6",
      className
    )}
    style={{
      boxShadow:
        "inset 0 0 0 2px rgba(255, 255, 255, 0.5), 0px 4px 14px 0 rgba(0, 0, 0, 0.4)",
    }}
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <p className="sm:text-[30px]/[23.9px] text-[18px]/[13.9px] tracking-[-2%] font-extrabold">
      {step}
    </p>
  </motion.div>
);

const ImageBox = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <motion.div
    className={cn("w-full lg:w-1/2 center px-4 sm:px-6", className)}
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div className="lg:w-[213px] sm:w-[190px] w-full max-w-[280px] lg:h-[137px] sm:h-[124px] h-[180px] rounded-[20px] overflow-hidden shadow-lg">
      <Image
        src={src}
        alt={alt}
        width={280}
        height={180}
        className="object-cover w-full h-full"
      />
    </div>
  </motion.div>
);

const TextBox = ({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) => (
  <motion.div
    className={cn("max-w-[439px] w-full px-4 sm:px-6", className)}
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <h4 className="lg:text-[40px] sm:text-[30px] text-[24px] leading-[106%] tracking-[-4%] font-semibold lg:mb-[25px] sm:mb-[18px] mb-[15px] text-center lg:text-left">
      {title}
    </h4>
    <p className="sm:text-[15px]/[120.2%] text-[14px]/[140%] text-[#272727] font-medium text-center lg:text-left">
      {description}
    </p>
  </motion.div>
);

const WorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <section className="py-10 sm:py-16 lg:py-20 scroll-mt-[100px]" id="track">
      <div className="max-w-[1158px] w-full mx-auto">
        {/* section header */}
        <motion.div
          className="flex-col px-4 mb-12 sm:mb-16 lg:mb-24 xl:mb-28 center gap-y-4 sm:gap-y-6 lg:gap-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={itemVariants}
            className="w-[120px] h-[40px] sm:w-[136px] sm:h-[44px] lg:w-[160px] lg:h-[52px] bg-white center rounded-full"
            style={{
              boxShadow:
                "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p className="text-base sm:text-lg lg:text-xl font-medium text-[#44484F]">
              Workflow
            </p>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="max-w-[90%] sm:max-w-[636px] w-full text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center title_md radial_text_gradient"
          >
            How AmericaToBD works
          </motion.h1>
        </motion.div>

        {/* content */}
        <motion.div
          ref={ref}
          className="w-[100%] relative mx-auto px-4 lg:space-y-0 space-y-12 sm:space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="block lg:hidden absolute top-0 left-1/2 -translate-x-1/2 h-[95%] w-[2px] border-l-2 border-dashed border-[#A7A7A7] opacity-30 -z-10"></div>

          {/* col-1 */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-between w-full lg:flex-row lg:gap-x-0 gap-y-4 sm:gap-x-10 gap-x-4"
          >
            <ImageBox src="/Workflow-img/img1.jpg" alt="Login and URL paste" />
            {/* shapes */}
            {/* for tab and mobile */}
            <div className="center">
              <Step step="1" className="flex lg:hidden shrink-0" />
            </div>
            {/* for desktop */}
            <div className="hidden lg:block relative translate-x-[20%] translate-y-[40%]">
              <Step step="1" className="absolute" />
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width={88}
                height={219}
                viewBox="0 0 88 219"
                fill="none"
                className="translate-x-[20%] translate-y-[10%] z-10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <path
                  d="M50.6777 217.35C86.3639 171.141 126.5 63.3122 1.55532 1.67271"
                  stroke="#A7A7A7"
                  strokeWidth="2.40903"
                  strokeLinecap="round"
                  strokeDasharray="7.23 7.23"
                />
              </motion.svg>
            </div>
            <div className="w-full lg:w-1/2">
              <TextBox
                title="Log In & Paste the Product URL"
                description="Once logged in, paste the link in search bar"
              />
            </div>
          </motion.div>

          {/* col-2 */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col-reverse w-full lg:flex-row lg:mt-20 lg:gap-x-0 gap-y-4 sm:gap-x-10 gap-x-4"
          >
            <div className="flex justify-end w-full lg:w-1/2 lg:pr-5">
              <TextBox
                title="Submit your request for preview"
                description="After pasting, submit your request. That will be sent to our admin"
              />
            </div>
            {/* shapes */}
            <div className="center">
              <Step step="2" className="flex lg:hidden shrink-0" />
            </div>
            <div className="hidden lg:block">
              <Step
                step="2"
                className="relative translate-x-[20%] translate-y-[25%]"
              />
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width={62}
                height={211}
                viewBox="0 0 62 211"
                fill="none"
                className="translate-x-[-20%] translate-y-[-5%] z-10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <path
                  d="M60.5283 209.382C20.4071 175.292 -39.242 86.0902 43.1309 1.99987"
                  stroke="#A7A7A7"
                  strokeWidth="2.40903"
                  strokeLinecap="round"
                  strokeDasharray="7.23 7.23"
                />
              </motion.svg>
            </div>
            <ImageBox
              src="/Workflow-img/img2.jpg"
              alt="Submit preview request"
              className="lg:w-[45%] w-full center items-start"
            />
          </motion.div>

          {/* col-3 */}
          <motion.div
            variants={itemVariants}
            className="w-full flex flex-col lg:flex-row lg:translate-y-[-40px] lg:gap-x-0 gap-y-4 sm:gap-x-10 gap-x-4"
          >
            <ImageBox
              src="/Workflow-img/img3.jpg"
              alt="Admin approval"
              className="items-start w-full lg:w-1/2 center"
            />
            {/* shapes */}
            <div className="center">
              <Step step="3" className="flex lg:hidden shrink-0" />
            </div>
            <div className="flex-grow hidden lg:block">
              <Step
                step="3"
                className="relative translate-x-[25%] translate-y-[15%]"
              />
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width={62}
                height={211}
                viewBox="0 0 62 211"
                fill="none"
                className="translate-x-[50%] translate-y-[0%] z-10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <path
                  d="M1.94826 209.382C42.0694 175.292 101.719 86.0902 19.3457 1.99987"
                  stroke="#A7A7A7"
                  strokeWidth="2.40903"
                  strokeLinecap="round"
                  strokeDasharray="7.23 7.23"
                />
              </motion.svg>
            </div>

            <div className="w-full lg:w-1/2">
              <TextBox
                title="Admin approves & Confirms the order"
                description="Our admin team evaluates your request & verifies the details"
                className="pl-0 lg:pl-12"
              />
            </div>
          </motion.div>

          {/* col-4 */}
          <motion.div
            variants={itemVariants}
            className="w-full flex flex-col-reverse lg:flex-row lg:translate-y-[-50px] lg:gap-x-0 gap-y-4 sm:gap-x-10 gap-x-4"
          >
            <div className="flex justify-end w-full lg:w-1/2 lg:pr-5">
              <TextBox
                title="We Purchase & Handle International Shipping"
                description="After pasting, submit your request. That will be sent to our admin"
              />
            </div>

            {/* shape */}
            <div className="center">
              <Step step="4" className="flex lg:hidden shrink-0" />
            </div>
            <div className="flex-grow hidden lg:block">
              <Step
                step="4"
                className="relative translate-x-[45%] translate-y-[-5%]"
              />
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width={62}
                height={211}
                viewBox="0 0 62 211"
                fill="none"
                className="translate-x-[-20%] translate-y-[-5%] z-10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <path
                  d="M60.5283 209.382C20.4071 175.292 -39.242 86.0902 43.1309 1.99987"
                  stroke="#A7A7A7"
                  strokeWidth="2.40903"
                  strokeLinecap="round"
                  strokeDasharray="7.23 7.23"
                />
              </motion.svg>
            </div>
            <ImageBox
              src="/Workflow-img/img4.jpg"
              alt="International shipping"
              className="items-start w-full lg:w-1/2 center"
            />
          </motion.div>

          {/* col-5 */}
          <motion.div
            variants={itemVariants}
            className="w-full flex flex-col lg:flex-row lg:translate-y-[-90px] lg:gap-x-0 gap-y-4 sm:gap-x-10 gap-x-4"
          >
            <ImageBox
              src="/Workflow-img/img5.jpg"
              alt="Local delivery"
              className="items-start w-full lg:w-1/2 center"
            />
            {/* shape */}
            <div className="center">
              <Step step="5" className="flex lg:hidden shrink-0" />
            </div>
            <div className="flex-grow hidden lg:block">
              <Step
                step="5"
                className="relative translate-x-[30%] translate-y-[0%]"
              />
            </div>

            <div className="w-full lg:w-1/2 lg:pl-14">
              <TextBox
                title="Delivered to your door in Bangladesh"
                description="Our admin team evaluates your request & verifies the details"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WorksSection;
