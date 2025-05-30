import axios from "axios";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

export const postSupportTicket = async (formData: FormData) => {
  const token = Cookies.get("accessToken");

  try {
    const response = await axios.post("/api/support", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // ✅ send token via header
      },
    });

    toast.success("✅ Support ticket submitted successfully!");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to submit support ticket:", error);
    toast.error("❌ Failed to submit support ticket.");
    throw error;
  }
};
