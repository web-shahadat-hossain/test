import React from "react";

export default function ContactPage() {
  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white py-20 mt-20 px-4">
      <div className="w-full max-w-xl p-10 border border-gray-100 shadow-xl bg-white/90 rounded-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-gray-900">
            Get in touch
          </h1>
          <p className="text-lg text-gray-600">
            Get In Touch with AmericaToBD using these methods.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-start p-4 space-x-4 transition rounded-lg hover:bg-gray-50">
            <span className="mt-1 text-2xl">🏢</span>
            <div>
              <div className="font-semibold text-gray-800">Address</div>
              <div className="text-sm text-gray-600">
                House No: 227 (Level: 2), Flat No: 2AN, Lane No: 15, Lake Road,
                <br />
                Mohakhali DOHS, Dhaka - 1212
              </div>
            </div>
          </div>
          <div className="flex items-center p-4 space-x-4 transition rounded-lg hover:bg-gray-50">
            <span className="text-2xl">📞</span>
            <div>
              <div className="font-semibold text-gray-800">Phone (BD)</div>
              <a
                href="tel:+8809647325475"
                className="text-sm text-blue-600 hover:underline"
              >
                +8809647325475
              </a>
            </div>
          </div>
          <div className="flex items-center p-4 space-x-4 transition rounded-lg hover:bg-gray-50">
            <span className="text-2xl">💬</span>
            <div>
              <div className="font-semibold text-gray-800">WhatsApp (USA)</div>
              <a
                href="https://wa.me/15164606525"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:underline"
              >
                +1 (516) 460-6525
              </a>
            </div>
          </div>
          <div className="flex items-center p-4 space-x-4 transition rounded-lg hover:bg-gray-50">
            <span className="text-2xl">✉️</span>
            <div>
              <div className="font-semibold text-gray-800">Email</div>
              <a
                href="mailto:support@americatobd.com"
                className="text-sm text-purple-600 hover:underline"
              >
                support@americatobd.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
