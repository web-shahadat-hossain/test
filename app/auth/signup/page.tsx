"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/utils/service/auth";
import toast from "react-hot-toast";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    const loadingToast = toast.loading("Signing up...");

    const response = await register(
      formData.first_name,
      formData.last_name,
      formData.email,
      formData.phone,
      formData.password
    );

    if (
      response &&
      (response.success || response.message === "registration successful")
    ) {
      toast.success(
        response?.message || "Successfully signed up! Please sign in.",
        {
          id: loadingToast,
        }
      );
      setSuccess("Account created successfully! Redirecting to sign in...");
      setTimeout(() => router.push("/auth/signin"), 1500);
    } else {
      toast.error(
        response?.error ||
          response?.detail ||
          response?.message ||
          "Sign up failed",
        {
          id: loadingToast,
        }
      );
      setError(
        response?.error ||
          response?.detail ||
          response?.message ||
          "Sign up failed"
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-white">
      {/* Background decorative elements */}
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

      {/* Main content */}
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
            Create Account
          </motion.h2>
          <motion.p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/signin"
              className="text-[#FF4400] hover:underline"
            >
              sign in to your account
            </Link>
          </motion.p>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                value={formData.first_name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF4400] focus:border-[#FF4400]"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                value={formData.last_name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF4400] focus:border-[#FF4400]"
                placeholder="Enter your last name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF4400] focus:border-[#FF4400]"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF4400] focus:border-[#FF4400]"
                placeholder="Enter your phone number"
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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF4400] hover:bg-[#FF5500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4400]"
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
