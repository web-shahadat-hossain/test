// import { AxiosError } from "axios";

import axios from "axios";
// import toast from "react-hot-toast";

// Always use the /api prefix in your frontend code
// const API_URL = "https://america-to-bd.vercel.app/order";

const API_URL = "/api/order";
// const API_URL = "/api/order";

// Track order
export const trackOrder = async (trackerId: string) => {
  const response = await axios.get(`${API_URL}/tracking/${trackerId}`);
  return response.data;
};

// // Track order
// export const trackOrder = async (trackerId: string): Promise<any> => {
//   try {
//     const response = await axios.get(`${API_URL}/tracking/${trackerId}`);
//     console.log("Order tracking info (API response):", response.data);
//     return response.data;
//   } catch (error) {
//     const axiosError = error as AxiosError<{ detail?: string }>;
//     console.error(
//       "Error tracking order:",
//       axiosError.response?.data || axiosError.message
//     );
//     toast.error(axiosError.response?.data?.detail || "Failed to track order");
//     throw error;
//   }
// };
