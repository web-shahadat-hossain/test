"use client";
import React, { Suspense } from "react";
import { Heading } from "../cart/UI/Heading";
import { Button } from "../cart/UI/Button";
import ProductDetails from "./UI/ProductDetails";
import { useCartStore } from "@/lib/utils/cartStore";

export default function CheckoutSection() {
  const { cart, total } = useCartStore();
  const inTotal = Number(total) + 150;
  return (
    <>
      {" "}
      {/* checkout section */}{" "}
      <div className="flex w-full md:w-[30%] flex-col gap-6 ">
        {" "}
        <div className="flex flex-col gap-2 rounded-[10px] bg-[#f8fafc] p-4">
          {" "}
          <div className="flex flex-wrap items-center justify-between gap-5">
            {" "}
            <Heading
              size="heading5xl"
              as="h6"
              className="text-[22px] font-semibold"
            >
              {" "}
              Order Summary{" "}
            </Heading>{" "}
            {/* <Text
              size="text2xl"
              as="p"
              className="self-end text-[15px] font-light underline"
            >
              {" "}
              Edit{" "}
            </Text>{" "} */}
          </div>{" "}
          <div>
            {" "}
            <div>
              {" "}
              <div className="flex flex-col gap-2.5">
                {" "}
                <Suspense fallback={<div>Loading feed...</div>}>
                  {" "}
                  {cart.map((d, index) => (
                    <ProductDetails product={d} key={"checkoutThree" + index} />
                  ))}{" "}
                </Suspense>{" "}
              </div>{" "}
              <div className="relative z-[3] mt-[20px] flex flex-col gap-4">
                {" "}
                <div>
                  {" "}
                  <div className="flex flex-wrap items-center justify-between gap-5 py-1">
                    {" "}
                    <Heading as="p" className="text-[18px] font-normal">
                      {" "}
                      Shipping fee{" "}
                    </Heading>{" "}
                    <Heading as="p" className="text-[18px] font-medium">
                      {" "}
                      ৳ 150{" "}
                    </Heading>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="h-[0.5px] bg-[#374151]" />{" "}
                <div className="flex flex-wrap items-center justify-between gap-5 py-1">
                  {" "}
                  <Heading as="p" className="text-[18px] font-normal">
                    {" "}
                    TOTAL{" "}
                  </Heading>{" "}
                  <Heading
                    size="heading3xl"
                    as="p"
                    className="self-end text-[18px] font-semibold"
                  >
                    {" "}
                    ৳ {inTotal}
                  </Heading>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <Button className="self-stretch rounded-[14px] px-[34px] ">
          {" "}
          Submit & Proceed{" "}
        </Button>{" "}
      </div>{" "}
    </>
  );
}
