"use client";

import Slider from "react-slick";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getProducts } from "@/lib/utils/service/product"; // path adjust করো
import { Product } from "@/types/product";

export default function ProductSliderPopup() {
  const [show, setShow] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute left-[-20px] top-1/2 transform -translate-y-1/2">
        <ul className="flex flex-col items-center space-y-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 transition duration-300 bg-orange-400 rounded-full opacity-50 custom-dot" />
    ),
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (!show || loading || !products.length) return null;
  console.log(products);

  const scrollToProductSection = () => {
    if (typeof window !== "undefined") {
      const section = document.getElementById("product-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  return (
    <>
      <style>
        {`
          .slick-dots li.slick-active div.custom-dot {
            background-color: #FF4B26;
            opacity: 1;
          }
        `}
      </style>

      <div
        className="fixed z-50 hidden md:block  p-4 bg-white border border-orange-200 shadow-lg  top-40 right-5 w-60 rounded-2xl"
        style={{
          boxShadow: "0 4px 24px rgba(255,75,38,0.08)",
        }}
      >
        <button
          className="absolute text-gray-400 top-2 right-2 hover:text-gray-700"
          onClick={() => setShow(false)}
        >
          ×
        </button>

        <Slider {...settings}>
          {products.map((product: Product, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={scrollToProductSection}
              className="  min-h-[120px] flex flex-col justify-center items-center text-center"
            >
              <p className="text-xs text-gray-500 mb-1">{product.category}</p>
              <h3 className=" text-[12px] font-bold mb-2">{product.name}</h3>
              <img
                src={product.image?.[0] ?? "/placeholder.png"}
                alt={product.name}
                className="object-contain w-[30px] h-[30px] mx-auto"
              />
              <span className="text-xs font-semibold text-orange-600 mt-1">
                ৳{product.price}
              </span>
            </motion.div>
          ))}
        </Slider>
      </div>
    </>
  );
}
