"use client";

import { useState, useEffect } from "react";
import {
  getOrderRequests,
  resolveOrder,
  searchOrders,
  deleteOrderRequest,
} from "@/lib/utils/service/order";
import { toast } from "react-hot-toast";
import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserRegion } from "@/lib/utils/useUserRegion";

interface OrderRequest {
  id: number;
  product_url: string;
  quantity: number;
  description: string;
  box: boolean;
  address: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
}

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
}

// Utility function to truncate URLs
const truncateUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname +
      (urlObj.pathname.length > 20
        ? urlObj.pathname.substring(0, 20) + "..."
        : urlObj.pathname)
    );
  } catch {
    return url.length > 30 ? url.substring(0, 30) + "..." : url;
  }
};

// Add USD to BDT conversion rate
const USD_TO_BDT_RATE = 110; // Example static rate

// Helper to get full address string
function getFullAddress(order: any) {
  if (order.address_details) {
    return `${order.address_details.district}, ${order.address_details.city}, ${
      order.address_details.post
    }${order.address_details.road ? ", " + order.address_details.road : ""}`;
  } else if (typeof order.address === "object" && order.address !== null) {
    return `${order.address.district}, ${order.address.city}, ${
      order.address.post
    }${order.address.road ? ", " + order.address.road : ""}`;
  } else {
    return order.address;
  }
}

