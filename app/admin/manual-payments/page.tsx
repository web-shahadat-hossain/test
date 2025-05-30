"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiX,
  FiTrash2,
  FiImage,
  FiCopy,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiAlertCircle,
} from "react-icons/fi";

interface ManualPayment {
  id: number;
  tracker: string;
  bank_name: string;
  bank_id: string;
  transaction_id: string;
  image: string;
  user: number | string;
  created_at?: string;
  status?: string;
}

interface PaginationInfo {
  count: number;
  next: string | null;
  previous: string | null;
  results: ManualPayment[];
}

export default function ManualPaymentsPage() {
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [copyFeedback, setCopyFeedback] = useState<{
    id: number;
    message: string;
  } | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/payment/mannual-payment?page=${currentPage}&limit=${itemsPerPage}`
      );
      if (!res.ok) throw new Error("Failed to fetch manual payments");
      const data = await res.json();
      setPagination(data);
      setPayments(data.results || []);
    } catch (err: any) {
      setError(err.message || "Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback({ id, message: "Copied to clipboard!" });
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      setCopyFeedback({ id, message: "Failed to copy" });
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  const handleAction = async (id: number, tracker: string) => {
    if (!window.confirm("Are you sure you want to approve this payment?")) {
      return;
    }
    setActionLoading(id);
    try {
      const accessToken =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1] || "";

      const res = await fetch(
        `https://america-to-bd.vercel.app/payment/approve-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            tracker_id: tracker,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to update payment status");
      }

      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "approve" } : p))
      );
      alert("Payment approved successfully!");
    } catch (err: any) {
      alert(err.message || "Error updating payment status");
    } finally {
      setActionLoading(null);
    }
  };
  // console.log(document.cookie);

  const handleDelete = async (id: number, tracker: string) => {
    setActionLoading(id);
    try {
      const accessToken =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1] || "";
      const res = await fetch(`/api/payment/mannual-payment/${tracker}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete payment");
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Error deleting payment");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-40 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 mx-auto max-w-7xl"
    >
      <div className="flex flex-col items-center justify-between mb-8 md:flex-row">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900"
        >
          Manual Payment Requests
        </motion.h1>
        {/* <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FiInfo className="w-4 h-4" />
          <span>Click on a row to view more details</span>
        </div> */}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden bg-white rounded-xl shadow-card"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-900">
                      User
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-900">
                      Payment Method
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-900">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[...Array(5)].map((_, index) => (
                    <SkeletonRow key={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 text-red-500 bg-red-50 rounded-xl"
          >
            {error}
          </motion.div>
        ) : payments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl"
          >
            No manual payment requests found.
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden bg-white rounded-xl shadow-card"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-900">
                        User
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-900">
                        Payment Method
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-900">
                        Transaction ID
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-left text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((p) => (
                      <>
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="transition-colors duration-200 cursor-pointer hover:bg-gray-50 group"
                          onClick={() => toggleRow(p.id)}
                        >
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {p.user}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {p.bank_name}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-sm text-gray-900">
                                {p.transaction_id || "-"}
                              </span>
                              {p.transaction_id && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(p.transaction_id, p.id);
                                  }}
                                  className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                                  title="Copy Transaction ID"
                                >
                                  <FiCopy className="w-4 h-4" />
                                </motion.button>
                              )}
                              {copyFeedback?.id === p.id && (
                                <motion.span
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                  className="text-xs text-gray-500"
                                >
                                  {copyFeedback.message}
                                </motion.span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full
                                ${
                                  p.status === "approve"
                                    ? "bg-green-100 text-green-800"
                                    : p.status === "reject"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {p.status || "pending"}
                              </span>
                              <div className="relative group">
                                <FiInfo className="w-4 h-4 text-gray-400 cursor-help" />
                                <div className="absolute px-3 py-2 mb-2 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-gray-900 rounded-lg opacity-0 bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
                                  {p.status === "approve"
                                    ? "Payment has been approved"
                                    : p.status === "reject"
                                    ? "Payment has been rejected"
                                    : "Payment is waiting for review"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              {p.status === "approve" ? (
                                <span className="flex items-center text-sm font-medium text-green-600">
                                  <FiCheck className="w-4 h-4 mr-1" /> Approved
                                </span>
                              ) : p.status === "reject" ? (
                                <span className="flex items-center text-sm font-medium text-red-600">
                                  <FiX className="w-4 h-4 mr-1" /> Rejected
                                </span>
                              ) : (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#ff5c00] rounded-lg hover:bg-[#ff2f0a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff5c00] disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={actionLoading === p.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAction(p.id, p.tracker);
                                    }}
                                  >
                                    <FiCheck className="w-4 h-4 mr-1" />
                                    Approve
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={actionLoading === p.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(p.id, p.tracker);
                                    }}
                                  >
                                    <FiX className="w-4 h-4 mr-1" />
                                    Reject
                                  </motion.button>
                                </>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRow(p.id);
                                }}
                                className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                              >
                                {expandedRows.has(p.id) ? (
                                  <FiChevronUp className="w-5 h-5" />
                                ) : (
                                  <FiChevronDown className="w-5 h-5" />
                                )}
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                        <AnimatePresence>
                          {expandedRows.has(p.id) && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="bg-gray-50"
                            >
                              <td colSpan={5} className="px-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                                      Bank Details
                                      <span className="ml-2 text-xs text-gray-500">
                                        (Click to copy)
                                      </span>
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-mono text-sm text-gray-900">
                                        {p.bank_id}
                                      </span>
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyToClipboard(p.bank_id, p.id);
                                        }}
                                        className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        title="Copy Bank ID"
                                      >
                                        <FiCopy className="w-4 h-4" />
                                      </motion.button>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                                      Tracker ID
                                      <span className="ml-2 text-xs text-gray-500">
                                        (Click to copy)
                                      </span>
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-mono text-sm text-gray-900">
                                        {p.tracker}
                                      </span>
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyToClipboard(p.tracker, p.id);
                                        }}
                                        className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        title="Copy Tracker ID"
                                      >
                                        <FiCopy className="w-4 h-4" />
                                      </motion.button>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                                      Proof
                                      <span className="ml-2 text-xs text-gray-500">
                                        (Click to view)
                                      </span>
                                    </h4>
                                    <motion.a
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      href={p.image}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div className="relative w-16 h-16 overflow-hidden rounded-lg shadow-sm group">
                                        <img
                                          src={p.image}
                                          alt="proof"
                                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/50 group-hover:opacity-100">
                                          <FiImage className="w-6 h-6 text-white" />
                                        </div>
                                      </div>
                                    </motion.a>
                                  </div>
                                  <div>
                                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                                      Submitted
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                      <FiClock className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm text-gray-900">
                                        {p.created_at
                                          ? new Date(
                                              p.created_at
                                            ).toLocaleString()
                                          : "-"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 mt-4 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex justify-between flex-1 sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.previous}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.next}
                  className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, pagination.count)}
                    </span>{" "}
                    of <span className="font-medium">{pagination.count}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="inline-flex -space-x-px rounded-md shadow-sm isolate"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.previous}
                      className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <FiChevronUp className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.next}
                      className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <FiChevronDown className="w-5 h-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
