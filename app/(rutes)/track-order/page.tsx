"use client";

import { useState } from "react";
import { trackOrder } from "@/lib/utils/service/track";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FiPackage } from "react-icons/fi";

export default function TrackOrder() {
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

  return (
    <div className="min-h-screen py-52 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto mb-16 text-center"
        >
          <motion.div className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-white rounded-full shadow-lg">
            <FiPackage className="w-10 h-10 text-gray-900" />
          </motion.div>
          <motion.h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Track Your Order
          </motion.h1>
          <motion.p className="text-lg text-gray-600">
            Enter your order number to track your package
          </motion.p>
        </motion.div>
        <motion.div className="max-w-xl mx-auto mb-16">
          <form onSubmit={handleTrack} className="relative">
            <div className="flex items-center gap-4 p-2 bg-white shadow-lg rounded-2xl">
              <div className="flex items-center flex-1 gap-3 px-4">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter order number"
                  className="w-full py-3 text-lg bg-transparent focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!orderNumber.trim() || isLoading}
                className="px-8 py-3 font-medium text-white transition-all bg-gray-900 rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed hover:shadow-lg"
              >
                {isLoading ? "Tracking..." : "Track"}
              </button>
            </div>
          </form>
        </motion.div>
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
                      {new Date(trackingInfo.created_at).toLocaleString()}
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
                  <span className="text-gray-600">Payment Status:</span>
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
                  <span className="text-gray-600">Shipping Status:</span>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      trackingInfo.is_shipped
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {trackingInfo.is_shipped ? "Shipped" : "Processing"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery Status:</span>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      trackingInfo.is_received
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {trackingInfo.is_received ? "Delivered" : "In Transit"}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Order ID: {trackingInfo.id}</p>
                  <p>
                    Created:{" "}
                    {new Date(trackingInfo.created_at).toLocaleString()}
                  </p>
                  <p>
                    Last Updated:{" "}
                    {new Date(trackingInfo.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
