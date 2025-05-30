import React from "react";

export default function ReturnRefundPolicyPage() {
  return (
    <div className="min-h-[100vh] flex flex-col items-center bg-gradient-to-br from-gray-50 to-white py-20 px-4 mt-20">
      <div className="w-full max-w-3xl p-10 border border-gray-100 shadow-xl bg-white/90 rounded-2xl">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-center text-gray-900 md:text-4xl">
          Refund & Return Policy
        </h1>
        <div className="text-gray-800 space-y-7">
          <p className="mb-6 text-sm md:text-base">
            At America to BD, customer satisfaction is our top priority. Please
            review the following guidelines for refunds and returns.
          </p>

          {/* 1. Refund Policy */}
          <div>
            <h2 className="mb-1 text-lg font-bold">1. Refund Policy</h2>
            <p className="mb-2 text-sm md:text-base">
              If you're not satisfied with our service, you may request a refund
              under the following conditions:
            </p>
            <ul className="pl-4 text-sm list-disc list-inside md:text-base">
              <li>
                <span className="font-semibold">Eligibility:</span> Refund
                requests must be submitted within 48 hours of the delivery date.
              </li>
              <li>
                <span className="font-semibold">How to Request:</span> Contact
                our customer support team at{" "}
                <span className="font-mono">support@americatobd.com</span> or{" "}
                <span className="font-mono">+8809647325475</span> or{" "}
                <span className="font-mono">01332837871</span> with your order
                details.
              </li>
              <li>
                <span className="font-semibold">Conditions:</span> Refunds are
                subject to verification. We do not issue refunds for delays
                caused by customs, logistics partners, or other third-party
                issues beyond our control.
              </li>
              <li>
                <span className="font-semibold">Refund Method:</span> Once
                approved, refunds will be processed to the original payment
                method within 21 business days.
              </li>
            </ul>
          </div>

          {/* 2. Return Policy */}
          <div>
            <h2 className="mb-1 text-lg font-bold">2. Return Policy</h2>
            <p className="mb-2 text-sm md:text-base">
              Returns are accepted only for items that are damaged or
              incorrectly delivered by America to BD.
            </p>
            <ul className="pl-4 text-sm list-disc list-inside md:text-base">
              <li>
                <span className="font-semibold">Reporting Timeframe:</span>{" "}
                Notify us within 48 hours of receiving the item.
              </li>
              <li>
                <span className="font-semibold">Item Condition:</span> The item
                must be unused and in its original packaging.
              </li>
              <li>
                <span className="font-semibold">Return Procedure:</span>
                <ul className="pl-6 mt-1 list-disc list-inside">
                  <li>
                    Contact our support team with clear photos and a description
                    of the issue.
                  </li>
                  <li>
                    Once approved, we will provide the designated return
                    address.
                  </li>
                  <li>Ship the item back to us as instructed.</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Shipping Costs:</span> We will
                cover return shipping costs for eligible returns.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
