"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import Toggle from "@/components/ui/Toggle";
import { createOrderRequest } from "@/lib/utils/service/order";
import { getAddresses } from "@/lib/utils/service/user";
import { isAuthenticated as checkAuthStatus } from "@/lib/utils/service/auth";
import { useUserRegion } from "@/lib/utils/useUserRegion";

const ProductPreviewComponent = dynamic(
  () => import("@/components/product-preview/ProductPreview"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-2xl p-8 mx-4 bg-white rounded-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF4B26] border-t-transparent"></div>
            <p className="text-gray-600">Loading preview...</p>
          </div>
        </div>
      </div>
    ),
  }
);

interface Address {
  id: string | number;
  road: string;
  post: string | number;
  city: string;
  district: string;
}

interface FormErrors {
  productLink?: string;
  quantity?: string;
  details?: string;
  address?: string;
}

function ManualRequestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams?.get("url") || "";
  const desc = searchParams?.get("desc") || "";

  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    productLink: "",
    quantity: "1",
    details: "",
    withBox: false,
    urgentDelivery: false,
    notifyOnWhatsapp: true,
    color: "",
    size: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedDraft, setSavedDraft] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const { countryCode, loading: regionLoading } = useUserRegion();

  useEffect(() => {
    setMounted(true);
    const draft = localStorage.getItem("manualRequestDraft");
    if (draft) setSavedDraft(draft);
    if (url) setFormData((prev) => ({ ...prev, productLink: url }));
    if (desc) setFormData((prev) => ({ ...prev, details: desc }));

    const checkAuth = () => {
      setIsAuthenticated(checkAuthStatus());
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [url, desc]);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem("manualRequestDraft", JSON.stringify(formData));
    }, 30000);
    return () => clearInterval(interval);
  }, [formData]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAddresses = async () => {
      try {
        const addressList = await getAddresses();
        setAddresses(addressList);
        if (addressList.length > 0) {
          const firstId = addressList[0].id;
          setSelectedAddressId(
            typeof firstId === "string" ? parseInt(firstId) : firstId
          );
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, [isAuthenticated]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (countryCode !== "US") {
      if (!formData.productLink)
        newErrors.productLink = "Product link is required";
      else if (!/^https?:\/\/.+/.test(formData.productLink))
        newErrors.productLink = "Please enter a valid URL";
    }
    if (!formData.quantity || parseInt(formData.quantity) < 1)
      newErrors.quantity = "Quantity must be at least 1";
    if (!formData.details.trim())
      newErrors.details = "Please provide some details about your request";
    if (!selectedAddressId)
      newErrors.address = "Please select a delivery address";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("You must be logged in to submit a request.");
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        product_url: formData.productLink,
        quantity: countryCode === "US" ? 0 : parseInt(formData.quantity),
        description: formData.details,
        is_box: formData.withBox,
        address: selectedAddressId!,
      };
      console.log("Submitting order request payload:", orderPayload);
      await createOrderRequest(orderPayload);
      localStorage.removeItem("manualRequestDraft");
      setSavedDraft(null);
      setFormData({
        productLink: "",
        quantity: "1",
        details: "",
        withBox: false,
        urgentDelivery: false,
        notifyOnWhatsapp: true,
        color: "",
        size: "",
      });
    } catch (err) {
      console.error("Error submitting request:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const draftData = { ...formData, [name]: value };
    localStorage.setItem("manualRequestDraft", JSON.stringify(draftData));
  };

  const handleToggleChange = (name: string) => (value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "add_new") {
      router.push("/dashboard/addresses");
    } else {
      setSelectedAddressId(Number(value));
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="container px-4 mx-auto max-w-3xl mt-[20vh]">
        <div className="p-8 bg-white shadow-sm rounded-xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Manual Request
          </h1>

          {savedDraft && (
            <div className="p-4 mb-6 rounded-lg bg-blue-50">
              <p className="text-blue-800">
                You have a saved draft. Would you like to restore it?
              </p>
              <div className="mt-2 space-x-4">
                <button
                  onClick={() => {
                    const draft = JSON.parse(savedDraft);
                    setFormData(draft);
                    setSavedDraft(null);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Restore Draft
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("manualRequestDraft");
                    setSavedDraft(null);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Discard Draft
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product Link */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Product Link
              </label>
              <input
                type="url"
                name="productLink"
                value={formData.productLink}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border ${
                  errors.productLink ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 focus:border-[#FF4B26] focus:outline-none focus:ring-1 focus:ring-[#FF4B26]`}
                placeholder="https://example.com/product"
              />
              {errors.productLink && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.productLink}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={countryCode === "US" ? 0 : formData.quantity}
                onChange={handleInputChange}
                min="0"
                disabled={countryCode === "US"}
                className={`block w-full rounded-lg border ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 focus:border-[#FF4B26] focus:outline-none focus:ring-1 focus:ring-[#FF4B26]`}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>

            {/* Details */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Additional Details
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                rows={4}
                className={`block w-full rounded-lg border ${
                  errors.details ? "border-red-500" : "border-gray-300"
                } px-4 py-2.5 focus:border-[#FF4B26] focus:outline-none focus:ring-1 focus:ring-[#FF4B26]`}
                placeholder="Please provide any additional details about your request..."
              />
              {errors.details && (
                <p className="mt-1 text-sm text-red-500">{errors.details}</p>
              )}
            </div>

            {/* Address */}
            {isAuthenticated ? (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Delivery Address
                </label>
                <select
                  value={selectedAddressId ?? ""}
                  onChange={handleAddressChange}
                  className={`block w-full rounded-lg border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } px-4 py-2.5 focus:border-[#FF4B26] focus:outline-none focus:ring-1 focus:ring-[#FF4B26]`}
                >
                  <option value="">Select an address</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {`Road #${address.road}, ${address.city}, ${address.district}-${address.post}`}
                    </option>
                  ))}
                  <option value="add_new">➕ Add New Address</option>
                </select>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>
            ) : (
              <p className="text-sm font-medium text-red-500">
                To proceed, please{" "}
                <a
                  href="/auth/signin"
                  className="underline text-[#FF4B26] font-semibold"
                >
                  log in
                </a>{" "}
                and then submit your request securely.
              </p>
            )}

            {/* Toggle Option */}
            <div className="p-4 space-y-3 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between p-2 transition-colors rounded-lg hover:bg-white">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    Include Original Box
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Get the product with its original packaging
                  </p>
                </div>
                <div className="ml-4">
                  <Toggle
                    label="Include Original Box"
                    checked={formData.withBox}
                    onChange={handleToggleChange("withBox")}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isAuthenticated}
                className="px-6 py-2.5 bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63D1A] disabled:opacity-50 flex items-center space-x-2 text-sm font-medium transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>
                    {isAuthenticated ? "Submit Request" : "Login to Submit"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ManualRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"></div>}>
      <ManualRequestContent />
    </Suspense>
  );
}
