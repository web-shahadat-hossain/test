export default function BkashFailurePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="mb-4 text-2xl font-bold text-red-700">Payment Failed</h2>
      <p className="mb-6">
        Sorry, your payment could not be processed. Please try again or use
        another method.
      </p>
      <a
        href="/dashboard/checkout?step=payment"
        className="px-4 py-2 text-white bg-red-600 rounded"
      >
        Back to Payment
      </a>
    </div>
  );
}
