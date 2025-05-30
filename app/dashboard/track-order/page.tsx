"use client";

import { useState } from "react";
import { trackOrder } from "@/lib/utils/service/track";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiCheckCircle,
  HiClock,
  HiTruck,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrackOrder = async (e: React.FormEvent) => {
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
    } catch (err) {
      setError("Failed to fetch tracking information");
      setTrackingInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Status card data
  const statusCards = trackingInfo
    ? [
        {
          label: "Payment Status",
          value: trackingInfo.is_paid ? "Paid" : "Pending",
          icon: trackingInfo.is_paid ? (
            <HiCheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <HiClock className="w-6 h-6 text-yellow-500" />
          ),
          bg: trackingInfo.is_paid
            ? "bg-green-50 border-green-200"
            : "bg-yellow-50 border-yellow-200",
          text: trackingInfo.is_paid ? "text-green-700" : "text-yellow-700",
        },
        {
          label: "Shipping Status",
          value: trackingInfo.is_shipped ? "Shipped" : "Processing",
          icon: trackingInfo.is_shipped ? (
            <HiTruck className="w-6 h-6 text-green-500" />
          ) : (
            <HiClock className="w-6 h-6 text-yellow-500" />
          ),
          bg: trackingInfo.is_shipped
            ? "bg-green-50 border-green-200"
            : "bg-yellow-50 border-yellow-200",
          text: trackingInfo.is_shipped ? "text-green-700" : "text-yellow-700",
        },
        {
          label: "Delivery Status",
          value: trackingInfo.is_received ? "Delivered" : "In Transit",
          icon: trackingInfo.is_received ? (
            <HiCheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <HiOutlineCheckCircle className="w-6 h-6 text-yellow-500" />
          ),
          bg: trackingInfo.is_received
            ? "bg-green-50 border-green-200"
            : "bg-yellow-50 border-yellow-200",
          text: trackingInfo.is_received ? "text-green-700" : "text-yellow-700",
        },
      ]
    : [];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-2 py-8 md:py-12 md:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-center text-gray-900 md:text-3xl">
          Track Your Order
        </h1>
        <div className="flex flex-col items-center gap-4 p-4 bg-white shadow-xl md:p-6 rounded-2xl md:gap-6">
          <form
            onSubmit={handleTrackOrder}
            className="flex flex-col w-full gap-3 md:flex-row md:gap-4"
          >
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter your tracking/order number"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent transition-all duration-200 text-base shadow-sm"
              required
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-8 py-3 bg-[#ff5c00] text-white rounded-lg hover:bg-[#ff2f0a] transition-colors whitespace-nowrap font-semibold shadow-md text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 mx-auto border-2 border-white rounded-full border-t-transparent"
                />
              ) : (
                "Track Order"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl p-4 mx-auto mt-6 text-center text-red-700 bg-red-100 rounded-lg shadow-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skeleton Loader */}
      <AnimatePresence mode="wait">
        {isLoading && !trackingInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-2xl mx-auto mt-8"
          >
            <div className="flex flex-col gap-6 p-4 bg-white shadow-xl rounded-2xl md:p-8 animate-pulse">
              <div className="flex flex-col gap-2 mb-2 md:flex-row md:items-center md:justify-between md:gap-0">
                <div className="w-32 h-6 mb-2 bg-gray-200 rounded"></div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map((_, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-100 border border-gray-200 rounded-xl"
                    >
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="w-20 h-3 bg-gray-200 rounded"></div>
                      <div className="w-16 h-4 mt-1 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="my-2 border-t border-gray-200"></div>
                <div className="grid grid-cols-1 text-sm text-gray-700 md:grid-cols-2 gap-x-8 gap-y-2">
                  {[...Array(8)].map((_, idx) => (
                    <div key={idx} className="flex justify-between py-1">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {trackingInfo && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-2xl p-0 mx-auto mt-8 md:p-0"
          >
            <div className="flex flex-col gap-6 p-4 bg-white shadow-xl rounded-2xl md:p-8">
              <div className="flex flex-col gap-2 mb-2 md:flex-row md:items-center md:justify-between md:gap-0">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl">
                  Order Status
                </h2>
                <span className="inline-block bg-[#ff5c00]/10 text-[#ff5c00] font-bold text-base md:text-lg px-4 py-1 rounded-full shadow-sm border border-[#ff5c00]/20 mt-2 md:mt-0">
                  {trackingInfo.id}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {statusCards.map((card, idx) => (
                    <motion.div
                      key={card.label}
                      whileHover={{
                        y: -2,
                        boxShadow: "0 4px 16px 0 rgba(0,0,0,0.06)",
                      }}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border ${card.bg} ${card.text} transition-all duration-200`}
                    >
                      <div>{card.icon}</div>
                      <div className="text-xs font-medium text-gray-500">
                        {card.label}
                      </div>
                      <div className="mt-1 text-base font-semibold">
                        {card.value}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="my-2 border-t border-gray-200"></div>
                <div className="grid grid-cols-1 text-sm text-gray-700 md:grid-cols-2 gap-x-8 gap-y-2">
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-gray-500">Order ID:</span>
                    <span>{trackingInfo.id}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-gray-500">User ID:</span>
                    <span>{trackingInfo.user}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-gray-500">
                      Resolved Order:
                    </span>
                    <span>
                      {trackingInfo.resolved_oxrder ??
                        trackingInfo.resolved_order ??
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-gray-500">Created:</span>
                    <span>
                      {trackingInfo.created_at
                        ? new Date(trackingInfo.created_at).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-gray-500">
                      Last Updated:
                    </span>
                    <span>
                      {trackingInfo.updated_at
                        ? new Date(trackingInfo.updated_at).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-gray-500">
                      Paid Time:
                    </span>
                    <span>
                      {trackingInfo.paid_time
                        ? new Date(trackingInfo.paid_time).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-gray-500">
                      Shipped Time:
                    </span>
                    <span>
                      {trackingInfo.shipped_time
                        ? new Date(trackingInfo.shipped_time).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-gray-500">
                      Received Time:
                    </span>
                    <span>
                      {trackingInfo.received_time
                        ? new Date(trackingInfo.received_time).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
