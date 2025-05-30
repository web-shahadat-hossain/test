"use client";
import React, { useEffect } from "react";
import CartSection from "./CartSection";
import CartSummarySection from "./CartSummarySection";
import { useUserRegion } from "@/lib/utils/useUserRegion";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const { countryCode, loading } = useUserRegion();
  const router = useRouter();

  useEffect(() => {
    if (!loading && countryCode === "US") {
      toast.error("Cart is not available in your region (United States).", {
        id: "cart-region-block",
      });
      router.replace("/");
    }
  }, [countryCode, loading, router]);

  if (loading) return null;
  if (countryCode === "US") return null;

  return (
    <div className="flex w-full flex-col gap-[26px] overflow-x-scroll bg-[#ffffff] pb-[40px] pt-[20px] md:pt-[80px]">
      {" "}
      <div className="flex flex-col  gap-[84px]  ">
        {" "}
        <div className="mx-auto flex md:flex-row flex-col w-full max-w-[1270px]  gap-8  ">
          {" "}
          <CartSection />
          <CartSummarySection />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
