import React from "react";
import { useState, useEffect, Fragment } from "react";
import {
  getResolvedOrders,
  updateOrderStatus,
  deleteResolvedOrder,
  searchOrders,
  ResolvedOrder,
  OrderStatus,
} from "@/lib/utils/service/order";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const statusLabels: Record<OrderStatus, string> = {
  AC: "Accepted",
  CN: "Canceled",
  PD: "Payment Done",
  SP: "Shipped",
  UR: "User Received",
};

const statusColors: Record<OrderStatus, string> = {
  PD: "bg-yellow-100 text-yellow-800",
  AC: "bg-green-100 text-green-800",
  CN: "bg-red-100 text-red-800",
  SP: "bg-blue-100 text-blue-800",
  UR: "bg-purple-100 text-purple-800",
};

// Add status icons
const statusIcons: Record<OrderStatus, React.ReactNode> = {
  AC: (
    <svg
      className="inline w-5 h-5 mr-1 text-green-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4"
      />
    </svg>
  ),
  CN: (
    <svg
      className="inline w-5 h-5 mr-1 text-red-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 9l-6 6M9 9l6 6"
      />
    </svg>
  ),
  PD: (
    <svg
      className="inline w-5 h-5 mr-1 text-yellow-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6l4 2"
      />
    </svg>
  ),
  SP: (
    <svg
      className="inline w-5 h-5 mr-1 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="13"
        width="18"
        height="6"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 13V9a4 4 0 00-8 0v4"
      />
      <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="17.5" r="1.5" fill="currentColor" />
    </svg>
  ),
  UR: (
    <svg
      className="inline w-5 h-5 mr-1 text-purple-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 3v4M8 3v4M3 10h18"
      />
      <rect x="8" y="12" width="8" height="5" rx="1" fill="currentColor" />
    </svg>
  ),
};

// Helper to render address
const renderAddress = (address: any) => {
  if (!address) return "N/A";
  if (typeof address === "object") {
    console.log("Sidebar address:", address); // Debug
    return (
      <div>
        <div>
          <span className="font-semibold">Road:</span> {address.road || "N/A"}
        </div>
        <div>
          <span className="font-semibold">City:</span> {address.city || "N/A"}
        </div>
        <div>
          <span className="font-semibold">District:</span>{" "}
          {address.district || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Post:</span> {address.post || "N/A"}
        </div>
      </div>
    );
  }
  return address;
};

// Helper to truncate product URL for table
const truncateUrl = (url: string) => {
  try {
    const u = new URL(url);
    const domain = u.hostname.replace("www.", "");
    const path =
      u.pathname.length > 16 ? u.pathname.slice(0, 16) + "…" : u.pathname;
    return `${domain}${path}`;
  } catch {
    return url.length > 24 ? url.slice(0, 24) + "…" : url;
  }
};

// --- Loading Skeletons ---
const TableSkeleton = () => (
  <tbody>
    {[...Array(6)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-4 py-3">
          <div className="w-12 h-4 bg-gray-200 rounded" />
        </td>
        <td className="px-4 py-3">
          <div className="w-32 h-4 bg-gray-200 rounded" />
        </td>
        <td className="px-4 py-3">
          <div className="w-20 h-4 bg-gray-200 rounded" />
        </td>
        <td className="px-4 py-3">
          <div className="w-24 h-4 bg-gray-200 rounded" />
        </td>
        <td className="px-4 py-3">
          <div className="w-16 h-4 bg-gray-200 rounded" />
        </td>
        <td className="px-4 py-3">
          <div className="w-16 h-4 bg-gray-200 rounded" />
        </td>
      </tr>
    ))}
  </tbody>
);

const SidebarSkeleton: React.FC = () => (
  <div className="p-6 animate-pulse">
    <div className="w-2/3 h-6 mb-6 bg-gray-200 rounded" />
    {[...Array(6)].map((_, i) => (
      <div key={i} className="mb-4">
        <div className="w-1/3 h-4 mb-2 bg-gray-200 rounded" />
        <div className="w-2/3 h-4 bg-gray-100 rounded" />
      </div>
    ))}
    <div className="w-full h-10 mt-8 bg-gray-200 rounded" />
  </div>
);

