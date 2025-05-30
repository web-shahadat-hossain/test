"use client";

import { useState, useEffect } from "react";
import { getOrderRequests, getResolvedOrders } from "@/lib/utils/service/order";
import { toast } from "react-hot-toast";
import { FiRefreshCw } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  pendingRequests: number;
  revenue: number;
}

interface RecentUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
}

interface RecentOrder {
  id: number;
  user: string;
  amount: number;
  status: string;
  date: string;
}

interface ExtendedResolvedOrder {
  order_id: number;
  cost: number;
  status?: string;
  created_at?: string;
  user?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

const DashboardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 animate-pulse"
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="w-48 h-8 bg-gray-200 rounded-lg"></div>
        <div className="flex items-center gap-4">
          <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl"
          >
            <div className="w-24 h-4 mb-4 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-8 mb-2 bg-gray-200 rounded-lg"></div>
            <div className="w-32 h-4 bg-gray-200 rounded-lg"></div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Orders Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-32 h-6 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-4 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between py-3 border-t border-gray-100"
              >
                <div className="w-24 h-4 bg-gray-200 rounded-lg"></div>
                <div className="w-16 h-4 bg-gray-200 rounded-lg"></div>
                <div className="w-20 h-4 bg-gray-200 rounded-lg"></div>
                <div className="w-24 h-4 bg-gray-200 rounded-lg"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Users Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-32 h-6 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-4 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between py-3 border-t border-gray-100"
              >
                <div className="w-32 h-4 bg-gray-200 rounded-lg"></div>
                <div className="w-40 h-4 bg-gray-200 rounded-lg"></div>
                <div className="w-24 h-4 bg-gray-200 rounded-lg"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    pendingRequests: 0,
    revenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getDateRange = () => {
    const now = new Date();
    const start = new Date();

    switch (timeRange) {
      case "today":
        start.setHours(0, 0, 0, 0);
        break;
      case "week":
        start.setDate(now.getDate() - 7);
        break;
      case "month":
        start.setMonth(now.getMonth() - 1);
        break;
      case "year":
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setHours(0, 0, 0, 0);
    }

    return { start, end: now };
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { start, end } = getDateRange();

      // Fetch order requests and resolved orders
      const [orderRequests, resolvedOrders] = await Promise.all([
        getOrderRequests(),
        getResolvedOrders(),
      ]);

      // Filter orders based on time range
      const filteredOrders = (resolvedOrders.results || []).filter(
        (order: ExtendedResolvedOrder) => {
          const orderDate = new Date(order.created_at || new Date());
          return orderDate >= start && orderDate <= end;
        }
      );

      const filteredRequests = (orderRequests.results || []).filter(
        (request: any) => {
          const requestDate = new Date(request.created_at || new Date());
          return requestDate >= start && requestDate <= end;
        }
      );

      // Calculate statistics
      const totalOrders = filteredOrders.length;
      const pendingRequests = filteredRequests.length;
      const revenue = filteredOrders.reduce(
        (sum, order) => sum + (order.cost || 0),
        0
      );

      // Get recent users from resolved orders
      const users = filteredOrders
        .map((order) => order.user)
        .filter((user): user is NonNullable<typeof user> => user !== undefined)
        .filter(
          (user, index, self) =>
            index === self.findIndex((u) => u.id === user.id)
        )
        .map((user) => ({
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          created_at: new Date().toISOString(),
        }))
        .slice(0, 3);

      // Get recent orders
      const recentOrders = filteredOrders.slice(0, 3).map((order) => ({
        id: order.order_id,
        user: order.user
          ? `${order.user.first_name || ""} ${
              order.user.last_name || ""
            }`.trim() || order.user.email
          : "Unknown",
        amount: order.cost || 0,
        status: order.status || "Pending",
        date: new Date().toISOString(),
      }));

      setStats({
        totalUsers: users.length,
        totalOrders,
        pendingRequests,
        revenue,
      });
      setRecentUsers(users);
      setRecentOrders(recentOrders);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex items-center justify-between mt-10"
      >
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard Overview
        </h1>
        <div className="flex items-center gap-4">
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent transition-all duration-200"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </motion.select>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-600 hover:text-[#ff5c00] transition-colors"
            title="Refresh data"
          >
            <FiRefreshCw
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Total Users",
            value: stats.totalUsers,
            subtitle: "Active users",
            color: "text-green-600",
          },
          {
            title: "Total Orders",
            value: stats.totalOrders,
            subtitle: "Completed orders",
            color: "text-blue-600",
          },
          {
            title: "Pending Requests",
            value: stats.pendingRequests,
            subtitle: "Awaiting resolution",
            color: "text-yellow-600",
          },
          // {
          //   title: "Total Revenue",
          //   value: `$${stats.revenue.toLocaleString()}`,
          //   subtitle: "Total earnings",
          //   color: "text-[#ff5c00]",
          // },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="p-6 transition-all duration-200 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md"
          >
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {stat.value}
            </p>
            <p className={`mt-2 text-sm ${stat.color}`}>{stat.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            {/* <Link
              href="/admin/orders"
              className="text-sm text-[#ff5c00] hover:text-[#ff2f0a] transition-colors"
            >
              View all
            </Link> */}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm font-medium text-left text-gray-500">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence>
                  {recentOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-t border-gray-100"
                    >
                      <td className="py-3">{order.user}</td>
                      <td className="py-3">${order.amount}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Users
            </h2>
            {/* <Link
              href="/admin/users"
              className="text-sm text-[#ff5c00] hover:text-[#ff2f0a] transition-colors"
            >
              View all
            </Link> */}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm font-medium text-left text-gray-500">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Join Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence>
                  {recentUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-t border-gray-100"
                    >
                      <td className="py-3">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : "N/A"}
                      </td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
