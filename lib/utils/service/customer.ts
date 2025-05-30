import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = "/api";

export const getCustomer = async () => {
  try {
    const response = await axios.get(`${API_URL}/customer`, {
      withCredentials: true, // যদি authentication প্রয়োজন হয়
    });

    console.log("📦 Orders fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch orders:", error);
    toast.error("❌ অর্ডার লোড করা যায়নি!");
    throw error;
  }
};
