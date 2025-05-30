"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/utils/service/product"; // ✅ Import getProducts
import { useUserRegion } from "@/lib/utils/useUserRegion";

// animation variants
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

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();

  return (
    <motion.div
      variants={itemVariants}
      onClick={() => router.push(`/products/${product.id}`)}
      className="p-6 transition-all duration-300 bg-white shadow-sm cursor-pointer rounded-3xl hover:shadow-md"
    >
      <div className="flex flex-col gap-4">
        <div className="text-sm text-gray-500">{product.category}</div>
        <h3 className="text-base font-medium text-gray-900">
          {product.title || product.name}
        </h3>
        <div className="flex items-center justify-center bg-white aspect-square">
          <img
            src={product.image?.[0] ?? "/placeholder.png"}
            alt={product.name}
            className=" w-[100%] h-[300px]"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">৳{product.price}</span>
          <div className="flex -space-x-1">
            {(product.color ?? []).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 border-2 border-white rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductSkeleton = () => (
  <div className="p-6 bg-white shadow-sm rounded-3xl">
    <div className="flex flex-col gap-4">
      <Skeleton className="w-16 h-4" />
      <Skeleton className="w-24 h-5" />
      <Skeleton className="aspect-square rounded-xl" />
      <div className="flex items-center justify-between">
        <Skeleton className="w-16 h-6" />
        <div className="flex -space-x-1">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-4 h-4 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

const ProductSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { countryCode, loading: regionLoading } = useUserRegion();

  // Debug logs for region detection
  console.log("[ProductSection] countryCode:", countryCode);
  console.log("[ProductSection] regionLoading:", regionLoading);

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

  if (regionLoading) return null; // or a loader if you want

  if (countryCode !== "BD") {
    return (
      // <div className="flex flex-col items-center justify-center py-16">
      //   <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-yellow-800">
      //     <svg
      //       className="w-5 h-5 text-yellow-600"
      //       fill="none"
      //       stroke="currentColor"
      //       strokeWidth="2"
      //       viewBox="0 0 24 24"
      //     >
      //       <path
      //         strokeLinecap="round"
      //         strokeLinejoin="round"
      //         d="M13 16h-1v-4h-1m1-4h.01M12 20.5C6.201 20.5 1.5 15.799 1.5 10S6.201-.5 12-.5 22.5 4.201 22.5 10 17.799 20.5 12 20.5z"
      //       />
      //     </svg>
      //     Select your region to see products:
      //   </div>
      //   <div className="flex gap-2">
      //     <button
      //       className="flex items-center gap-1 px-4 py-2 font-semibold text-white transition bg-green-600 border-2 border-green-700 rounded-lg shadow-sm hover:bg-green-700"
      //       onClick={() => {
      //         localStorage.setItem("regionOverride", "BD");
      //         window.location.reload();
      //       }}
      //     >
      //       <span role="img" aria-label="Bangladesh">
      //         🇧🇩
      //       </span>{" "}
      //       Bangladesh
      //     </button>
      //     <button
      //       className="flex items-center gap-1 px-4 py-2 font-semibold text-white transition bg-blue-600 border-2 border-blue-700 rounded-lg shadow-sm hover:bg-blue-700"
      //       onClick={() => {
      //         localStorage.setItem("regionOverride", "US");
      //         window.location.reload();
      //       }}
      //     >
      //       <span role="img" aria-label="United States">
      //         🇺🇸
      //       </span>{" "}
      //       United States
      //     </button>
      //   </div>
      // </div>
      <></>
    );
  }

  return (
    <section
      id="product-section"
      className="py-8 sm:py-12 lg:py-16 xl:py-20 bg-gray-50/50"
    >
      {/* section header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center mb-16 sm:mb-20 lg:mb-24 xl:mb-28 gap-y-4 sm:gap-y-6 lg:gap-y-8"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-[120px] h-[40px] sm:w-[136px] sm:h-[44px] lg:w-[160px] lg:h-[52px] bg-white flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <p className="text-base font-medium text-gray-700 sm:text-lg lg:text-xl">
            Products
          </p>
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="max-w-[90%] sm:max-w-[636px] w-full text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center title_md radial_text_gradient py-2"
        >
          See What People are buying
        </motion.h1>
      </motion.div>

      {/* card content */}
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array(4)
                .fill(null)
                .map((_, index) => <ProductSkeleton key={index} />)
            : products
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
