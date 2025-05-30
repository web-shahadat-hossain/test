"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useCartStore } from "@/lib/utils/cartStore";
import { Heading } from "../cart/UI/Heading";
import { Img } from "../cart/UI/Img";
import ShippingInformationSection from "./ShippingInformationSection";
import CheckoutSection from "./CheckoutSection";
import { Input } from "./UI/Input";
import { placeOrder } from "@/lib/utils/service/product";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserRegion } from "@/lib/utils/useUserRegion";

interface FormData {
  address: string;
  totalPrice: string;
  contactNo: string;
  email: string;
  transactionId: string;
  payMethod: "bikash" | "nagad";
  shippingMethod: string;
  shippingCost: string;
  items: Array<{
    product: number;
    quantity: number;
    color: string;
    size: string;
    price: number;
  }>;
}

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCartStore();
  const { countryCode, loading } = useUserRegion();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    address: "",
    totalPrice: "",
    contactNo: "",
    email: "",
    transactionId: "",
    payMethod: "bikash",
    shippingMethod: "Standard",
    shippingCost: "",
    items: [],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!loading && countryCode === "US") {
      toast.error("Checkout is not available in your region (United States).", {
        id: "checkout-region-block",
      });
      router.replace("/");
    }
  }, [countryCode, loading, router]);

  useEffect(() => {
    const formattedItems = cart
      .filter((item) => item.product.id !== undefined)
      .map((item) => ({
        product: item.product.id as number,
        quantity: item.quantity,
        color: item.color || "N/A",
        size: item.size || "N/A",
        price: item.price,
      }));

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setFormData((prev) => ({
      ...prev,
      items: formattedItems,
      totalPrice: total.toString(),
    }));
  }, [cart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await placeOrder({
        ...formData,
        totalPrice: Number(total) + 150,
        shippingCost: 150,
      });

      if (data?.tracker) {
        clearCart(); // ✅ কার্ট খালি করো
        router.push(`/success?track=${data.tracker}`); // ✅ success পেজে পাঠাও এবং track id পাঠাও
      } else {
        toast.error(
          "দুঃখিত! কিছু একটা সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।"
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(
        "দুঃখিত! কিছু একটা সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।"
      );
    }
  };

  if (loading) return null;
  if (countryCode === "US") return null;

  return (
    <div className="w-full overflow-x-scroll bg-[#f3f3f3] pb-[30px] pt-10 md:pt-[140px]">
      <div className="flex flex-col items-center gap-[42px]">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex flex-col md:flex-row w-full max-w-[1266px] items-start gap-[38px]"
        >
          <div className="flex  md:flex-1 flex-col gap-[42px]">
            <ShippingInformationSection setFormData={setFormData} />

            <div className="flex flex-col md:flex-row rounded-[10px] bg-white p-7 shadow-xs">
              <div className="w-1/2">
                <div className="flex items-start gap-[15px]">
                  <Heading as="h2" className="text-[30px] font-medium">
                    Payment method
                  </Heading>
                  <Img
                    src="img_location.svg"
                    width={26}
                    height={38}
                    alt="Location"
                    className="h-[38px]"
                  />
                </div>

                <div className="mb-5 mt-4 flex gap-3.5">
                  {["bikash", "nagad"].map((method) => (
                    <div
                      key={method}
                      className={`h-[54px] w-[25%] cursor-pointer rounded-[10px] border transition-all duration-200 ${
                        formData.payMethod === method
                          ? "border-2 border-orange-500 bg-orange-100"
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          payMethod: method as FormData["payMethod"],
                        }))
                      }
                    >
                      <Img
                        src={`${method}.png`}
                        width={136}
                        height={54}
                        alt={method}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex w-[200px] h-[200px] md:h-[322px] md:w-[80%] items-center justify-end rounded-[14px] border border-black bg-[url(/images/qrcode.png)] bg-cover bg-no-repeat p-1" />
              </div>

              <div className="w-full md:w-1/2">
                <div className="flex flex-col items-start">
                  {[
                    "Open your bKash app or dial *247#.",
                    "Send the payment to [your merchant number].",
                    "Enter the exact amount shown on your invoice.",
                    "Once you finish the payment, you'll get a message with a Transaction ID.",
                    "Enter that Transaction ID in the box below to confirm your payment.",
                  ].map((text, i) => (
                    <Heading
                      key={i}
                      as={`h${i + 3}` as any}
                      className={`mt-${
                        i === 0 ? 0 : i === 4 ? 6 : 4
                      } text-[14px] font-medium`}
                    >
                      {text}
                    </Heading>
                  ))}
                </div>

                <div className="w-full p-4 mt-10 bg-gray-100 border border-gray-700 rounded-lg">
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange} // ✅ এটা যুক্ত করুন
                    placeholder="Enter your Bkash Transaction ID"
                    className="w-full px-3 text-gray-900 border border-gray-300 focus:outline-none focus:ring-0 focus:border-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <CheckoutSection />
        </form>
      </div>
    </div>
  );
}
