"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  deleteOrder,
  getProductOrders,
  updateOrderStatus,
} from "@/lib/utils/service/productOrder";
import { AnimatePresence, motion } from "framer-motion";

interface OrderItem {
  image: any;
  product: any;
  quantity: number;
  color: string;
  size: string;
  price: string;
}

interface Order {
  tracker: string;
  user: {
    first_name: string;
    last_name: string;
  };
  address: string;
  totalPrice: number;
  status: string;
  contactNo: string;
  email: string;
  transactionId: string;
  payMethod: string;
  shippingMethod: string;
  shippingCost: number;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const fetchOrders = async () => {
    try {
      const data = await getProductOrders();
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load order history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "cancel":
        return "bg-red-100 text-red-800";
      case "received":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.tracker.includes(searchQuery) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.contactNo.includes(searchQuery);

    const matchStatus =
      selectedStatus === "All" ||
      order.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="container px-2 mx-auto sm:px-4">
        <div className="p-4 bg-white shadow-sm rounded-xl sm:p-8">
          <h1 className="mb-6 text-2xl font-bold text-[#FF6C19]">
            Product Order History
          </h1>

          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <input
              type="text"
              placeholder="Search by email, phone or tracker ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FF6C19] focus:border-[#FF6C19]"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="mt-2 sm:mt-0 px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FF6C19] focus:border-[#FF6C19]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Canceled">Canceled</option>
              <option value="Received">Received</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-10">Loading...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-10">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {/* <th className="px-4 py-2 text-left text-sm font-semibold">
                      Tracker
                    </th> */}
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Customer
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Address
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Total
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Phone
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Transaction Id
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.tracker}
                      className="cursor-pointer hover:bg-[#FFF3E6]"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* <td className="px-4 py-2 text-sm">{order.tracker}</td> */}
                      <td className="px-4 py-2 text-sm">
                        {order.user.first_name} {order.user.last_name}
                      </td>
                      <td className="px-4 py-2 text-sm">{order.address}</td>
                      <td className="px-4 py-2 text-sm">৳{order.totalPrice}</td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">{order.contactNo}</td>
                      <td className="px-4 py-2 text-sm">{order.payMethod}</td>
                      <td className="px-4 py-2 text-sm">
                        {order.transactionId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedOrder && (
          <div
            className="fixed inset-0  bg-opacity-30 z-40"
            onClick={() => setSelectedOrder(null)}
          ></div>
        )}

        {/* Sidebar */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-full max-w-md h-full p-6 overflow-y-auto bg-white shadow-lg z-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg  text-gray-800">
                  <span className="text-orange-500 font-semibold"> Order:</span>{" "}
                  <span>#{selectedOrder.tracker}</span>
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-600 hover:text-[#FF6C19]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-orange-500">Customer:</p>
                  <p className="font-medium text-gray-800">
                    {selectedOrder.user.first_name}{" "}
                    {selectedOrder.user.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-500">Address:</p>
                  <p className="text-gray-700">{selectedOrder.address}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-500">
                    Total Price:
                  </p>
                  <p className="text-gray-700">৳{selectedOrder.totalPrice}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-500">Status:</p>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      setSelectedOrder({
                        ...selectedOrder,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Canceled">Canceled</option>
                    <option value="Received">Received</option>
                  </select>
                </div>
                <div>
                  <p className="text-[16px] font-bold text-gray-600">
                    Product:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedOrder.items.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        <p>
                          <span className="font-bold text-orange-500">
                            Title:{" "}
                          </span>{" "}
                          {item?.product?.name}{" "}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold text-orange-500">
                            Pcs:{" "}
                          </span>{" "}
                          {item.quantity}{" "}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold text-orange-500">
                            Price:{" "}
                          </span>{" "}
                          {item.price}{" "}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold text-orange-500">
                            shipping Cost
                          </span>{" "}
                          {selectedOrder.shippingCost}{" "}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold text-orange-500">
                            Color:{" "}
                          </span>{" "}
                          ({item.color})
                        </p>
                        <p className="mb-2">
                          <span className="font-bold text-orange-500">
                            Size:{" "}
                          </span>{" "}
                          ({item.color})
                        </p>
                        <p className="flex gap-3 ">
                          <span className="font-bold text-orange-500">
                            Image:{" "}
                          </span>{" "}
                          <img
                            src={item.product.image[0]}
                            className="w-[100px]"
                          />
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ✅ Action Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={async () => {
                      try {
                        await updateOrderStatus(
                          selectedOrder.tracker,
                          selectedOrder.status
                        );
                        toast.success("✅ Order status updated");
                        setSelectedOrder(null);
                        fetchOrders();
                      } catch (err) {
                        toast.error("❌ Failed to update status");
                      }
                    }}
                    className="px-4 py-2 text-white bg-[#FF6C19] rounded-md hover:bg-[#e65c00]"
                  >
                    Update
                  </button>
                  <button
                    onClick={async () => {
                      const confirmDelete = window.confirm(
                        `Are you sure you want to delete Order #${selectedOrder.tracker}?`
                      );
                      if (!confirmDelete) return;

                      try {
                        await deleteOrder(selectedOrder.tracker);
                        toast.success("🗑️ Order deleted");
                        setSelectedOrder(null);
                        fetchOrders();
                      } catch (err) {
                        toast.error("❌ Failed to delete order");
                      }
                    }}
                    className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
