"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const mockSalesData = [
  { name: "Jan", sales: 4000, orders: 240 },
  { name: "Feb", sales: 3000, orders: 198 },
  { name: "Mar", sales: 5000, orders: 305 },
  { name: "Apr", sales: 2780, orders: 189 },
  { name: "May", sales: 1890, orders: 142 },
  { name: "Jun", sales: 2390, orders: 178 },
];

const mockTopProducts = [
  { name: "Product A", sales: 1234, revenue: 12340 },
  { name: "Product B", sales: 987, revenue: 9870 },
  { name: "Product C", sales: 765, revenue: 7650 },
  { name: "Product D", sales: 543, revenue: 5430 },
];

const mockUserStats = {
  totalUsers: 1248,
  activeUsers: 892,
  newUsers: 156,
  churnRate: 2.3,
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Analytics Dashboard
        </h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {mockUserStats.totalUsers}
          </p>
          <p className="mt-2 text-sm text-green-600">+12% from last month</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {mockUserStats.activeUsers}
          </p>
          <p className="mt-2 text-sm text-green-600">71% of total users</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">New Users</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {mockUserStats.newUsers}
          </p>
          <p className="mt-2 text-sm text-green-600">+23% from last month</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Churn Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {mockUserStats.churnRate}%
          </p>
          <p className="mt-2 text-sm text-red-600">+0.5% from last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Sales Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#ff5c00"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Chart */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Top Products
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTopProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#ff5c00" />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Top Performing Products
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Product Name
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Total Sales
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTopProducts.map((product, index) => (
                <tr key={product.name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {product.sales} units
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${product.revenue}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">
                      +{20 - index * 2}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
