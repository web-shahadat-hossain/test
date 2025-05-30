"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import IconCaretDown from "@/components/icon/icon-caret-down";

interface FAQ {
  question: string;
  answer: string;
}

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
      stiffness: 100,
      damping: 15,
    },
  },
};

const FaqSection = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch("/api/faq");
        if (!response.ok) {
          throw new Error("Failed to fetch FAQs");
        }
        const data = await response.json();
        setFaqs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <section className="py-8 overflow-hidden sm:py-12 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-[1161px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-[50px]">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5E0F]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 overflow-hidden sm:py-12 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-[1161px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-[50px]">
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 overflow-hidden sm:py-12 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1161px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-[50px]">
        <motion.div
          className="flex flex-col gap-6 lg:flex-row lg:gap-12 xl:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Section texts */}
          <motion.div
            className="max-w-[570px] w-full lg:sticky lg:top-24 lg:self-start"
            variants={itemVariants}
          >
            <motion.div
              className="inline-block mb-4 sm:mb-6 lg:mb-8"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-[120px] h-[40px] sm:w-[136px] sm:h-[44px] lg:w-[160px] lg:h-[52px] bg-white center rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-gray-50">
                <p className="text-base sm:text-lg lg:text-xl font-medium text-[#465967]">
                  FAQs
                </p>
              </div>
            </motion.div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-left leading-[1.2] tracking-tight">
              Your Questions{" "}
              <span className="text-[#FF5E0F] inline-block">Answered!</span>
            </h1>
            <p className="max-w-[401px] w-full text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700 mt-4 sm:mt-6 lg:mt-8 leading-relaxed">
              Got Questions About Product Requests, Shipping, or Payments? Find
              All the Answers Right Here in Our FAQs
            </p>
          </motion.div>

          {/* FAQs */}
          <motion.div
            className="flex-grow max-w-[640px] w-full"
            variants={containerVariants}
          >
            {faqs.map(({ question, answer }, index) => (
              <motion.div
                key={index}
                className={cn(
                  "cursor-pointer rounded-xl sm:rounded-2xl mb-3 sm:mb-4 lg:mb-5",
                  "p-3 sm:p-4 lg:p-5",
                  "transition-all duration-300",
                  "hover:shadow-lg hover:bg-white/90",
                  "border border-gray-100",
                  selectedIndex === index
                    ? "bg-white shadow-lg"
                    : "bg-transparent"
                )}
                onClick={() =>
                  setSelectedIndex(selectedIndex === index ? null : index)
                }
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.div
                    className={cn(
                      "flex-shrink-0 transition duration-300 ease-in-out",
                      "text-gray-600",
                      index === selectedIndex && "rotate-180 text-[#FF5E0F]"
                    )}
                    animate={{ rotate: index === selectedIndex ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconCaretDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                  <p
                    className={cn(
                      "text-sm sm:text-base lg:text-lg font-medium leading-relaxed",
                      "transition-colors duration-300",
                      index === selectedIndex
                        ? "text-[#FF5E0F]"
                        : "text-gray-900"
                    )}
                  >
                    {question}
                  </p>
                </div>
                {/* answer */}
                <AnimatePresence>
                  {index === selectedIndex && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: {
                          duration: 0.4,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        },
                        opacity: { duration: 0.3 },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pl-6 pr-2 mt-3 text-xs leading-relaxed text-gray-600 whitespace-pre-line sm:text-sm lg:text-base sm:pl-8 sm:pr-4">
                        {answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
