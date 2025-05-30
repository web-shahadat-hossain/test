"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  total: number;
  trackingNumber?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState("");
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with actual API calls
  const orders: Order[] = [
    {
      id: "ORD-001",
      date: "2024-03-15",
      status: "delivered",
      items: [
        {
          id: "1",
          name: "Product 1",
          quantity: 2,
          price: 29.99,
          image: "https://via.placeholder.com/100",
        },
      ],
      total: 59.98,
      trackingNumber: "TRK123456789",
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
    },
    // Add more mock orders as needed
  ];

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCancelOrder = (orderId: string) => {
    // Implement cancel order logic
    console.log("Cancelling order:", orderId);
  };

  const handleReorder = (order: Order) => {
    // Implement reorder logic
    console.log("Reordering:", order);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filtered and searched orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = activeTab === "all" || order.status === activeTab;
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen px-4 py-4 bg-gray-50 sm:py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden bg-white rounded-lg shadow-lg">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push("/dashboard/checkout")}
                  className="px-4 py-2 bg-[#174832] text-white rounded-md hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832]"
                >
                  Place New Order
                </button>
                <button
                  onClick={() => {
                    // Implement export functionality
                    console.log("Exporting orders");
                  }}
                  className="px-4 py-2 border border-[#174832] text-[#174832] rounded-md hover:bg-[#174832]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832]"
                >
                  Export Orders
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Order ID or Product Name..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                {[
                  "all",
                  "pending",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveTab(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2
                      ${
                        activeTab === status
                          ? "bg-[#174832] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {/* End Search and Filter */}

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 transition-shadow border rounded-lg hover:shadow-md"
                >
                  <div className="flex flex-col mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
                    <div>
                      <h4 className="mb-1 text-sm font-medium text-gray-500">
                        Items
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-3"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-1 text-sm font-medium text-gray-500">
                        Shipping Address
                      </h4>
                      <p className="text-sm text-gray-900">
                        {order.shippingAddress.street}
                        <br />
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                        <br />
                        {order.shippingAddress.country}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-1 text-sm font-medium text-gray-500">
                        Order Total
                      </h4>
                      <p className="text-lg font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                      {order.trackingNumber && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Tracking: {order.trackingNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col mt-2 space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="px-3 py-1 text-sm border border-[#174832] text-[#174832] rounded-md hover:bg-[#174832]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832]"
                      >
                        View Details
                      </button>
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Cancel Order
                        </button>
                      )}
                      {order.status === "delivered" && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-3 py-1 text-sm bg-[#174832] text-white rounded-md hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832]"
                        >
                          Reorder
                        </button>
                      )}
                      {/* Download Invoice Button */}
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="px-3 py-1 text-sm text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Download Invoice
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        // Implement tracking functionality
                        console.log("Tracking order:", order.id);
                      }}
                      className="px-3 py-1 text-sm text-[#174832] hover:text-[#11351f] focus:outline-none"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  No orders found.
                </div>
              )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        Order Details
                      </h2>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close</span>
                        <svg
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
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Order Summary */}
                      <div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900">
                          Order Summary
                        </h3>
                        <div className="p-4 rounded-lg bg-gray-50">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Order Number
                              </p>
                              <p className="font-medium">{selectedOrder.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Order Date
                              </p>
                              <p className="font-medium">
                                {new Date(
                                  selectedOrder.date
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Status</p>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  selectedOrder.status
                                )}`}
                              >
                                {selectedOrder.status.charAt(0).toUpperCase() +
                                  selectedOrder.status.slice(1)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Total Amount
                              </p>
                              <p className="font-medium">
                                ${selectedOrder.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900">
                          Items
                        </h3>
                        <div className="space-y-4">
                          {selectedOrder.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center p-4 space-x-4 rounded-lg bg-gray-50"
                            >
                              <img
                                src={item.image[0]}
                                alt={item.name}
                                className="w-16 h-16 rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Quantity: {item.quantity}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Price: ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <p className="font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Information */}
                      <div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900">
                          Shipping Information
                        </h3>
                        <div className="p-4 rounded-lg bg-gray-50">
                          <p className="text-gray-900">
                            {selectedOrder.shippingAddress.street}
                          </p>
                          <p className="text-gray-900">
                            {selectedOrder.shippingAddress.city},{" "}
                            {selectedOrder.shippingAddress.state}{" "}
                            {selectedOrder.shippingAddress.zipCode}
                          </p>
                          <p className="text-gray-900">
                            {selectedOrder.shippingAddress.country}
                          </p>
                          {selectedOrder.trackingNumber && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Tracking Number:
                              </p>
                              <p className="font-medium">
                                {selectedOrder.trackingNumber}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Download Invoice function
function downloadInvoice(order: Order) {
  const html = `
    <html>
      <head>
        <title>Invoice - ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 2rem; }
          h2 { color: #174832; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #eee; padding: 8px; text-align: left; }
          th { background: #f4f4f4; }
        </style>
      </head>
      <body>
        <h2>Invoice for Order #${order.id}</h2>
        <p><strong>Date:</strong> ${new Date(
          order.date
        ).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <h3>Items</h3>
        <table>
          <thead>
            <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) =>
                  `<tr><td>${item.name}</td><td>${
                    item.quantity
                  }</td><td>$${item.price.toFixed(2)}</td><td>$${(
                    item.price * item.quantity
                  ).toFixed(2)}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>
        <h3>Total: $${order.total.toFixed(2)}</h3>
        <h4>Shipping Address</h4>
        <p>${order.shippingAddress.street}<br />${
    order.shippingAddress.city
  }, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br />${
    order.shippingAddress.country
  }</p>
      </body>
    </html>
  `;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice-${order.id}.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
