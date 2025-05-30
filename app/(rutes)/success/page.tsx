"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackerId = searchParams.get("track");

  return (
    <div className="flex items-center justify-center h-screen bg-[#FFF5ED]">
      <div className="p-1 rounded shadow-lg bg-gradient-to-r from-[#FF6C19] via-orange-400 to-yellow-300">
        <div className="flex flex-col items-center p-6 space-y-4 bg-white rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#FF6C19] w-24 h-24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6C19] to-orange-600">
            অর্ডার সফল হয়েছে!
          </h1>

          <p className="text-sm text-gray-700">
            আপনার Tracking ID:{" "}
            <span className="font-semibold text-[#FF6C19]">{trackerId}</span>
          </p>

          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-5 py-2 text-white bg-[#FF6C19] border border-[#FF6C19] rounded-full hover:bg-orange-600 focus:outline-none focus:ring"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            <span className="text-sm font-medium">হোম পেজে যান</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Success = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
};

export default Success;
