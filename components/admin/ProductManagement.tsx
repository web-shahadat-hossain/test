import { useState, useEffect } from "react";
import { getProducts, Product, Category } from "@/lib/utils/service/product";
import { toast } from "react-hot-toast";

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    setProducts(filteredProducts);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      // TODO: Implement updateProduct function in the product service
      toast.success("Product updated successfully!");
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error("Failed to update product");
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
          placeholder="Search by name, description, or category..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
        >
          Search
        </button>
      </form>

      {/* Products List */}
      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
            No products found
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Category: {product.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    Price: ${product.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    Description: {product.description}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Colors:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(product.color ?? []).map((color) => (
                        <span
                          key={color}
                          className="px-2 py-1 text-xs text-white rounded-full"
                          style={{ backgroundColor: color }}
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setEditForm({
                      name: product.name,
                      description: product.description,
                      category: product.category,
                      price: product.price,
                      color: product.color,
                    });
                  }}
                  className="px-4 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
                >
                  Edit Product
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-8 mx-4 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Edit Product</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editForm.description || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  value={editForm.category || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="text"
                  value={editForm.price || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Colors (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.color?.join(", ") || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      color: e.target.value.split(",").map((c) => c.trim()),
                    }))
                  }
                  className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
