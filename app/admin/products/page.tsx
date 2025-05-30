"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  addProduct,
  getProducts,
  getCategories,
  editProduct,
  deleteProduct,
  addCategory,
  deleteCategory,
  Product,
  Category,
} from "@/lib/utils/service/product";
export interface IProduct {
  id?: number;
  name: string;
  description: string;
  color: string[];
  size: string[];
  category: string;
  price: string;
  image?: (string | File | undefined)[]; // ✅ TypeScript-friendly combo
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    color: [],
    sizes: [],
    category: "",
    price: "",
    image: "",
  });
  const [category, setCategory] = useState("");
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleAddOrEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("color", JSON.stringify(product.color));
      formData.append("sizes", JSON.stringify(product.sizes || []));
      formData.append("category", product.category ?? "");
      formData.append("price", product.price);
      images.forEach((img) => formData.append("image", img));

      if (editProductId) {
        await editProduct(editProductId, formData);
      } else {
        await addProduct(formData);
      }

      setProduct({
        name: "",
        description: "",
        color: [],
        sizes: [],
        category: "",
        price: "",
      });
      setImages([]);
      setImagePreviews([]);
      setEditProductId(null);
      await fetchAll();
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (prod: Product) => {
    setProduct({
      name: prod.name,
      description: prod.description,
      color: prod.color,
      sizes: prod.sizes,
      category: prod.category,
      price: prod.price,
    });
    setEditProductId(prod.id || null);
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      await fetchAll();
    }
  };

  const handleAddCategory = async () => {
    if (!category) return;
    await addCategory({ name: category });
    setCategory("");
    await fetchAll();
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
      await fetchAll();
    }
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-orange-600">
        {editProductId ? "Edit Product" : "Add New Product"}
      </h2>
      <form
        onSubmit={handleAddOrEditProduct}
        className="grid gap-6 p-6 bg-white shadow-md md:grid-cols-2 rounded-xl"
      >
        <div className="space-y-4">
          <input
            name="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="Product name"
            className="w-full px-4 py-2 border border-orange-300 rounded"
            required
          />
          <textarea
            name="description"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            placeholder="Product description"
            className="w-full px-4 py-2 border border-orange-300 rounded"
            required
          />
          <input
            name="color"
            value={product.color?.join(",") ?? ""}
            onChange={(e) =>
              setProduct({
                ...product,
                color: e.target.value.split(",").map((c) => c.trim()),
              })
            }
            placeholder="Colors (e.g., red, blue)"
            className="w-full px-4 py-2 border border-orange-300 rounded"
          />
          <input
            name="sizes"
            value={product.sizes?.join(", ") || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                sizes: e.target.value
                  ? e.target.value.split(",").map((s) => s.trim())
                  : [],
              })
            }
            placeholder="Sizes (optional, e.g., M, L)"
            className="w-full px-4 py-2 border border-orange-300 rounded"
          />
        </div>
        <div className="space-y-4">
          <select
            name="category"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            className="w-full px-4 py-2 border border-orange-300 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            name="price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            placeholder="Price"
            className="w-full px-4 py-2 border border-orange-300 rounded"
            required
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-orange-300 rounded"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {imagePreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Preview ${idx}`}
                className="object-cover w-20 h-20 border border-orange-300 rounded"
              />
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-6 py-3 text-white bg-orange-600 rounded hover:bg-orange-700"
            disabled={loading}
          >
            {loading
              ? editProductId
                ? "Updating..."
                : "Adding..."
              : editProductId
              ? "Update Product"
              : "Add Product"}
          </motion.button>
        </div>
      </form>

      {/* Product List */}
      <h2 className="mt-12 mb-4 text-2xl font-bold text-orange-600">
        Product List
      </h2>
      <div className="grid gap-4">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="flex items-center justify-between p-4 bg-white border border-orange-200 rounded-lg shadow"
          >
            <div>
              <p className="font-semibold text-orange-700">{prod.name}</p>
              <p className="text-sm text-gray-600">৳ {prod.price}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditProduct(prod)}
                className="px-3 py-1 text-sm text-white bg-orange-500 rounded hover:bg-orange-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(prod.id!)}
                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Management */}
      <h2 className="mt-12 mb-4 text-2xl font-bold text-orange-600">
        Add Category
      </h2>
      <div className="flex items-center gap-4 mb-6">
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category name"
          className="w-full px-4 py-2 border border-orange-300 rounded"
        />
        <button
          onClick={handleAddCategory}
          className="px-6 py-2 text-white bg-orange-600 rounded hover:bg-orange-700"
        >
          Add
        </button>
      </div>

      <h2 className="mb-4 text-2xl font-bold text-orange-600">Category List</h2>
      <div className="grid gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-4 bg-white border border-orange-200 rounded-lg"
          >
            <span className="font-medium text-orange-800">{cat.name}</span>
            <button
              onClick={() => cat.id && handleDeleteCategory(cat.id)}
              className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
