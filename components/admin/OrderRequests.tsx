import { useState, useEffect } from "react";
import {
  getOrderRequests,
  resolveOrder,
  searchOrders,
  OrderResponse,
  ResolvedOrder,
} from "@/lib/utils/service/order";
import { toast } from "react-hot-toast";

export default function OrderRequests() {
  const [requests, setRequests] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<OrderResponse | null>(
    null
  );
  const [resolveForm, setResolveForm] = useState<Partial<ResolvedOrder>>({
    usd_price: 0,
    converted_price: 0,
    custom_fee: 0,
    tax: 0,
    box_fee: 0,
    cost: 0,
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrderRequests();
      setRequests(data.results);
    } catch (err) {
      setError("Failed to fetch requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchRequests();
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchOrders(searchQuery, "request");
      setRequests(results as OrderResponse[]);
    } catch (err) {
      setError("Failed to search requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      const resolvedOrder: ResolvedOrder = {
        order_id: selectedRequest.id,
        product_url: selectedRequest.product_url,
        quantity: selectedRequest.quantity,
        description: selectedRequest.description,
        ...resolveForm,
      } as ResolvedOrder;

      await resolveOrder(resolvedOrder);
      toast.success("Order resolved successfully!");
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      toast.error("Failed to resolve order");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#174832] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 rounded-lg bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by email, username, or tracker ID..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
        >
          Search
        </button>
      </form>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
            No requests found
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Request #{request.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Product: {request.product_url}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {request.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    Description: {request.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    Box Required: {request.is_box ? "Yes" : "No"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedRequest(request)}
                  className="px-4 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
                >
                  Resolve Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolve Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-8 mx-4 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Resolve Order</h2>
            <form onSubmit={handleResolve} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    USD Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={resolveForm.usd_price}
                    onChange={(e) =>
                      setResolveForm((prev) => ({
                        ...prev,
                        usd_price: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Converted Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={resolveForm.converted_price}
                    onChange={(e) =>
                      setResolveForm((prev) => ({
                        ...prev,
                        converted_price: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Custom Fee
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={resolveForm.custom_fee}
                    onChange={(e) =>
                      setResolveForm((prev) => ({
                        ...prev,
                        custom_fee: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tax
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={resolveForm.tax}
                    onChange={(e) =>
                      setResolveForm((prev) => ({
                        ...prev,
                        tax: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Box Fee
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={resolveForm.box_fee}
                    onChange={(e) =>
                      setResolveForm((prev) => ({
                        ...prev,
                        box_fee: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={resolveForm.cost}
                    onChange={(e) =>
                      setResolveForm((prev) => ({
                        ...prev,
                        cost: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
                >
                  Resolve Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
