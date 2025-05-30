"use client";
import React, { Suspense, useState } from "react";
import ProductDetail from "./UI/ProductDetail";
import { Img } from "./UI/Img";
import { useCartStore } from "@/lib/utils/cartStore";

export default function CartSection() {
  const { cart, clearCart } = useCartStore();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setIsClearModalOpen(false);
  };

  return (
    <div className="flex md:flex-1 flex-col gap-1 relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-5 rounded-[10px] bg-[#EDF1F4] px-[22px] py-3.5">
        <p>All {cart.length} item(s)</p>
        <button onClick={() => setIsClearModalOpen(true)}>
          <Img
            src="img_thumbs_up.svg"
            width={20}
            height={22}
            alt="Thumbsup"
            className="h-[22px] w-[20px] cursor-pointer"
          />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex flex-col gap-1">
        <Suspense fallback={<div>Loading cart...</div>}>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <ProductDetail key={`cartItem-${index}`} item={item} />
            ))
          ) : (
            <div className="text-center text-gray-500 py-6">
              Your cart is empty.
            </div>
          )}
        </Suspense>
      </div>

      {/* Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white shadow-2xl rounded-lg p-6 w-[300px]">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Do you really want to clear all items from your cart? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
