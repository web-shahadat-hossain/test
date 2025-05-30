"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { toast } from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/utils/service/user";
import {
  getOrderRequests,
  getResolvedOrderById,
} from "@/lib/utils/service/order";
import { useUserRegion } from "@/lib/utils/useUserRegion";

interface ResolvedOrder {
  order_id: number;
  product_url: string;
  quantity: number;
  usd_price: number;
  description: string;
  converted_price: number;
  custom_fee: number;
  tax: number;
  box_fee: number;
  platform_fee: number;
  discount: number;
  cost: number;
  address?: {
    id: number;
    district: string;
    city: string;
    road: string;
    post: string;
  };
}

const steps = [
  { label: "Shipping Address", value: "address" },
  { label: "Payment", value: "payment" },
  { label: "Review", value: "review" },
];

const ACTIVE_COLOR = "#174832";

export default function CheckoutModalPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </ErrorBoundary>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get("step") || "address";
  const [show, setShow] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [requestInfo, setRequestInfo] = useState<any>(null);
  const [orderAddress, setOrderAddress] = useState<any>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddress, setEditAddress] = useState({
    district: "",
    city: "",
    road: "",
    post: "",
  });
  const [addressSaving, setAddressSaving] = useState(false);
  const { countryCode, loading: regionLoading } = useUserRegion();
  const [showRegionSelector, setShowRegionSelector] = useState(false);

  useEffect(() => {
    setShow(true);
    // If requestId is present, fetch the request info
    const requestId = searchParams.get("requestId");
    console.log("[DEBUG] requestId:", requestId);
    if (!requestId) {
      toast.error("Please select a resolved order first to access checkout.");
      setShow(false);
      router.replace("/dashboard/manual-requests");
      return;
    }
    if (requestId) {
      (async () => {
        try {
          // Fetch the resolved order by ID
          const resolvedOrder = (await getResolvedOrderById(
            requestId
          )) as ResolvedOrder & {
            address?: {
              id: number;
              district: string;
              city: string;
              road: string;
              post: string;
            };
          };
          console.log("[DEBUG] fetched resolved order by ID:", resolvedOrder);
          setRequestInfo(resolvedOrder);
          if (resolvedOrder.address) {
            setOrderAddress(resolvedOrder.address);
            setSelectedAddressId(resolvedOrder.address.id);
          }
        } catch (err) {
          console.error(
            "Error in checkout useEffect (resolved order by id):",
            err
          );
        }
      })();
    }
  }, []);

  const closeModal = () => {
    setShow(false);
    setTimeout(() => {
      router.push("/dashboard/manual-requests");
    }, 200);
  };

  // Step 1: Shipping Address form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    street: "",
    street2: "",
    postCode: "",
    city: "",
    country: "",
    phone: "",
    email: "",
  });
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [submitted, setSubmitted] = useState(false);

  // Delivery step state
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [deliveryDate, setDeliveryDate] = useState("");

  // Payment step state
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bkashNumber, setBkashNumber] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Manual Banking state
  const [bankName, setBankName] = useState("");
  const [bankId, setBankId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [manualBankImage, setManualBankImage] = useState<File | null>(null);
  const [tracker, setTracker] = useState("");

  // Manual payment check state
  const [manualPaymentInfo, setManualPaymentInfo] = useState<any>(null);
  const [manualPaymentLoading, setManualPaymentLoading] = useState(false);
  const [manualPaymentError, setManualPaymentError] = useState("");

  // Shipping address state
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    district: "",
    city: "",
    road: "",
    post: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  const requiredFields = [
    "firstName",
    "lastName",
    "street",
    "postCode",
    "city",
    "country",
    "phone",
    "email",
  ];
  const errors: { [k: string]: string } = {};
  requiredFields.forEach((field) => {
    if (!form[field as keyof typeof form]) {
      errors[field] = "Required";
    }
  });
  const isValid = Object.keys(errors).length === 0;

  // Payment validation functions
  const validateCardNumber = (number: string) => {
    // Remove spaces and dashes
    const cleanNumber = number.replace(/[\s-]/g, "");
    // Check if it's 16 digits
    return /^\d{16}$/.test(cleanNumber);
  };

  const validateExpiryDate = (date: string) => {
    // Check MM/YY format
    if (!/^\d{2}\/\d{2}$/.test(date)) return false;

    const [month, year] = date.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) return false;
    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    )
      return false;

    return true;
  };

  const validateCVV = (cvv: string) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const validateBankAccount = (account: string) => {
    // Basic validation for bank account - adjust based on your requirements
    return /^\d{9,18}$/.test(account);
  };

  const validateBkashNumber = (number: string) => {
    // Basic validation for bKash number - adjust based on your requirements
    return /^01[3-9]\d{8}$/.test(number);
  };

  const validateManualBanking = () => {
    const trackerValue = requestInfo?.tracker || tracker;
    if (!trackerValue || !trackerValue.trim()) {
      setPaymentError("Please enter tracker");
      return false;
    }
    if (!bankName.trim()) {
      setPaymentError("Please enter bank name");
      return false;
    }
    if (!bankId.trim()) {
      setPaymentError("Please enter bank ID");
      return false;
    }
    if (!transactionId.trim()) {
      setPaymentError("Please enter transaction ID");
      return false;
    }
    if (!manualBankImage) {
      setPaymentError("Please upload a payment slip image");
      return false;
    }
    return true;
  };

  const processPayment = async () => {
    setIsProcessing(true);
    setPaymentError("");

    try {
      // Validate payment details based on method
      if (paymentMethod === "manual_banking") {
        if (!validateManualBanking()) {
          setIsProcessing(false);
          return;
        }

        // Build FormData
        const formData = new FormData();
        formData.append("tracker", requestInfo?.tracker || tracker);
        formData.append("bank_name", bankName);
        formData.append("bank_id", bankId);
        formData.append("transaction_id", transactionId);
        if (manualBankImage) {
          formData.append("image", manualBankImage);
        }

        // Log all FormData entries
        for (let pair of formData.entries()) {
          console.log(pair[0] + ":", pair[1]);
        }

        const res = await fetch("/api/payment/mannual-payment", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          let data = null;
          try {
            data = await res.json();
          } catch (e) {
            // Not JSON
          }
          console.error("Backend error:", data || res.statusText);
          toast.error(
            data?.detail || data?.message || "Failed to submit manual payment."
          );
          setPaymentError(
            data?.detail || data?.message || "Failed to submit manual payment."
          );
          setIsProcessing(false);
          return;
        }
        toast.success("Manual payment submitted successfully!");
        router.push("/dashboard/checkout?step=review");
        return;
      }

      if (paymentMethod === "card") {
        if (!validateCardNumber(cardNumber)) {
          setPaymentError("Please enter a valid 16-digit card number");
          return;
        }
        if (!validateExpiryDate(expiryDate)) {
          setPaymentError("Please enter a valid expiry date (MM/YY)");
          return;
        }
        if (!validateCVV(cvv)) {
          setPaymentError("Please enter a valid CVV (3-4 digits)");
          return;
        }
        if (!cardName.trim()) {
          setPaymentError("Please enter the name on card");
          return;
        }
      } else if (paymentMethod === "bank") {
        if (!validateBankAccount(bankAccount)) {
          setPaymentError("Please enter a valid bank account number");
          return;
        }
      } else if (paymentMethod === "bkash") {
        if (!validateBkashNumber(bkashNumber)) {
          setPaymentError("Please enter a valid bKash number");
          return;
        }
      }

      // TODO: Integrate with your payment processing service
      // const paymentResult = await processPaymentWithService({
      //   method: paymentMethod,
      //   details: paymentMethod === "card"
      //     ? { cardNumber, cardName, expiryDate, cvv }
      //     : paymentMethod === "bank"
      //     ? { bankAccount }
      //     : { bkashNumber }
      // });

      // For now, we'll just simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // If payment successful, proceed to review
      router.push("/dashboard/checkout?step=review");
    } catch (error) {
      setPaymentError("Payment processing failed. Please try again.");
      toast.error("Payment processing failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Effect: Check for existing manual payment when paymentMethod/manual_banking selected
  useEffect(() => {
    const fetchManualPayment = async () => {
      if (paymentMethod !== "manual_banking" || !requestInfo?.tracker) return;
      setManualPaymentLoading(true);
      setManualPaymentError("");
      setManualPaymentInfo(null);
      try {
        const res = await fetch(
          `/api/payment/mannual-payment/${requestInfo.tracker}`
        );
        if (!res.ok) {
          const data = await res.json();
          if (data?.detail) {
            setManualPaymentInfo(null);
          } else {
            setManualPaymentError("Failed to check manual payment.");
          }
        } else {
          const data = await res.json();
          setManualPaymentInfo(data);
        }
      } catch (err) {
        setManualPaymentError("Error checking manual payment.");
      } finally {
        setManualPaymentLoading(false);
      }
    };
    fetchManualPayment();
  }, [paymentMethod, requestInfo]);

  // Delete manual payment
  const handleDeleteManualPayment = async () => {
    if (!requestInfo?.tracker) return;
    setManualPaymentLoading(true);
    setManualPaymentError("");
    try {
      const res = await fetch(
        `/api/payment/mannual-payment/${requestInfo.tracker}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        setManualPaymentError("Failed to delete manual payment.");
      } else {
        setManualPaymentInfo(null);
        toast.success("Manual payment deleted. You can submit a new one.");
      }
    } catch (err) {
      setManualPaymentError("Error deleting manual payment.");
    } finally {
      setManualPaymentLoading(false);
    }
  };

  function handleRegionSelect(code: string) {
    localStorage.setItem("regionOverride", code);
    window.location.reload();
  }

  // Only render modal if show is true
  if (!show) return null;

  return (
    <div className="min-h-screen px-4 py-4 bg-gray-50 sm:py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden bg-white rounded-lg shadow-lg">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar Stepper */}
            <div className="w-full lg:w-1/3 bg-[#f7faf9] px-4 sm:px-8 py-4 sm:py-5 flex flex-col items-start border-b lg:border-b-0 lg:border-r border-gray-100">
              <h2 className="mb-6 sm:mb-10 text-xl sm:text-2xl font-bold text-[#174832] tracking-tight">
                Checkout
              </h2>
              <ol className="w-full space-y-4 sm:space-y-7">
                {steps.map((s, idx) => (
                  <li
                    key={s.value}
                    className="flex items-center gap-3 sm:gap-4"
                  >
                    <div
                      className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 text-sm sm:text-base font-bold transition-all duration-200
                        ${
                          step === s.value
                            ? `bg-[${ACTIVE_COLOR}] border-[${ACTIVE_COLOR}] text-white`
                            : idx < steps.findIndex((st) => st.value === step)
                            ? `bg-[${ACTIVE_COLOR}]/10 border-[${ACTIVE_COLOR}] text-[${ACTIVE_COLOR}]`
                            : "bg-white border-gray-300 text-gray-400"
                        }
                      `}
                      style={
                        step === s.value
                          ? {
                              background: ACTIVE_COLOR,
                              borderColor: ACTIVE_COLOR,
                              color: "#fff",
                            }
                          : {}
                      }
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-base sm:text-lg font-semibold transition-colors duration-200
                        ${
                          step === s.value
                            ? `text-[${ACTIVE_COLOR}]`
                            : "text-gray-500"
                        }`}
                      style={step === s.value ? { color: ACTIVE_COLOR } : {}}
                    >
                      {s.label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            {/* Main Form Area */}
            <div className="relative flex flex-col justify-between flex-1 px-4 py-4 sm:px-8 sm:py-5">
              {/* Close Button */}
              <button
                className="absolute top-0 text-3xl text-gray-400 right-2 hover:text-gray-600"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
              {/* Step 1: Shipping Address */}
              {step === "address" && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#174832]">
                    Shipping Address
                  </h3>
                  {orderAddress && !isEditingAddress ? (
                    <div className="relative p-4 border rounded-xl bg-blue-50">
                      <span className="font-semibold">
                        {orderAddress.district}, {orderAddress.city}
                      </span>
                      <span className="block text-gray-600">
                        {orderAddress.road}
                      </span>
                      <span className="block text-xs text-gray-500">
                        Postal Code: {orderAddress.post}
                      </span>
                      <button
                        className="absolute px-2 py-1 text-xs bg-gray-200 rounded top-2 right-2 hover:bg-gray-300"
                        onClick={() => {
                          setEditAddress({
                            district: orderAddress.district,
                            city: orderAddress.city,
                            road: orderAddress.road,
                            post: orderAddress.post,
                          });
                          setIsEditingAddress(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  ) : isEditingAddress ? (
                    <form
                      className="p-4 space-y-2 border rounded-xl bg-blue-50"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setAddressSaving(true);
                        try {
                          await updateAddress(orderAddress.id, {
                            ...editAddress,
                            post: parseInt(editAddress.post),
                          });
                          setOrderAddress({ ...orderAddress, ...editAddress });
                          setIsEditingAddress(false);
                          toast.success("Address updated!");
                        } catch {
                          toast.error("Failed to update address.");
                        } finally {
                          setAddressSaving(false);
                        }
                      }}
                    >
                      <input
                        className="w-full px-2 py-1 border rounded"
                        value={editAddress.district}
                        onChange={(e) =>
                          setEditAddress((a) => ({
                            ...a,
                            district: e.target.value,
                          }))
                        }
                        placeholder="District"
                        required
                      />
                      <input
                        className="w-full px-2 py-1 border rounded"
                        value={editAddress.city}
                        onChange={(e) =>
                          setEditAddress((a) => ({
                            ...a,
                            city: e.target.value,
                          }))
                        }
                        placeholder="City"
                        required
                      />
                      <input
                        className="w-full px-2 py-1 border rounded"
                        value={editAddress.road}
                        onChange={(e) =>
                          setEditAddress((a) => ({
                            ...a,
                            road: e.target.value,
                          }))
                        }
                        placeholder="Road"
                        required
                      />
                      <input
                        className="w-full px-2 py-1 border rounded"
                        value={editAddress.post}
                        onChange={(e) =>
                          setEditAddress((a) => ({
                            ...a,
                            post: e.target.value,
                          }))
                        }
                        placeholder="Postal Code"
                        required
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          type="submit"
                          className="px-4 py-1 text-white bg-green-600 rounded"
                          disabled={addressSaving}
                        >
                          {addressSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          className="px-4 py-1 bg-gray-300 rounded"
                          onClick={() => setIsEditingAddress(false)}
                          disabled={addressSaving}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>No address found for this order.</div>
                  )}
                  <button
                    type="button"
                    className="mt-6 px-6 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f] transition-colors"
                    onClick={() =>
                      router.push(
                        `/dashboard/checkout?step=payment&requestId=${searchParams.get(
                          "requestId"
                        )}`
                      )
                    }
                    disabled={isEditingAddress || addressSaving}
                  >
                    Next
                  </button>
                </div>
              )}
              {/* Step 2: Payment */}
              {step === "payment" && (
                <>
                  {(!countryCode || paymentError || showRegionSelector) && (
                    <div className="relative flex flex-col items-center justify-between p-4 mb-6 border shadow rounded-xl bg-yellow-50 sm:flex-row">
                      <span className="flex items-center gap-2 mb-2 font-semibold text-yellow-800 sm:mb-0">
                        <svg
                          className="w-5 h-5 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M12 20.5C6.201 20.5 1.5 15.799 1.5 10S6.201-.5 12-.5 22.5 4.201 22.5 10 17.799 20.5 12 20.5z"
                          />
                        </svg>
                        Select your region:
                      </span>
                      <div className="flex gap-2">
                        <button
                          className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition border-2 flex items-center gap-1 ${
                            countryCode === "BD"
                              ? "bg-green-600 text-white border-green-700"
                              : "bg-white text-green-700 border-green-200 hover:bg-green-50"
                          }`}
                          onClick={() => handleRegionSelect("BD")}
                        >
                          <span role="img" aria-label="Bangladesh">
                            🇧🇩
                          </span>{" "}
                          Bangladesh
                          {countryCode === "BD" && (
                            <span className="ml-1">✔️</span>
                          )}
                        </button>
                        <button
                          className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition border-2 flex items-center gap-1 ${
                            countryCode === "US"
                              ? "bg-blue-600 text-white border-blue-700"
                              : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                          }`}
                          onClick={() => handleRegionSelect("US")}
                        >
                          <span role="img" aria-label="United States">
                            🇺🇸
                          </span>{" "}
                          United States
                          {countryCode === "US" && (
                            <span className="ml-1">✔️</span>
                          )}
                        </button>
                      </div>
                      {/* <button
                        className="absolute text-xl text-gray-400 top-2 right-2 hover:text-gray-600"
                        onClick={() => setShowRegionSelector(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button> */}
                    </div>
                  )}
                  {!showRegionSelector && countryCode && (
                    <button
                      className="px-3 py-1 mb-4 text-xs transition border rounded hover:bg-gray-100"
                      onClick={() => setShowRegionSelector(true)}
                    >
                      Change Region
                    </button>
                  )}
                  <form
                    className="space-y-6 sm:space-y-8"
                    autoComplete="off"
                    onSubmit={(e) => {
                      e.preventDefault();
                      processPayment();
                    }}
                  >
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#174832]">
                        Payment Method
                      </h3>
                      <div className="space-y-4 sm:space-y-5">
                        {/* Manual Banking - always show */}
                        <div
                          className={`flex items-center p-4 border rounded-xl shadow-sm transition cursor-pointer mb-2 ${
                            paymentMethod === "manual_banking"
                              ? "border-green-700 bg-green-50 ring-2 ring-green-600"
                              : "hover:border-[#174832] bg-white"
                          }`}
                          onClick={() => setPaymentMethod("manual_banking")}
                        >
                          <input
                            type="radio"
                            id="manual_banking"
                            name="payment"
                            value="manual_banking"
                            checked={paymentMethod === "manual_banking"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3 accent-green-600"
                          />
                          <div className="flex items-center gap-2">
                            <span
                              role="img"
                              aria-label="Bank"
                              className="text-xl"
                            >
                              🏦
                            </span>
                            <label
                              htmlFor="manual_banking"
                              className="text-base font-semibold"
                            >
                              Manual Banking
                            </label>
                            {paymentMethod === "manual_banking" && (
                              <span className="ml-2 text-green-700">✔️</span>
                            )}
                          </div>
                          <p className="ml-8 text-xs text-gray-600">
                            Pay through bank transfer and enter transaction
                            details
                          </p>
                        </div>
                        {/* Stripe/Card - only for US */}
                        {countryCode === "US" && (
                          <div
                            className={`flex items-center p-4 border rounded-xl shadow-sm transition cursor-pointer mb-2 ${
                              paymentMethod === "card"
                                ? "border-blue-700 bg-blue-50 ring-2 ring-blue-600"
                                : "hover:border-[#174832] bg-white"
                            }`}
                            onClick={() => setPaymentMethod("card")}
                          >
                            <input
                              type="radio"
                              id="card"
                              name="payment"
                              value="card"
                              checked={paymentMethod === "card"}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="mr-3 accent-blue-600"
                            />
                            <div className="flex items-center gap-2">
                              <span
                                role="img"
                                aria-label="Card"
                                className="text-xl"
                              >
                                💳
                              </span>
                              <label
                                htmlFor="card"
                                className="text-base font-semibold"
                              >
                                Card
                              </label>
                              {paymentMethod === "card" && (
                                <span className="ml-2 text-blue-700">✔️</span>
                              )}
                            </div>
                            <p className="ml-8 text-xs text-gray-600">
                              Pay with a credit or debit card
                            </p>
                          </div>
                        )}
                        {/* bKash - only for BD */}
                        {countryCode === "BD" && (
                          <div
                            className={`flex items-center p-4 border rounded-xl shadow-sm transition cursor-pointer mb-2 ${
                              paymentMethod === "bkash"
                                ? "border-[#E2136E] bg-pink-50 ring-2 ring-[#E2136E]"
                                : "hover:border-[#174832] bg-white"
                            }`}
                            onClick={() => setPaymentMethod("bkash")}
                          >
                            <input
                              type="radio"
                              id="bkash"
                              name="payment"
                              value="bkash"
                              checked={paymentMethod === "bkash"}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="mr-3 accent-pink-600"
                            />
                            <div className="flex items-center gap-2">
                              <span
                                role="img"
                                aria-label="bKash"
                                className="text-xl"
                              >
                                📱
                              </span>
                              <label
                                htmlFor="bkash"
                                className="text-base font-semibold"
                                style={{
                                  color:
                                    paymentMethod === "bkash"
                                      ? "#E2136E"
                                      : undefined,
                                }}
                              >
                                bKash
                              </label>
                              {paymentMethod === "bkash" && (
                                <span className="ml-2 text-[#E2136E]">✔️</span>
                              )}
                            </div>
                            <p className="ml-8 text-xs text-gray-600">
                              Pay with bKash mobile payment
                            </p>
                          </div>
                        )}
                      </div>
                      {/* Render bKash Get button at the bottom if bKash is selected */}
                      {paymentMethod === "bkash" && (
                        <div className="flex justify-end mt-4">
                          <button
                            type="button"
                            className="flex items-center justify-center w-full gap-2 px-6 py-3 text-lg font-bold text-white transition bg-pink-600 shadow sm:w-auto rounded-xl hover:bg-pink-700"
                            onClick={() => {
                              if (requestInfo?.tracker) {
                                router.push(`/bkash/${requestInfo.tracker}`);
                              } else {
                                toast.error(
                                  "No tracker ID found for this order."
                                );
                              }
                            }}
                          >
                            Pay Now
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Manual Banking Fields */}
                    {paymentMethod === "manual_banking" && (
                      <div className="space-y-4">
                        {manualPaymentLoading && (
                          <div className="p-3 text-sm text-blue-700 rounded-lg bg-blue-50">
                            Checking manual payment...
                          </div>
                        )}
                        {manualPaymentError && (
                          <div className="p-3 text-sm text-red-600 rounded-lg bg-red-50">
                            {manualPaymentError}
                          </div>
                        )}
                        {manualPaymentInfo ? (
                          <div className="p-4 border rounded-lg bg-yellow-50">
                            <div className="mb-2 font-semibold text-yellow-800">
                              Manual payment already submitted for this order:
                            </div>
                            <div className="text-sm text-gray-800">
                              <div>
                                <b>Bank Name:</b> {manualPaymentInfo.bank_name}
                              </div>
                              <div>
                                <b>Bank ID:</b> {manualPaymentInfo.bank_id}
                              </div>
                              <div>
                                <b>Transaction ID:</b>{" "}
                                {manualPaymentInfo.transaction_id}
                              </div>
                              <div>
                                <b>Image:</b>{" "}
                                <a
                                  href={manualPaymentInfo.image}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  View Slip
                                </a>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
                              onClick={handleDeleteManualPayment}
                              disabled={manualPaymentLoading}
                            >
                              Delete Manual Payment
                            </button>
                          </div>
                        ) : (
                          <>
                            <div>
                              <label className="block mb-1 text-sm font-semibold text-gray-800">
                                Tracker
                              </label>
                              <input
                                type="text"
                                value={
                                  requestInfo?.tracker || "No tracker found"
                                }
                                placeholder="Tracker ID"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#174832] focus:border-transparent bg-[#f9fafb] text-gray-900 font-medium"
                                disabled
                              />
                            </div>
                            <div>
                              <label className="block mb-1 text-sm font-semibold text-gray-800">
                                Bank Name
                              </label>
                              <input
                                type="text"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="Enter bank name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#174832] focus:border-transparent bg-[#f9fafb] text-gray-900 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block mb-1 text-sm font-semibold text-gray-800">
                                Bank ID
                              </label>
                              <input
                                type="text"
                                value={bankId}
                                onChange={(e) => setBankId(e.target.value)}
                                placeholder="Enter bank ID"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#174832] focus:border-transparent bg-[#f9fafb] text-gray-900 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block mb-1 text-sm font-semibold text-gray-800">
                                Transaction ID
                              </label>
                              <input
                                type="text"
                                value={transactionId}
                                onChange={(e) =>
                                  setTransactionId(e.target.value)
                                }
                                placeholder="Enter transaction ID from your bank"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#174832] focus:border-transparent bg-[#f9fafb] text-gray-900 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block mb-1 text-sm font-semibold text-gray-800">
                                Payment Slip (Image)
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  setManualBankImage(
                                    e.target.files?.[0] || null
                                  )
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-[#f9fafb]"
                              />
                              {manualBankImage && (
                                <div className="mt-2 text-xs text-gray-600">
                                  Selected: {manualBankImage.name}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {paymentError && (
                      <div className="p-3 text-sm text-red-500 rounded-lg bg-red-50">
                        {paymentError}
                      </div>
                    )}
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:gap-0">
                      <button
                        type="button"
                        className="w-full sm:w-auto px-6 py-2 border border-[#174832] text-[#174832] rounded-lg hover:bg-[#174832]/10 transition-colors"
                        onClick={() =>
                          router.push("/dashboard/checkout?step=address")
                        }
                        disabled={isProcessing}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#174832]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Continue to Review"}
                      </button>
                    </div>
                  </form>
                </>
              )}
              {/* Step 4: Review */}
              {step === "review" && (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#174832]">
                      Order Summary
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="p-3 border rounded-lg sm:p-4">
                        <h4 className="mb-2 text-sm font-semibold sm:text-base">
                          Shipping Address
                        </h4>
                        <p className="text-sm text-gray-600 sm:text-base">
                          {orderAddress ? (
                            <span>
                              {orderAddress.district}, {orderAddress.city}
                              <br />
                              {orderAddress.road}
                              <br />
                              Postal Code: {orderAddress.post}
                            </span>
                          ) : (
                            <span className="text-red-500">
                              No address found
                            </span>
                          )}
                        </p>
                      </div>
                      {/* <div className="p-3 border rounded-lg sm:p-4">
                        <h4 className="mb-2 text-sm font-semibold sm:text-base">
                          Delivery Method
                        </h4>
                        <p className="text-sm text-gray-600 sm:text-base">
                          {deliveryMethod === "standard"
                            ? "Standard Delivery"
                            : "Express Delivery"}
                          <br />
                          {deliveryDate && `Scheduled for: ${deliveryDate}`}
                        </p>
                      </div> */}
                      <div className="p-3 border rounded-lg sm:p-4">
                        <h4 className="mb-2 text-sm font-semibold sm:text-base">
                          Payment Method
                        </h4>
                        <p className="text-sm text-gray-600 sm:text-base">
                          {paymentMethod === "card"
                            ? `Card ending in ${cardNumber.slice(-4)}`
                            : paymentMethod === "bank"
                            ? "Bank"
                            : "bKash"}
                          <br />
                          {paymentMethod === "card" && `Expires: ${expiryDate}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  {requestInfo && (
                    <div className="p-3 border rounded-lg sm:p-4 bg-gray-50">
                      <h4 className="mb-2 text-sm font-semibold sm:text-base text-[#174832]">
                        Product Info
                      </h4>
                      <div className="text-sm text-gray-700">
                        <div>
                          <span className="font-medium">Product URL:</span>{" "}
                          <a
                            href={requestInfo.product_url}
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {requestInfo.product_url}
                          </a>
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span>{" "}
                          {requestInfo.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Description:</span>{" "}
                          {requestInfo.description}
                        </div>
                        <div>
                          <span className="font-medium">Box Required:</span>{" "}
                          {requestInfo.box ? "Yes" : "No"}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:gap-0">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-6 py-2 border border-[#174832] text-[#174832] rounded-lg hover:bg-[#174832]/10 transition-colors"
                      onClick={() =>
                        router.push("/dashboard/checkout?step=payment")
                      }
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setIsConfirmOpen(true)}
                      className="w-full sm:w-auto px-6 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#174832]/90 transition-colors"
                    >
                      Place Order
                    </button>
                  </div>
                  {/* Confirmation Modal */}
                  <Dialog
                    open={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    className="fixed inset-0 z-50 overflow-y-auto"
                  >
                    <div className="flex items-center justify-center min-h-screen px-4">
                      {/* Overlay replacement for Dialog.Overlay */}
                      <div
                        className="fixed inset-0 bg-black opacity-30"
                        aria-hidden="true"
                      />
                      <div className="relative z-10 w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-xl">
                        <Dialog.Title className="text-xl font-bold mb-4 text-[#174832]">
                          Order Confirmed!
                        </Dialog.Title>
                        <Dialog.Description className="mb-4 text-gray-700">
                          Thank you for your order. You will receive a
                          confirmation email shortly.
                        </Dialog.Description>
                        <button
                          className="w-full px-4 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f]"
                          onClick={() => {
                            setIsConfirmOpen(false);
                            closeModal();
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
