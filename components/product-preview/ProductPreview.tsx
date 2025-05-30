"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";

interface ProductVariant {
  color?: string;
  size?: string;
  style?: string;
  storage?: string;
}

interface ProductDetails {
  title: string;
  price: string;
  images: string[];
  description: string;
  platform: string;
  variants: ProductVariant[];
  availability: string;
  rating?: string;
  reviewCount?: string;
  seller?: string;
  brand?: string;
  category?: string;
  shipping?: string;
  lastUpdated: string;
  specifications: Record<string, string>;
}

interface ProductPreviewProps {
  url: string;
  onClose: () => void;
  onContinue: () => void;
}

// Create a client-side only component
const ProductPreview = ({ url, onClose, onContinue }: ProductPreviewProps) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null
  );
  // const [setImageError] = useState(false);

  // Real-time update interval (every 30 seconds)
  const UPDATE_INTERVAL = 30000;

  // Only run after component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchProductDetails = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/fetch-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }

      const data = await response.json();

      // Compare with previous data for price changes
      if (productDetails && data.price !== productDetails.price) {
        toast.success(`Price updated to ${data.price}`);
      }

      // Compare availability changes
      if (productDetails && data.availability !== productDetails.availability) {
        toast(`Availability updated: ${data.availability}`, {
          icon: "ℹ️",
        });
      }

      setProductDetails(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("Unable to fetch product details. Please try again.");
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  }, [url, productDetails]);

  // Initial fetch
  useEffect(() => {
    if (!mounted) return;
    if (url) {
      fetchProductDetails();
    }
  }, [url, mounted, fetchProductDetails]);

  // Set up real-time updates
  useEffect(() => {
    if (!mounted || !url) return;

    const intervalId = setInterval(fetchProductDetails, UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [mounted, url, fetchProductDetails]);

  // const handleImageError = () => {
  //   setImageError(true);
  // };

  // Don't render anything until mounted on client
  if (!mounted) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-2xl p-8 mx-4 bg-white rounded-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF4B26] border-t-transparent"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-2xl p-8 mx-4 bg-white rounded-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center text-red-500">
              <p className="text-lg font-semibold">Error</p>
              <p className="mt-2">{error}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={onContinue}
                className="px-4 py-2 text-white bg-[#FF4B26] rounded-lg hover:bg-[#ff3c1a]"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productDetails) return null;

  const hasVariants = productDetails.variants?.some(
    (v) => v.color || v.size || v.style || v.storage
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-8 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Product Preview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Last updated:{" "}
                {new Date(productDetails.lastUpdated).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Left Column - Image */}
            <div className="w-full md:w-1/2">
              <div className="sticky top-0">
                {productDetails.images[0] ? (
                  <div className="relative aspect-square">
                    <Image
                      src={productDetails.images[0]}
                      alt={productDetails.title}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center bg-gray-100 rounded-lg aspect-square">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="w-full space-y-6 md:w-1/2">
              {/* Basic Info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-[#FF4B26]/10 text-[#FF4B26] rounded text-sm font-medium">
                    {productDetails.platform}
                  </span>
                  {productDetails.brand && (
                    <span className="px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded">
                      {productDetails.brand}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                  {productDetails.title}
                </h3>
              </div>

              {/* Price and Availability */}
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-[#FF4B26]">
                    {productDetails.price}
                  </p>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      productDetails.availability
                        ?.toLowerCase()
                        .includes("in stock")
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {productDetails.availability}
                  </span>
                </div>
                {productDetails.shipping && (
                  <p className="mt-2 text-sm text-gray-600">
                    {productDetails.shipping}
                  </p>
                )}
              </div>

              {/* Variants */}
              {hasVariants && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="mb-3 font-medium text-gray-900">
                    Selected Options
                  </h4>
                  <div className="space-y-2">
                    {productDetails.variants.map((variant, index) => (
                      <div key={index} className="space-y-2">
                        {variant.color && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Color:</span>
                            <span className="font-medium">{variant.color}</span>
                          </div>
                        )}
                        {variant.size && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Size:</span>
                            <span className="font-medium">{variant.size}</span>
                          </div>
                        )}
                        {variant.style && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Style:</span>
                            <span className="font-medium">{variant.style}</span>
                          </div>
                        )}
                        {variant.storage && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Storage:</span>
                            <span className="font-medium">
                              {variant.storage}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seller Info */}
              {productDetails.seller && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Sold by:{" "}
                    <span className="font-medium">{productDetails.seller}</span>
                  </p>
                </div>
              )}

              {/* Rating */}
              {productDetails.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-yellow-400">
                    <span className="text-sm font-medium">
                      {productDetails.rating}
                    </span>
                  </div>
                  {productDetails.reviewCount && (
                    <span className="text-sm text-gray-500">
                      ({productDetails.reviewCount})
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Description
                </h4>
                <p className="text-sm text-gray-600 line-clamp-4">
                  {productDetails.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={onContinue}
                  className="w-full px-6 py-3 text-white bg-[#FF4B26] rounded-lg hover:bg-[#ff3c1a] transition-colors"
                >
                  Continue with this product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export as a client-side only component
export default dynamic(() => Promise.resolve(ProductPreview), {
  ssr: false,
});
