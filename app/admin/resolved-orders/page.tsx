"use client";

import ResolvedOrders from "@/components/admin/ResolvedOrders";

export default function ResolvedOrdersPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Resolved Orders Management
      </h1>
      <ResolvedOrders />
    </div>
  );
}
