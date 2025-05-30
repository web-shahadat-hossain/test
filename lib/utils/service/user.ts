import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

const API_URL = "/api/user";
// const API_UR = "https://america-to-bd.vercel.app/address/";

const API_URL_ADDRESS = "/api/address/";
// Always send credentials (cookies) with requests
axios.defaults.withCredentials = true;

export interface Address {
  id: number | string;
  district: string;
  city: string;
  road: string;
  post: number;
  user: number;
}

export interface UserDetails {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  addresses: Address[];
}

// Get user details
export const getUserDetails = async (userId: number): Promise<UserDetails> => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    console.log("User details fetched (API response):", response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      "Error fetching user details:",
      axiosError.response?.data || axiosError.message
    );
    toast.error(
      axiosError.response?.data?.detail || "Failed to fetch user details"
    );
    throw error;
  }
};

// Create address
export const createAddress = async (
  addressData: Omit<Address, "id" | "user">
): Promise<Address> => {
  try {
    const response = await axios.post(`${API_URL}/address/`, addressData);
    console.log("Address created (API response):", response.data);
    toast.success("Address added successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      "Error creating address:",
      axiosError.response?.data || axiosError.message
    );
    toast.error(axiosError.response?.data?.detail || "Failed to add address");
    throw error;
  }
};

// Delete address
export const deleteAddress = async (addressId: number): Promise<void> => {
  const token = Cookies.get("accessToken");
  console.log("Token being sent:", token);
  try {
    await axios.delete(`${API_URL_ADDRESS}/${addressId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Address deleted successfully");
    toast.success("Address deleted successfully!");
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      "Error deleting address:",
      axiosError.response?.data || axiosError.message
    );
    toast.error(
      axiosError.response?.data?.detail || "Failed to delete address"
    );
    throw error;
  }
};

// Get user addresses
export const getAddresses = async (): Promise<Address[]> => {
  try {
    const response = await axios.get(`${API_URL}/address`);
    console.log("Addresses fetched (API response):", response);
    return Array.isArray(response.data.results) ? response.data.results : [];
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      "Error fetching addresses:",
      axiosError.response?.data || axiosError.message
    );
    toast.error(
      axiosError.response?.data?.detail || "Failed to fetch addresses"
    );
    throw error;
  }
};

export const searchUsers = async (query: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/search?q=${encodeURIComponent(query)}`
    );
    console.log("User search results (API response):", response.data);
    return response.data;
  } catch (error: any) {
    // ... existing error handling ...
    throw error;
  }
};

export const updateUserStatus = async (userId: number, isActive: boolean) => {
  try {
    const response = await axios.patch(`${API_URL}/${userId}`, {
      is_active: isActive,
    });
    console.log("User status updated (API response):", response.data);
    return response.data;
  } catch (error: any) {
    // ... existing error handling ...
    throw error;
  }
};

export const updateAddress = async (
  addressId: number,
  addressData: Partial<Address>
): Promise<Address> => {
  const token = Cookies.get("accessToken");
  try {
    const response = await axios.patch(
      `${API_URL_ADDRESS}/${addressId}/`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    toast.error(
      axiosError.response?.data?.detail || "Failed to update address"
    );
    throw error;
  }
};
