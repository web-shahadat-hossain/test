"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiSave } from "react-icons/fi";

const SkeletonLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6 bg-white shadow-sm rounded-xl"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default function AccountPage() {
  const [accountData, setAccountData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/profile", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setAccountData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          notifications: true,
        });
      } catch (err: any) {
        setError(err.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        first_name: accountData.first_name,
        last_name: accountData.last_name,
        email: accountData.email,
        phone: accountData.phone,
      };
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-900"
        >
          Account Settings
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-200 bg-[#ff5c00] rounded-xl hover:bg-[#ff2f0a] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          <FiSave className="w-5 h-5" />
          {saving ? "Saving..." : "Save Changes"}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 text-red-600 bg-red-50 rounded-xl"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 text-green-600 bg-green-50 rounded-xl"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className="p-6 space-y-6 bg-white shadow-sm rounded-xl"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <FiUser className="w-4 h-4" />
                  First Name
                </label>
                <input
                  type="text"
                  value={accountData.first_name}
                  onChange={(e) =>
                    setAccountData({
                      ...accountData,
                      first_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <FiUser className="w-4 h-4" />
                  Last Name
                </label>
                <input
                  type="text"
                  value={accountData.last_name}
                  onChange={(e) =>
                    setAccountData({
                      ...accountData,
                      last_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <FiMail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={accountData.email}
                  onChange={(e) =>
                    setAccountData({ ...accountData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <FiPhone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={accountData.phone}
                  onChange={(e) =>
                    setAccountData({ ...accountData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
