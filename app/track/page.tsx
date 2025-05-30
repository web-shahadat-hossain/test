"use client";

import { useState } from "react";

import { trackOrder } from "@/lib/utils/service/track";

import { toast } from "react-hot-toast";

interface TrackingInfo {
  id: number;
  is_paid: boolean;
  is_shipped: boolean;
  is_received: boolean;
  created_at: string;
  updated_at: string;
  resolved_order: number;
  user: number;
}

export default function TrackOrderPage() {
  const [trackingId, setTrackingId] = useState("");
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await trackOrder(trackingId);
      setTrackingInfo(data);
    } catch (err) {
      setError("Failed to fetch tracking information");
      setTrackingInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="container max-w-3xl px-4 mx-auto">
        <div className="p-8 bg-white shadow-sm rounded-xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Track Your Order
          </h1>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID"
                className="flex-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#FF4B26] focus:outline-none focus:ring-1 focus:ring-[#FF4B26]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63D1A] disabled:opacity-50 text-sm font-medium transition-colors"
              >
                {isLoading ? "Tracking..." : "Track"}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {trackingInfo && (
            <div className="p-6 rounded-lg bg-gray-50">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Order Status
              </h2>
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
                <div className="pt-4 mt-4 border-t border-gray-200">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
