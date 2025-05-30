import { NextResponse } from "next/server";
import {
  getOrderRequests,
  getResolvedOrders,
  OrderResponse,
  ResolvedOrder,
} from "@/lib/utils/service/order";

function getStatusLabel(status: string | undefined): string {
  if (!status) return "Pending";
  switch (status.toUpperCase()) {
    case "PD":
      return "Paid";
    case "AC":
      return "Resolved";
    case "CN":
      return "Cancelled";
    case "SP":
      return "In Transit";
    default:
      return status;
  }
}

export async function GET() {
  try {
    // Fetch real-time data from multiple sources
    const [orderRequests, resolvedOrders] = await Promise.all([
      getOrderRequests(),
      getResolvedOrders(),
    ]);

    // Aggregate manual requests by status
    const allManualRequests = [
      // Pending requests (from orderRequests)
      ...(orderRequests.results || []).map((req: OrderResponse) => ({
        id: req.id.toString(),
        type: "Manual Request",
        date: req.created_at,
        status: "Pending",
        product_url: req.product_url,
        description: req.description,
      })),
      // Resolved requests (from resolvedOrders)
      ...(resolvedOrders.results || []).map((order: ResolvedOrder) => ({
        id: order.order_id.toString(),
        type: "Manual Request",
        date: (order as any).created_at || new Date().toISOString(),
        status: getStatusLabel(order.status),
        product_url: order.product_url,
        description: order.description,
      })),
    ];

    // Count by status
    const statusCounts = allManualRequests.reduce(
      (acc: Record<string, number>, req) => {
        const status = req.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { Pending: 0, Paid: 0, Resolved: 0, Cancelled: 0 } as Record<
        string,
        number
      >
    );

    // Recent activity feed (latest 10 manual requests)
    const recentManualRequests = [...allManualRequests]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    // Process and calculate dashboard data
    const dashboardData = {
      recentOrders: (resolvedOrders.results || [])
        .map((order: ResolvedOrder) => ({
          id: order.order_id.toString(),
          date: (order as any).created_at || new Date().toISOString(),
          status: getStatusLabel(order.status),
          total: order.cost || 0,
        }))
        .slice(0, 5),

      pendingRequests: (orderRequests.results || []).map(
        (request: OrderResponse) => ({
          id: request.id.toString(),
          type: "Manual Request",
          date: request.created_at,
          status: "Pending",
        })
      ),

      trackingOrders: (resolvedOrders.results || [])
        .filter((order: ResolvedOrder) => order.status === "SP")
        .map((order: ResolvedOrder) => ({
          id: order.order_id.toString(),
          status: "In Transit",
          estimatedDelivery: "Not available",
        })),

      addresses: [],

      // New: Manual requests summary and activity
      manualRequestsSummary: statusCounts,
      manualRequestsActivity: recentManualRequests,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);

    // Return empty data structure instead of error to prevent UI breakage
    return NextResponse.json({
      recentOrders: [],
      pendingRequests: [],
      trackingOrders: [],
      addresses: [],
      manualRequestsSummary: { Pending: 0, Paid: 0, Resolved: 0, Cancelled: 0 },
      manualRequestsActivity: [],
    });
  }
}