export default function ManualRequestsPage() {
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRequest | null>(null);
  const [resolveForm, setResolveForm] = useState<Partial<ResolvedOrder>>({
    usd_price: 0,
    converted_price: 0,
    custom_fee: 0,
    tax: 0,
    box_fee: 0,
    platform_fee: 0,
    discount: 0,
    cost: 0,
    description: "",
  });
  // Add per-field error state
  const [resolveErrors, setResolveErrors] = useState<
    Partial<Record<keyof ResolvedOrder, string>>
  >({});
  // Sorting and filtering state
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("");
  // Pagination state placeholder
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  // Filtering state
  const [customerFilter, setCustomerFilter] = useState("");
  const [sidebarTab, setSidebarTab] = useState<"details" | "resolve">(
    "details"
  );
  const [usdToBdtRate, setUsdToBdtRate] = useState<number>(110); // fallback rate
  const [rateLoading, setRateLoading] = useState<boolean>(false);
  const { countryCode, loading: regionLoading } = useUserRegion();
  const isUSUser = countryCode === "US";

  // Calculate cost from form fields
  const calculateCost = (form: Partial<ResolvedOrder>) => {
    if (isUSUser) {
      return (
        (form.usd_price || 0) +
        (form.custom_fee || 0) +
        (form.tax || 0) +
        (form.box_fee || 0) +
        (form.platform_fee || 0) -
        (form.discount || 0)
      );
    }
    return (
      (form.converted_price || 0) +
      (form.custom_fee || 0) +
      (form.tax || 0) +
      (form.box_fee || 0) +
      (form.platform_fee || 0) -
      (form.discount || 0)
    );
  };

  // Export to CSV
  const handleExportCSV = () => {
    const visibleOrders = getSortedOrders(
      getFilteredOrders(),
      sortBy,
      sortOrder
    );
    if (!visibleOrders.length) {
      toast.error("No data to export");
      return;
    }
    const headers = [
      "Order ID",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Status",
      "Title",
      "Product URL",
      "Quantity",
      "Box",
      "Address",
      "Created At",
      "Updated At",
    ];

    const rows = visibleOrders.map((order) => [
      order.id,
      `${order.user.first_name} ${order.user.last_name}`,
      order.user.email,
      order.user.phone || "",
      "Pending", // You can update this if you have real status
      order.description || "",
      order.product_url,
      order.quantity,
      order.box ? "Yes" : "No",
      getFullAddress(order),
      new Date(order.created_at).toLocaleString(),
      new Date(order.updated_at).toLocaleString(),
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `manual_requests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported!");
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const data = await getOrderRequests(pageNum);
      // If backend returns { count, results }, handle that
      if (data && data.results) {
        const normalized = (data.results || []).map((order: any) => ({
          ...order,
          user:
            typeof order.user === "object"
              ? order.user
              : {
                  id: order.user,
                  first_name: "",
                  last_name: "",
                  email: "",
                  phone: "",
                },
        }));
        setOrders(normalized);
        setTotalCount(data.count || 0);
      } else {
        // fallback for old API
        const normalized = (data.results || []).map((order: any) => ({
          ...order,
          user:
            typeof order.user === "object"
              ? order.user
              : {
                  id: order.user,
                  first_name: "",
                  last_name: "",
                  email: "",
                  phone: "",
                },
        }));
        setOrders(normalized);
        setTotalCount(data.count || 0);
      }
    } catch (err: unknown) {
      if (typeof err === "string") {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch orders");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchOrders();
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchOrders(searchQuery, "request");
      let ordersArray: any[] = [];
      if (
        results &&
        typeof results === "object" &&
        !Array.isArray(results) &&
        "results" in results &&
        Array.isArray((results as any).results)
      ) {
        ordersArray = (results as any).results;
      } else if (Array.isArray(results)) {
        ordersArray = results;
      }
      const normalized = ordersArray.map((order: any) => ({
        ...order,
        user:
          typeof order.user === "object"
            ? order.user
            : {
                id: order.user,
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
              },
      }));
      setOrders(normalized);
      setError(null); // clear error if successful
    } catch (err: unknown) {
      if (typeof err === "string") {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to search orders");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setResolveErrors({}); // clear previous errors
    try {
      const newErrors: Partial<Record<keyof ResolvedOrder, string>> = {};
      if (!resolveForm.usd_price || resolveForm.usd_price <= 0) {
        newErrors.usd_price =
          "USD Price is required and must be greater than 0";
      }
      if (
        !isUSUser &&
        (!resolveForm.converted_price || resolveForm.converted_price <= 0)
      ) {
        newErrors.converted_price =
          "Converted Price is required and must be greater than 0";
      }
      // Repeat for other required fields as needed...

      if (Object.keys(newErrors).length > 0) {
        setResolveErrors(newErrors);
        Object.entries(newErrors).forEach(([field, msg]) =>
          toast.error(`${field}: ${msg}`)
        );
        return;
      }

      const resolvedOrder: ResolvedOrder = {
        order_id: selectedOrder.id,
        product_url: selectedOrder.product_url,
        quantity: selectedOrder.quantity,
        description: selectedOrder.description,
        ...resolveForm,
        converted_price: isUSUser ? 0 : resolveForm.converted_price,
      } as ResolvedOrder;

      await resolveOrder(resolvedOrder);
      toast.success("Order resolved successfully!");
      setSelectedOrder(null);
      fetchOrders();
    } catch (err: any) {
      const responseData = err?.response?.data;
      let fieldErrors: Partial<Record<keyof ResolvedOrder, string>> = {};
      if (responseData) {
        if (typeof responseData.detail === "string") {
          toast.error(responseData.detail);
        } else if (
          typeof responseData === "object" &&
          !Array.isArray(responseData)
        ) {
          Object.entries(responseData).forEach(([field, messages]) => {
            const msg = Array.isArray(messages)
              ? messages.join(", ")
              : messages;
            fieldErrors[field as keyof ResolvedOrder] = msg as string;
            toast.error(`${field}: ${msg}`);
          });
          setResolveErrors(fieldErrors);
        } else {
          toast.error("Failed to resolve order");
        }
      } else {
        toast.error("Failed to resolve order");
      }
    }
  };

  // Helper for sorting
  const getSortedOrders = (
    orders: OrderRequest[],
    sortBy: string,
    sortOrder: "asc" | "desc"
  ) => {
    return [...orders].sort((a, b) => {
      let aValue: any = a[sortBy as keyof OrderRequest];
      let bValue: any = b[sortBy as keyof OrderRequest];
      // Special case for customer name
      if (sortBy === "customer") {
        aValue = `${a.user.first_name} ${a.user.last_name}`.toLowerCase();
        bValue = `${b.user.first_name} ${b.user.last_name}`.toLowerCase();
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Filter orders before sorting
  const getFilteredOrders = () => {
    return orders.filter((order) => {
      // Status filter (for now, only 'Pending' supported)
      if (statusFilter && statusFilter !== "Pending") return false;
      // Customer filter
      const customerName =
        `${order.user.first_name} ${order.user.last_name}`.toLowerCase();
      const customerEmail = order.user.email.toLowerCase();
      if (
        customerFilter &&
        !customerName.includes(customerFilter.toLowerCase()) &&
        !customerEmail.includes(customerFilter.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  };

  const fetchUsdToBdtRate = async () => {
    setRateLoading(true);
    try {
      const res = await fetch(
        "https://api.exchangerate.host/latest?base=USD&symbols=BDT"
      );
      const data = await res.json();
      if (data && data.rates && data.rates.BDT) {
        setUsdToBdtRate(data.rates.BDT);
      }
    } catch (e) {
      toast.error("Failed to fetch USD to BDT rate, using fallback.");
    } finally {
      setRateLoading(false);
    }
  };

  useEffect(() => {
    fetchUsdToBdtRate();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen py-10 bg-gray-50">
        <div className="container px-2 mx-auto sm:px-4">
          <div className="p-4 bg-white shadow-sm rounded-xl sm:p-8">
            <div className="w-1/3 h-8 mb-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-full h-10 mb-6 bg-gray-200 rounded animate-pulse" />
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {[...Array(11)].map((_, i) => (
                      <th key={i} className="px-4 py-3">
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {[...Array(6)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="w-12 h-4 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-32 h-4 bg-gray-200 rounded" />
                        <div className="w-24 h-3 mt-1 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-16 h-4 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-24 h-4 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-40 h-4 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-12 h-4 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-12 h-4 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-12 h-4 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-32 h-4 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-32 h-4 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-16 h-4 bg-gray-200 rounded" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!orders.length) {
    return (
      <div className="min-h-screen py-10 bg-gray-50">
        <div className="container px-2 mx-auto sm:px-4">
          <div className="p-4 bg-white shadow-sm rounded-xl sm:p-8">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="mb-6 text-6xl"
              >
                📦
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-2 text-2xl font-bold text-gray-900"
              >
                No Manual Requests Found
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-gray-500"
              >
                There are no pending manual requests at the moment.
                <br />
                Check back later or try adjusting your filters.
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                  setCustomerFilter("");
                  fetchOrders();
                }}
                className="px-6 py-2.5 bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63D1A] text-sm font-medium transition-colors"
              >
                Reset Filters
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{
        duration: 0.35,
        type: "spring",
        stiffness: 80,
        damping: 20,
      }}
      className="min-h-screen py-6 sm:py-10 bg-[#f7faf9]"
    >
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="p-4 bg-white shadow-lg rounded-2xl sm:p-8">
          <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-[#174832]">
              Manual Requests
            </h1>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportCSV}
                className="px-4 py-2 text-sm font-medium text-white bg-[#174832] rounded-lg hover:bg-[#11351f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
              >
                Export CSV
              </motion.button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username or email"
                  className="w-full px-4 py-2.5 pl-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                />
                <svg
                  className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#174832] rounded-lg hover:bg-[#11351f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
              >
                Search
              </motion.button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mb-6 text-red-700 rounded-lg bg-red-50"
            >
              {error}
            </motion.div>
          )}

          {/* <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
            </select>
            <input
              type="text"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              placeholder="Filter by customer name or email"
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
            />
          </div> */}

          <div className="overflow-x-auto border border-gray-200 rounded-lg lg:overflow-x-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-4 py-3 text-xs font-semibold text-left text-gray-700 transition-colors cursor-pointer select-none hover:bg-gray-100"
                    onClick={() => {
                      setSortBy("id");
                      setSortOrder(
                        sortBy === "id" && sortOrder === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    Order ID{" "}
                    {sortBy === "id" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-semibold text-left text-gray-700 transition-colors cursor-pointer select-none hover:bg-gray-100"
                    onClick={() => {
                      setSortBy("customer");
                      setSortOrder(
                        sortBy === "customer" && sortOrder === "asc"
                          ? "desc"
                          : "asc"
                      );
                    }}
                  >
                    Customer Info{" "}
                    {sortBy === "customer" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-left text-gray-700">
                    Status
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-semibold text-left text-gray-700 transition-colors cursor-pointer select-none hover:bg-gray-100"
                    onClick={() => {
                      setSortBy("description");
                      setSortOrder(
                        sortBy === "description" && sortOrder === "asc"
                          ? "desc"
                          : "asc"
                      );
                    }}
                  >
                    Title{" "}
                    {sortBy === "description" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-center text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <AnimatePresence>
                  {getSortedOrders(getFilteredOrders(), sortBy, sortOrder).map(
                    (order, idx) => {
                      const isSelected =
                        selectedOrder && order.id === selectedOrder.id;
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{
                            delay: idx * 0.03,
                            duration: 0.25,
                            type: "spring",
                            stiffness: 100,
                          }}
                          whileHover={{
                            scale: 1.01,
                            boxShadow: "0 4px 24px 0 rgba(23, 72, 50, 0.08)",
                          }}
                          className={`group transition-colors cursor-pointer hover:bg-[#174832]/5 ${
                            isSelected ? "bg-[#174832]/10" : ""
                          }`}
                          style={{ transformOrigin: "center" }}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <div className="font-medium text-gray-900">
                              {order.user.first_name} {order.user.last_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.user.email}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          </td>
                          <td
                            className="px-4 py-3 text-sm text-gray-700 max-w-[100px] truncate whitespace-nowrap overflow-hidden"
                            title={order.description}
                          >
                            {order.description
                              ? order.description.length > 8
                                ? order.description.slice(0, 8) + "…"
                                : order.description
                              : "-"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                              <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(order);
                                }}
                                className="px-4 py-1 text-xs font-semibold rounded bg-[#174832] text-white hover:bg-[#11351f] transition"
                                aria-label="Resolve Order"
                                title="Resolve Order"
                              >
                                Resolve
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (
                                    !window.confirm(
                                      "Are you sure you want to delete this order?"
                                    )
                                  )
                                    return;
                                  try {
                                    await deleteOrderRequest(order.id);
                                    setOrders((prev) =>
                                      prev.filter((o) => o.id !== order.id)
                                    );
                                    toast.success(
                                      "Order deleted successfully!"
                                    );
                                  } catch (err) {
                                    toast.error("Failed to delete order");
                                  }
                                }}
                                className="px-4 py-1 text-xs font-semibold text-white transition bg-red-500 rounded hover:bg-red-600"
                                aria-label="Delete Order"
                                title="Delete Order"
                              >
                                Delete
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    }
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {totalCount > rowsPerPage && (
            <div className="flex justify-center gap-2 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </motion.button>
              {Array.from(
                { length: Math.ceil(totalCount / rowsPerPage) },
                (_, i) => (
                  <motion.button
                    key={i + 1}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 text-sm rounded-lg border ${
                      page === i + 1
                        ? "bg-[#174832] text-white border-[#174832]"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </motion.button>
                )
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
                onClick={() =>
                  setPage((p) =>
                    Math.min(Math.ceil(totalCount / rowsPerPage), p + 1)
                  )
                }
                disabled={page === Math.ceil(totalCount / rowsPerPage)}
              >
                Next
              </motion.button>
            </div>
          )}
        </div>

        {/* Sidebar Drawer */}
        {selectedOrder && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex"
            >
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 transition-opacity bg-black/20 backdrop-blur-sm"
                onClick={() => setSelectedOrder(null)}
              />
              {/* Sidebar */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 40,
                }}
                className="relative flex flex-col w-full h-full max-w-md p-6 ml-auto overflow-y-auto bg-white shadow-xl"
                role="dialog"
                aria-modal="true"
                aria-label="Order Sidebar"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#174832]">
                    Resolve Order #{selectedOrder.id}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 transition-colors hover:text-gray-700"
                    aria-label="Close sidebar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>

                {/* Tabs */}
                <div className="flex mb-6 border-b">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 text-sm font-medium focus:outline-none border-b-2 transition-colors ${
                      sidebarTab === "details"
                        ? "border-[#174832] text-[#174832]"
                        : "border-transparent text-gray-600 hover:text-[#174832]"
                    }`}
                    onClick={() => setSidebarTab("details")}
                  >
                    Order Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`ml-2 px-4 py-2 text-sm font-medium focus:outline-none border-b-2 transition-colors ${
                      sidebarTab === "resolve"
                        ? "border-[#174832] text-[#174832]"
                        : "border-transparent text-gray-600 hover:text-[#174832]"
                    }`}
                    onClick={() => setSidebarTab("resolve")}
                  >
                    Resolve
                  </motion.button>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {sidebarTab === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="mb-2 text-sm font-medium text-gray-700">
                          Customer Info
                        </div>
                        <div className="text-sm text-gray-900">
                          {selectedOrder.user.first_name}{" "}
                          {selectedOrder.user.last_name}
                        </div>
                        <div className="text-xs text-gray-600">
                          Phone: {selectedOrder.user.phone || "-"}
                        </div>
                        <div className="text-xs text-gray-600">
                          Email: {selectedOrder.user.email}
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="mb-2 text-sm font-medium text-gray-700">
                          Product URL
                        </div>
                        <a
                          href={selectedOrder.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#174832] underline break-all hover:text-[#11351f]"
                        >
                          {selectedOrder.product_url}
                        </a>
                      </div>

                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="mb-2 text-sm font-medium text-gray-700">
                          Description
                        </div>
                        <div className="text-xs text-gray-900">
                          {selectedOrder.description || "-"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-gray-50">
                          <div className="mb-2 text-sm font-medium text-gray-700">
                            Quantity
                          </div>
                          <div className="text-xs text-gray-900">
                            {selectedOrder.quantity}
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-gray-50">
                          <div className="mb-2 text-sm font-medium text-gray-700">
                            Box Required
                          </div>
                          <div className="text-xs text-gray-900">
                            {(
                              "is_box" in selectedOrder
                                ? selectedOrder.is_box
                                : selectedOrder.box
                            )
                              ? "Yes"
                              : "No"}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="mb-2 text-sm font-medium text-gray-700">
                          Address
                        </div>
                        <div className="text-xs text-gray-900">
                          {getFullAddress(selectedOrder)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-gray-50">
                          <div className="mb-2 text-sm font-medium text-gray-700">
                            Created At
                          </div>
                          <div className="text-xs text-gray-900">
                            {new Date(
                              selectedOrder.created_at
                            ).toLocaleString()}
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-gray-50">
                          <div className="mb-2 text-sm font-medium text-gray-700">
                            Updated At
                          </div>
                          <div className="text-xs text-gray-900">
                            {new Date(
                              selectedOrder.updated_at
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="mb-4 text-sm font-semibold text-gray-700">
                          Order Timeline
                        </div>
                        <ul className="pl-4 space-y-4 border-l-2 border-gray-200">
                          <li>
                            <div className="text-xs text-gray-500">
                              {new Date(
                                selectedOrder.created_at
                              ).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-900">
                              Order Created
                            </div>
                          </li>
                          <li>
                            <div className="text-xs text-gray-500">
                              {new Date(
                                selectedOrder.updated_at
                              ).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-900">
                              Last Updated
                            </div>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {sidebarTab === "resolve" && (
                    <motion.div
                      key="resolve"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <form
                        onSubmit={handleResolve}
                        className="flex flex-col justify-end flex-1 space-y-4"
                      >
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              USD Price
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={resolveForm.usd_price || ""}
                              onChange={(e) => {
                                const usd = parseFloat(e.target.value);
                                setResolveForm((prev) => {
                                  const updated = {
                                    ...prev,
                                    usd_price: usd,
                                    converted_price:
                                      !isUSUser && usd > 0
                                        ? parseFloat(
                                            (usd * usdToBdtRate).toFixed(2)
                                          )
                                        : prev.converted_price,
                                  };
                                  updated.cost = calculateCost(updated);
                                  return updated;
                                });
                                setResolveErrors((prev) => ({
                                  ...prev,
                                  usd_price: undefined,
                                  converted_price: undefined,
                                }));
                              }}
                              className={`block w-full px-3 py-2 text-sm border ${
                                resolveErrors.usd_price
                                  ? "border-red-400"
                                  : "border-gray-200"
                              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent`}
                            />
                            {rateLoading && !isUSUser && (
                              <div className="mt-1 text-xs text-blue-600">
                                Fetching latest USD→BDT rate...
                              </div>
                            )}
                            {!isUSUser && (
                              <div className="mt-1 text-xs text-gray-500">
                                Current rate: 1 USD = {usdToBdtRate} BDT
                              </div>
                            )}
                            {resolveErrors.usd_price && (
                              <div className="mt-1 text-xs text-red-600">
                                {resolveErrors.usd_price}
                              </div>
                            )}
                          </div>
                          {!isUSUser && (
                            <div>
                              <label className="block mb-1 text-sm font-medium text-gray-700">
                                Converted Price (BDT)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={resolveForm.converted_price || ""}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  setResolveForm((prev) => {
                                    const updated = {
                                      ...prev,
                                      converted_price: value,
                                    };
                                    updated.cost = calculateCost(updated);
                                    return updated;
                                  });
                                  setResolveErrors((prev) => ({
                                    ...prev,
                                    converted_price: undefined,
                                  }));
                                }}
                                className={`block w-full px-3 py-2 text-sm border ${
                                  resolveErrors.converted_price
                                    ? "border-red-400"
                                    : "border-gray-200"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent`}
                              />
                              {resolveErrors.converted_price && (
                                <div className="mt-1 text-xs text-red-600">
                                  {resolveErrors.converted_price}
                                </div>
                              )}
                            </div>
                          )}
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Custom Fee
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={resolveForm.custom_fee || ""}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setResolveForm((prev) => {
                                  const updated = {
                                    ...prev,
                                    custom_fee: value,
                                  };
                                  updated.cost = calculateCost(updated);
                                  return updated;
                                });
                                setResolveErrors((prev) => ({
                                  ...prev,
                                  custom_fee: undefined,
                                }));
                              }}
                              className={`block w-full px-3 py-2 text-sm border ${
                                resolveErrors.custom_fee
                                  ? "border-red-400"
                                  : "border-gray-200"
                              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent`}
                            />
                            {resolveErrors.custom_fee && (
                              <div className="mt-1 text-xs text-red-600">
                                {resolveErrors.custom_fee}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Tax
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={resolveForm.tax || ""}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setResolveForm((prev) => {
                                  const updated = { ...prev, tax: value };
                                  updated.cost = calculateCost(updated);
                                  return updated;
                                });
                                setResolveErrors((prev) => ({
                                  ...prev,
                                  tax: undefined,
                                }));
                              }}
                              className={`block w-full px-3 py-2 text-sm border ${
                                resolveErrors.tax
                                  ? "border-red-400"
                                  : "border-gray-200"
                              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent`}
                            />
                            {resolveErrors.tax && (
                              <div className="mt-1 text-xs text-red-600">
                                {resolveErrors.tax}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Box Fee
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={resolveForm.box_fee || ""}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setResolveForm((prev) => {
                                  const updated = { ...prev, box_fee: value };
                                  updated.cost = calculateCost(updated);
                                  return updated;
                                });
                                setResolveErrors((prev) => ({
                                  ...prev,
                                  box_fee: undefined,
                                }));
                              }}
                              className={`block w-full px-3 py-2 text-sm border ${
                                resolveErrors.box_fee
                                  ? "border-red-400"
                                  : "border-gray-200"
                              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent`}
                            />
                            {resolveErrors.box_fee && (
                              <div className="mt-1 text-xs text-red-600">
                                {resolveErrors.box_fee}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Platform Fee
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={resolveForm.platform_fee || ""}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setResolveForm((prev) => {
                                  const updated = {
                                    ...prev,
                                    platform_fee: value,
                                  };
                                  updated.cost = calculateCost(updated);
                                  return updated;
                                });
                                setResolveErrors((prev) => ({
                                  ...prev,
                                  platform_fee: undefined,
                                }));
                              }}
                              className={`block w-full px-3 py-2 text-sm border ${
                                resolveErrors.platform_fee
                                  ? "border-red-400"
                                  : "border-gray-200"
                              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent`}
                            />
                            {resolveErrors.platform_fee && (
                              <div className="mt-1 text-xs text-red-600">
                                {resolveErrors.platform_fee}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Discount
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={resolveForm.discount || ""}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setResolveForm((prev) => {
                                  const updated = { ...prev, discount: value };
                                  updated.cost = calculateCost(updated);
                                  return updated;
                                });
                                setResolveErrors((prev) => ({
                                  ...prev,
                                  discount: undefined,
                                }));
                              }}
                              className={`block w-full px-3 py-2 text-sm border ${
                                resolveErrors.discount
                                  ? "border-red-400"
                                  : "border-gray-200"
                              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent`}
                            />
                            {resolveErrors.discount && (
                              <div className="mt-1 text-xs text-red-600">
                                {resolveErrors.discount}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <input
                              type="text"
                              value={resolveForm.description || ""}
                              onChange={(e) => {
                                setResolveForm((prev) => {
                                  const updated = {
                                    ...prev,
                                    description: e.target.value,
                                  };
                                  updated.cost = calculateCost(updated);
                                  return updated;
                                });
                                setResolveErrors((prev) => ({
                                  ...prev,
                                  description: undefined,
                                }));
                              }}
                              className={`block w-full px-3 py-2 text-sm border ${
                                resolveErrors.description
                                  ? "border-red-400"
                                  : "border-gray-200"
                              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent`}
                            />
                            {resolveErrors.description && (
                              <div className="mt-1 text-xs text-red-600">
                                {resolveErrors.description}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-4 mt-2 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex justify-between mb-1 text-xs">
                            <span className="text-gray-600">
                              {isUSUser ? "USD Price:" : "Converted Price:"}
                            </span>
                            <span className="font-medium">
                              {isUSUser ? "$" : "৳"}
                              {isUSUser
                                ? resolveForm.usd_price || 0
                                : resolveForm.converted_price || 0}
                            </span>
                          </div>
                          <div className="flex justify-between mb-1 text-xs">
                            <span className="text-gray-600">Custom Fee:</span>
                            <span className="font-medium">
                              {isUSUser ? "$" : "৳"}
                              {resolveForm.custom_fee || 0}
                            </span>
                          </div>
                          <div className="flex justify-between mb-1 text-xs">
                            <span className="text-gray-600">Tax:</span>
                            <span className="font-medium">
                              {isUSUser ? "$" : "৳"}
                              {resolveForm.tax || 0}
                            </span>
                          </div>
                          <div className="flex justify-between mb-1 text-xs">
                            <span className="text-gray-600">Box Fee:</span>
                            <span className="font-medium">
                              {isUSUser ? "$" : "৳"}
                              {resolveForm.box_fee || 0}
                            </span>
                          </div>
                          <div className="flex justify-between mb-1 text-xs">
                            <span className="text-gray-600">Platform Fee:</span>
                            <span className="font-medium">
                              {isUSUser ? "$" : "৳"}
                              {resolveForm.platform_fee || 0}
                            </span>
                          </div>
                          <div className="flex justify-between mb-1 text-xs">
                            <span className="text-gray-600">Discount:</span>
                            <span className="font-medium">
                              -{isUSUser ? "$" : "৳"}
                              {resolveForm.discount || 0}
                            </span>
                          </div>
                          <div className="pt-2 mt-2 border-t border-gray-200">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900">
                                Total Cost:
                              </span>
                              <span className="font-bold text-[#174832] text-base">
                                {isUSUser ? "$" : "৳"}
                                {resolveForm.cost || 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full px-6 py-2.5 text-sm font-medium text-white bg-[#174832] rounded-lg hover:bg-[#11351f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
                        >
                          Resolve Order
                        </motion.button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
