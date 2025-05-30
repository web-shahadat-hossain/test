"use client";

import { useState } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { toast } from "react-hot-toast";

// ... rest of your imports ...

export default function TrackingPage() {
  // ... your existing state and functions ...

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* ... rest of your JSX ... */}
      </div>
    </ErrorBoundary>
  );
}
