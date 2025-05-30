"use client";

import { useState, useEffect } from "react";
import {
  getOrderRequests,
  createOrderRequest,
  deleteOrderRequest,
} from "@/lib/utils/service/order";
import { toast } from "react-hot-toast";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import Toggle from "@/components/ui/Toggle";
import dynamic from "next/dynamic";
import { getAddresses } from "@/lib/utils/service/user";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { useUserRegion } from "@/lib/utils/useUserRegion";

console.log(getOrderRequests);

interface ManualRequest {
  id: number;
  product_url: string;
  quantity: number;
  description: string;
  box: boolean;
  address: number;
  created_at: string;
  updated_at: string;
  user: number;
  status: string;
  address_details?: {
    district: string;
    city: string;
    post: string;
    road?: string;
  };
  is_box?: boolean;
}

interface ResolvedRequest {
  id: number;
  user: any;
  address: any;
  product_url: string;
  tracker?: string;
  quantity: number;
  description: string;
  usd_price?: string;
  converted_price?: string;
  custom_fee?: number;
  tax?: string;
  box_fee?: number;
  cost?: number;
  status?: string;
  payment_id?: any;
  payment_url?: any;
  created_at: string;
  updated_at: string;
}

const ProductPreview = dynamic(
  () => import("@/components/product-preview/ProductPreview"),
  { ssr: false }
);

const STATUS_TABS = [
  { key: "resolved", label: "Resolved" },
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Paid" },
  { key: "cancelled", label: "Cancelled" },
];

// Helper to get accessToken from cookies
function getAccessTokenFromCookie() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

// const INVOICE_API_BASE = "http://127.0.0.1:8000/invoice";
const INVOICE_API_BASE = "https://america-to-bd.vercel.app/invoice";

