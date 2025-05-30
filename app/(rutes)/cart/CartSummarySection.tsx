"use client";
import React from "react";
import { Button } from "./UI/Button";
import { Heading } from "./UI/Heading";
import { useCartStore } from "@/lib/utils/cartStore";
import Link from "next/link";
export default function CartSummarySection() {
  const { total, cart } = useCartStore();
  const inTotal = 150 + Number(total);
  return (
    <>
      {" "}
      {/* cart summary section */}{" "}
      <div className="flex w-full md:w-[30%] flex-col gap-4">
        {" "}
        <div className="flex flex-col items-start rounded-[10px] bg-[#EDF1F4] p-4 shadow-xs">
          {" "}
          <Heading
            size="heading5xl"
            as="h1"
            className="ml-1.5 mt-1.5 text-[22px] font-semibold"
          >
            {" "}
            Order Summary{" "}
          </Heading>{" "}
          <div className="mx-1.5 mt-5 h-[0.5px] self-stretch bg-gray-700 " />{" "}
          <div className="mr-1.5 mt-11 self-stretch ">
            {" "}
            <div className="flex flex-wrap items-center justify-between gap-5 py-1">
              {" "}
              <Heading as="h2" className="text-[18px] font-normal">
                {" "}
                <span className="text-black-900">Subtotal&nbsp;</span>{" "}
                <span className="text-gray-800_03">({cart?.length} items)</span>{" "}
              </Heading>{" "}
              <Heading
                size="heading3xl"
                as="h3"
                className="self-end text-[18px] font-semibold"
              >
                {" "}
                ৳ {total}
              </Heading>{" "}
            </div>{" "}
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-5 py-1">
              {" "}
              <Heading as="h4" className="text-[18px] font-normal">
                {" "}
                Shipping fee{" "}
              </Heading>{" "}
              <Heading
                size="heading3xl"
                as="h5"
                className="text-[18px] font-semibold"
              >
                {" "}
                ৳ 150{" "}
              </Heading>{" "}
            </div>{" "}
            {/* <div className="mt-6 flex items-center justify-between gap-5 rounded-[12px] border border-solid border-black-900">
              {" "}
              <Text
                size="textxl"
                as="p"
                className="ml-3.5 text-[14px] font-normal !text-black-900_bf"
              >
                {" "}
                Add Coupon Code(If any){" "}
              </Text>{" "}
              <Button
                size="xl"
                className="min-w-[108px] rounded-br-[12px] rounded-tr-[12px] px-[30px]"
              >
                {" "}
                Enter{" "}
              </Button>{" "}
            </div>{" "} */}
            <div className="ml-1.5 mt-[38px] h-[0.5px] bg-gray-700 md:ml-0" />{" "}
            <div className="mt-11 flex flex-wrap items-center justify-between gap-5 py-1">
              {" "}
              <Heading as="h6" className="text-[18px] font-normal">
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
        <Link href="/checkout" className="self-stretch w-full block">
          <Button
            size="4xl"
            className="self-stretch rounded-[14px] w-full px-[34px]"
          >
            {" "}
            Checkout
          </Button>
        </Link>
      </div>{" "}
    </>
  );
}
