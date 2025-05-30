"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CostSummary {
  itemPrice: number;
  convertedPrice: number;
  bdCustomsFee: number;
  usSalesTax: number;
  platformFee: number;
  deliveryCharge: number;
  totalCost: number;
}

interface FormErrors {
  category?: string;
  productPrice?: string;
  deliveryLocation?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
}

interface AreaData {
  name: string;
  postalCode: string;
  keywords?: string[];
}

// Bangladesh Districts Data
const bangladeshDistricts = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barisal",
  "Bhola",
  "Bogra",
  "Brahmanbaria",
  "Chandpur",
  "Chapainawabganj",
  "Chittagong",
  "Chuadanga",
  "Comilla",
  "Cox's Bazar",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jessore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];

// Updated Areas by District with postal codes and alternative names
const areasByDistrict: { [key: string]: AreaData[] } = {
  Pabna: [
    { name: "Ishwardi", postalCode: "6620", keywords: ["ishurdi", "eshwardi"] },
    { name: "Bera", postalCode: "6680", keywords: ["bera sadar"] },
    { name: "Santhia", postalCode: "6670", keywords: ["santhia sadar"] },
    { name: "Faridpur", postalCode: "6650", keywords: ["faridpur pabna"] },
    { name: "Sujanagar", postalCode: "6660", keywords: ["sujan nagar"] },
    { name: "Chatmohar", postalCode: "6630", keywords: ["chat mohar"] },
    { name: "Atghoria", postalCode: "6610", keywords: ["atgharia"] },
    {
      name: "Pabna Sadar",
      postalCode: "6600",
      keywords: ["sadar", "town", "city"],
    },
    { name: "Bhangura", postalCode: "6640", keywords: ["bhangura sadar"] },
  ],
  Dhaka: [
    {
      name: "Mirpur",
      postalCode: "1216",
      keywords: ["mirpur 10", "mirpur 11", "mirpur 12"],
    },
    {
      name: "Uttara",
      postalCode: "1230",
      keywords: ["sector 1", "sector 2", "sector 3"],
    },
    {
      name: "Gulshan",
      postalCode: "1212",
      keywords: ["gulshan 1", "gulshan 2"],
    },
    {
      name: "Dhanmondi",
      postalCode: "1209",
      keywords: ["dhanmondi r/a", "jigatola"],
    },
    {
      name: "Mohammadpur",
      postalCode: "1207",
      keywords: ["mohammadpur housing"],
    },
    { name: "Motijheel", postalCode: "1000", keywords: ["commercial area"] },
  ],
  Chittagong: [
    { name: "Agrabad", postalCode: "4100" },
    { name: "Halishahar", postalCode: "4216" },
    { name: "Nasirabad", postalCode: "4203" },
    { name: "Patenga", postalCode: "4204" },
    { name: "Kotowali", postalCode: "4000" },
    { name: "GEC Circle", postalCode: "4202" },
    { name: "Chawkbazar", postalCode: "4203" },
    { name: "Khulshi", postalCode: "4225" },
    { name: "Pahartali", postalCode: "4202" },
  ],
  Sylhet: [
    { name: "Zindabazar", postalCode: "3100" },
    { name: "Ambarkhana", postalCode: "3100" },
    { name: "Upashahar", postalCode: "3103" },
    { name: "Shahjalal", postalCode: "3100" },
    { name: "Shibganj", postalCode: "3100" },
    { name: "Tilagor", postalCode: "3102" },
    { name: "Dakshin Surma", postalCode: "3112" },
  ],
  Khulna: [
    { name: "Sonadanga", postalCode: "9100" },
    { name: "Khalishpur", postalCode: "9100" },
    { name: "Daulatpur", postalCode: "9202" },
    { name: "Boyra", postalCode: "9000" },
  ],
  Rajshahi: [
    { name: "Shaheb Bazar", postalCode: "6100" },
    { name: "Upashahar", postalCode: "6202" },
    { name: "Kazla", postalCode: "6204" },
    { name: "Vodra", postalCode: "6100" },
  ],
  Barisal: [
    { name: "Sadar Road", postalCode: "8200" },
    { name: "Nattullabad", postalCode: "8200" },
    { name: "Rupatoli", postalCode: "8200" },
  ],
};

