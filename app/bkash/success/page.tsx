export default function BkashSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="mb-4 text-2xl font-bold text-green-700">
        Payment Successful!
      </h2>
      <p className="mb-6">
        Thank you for your payment. Your order has been placed successfully.
      </p>
      <a
        href="/dashboard/manual-requests"
        className="px-4 py-2 text-white bg-green-600 rounded"
      >
        Go to Orders
      </a>
    </div>
  );
}
