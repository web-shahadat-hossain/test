"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/auth/signin") ||
    pathname?.startsWith("/auth/signup") ||
    pathname?.startsWith("/admin");

  return (
    <>
      {!isDashboard && <Header />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}
