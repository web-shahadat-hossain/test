"use client";

import React, { useEffect, useState } from "react";
import { getCustomer } from "@/lib/utils/service/customer";

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomer();
        setCustomers(data);
      } catch (err) {
        console.error("❌ Failed to fetch customers:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery)) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="p-6 bg-white shadow-sm rounded-xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-[#FF6C19]">Customer List</h1>
            <span className="text-sm text-gray-600">
              Showing {filteredCustomers.length} customers
            </span>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, email or phone"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FF6C19] focus:border-[#FF6C19]"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-10">Loading...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-10">No customers found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold border border-[#FF6C19]">
                        ID
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold border border-[#FF6C19]">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold border border-[#FF6C19]">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold border border-[#FF6C19]">
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedCustomers.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-[#FFF3E6] transition cursor-pointer"
                      >
                        <td className="px-4 py-2 text-sm border border-[#FF6C19]">
                          {c.id}
                        </td>
                        <td className="px-4 py-2 text-sm border border-[#FF6C19]">
                          {c.first_name} {c.last_name}
                        </td>
                        <td className="px-4 py-2 text-sm border border-[#FF6C19]">
                          {c.email}
                        </td>
                        <td className="px-4 py-2 text-sm border border-[#FF6C19]">
                          {c.phone || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1
                        ? "bg-[#FF6C19] text-white"
                        : "bg-white text-[#FF6C19] border-[#FF6C19]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
