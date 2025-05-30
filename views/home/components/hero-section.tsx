"use client";
import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useAnimation,
  useSpring,
} from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserRegion } from "../../../lib/utils/useUserRegion";
import { trackOrder } from "@/lib/utils/service/track";
import toast from "react-hot-toast";
import ProductSliderPopup from "./ProductSliderPopup";
import MobileProductSlider from "./MobileProductSlider";

// Add type definitions at the top
type TabId = "shop" | "track" | "ship";

type TabContentType = {
  [K in TabId]: {
    title: string;
    placeholder: string;
    buttonText: string;
  };
};

const TabContent: TabContentType = {
  shop: {
    title: "Enter the Product Link to Send for Approval",
    placeholder: "Paste Product URL Here (e.g., nike.com/air-max-90)",
    buttonText: "Search",
  },
  track: {
    title: "Track Your Order Status",
    placeholder: "Enter your order/tracking number",
    buttonText: "Track Now",
  },
  ship: {
    title: "Calculate Shipping Cost",
    placeholder: "Enter product weight in kg",
    buttonText: "Calculate",
  },
};

const HeroSection = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("shop");
  const [inputValue, setInputValue] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [productDetails, setProductDetails] = useState({
    productLink: "",
    quantity: "1",
    details: "",
    withBox: false,
  });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { scrollY } = useScroll();
  const controls = useAnimation();
  const { countryCode, loading: regionLoading } = useUserRegion();

  // track code state
  const [orderNumber, setOrderNumber] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast.error("Please enter a tracking/order number");
      return;
    }
    setIsLoading(true);
    setError(null);
    setTrackingInfo(null);
    try {
      const data = await trackOrder(orderNumber);

      setTrackingInfo(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to fetch tracking information");
      setTrackingInfo(null);
    } finally {
      setIsLoading(false);
    }
  };
  // Manual region switcher for development
  const isDev =
    typeof window !== "undefined" && process.env.NODE_ENV !== "production";
  const [regionOverride, setRegionOverride] = useState<string | null>(
    typeof window !== "undefined"
      ? localStorage.getItem("regionOverride")
      : null
  );

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      localStorage.setItem("regionOverride", value);
    } else {
      localStorage.removeItem("regionOverride");
    }
    setRegionOverride(value || null);
    window.location.reload();
  };

  // Reset input value when tab changes
  useEffect(() => {
    setInputValue("");
    setShowProductForm(false);
  }, [activeTab]);

  // Smooth scroll transformations with spring physics
  const smoothY1 = useSpring(useTransform(scrollY, [0, 500], [0, 50]), {
    stiffness: 100,
    damping: 30,
  });
  const smoothY2 = useSpring(useTransform(scrollY, [0, 500], [0, -50]), {
    stiffness: 100,
    damping: 30,
  });
  const smoothOpacity1 = useSpring(useTransform(scrollY, [0, 300], [1, 0.7]), {
    stiffness: 100,
    damping: 30,
  });
  const smoothOpacity2 = useSpring(useTransform(scrollY, [0, 300], [1, 0.8]), {
    stiffness: 100,
    damping: 30,
  });

  // Floating animation variants with smoother transitions
  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const floatVariants2 = {
    initial: { y: 0 },
    animate: {
      y: [0, 10, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      },
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [isInView, controls]);

  // 1. Define tabs array based on region
  const tabs = regionLoading
    ? [
        { id: "shop" as TabId, label: "Shop" },
        { id: "track" as TabId, label: "Track your order" },
        { id: "ship" as TabId, label: "Ship" },
      ]
    : countryCode === "US"
    ? [
        { id: "ship" as TabId, label: "Ship" },
        { id: "track" as TabId, label: "Track your order" },
      ]
    : [
        { id: "shop" as TabId, label: "Shop" },
        { id: "track" as TabId, label: "Track your order" },
        // { id: "ship" as TabId, label: "Ship" },
      ];

  // Debug logs
  console.log("countryCode:", countryCode);
  console.log("regionLoading:", regionLoading);
  console.log("tabs:", tabs);
  console.log("activeTab:", activeTab);

  // 2. Effect to reset activeTab if not in tabs
  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [activeTab, tabs]);

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

  // Add new animation variants for tabs
  const tabContainerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  // Simplified tab animations for smoother transitions
  const tabItemVariants = {
    initial: { opacity: 0.7, y: 0 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: 0.2,
      },
    },
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the product form submission here
    console.log("Product Details:", productDetails);
    // Reset form and go back to main view
    setShowProductForm(false);
    setProductDetails({
      productLink: "",
      quantity: "1",
      details: "",
      withBox: false,
    });
  };

  const handleSubmit = () => {
    if (activeTab === "track") {
      // For tracking, use the handleTrack function regardless of region
      handleTrack(new Event("submit") as any);
      return;
    }

    if (countryCode === "US") {
      // For US users, pass input as desc, not url
      const encodedDesc = encodeURIComponent(inputValue);
      router.push(`/bd/manual-request?desc=${encodedDesc}`);
      return;
    }

    switch (activeTab) {
      case "shop":
        // Navigate to manual request page with the URL
        const encodedUrl = encodeURIComponent(inputValue);
        router.push(`/bd/manual-request?url=${encodedUrl}`);
        break;
      case "ship":
        // Handle shipping calculation
        console.log("Weight for shipping:", inputValue);
        break;
    }
  };

  const guaranteeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // const [showProductPopup, setShowProductPopup] = useState(true);

  return (
    <section className="w-full   pt-0 md:py-20 bg-[#F8F9FB] relative overflow-hidden">
      <MobileProductSlider />

      <div className="px-4 pt-0 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:pt-0">
        {/* Product Popup for US users */}
        {countryCode !== "US" && <ProductSliderPopup />}

        {/* Manual region switcher for development */}
        {isDev && (
          <div
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
          >
            <label style={{ marginRight: 8 }}>
              Region override: {regionOverride || "Auto"}
              {countryCode && ` (Detected: ${countryCode})`}
            </label>
            <select onChange={handleRegionChange} value={regionOverride || ""}>
              <option value="">Auto</option>
              <option value="US">US</option>
              <option value="BD">Bangladesh</option>
            </select>
          </div>
        )}
        <motion.div
          ref={ref}
          className="relative flex flex-col items-center justify-center w-full"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={guaranteeVariants}
            whileHover="hover"
            className="relative inline-flex items-center justify-center p-2 mx-auto mb-6 bg-white rounded-full shadow-xl cursor-pointer sm:mb-8 md:mb-10 group"
          >
            <div className="flex items-center px-4 py-1">
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mr-2 text-[#FF4B26] text-xl"
              >
                ✨
              </motion.span>
              <p className="text-sm sm:text-base md:text-lg lg:text-[20px] leading-normal lg:leading-[28px] text-black text-center font-medium group-hover:text-[#FF4B26] transition-colors duration-300">
                100% Money-back guaranteed
              </p>
            </div>
            <motion.div
              className="absolute inset-0 rounded-full bg-[#FF4B26]/5 -z-10"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Title */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-[1161px] mt-4 sm:mt-6 lg:mt-8 px-4"
          >
            <h1 className="pb-2 text-2xl font-bold leading-tight text-center sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl radial_text_gradient sm:pb-4 sm:leading-normal">
              The choice of U.S. Imports to Bangladesh
            </h1>
          </motion.div>

          {/* Search */}
          <motion.div
            variants={itemVariants}
            className="w-full mt-8 sm:mt-12 lg:mt-16"
          >
            <div className="w-full max-w-[844px] mx-auto px-4">
              {/* Tabs with refined styling */}
              <motion.div
                className="relative z-10 grid items-center justify-center w-full grid-cols-2 gap-2 px-2 mb-4 sm:flex sm:flex-row sm:gap-6 sm:px-0"
                variants={tabContainerVariants}
                initial="initial"
                animate="animate"
              >
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variants={tabItemVariants}
                    className={`
                      relative px-3 sm:px-6 py-2 sm:py-3
                      rounded-xl w-full ${
                        tab.id === "ship" ? "col-span-2 sm:col-span-1" : ""
                      }
                      transition-all duration-200 ease-out
                      ${
                        activeTab === tab.id
                          ? "bg-white shadow-md"
                          : "bg-transparent hover:bg-white/50"
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-0 sm:gap-2">
                      <span className="text-base sm:text-xl">
                        {tab.id === "shop" && "🛍️"}
                        {tab.id === "track" && "📦"}
                        {tab.id === "ship" && "🚢"}
                      </span>
                      <span
                        className={`
                          whitespace-normal sm:whitespace-nowrap text-xs sm:text-base font-medium
                          ${
                            activeTab === tab.id
                              ? "text-[#FF4B26]"
                              : "text-gray-700"
                          }
                        `}
                      >
                        {tab.label}
                      </span>
                    </div>
                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute -bottom-2 sm:-bottom-4 left-1/2 w-1 h-1 bg-[#FF4B26] rounded-full"
                        layoutId="activeTabIndicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        style={{ transform: "translateX(-50%)" }}
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>

              {/* Content box with updated styling */}
              <motion.div
                className={`
                  w-full bg-white rounded-2xl shadow-sm p-4 sm:p-8
                  ${activeTab === "track" ? "max-w-[800px] mx-auto" : ""}
                `}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {showProductForm ? (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Product Details
                    </h2>
                    <form
                      onSubmit={handleProductFormSubmit}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Product link
                          </label>
                          <input
                            type="text"
                            value={productDetails.productLink}
                            onChange={(e) =>
                              setProductDetails((prev) => ({
                                ...prev,
                                productLink: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4B26]"
                            placeholder="Enter your product URL"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={productDetails.quantity}
                            onChange={(e) =>
                              setProductDetails((prev) => ({
                                ...prev,
                                quantity: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4B26]"
                            placeholder="Tell us how many you want..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Product Details
                          </label>
                          <textarea
                            value={productDetails.details}
                            onChange={(e) =>
                              setProductDetails((prev) => ({
                                ...prev,
                                details: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4B26]"
                            rows={4}
                            placeholder="Product Details Ex: product color, size etc."
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Provide as much information about the product as you
                            can, so that we can buy the correct item.
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">
                              With Box?
                            </label>
                            <div
                              onClick={() =>
                                setProductDetails((prev) => ({
                                  ...prev,
                                  withBox: !prev.withBox,
                                }))
                              }
                              className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                                productDetails.withBox
                                  ? "bg-[#FF4B26]"
                                  : "bg-gray-200"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                                  productDetails.withBox
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            Choosing the with box option will increase the
                            weight charge and add extra shipping costs based on
                            product size.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between space-x-4">
                        <button
                          type="button"
                          onClick={() => setShowProductForm(false)}
                          className="px-6 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 text-white bg-[#FF4B26] rounded-lg hover:bg-[#ff3c1a] transition-colors"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <>
                    {/* Track Order Content */}
                    {activeTab === "track" && (
                      <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                          Track Your Order Status
                        </h2>
                        <form onSubmit={handleTrack} className="relative">
                          <input
                            type="text"
                            placeholder="Enter your order/tracking number"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF4B26] transition-colors text-sm sm:text-base"
                          />
                          <button
                            type="submit"
                            disabled={!orderNumber.trim() || isLoading}
                            className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 bg-[#FF4B26] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-[#ff3c1a] transition-colors text-sm sm:text-base"
                          >
                            Track Now
                          </button>
                        </form>
                        {!trackingInfo && (
                          <p className="text-xs text-center text-gray-500 sm:text-sm">
                            Enter your tracking number to get real-time updates
                            on your order status
                          </p>
                        )}

                        {error && (
                          <div className="max-w-xl p-4 mx-auto mb-6 text-red-700 bg-red-100 rounded-lg">
                            {error}
                          </div>
                        )}
                        {trackingInfo && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto"
                          >
                            <div className="p-8 bg-white shadow-xl rounded-3xl">
                              <div className="pb-8 mb-8 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                      Order #{trackingInfo.id}
                                    </h2>
                                    <p className="mt-1 text-gray-600">
                                      Created:{" "}
                                      {new Date(
                                        trackingInfo.created_at
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                                    {trackingInfo.is_received
                                      ? "Delivered"
                                      : trackingInfo.is_shipped
                                      ? "In Transit"
                                      : "Processing"}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">
                                    Payment Status:
                                  </span>
                                  <span
                                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                                      trackingInfo.is_paid
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {trackingInfo.is_paid ? "Paid" : "Pending"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">
                                    Shipping Status:
                                  </span>
                                  <span
                                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                                      trackingInfo.is_shipped
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {trackingInfo.is_shipped
                                      ? "Shipped"
                                      : "Processing"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">
                                    Delivery Status:
                                  </span>
                                  <span
                                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                                      trackingInfo.is_received
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {trackingInfo.is_received
                                      ? "Delivered"
                                      : "In Transit"}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  <p>Order ID: {trackingInfo.id}</p>
                                  <p>
                                    Created:{" "}
                                    {new Date(
                                      trackingInfo.created_at
                                    ).toLocaleString()}
                                  </p>
                                  <p>
                                    Last Updated:{" "}
                                    {new Date(
                                      trackingInfo.updated_at
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Shop Content */}
                    {activeTab === "shop" && (
                      <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                          {TabContent.shop.title}
                        </h2>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder={TabContent.shop.placeholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF4B26] transition-colors text-sm sm:text-base"
                          />
                          <button
                            onClick={handleSubmit}
                            className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 bg-[#FF4B26] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-[#ff3c1a] transition-colors text-sm sm:text-base"
                          >
                            {TabContent.shop.buttonText}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Ship Content */}
                    {activeTab === "ship" && (
                      <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                          {countryCode === "US"
                            ? "Drop your product info for a quote"
                            : TabContent.ship.title}
                        </h2>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder={
                              countryCode === "US"
                                ? "Drop your product info"
                                : TabContent.ship.placeholder
                            }
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF4B26] transition-colors text-sm sm:text-base"
                          />
                          <button
                            onClick={handleSubmit}
                            className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 bg-[#FF4B26] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-[#ff3c1a] transition-colors text-sm sm:text-base"
                          >
                            {countryCode === "US"
                              ? "Submit"
                              : TabContent.ship.buttonText}
                          </button>
                        </div>
                        {/* Only show minimum weight for non-US */}
                        {countryCode !== "US" && (
                          <p className="text-xs text-gray-500 sm:text-sm">
                            Minimum weight: 0.5 kg
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative icons with enhanced animations */}
          <div className="absolute inset-0 hidden overflow-hidden pointer-events-none md:block">
            {/* Shop Icon */}
            <motion.div
              style={{ y: smoothY1, opacity: smoothOpacity1 }}
              variants={floatVariants}
              initial="initial"
              animate={controls}
              className="absolute top-[40px] md:left-[5%] lg:left-[10%] xl:left-[15%]"
            >
              <svg
                width="65"
                height="65"
                viewBox="0 0 65 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[45px] h-[45px] md:w-[55px] md:h-[55px] xl:w-[65px] xl:h-[65px]"
              >
                <rect
                  width="65"
                  height="65"
                  rx="16"
                  fill="#FF4B26"
                  fillOpacity="0.1"
                />
                {/* Modern shopping cart icon */}
                <path
                  d="M20 22L24 23L26.5 35C26.7 36.2 27.8 37 29 37H39C40.1 37 41.1 36.3 41.4 35.2L43.9 26.5C44.3 25 43.1 23.5 41.5 23.5H26"
                  stroke="#FF4B26"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="29" cy="43" r="2" fill="#FF4B26" />
                <circle cx="39" cy="43" r="2" fill="#FF4B26" />
              </svg>
            </motion.div>

            {/* Track Icon */}
            <motion.div
              style={{ y: smoothY2, opacity: smoothOpacity2 }}
              variants={floatVariants2}
              initial="initial"
              animate={controls}
              className="absolute top-[240px] md:left-[2%] lg:left-[5%] xl:left-[7%]"
            >
              <svg
                width="65"
                height="65"
                viewBox="0 0 65 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[45px] h-[45px] md:w-[55px] md:h-[55px] xl:w-[65px] xl:h-[65px]"
              >
                <rect
                  width="65"
                  height="65"
                  rx="16"
                  fill="#FF4B26"
                  fillOpacity="0.1"
                />
                {/* Modern tracking/globe icon */}
                <circle
                  cx="32.5"
                  cy="32.5"
                  r="12"
                  stroke="#FF4B26"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="1 3"
                />
                <path
                  d="M32.5 20.5V44.5M20.5 32.5H44.5"
                  stroke="#FF4B26"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="32.5" cy="32.5" r="3" fill="#FF4B26" />
              </svg>
            </motion.div>

            {/* Ship Icon */}
            <motion.div
              style={{ y: smoothY2, opacity: smoothOpacity1 }}
              variants={floatVariants2}
              initial="initial"
              animate={controls}
              className="absolute top-[40px] md:right-[5%] lg:right-[10%] xl:right-[15%]"
            >
              <svg
                width="65"
                height="65"
                viewBox="0 0 65 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[45px] h-[45px] md:w-[55px] md:h-[55px] xl:w-[65px] xl:h-[65px]"
              >
                <rect
                  width="65"
                  height="65"
                  rx="16"
                  fill="#FF4B26"
                  fillOpacity="0.1"
                />
                {/* Modern shipping/plane icon */}
                <path
                  d="M20 32.5L26 35L32.5 25L39 35L45 32.5"
                  stroke="#FF4B26"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M32.5 25V40"
                  stroke="#FF4B26"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="32.5" cy="25" r="2" fill="#FF4B26" />
              </svg>
            </motion.div>

            {/* Calculate Icon */}
            <motion.div
              style={{ y: smoothY1, opacity: smoothOpacity2 }}
              variants={floatVariants}
              initial="initial"
              animate={controls}
              className="absolute top-[240px] md:right-[2%] lg:right-[5%] xl:right-[7%]"
            >
              <svg
                width="65"
                height="65"
                viewBox="0 0 65 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[45px] h-[45px] md:w-[55px] md:h-[55px] xl:w-[65px] xl:h-[65px]"
              >
                <rect
                  width="65"
                  height="65"
                  rx="16"
                  fill="#FF4B26"
                  fillOpacity="0.1"
                />
                {/* Modern calculator/cost icon */}
                <rect
                  x="25"
                  y="22"
                  width="15"
                  height="21"
                  rx="2"
                  stroke="#FF4B26"
                  strokeWidth="2"
                />
                <path
                  d="M28 28H37M28 33H37M28 38H37"
                  stroke="#FF4B26"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
