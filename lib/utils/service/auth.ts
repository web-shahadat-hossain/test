import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const API_URL = "/api/auth/signin";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";

export interface LoginResponse {
  refresh: string;
  access: string;
  is_superuser?: boolean;
  is_staff?: boolean;
}

export interface RegisterResponse {
  message?: string;
  detail?: string;
  success?: boolean;
  error?: string;
}

export interface LoginInput {
  email?: string;
  phone?: string;
  password: string;
}

export const login = async (input: LoginInput): Promise<LoginResponse> => {
  try {
    console.log("Sending login request with:", input);

    const response = await axios.post(API_URL, input);

    console.log("Login response:", response.data);

    // Set the access token in cookies
    Cookies.set("accessToken", response.data.access, { expires: 1 }); // Expires in 1 day
    Cookies.set("refreshToken", response.data.refresh, { expires: 7 }); // Expires in 7 days

    // Determine and set user role
    const role = getRoleFromResponse(response.data);
    Cookies.set("userRole", role, { expires: 1 });

    return {
      access: response.data.access,
      refresh: response.data.refresh,
      is_superuser: response.data.is_superuser,
      is_staff: response.data.is_staff,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{
      detail?: string;
      non_field_errors?: string[];
    }>;
    console.error(
      "Login error:",
      axiosError.response?.data || axiosError.message
    );
    throw new Error(
      axiosError.response?.data?.detail ||
        (axiosError.response?.data?.non_field_errors &&
          axiosError.response?.data?.non_field_errors[0]) ||
        axiosError.message ||
        "Unable to connect to the server"
    );
  }
};

// Helper to determine role from response
export function getRoleFromResponse(
  data: any
): "superadmin" | "admin" | "user" {
  if (data.is_superuser) return "superadmin";
  if (data.is_staff) return "admin";
  return "user";
}

export const getUserRole = (): string | undefined => {
  return Cookies.get("userRole");
};

export const setAuthToken = (token: string) => {
  if (token) {
    Cookies.set("accessToken", token, { expires: 1 }); // Expires in 1 day
    // Set token for future axios requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    Cookies.remove("accessToken");
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const getAuthToken = () => {
  return Cookies.get("accessToken");
};

export const isAuthenticated = () => {
  return !!Cookies.get("accessToken");
};

export const logout = () => {
  setAuthToken("");
  Cookies.remove("refreshToken");
  window.location.href = "/auth/signin";
};

export const register = async (
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    const response = await axios.post("/api/auth/signup", {
      first_name,
      last_name,
      email,
      phone,
      password,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{
      detail?: string;
      error?: string;
      message?: string;
    }>;
    // Log error for debugging
    console.error(
      "Register error:",
      axiosError.response?.data || axiosError.message
    );
    return {
      error:
        axiosError.response?.data?.detail ||
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Unable to connect to the server",
    };
  }
};
