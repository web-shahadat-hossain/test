"use client";
import { useEffect, useState } from "react";

export function useUserRegion() {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const override =
      typeof window !== "undefined"
        ? localStorage.getItem("regionOverride")
        : null;

    if (override) {
      setCountryCode(override);
      setLoading(false);
      return;
    }

    async function fetchRegion() {
      setLoading(true);
      try {
        const res = await fetch("https://ipinfo.io/json?token=3424d25f7ec60c");
        if (!res.ok) throw new Error("Failed to fetch region");
        const data = await res.json();
        setCountryCode(data.country || null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchRegion();
  }, []);

  return { countryCode, loading, error };
}

export async function getUserRegion(): Promise<string | null> {
  if (typeof window !== "undefined") {
    const override = localStorage.getItem("regionOverride");
    if (override) return override;
    try {
      const res = await fetch("https://ipinfo.io/json?token=3424d25f7ec60c");
      if (!res.ok) return null;
      const data = await res.json();
      return data.country || null;
    } catch {
      return null;
    }
  }
  return null;
}
