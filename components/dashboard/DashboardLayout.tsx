"use client";

import { FC, ReactNode, useState, useEffect, useRef, forwardRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/lib/utils/service/auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface SearchResult {
  id: number;
  title: string;
  href: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const navigationItems = [
  {
    name: "Account",
    href: "/dashboard/account",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  // {
  //   name: "Orders",
  //   href: "/dashboard/orders",
  //   icon: (
  //     <svg
  //       className="w-5 h-5"
  //       fill="none"
  //       stroke="currentColor"
  //       viewBox="0 0 24 24"
  //     >
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         strokeWidth={2}
  //         d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
  //       />
  //     </svg>
  //   ),
  // },
  {
    name: "Orders",
    href: "/dashboard/manual-requests",
    // icon: (
    //   <svg
    //     className="w-5 h-5"
    //     fill="none"
    //     stroke="currentColor"
    //     viewBox="0 0 24 24"
    //   >
    //     <path
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //       strokeWidth={2}
    //       d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    //     />
    //   </svg>
    // ),
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  },
  // {
  //   name: "Checkout",
  //   href: "/dashboard/checkout",
  //   icon: (
  //     <svg
  //       className="w-5 h-5"
  //       fill="none"
  //       stroke="currentColor"
  //       viewBox="0 0 24 24"
  //     >
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         strokeWidth={2}
  //         d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.52 17h8.96a1 1 0 00.87-1.3L17 13M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
  //       />
  //     </svg>
  //   ),
  // },

  {
    name: "Product Orders",
    href: "/dashboard/order-history",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13l-1.5-6M7 13H5.4M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
        />
      </svg>
    ),
  },
  {
    name: "Track Order",
    href: "/dashboard/track-order",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    name: "Addresses",
    href: "/dashboard/addresses",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

const bottomNavigationItems = [
  {
    name: "Support",
    href: "/dashboard/support",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeWidth="2" d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    name: "Help",
    href: "/dashboard/help",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  // {
  //   name: "Contact us",
  //   href: "/dashboard/contact",
  //   icon: (
  //     <svg
  //       className="w-5 h-5"
  //       fill="none"
  //       stroke="currentColor"
  //       viewBox="0 0 24 24"
  //     >
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         strokeWidth={2}
  //         d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
  //       />
  //     </svg>
  //   ),
  // },
];

const SearchBar = ({
  showProfileButton = true,
}: {
  showProfileButton?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Simulate search results
    if (value.length > 2) {
      setResults([
        { id: 1, title: "Orders", href: "/dashboard/orders" },
        { id: 2, title: "Manual Requests", href: "/dashboard/manual-requests" },
        { id: 3, title: "Account Settings", href: "/dashboard/account" },
      ]);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center gap-5">
        <div className={`relative ${showProfileButton ? "w-[80%]" : "w-full"}`}>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6C19] focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {showProfileButton && (
          <div className="relative w-[40%]">
            <button
              ref={buttonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-2 transition rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <img
                src="https://res.cloudinary.com/dpcxwe6gm/image/upload/v1748257140/free-user-icon-3296-thumb_rpw50y.png"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            </button>
            {isOpen && (
              <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-44">
                <div className="py-2">
                  <button
                    onClick={() => {
                      router.push("/dashboard/account");
                    }}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 cursor-pointer hover:bg-gray-100"
                  >
                    My Account
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-2 text-sm text-left text-red-600 cursor-pointer hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => {
                router.push(result.href);
                setIsOpen(false);
                setQuery("");
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
            >
              <span>{result.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const rawPathname = usePathname();
  const pathname = rawPathname || "/dashboard"; // Provide a default value
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [accountData, setAccountData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    notifications: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
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
        console.error("Error fetching profile:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Simulate loading user data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle click outside for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node) &&
        !profileButtonRef.current?.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = navigationItems.find((item) => item.href === pathname);
    return currentItem ? currentItem.name : "Dashboard";
  };

  // Add this function before the return statement
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      const name = path.charAt(0).toUpperCase() + path.slice(1);
      return { name, href };
    });
    return breadcrumbs;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen bg-[#f8f9fa]"
    >
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 h-full z-30 hidden lg:flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <div className="relative flex flex-col h-full">
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Logo Area */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`py-7 px-4 border-b border-gray-100 ${
                isCollapsed ? "flex justify-center" : ""
              }`}
            >
              <Link
                href="/"
                className="flex items-center gap-2 !text-[##FF6C19]"
              >
                <div className="flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Logo SVG */}
                  </motion.div>
                </div>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-semibold !text-[##FF6C19]"
                  >
                    Return to Homepage
                  </motion.span>
                )}
              </Link>
            </motion.div>

            <SidebarContent
              navigationItems={navigationItems}
              bottomNavigationItems={bottomNavigationItems}
              pathname={pathname || ""}
              isCollapsed={isCollapsed}
            />

            {/* Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3 top-19 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center
                transform transition-transform hover:scale-110 active:scale-95 shadow-sm z-50 hover:border-[#FF6C19] hover:text-[#FF6C19]"
            >
              <motion.svg
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                className="w-4 h-4"
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
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isMobileMenuOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 w-[85%] max-w-[300px] z-50 lg:hidden"
      >
        <div className="flex flex-col h-full bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-semibold text-[#2B2B2B]"
              >
                {getCurrentPageTitle()}
              </motion.span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                className="w-5 h-5"
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
          {/* Home link for mobile sidebar */}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 text-lg font-semibold text-[#FF6C19] hover:bg-[#FF6C19]/10 rounded-xl transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v11a1 1 0 01-1 1h-3m-6 0h6"
              />
            </svg>
            Home
          </Link>
          <div className="flex-1 overflow-y-auto">
            <SidebarContent
              navigationItems={navigationItems}
              bottomNavigationItems={bottomNavigationItems}
              pathname={pathname}
              isMobile={true}
              onItemClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className={`flex-1 min-h-screen transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm"
        >
          <div className="px-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-3 py-4">
              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100 lg:hidden"
                onClick={() => {
                  if (showMobileSearch) {
                    setShowMobileSearch(false);
                  } else {
                    setIsMobileMenuOpen(true);
                  }
                }}
              >
                <svg
                  className="w-5 h-5"
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

              <AnimatePresence>
                {showMobileSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-x-0 top-0 z-50 p-4 bg-white border-b border-gray-100 lg:hidden"
                  >
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100"
                        onClick={() => setShowMobileSearch(false)}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                      </motion.button>
                      <div className="flex-1">
                        <SearchBar showProfileButton={false} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Welcome Text */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex-1 min-w-0"
              >
                <h1 className="text-xl hidden sm:block sm:text-[22px] font-semibold text-[#FF6C19] truncate">
                  {isLoading ? (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-48 bg-gray-200 rounded h-7"
                    />
                  ) : (
                    `Welcome back, ${
                      accountData.first_name + " " + accountData.last_name
                    }!`
                  )}
                </h1>
                {isLoading ? (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-64 h-4 mt-1 bg-gray-200 rounded"
                  />
                ) : (
                  <p className="text-sm hidden sm:block text-[#6E6E6E] truncate">
                    {"Here's what's happening with your store today."}
                  </p>
                )}
              </motion.div>

              {/* Right Side Icons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 ml-auto"
              >
                <div className="hidden w-64 sm:block">
                  <SearchBar />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-[#6E6E6E] transition-colors rounded-lg hover:text-[#2B2B2B] hover:bg-gray-100 sm:hidden"
                  aria-label="Search"
                  onClick={() => setShowMobileSearch(true)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </motion.button>
                <div className="relative sm:hidden">
                  <ProfileButton
                    ref={profileButtonRef}
                    onClick={() => setIsProfileOpen((v) => !v)}
                  />
                  {isProfileOpen && (
                    <div
                      ref={profileDropdownRef}
                      className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-44"
                    >
                      <div className="py-2">
                        <button
                          onClick={() => {
                            router.push("/dashboard/account");
                            setIsProfileOpen(false);
                          }}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 cursor-pointer hover:bg-gray-100"
                        >
                          My Account
                        </button>
                        <button
                          onClick={logout}
                          className="block w-full px-4 py-2 text-sm text-left text-red-600 cursor-pointer hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-4 py-2 bg-white border-b border-gray-100 sm:px-6"
        >
          <div className="flex items-center space-x-2 text-sm">
            {getBreadcrumbs().map((crumb, index) => {
              const isFirst = index === 0;
              const isLast = index === getBreadcrumbs().length - 1;

              return (
                <motion.div
                  key={crumb.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center space-x-2"
                >
                  {/* Show icon only if it's not the first breadcrumb (e.g., not Dashboard) */}
                  {!isFirst && (
                    <svg
                      className="w-4 h-4 text-gray-400"
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
                  <Link
                    href={crumb.href}
                    className={`transition-colors ${
                      isLast
                        ? "text-[#2B2B2B] font-medium"
                        : "text-[#6E6E6E] hover:text-[#2B2B2B]"
                    }`}
                  >
                    {crumb.name}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 sm:p-6"
        >
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

// Update SidebarContent component with animations
const SidebarContent: FC<{
  navigationItems: Array<{
    name: string;
    href: string;
    icon: ReactNode;
  }>;
  bottomNavigationItems: Array<{
    name: string;
    href: string;
    icon: ReactNode;
  }>;
  pathname: string;
  isMobile?: boolean;
  isCollapsed?: boolean;
  onItemClick?: () => void;
}> = ({
  navigationItems,
  bottomNavigationItems,
  pathname,
  isMobile,
  isCollapsed,
  onItemClick,
}) => {
  return (
    <div className="flex flex-col h-full border-r border-gray-100 shadow-xl bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-r-3xl">
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative group"
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#FF6C19] focus:bg-[#FF6C19]/10
                  ${
                    pathname === item.href
                      ? "bg-[#FF6C19]/10 text-[#FF6C19] shadow-sm"
                      : "text-[#2B2B2B] hover:bg-[#FF6C19]/5 hover:text-[#FF6C19]"
                  }
                  ${
                    isMobile
                      ? "active:scale-[0.98]"
                      : "hover:scale-[1.03] active:scale-[0.98]"
                  }`}
                tabIndex={0}
                onClick={onItemClick}
              >
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="transition-transform duration-200"
                >
                  {item.icon}
                </motion.span>
                {!isCollapsed && (
                  <span className="text-base whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
              {isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute z-50 invisible px-2 py-1 ml-2 transition-all duration-200 translate-x-2 -translate-y-1/2 bg-gray-800 rounded-md shadow-lg opacity-0 pointer-events-none left-full top-1/2 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 whitespace-nowrap"
                >
                  <span className="text-xs text-white">{item.name}</span>
                  <div className="absolute left-0 w-2 h-2 rotate-45 -translate-x-1 -translate-y-1/2 bg-gray-800 top-1/2" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </nav>
      {/* Divider for support section */}
      <div className="mx-4 my-2 border-t border-gray-200" />
      <div className="p-4 pb-6 space-y-2 bg-gradient-to-t from-gray-100 via-white to-white rounded-b-3xl">
        {bottomNavigationItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (index + navigationItems.length) }}
            className="relative group"
          >
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#FF6C19] focus:bg-[#FF6C19]/10
                text-[#2B2B2B] hover:bg-[#FF6C19]/5 hover:text-[#FF6C19]`}
              tabIndex={0}
              onClick={onItemClick}
            >
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="transition-transform duration-200"
              >
                {item.icon}
              </motion.span>
              {!isCollapsed && (
                <span className="text-base whitespace-nowrap">{item.name}</span>
              )}
            </Link>
            {isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute z-50 invisible px-2 py-1 ml-2 transition-all duration-200 translate-x-2 -translate-y-1/2 bg-gray-800 rounded-md shadow-lg opacity-0 pointer-events-none left-full top-1/2 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 whitespace-nowrap"
              >
                <span className="text-xs text-white">{item.name}</span>
                <div className="absolute left-0 w-2 h-2 rotate-45 -translate-x-1 -translate-y-1/2 bg-gray-800 top-1/2" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Update ProfileButton to accept ref and onClick
const ProfileButton = forwardRef<HTMLButtonElement, { onClick?: () => void }>(
  ({ onClick }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 transition rounded-lg cursor-pointer hover:bg-gray-100"
    >
      <img
        src="https://res.cloudinary.com/dpcxwe6gm/image/upload/v1748257140/free-user-icon-3296-thumb_rpw50y.png"
        alt="User Avatar"
        className="w-8 h-8 rounded-full"
      />
    </button>
  )
);
ProfileButton.displayName = "ProfileButton";

export default DashboardLayout;
