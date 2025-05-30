"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, redirect } from "next/navigation";
import { getUserRole } from "@/lib/utils/service/auth";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiAlertCircle } from "react-icons/fi";

interface DashboardData {
  recentOrders: {
    id: string;
    date: string;
    status: string;
    total: number;
  }[];
  pendingRequests: {
    id: string;
    type: string;
    date: string;
    status: string;
  }[];
  trackingOrders: {
    id: string;
    status: string;
    estimatedDelivery: string;
  }[];
  addresses: {
    id: string;
    type: string;
    address: string;
    isDefault: boolean;
  }[];
  manualRequestsSummary: {
    Pending: number;
    Paid: number;
    Resolved: number;
    Cancelled: number;
  };
  manualRequestsActivity: {
    id: string;
    date: string;
    status: string;
    product_url: string;
  }[];
}

// Add Skeleton Loader Component
const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6 bg-white shadow-sm rounded-xl">
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Trend Chart Skeleton */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <div className="w-32 h-6 mb-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
      </div>

      {/* Recent Orders Skeleton */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-4 border-t border-gray-100"
            >
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Requests Skeleton */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-4 border-t border-gray-100"
            >
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking Orders Skeleton */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
            >
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Addresses Skeleton */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add new components for better modularity
const StatCard = ({
  title,
  value,
  subtitle,
  color,
  href,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  href?: string;
}) => {
  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 transition-all duration-200 bg-white shadow-sm rounded-xl hover:shadow-md"
    >
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <p className={`mt-2 text-sm ${color}`}>{subtitle}</p>
    </motion.div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};

const DataTable = ({
  title,
  data,
  columns,
  viewAllLink,
}: {
  title: string;
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (item: any) => React.ReactNode;
  }[];
  viewAllLink?: string;
}) => (
  <div className="p-6 bg-white shadow-sm rounded-xl">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="text-sm text-[#ff5c00] hover:underline"
        >
          View all
        </Link>
      )}
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-sm text-left text-gray-500">
            {columns.map((col) => (
              <th key={col.key} className="pb-4">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t border-gray-100">
              {columns.map((col) => (
                <td key={col.key} className="py-4 text-sm text-gray-500">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function DashboardPage() {
  redirect("/dashboard/account");
}
