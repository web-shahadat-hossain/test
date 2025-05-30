import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-[100vh] flex flex-col items-center bg-gradient-to-br from-gray-50 to-white py-20 px-4 mt-20">
      <div className="w-full max-w-3xl p-10 border border-gray-100 shadow-xl bg-white/90 rounded-2xl">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-center text-gray-900 md:text-4xl">
          Privacy Policy
        </h1>
        <div className="text-gray-800 space-y-7">
          {/* 1. Introduction */}
          <div>
            <h2 className="mb-1 text-lg font-bold">1. Introduction</h2>
            <p className="mb-1 text-sm md:text-base">
              At America to BD, your privacy is important to us. This policy
              explains how we collect, use, and protect your personal
              information when you interact with our services.
            </p>
          </div>

          {/* 2. Information We Collect */}
          <div>
            <h2 className="mb-1 text-lg font-bold">
              2. Information We Collect
            </h2>
            <ul className="pl-4 text-sm list-disc list-inside md:text-base">
              <li>
                <span className="font-semibold">Personal Data:</span> Name,
                email address, phone number, and shipping address.
              </li>
              <li>
                <span className="font-semibold">Payment Information:</span>{" "}
                Collected securely via trusted and encrypted payment gateways.
              </li>
              <li>
                <span className="font-semibold">Usage Data:</span> Includes data
                about your interactions with our website and services, such as
                browsing behavior and order activity.
              </li>
            </ul>
          </div>

          {/* 3. How We Use Your Information */}
          <div>
            <h2 className="mb-1 text-lg font-bold">
              3. How We Use Your Information
            </h2>
            <p className="mb-2 text-sm md:text-base">
              We use your information to:
            </p>
            <ul className="pl-4 text-sm list-disc list-inside md:text-base">
              <li>Process orders and ensure timely delivery.</li>
              <li>
                Communicate updates regarding your orders, promotions, or
                service notices.
              </li>
              <li>
                Enhance and optimize your experience through website
                improvements based on user feedback.
              </li>
            </ul>
          </div>

          {/* 4. Sharing Your Information */}
          <div>
            <h2 className="mb-1 text-lg font-bold">
              4. Sharing Your Information
            </h2>
            <p className="mb-2 text-sm md:text-base">
              We do not sell or rent your personal data to third parties. Your
              information is only shared when necessary to:
            </p>
            <ul className="pl-4 text-sm list-disc list-inside md:text-base">
              <li>Complete your shipping and delivery process.</li>
              <li>Comply with applicable legal or regulatory obligations.</li>
            </ul>
          </div>

          {/* 5. Data Security */}
          <div>
            <h2 className="mb-1 text-lg font-bold">5. Data Security</h2>
            <p className="mb-1 text-sm md:text-base">
              We employ robust security practices and technologies to protect
              your data. However, while we strive to safeguard your information,
              no system can guarantee absolute security. We advise customers to
              remain cautious and protect their credentials.
            </p>
          </div>

          {/* 6. Your Rights */}
          <div>
            <h2 className="mb-1 text-lg font-bold">6. Your Rights</h2>
            <p className="mb-2 text-sm md:text-base">You have the right to:</p>
            <ul className="pl-4 text-sm list-disc list-inside md:text-base">
              <li>
                <span className="font-semibold">Access:</span> Request a copy of
                the personal data we hold about you.
              </li>
              <li>
                <span className="font-semibold">Correction:</span> Update any
                inaccurate or incomplete information.
              </li>
              <li>
                <span className="font-semibold">Deletion:</span> Request
                deletion of your data, subject to applicable legal or
                operational requirements.
              </li>
            </ul>
          </div>

          {/* 7. Contact Us */}
          <div>
            <h2 className="mb-1 text-lg font-bold">7. Contact Us</h2>
            <p className="mb-1 text-sm md:text-base">
              For any questions or concerns regarding this Privacy Policy,
              please contact us:
            </p>
            <div className="pl-2 text-sm md:text-base">
              Email:{" "}
              <a
                href="mailto:support@americatobd.com"
                className="text-blue-600 hover:underline"
              >
                support@americatobd.com
              </a>
              <br />
              Phone:{" "}
              <a
                href="tel:+8809647325475"
                className="text-blue-600 hover:underline"
              >
                +8809647325475
              </a>
              ,{" "}
              <a
                href="tel:01332837871"
                className="text-blue-600 hover:underline"
              >
                01332837871(WA)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
