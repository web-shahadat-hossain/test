"use client";

import { useState, useEffect } from "react";

import { toast } from "react-hot-toast";
import { getProductOrders } from "@/lib/utils/service/productOrder";

interface OrderItem {
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getProductOrders(); // API থেকে ডেটা আনছে
        setOrders(data);
      } catch (err) {
        toast.error("Failed to load order history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);
  const filteredOrders = orders.filter(
    (order) =>
      order.tracker.includes(searchQuery) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.contactNo.includes(searchQuery)
  );
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

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="container px-2 mx-auto sm:px-4">
        <div className="p-4 bg-white shadow-sm rounded-xl sm:p-8">
          <h1 className="mb-6 text-2xl font-bold text-[#FF6C19]">
            Product Order History
          </h1>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by email, phone or tracker ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FF6C19] focus:border-[#FF6C19]"
            />
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
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Tracker
                    </th>
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
                      <td className="px-4 py-2 text-sm">{order.tracker}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
