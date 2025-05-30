"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useCartStore } from "@/lib/utils/cartStore";
import { Product } from "@/types/product";
import { useUserRegion } from "@/lib/utils/useUserRegion";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({
  product,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");

  // ✅ Image fallback and formatting
  const images = Array.isArray(product.image)
    ? product.image.filter((img): img is string => img !== undefined)
    : [product.image];
  const colors = product.color || [];
  const { addToCart } = useCartStore();

  const rawSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const showSizeSection = rawSizes.length > 0;

  const handleAdd = () => {
    if (!product.price) {
      toast.error("Product price missing!");
      return;
    }

    if (colors.length > 0 && !selectedColor) {
      toast.error("Please select a color.");
      return;
    }

    addToCart({
      product: product,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      price: Number(product.price),
    });

    toast.success("Product added to cart");
  };

  return (
    <div className="min-h-screen py-40 bg-gray-50/50">
      <div className="container px-4 mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/products")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Products
          </button>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Product Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            {/* Thumbnails */}
            <div className="flex flex-col gap-4">
              {images.map(
                (image, index) =>
                  image && (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-gray-900"
                          : "border-gray-200 hover:border-gray-900"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title || product.name} - View ${
                          index + 1
                        }`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  )
              )}
            </div>

            {/* Main Image */}
            <div className="flex-1 p-8 bg-white rounded-3xl">
              <div className="relative aspect-square">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.title || product.name}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h2 className="text-lg text-gray-500">{product.name}</h2>
              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                {product.title || product.name}
              </h1>
            </div>

            <p className="text-2xl font-semibold text-gray-900">
              ${product.price}
            </p>

            <div>
              <h3 className="mb-3 font-medium text-gray-900">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Color Options */}
            {colors.length > 0 && (
              <div>
                <h3 className="mb-3 font-medium text-gray-900">Colors</h3>
                <div className="flex gap-3">
                  {colors.map((color: string, index: number) => (
                    <div
                      onClick={() => setSelectedColor(color)}
                      key={index}
                      className={`w-8 h-8 border-2 rounded-full shadow-md cursor-pointer transition-transform hover:scale-110 ${
                        selectedColor === color
                          ? "ring-2 ring-gray-900"
                          : "border-white"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {showSizeSection && (
              <div>
                <h3 className="mb-3 font-medium text-gray-900">Select Size</h3>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {rawSizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-sm font-medium rounded-xl border transition-all ${
                        selectedSize === size
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 text-gray-900 hover:border-gray-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="mb-3 font-medium text-gray-900">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors border border-gray-200 rounded-full hover:border-gray-900 hover:text-gray-900"
                >
                  -
                </button>
                <span className="w-12 font-medium text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors border border-gray-200 rounded-full hover:border-gray-900 hover:text-gray-900"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              className="w-full py-4 text-white transition-colors bg-[#FF5C00] rounded-xl hover:bg-orange-400"
            >
              Add to Cart
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
