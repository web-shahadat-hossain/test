"use client";

import { useState, useEffect } from "react";
import { getOrderRequests } from "@/lib/utils/service/order";
import { toast } from "react-hot-toast";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Request {
  id: string;
  customer: string;
  email: string;
  phone: string;
  productLink: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  originalBox: boolean;
  urgentDelivery: boolean;
  whatsappUpdates: boolean;
  status: string;
  date: string;
  notes: string;
  isCardRequest: boolean;
  cardRequestStatus?:
    | "pending_review"
    | "approved"
    | "rejected"
    | "processing"
    | "completed";
  cardRequestDetails?: {
    cardType: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    billingAddress?: string;
    shippingAddress?: string;
  };
}

const mockRequests: Request[] = [
  {
    id: "#REQ-001",
    customer: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8901",
    productLink: "https://example.com/product-1",
    color: "Black",
    size: "M",
    quantity: 2,
    price: 129.99,
    originalBox: true,
    urgentDelivery: false,
    whatsappUpdates: true,
    status: "Pending",
    date: "2024-02-20",
    notes: "Please ensure careful packaging",
    isCardRequest: true,
    cardRequestStatus: "pending_review",
    cardRequestDetails: {
      cardType: "Visa",
      billingAddress: "123 Main St, City, Country",
      shippingAddress: "123 Main St, City, Country",
    },
  },
  {
    id: "#REQ-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 234 567 8902",
    productLink: "https://example.com/product-2",
    color: "White",
    size: "L",
    quantity: 1,
    price: 199.99,
    originalBox: false,
    urgentDelivery: true,
    whatsappUpdates: true,
    status: "Processing",
    date: "2024-02-19",
    notes: "Urgent delivery requested",
    isCardRequest: false,
  },
  {
    id: "#REQ-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 234 567 8903",
    productLink: "https://example.com/product-3",
    color: "Blue",
    size: "XL",
    quantity: 3,
    price: 89.99,
    originalBox: true,
    urgentDelivery: true,
    whatsappUpdates: false,
    status: "Completed",
    date: "2024-02-18",
    notes: "Gift wrapping needed",
    isCardRequest: false,
  },
];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30"></div>
        <div className="relative w-full max-w-2xl bg-white rounded-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default function ManualRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCardStatus, setSelectedCardStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"details" | "options" | null>(
    null
  );

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrderRequests();
      setRequests(data.results);
    } catch (err) {
      setError("Failed to fetch manual requests");
      toast.error("Failed to fetch manual requests");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (request: any, type: "details" | "options") => {
    setSelectedRequest(request);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setModalType(null);
  };

  const toggleActionMenu = (id: number | null) => {
    setActionMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleCardRequestAction = (
    request: Request,
    action: "approve" | "reject" | "process" | "complete"
  ) => {
    if (!request.isCardRequest) return;

    const updatedRequests = mockRequests.map((req) => {
      if (req.id === request.id) {
        return {
          ...req,
          cardRequestStatus:
            action === "approve"
              ? "approved"
              : action === "reject"
              ? "rejected"
              : action === "process"
              ? "processing"
              : "completed",
        };
      }
      return req;
    });
    // In a real implementation, you would update the database here
    closeModal();
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.product_url &&
        request.product_url.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      selectedStatus === "all" || request.status === selectedStatus;
    const matchesCardStatus =
      selectedCardStatus === "all" ||
      (request.isCardRequest &&
        request.cardRequestStatus === selectedCardStatus);
    return matchesSearch && matchesStatus && matchesCardStatus;
  });

  return (
    <div className="min-h-screen py-20 space-y-6 bg-gray-50">
      <div className="flex flex-col items-start justify-between sm:items-center sm:flex-row">
        <h1 className="text-2xl font-semibold text-gray-900">
          Manual Requests Management
        </h1>
        <div className="flex justify-between space-x-3 sm:items-center">
          <button className="px-4 py-2 text-[#ff5c00] border border-[#ff5c00] rounded-lg hover:bg-[#ff5c00] hover:text-white transition-colors">
            Export Requests
          </button>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search requests..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
      />
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff5c00]"></div>
        </div>
      ) : error ? (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Request ID
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Product URL
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Box
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Address
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-[#ff5c00] font-medium">
                    {request.id}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={request.product_url}
                      className="text-[#ff5c00] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {request.product_url}
                    </a>
                  </td>
                  <td className="px-6 py-4">{request.quantity}</td>
                  <td className="px-6 py-4">{request.description}</td>
                  <td className="px-6 py-4">{request.box ? "Yes" : "No"}</td>
                  <td className="px-6 py-4">{request.address}</td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => toggleActionMenu(request.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <EllipsisVerticalIcon className="w-5 h-5" />
                      </button>
                      {actionMenuOpen === request.id && (
                        <div className="absolute right-0 z-10 w-48 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu">
                            <button
                              onClick={() => openModal(request, "details")}
                              className="block w-full text-left px-4 py-2 text-sm text-[#ff5c00] hover:bg-gray-100"
                              role="menuitem"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
