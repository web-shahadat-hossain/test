import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

const API_URL = "/api/order";

export interface OrderRequest {
  product_url: string;
  quantity: number;
  description: string;
  is_box: boolean;
  address: number;
}

export interface OrderResponse {
  id: number;
  product_url: string;
  quantity: number;
  description: string;
  is_box: boolean;
  address: number;
  created_at: string;
  updated_at: string;
  user: number;
}

export interface ResolvedOrder {
  order_id: number;
  product_url: string;
  quantity: number;
  description: string;
  usd_price: number;
  converted_price: number;
  custom_fee: number;
  tax: number;
  box_fee: number;
  cost: number;
  status?: OrderStatus;
  user?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
}

export type OrderStatus = "PD" | "AC" | "CN" | "SP" | "UR";

// Create new order request
export const createOrderRequest = async (
  orderData: OrderRequest
): Promise<OrderResponse> => {
  try {
    console.log("Creating order request:", orderData);
    const response = await axios.post(`${API_URL}/order_request/`, orderData);
    console.log("Order request created (API response):", response.data);
    toast.success("Order request submitted successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      "Error creating order request:",
      axiosError.response?.data || axiosError.message
    );
    toast.error(
      axiosError.response?.data?.detail || "Failed to create order request"
    );
    throw error;
  }
};

// Get all order requests
export const getOrderRequests = async (
  page = 1
): Promise<{ count: number; results: OrderResponse[] }> => {
  try {
    const response = await axios.get(`${API_URL}/order_request?page=${page}`);
    console.log("Order requests fetched (API response):", response.data);
    // Always return { count, results }
    if (typeof response.data === "object" && response.data.results) {
      return {
        count: response.data.count || 0,
        results: Array.isArray(response.data.results)
          ? response.data.results
          : [],
      };
    } else if (Array.isArray(response.data)) {
      // fallback for old API
      return { count: response.data.length, results: response.data };
    } else {
      return { count: 0, results: [] };
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      "Error fetching order requests:",
      axiosError.response?.data || axiosError.message
    );
    toast.error("Failed to fetch order requests");
    throw error;
  }
};

// Resolve order (Admin only)
export const resolveOrder = async (
  orderData: ResolvedOrder
): Promise<ResolvedOrder> => {
  try {
    const response = await axios.post(`${API_URL}/resolved_order/`, orderData);
    console.log("Order resolved (API response):", response.data);
    toast.success("Order resolved successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      "Error resolving order:",
      axiosError.response?.data || axiosError.message
    );
    toast.error(axiosError.response?.data?.detail || "Failed to resolve order");
    throw error;
  }
};

// Get resolved orders
export const getResolvedOrders = async (
  page = 1
): Promise<{ count: number; results: ResolvedOrder[] }> => {
  try {
    const response = await axios.get(`${API_URL}/resolved_order/?page=${page}`);
    console.log("Resolved orders fetched (API response):", response.data);
    if (typeof response.data === "object" && response.data.results) {
      return {
        count: response.data.count || 0,
        results: Array.isArray(response.data.results)
          ? response.data.results
          : [],
      };
    } else if (Array.isArray(response.data)) {
      return { count: response.data.length, results: response.data };
    } else {
      return { count: 0, results: [] };
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      "Error fetching resolved orders:",
      axiosError.response?.data || axiosError.message
    );
    toast.error("Failed to fetch resolved orders");
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus
): Promise<ResolvedOrder> => {
  const token = Cookies.get("accessToken");

  try {
    const response = await axios.patch(
      `${API_URL}/resolved_order/${orderId}/`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Order status updated (API response):", response.data);
    toast.success("Order status updated successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      "Error updating order status:",
      axiosError.response?.data || axiosError.message
    );
    toast.error(
      axiosError.response?.data?.detail || "Failed to update order status"
    );
    throw error;
  }
};

// Delete resolved order
export const deleteResolvedOrder = async (orderId: number): Promise<void> => {
  const token = Cookies.get("accessToken");

  try {
    await axios.delete(`${API_URL}/resolved_order/${orderId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Order deleted successfully");
    toast.success("Order deleted successfully!");
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      "Error deleting order:",
      axiosError.response?.data || axiosError.message
    );
    toast.error(axiosError.response?.data?.detail || "Failed to delete order");
    throw error;
  }
};

// Search orders (Admin)
export const searchOrders = async (
  query: string,
  type: "request" | "resolved"
): Promise<OrderResponse[] | ResolvedOrder[]> => {
  try {
    const endpoint = type === "request" ? "order_request" : "resolved_order";
    const response = await axios.get(
      `${API_URL}/${endpoint}/?search=${encodeURIComponent(query)}`
    );
    console.log("Order search results (API response):", response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      "Error searching orders:",
      axiosError.response?.data || axiosError.message
    );
    toast.error("Failed to search orders");
    throw error;
  }
};

// Fetch a resolved order by ID
export const getResolvedOrderById = async (
  id: number | string
): Promise<ResolvedOrder> => {
  const token = Cookies.get("accessToken");
  try {
    const response = await axios.get(`${API_URL}/resolved_order/${id}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      "Error fetching resolved order by ID:",
      axiosError.response?.data || axiosError.message
    );
    toast.error("Failed to fetch resolved order");
    throw error;
  }
};

// Delete order request
export const deleteOrderRequest = async (id: number): Promise<void> => {
  const token = Cookies.get("accessToken");
  try {
    await axios.delete(`/api/order/order_request/${id}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    toast.success("Request deleted successfully!");
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    toast.error(
      axiosError.response?.data?.detail || "Failed to delete request"
    );
    throw error;
  }
};
