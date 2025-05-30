"use client";

import { useState, useEffect } from "react";
import {
  getAddresses,
  createAddress,
  deleteAddress,
  updateAddress,
} from "@/lib/utils/service/user";
import { toast } from "react-hot-toast";
import { FaMapMarkerAlt, FaEnvelope, FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface UserAddress {
  id: number;
  district: string;
  city: string;
  road: string;
  post: number;
  user: number;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    district: "",
    city: "",
    road: "",
    post: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAddress, setEditAddress] = useState({
    district: "",
    city: "",
    road: "",
    post: "",
  });
  const [divisions, setDivisions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    fetchAddresses();
    fetchDivisions();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await getAddresses();
      const normalized = data.map((addr) => ({
        ...addr,
        id: typeof addr.id === "string" ? parseInt(addr.id) : addr.id,
      }));
      setAddresses(normalized);
    } catch (err) {
      setError("Failed to fetch addresses");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchDivisions = async () => {
    try {
      const res = await fetch("https://bdapi.vercel.app/api/v.1/division");
      const data = await res.json();
      setDivisions(data.data);
    } catch (err) {
      console.error("Failed to load divisions");
    }
  };

  const fetchDistricts = async (divisionId: string) => {
    try {
      const res = await fetch(
        `https://bdapi.vercel.app/api/v.1/district/${divisionId}`
      );
      const data = await res.json();
      setDistricts(data.data);
    } catch (err) {
      console.error("Failed to load districts");
    }
  };

  const handleEditDivisionChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const divisionId = e.target.value;
    setEditAddress((prev) => ({ ...prev, district: divisionId, city: "" }));
    await fetchDistricts(divisionId);
  };

  const handleEditDistrictChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const districtName = e.target.value;
    setEditAddress((prev) => ({ ...prev, city: districtName }));
  };
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addressData = {
        ...newAddress,
        post: parseInt(newAddress.post),
      };
      console.log("as", newAddress);
      await createAddress(addressData);
      toast.success("Address added successfully!");
      setShowAddForm(false);
      setNewAddress({
        district: "",
        city: "",
        road: "",
        post: "",
      });
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      await deleteAddress(addressId);
      toast.success("Address deleted successfully!");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-20 bg-gray-50"
      >
        <div className="container max-w-3xl px-4 mx-auto">
          <div className="p-8 bg-white shadow-sm rounded-xl">
            <div className="mb-6">
              <div className="w-1/3 h-8 mb-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-40 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 mb-4 bg-gray-100 border rounded-lg animate-pulse"
                >
                  <div className="w-1/2 h-6 mb-2 bg-gray-300 rounded" />
                  <div className="w-1/3 h-4 mb-1 bg-gray-200 rounded" />
                  <div className="w-1/4 h-4 bg-gray-200 rounded" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-20 bg-gray-50"
    >
      <div className="container max-w-3xl px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 bg-white shadow-sm rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 text-sm font-medium text-white bg-[#FF4B26] rounded-lg hover:bg-[#E63D1A] transition-colors"
            >
              {showAddForm ? "Cancel" : "Add New Address"}
            </motion.button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddAddress}
                className="p-6 mb-6 overflow-hidden rounded-lg bg-gray-50"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Division
                    </label>
                    <select
                      value={
                        divisions.find(
                          (div) => div.name === newAddress.district
                        )?.id || ""
                      }
                      onChange={async (e) => {
                        const selectedId = e.target.value;
                        const selectedDivision = divisions.find(
                          (div) => div.id.toString() === selectedId
                        );

                        if (selectedDivision) {
                          setNewAddress((prev) => ({
                            ...prev,
                            district: selectedDivision.name, // এখানে নাম রাখা হচ্ছে
                            city: "",
                          }));
                          await fetchDistricts(selectedId);
                        }
                      }}
                      required
                      className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    >
                      <option value="">Select Division</option>
                      {divisions.map((division) => (
                        <option key={division.id} value={division.id}>
                          {division.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      District
                    </label>
                    <select
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      required
                      className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Road/Area
                    </label>
                    <input
                      type="text"
                      value={newAddress.road}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          road: e.target.value,
                        }))
                      }
                      required
                      className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#FF4B26] focus:outline-none focus:ring-1 focus:ring-[#FF4B26] transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Postal Code
                    </label>
                    <input
                      type="number"
                      value={newAddress.post}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          post: e.target.value,
                        }))
                      }
                      required
                      className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#FF4B26] focus:outline-none focus:ring-1 focus:ring-[#FF4B26] transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full px-6 py-2.5 bg-[#FF4B26] text-white rounded-lg hover:bg-[#E63D1A] text-sm font-medium transition-colors"
                  >
                    Add Address
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <AnimatePresence>
              {addresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-6 border rounded-xl bg-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between transition-all hover:shadow-md ${
                    editingId === address.id ? "border-blue-500 bg-blue-50" : ""
                  }`}
                >
                  {editingId === address.id ? (
                    <motion.form
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setIsLoading(true);
                        try {
                          await updateAddress(address.id, {
                            ...editAddress,
                            post: parseInt(editAddress.post),
                          });
                          toast.success("Address updated successfully!");
                          setEditingId(null);
                          fetchAddresses();
                        } catch {
                          toast.error("Failed to update address");
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          District
                        </label>
                        <input
                          type="text"
                          value={editAddress.district}
                          onChange={(e) =>
                            setEditAddress((prev) => ({
                              ...prev,
                              district: e.target.value,
                            }))
                          }
                          required
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          value={editAddress.city}
                          onChange={(e) =>
                            setEditAddress((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          required
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Road/Area
                        </label>
                        <input
                          type="text"
                          value={editAddress.road}
                          onChange={(e) =>
                            setEditAddress((prev) => ({
                              ...prev,
                              road: e.target.value,
                            }))
                          }
                          required
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Postal Code
                        </label>
                        <input
                          type="number"
                          value={editAddress.post}
                          onChange={(e) =>
                            setEditAddress((prev) => ({
                              ...prev,
                              post: e.target.value,
                            }))
                          }
                          required
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div className="flex justify-end col-span-2 gap-2 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                          disabled={isLoading}
                        >
                          {isLoading ? "Saving..." : "Save"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          className="px-6 py-2 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                          onClick={() => setEditingId(null)}
                          disabled={isLoading}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.form>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FaMapMarkerAlt className="text-[#FF4B26]" />
                          <span className="text-lg font-semibold text-gray-900">
                            {address.district}, {address.city}
                          </span>
                        </div>
                        <div className="mb-1 text-gray-600">{address.road}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FaEnvelope />
                          <span>Postal Code: {address.post}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setEditingId(address.id);
                            setEditAddress({
                              district: address.district,
                              city: address.city,
                              road: address.road,
                              post: address.post.toString(),
                            });
                          }}
                          className="flex items-center gap-1 px-3 py-1 text-blue-600 transition border border-blue-600 rounded hover:bg-blue-600 hover:text-white"
                        >
                          <FaEdit /> Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDeleteAddress(address.id)}
                          className="flex items-center gap-1 px-3 py-1 text-red-600 transition border border-red-600 rounded hover:bg-red-600 hover:text-white"
                          disabled={isLoading}
                        >
                          <FaTrash /> Delete
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {addresses.length === 0 && !showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 text-center text-gray-500 rounded-lg bg-gray-50"
              >
                No addresses found. Add your first address to get started.
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
