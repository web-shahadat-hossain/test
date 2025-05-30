import axios from "axios";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

const API_URL = "/api/product";
// Order Form Data Type
// interface OrderItem {
//   product_id: number;
//   quantity: number;
//   color: string;
//   size: string;
//   price: number;
// }

// interface PlaceOrderData {
//   address: string;
//   totalPrice: number;
//   contactNo: string;
//   email: string;
//   transactionId: string;
//   payMethod: "bikash" | "nagad";
//   shippingMethod: string;
//   shippingCost: number;
//   items: OrderItem[];
// }
export const placeOrder = async (orderData: any) => {
  console.log(orderData);
  try {
    const response = await axios.post(`${API_URL}/place-order`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // ensures cookie is sent with request
    });

    console.log("✅ Order placed (API response):", response.data);
    toast.success("✅ Order placed successfully!");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProductOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/place-order`, {
      withCredentials: true, // যদি authentication প্রয়োজন হয়
    });

    console.log("📦 Orders fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch orders:", error);
    toast.error("❌ Failed to fetch orders:");
    throw error;
  }
};

// ✅ Update order status (PATCH)
export const updateOrderStatus = async (orderId: string, status: string) => {
  const token = Cookies.get("accessToken");
  try {
    const response = await axios.patch(
      `${API_URL}/place-order/${orderId}`,
      { status: status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    console.log("📝 Order status updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌Status update failed:", error);

    throw error;
  }
};

// ✅ Delete order
export const deleteOrder = async (orderId: string) => {
  const token = Cookies.get("accessToken");

  try {
    const response = await axios.delete(`${API_URL}/place-order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log("🗑️ Order deleted:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌Order Delete failed::", error);

    throw error;
  }
};
