"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { getProducts } from "@/lib/utils/service/product"; // path adjust করো

// ডায়নামিক প্রোডাক্ট ফেচ ফাংশন

export default function MobileProductSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data);
    })();
  }, []);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % products.length);
  };

  // if (products.length === 0) {
  //   return <div className="py-6 text-center text-gray-500">Loading....</div>;
  // }

  const scrollToProductSection = () => {
    if (typeof window !== "undefined") {
      const section = document.getElementById("product-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      onClick={scrollToProductSection}
      className="relative block px-5 border-t border-[#ffac7f] mb-10  md:hidden  w-full  mx-auto  shadow-md bg-white"
    >
      {/* Slide Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {products.map((item, index) => (
          <div
            key={index}
            className="flex items-center flex-shrink-0 w-full gap-4 p-4 px-10"
          >
            <img
              src={item.image?.[0] || "https://via.placeholder.com/150"}
              alt={item.name}
              className="w-[40px] h-[40px] object-cover rounded-md"
            />
            <h2 className="mt-2 text-[12px] text-center font-semibold text-gray-800">
              {item.name}
            </h2>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-[#ff6d1980] bg-opacity-50 hover:bg-opacity-80 text-white rounded-full w-8 h-8 flex items-center justify-center"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#ff6d196f] bg-opacity-50 hover:bg-opacity-80 text-white rounded-full w-8 h-8 flex items-center justify-center"
      >
        ›
      </button>
    </div>
  );
}
