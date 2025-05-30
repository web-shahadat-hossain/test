"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { getProducts } from "@/lib/utils/service/product";
import { useUserRegion } from "@/lib/utils/useUserRegion";
import { toast } from "react-hot-toast";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();

  const image = product.images?.[0] || product.image || "/placeholder.jpg";
  const colors = product.color || [];

  return (
    <motion.div
      variants={itemVariants}
      className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
        product.isHighlighted ? "ring-1 ring-pink-200 bg-pink-50/30" : ""
      }`}
      onClick={() => router.push(`/products/${product.id}`)}
    >
      <div className="flex flex-col gap-4">
        <div className="text-sm text-gray-500">{product.name}</div>
        <h3 className="text-base font-medium text-gray-900">
          {product.title || product.name}
        </h3>
        <div className="flex items-center justify-center bg-white aspect-square">
          <img
            src={image[0]}
            alt={product.title || product.name}
            className="object-contain w-4/5 h-4/5"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">${product.price}</span>
          <div className="flex -space-x-1">
            {colors.map((color: string, index: number) => (
              <div
                key={index}
                className="w-4 h-4 border-2 border-white rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FilterButton = ({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      active
        ? "bg-gray-900 text-white"
        : "bg-white text-gray-700 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");
  const { countryCode, loading } = useUserRegion();
  const router = useRouter();

  useEffect(() => {
    if (!loading && countryCode === "US") {
      toast.error(
        "Products are not available in your region (United States).",
        { id: "products-region-block" }
      );
      router.replace("/");
    }
  }, [countryCode, loading, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProducts();
        setProducts(result);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(
        products
          .map((p) => p.category)
          .filter((cat): cat is string => cat !== undefined)
      )
    );
    return ["All", ...cats];
  }, [products]);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "newest":
        filtered.reverse(); // simplistic logic
        break;
      default:
        break;
    }

    return filtered;
  }, [products, selectedCategory, sortBy]);

  if (loading) return null;
  if (countryCode === "US") return null;

  return (
    <div className="min-h-screen py-60 bg-gray-50/50">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">All Products</h1>
          <p className="text-gray-600">
            Find your perfect style from our collection
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col gap-6 mb-8 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex gap-3 pb-2 overflow-x-auto sm:pb-0">
            {categories.map((category) => (
              <FilterButton
                key={category}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category as string)}
              >
                {category}
              </FilterButton>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
