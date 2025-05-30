"use client";
import React, { useState, useEffect } from "react";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { Img } from "./Img";
import { Product } from "@/types/product";
import { useCartStore } from "@/lib/utils/cartStore";

interface Props {
  item: {
    product: Product;
    color?: string;
    size?: string;
    quantity: number;
    price: number;
  };
  editIcon?: string;
  likeIcon?: string;
}

export default function ProductDetail({ item }: Props) {
  const { product, color, size, quantity, price } = item;
  const [qty, setQty] = useState<number>(quantity);

  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCartStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setQty(quantity);
  }, [quantity]);

  const handleIncrease = () => {
    increaseQuantity(item);
    setQty((q) => q + 1);
  };

  const handleDecrease = () => {
    if (qty > 1) {
      decreaseQuantity(item);
      setQty((q) => q - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-[#EDF1F4] py-4 px-10 rounded-[10px] relative">
      {/* Image and Info */}
      <div className="flex items-center gap-4 md:flex-1">
        <Img
          src={product.image?.[0] || "default.png"}
          width={94}
          isStatic
          height={106}
          alt={product.name}
          className="h-[106px] w-[94px] rounded-[5px] object-contain"
        />
        <div className="flex flex-col gap-1">
          <Heading className="text-[18px] font-medium">{product.name}</Heading>
          <Text className="text-[16px] font-light">
            Color: {color || "N/A"}
          </Text>
          {size && <Text className="text-[16px] font-light">Size: {size}</Text>}
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex justify-center ml-[85px] pt-2 gap-3 md:hidden">
        <Heading className="text-[16px] font-semibold">৳ {price * qty}</Heading>
        <div className="flex items-center gap-2 md:w-[140px] justify-end">
          <button
            onClick={handleDecrease}
            className="bg-[#FF5C00] text-white px-3 py-1 rounded-[8px]"
          >
            -
          </button>
          <span className="text-[18px] font-bold">{qty}</span>
          <button
            onClick={handleIncrease}
            className="bg-[#FF5C00] text-white px-3 py-1 rounded-[8px]"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-red-500 hover:underline text-sm cursor-pointer"
          >
            <Img
              src="img_thumbs_up_gray_800_02.svg"
              width={20}
              height={22}
              alt="Like"
            />
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <Heading className="text-[20px] font-semibold hidden md:block">
        ৳ {price * qty}
      </Heading>

      <div className="md:flex items-center gap-2 md:w-[140px] justify-end hidden">
        <button
          onClick={handleDecrease}
          className="bg-[#FF5C00] text-white px-3 py-1 rounded-[8px]"
        >
          -
        </button>
        <span className="text-[18px] font-bold">{qty}</span>
        <button
          onClick={handleIncrease}
          className="bg-[#FF5C00] text-white px-3 py-1 rounded-[8px]"
        >
          +
        </button>
      </div>

      <div className="hidden md:flex items-center gap-4 ml-[50px]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-red-500 hover:underline text-sm cursor-pointer"
        >
          <Img
            src="img_thumbs_up_gray_800_02.svg"
            width={20}
            height={22}
            alt="Like"
          />
        </button>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white shadow-2xl rounded-lg p-6 w-[300px]">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Do you really want to remove this item from your cart? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
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