export default function ResolvedOrders() {
  const [orders, setOrders] = useState<ResolvedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ResolvedOrder | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusEditId, setStatusEditId] = useState<number | null>(null);
  const [statusEditValue, setStatusEditValue] = useState<OrderStatus | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (pageNum = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getResolvedOrders(pageNum);
      // If backend returns { count, results }, handle that
      if (data && data.results) {
        const normalized = data.results.map((order: any) => ({
          ...order,
          order_id: order.order_id ?? (order as any).id,
        }));
        setOrders(normalized);
        setTotalCount(data.count || 0);
      } else {
        // fallback for old API
        const normalized = (Array.isArray(data) ? data : []).map(
          (order: any) => ({
            ...order,
            order_id: order.order_id ?? (order as any).id,
          })
        );
        setOrders(normalized);
        setTotalCount(normalized.length);
      }
    } catch (err) {
      setError("Failed to fetch orders");
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
      const results = await searchOrders(searchQuery, "resolved");
      if (
        results &&
        typeof results === "object" &&
        !Array.isArray(results) &&
        "results" in results &&
        Array.isArray((results as any).results)
      ) {
        setOrders((results as any).results as ResolvedOrder[]);
        setTotalCount(
          (results as any).count || (results as any).results.length
        );
      } else if (Array.isArray(results)) {
        setOrders(results as ResolvedOrder[]);
        setTotalCount(results.length);
      } else {
        setOrders([]);
        setTotalCount(0);
      }
    } catch (err) {
      setError("Failed to search orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders(); // Refresh the list
      toast.success("Order status updated successfully!");
      setStatusEditId(null);
      setStatusEditValue(null);
    } catch (err) {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper to get the order ID
  const getOrderId = (order: ResolvedOrder) =>
    order.order_id ?? (order as any).id;

  const handleDelete = async (orderId: number | undefined) => {
    if (!orderId) {
      toast.error("Order ID is missing. Cannot delete order.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      await deleteResolvedOrder(orderId);
      await fetchOrders(); // Refresh the list
      toast.success("Order deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  // Sorting logic
  const sortedOrders = React.useMemo(() => {
    if (!sortBy) return orders;
    const sorted = [...orders].sort((a, b) => {
      let aValue: any = a;
      let bValue: any = b;
      switch (sortBy) {
        case "order_id":
          aValue = getOrderId(a);
          bValue = getOrderId(b);
          break;
        case "product_url":
          aValue = a.product_url || "";
          bValue = b.product_url || "";
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        case "customer":
          aValue = a.user
            ? `${a.user.first_name || ""} ${a.user.last_name || ""}`.trim() ||
              a.user.email
            : "";
          bValue = b.user
            ? `${b.user.first_name || ""} ${b.user.last_name || ""}`.trim() ||
              b.user.email
            : "";
          break;
        case "created_at":
          aValue = (a as any).created_at || "";
          bValue = (b as any).created_at || "";
          break;
        default:
          break;
      }
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [orders, sortBy, sortDirection]);

  // Sorting handler
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="w-full overflow-x-auto ">
          <table
            className="min-w-full text-sm bg-white divide-y divide-gray-200 shadow-lg table-fixed rounded-xl md:text-base"
            aria-label="Resolved Orders Table"
          >
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-700 uppercase md:text-sm">
                  Order ID
                </th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-700 uppercase md:text-sm">
                  Product
                </th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-700 uppercase md:text-sm">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-700 uppercase md:text-sm">
                  Customer
                </th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-700 uppercase md:text-sm">
                  Created
                </th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-700 uppercase md:text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <TableSkeleton />
          </table>
        </div>
        {/* Sidebar skeleton if sidebar is open */}
        {selectedOrder && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <div className="relative flex flex-col w-full h-full max-w-md p-4 ml-auto overflow-y-auto text-base bg-white border-l border-gray-200 shadow-2xl sm:p-8 rounded-l-xl md:rounded-l-xl md:max-w-[600px] sm:w-full sm:text-base">
              <SidebarSkeleton />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <svg
          width="80"
          height="80"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#e53e3e"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#fee2e2"
            strokeWidth="4"
            fill="none"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M15 9l-6 6M9 9l6 6"
          />
        </svg>
        <div className="text-lg font-semibold text-red-600">{error}</div>
        <button
          onClick={() => fetchOrders(page)}
          className="px-6 py-2 bg-[#174832] text-white rounded-lg shadow hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2 font-semibold"
        >
          Retry
        </button>
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
      className="max-w-full p-2 space-y-4 sm:p-4"
    >
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-2 mb-4 sm:flex-row"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by email, username, or tracker ID..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent text-base"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.06, backgroundColor: "#215c3a" }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-2 bg-[#174832] text-white rounded-lg shadow-md hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2 font-semibold text-base transition-colors focus-visible:ring-4 focus-visible:ring-[#174832]"
          aria-label="Search orders"
        >
          <span className="sr-only">Search</span>
          <svg
            className="inline-block w-5 h-5 mr-2 align-text-bottom"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          Search
        </motion.button>
      </form>

      {/* Table Layout */}
      <div className="w-full overflow-x-auto lg:overflow-x-hidden">
        <table
          className="min-w-full text-sm bg-white divide-y divide-gray-200 shadow-lg table-fixed rounded-xl md:text-base"
          aria-label="Resolved Orders Table"
        >
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-700 uppercase md:text-sm">
                Order ID
              </th>
              <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-700 uppercase md:text-sm">
                Product
              </th>
              <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-700 uppercase md:text-sm">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-700 uppercase md:text-sm">
                Customer
              </th>
              <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-700 uppercase md:text-sm">
                Created
              </th>
              <th className="px-4 py-3 text-xs font-bold tracking-wide text-left text-gray-700 uppercase md:text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sortedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg
                      width="56"
                      height="56"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#cbd5e1"
                    >
                      <rect
                        x="4"
                        y="7"
                        width="16"
                        height="10"
                        rx="2"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                        fill="#f1f5f9"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 11h8M8 15h4"
                        stroke="#94a3b8"
                      />
                      <circle cx="8.5" cy="10.5" r=".5" fill="#94a3b8" />
                    </svg>
                    <div className="text-lg font-semibold text-gray-400">
                      No resolved orders found
                    </div>
                    <div className="text-sm text-gray-400">
                      All resolved orders will appear here when available.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sortedOrders.map((order, idx) => {
                const isSelected =
                  selectedOrder &&
                  getOrderId(order) === getOrderId(selectedOrder);
                return (
                  <motion.tr
                    key={getOrderId(order)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      delay: idx * 0.03,
                      duration: 0.25,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{
                      scale: 1.01,
                      boxShadow: "0 4px 24px 0 rgba(23,72,50,0.08)",
                    }}
                    className={`group transition-colors cursor-pointer hover:bg-orange-50 ${
                      isSelected ? "bg-orange-100" : ""
                    }`}
                    style={{ transformOrigin: "center" }}
                    onMouseEnter={() => setSelectedRowId(getOrderId(order))}
                    onMouseLeave={() => setSelectedRowId(null)}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {getOrderId(order)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 break-all max-w-[160px] truncate whitespace-nowrap overflow-hidden">
                      <span
                        title={order.product_url}
                        aria-label={order.product_url}
                        className="cursor-help"
                      >
                        {truncateUrl(order.product_url)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                          statusColors[order.status || "PD"]
                        }`}
                        title={statusLabels[order.status || "PD"]}
                        aria-label={`Status: ${
                          statusLabels[order.status || "PD"]
                        }`}
                        tabIndex={0}
                        role="img"
                        data-tooltip-id={`status-tooltip-${getOrderId(order)}`}
                      >
                        <span
                          className="mr-1"
                          title={statusLabels[order.status || "PD"]}
                          aria-label={statusLabels[order.status || "PD"]}
                        >
                          {statusIcons[order.status || "PD"]}
                        </span>
                        {statusLabels[order.status || "PD"]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {order.user
                        ? `${order.user.first_name || ""} ${
                            order.user.last_name || ""
                          }`.trim() || order.user.email
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {(order as any).created_at
                        ? new Date(
                            (order as any).created_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2 transition-opacity opacity-60 group-hover:opacity-100">
                        {/* View (open sidebar) */}
                        <motion.button
                          whileHover={{
                            scale: 1.12,
                            backgroundColor: "#e0f2f1",
                          }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 text-blue-600 rounded hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-400"
                          aria-label="View Details"
                          title="View Details"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <title>View Details</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls below the table */}
      {totalCount > rowsPerPage && (
        <div className="flex justify-center gap-2 mt-4">
          <motion.button
            className="px-3 py-1 text-xs font-medium transition-colors bg-white border border-gray-300 rounded-lg shadow-sm md:text-sm hover:bg-gray-100"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            whileHover={{ scale: 1.06, backgroundColor: "#e0f2f1" }}
            whileTap={{ scale: 0.97 }}
          >
            Prev
          </motion.button>
          {Array.from(
            { length: Math.ceil(totalCount / rowsPerPage) },
            (_, i) => (
              <motion.button
                key={i + 1}
                className={`px-3 py-1 text-xs md:text-sm rounded-lg border font-semibold transition-colors shadow-sm ${
                  page === i + 1
                    ? "bg-[#174832] text-white border-[#174832]"
                    : "bg-white border-gray-300 hover:bg-gray-100 text-[#174832]"
                }`}
                onClick={() => setPage(i + 1)}
                whileHover={{ scale: 1.06, backgroundColor: "#e0f2f1" }}
                whileTap={{ scale: 0.97 }}
              >
                {i + 1}
              </motion.button>
            )
          )}
          <motion.button
            className="px-3 py-1 text-xs font-medium transition-colors bg-white border border-gray-300 rounded-lg shadow-sm md:text-sm hover:bg-gray-100"
            onClick={() =>
              setPage((p) =>
                Math.min(Math.ceil(totalCount / rowsPerPage), p + 1)
              )
            }
            disabled={page === Math.ceil(totalCount / rowsPerPage)}
            whileHover={{ scale: 1.06, backgroundColor: "#e0f2f1" }}
            whileTap={{ scale: 0.97 }}
          >
            Next
          </motion.button>
        </div>
      )}

      {/* Sidebar Drawer */}
      {selectedOrder && (
        <AnimatePresence>
          <div className="fixed inset-0 z-40 flex">
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            />
            {/* Sidebar */}
            <motion.div
              key="sidebar"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="relative flex flex-col w-full h-full max-w-md p-4 ml-auto overflow-y-auto text-base bg-white border-l border-gray-200 shadow-2xl sm:p-8 rounded-l-xl md:rounded-l-xl md:max-w-[600px] sm:w-full sm:text-base"
              role="dialog"
              aria-modal="true"
              aria-label="Order Sidebar"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#174832] tracking-tight">
                  Resolved Order #{getOrderId(selectedOrder)}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#174832] rounded-full p-1"
                  aria-label="Close sidebar"
                  title="Close sidebar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <title>Close sidebar</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {/* Order Info */}
              <div className="mb-6">
                <div className="mb-3 text-lg font-bold text-[#174832] tracking-tight uppercase">
                  Order Info
                </div>
                <div className="mb-1 text-xs font-semibold text-gray-500">
                  Order ID
                </div>
                <div className="mb-3 text-base font-medium text-gray-900">
                  {getOrderId(selectedOrder)}
                </div>
                <div className="mb-1 text-xs font-semibold text-gray-500">
                  Product URL
                </div>
                <div className="mb-3 text-sm text-blue-600 underline break-all">
                  <a
                    href={selectedOrder.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Full product URL"
                  >
                    {selectedOrder.product_url || "N/A"}
                  </a>
                </div>
                <div className="mb-1 text-xs font-semibold text-gray-500">
                  Description
                </div>
                <div className="mb-3 text-base text-gray-900">
                  {selectedOrder.description || "N/A"}
                </div>
                <div className="grid grid-cols-2 mb-3 gap-x-4 gap-y-2">
                  <div>
                    <div className="text-xs font-semibold text-gray-500">
                      Quantity
                    </div>
                    <div className="text-base text-gray-900">
                      {selectedOrder.quantity ?? "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500">
                      Box Fee
                    </div>
                    <div className="text-base text-gray-900">
                      {selectedOrder.box_fee ?? "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500">
                      Custom Fee
                    </div>
                    <div className="text-base text-gray-900">
                      {selectedOrder.custom_fee ?? "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500">
                      Tax
                    </div>
                    <div className="text-base text-gray-900">
                      {selectedOrder.tax ?? "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500">
                      Cost
                    </div>
                    <div className="text-base text-gray-900">
                      {selectedOrder.cost ?? "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500">
                      USD Price
                    </div>
                    <div className="text-base text-gray-900">
                      {selectedOrder.usd_price ?? "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500">
                      Converted Price (BDT)
                    </div>
                    <div className="text-base text-gray-900">
                      {selectedOrder.converted_price ?? "N/A"}
                    </div>
                  </div>
                </div>
                <div className="mb-1 text-xs font-semibold text-gray-500">
                  Status
                </div>
                <span
                  className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-full ${
                    statusColors[selectedOrder.status || "PD"]
                  } shadow-sm mb-3`}
                  title={statusLabels[selectedOrder.status || "PD"]}
                  aria-label={`Status: ${
                    statusLabels[selectedOrder.status || "PD"]
                  }`}
                  tabIndex={0}
                  role="img"
                  data-tooltip-id={`sidebar-status-tooltip-${getOrderId(
                    selectedOrder
                  )}`}
                >
                  <span
                    className="mr-2"
                    title={statusLabels[selectedOrder.status || "PD"]}
                    aria-label={statusLabels[selectedOrder.status || "PD"]}
                  >
                    {statusIcons[selectedOrder.status || "PD"]}
                  </span>
                  {statusLabels[selectedOrder.status || "PD"]}
                </span>
              </div>
              <hr className="my-4 border-gray-200" />
              {/* Tracker */}
              <div className="mb-6">
                <div className="mb-2 text-lg font-bold text-[#174832] tracking-tight uppercase">
                  Tracker
                </div>
                <div className="mb-3 text-base text-gray-900">
                  {(selectedOrder as any).tracker || "N/A"}
                </div>
              </div>
              <hr className="my-4 border-gray-200" />
              {/* Address */}
              <div className="mb-6">
                <div className="mb-2 text-lg font-bold text-[#174832] tracking-tight uppercase">
                  Address
                </div>
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {renderAddress((selectedOrder as any).address)}
                </div>
              </div>
              <hr className="my-4 border-gray-200" />
              {/* Customer Info */}
              <div className="mb-6">
                <div className="mb-2 text-lg font-bold text-[#174832] tracking-tight uppercase">
                  Customer Info
                </div>
                <div className="mb-1 text-xs font-semibold text-gray-500">
                  Name
                </div>
                <div className="mb-3 text-base text-gray-900">
                  {selectedOrder.user
                    ? `${selectedOrder.user.first_name || ""} ${
                        selectedOrder.user.last_name || ""
                      }`.trim() || selectedOrder.user.email
                    : "-"}
                </div>
                <div className="mb-1 text-xs font-semibold text-gray-500">
                  Email
                </div>
                <div className="mb-3 text-base text-gray-900">
                  {selectedOrder.user?.email || "-"}
                </div>
                <div className="mb-1 text-xs font-semibold text-gray-500">
                  Phone
                </div>
                <div className="mb-3 text-base text-gray-900">
                  {selectedOrder.user?.phone || "-"}
                </div>
              </div>
              <hr className="my-4 border-gray-200" />
              {/* Timeline/History */}
              <div className="mb-6">
                <div className="mb-2 text-lg font-bold text-[#174832] tracking-tight uppercase">
                  Timeline / History
                </div>
                <ul className="pl-4 border-l-2 border-gray-200">
                  <li className="mb-4">
                    <div className="text-xs text-gray-500">
                      {(selectedOrder as any).created_at
                        ? new Date(
                            (selectedOrder as any).created_at
                          ).toLocaleString()
                        : "N/A"}
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      Order Created
                    </div>
                  </li>
                  <li>
                    <div className="text-xs text-gray-500">
                      {(selectedOrder as any).updated_at
                        ? new Date(
                            (selectedOrder as any).updated_at
                          ).toLocaleString()
                        : "N/A"}
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      Last Updated
                    </div>
                  </li>
                </ul>
              </div>
              <hr className="my-4 border-gray-200" />
              {/* Actions */}
              <div className="mt-6">
                {statusEditId === getOrderId(selectedOrder) ? (
                  <div className="flex flex-col items-stretch p-4 mb-2 border border-gray-200 shadow-sm sm:flex-row gap-y-2 sm:gap-y-0 sm:gap-x-2 bg-gray-50 rounded-xl">
                    <div className="flex flex-col items-stretch flex-1 sm:flex-row gap-y-2 sm:gap-y-0 sm:gap-x-2">
                      <select
                        value={statusEditValue || selectedOrder.status || "PD"}
                        onChange={(e) =>
                          setStatusEditValue(e.target.value as OrderStatus)
                        }
                        className="w-auto min-w-[140px] px-4 py-2 text-base font-semibold border-2 border-[#174832] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#174832] appearance-none bg-white text-gray-900 transition-all h-12"
                        aria-label="Select new status"
                        autoFocus
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg fill='none' stroke='%23174832' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 0.75rem center",
                          backgroundSize: "1.5em 1.5em",
                        }}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option
                            key={value}
                            value={value}
                            title={label}
                            className="text-base font-semibold"
                          >
                            {label}
                          </option>
                        ))}
                      </select>
                      <motion.button
                        className="h-12 w-auto min-w-[100px] px-6 text-base font-bold text-white bg-[#174832] rounded-lg shadow-sm hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2 transition-colors"
                        onClick={() => {
                          if (
                            statusEditValue &&
                            statusEditValue !== selectedOrder.status
                          ) {
                            handleStatusUpdate(
                              getOrderId(selectedOrder),
                              statusEditValue
                            );
                          }
                        }}
                        disabled={
                          isUpdating ||
                          !statusEditValue ||
                          statusEditValue === selectedOrder.status
                        }
                        aria-label="Save Status"
                        title="Save Status"
                        whileHover={{ scale: 1.06, backgroundColor: "#215c3a" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Save
                      </motion.button>
                      <motion.button
                        className="h-12 w-auto min-w-[100px] px-6 text-base font-bold text-gray-600 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none transition-colors"
                        onClick={() => setStatusEditId(null)}
                        aria-label="Cancel"
                        title="Cancel"
                        whileHover={{ scale: 1.06, backgroundColor: "#f3f4f6" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                    {/* Divider and Delete button */}
                    {/* <div className="items-center hidden mx-2 sm:flex">
                      <div className="w-px h-8 bg-gray-300" />
                    </div> */}
                    <motion.button
                      onClick={() => handleDelete(getOrderId(selectedOrder))}
                      className="h-12 w-auto min-w-[100px] px-6 text-base font-bold text-red-500 border-2 border-red-500 rounded-lg shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors sm:ml-0 mt-2 sm:mt-0"
                      aria-label="Delete Order"
                      title="Delete Order"
                      whileHover={{ scale: 1.06, backgroundColor: "#ffeaea" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex flex-row gap-2">
                    <motion.button
                      className="px-4 py-2 text-sm text-[#174832] border border-[#174832] rounded-lg hover:bg-[#174832] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2 font-semibold transition-colors"
                      onClick={() => {
                        setStatusEditId(getOrderId(selectedOrder));
                        setStatusEditValue(selectedOrder.status || "PD");
                      }}
                      aria-label="Change Status"
                      title="Change Status"
                      whileHover={{ scale: 1.06, backgroundColor: "#e0f2f1" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Change Status
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(getOrderId(selectedOrder))}
                      className="px-4 py-2 text-sm font-semibold text-red-500 transition-colors border border-red-500 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label="Delete Order"
                      title="Delete Order"
                      whileHover={{ scale: 1.06, backgroundColor: "#ffeaea" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
