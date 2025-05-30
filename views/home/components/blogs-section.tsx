"use client";
import IconArrowRightUp from "@/components/icon/icon-arrowRightUp";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  description: React.ReactNode;
  imageUrl: string;
  altText: string;
  reverse?: boolean;
  index: number;
}

const blogsData = [
  {
    title: "Access to US products",
    description: (
      <>
        Shop from well-known American brands that are hard to find in
        Bangladesh, including Nike, Adidas, Amazon, and{" "}
        <span className="text-[#FF5E0F] font-semibold">more</span>
      </>
    ),
    imageUrl: "/images/blog-1.png",
    altText: "blog-1",
  },
  {
    title: "Hassle-Free Process",
    description:
      "Simply paste the product link, and we'll take care of the approval, shipping, and delivery process.",
    imageUrl: "/images/blog-2.png",
    altText: "blog-2",
  },
  {
    title: "Customer-Centric Support",
    description:
      "Our customer service team is here to help at every step, ensuring a smooth and pleasant shopping experience.",
    imageUrl: "/images/blog-3.png",
    altText: "blog-3",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const BlogCard = ({
  title,
  description,
  imageUrl,
  altText,
  reverse,
  index,
}: BlogCardProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center`}
    >
      {!reverse && (
        <motion.div
          className="blog-image w-full order-1 overflow-hidden rounded-lg h-full"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={imageUrl}
            alt={altText}
            width={662}
            height={365}
            className="w-full h-auto object-cover rounded-lg transform transition-transform duration-300 hover:scale-105"
            priority
          />
        </motion.div>
      )}
      <div className="blog-content order-2 lg:order-1">
        <motion.h3
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[44.86px] font-bold mb-3 sm:mb-4 lg:mb-6 radial_text_gradient leading-tight"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-[30px] mt-4 sm:mt-6  mb-4 sm:mb-6  leading-relaxed lg:leading-[45px] text-gray-700"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>
        <ReadMoreButton />
      </div>
      {reverse && (
        <motion.div
          className="blog-image w-full order-1 overflow-hidden rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={imageUrl}
            alt={altText}
            width={662}
            height={365}
            className="w-full h-auto object-cover rounded-lg transform transition-transform duration-300 hover:scale-105"
            priority
          />
        </motion.div>
      )}
    </motion.div>
  );
};

const ReadMoreButton = () => (
  <motion.button
    className="w-[140px] sm:w-[160px] lg:w-[200px] h-[40px] sm:h-[44px] lg:h-[50px] border center gap-2 rounded-[17px] hover:scale-105 transition-all duration-300 bg-white"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    style={{
      boxShadow: "2px 2px 0 0px rgba(191, 54, 0, 1)",
    }}
  >
    <Link href="/blog/1">
      <span className="text-sm sm:text-base lg:text-[20px] font-medium text-[#FF6E09]">
        Read More
      </span>
    </Link>
    <IconArrowRightUp color="#FF6E09" />
  </motion.button>
);

const BlogsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="py-8 sm:py-10 md:py-16 mx-auto max-w-[1200px] lg:py-20 px-4 sm:px-6 md:px-8 lg:px-[50px]"
    >
      {/* Section Header */}
      <motion.div
        className="mb-16 sm:mb-20 lg:mb-24 xl:mb-28 center flex-col gap-y-4 sm:gap-y-6 lg:gap-y-8"
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
            Blogs
          </p>
        </motion.div>
        <motion.h1 className="max-w-[90%] sm:max-w-[636px] w-full text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center title_md radial_text_gradient">
          Discover Our Latest Updates
        </motion.h1>
      </motion.div>

      {/* Blogs Grid */}
      <div className="space-y-12 sm:space-y-16 md:space-y-24 lg:space-y-[120px]">
        {blogsData.map((blog, index) => (
          <BlogCard
            key={index}
            {...blog}
            index={index}
            reverse={index % 2 !== 0}
          />
        ))}
        <motion.div
          className="center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="w-[110px] sm:w-[120px] md:w-[140px] h-[36px] sm:h-[40px] md:h-[44px] bg-linear-to-b from-[#FF740C] to-[#FF5C00] center gap-2 rounded-[17px] hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: "0 2px 0 0px rgba(191, 54, 0, 1)",
            }}
          >
            <span className="text-white text-sm sm:text-base md:text-lg lg:text-[20px] font-medium">
              Load more
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BlogsSection;
