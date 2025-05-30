/* eslint-disable prefer-const */
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, setAuthToken } from "@/lib/utils/service/auth";
import toast from "react-hot-toast";

export default function SignIn() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔁 Store previous page in sessionStorage on mount
  useEffect(() => {
    const previousUrl = document.referrer;
    if (previousUrl && !previousUrl.includes("/auth/signin")) {
      sessionStorage.setItem("redirectAfterLogin", previousUrl);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.identifier || !formData.password) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    const loadingToast = toast.loading("Signing in...");

    const isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.identifier);
    const isPhone = /^\+?\d{10,15}$/.test(
      formData.identifier.replace(/\s+/g, "")
    );

    let loginInput: any = { password: formData.password };
    if (isEmail) {
      loginInput.email = formData.identifier;
    } else if (isPhone) {
      loginInput.phone = formData.identifier.replace(/\s+/g, "");
    } else {
      toast.error("Please enter a valid email or phone number", {
        id: loadingToast,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await login(loginInput);
      console.log("Login response:", response);

      setAuthToken(response.access);
      localStorage.setItem("refreshToken", response.refresh);

      toast.success("Successfully signed in!", { id: loadingToast });

      const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");

      if (response.is_superuser || response.is_staff === true) {
        router.push("/admin/dashboard");
      } else if (redirectAfterLogin) {
        router.push(redirectAfterLogin);
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unable to connect to the server. Please try again.";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full">
        <div className="absolute right-0 top-0 w-full h-full bg-[#7dd3fc] opacity-20 rounded-bl-[100px]" />
        <div className="absolute right-20 top-20 w-3/4 h-3/4 bg-[#0ea5e9] opacity-20 rounded-bl-[200px] transform rotate-12" />
      </div>
      <div className="absolute bottom-0 left-0 w-1/2 h-2/3">
        <div className="absolute left-0 bottom-0 w-full h-full bg-[#7dd3fc] opacity-10 rounded-tr-[150px]" />
        <div className="absolute left-20 bottom-20 w-3/4 h-3/4 bg-[#0ea5e9] opacity-10 rounded-tr-[120px] transform -rotate-12" />
      </div>

      {/* Floating circles */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-20, 20, -20] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-16 h-16 bg-[#7dd3fc] rounded-full opacity-20"
      />
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [20, -20, 20] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-24 h-24 bg-[#0ea5e9] rounded-full opacity-10"
      />

      {/* Main form container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="relative w-full max-w-md p-8 space-y-8 bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-[var(--color-softGray)] mx-4"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 text-sm text-red-600 rounded-lg bg-red-50"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 text-sm text-green-600 rounded-lg bg-green-50"
          >
            {success}
          </motion.div>
        )}

        <motion.div className="text-center">
          <motion.h2 className="text-4xl font-bold text-[#FF4400]">
            Welcome Back
          </motion.h2>
          <motion.p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/signup"
              className="text-[#FF4400] hover:underline"
            >
              create a new account
            </Link>
          </motion.p>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700"
              >
                Email or Phone
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={formData.identifier}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF4400] focus:border-[#FF4400]"
                placeholder="Enter your email or phone number"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF4400] focus:border-[#FF4400]"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#FF4400] focus:ring-[#FF4400] border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="block ml-2 text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-[#FF4400] hover:underline">
                Forgot your password?
              </a>
            </div>
          </div> */}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF4400] hover:bg-[#FF5500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4400]"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
