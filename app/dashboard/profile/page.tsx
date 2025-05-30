"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: "en",
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
    twoFactorEnabled: false,
    avatar: "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "home",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: true,
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic
  };

  const handleAddressUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle address update logic
  };

  return (
    <div className="min-h-screen px-4 py-4 bg-gray-50 sm:py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden bg-white rounded-lg shadow-lg">
          <div className="p-4 sm:p-6">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
              Profile Settings
            </h1>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex -mb-px space-x-8">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`${
                    activeTab === "personal"
                      ? "border-[#174832] text-[#174832]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`${
                    activeTab === "security"
                      ? "border-[#174832] text-[#174832]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Security
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`${
                    activeTab === "addresses"
                      ? "border-[#174832] text-[#174832]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`${
                    activeTab === "notifications"
                      ? "border-[#174832] text-[#174832]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Notifications
                </button>
              </nav>
            </div>

            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="flex items-center gap-6 mb-4">
                  <div className="relative w-20 h-20">
                    <img
                      src={profile.avatar || "/default-avatar.png"}
                      alt="Profile Avatar"
                      className="object-cover w-20 h-20 border-2 border-gray-200 rounded-full shadow"
                    />
                    {profile.avatar && (
                      <button
                        type="button"
                        className="absolute top-0 right-0 p-1 text-xs text-gray-500 bg-white border border-gray-300 rounded-full hover:bg-gray-100"
                        onClick={() => setProfile({ ...profile, avatar: "" })}
                        title="Remove picture"
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setProfile({
                              ...profile,
                              avatar: ev.target?.result as string,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#174832] text-white rounded-md hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {profile.avatar ? "Change Picture" : "Upload Picture"}
                    </button>
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, PNG, or GIF. Max 2MB.
                    </p>
                  </div>
                </div>
                {/* End Profile Picture Upload */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      value={profile.language}
                      onChange={(e) =>
                        setProfile({ ...profile, language: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#174832] text-white rounded-md hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={security.currentPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          currentPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={security.newPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          newPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.twoFactorEnabled}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          twoFactorEnabled: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-[#174832] focus:ring-[#174832] border-gray-300 rounded"
                    />
                    <label className="block ml-2 text-sm text-gray-900">
                      Enable Two-Factor Authentication
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#174832] text-white rounded-md hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832]"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                {addresses.map((address) => (
                  <form
                    key={address.id}
                    onSubmit={handleAddressUpdate}
                    className="p-4 space-y-4 border rounded-lg"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Address Type
                        </label>
                        <select
                          value={address.type}
                          onChange={(e) =>
                            setAddresses(
                              addresses.map((a) =>
                                a.id === address.id
                                  ? { ...a, type: e.target.value }
                                  : a
                              )
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={address.street}
                          onChange={(e) =>
                            setAddresses(
                              addresses.map((a) =>
                                a.id === address.id
                                  ? { ...a, street: e.target.value }
                                  : a
                              )
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) =>
                            setAddresses(
                              addresses.map((a) =>
                                a.id === address.id
                                  ? { ...a, city: e.target.value }
                                  : a
                              )
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          value={address.state}
                          onChange={(e) =>
                            setAddresses(
                              addresses.map((a) =>
                                a.id === address.id
                                  ? { ...a, state: e.target.value }
                                  : a
                              )
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={address.zipCode}
                          onChange={(e) =>
                            setAddresses(
                              addresses.map((a) =>
                                a.id === address.id
                                  ? { ...a, zipCode: e.target.value }
                                  : a
                              )
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <input
                          type="text"
                          value={address.country}
                          onChange={(e) =>
                            setAddresses(
                              addresses.map((a) =>
                                a.id === address.id
                                  ? { ...a, country: e.target.value }
                                  : a
                              )
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#174832] focus:ring-[#174832] sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={address.isDefault}
                          onChange={(e) =>
                            setAddresses(
                              addresses.map((a) =>
                                a.id === address.id
                                  ? { ...a, isDefault: e.target.checked }
                                  : { ...a, isDefault: false }
                              )
                            )
                          }
                          className="h-4 w-4 text-[#174832] focus:ring-[#174832] border-gray-300 rounded"
                        />
                        <label className="block ml-2 text-sm text-gray-900">
                          Set as default address
                        </label>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#174832] text-white rounded-md hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832]"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </form>
                ))}
                <button
                  type="button"
                  className="w-full px-4 py-2 border border-[#174832] text-[#174832] rounded-md hover:bg-[#174832]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832]"
                >
                  Add New Address
                </button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Email Notifications
                      </h3>
                      <p className="text-sm text-gray-500">
                        Receive notifications about your orders and account via
                        email
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`${
                        profile.notifications.email
                          ? "bg-[#174832]"
                          : "bg-gray-200"
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2`}
                      onClick={() =>
                        setProfile({
                          ...profile,
                          notifications: {
                            ...profile.notifications,
                            email: !profile.notifications.email,
                          },
                        })
                      }
                    >
                      <span
                        className={`${
                          profile.notifications.email
                            ? "translate-x-5"
                            : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        SMS Notifications
                      </h3>
                      <p className="text-sm text-gray-500">
                        Receive order updates and alerts via SMS
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`${
                        profile.notifications.sms
                          ? "bg-[#174832]"
                          : "bg-gray-200"
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2`}
                      onClick={() =>
                        setProfile({
                          ...profile,
                          notifications: {
                            ...profile.notifications,
                            sms: !profile.notifications.sms,
                          },
                        })
                      }
                    >
                      <span
                        className={`${
                          profile.notifications.sms
                            ? "translate-x-5"
                            : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Push Notifications
                      </h3>
                      <p className="text-sm text-gray-500">
                        Receive real-time updates on your device
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`${
                        profile.notifications.push
                          ? "bg-[#174832]"
                          : "bg-gray-200"
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2`}
                      onClick={() =>
                        setProfile({
                          ...profile,
                          notifications: {
                            ...profile.notifications,
                            push: !profile.notifications.push,
                          },
                        })
                      }
                    >
                      <span
                        className={`${
                          profile.notifications.push
                            ? "translate-x-5"
                            : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#174832] text-white rounded-md hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832]"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