async function downloadInvoice(tracker: string) {
  try {
    const now = Date.now();
    const url = `${INVOICE_API_BASE}/${tracker}?t=${now}`;
    const accessToken = getAccessTokenFromCookie();
    const res = await fetch(url, {
      method: "GET",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      cache: "no-store",
    });
    let data = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    }
    if (!res.ok) {
      toast.error(data?.error || data?.detail || "Failed to fetch invoice.");
      return;
    }
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `invoice_${tracker}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    toast.error("Unexpected error occurred while downloading invoice.");
  }
}

// Define the possible tab keys for type safety
type TabKey = "resolved" | "pending" | "paid" | "cancelled";

// Helper type guard for address_details
function hasAddressDetails(request: any): request is ManualRequest {
  return !!request.address_details;
}

// Helper type guard for is_box
function hasIsBox(request: any): request is ManualRequest {
  return typeof request.is_box === "boolean";
}

// Helper for short description
function getShortDescription(desc: string, maxLen = 60) {
  if (!desc) return "";
  return desc.length > maxLen ? desc.slice(0, maxLen) + "..." : desc;
}

// Helper type guard for ResolvedRequest
function isResolvedRequest(request: any): request is ResolvedRequest {
  return request && "tracker" in request;
}

export default function ManualRequestsPage() {
  const [requests, setRequests] = useState<ManualRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [addresses, setAddresses] = useState<
    { id: number; district: string; city: string; postal_code: string }[]
  >([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<TabKey>("resolved");
  const [resolvedRequests, setResolvedRequests] = useState<ResolvedRequest[]>(
    []
  );
  const [paidRequests, setPaidRequests] = useState<ResolvedRequest[]>([]);
  const [cancelledRequests, setCancelledRequests] = useState<ResolvedRequest[]>(
    []
  );
  const router = useRouter();
  const [showGetIt, setShowGetIt] = useState<{ [id: number]: boolean }>({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;
  const [manualPayments, setManualPayments] = useState<{
    [tracker: string]: any;
  }>({});
  const [loadingManualPayments, setLoadingManualPayments] = useState(false);
  const [viewRequest, setViewRequest] = useState<any | null>(null);
  const { countryCode } = useUserRegion();
  const isUSUser = countryCode === "US";

  // --- Manual Request Form State ---
  const [formData, setFormData] = useState({
    productUrl: "",
    color: "",
    size: "",
    quantity: "1",
    details: "",
    withBox: false,
    urgentDelivery: false,
    whatsappUpdates: true,
  });
  const [formErrors, setFormErrors] = useState<any>({});
  // ... existing code ...

  // Add new state for backend counts
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    pending: 0,
    resolved: 0,
    paid: 0,
    cancelled: 0,
  });

  // Add separate loading states for each tab
  const [loadingResolved, setLoadingResolved] = useState(false);
  const [loadingPaid, setLoadingPaid] = useState(false);
  const [loadingCancelled, setLoadingCancelled] = useState(false);

  // Add separate loaded states for each tab
  const [loadedResolved, setLoadedResolved] = useState(false);
  const [loadedPaid, setLoadedPaid] = useState(false);
  const [loadedCancelled, setLoadedCancelled] = useState(false);
  const [loadedPending, setLoadedPending] = useState(false);

  // Add separate total counts for each tab
  type TabCounts = {
    resolved: number;
    paid: number;
    cancelled: number;
    pending: number;
  };
  const [tabTotalCounts, setTabTotalCounts] = useState<TabCounts>({
    resolved: 0,
    paid: 0,
    cancelled: 0,
    pending: 0,
  });

  // Update fetch functions to set tabTotalCounts for each tab
  const fetchRequests = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderRequests(pageNum);
      setRequests(
        (data.results || []).map((item: any) => ({
          ...item,
          status: (item.status || "Pending").toLowerCase().trim(),
          is_box: typeof item.is_box !== "undefined" ? item.is_box : item.box,
        }))
      );
      setTabTotalCounts((prev) => ({ ...prev, pending: data.count || 0 }));
      setStatusCounts((prev) => ({ ...prev, pending: data.count || 0 }));
      setLoadedPending(true);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch manual requests");
      toast.error("Failed to fetch manual requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchResolvedOrders = async (pageNum = 1) => {
    setLoadingResolved(true);
    try {
      const response = await fetch(
        `/api/order/resolved_order?status=AC&page=${pageNum}`
      );
      const data = await response.json();
      setResolvedRequests(data.results || []);
      setTabTotalCounts((prev) => ({ ...prev, resolved: data.count || 0 }));
      setStatusCounts((prev) => ({ ...prev, resolved: data.count || 0 }));
      setLoadedResolved(true);
      console.log("Resolved Requests (API response):", data.results);
    } catch (err) {
      toast.error("Failed to fetch resolved requests");
    } finally {
      setLoadingResolved(false);
    }
  };

  const fetchPaidOrders = async (pageNum = 1) => {
    setLoadingPaid(true);
    try {
      const accessToken = getAccessTokenFromCookie();
      const response = await fetch(
        `https://america-to-bd.vercel.app/order/resolved_order?status_not=AC,CN&page=${pageNum}`,
        {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        }
      );
      const data = await response.json();
      setPaidRequests(data.results || []);
      setTabTotalCounts((prev) => ({ ...prev, paid: data.count || 0 }));
      setStatusCounts((prev) => ({ ...prev, paid: data.count || 0 }));
      setLoadedPaid(true);
      console.log("Paid Orders (API response):", data.results);
    } catch (err) {
      toast.error("Failed to fetch paid requests");
    } finally {
      setLoadingPaid(false);
    }
  };

  const fetchCancelledOrders = async (pageNum = 1) => {
    setLoadingCancelled(true);
    try {
      const accessToken = getAccessTokenFromCookie();
      const response = await fetch(
        `https://america-to-bd.vercel.app/order/resolved_order?status=CN&page=${pageNum}`,
        {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        }
      );
      const data = await response.json();
      setCancelledRequests(data.results || []);
      setTabTotalCounts((prev) => ({ ...prev, cancelled: data.count || 0 }));
      setStatusCounts((prev) => ({ ...prev, cancelled: data.count || 0 }));
      setLoadedCancelled(true);
      console.log("Cancelled Orders (API response):", data.results);
    } catch (err) {
      toast.error("Failed to fetch cancelled requests");
    } finally {
      setLoadingCancelled(false);
    }
  };

  // Preload all tab data on initial mount
  useEffect(() => {
    fetchResolvedOrders(1);
    fetchPaidOrders(1);
    fetchCancelledOrders(1);
    fetchRequests(1);
    // Fetch addresses for dropdown
    const fetchAddressesList = async () => {
      try {
        const addressListRaw = await getAddresses();
        const addressList = addressListRaw.map((addr) => ({
          id: typeof addr.id === "string" ? parseInt(addr.id) : addr.id,
          district: addr.district,
          city: addr.city,
          postal_code: addr.post.toString(),
        }));
        setAddresses(addressList);
        if (addressList.length > 0) {
          setSelectedAddressId(addressList[0].id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddressesList();
  }, []);

  // When switching tabs or page, fetch correct data for that tab
  useEffect(() => {
    if (activeTab === "resolved" && (!loadedResolved || page > 1))
      fetchResolvedOrders(page);
    if (activeTab === "paid" && (!loadedPaid || page > 1))
      fetchPaidOrders(page);
    if (activeTab === "cancelled" && (!loadedCancelled || page > 1))
      fetchCancelledOrders(page);
    if (activeTab === "pending" && (!loadedPending || page > 1))
      fetchRequests(page);
  }, [activeTab, page]);

  // Loader logic
  const isLoadingActiveTab =
    (activeTab === "resolved" && (!loadedResolved || loadingResolved)) ||
    (activeTab === "paid" && (!loadedPaid || loadingPaid)) ||
    (activeTab === "cancelled" && (!loadedCancelled || loadingCancelled)) ||
    (activeTab === "pending" && (!loadedPending || loading));

  console.log("addresses", addresses);
  console.log("selectedAddressId", selectedAddressId);

  const filteredRequests =
    activeTab === "resolved"
      ? resolvedRequests.filter((request) => {
          const matchesSearch =
            request.id
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            request.product_url.toLowerCase().includes(search.toLowerCase());
          return matchesSearch;
        })
      : activeTab === "paid"
      ? paidRequests.filter((request) => {
          const matchesSearch =
            request.id
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            request.product_url.toLowerCase().includes(search.toLowerCase());
          return matchesSearch;
        })
      : activeTab === "cancelled"
      ? cancelledRequests.filter((request) => {
          const matchesSearch =
            request.id
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            request.product_url.toLowerCase().includes(search.toLowerCase());
          return matchesSearch;
        })
      : requests.filter((request) => {
          const matchesSearch =
            request.id
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            request.product_url.toLowerCase().includes(search.toLowerCase());
          let matchesTab = true;
          matchesTab = request.status === activeTab;
          return matchesSearch && matchesTab;
        });

  if (activeTab === "cancelled") {
    console.log("filteredRequests (cancelled):", filteredRequests);
  }

  const validateForm = () => {
    const errors: any = {};
    if (!formData.productUrl) {
      errors.productUrl = "Product URL is required";
    } else if (!/^https?:\/\/.+/.test(formData.productUrl)) {
      errors.productUrl = "Please enter a valid URL";
    }
    if (!formData.quantity || parseInt(formData.quantity) < 1) {
      errors.quantity = "Quantity must be at least 1";
    }
    if (!selectedAddressId) {
      errors.address = "Please select a delivery address";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const orderPayload = {
        product_url: formData.productUrl,
        quantity: parseInt(formData.quantity),
        description: formData.details,
        is_box: formData.withBox,
        address: selectedAddressId!,
      };
      console.log("Submitting order request payload:", orderPayload);
      await createOrderRequest(orderPayload);
      toast.success("Request submitted successfully!");
      setFormData({
        productUrl: "",
        color: "",
        size: "",
        quantity: "1",
        details: "",
        withBox: false,
        urgentDelivery: false,
        whatsappUpdates: true,
      });
      fetchRequests();
    } catch (err) {
      toast.error("Failed to submit request");
    }
  };

  const handleCopyProductUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Product link copied!");
  };

  // --- Manual Payment Fetching ---
  const fetchManualPayments = () => {
    if (activeTab !== "resolved" || resolvedRequests.length === 0) return;
    const trackers = resolvedRequests
      .map((r) => r.tracker)
      .filter((t): t is string => typeof t === "string" && !!t);
    if (trackers.length === 0) return;
    setLoadingManualPayments(true);
    const accessToken = getAccessTokenFromCookie();
    Promise.all(
      trackers.map((tracker) =>
        fetch(`/api/payment/mannual-payment/${tracker}`, {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        })
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      const payments: { [tracker: string]: any } = {};
      trackers.forEach((tracker, i) => {
        if (results[i] && !results[i].detail) payments[tracker] = results[i];
      });
      setManualPayments(payments);
      setLoadingManualPayments(false);
    });
  };

  // Fetch manual payment info for resolved requests with tracker
  useEffect(() => {
    fetchManualPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedRequests, activeTab]);

  // Delete manual payment
  const handleDeleteManualPayment = async (tracker: string) => {
    if (!tracker) return;
    try {
      const accessToken = getAccessTokenFromCookie();
      const res = await fetch(`/api/payment/mannual-payment/${tracker}`, {
        method: "DELETE",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      if (res.ok) {
        setManualPayments((prev) => {
          const copy = { ...prev };
          delete copy[tracker];
          return copy;
        });
        toast.success("Manual payment deleted.");
      } else {
        toast.error("Failed to delete manual payment.");
      }
    } catch {
      toast.error("Error deleting manual payment.");
    }
  };

  // In the render section, update pagination controls to use tabTotalCounts
  const currentTotalCount = tabTotalCounts[activeTab] || 0;

  return (
    <ErrorBoundary>
      <div className="min-h-screen px-4 py-4 bg-gray-50 sm:py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="p-4 sm:p-6">
              {/* --- New Request Form --- */}
              <div className="mb-10">
                <h2 className="mb-2 text-xl font-bold text-gray-900">
                  New Request
                </h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="productUrl"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Product link
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="productUrl"
                        type="url"
                        value={formData.productUrl}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            productUrl: e.target.value,
                          }))
                        }
                        placeholder="Enter your product URL from supported websites (Amazon, eBay, etc.)"
                        className={`w-full px-4 py-2 border ${
                          formErrors.productUrl
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent`}
                      />
                      {formErrors.productUrl && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.productUrl}
                        </p>
                      )}
                      {/* <button
                        type="button"
                        className="px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 disabled:opacity-50"
                        disabled={!formData.productUrl}
                        onClick={() => setShowPreview(true)}
                      >
                        Preview
                      </button> */}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* <div>
                      <label
                        htmlFor="color"
                        className="block mb-1 text-sm font-medium text-gray-700"
                      >
                        Color
                      </label>
                      <input
                        id="color"
                        type="text"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, color: e.target.value }))
                        }
                        placeholder="e.g., Red, Blue, Black"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="size"
                        className="block mb-1 text-sm font-medium text-gray-700"
                      >
                        Size
                      </label>
                      <input
                        id="size"
                        type="text"
                        value={formData.size}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, size: e.target.value }))
                        }
                        placeholder="e.g., M, L, XL, 42"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                      />
                    </div> */}
                  </div>
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, quantity: e.target.value }))
                      }
                      className={`w-full px-4 py-2 border ${
                        formErrors.quantity
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent`}
                    />
                    {formErrors.quantity && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.quantity}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="details"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Additional Details
                    </label>
                    <textarea
                      id="details"
                      value={formData.details}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, details: e.target.value }))
                      }
                      placeholder="Additional product details, preferences, or special requests..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <span className="text-sm text-gray-700">
                        Include Original Box
                      </span>
                      <Toggle
                        checked={formData.withBox}
                        onChange={(v) =>
                          setFormData((f) => ({ ...f, withBox: v }))
                        }
                        label="Include Original Box"
                      />
                    </div>
                    {/* <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <span className="text-sm text-gray-700">
                        Urgent Delivery
                      </span>
                      <Toggle
                        checked={formData.urgentDelivery}
                        onChange={(v) =>
                          setFormData((f) => ({ ...f, urgentDelivery: v }))
                        }
                        label="Urgent Delivery"
                      />
                    </div> */}
                    {/* <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <span className="text-sm text-gray-700">
                        WhatsApp Updates
                      </span>
                      <Toggle
                        checked={formData.whatsappUpdates}
                        onChange={(v) =>
                          setFormData((f) => ({ ...f, whatsappUpdates: v }))
                        }
                        label="WhatsApp Updates"
                      />
                    </div> */}
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Delivery Address
                    </label>
                    {addresses.length === 0 ? (
                      <div className="flex items-center gap-2 mb-2 text-red-600">
                        No addresses found.
                        <a
                          href="/dashboard/addresses"
                          className="text-blue-600 underline hover:text-blue-800"
                          aria-label="Add a new address"
                        >
                          Add Address
                        </a>
                      </div>
                    ) : null}
                    <select
                      id="address"
                      value={selectedAddressId || ""}
                      onChange={(e) =>
                        setSelectedAddressId(Number(e.target.value))
                      }
                      className={`w-full px-4 py-2 border ${
                        formErrors.address
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent`}
                      disabled={addresses.length === 0}
                    >
                      <option value="">Select an address</option>
                      {addresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.district}, {address.city} ,{" "}
                          {address.postal_code}
                        </option>
                      ))}
                    </select>
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.address}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    {/* <button
                      type="button"
                      className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg"
                    >
                      Back
                    </button> */}
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63D1A]"
                      disabled={addresses.length === 0}
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
                {showPreview && (
                  <ProductPreview
                    url={formData.productUrl}
                    onClose={() => setShowPreview(false)}
                    onContinue={() => setShowPreview(false)}
                  />
                )}
              </div>
              {/* --- End New Request Form --- */}
              {/* --- Status Tabs --- */}

              <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 ">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? "border-[#FF4B26] text-[#FF4B26] bg-transparent"
                        : "border-transparent text-gray-600 hover:text-[#FF4B26]"
                    }`}
                    onClick={() => {
                      setActiveTab(tab.key as TabKey);
                      setPage(1); // Reset to first page on tab change
                    }}
                  >
                    {tab.label} ({statusCounts[tab.key] || 0})
                  </button>
                ))}
              </div>
              {/* --- End Status Tabs --- */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Manual Requests
                </h1>
              </div>
              {/* Refresh Payment Status Button for resolved tab */}
              {/* {activeTab === "resolved" && (
                <button
                  onClick={fetchManualPayments}
                  className="px-4 py-2 mb-4 text-white transition bg-blue-600 rounded hover:bg-blue-700"
                  disabled={loadingManualPayments}
                >
                  {loadingManualPayments
                    ? "Refreshing..."
                    : "Refresh Payment Status"}
                </button>
              )} */}
              {/* Search */}
              <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1); // Reset to first page on search
                    }}
                    placeholder="Search by Request ID or Product URL..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                  />
                </div>
              </div>

              {isLoadingActiveTab ? (
                <div className="flex flex-col gap-4 py-12">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-100 border rounded-lg animate-pulse"
                    >
                      <div className="w-1/3 h-6 mb-2 bg-gray-300 rounded" />
                      <div className="w-1/2 h-4 mb-1 bg-gray-200 rounded" />
                      <div className="w-1/4 h-4 mb-1 bg-gray-200 rounded" />
                      <div className="w-1/3 h-4 mb-1 bg-gray-200 rounded" />
                      <div className="w-24 h-8 mt-4 bg-gray-300 rounded" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="py-12 text-center text-red-500">{error}</div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                      No manual requests found.
                    </div>
                  )}
                  {filteredRequests.length === 0 &&
                    activeTab === "resolved" && (
                      <div className="flex flex-col items-center gap-4 py-12 text-center text-gray-500">
                        <div>
                          No resolved requests yet. Submit a new request or wait
                          for admin approval.
                        </div>
                        <button
                          className="px-4 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f]"
                          onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }
                        >
                          Submit New Request
                        </button>
                      </div>
                    )}
                  {filteredRequests.map((request) => {
                    // Only resolved requests have tracker, so check type
                    const isResolved = isResolvedRequest(request);
                    const tracker = isResolved ? request.tracker : undefined;
                    const payment = tracker ? manualPayments[tracker] : null;
                    const paymentInProgress =
                      payment &&
                      payment.status !== "paid" &&
                      payment.status !== "PD" &&
                      payment.status !== "approved";
                    // Debug logging
                    if (
                      request.status?.toLowerCase() === "paid" ||
                      request.status?.toUpperCase() === "PD"
                    ) {
                      console.log(
                        `Card #${request.id} status:`,
                        request.status,
                        "tracker:",
                        tracker,
                        "Show Download Invoice:",
                        !!tracker
                      );
                    }
                    if (activeTab === "paid") {
                      return (
                        <div
                          key={request.id}
                          className="relative flex flex-col gap-3 p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-lg"
                          style={{ minHeight: 140, cursor: "pointer" }}
                          onClick={() => setViewRequest(request)}
                        >
                          {/* Header: ID, Date, Status, Tracker */}
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xl font-extrabold text-[#174832]">
                              #{request.id}
                            </span>
                            <span className="text-xs font-medium text-gray-400">
                              {new Date(
                                request.created_at
                              ).toLocaleDateString()}
                            </span>
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              {request.status?.toUpperCase() || "PAID"}
                            </span>
                            {isResolved && request.tracker && (
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                Tracker: {request.tracker}
                              </span>
                            )}
                          </div>
                          {/* Address */}
                          {isResolved && (request as any).address_details && (
                            <div className="mb-1 text-xs text-gray-700">
                              <span className="font-semibold">Address:</span>{" "}
                              {(request as any).address_details?.district},{" "}
                              {(request as any).address_details?.city},{" "}
                              {(request as any).address_details?.post}
                              {(request as any).address_details?.road
                                ? `, ${(request as any).address_details.road}`
                                : ""}
                            </div>
                          )}
                          {/* Product Info */}
                          <div className="flex flex-col mb-1 sm:flex-row sm:items-center sm:gap-2">
                            <span className="font-semibold text-gray-700">
                              Product:
                            </span>
                            <a
                              href={request.product_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 underline break-all hover:text-blue-800"
                              title={request.product_url}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {(() => {
                                try {
                                  const url = new URL(request.product_url);
                                  const domain = url.hostname.replace(
                                    "www.",
                                    ""
                                  );
                                  let path = url.pathname;
                                  if (path.length > 20)
                                    path = path.slice(0, 20) + "...";
                                  return `${domain}${path}`;
                                } catch {
                                  return request.product_url.length > 30
                                    ? request.product_url.slice(0, 30) + "..."
                                    : request.product_url;
                                }
                              })()}
                            </a>
                            <button
                              className="p-1 ml-1 text-gray-400 rounded hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              title="Copy link"
                              aria-label="Copy product link"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyProductUrl(request.product_url);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <rect
                                  x="9"
                                  y="9"
                                  width="13"
                                  height="13"
                                  rx="2"
                                  strokeWidth="2"
                                  stroke="currentColor"
                                  fill="none"
                                />
                                <rect
                                  x="3"
                                  y="3"
                                  width="13"
                                  height="13"
                                  rx="2"
                                  strokeWidth="2"
                                  stroke="currentColor"
                                  fill="none"
                                />
                              </svg>
                            </button>
                          </div>
                          {/* Details Row */}
                          <div className="flex flex-wrap mb-2 text-sm text-gray-700 gap-x-6 gap-y-1">
                            <span>
                              <span className="font-semibold">Quantity:</span>{" "}
                              {request.quantity}
                            </span>
                            <span>
                              <span className="font-semibold">Box:</span>{" "}
                              {isResolved &&
                              (request as any).is_box !== undefined
                                ? (request as any).is_box
                                  ? "Yes"
                                  : "No"
                                : "N/A"}
                            </span>
                            <span className="block w-full sm:w-auto">
                              <span className="font-semibold">
                                Description:
                              </span>{" "}
                              {request.description}
                            </span>
                          </div>
                          {/* Extra info */}
                          <div className="grid grid-cols-1 gap-2 p-3 mt-3 text-sm bg-gray-50 rounded-xl md:grid-cols-2 lg:grid-cols-3">
                            {isResolved && isUSUser && request.usd_price && (
                              <div>
                                <span className="font-semibold text-gray-600">
                                  USD Price:
                                </span>{" "}
                                ${request.usd_price}
                              </div>
                            )}
                            {isResolved &&
                              !isUSUser &&
                              request.converted_price && (
                                <div>
                                  <span className="font-semibold text-gray-600">
                                    Converted Price:
                                  </span>{" "}
                                  ৳{request.converted_price}
                                </div>
                              )}
                            {isResolved && request.custom_fee && (
                              <div>
                                <span className="font-semibold text-gray-600">
                                  Custom Fee:
                                </span>{" "}
                                {isUSUser ? "$" : "৳"}
                                {request.custom_fee}
                              </div>
                            )}
                            {isResolved && request.tax && (
                              <div>
                                <span className="font-semibold text-gray-600">
                                  Tax:
                                </span>{" "}
                                {isUSUser ? "$" : "৳"}
                                {request.tax}
                              </div>
                            )}
                            {isResolved && request.box_fee && (
                              <div>
                                <span className="font-semibold text-gray-600">
                                  Box Fee:
                                </span>{" "}
                                {isUSUser ? "$" : "৳"}
                                {request.box_fee}
                              </div>
                            )}
                            {isResolved && request.cost && (
                              <div>
                                <span className="font-semibold text-gray-600">
                                  Total Cost:
                                </span>{" "}
                                {isUSUser ? "$" : "৳"}
                                {request.cost}
                              </div>
                            )}
                          </div>
                          {/* Download Invoice button */}
                          {activeTab === "paid" &&
                            !isUSUser &&
                            isResolvedRequest(request) &&
                            request.tracker && (
                              <button
                                className="absolute px-4 py-2 mt-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 right-6 top-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (
                                    isResolvedRequest(request) &&
                                    request.tracker
                                  ) {
                                    downloadInvoice(request.tracker);
                                  }
                                }}
                                title="Download Invoice PDF"
                              >
                                Download Invoice
                              </button>
                            )}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={request.id}
                        className="relative flex flex-col gap-3 p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-lg"
                        style={{
                          minHeight: 140,
                          cursor:
                            activeTab === "pending" ? "pointer" : undefined,
                        }}
                        onClick={() => setViewRequest(request)}
                      >
                        {/* Header: ID, Date, Status, Tracker (if resolved) */}
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xl font-extrabold text-[#174832]">
                            #{request.id}
                          </span>
                          <span className="text-xs font-medium text-gray-400">
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            {request.status?.toUpperCase() || "PENDING"}
                          </span>
                          {activeTab === "resolved" &&
                            isResolved &&
                            request.tracker && (
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                Tracker: {request.tracker}
                              </span>
                            )}
                        </div>
                        {/* Address details */}
                        {((activeTab === "pending" &&
                          hasAddressDetails(request)) ||
                          (activeTab === "resolved" &&
                            (request as any).address_details)) && (
                          <div className="mb-1 text-xs text-gray-700">
                            <span className="font-semibold">Address:</span>{" "}
                            {(request as any).address_details?.district},{" "}
                            {(request as any).address_details?.city},{" "}
                            {(request as any).address_details?.post}
                            {(request as any).address_details?.road
                              ? `, ${(request as any).address_details.road}`
                              : ""}
                          </div>
                        )}
                        {/* Product Info */}
                        <div className="flex flex-col mb-1 sm:flex-row sm:items-center sm:gap-2">
                          <span className="font-semibold text-gray-700">
                            Product:
                          </span>
                          <a
                            href={request.product_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 underline break-all hover:text-blue-800"
                            title={request.product_url}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {(() => {
                              try {
                                const url = new URL(request.product_url);
                                const domain = url.hostname.replace("www.", "");
                                let path = url.pathname;
                                if (path.length > 20)
                                  path = path.slice(0, 20) + "...";
                                return `${domain}${path}`;
                              } catch {
                                return request.product_url.length > 30
                                  ? request.product_url.slice(0, 30) + "..."
                                  : request.product_url;
                              }
                            })()}
                          </a>
                          <button
                            className="p-1 ml-1 text-gray-400 rounded hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            title="Copy link"
                            aria-label="Copy product link"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyProductUrl(request.product_url);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                              />
                              <rect
                                x="3"
                                y="3"
                                width="13"
                                height="13"
                                rx="2"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                              />
                            </svg>
                          </button>
                        </div>
                        {/* Details Row */}
                        <div className="flex flex-wrap mb-2 text-sm text-gray-700 gap-x-6 gap-y-1">
                          <span>
                            <span className="font-semibold">Quantity:</span>{" "}
                            {request.quantity}
                          </span>
                          <span>
                            <span className="font-semibold">Box:</span>{" "}
                            {hasIsBox(request)
                              ? request.is_box
                                ? "Yes"
                                : "No"
                              : "N/A"}
                          </span>
                          <span className="block w-full sm:w-auto">
                            <span className="font-semibold">Description:</span>{" "}
                            {getShortDescription(request.description)}
                          </span>
                        </div>
                        {/* Resolved extra info (fees, cost, etc.) */}
                        {activeTab === "resolved" && isResolved && (
                          <div className="grid grid-cols-1 gap-2 p-3 mt-3 text-sm bg-gray-50 rounded-xl md:grid-cols-2 lg:grid-cols-3">
                            {isResolved && isUSUser && request.usd_price && (
                              <div>
                                <span className="font-semibold text-gray-600">
                                  USD Price:
                                </span>{" "}
                                ${request.usd_price}
                              </div>
                            )}
                            {isResolved &&
                              !isUSUser &&
                              request.converted_price && (
                                <div>
                                  <span className="font-semibold text-gray-600">
                                    Converted Price:
                                  </span>{" "}
                                  ৳{request.converted_price}
                                </div>
                              )}
                            {isResolved && request.custom_fee && (
                              <div>
                                <span className="font-semibold text-gray-600">
                                  Custom Fee:
                                </span>{" "}
                                {isUSUser ? "$" : "৳"}
                                {request.custom_fee}
                              </div>
                            )}
                            {isResolved && request.tax && (
                              <div>
                                <span className="font-semibold text-gray-600">
                                  Tax:
                                </span>{" "}
                                {isUSUser ? "$" : "৳"}
                                {request.tax}
                              </div>
                            )}
                            {isResolved && request.box_fee && (
                              <div>
                                <span className="font-semibold text-gray-600">
                                  Box Fee:
                                </span>{" "}
                                {isUSUser ? "$" : "৳"}
                                {request.box_fee}
                              </div>
                            )}
                            {isResolved && request.cost && (
                              <div>
                                <span className="font-semibold text-gray-600">
                                  Total Cost:
                                </span>{" "}
                                {isUSUser ? "$" : "৳"}
                                {request.cost}
                              </div>
                            )}
                          </div>
                        )}
                        {/* Delete Button - responsive: absolute on desktop, static bottom on mobile */}
                        {activeTab === "pending" && (
                          <button
                            className="flex items-center self-end gap-1 px-3 py-1 mt-4 text-xs font-semibold text-white bg-red-500 rounded shadow hover:bg-red-600 sm:absolute sm:right-6 sm:top-6 sm:mt-0 w-fit"
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await deleteOrderRequest(request.id);
                                setRequests((prev) =>
                                  prev.filter((r) => r.id !== request.id)
                                );
                              } catch {}
                            }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Delete
                          </button>
                        )}
                        <div className="flex flex-col justify-center items-end gap-2 min-w-[180px]">
                          {((activeTab as TabKey) === "resolved" ||
                            (activeTab as TabKey) === "paid") &&
                            (paymentInProgress ? (
                              <>
                                <span className="flex items-center gap-1 px-4 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                                  <span role="img" aria-label="in-progress">
                                    🟡
                                  </span>{" "}
                                  Payment In Progress
                                </span>
                                <div className="flex gap-2 mt-2">
                                  <button
                                    className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded hover:bg-red-200"
                                    onClick={() =>
                                      tracker &&
                                      handleDeleteManualPayment(tracker)
                                    }
                                  >
                                    Delete
                                  </button>
                                  <button
                                    className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                                    onClick={() =>
                                      tracker &&
                                      setViewRequest({ ...request, tracker })
                                    }
                                  >
                                    View Details
                                  </button>
                                </div>
                              </>
                            ) : request.status?.toLowerCase() === "paid" ||
                              request.status?.toUpperCase() === "PD" ||
                              request.status?.toUpperCase() === "SP" ? (
                              <>
                                {tracker && (
                                  <button
                                    className="px-4 py-2 mt-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        isResolvedRequest(request) &&
                                        request.tracker
                                      ) {
                                        downloadInvoice(request.tracker);
                                      }
                                    }}
                                    title="Download Invoice PDF"
                                  >
                                    Download Invoice
                                  </button>
                                )}
                              </>
                            ) : !showGetIt[request.id] ? (
                              <button
                                className="px-5 py-2 rounded-lg bg-[#174832] text-white font-semibold shadow hover:bg-[#11351f] transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowGetIt((prev) => ({
                                    ...prev,
                                    [request.id]: true,
                                  }));
                                }}
                              >
                                Payone
                              </button>
                            ) : (
                              <button
                                className="px-5 py-2 rounded-lg bg-[#FF4B26] text-white font-semibold shadow hover:bg-[#E63D1A] transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(
                                    `/dashboard/checkout?requestId=${request.id}`
                                  );
                                }}
                              >
                                Get it
                              </button>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Add pagination controls */}
              {currentTotalCount > rowsPerPage &&
                filteredRequests.length > 0 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                      className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    {Array.from(
                      { length: Math.ceil(currentTotalCount / rowsPerPage) },
                      (_, i) => (
                        <button
                          key={i + 1}
                          className={`px-3 py-1 text-sm rounded-lg border ${
                            page === i + 1
                              ? "bg-[#174832] text-white border-[#174832]"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                          } focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2`}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      )
                    )}
                    <button
                      className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        setPage((p) =>
                          Math.min(
                            Math.ceil(currentTotalCount / rowsPerPage),
                            p + 1
                          )
                        )
                      }
                      disabled={
                        page === Math.ceil(currentTotalCount / rowsPerPage)
                      }
                    >
                      Next
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      {/* Payment Details Modal */}
      <Dialog
        open={!!viewRequest}
        onClose={() => setViewRequest(null)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div
            className="fixed inset-0 bg-black opacity-30"
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-lg p-8 mx-auto bg-white rounded-lg shadow-xl">
            <Dialog.Title className="text-xl font-bold mb-4 text-[#174832]">
              Request Details
            </Dialog.Title>
            {viewRequest ? (
              <div className="grid grid-cols-1 text-sm text-gray-800 sm:grid-cols-2 gap-x-8 gap-y-2">
                <div>
                  <b>ID:</b> {viewRequest.id}
                </div>
                <div>
                  <b>Status:</b> {viewRequest.status}
                </div>
                {viewRequest.tracker && (
                  <div>
                    <b>Tracker:</b> {viewRequest.tracker}
                  </div>
                )}
                <div className="sm:col-span-2">
                  <b>Product URL:</b>{" "}
                  <a
                    href={viewRequest.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {viewRequest.product_url}
                  </a>
                </div>
                <div>
                  <b>Quantity:</b> {viewRequest.quantity}
                </div>
                <div>
                  <b>Box:</b>{" "}
                  {viewRequest.is_box !== undefined
                    ? viewRequest.is_box
                      ? "Yes"
                      : "No"
                    : viewRequest.box
                    ? "Yes"
                    : "No"}
                </div>
                <div className="sm:col-span-2">
                  <b>Description:</b> {viewRequest.description}
                </div>
                {(viewRequest.address_details || viewRequest.address) && (
                  <div className="sm:col-span-2">
                    <b>Address:</b>{" "}
                    {
                      (viewRequest.address_details || viewRequest.address)
                        .district
                    }
                    ,{" "}
                    {(viewRequest.address_details || viewRequest.address).city},{" "}
                    {(viewRequest.address_details || viewRequest.address).post}
                    {(viewRequest.address_details || viewRequest.address).road
                      ? `, ${
                          (viewRequest.address_details || viewRequest.address)
                            .road
                        }`
                      : ""}
                  </div>
                )}
                {viewRequest.box_fee !== undefined && (
                  <div>
                    <b>Box Fee:</b> {isUSUser ? "$" : "৳"}
                    {viewRequest.box_fee}
                  </div>
                )}
                {viewRequest.converted_price && (
                  <div>
                    <b>Converted Price:</b> {isUSUser ? "$" : "৳"}
                    {viewRequest.converted_price}
                  </div>
                )}
                {viewRequest.cost !== undefined && (
                  <div>
                    <b>Total Cost:</b> {isUSUser ? "$" : "৳"}
                    {viewRequest.cost}
                  </div>
                )}
                {viewRequest.custom_fee !== undefined && (
                  <div>
                    <b>Custom Fee:</b> {isUSUser ? "$" : "৳"}
                    {viewRequest.custom_fee}
                  </div>
                )}
                {viewRequest.discount !== undefined && (
                  <div>
                    <b>Discount:</b> -{isUSUser ? "$" : "৳"}
                    {viewRequest.discount}
                  </div>
                )}
                {viewRequest.platform_fee !== undefined && (
                  <div>
                    <b>Platform Fee:</b> {isUSUser ? "$" : "৳"}
                    {viewRequest.platform_fee}
                  </div>
                )}
                {viewRequest.tax && (
                  <div>
                    <b>Tax:</b> {isUSUser ? "$" : "৳"}
                    {viewRequest.tax}
                  </div>
                )}
                {viewRequest.usd_price && (
                  <div>
                    <b>USD Price:</b> {isUSUser ? "$" : "৳"}
                    {viewRequest.usd_price}
                  </div>
                )}
                {viewRequest.created_at && (
                  <div>
                    <b>Created At:</b>{" "}
                    {new Date(viewRequest.created_at).toLocaleString()}
                  </div>
                )}
                {viewRequest.updated_at && (
                  <div>
                    <b>Updated At:</b>{" "}
                    {new Date(viewRequest.updated_at).toLocaleString()}
                  </div>
                )}
                {viewRequest.user && (
                  <div className="p-3 mt-2 rounded sm:col-span-2 bg-gray-50">
                    <b>User Info:</b>
                    <br />
                    Name: {viewRequest.user.first_name}{" "}
                    {viewRequest.user.last_name}
                    <br />
                    Email:{" "}
                    <a
                      href={`mailto:${viewRequest.user.email}`}
                      className="text-blue-600 underline"
                    >
                      {viewRequest.user.email}
                    </a>
                    <br />
                    {viewRequest.user.phone && (
                      <>Phone: {viewRequest.user.phone}</>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No details found.
              </div>
            )}
            <button
              className="w-full mt-6 px-4 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f]"
              onClick={() => setViewRequest(null)}
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </ErrorBoundary>
  );
}
