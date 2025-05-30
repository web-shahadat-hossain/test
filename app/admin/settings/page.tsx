"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUserRole } from "@/lib/utils/service/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSettings,
  FiUsers,
  FiBell,
  FiLock,
  FiLayout,
  FiDatabase,
} from "react-icons/fi";

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="space-y-8">
      <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="space-y-6">
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <div className="w-32 h-6 mb-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <div className="w-32 h-6 mb-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data for demonstration
const mockStats = {
  totalUsers: 1248,
  totalOrders: 856,
  pendingRequests: 23,
  revenue: 45690,
};

export default function SettingsPage() {
  const [timeRange, setTimeRange] = useState("today");
  const [admins, setAdmins] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "AM to US",
    siteDescription: "Your trusted shopping assistant",
    supportEmail: "support@amtous.com",
    supportPhone: "+1 234 567 8900",
    timezone: "UTC-5",
    language: "en",
    currency: "USD",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    whatsappNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
  });

  const [appearance, setAppearance] = useState({
    primaryColor: "#ff5c00",
    accentColor: "#ff2f0a",
    fontFamily: "Inter",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const handleGeneralSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setGeneralSettings({
      ...generalSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]:
        !notificationSettings[setting as keyof typeof notificationSettings],
    });
  };

  const handleAppearanceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAppearance({
      ...appearance,
      [e.target.name]: e.target.value,
    });
  };

  const handleSecuritySettingsChange = (
    e: React.ChangeEvent<HTMLSelectElement> | string
  ) => {
    if (typeof e === "string") {
      setSecuritySettings({
        ...securitySettings,
        [e]: !securitySettings[e as keyof typeof securitySettings],
      });
    } else {
      setSecuritySettings({
        ...securitySettings,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleBackup = () => {
    // Implement backup functionality
    console.log("Backing up data...");
  };

  const handleRestore = () => {
    // Implement restore functionality
    console.log("Restoring data...");
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      await axios.post("/api/admin/settings", {
        generalSettings,
        notificationSettings,
        appearance,
        securitySettings,
      });
      setSaveSuccess("Settings saved successfully");
    } catch (err: any) {
      setSaveError(err.response?.data?.error || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Ensure getUserRole always returns a string (fallback to "")
    const role = getUserRole() || "";
    setUserRole(role);
  }, []);

  useEffect(() => {
    if (!userRole) return;
    if (userRole === "admin" || userRole === "superadmin") {
      setShouldRender(true);
    } else {
      router.replace("/login");
    }
  }, [userRole, router]);

  useEffect(() => {
    if (userRole === "superadmin") {
      fetchAdmins();
    }
    // eslint-disable-next-line
  }, [userRole]);

  const fetchAdmins = async () => {
    setAdminLoading(true);
    setAdminError("");
    try {
      const res = await axios.get("/api/superadmin/get_admin");
      setAdmins(res.data.admins || []);
    } catch (err: any) {
      setAdminError("Failed to fetch admins");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError("");
    setAdminSuccess("");
    try {
      await axios.post("/api/superadmin/add_admin", { email: newAdminEmail });
      setAdminSuccess("Admin added successfully");
      setNewAdminEmail("");
      fetchAdmins();
    } catch (err: any) {
      setAdminError(err.response?.data?.error || "Failed to add admin");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    setAdminLoading(true);
    setAdminError("");
    setAdminSuccess("");
    try {
      await axios.post("/api/superadmin/remove_admin", { email });
      setAdminSuccess("Admin removed successfully");
      fetchAdmins();
    } catch (err: any) {
      setAdminError(err.response?.data?.error || "Failed to remove admin");
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/admin/settings");
        const data = response.data;

        if (data.generalSettings) setGeneralSettings(data.generalSettings);
        if (data.notificationSettings)
          setNotificationSettings(data.notificationSettings);
        if (data.appearance) setAppearance(data.appearance);
        if (data.securitySettings) setSecuritySettings(data.securitySettings);
      } catch (err: any) {
        setLoadError(err.response?.data?.error || "Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    if (shouldRender) {
      fetchSettings();
    }
  }, [shouldRender]);

  if (!shouldRender) return null;

  if (isLoading) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <SkeletonLoader />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{loadError}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-4 py-8 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8"
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-3xl font-bold text-gray-900"
      >
        <FiSettings className="text-orange-500" />
        Settings
      </motion.h1>

      {/* Super Admin Section */}
      <AnimatePresence>
        {userRole === "superadmin" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 mb-6 transition-shadow duration-300 bg-white border border-orange-200 shadow-lg rounded-xl hover:shadow-xl"
          >
            <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-orange-600">
              <FiUsers className="text-orange-500" />
              Super Admin Controls
            </h2>
            <form
              onSubmit={handleAddAdmin}
              className="flex flex-col gap-4 mb-6 sm:flex-row"
            >
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="Enter admin email"
                required
                className="flex-1 px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={adminLoading}
                className="px-6 py-3 text-white transition-colors duration-200 bg-[#ff5c00] rounded-lg hover:bg-[#ff2f0a] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adminLoading ? "Adding..." : "Add Admin"}
              </motion.button>
            </form>
            <AnimatePresence>
              {adminError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 mb-4 text-red-600 rounded-lg bg-red-50"
                >
                  {adminError}
                </motion.div>
              )}
              {adminSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 mb-4 text-green-600 rounded-lg bg-green-50"
                >
                  {adminSuccess}
                </motion.div>
              )}
            </AnimatePresence>
            <h3 className="mb-4 text-lg font-semibold text-gray-700">
              Current Admins:
            </h3>
            {adminLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-8 h-8 border-b-2 border-orange-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <motion.ul
                className="divide-y divide-gray-200"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {admins.map((email) => (
                  <motion.li
                    key={email}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className="flex items-center justify-between py-4"
                  >
                    <span className="text-gray-700">{email}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveAdmin(email)}
                      className="px-3 py-1.5 text-sm text-white bg-[#ff5c00] rounded-lg hover:bg-[#ff2f0a] transition-colors duration-200"
                    >
                      Remove
                    </motion.button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* General Settings */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="transition-shadow duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl"
      >
        <div className="p-6">
          <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-900">
            <FiLayout className="text-orange-500" />
            General Settings
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={generalSettings.siteName}
                onChange={handleGeneralSettingsChange}
                className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Site Description
              </label>
              <input
                type="text"
                name="siteDescription"
                value={generalSettings.siteDescription}
                onChange={handleGeneralSettingsChange}
                className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Support Email
              </label>
              <input
                type="email"
                name="supportEmail"
                value={generalSettings.supportEmail}
                onChange={handleGeneralSettingsChange}
                className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Support Phone
              </label>
              <input
                type="tel"
                name="supportPhone"
                value={generalSettings.supportPhone}
                onChange={handleGeneralSettingsChange}
                className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                name="timezone"
                value={generalSettings.timezone}
                onChange={handleGeneralSettingsChange}
                className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                <option value="UTC-12">UTC-12</option>
                <option value="UTC-11">UTC-11</option>
                <option value="UTC-10">UTC-10</option>
                <option value="UTC-9">UTC-9</option>
                <option value="UTC-8">UTC-8</option>
                <option value="UTC-7">UTC-7</option>
                <option value="UTC-6">UTC-6</option>
                <option value="UTC-5">UTC-5</option>
                <option value="UTC-4">UTC-4</option>
                <option value="UTC-3">UTC-3</option>
                <option value="UTC-2">UTC-2</option>
                <option value="UTC-1">UTC-1</option>
                <option value="UTC">UTC</option>
                <option value="UTC+1">UTC+1</option>
                <option value="UTC+2">UTC+2</option>
                <option value="UTC+3">UTC+3</option>
                <option value="UTC+4">UTC+4</option>
                <option value="UTC+5">UTC+5</option>
                <option value="UTC+6">UTC+6</option>
                <option value="UTC+7">UTC+7</option>
                <option value="UTC+8">UTC+8</option>
                <option value="UTC+9">UTC+9</option>
                <option value="UTC+10">UTC+10</option>
                <option value="UTC+11">UTC+11</option>
                <option value="UTC+12">UTC+12</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                name="language"
                value={generalSettings.language}
                onChange={handleGeneralSettingsChange}
                className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                name="currency"
                value={generalSettings.currency}
                onChange={handleGeneralSettingsChange}
                className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="JPY">Japanese Yen (JPY)</option>
                <option value="AUD">Australian Dollar (AUD)</option>
                <option value="CAD">Canadian Dollar (CAD)</option>
                <option value="CHF">Swiss Franc (CHF)</option>
                <option value="CNY">Chinese Yuan (CNY)</option>
                <option value="INR">Indian Rupee (INR)</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div> */}

      {/* Security Settings */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="transition-shadow duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl"
      >
        <div className="p-6">
          <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-900">
            <FiLock className="text-orange-500" />
            Security Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => handleSecuritySettingsChange("twoFactorAuth")}
                className={`${
                  securitySettings.twoFactorAuth
                    ? "bg-[#ff5c00]"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    securitySettings.twoFactorAuth
                      ? "translate-x-5"
                      : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Session Timeout (minutes)
              </label>
              <select
                name="sessionTimeout"
                value={securitySettings.sessionTimeout}
                onChange={handleSecuritySettingsChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#ff5c00] focus:border-[#ff5c00]"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password Expiry (days)
              </label>
              <select
                name="passwordExpiry"
                value={securitySettings.passwordExpiry}
                onChange={handleSecuritySettingsChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#ff5c00] focus:border-[#ff5c00]"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">365 days</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div> */}

      {/* Notification Settings */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="transition-shadow duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl"
      >
        <div className="p-6">
          <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-900">
            <FiBell className="text-orange-500" />
            Notification Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Email Notifications
                </h3>
                <p className="text-sm text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <button
                onClick={() => handleNotificationToggle("emailNotifications")}
                className={`${
                  notificationSettings.emailNotifications
                    ? "bg-[#ff5c00]"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    notificationSettings.emailNotifications
                      ? "translate-x-5"
                      : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  WhatsApp Notifications
                </h3>
                <p className="text-sm text-gray-500">
                  Receive notifications via WhatsApp
                </p>
              </div>
              <button
                onClick={() =>
                  handleNotificationToggle("whatsappNotifications")
                }
                className={`${
                  notificationSettings.whatsappNotifications
                    ? "bg-[#ff5c00]"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    notificationSettings.whatsappNotifications
                      ? "translate-x-5"
                      : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Order Updates
                </h3>
                <p className="text-sm text-gray-500">
                  Receive updates about orders
                </p>
              </div>
              <button
                onClick={() => handleNotificationToggle("orderUpdates")}
                className={`${
                  notificationSettings.orderUpdates
                    ? "bg-[#ff5c00]"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    notificationSettings.orderUpdates
                      ? "translate-x-5"
                      : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Marketing Emails
                </h3>
                <p className="text-sm text-gray-500">
                  Receive marketing and promotional emails
                </p>
              </div>
              <button
                onClick={() => handleNotificationToggle("marketingEmails")}
                className={`${
                  notificationSettings.marketingEmails
                    ? "bg-[#ff5c00]"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    notificationSettings.marketingEmails
                      ? "translate-x-5"
                      : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div> */}

      {/* Appearance Settings */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="transition-shadow duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl"
      >
        <div className="p-6">
          <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-900">
            <FiLayout className="text-orange-500" />
            Appearance
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Primary Color
              </label>
              <div className="flex items-center mt-1">
                <input
                  type="color"
                  name="primaryColor"
                  value={appearance.primaryColor}
                  onChange={handleAppearanceChange}
                  className="w-8 h-8 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={appearance.primaryColor}
                  onChange={handleAppearanceChange}
                  className="ml-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#ff5c00] focus:border-[#ff5c00]"
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Font Family
              </label>
              <select
                name="fontFamily"
                value={appearance.fontFamily}
                onChange={handleAppearanceChange}
                className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Poppins">Poppins</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div> */}

      {/* Backup and Restore */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="transition-shadow duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl"
      >
        <div className="p-6">
          <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-900">
            <FiLayout className="text-orange-500" />
            Backup & Restore
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackup}
                className="px-4 py-2 text-white bg-[#ff5c00] rounded-lg hover:bg-[#ff2f0a] transition-colors"
              >
                Backup Data
              </button>
              <button
                onClick={handleRestore}
                className="px-4 py-2 text-[#ff5c00] border border-[#ff5c00] rounded-lg hover:bg-[#ff5c00] hover:text-white transition-colors"
              >
                Restore Data
              </button>
            </div>
            <p className="text-sm text-gray-500">Last backup: Never</p>
          </div>
        </div>
      </motion.div> */}

      {/* Save Button */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end space-x-4"
      >
        <AnimatePresence>
          {saveError && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-red-600"
            >
              {saveError}
            </motion.div>
          )}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-green-600"
            >
              {saveSuccess}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="px-6 py-3 text-white transition-colors duration-200 bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </motion.button>
      </motion.div> */}
    </motion.div>
  );
}
