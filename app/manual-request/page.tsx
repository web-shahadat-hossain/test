"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import ProductPreview from "@/components/product-preview/ProductPreview";

export default function ManualRequest() {
  const [url, setUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      setShowPreview(true);
    }
  };

  const handleContinue = () => {
    // TODO: Implement the next step of the process
    console.log("Continuing with product:", url);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />

      <div className="max-w-4xl px-4 mx-auto py-96 mt-60">
        <div className="p-6 bg-white rounded-lg shadow-sm md:p-8">
          <h1 className="mb-6 text-2xl font-semibold text-gray-900">
            Manual Product Request
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="product-url"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Product URL
              </label>
              <input
                id="product-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter Amazon or eBay product URL"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4B26] focus:border-transparent outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-[#FF4B26] text-white rounded-lg hover:bg-[#ff3c1a] transition-colors"
            >
              Preview Product
            </button>
          </form>
        </div>
      </div>

      {showPreview && (
        <ProductPreview
          url={url}
          onClose={() => setShowPreview(false)}
          onContinue={handleContinue}
        />
      )}
    </main>
  );
}
