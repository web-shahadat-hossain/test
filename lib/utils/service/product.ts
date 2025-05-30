import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { Product } from "@/types/product";

export type { Product };

const API_URL = "/api";

export interface Category {
  name: string;
  id?: number;
}

// Helper function to handle API errors
const handleApiError = (error: unknown, defaultMessage: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const axiosError = error as AxiosError<any>;
  console.error("API Error:", axiosError.response?.data || axiosError.message);

  // Check if the response is HTML (like error pages)
  const responseData = axiosError.response?.data;
  if (
    typeof responseData === "string" &&
    responseData.includes("<!DOCTYPE html>")
  ) {
    console.error("Server returned HTML error page:", responseData);
    toast.error("Server error occurred. Please try again.");
    return;
  }

  // Handle structured error responses
  let errorMsg = defaultMessage;
  if (responseData) {
    if (typeof responseData.detail === "string") {
      errorMsg = responseData.detail;
    } else if (
      typeof responseData === "object" &&
      !Array.isArray(responseData)
    ) {
      errorMsg = Object.entries(responseData)
        .map(
          ([field, messages]) =>
            `${field}: ${
              Array.isArray(messages) ? messages.join(", ") : messages
            }`
        )
        .join(" | ");
    }
  }

  toast.error(errorMsg);
};

// Delete product
export const deleteProduct = async (id: number) => {
  const token = Cookies.get("accessToken");

  try {
    console.log(`Attempting to delete product with ID: ${id}`);
    const response = await axios.delete(`${API_URL}/product/order/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Product deleted successfully", response.status);
    toast.success("Product deleted successfully!");
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    handleApiError(error, "Failed to delete product");
    throw error;
  }
};

// Add product
export const addProduct = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/product/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Product added (API response):", response.data);
    toast.success("Product added successfully!");
    return Array.isArray(response.data.results)
      ? response.data.results
      : response.data;
  } catch (error) {
    handleApiError(error, "Failed to add product");
    throw error;
  }
};
// Add product
export const placeOrder = async (orderData: any) => {
  try {
    const response = await axios.post(
      `${API_URL}/product/place-order`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Needed if using cookies or sessions
      }
    );

    console.log("✅ Order placed (API response):", response.data);
    toast.success("✅ Order placed successfully!");

    return response.data;
  } catch (error) {
    handleApiError(error, "❌ Failed to place order");
    throw error;
  }
};

// Edit product
export const editProduct = async (id: number, formData: FormData) => {
  const token = Cookies.get("accessToken");

  try {
    const response = await axios.patch(
      `${API_URL}/product/order/${id}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Product updated (API response):", response.data);
    toast.success("Product updated successfully!");
    return Array.isArray(response.data.results)
      ? response.data.results
      : response.data;
  } catch (error) {
    handleApiError(error, "Failed to update product");
    throw error;
  }
};

// Add product category
export const addCategory = async (category: Category) => {
  try {
    const response = await axios.post(`${API_URL}/product/category/`, category);
    console.log("Category added (API response):", response.data);
    toast.success("Category added successfully!");
    return Array.isArray(response.data.results)
      ? response.data.results
      : response.data;
  } catch (error) {
    handleApiError(error, "Failed to add category");
    throw error;
  }
};

// Edit category
export const editCategory = async (id: number, category: Category) => {
  const token = Cookies.get("accessToken");

  try {
    const response = await axios.patch(
      `${API_URL}/product/category/${id}/`,
      category,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Category updated (API response):", response.data);
    toast.success("Category updated successfully!");
    return Array.isArray(response.data.results)
      ? response.data.results
      : response.data;
  } catch (error) {
    handleApiError(error, "Failed to update category");
    throw error;
  }
};

// Delete category
export const deleteCategory = async (id: number) => {
  const token = Cookies.get("accessToken");

  try {
    await axios.delete(`${API_URL}/product/category/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Category deleted successfully");
    toast.success("Category deleted successfully!");
  } catch (error) {
    handleApiError(error, "Failed to delete category");
    throw error;
  }
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const token = Cookies.get("accessToken");
  try {
    const response = await axios.get(`${API_URL}/product/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Products fetched (API response):", response.data);
    return Array.isArray(response.data.results)
      ? response.data.results
      : Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error) {
    handleApiError(error, "Failed to fetch products");
    throw error;
  }
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_URL}/product/category/`);
    console.log("Categories fetched (API response):", response.data);
    return Array.isArray(response.data.results)
      ? response.data.results
      : Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error) {
    handleApiError(error, "Failed to fetch categories");
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await axios.get(
      `https://america-to-bd.vercel.app/product/order/${id}`
    );
    const data = response.data;
    return {
      id: Number(data.id),
      name: data.name,
      description: data.description,
      price: String(data.price),
      title: data.title,
      images: data.images,
      color: data.color,
      sizes: data.sizes,
      image: data.image,
      category: data.category,
      isHighlighted: data.isHighlighted,
    };
  } catch (error) {
    console.error("API fetch error:", error);
    return null;
  }
};
