"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  ShoppingBagIcon,
  CogIcon,
  ClipboardDocumentListIcon,
  NewspaperIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
  { name: "Overview", href: "/admin/dashboard", icon: HomeIcon },
  {
    name: "Resolved Orders",
    href: "/admin/resolved-orders",
    icon: ShoppingBagIcon,
  },
  {
    name: "Manual Requests",
    href: "/admin/manual-requests",
    icon: ShoppingBagIcon,
  },
  {
    name: "Manual Payment",
    href: "/admin/manual-payments",
    icon: ClipboardDocumentListIcon,
  },
  { name: "Products", href: "/admin/products", icon: ShoppingBagIcon },

  // ✅ New Blog Menu Item

  {
    name: "Product Orders",
    href: "/admin/product/order-history",
    icon: ShoppingBagIcon, // 🛍️ পণ্যের অর্ডার বোঝাতে শ্রেষ্ঠ
  },
  {
    name: "Customers",
    href: "/admin/customer/all",
    icon: UsersIcon, // 👥 একাধিক গ্রাহকের জন্য উপযুক্ত
  },
  // {
  //   name: "Blog",
  //   href: "/admin/blogs",
  //   icon: NewspaperIcon, // আপনি চাইলে অন্য আইকন ব্যবহার করতে পারেন
  // },
  { name: "Settings", href: "/admin/settings", icon: CogIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // User info state
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Read cookies for userRole and userName/email
  useEffect(() => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {} as Record<string, string>);
      setUserRole(cookies["userRole"] || null);
      // Try to get userName/email from a cookie, fallback to 'Admin'
      setUserName(cookies["userName"] || cookies["userEmail"] || "Admin");
    }
  }, []);

  // Close sidebar on outside click (mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 640 &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  // Keyboard navigation: ESC to close on mobile
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isSidebarOpen && window.innerWidth < 640) {
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  // Sidebar items, filter Settings for superadmin only
  const filteredSidebarItems = sidebarItems.filter(
    (item) => item.name !== "Settings" || userRole === "superadmin"
  );

  // Logout logic
  const handleLogout = () => {
    // Remove cookies
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirect to signin
    router.push("/auth/signin");
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Close dropdown on ESC
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDropdownOpen(false);
    }
    if (dropdownOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dropdownOpen]);

  return (
    <div className="flex min-h-screen font-sans bg-cloudGray">
      {/* Sidebar Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 bg-black/30 sm:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.aside
            key="sidebar"
            ref={sidebarRef}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 z-40 min-h-screen transition-all duration-300 bg-white border-r border-gray-200 flex flex-col shadow-card rounded-r-2xl
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
              ${isCollapsed ? "w-20" : "w-64"}
              sm:translate-x-0 sm:static sm:block`}
            aria-label="Sidebar"
            tabIndex={0}
          >
            <div
              className={`flex items-center justify-between ${
                isCollapsed ? "px-2" : "px-6"
              } py-5 mb-2`}
            >
              <Link href="/admin/dashboard" className="flex items-center">
                <span
                  className={`text-2xl font-bold text-[#ff5c00] tracking-tight transition-all duration-200 ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                >
                  Admin Panel
                </span>
              </Link>
              {/* Collapse/Expand button (desktop only) */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCollapsed((prev) => !prev)}
                className="hidden sm:inline-flex p-2 ml-2 rounded-lg hover:bg-cloudGray focus:outline-none focus:ring-2 focus:ring-[#ff5c00] transition"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                tabIndex={0}
              >
                {isCollapsed ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </motion.button>
              {/* Hamburger for mobile */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(false)}
                className="sm:hidden ml-2 p-1 rounded-lg hover:bg-cloudGray focus:outline-none focus:ring-2 focus:ring-[#ff5c00] transition"
                aria-label="Close sidebar"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>
            <ul className="flex-1 px-1 pb-4 space-y-2 font-medium" role="menu">
              {filteredSidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name} role="none">
                    <Link
                      href={item.href}
                      tabIndex={0}
                      role="menuitem"
                      className={`group flex items-center p-3 rounded-xl transition-colors duration-200 relative shadow-none hover:shadow-input
                        ${
                          isActive
                            ? "bg-[#ff5c00] text-white hover:bg-[#ff2f0a] font-bold border-l-4 border-[#ff5c00] shadow-card"
                            : "text-gray-900 hover:bg-cloudGray"
                        }
                        ${isCollapsed ? "justify-center" : ""}
                      `}
                      onClick={() => {
                        if (window.innerWidth < 640) setIsSidebarOpen(false);
                      }}
                      aria-current={isActive ? "page" : undefined}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon
                        className={`w-6 h-6 transition-colors duration-200 ${
                          isActive
                            ? "text-white"
                            : "text-gray-500 group-hover:text-gray-900"
                        }`}
                      />
                      <span
                        className={`ml-3 transition-all duration-200 text-base font-semibold ${
                          isCollapsed ? "hidden" : "block"
                        }`}
                      >
                        {item.name}
                      </span>
                      {isCollapsed && (
                        <span className="absolute z-50 px-2 py-1 ml-2 text-xs text-white bg-gray-900 rounded shadow-lg opacity-0 pointer-events-none left-full group-hover:opacity-100 whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="flex-shrink-0 h-4" />
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Main content */}
      <motion.div
        className={`flex-1 min-w-0 min-h-screen transition-all duration-300 ${
          isSidebarOpen && !isCollapsed
            ? "sm:ml-0"
            : isSidebarOpen && isCollapsed
            ? "sm:ml-0"
            : "sm:ml-0"
        }`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="p-4 m-4 border-2 border-gray-200 rounded-2xl min-h-[calc(100vh-2rem)] bg-white shadow-card">
          {/* Top Navigation */}
          <div className="flex items-end justify-between mb-8">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl sm:hidden hover:bg-cloudGray focus:outline-none focus:ring-2 focus:ring-[#ff5c00] transition"
              aria-label="Open sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.button>
            <div className="flex items-center space-x-4">
              {/* <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 transition rounded-xl hover:bg-cloudGray focus:outline-none"
              >
                <BellIcon className="w-6 h-6 text-gray-500" />
                <span className="absolute w-2 h-2 bg-red-500 rounded-full shadow-lg top-1 right-1"></span>
              </motion.button> */}
              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-3 px-3 py-2 transition bg-white rounded-full hover:bg-gray-100 focus:outline-none group"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-10 h-10 rounded-full bg-[#ff5c00] flex items-center justify-center text-white text-lg font-bold shadow-input group-hover:ring-2 group-hover:ring-[#ff5c00] transition">
                    {userName ? userName[0].toUpperCase() : "A"}
                  </div>
                  <span className="text-base font-semibold text-gray-900">
                    {userName || "Admin"}
                  </span>
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform ${
                      dropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 z-50 mt-0 mt-1 origin-top-left bg-white border border-gray-200 shadow-xl w-44 rounded-xl focus:outline-none"
                      style={{ minWidth: "140px" }}
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full px-5 py-2 text-sm text-left text-gray-700 transition rounded-lg hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