const ShippingCalculator = () => {
  // Form States
  const [category, setCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shippingWeight, setShippingWeight] = useState("");
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
  });

  // UI States
  const [costSummary, setCostSummary] = useState<CostSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [districtSearch, setDistrictSearch] = useState("");
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [areaSearch, setAreaSearch] = useState("");
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [availableAreas, setAvailableAreas] = useState<AreaData[]>([]);

  // Handle numeric input validation
  const handleNumericInput = (
    value: string,
    setter: (value: string) => void
  ) => {
    // Allow empty string or numbers with up to 2 decimal places
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setter(value);
    }
  };

  // Enhanced district search with fuzzy matching
  const getFilteredDistricts = (search: string) => {
    const searchLower = search.toLowerCase();
    return bangladeshDistricts.filter((district) => {
      const districtLower = district.toLowerCase();
      return (
        districtLower.includes(searchLower) ||
        searchLower.split(" ").some((word) => districtLower.includes(word))
      );
    });
  };

  // Enhanced area search with keywords
  const searchAreas = (searchTerm: string, areas: AreaData[]) => {
    const lowercaseSearch = searchTerm.toLowerCase();
    return areas.filter((area) => {
      const nameMatch = area.name.toLowerCase().includes(lowercaseSearch);
      const keywordMatch = area.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(lowercaseSearch)
      );
      return nameMatch || keywordMatch;
    });
  };

  // Real-time price calculation preview
  const calculatePreviewPrice = () => {
    if (!productPrice || isNaN(Number(productPrice))) return null;
    const price = Number(productPrice);
    const convertedPrice = price * 122; // Using the fixed rate of 122 BDT
    const salesTax = price * 0.0887;
    return {
      usd: price,
      bdt: convertedPrice,
      tax: salesTax,
    };
  };

  // Update filtered districts using enhanced search
  const filteredDistricts = getFilteredDistricts(districtSearch);

  // Update available areas when district changes
  useEffect(() => {
    if (district && areasByDistrict[district]) {
      setAvailableAreas(areasByDistrict[district]);
      setArea("");
      setAreaSearch("");
      setPostalCode("");
    } else {
      setAvailableAreas([]);
    }
  }, [district]);

  // Handle area selection and postal code auto-fill
  const handleAreaSelection = (selectedArea: AreaData) => {
    setArea(selectedArea.name);
    setAreaSearch(selectedArea.name);
    setPostalCode(selectedArea.postalCode);
    setShowAreaDropdown(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!category) {
      newErrors.category = "Category is required";
    }

    if (!productPrice) {
      newErrors.productPrice = "Product price is required";
    } else if (isNaN(Number(productPrice)) || Number(productPrice) <= 0) {
      newErrors.productPrice = "Please enter a valid price";
    }

    if (!deliveryLocation) {
      newErrors.deliveryLocation = "Delivery location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("/api/calculate-shipping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          productPrice: parseFloat(productPrice),
          deliveryLocation,
          district,
          area,
          postalCode,
          weight: shippingWeight ? parseFloat(shippingWeight) : 0,
          dimensions,
        }),
      });

      if (!response.ok) {
        throw new Error("Calculation failed");
      }

      const data = await response.json();
      setCostSummary(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error calculating shipping:", error);
    }
  };

  return (
    <motion.section
      className="w-full max-w-[800px] mx-auto p-4 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* section header */}
      <motion.div
        variants={itemVariants}
        className="flex-col mb-16 sm:mb-20 lg:mb-24 xl:mb-28 center gap-y-4 sm:gap-y-6 lg:gap-y-8"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-[120px] h-[40px] sm:w-[136px] sm:h-[44px] lg:w-[160px] lg:h-[52px] bg-white center rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <p className="text-base font-medium text-gray-700 sm:text-lg lg:text-xl">
            Calculator
          </p>
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="max-w-[90%] sm:max-w-[636px] w-full text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center title_md radial_text_gradient"
        >
          See Costs Upfront Before You Order from the USA.{" "}
        </motion.h1>
      </motion.div>

      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white shadow-lg rounded-2xl sm:rounded-3xl sm:p-6 md:p-8"
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Category Selection */}
          <div className="form-group">
            <label className="block mb-1.5 sm:mb-2 text-sm font-medium text-red-500">
              Select Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full p-2.5 sm:p-3 transition-all duration-200 bg-white border ${
                errors.category ? "border-red-500" : "border-gray-200"
              } outline-none cursor-pointer rounded-xl hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
            >
              <option value="">Select a category</option>
              <option value="No Declaration Required">
                No Declaration Required
              </option>
              <option value="Phone">Phone</option>
              <option value="Laptop">Laptop</option>
              <option value="Ipad and Tab">Ipad and Tab</option>
              <option value="Graphics Card">Graphics Card</option>
              <option value="Smart Watch">Smart Watch</option>
              <option value="Motherboard and Processor">
                Motherboard and Processor
              </option>
              <option value="Watch">Watch</option>
              <option value="OTC Medicine">OTC Medicine</option>
              <option value="Perfume">Perfume</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Product Price with Real-time Preview */}
          <div className="form-group">
            <label className="block mb-1.5 sm:mb-2 text-sm font-medium text-red-500">
              Product Price
            </label>
            <div className="relative">
              <input
                type="text"
                value={productPrice}
                onChange={(e) =>
                  handleNumericInput(e.target.value, setProductPrice)
                }
                className={`w-full p-2.5 sm:p-3 pr-12 transition-all duration-200 bg-white border ${
                  errors.productPrice ? "border-red-500" : "border-gray-200"
                } outline-none rounded-xl hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                placeholder="Enter price in USD"
              />
              <span className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2">
                USD
              </span>
            </div>
            {calculatePreviewPrice() && (
              <div className="mt-2 text-xs sm:text-sm text-gray-600 space-y-0.5">
                <p className="flex justify-between">
                  <span>Converted Price:</span>
                  <span className="font-medium">
                    {(calculatePreviewPrice()?.bdt || 0).toFixed(2)} BDT
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Sales Tax (8.87%):</span>
                  <span className="font-medium">
                    +{(calculatePreviewPrice()?.tax || 0).toFixed(2)} USD
                  </span>
                </p>
              </div>
            )}
            {errors.productPrice && (
              <p className="mt-1 text-xs text-red-500">{errors.productPrice}</p>
            )}
          </div>

          {/* Delivery Location */}
          <div className="form-group">
            <label className="block mb-1.5 sm:mb-2 text-sm font-medium text-red-500">
              Select Delivery Location
            </label>
            <select
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className={`w-full p-2.5 sm:p-3 transition-all duration-200 bg-white border ${
                errors.deliveryLocation ? "border-red-500" : "border-gray-200"
              } outline-none cursor-pointer rounded-xl hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
            >
              <option value="">Select delivery location</option>
              <option value="Office Pickup - 0 BDT">
                Office Pickup - 0 BDT
              </option>
              <option value="Inside Dhaka - 100 BDT">
                Inside Dhaka - 100 BDT
              </option>
              <option value="Outside Dhaka - 150 BDT">
                Outside Dhaka - 150 BDT
              </option>
            </select>
            {errors.deliveryLocation && (
              <p className="mt-1 text-xs text-red-500">
                {errors.deliveryLocation}
              </p>
            )}
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
            {/* District Selection */}
            <div className="relative">
              <label className="block mb-1.5 sm:mb-2 text-sm font-medium text-gray-700">
                District /City
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={districtSearch}
                  onChange={(e) => {
                    setDistrictSearch(e.target.value);
                    setShowDistrictDropdown(true);
                  }}
                  onFocus={() => setShowDistrictDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowDistrictDropdown(false), 200)
                  }
                  placeholder="Search district..."
                  className={`w-full p-2.5 sm:p-3 transition-all duration-200 bg-white border border-gray-200 outline-none rounded-xl hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                />
                {showDistrictDropdown && filteredDistricts.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-xl max-h-48 sm:max-h-60">
                    {filteredDistricts.map((dist) => (
                      <div
                        key={dist}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setDistrict(dist);
                          setDistrictSearch(dist);
                          setShowDistrictDropdown(false);
                        }}
                      >
                        {dist}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Area Selection */}
            <div className="relative">
              <label className="block mb-1.5 sm:mb-2 text-sm font-medium text-gray-700">
                Area / Zone
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={areaSearch}
                  onChange={(e) => {
                    setAreaSearch(e.target.value);
                    setShowAreaDropdown(true);
                    if (e.target.value !== area) {
                      setPostalCode("");
                    }
                  }}
                  onFocus={() => setShowAreaDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowAreaDropdown(false), 200)
                  }
                  placeholder={
                    district
                      ? "Type to search area..."
                      : "Select district first"
                  }
                  disabled={!district}
                  className={`w-full p-2.5 sm:p-3 transition-all duration-200 bg-white border border-gray-200 outline-none rounded-xl hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 ${
                    !district ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                {showAreaDropdown &&
                  searchAreas(areaSearch, availableAreas).length > 0 && (
                    <div className="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-xl max-h-48 sm:max-h-60">
                      {searchAreas(areaSearch, availableAreas).map(
                        (areaOption) => (
                          <div
                            key={areaOption.name}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleAreaSelection(areaOption)}
                          >
                            <div className="text-sm font-medium">
                              {areaOption.name}
                            </div>
                            {areaOption.keywords && (
                              <div className="text-xs text-gray-500">
                                Also known as: {areaOption.keywords.join(", ")}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            </div>

            {/* Postal Code Display */}
            <div>
              <label className="block mb-1.5 sm:mb-2 text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                value={postalCode}
                readOnly
                placeholder={
                  district
                    ? "Will auto-fill based on area"
                    : "Select district and area first"
                }
                className={`w-full p-2.5 sm:p-3 transition-all duration-200 bg-gray-50 border border-gray-200 outline-none rounded-xl ${
                  !area ? "opacity-50" : ""
                }`}
              />
            </div>
          </div>

          {/* Weight and Dimensions */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Weight with Real-time Preview */}
            <div>
              <label className="block mb-1.5 sm:mb-2 text-sm font-medium text-gray-700">
                Shipping Weight
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={shippingWeight}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, setShippingWeight)
                  }
                  className="w-full p-2.5 sm:p-3 pr-12 transition-all duration-200 bg-white border border-gray-200 outline-none rounded-xl hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="Enter weight in kg"
                />
                <span className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2">
                  kg
                </span>
              </div>
              {shippingWeight && !isNaN(Number(shippingWeight)) && (
                <p className="mt-2 text-xs text-gray-600 sm:text-sm">
                  ≈ {(Number(shippingWeight) * 3000).toFixed(2)} BDT shipping
                  cost
                </p>
              )}
            </div>

            {/* Dimensions */}
            <div>
              <label className="block mb-1.5 sm:mb-2 text-sm font-medium text-gray-700">
                Dimension
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {["length", "width", "height"].map((dim) => (
                  <div key={dim} className="relative">
                    <input
                      type="text"
                      value={dimensions[dim as keyof typeof dimensions]}
                      onChange={(e) =>
                        handleNumericInput(e.target.value, (value) =>
                          setDimensions({ ...dimensions, [dim]: value })
                        )
                      }
                      className="w-full p-2.5 sm:p-3 text-center transition-all duration-200 bg-white border border-gray-200 outline-none rounded-xl hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      placeholder={dim.charAt(0).toUpperCase()}
                    />
                    <span className="absolute text-xs text-gray-500 transform -translate-x-1/2 -bottom-5 left-1/2">
                      {dim.charAt(0).toUpperCase() + dim.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-8 text-base font-medium text-white transition-all duration-300 bg-red-500 sm:py-4 sm:text-lg rounded-xl hover:bg-red-600 focus:ring-4 focus:ring-red-200"
          >
            Calculate Shipping Cost
          </button>

          {/* Information Text */}
          <div className="mt-4 space-y-1 text-xs text-red-500 sm:text-sm">
            <p>1. Dollar Rate: 122 BDT</p>
            <p>2. US Sales Tax: 8.87% of product price</p>
            <p className="text-xs sm:text-sm">
              3. Additional shipping, cleaning, and packaging costs will be
              added to your product's current price based on its weight upon
              arrival in Bangladesh at a rate of 3 BDT per gram (3000 BDT per
              KG).
            </p>
          </div>
        </div>
      </form>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && costSummary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              className="w-full max-w-[400px] bg-white rounded-2xl sm:rounded-3xl shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  Cost Summary
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-gray-400 transition-colors hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4 space-y-3 sm:p-6 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-600">Item Price</span>
                  <span className="font-medium">
                    {costSummary.itemPrice} USD
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600">Converted Price</span>
                  <span className="font-medium">
                    {costSummary.convertedPrice} BDT
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600">BD Customs Fee / CNF</span>
                  <span className="font-medium">
                    {costSummary.bdCustomsFee} BDT
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600">US Sales Tax (8.87%)</span>
                  <span className="font-medium">
                    {costSummary.usSalesTax} BDT
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600">Platform Fee</span>
                  <span className="font-medium">
                    {costSummary.platformFee} BDT
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600">Delivery Charge</span>
                  <span className="font-medium">
                    {costSummary.deliveryCharge} BDT
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900 sm:text-lg">
                    Total Cost
                  </span>
                  <span className="text-base font-semibold text-red-500 sm:text-lg">
                    {costSummary.totalCost} BDT
                  </span>
                </div>
              </div>

              <div className="p-4 pt-0 sm:p-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 font-medium text-white transition-colors bg-red-500 sm:py-4 rounded-xl hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default ShippingCalculator;
