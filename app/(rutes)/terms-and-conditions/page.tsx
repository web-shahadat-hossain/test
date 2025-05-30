import React from "react";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-[100vh] flex flex-col items-center bg-gradient-to-br from-gray-50 to-white py-20 px-4 mt-20">
      <div className="w-full max-w-3xl p-10 border border-gray-100 shadow-xl bg-white/90 rounded-2xl">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-center text-gray-900 md:text-4xl">
          Terms & Conditions
        </h1>
        <div className="text-gray-800 space-y-7">
          {/* 1. Introduction */}
          <div>
            <h2 className="mb-1 text-lg font-bold">1. Introduction</h2>
            <p className="mb-1 text-sm md:text-base">
              Welcome to America to BD. By accessing or using our services, you
              agree to comply with and be bound by the following terms and
              conditions. Please read them carefully before placing any order.
            </p>
          </div>

          {/* 2. Service Overview */}
          <div>
            <h2 className="mb-1 text-lg font-bold">2. Service Overview</h2>
            <p className="mb-1 text-sm md:text-base">
              America to BD offers international courier services, helping
              customers ship products from the USA to Bangladesh.
            </p>
          </div>

          {/* 3. Orders and Payment */}
          <div>
            <h2 className="mb-1 text-lg font-bold">3. Orders and Payment</h2>
            <p className="mb-1 text-sm md:text-base">
              3.1 All orders must be paid in full before processing begins.
            </p>
            <p className="mb-1 text-sm md:text-base">
              3.2 We accept payments through secure and trusted gateways.
            </p>
            <p className="mb-1 text-sm md:text-base">
              3.3 America to BD is not responsible for pricing errors or
              fluctuations in product availability at U.S. retailers.
            </p>
          </div>

          {/* 4. Shipping and Delivery */}
          <div>
            <h2 className="mb-1 text-lg font-bold">4. Shipping and Delivery</h2>
            <p className="mb-1 text-sm md:text-base">
              4.1 Delivery timelines are estimates and may vary due to customs
              clearance, weather, or other external factors.
            </p>
            <p className="mb-1 text-sm md:text-base">
              4.2 America to BD is not liable for delays caused by customs or
              other third-party logistics partners.
            </p>
          </div>

          {/* 5. Customs and Duties */}
          <div>
            <h2 className="mb-1 text-lg font-bold">5. Customs and Duties</h2>
            <p className="mb-1 text-sm md:text-base">
              5.1 Customers are responsible for any applicable customs duties or
              taxes as per Bangladesh regulations.
            </p>
            <p className="mb-1 text-sm md:text-base">
              5.2 We do not guarantee clearance of restricted/prohibited items.
            </p>
          </div>

          {/* 6. Account Responsibility */}
          <div>
            <h2 className="mb-1 text-lg font-bold">
              6. Account Responsibility
            </h2>
            <p className="mb-1 text-sm md:text-base">
              Customers are responsible for maintaining the confidentiality of
              their accounts and passwords. Any activity under your account will
              be considered authorized by you.
            </p>
          </div>

          {/* 7. Limitation of Liability */}
          <div>
            <h2 className="mb-1 text-lg font-bold">
              7. Limitation of Liability
            </h2>
            <p className="mb-1 text-sm md:text-base">
              America to BD is not liable for indirect, incidental, or
              consequential damages arising from the use of our service,
              including but not limited to delays, loss of goods, or incorrect
              delivery details provided by the customer.
            </p>
          </div>

          {/* 8. Policy Updates */}
          <div>
            <h2 className="mb-1 text-lg font-bold">8. Policy Updates</h2>
            <p className="mb-1 text-sm md:text-base">
              We reserve the right to modify these terms at any time. Continued
              use of our services constitutes acceptance of those changes.
            </p>
          </div>

          {/* 9. Contact Us */}
          <div>
            <h2 className="mb-1 text-lg font-bold">9. Contact Us</h2>
            <p className="mb-1 text-sm md:text-base">
              For any queries regarding these terms, please contact:
            </p>
            <p className="mb-1 text-sm md:text-base">
              📧 Email: support@americatobd.com
            </p>
            <p className="mb-1 text-sm md:text-base">
              📞 Phone: +8809647325475, 01332837871(WA)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
