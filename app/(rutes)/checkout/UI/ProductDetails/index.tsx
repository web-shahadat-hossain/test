import { Heading } from "@/app/(rutes)/cart/UI/Heading";
import { Img } from "@/app/(rutes)/cart/UI/Img";
import { Text } from "@/app/(rutes)/cart/UI/Text";
import { CartItem } from "@/lib/utils/cartStore";
import React from "react";

interface Props {
  product: CartItem;
}

export default function ProductDetails({ product }: Props) {
  return (
    <div className="flex flex-col self-stretch gap-1.5 flex-1">
      {/* Top border line */}
      <div className="h-[0.5px] w-full self-stretch bg-gray-700_01" />

      {/* Product Info Row */}
      <div className="flex items-center gap-3.5 self-stretch">
        {/* Product Image */}
        {product && (
          <Img
            src={product.product?.image?.[0] || "/default.png"} // ✅ Safe access with fallback
            width={94}
            isStatic
            height={106}
            alt="Image"
            className="h-[106px] w-[30%] rounded-[5px] object-contain"
          />
        )}

        {/* Product Details */}
        <div className="flex flex-1 flex-col gap-0.5">
          <div className="flex flex-col items-start justify-center">
            {product && (
              <Heading
                as="p"
                className="w-full text-[18px] font-medium leading-[21px]"
              >
                {product.product?.name}
              </Heading>
            )}
            {product && (
              <Text size="text2xl" as="p" className="text-[16px] font-light">
                Color: {product.color || "N/A"}
              </Text>
            )}
          </div>

          {/* Quantity and Price */}
          <div className="flex flex-wrap items-center justify-between gap-5">
            {product.quantity && (
              <Heading as="p" className="text-[18px] font-medium">
                Qty: {product.quantity}
              </Heading>
            )}
            {product && (
              <Heading
                size="heading3xl"
                as="p"
                className="self-end text-[18px] font-semibold"
              >
                ৳ {Number(product.product?.price) * product.quantity}
              </Heading>
            )}
          </div>
        </div>
      </div>

      {/* Bottom border line */}
      <div className="h-[0.2px] self-stretch bg-blue_gray-400" />
    </div>
  );
}
