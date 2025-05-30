"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function BkashPaymentPage() {
  const router = useRouter();
  const { tracker } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    const startBkashPayment = async () => {
      try {
        // Call your backend to start the payment
        const res = await fetch(`/bkash/start-payment/${tracker}`);
        if (!res.ok) throw new Error("Failed to start bKash payment");
        const data = await res.json();
        // If backend returns a redirect URL, redirect user
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
        } else if (data.payment_url) {
          setPaymentUrl(data.payment_url);
        } else {
          throw new Error("No payment URL received from server");
        }
        // Start polling for payment status after payment initiation
        setPolling(true);
      } catch (err: any) {
        setError(err.message || "Error starting bKash payment");
        toast.error(err.message || "Error starting bKash payment");
      } finally {
        setLoading(false);
      }
    };
    if (tracker) startBkashPayment();
  }, [tracker]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const pollStatus = async () => {
      if (!polling || !tracker) return;
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/payment/bkash/status/${tracker}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data.status === "success") {
            clearInterval(interval);
            router.replace("/bkash/success");
          } else if (data.status === "failed") {
            clearInterval(interval);
            router.replace("/bkash/failure");
          }
        } catch {
          // Ignore polling errors
        }
      }, 3000); // Poll every 3 seconds
    };
    pollStatus();
    return () => clearInterval(interval);
  }, [polling, tracker, router]);

  if (loading) return <div>Starting bKash payment...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="mb-4 text-xl font-bold">bKash Payment</h2>
      {paymentUrl ? (
        <a
          href={paymentUrl}
          className="px-4 py-2 text-white bg-pink-600 rounded"
        >
          Proceed to bKash
        </a>
      ) : (
        <div>Waiting for payment instructions...</div>
      )}
      {polling && (
        <div className="mt-6 text-sm text-gray-600">
          Waiting for payment confirmation...
        </div>
      )}
    </div>
  );
}
