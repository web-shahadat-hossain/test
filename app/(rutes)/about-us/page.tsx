export default function AboutPage() {
  return (
    <div className="min-h-[100vh] flex flex-col items-center bg-gradient-to-br from-gray-50 to-white py-20 px-4 mt-20">
      <div className="w-full max-w-2xl p-10 border border-gray-100 shadow-xl bg-white/90 rounded-2xl">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-center text-gray-900">
          About Us
        </h1>
        <p className="mb-4 text-base text-gray-700">
          Welcome to{" "}
          <span className="font-semibold text-blue-700">America to BD</span>,
          your trusted partner for bringing your desired products from the USA
          to Bangladesh. We make it easy for you to order items from any
          US-based website and deliver them straight to your doorstep in
          Bangladesh.
        </p>
        <p className="mb-4 text-base text-gray-700">
          Our goal is to simplify cross-border shopping by providing a seamless,
          reliable, and efficient service. Whether it’s the latest gadgets,
          trendy fashion, or unique items unavailable locally, we ensure your
          favorite products reach you without hassle.
        </p>
        <p className="mb-6 text-base text-gray-700">
          At <span className="font-semibold text-blue-700">America to BD</span>,
          we value your time and trust. That’s why we focus on transparent
          pricing, secure transactions, and timely delivery. Thank you for
          choosing us to bring your favorite products closer to you!
        </p>
        <div className="p-5 mb-8 border border-gray-200 rounded-lg bg-gray-50">
          <div className="mb-2 text-sm text-gray-800">
            <span className="font-semibold">TIN Certificate No:</span>{" "}
            261630781571
          </div>
          <div className="mb-2 text-sm text-gray-800">
            <span className="font-semibold">Trade License No:</span>{" "}
            TRAD/DNCC/024399/2024
          </div>
          <div className="mb-1 text-sm font-semibold text-gray-900">
            Our Delivery Time{" "}
            <span className="text-xs font-normal text-gray-500">
              (After Shipment)
            </span>
          </div>
          <ul className="pl-2 text-sm text-gray-700 list-disc list-inside">
            <li>
              Inside Dhaka: <span className="font-medium">24 to 48 hours</span>
            </li>
            <li>
              Outside Dhaka: <span className="font-medium">72 to 96 hours</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2 p-5 bg-gray-100 border border-gray-200 rounded-lg">
          <div className="mb-1 font-bold text-gray-800">Contact Us</div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Address:</span> House No: 227
            (Level: 2), Lake Road, Mohakhali DOHS, Dhaka - 1212
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Phone:</span>{" "}
            <a
              href="tel:+8809647325475"
              className="text-blue-600 hover:underline"
            >
              +8809647325475
            </a>
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Email:</span>{" "}
            <a
              href="mailto:support@americatobd.com"
              className="text-purple-600 hover:underline"
            >
              support@americatobd.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
