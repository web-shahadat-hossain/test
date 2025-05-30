import React from "react";
import { Metadata } from "next";
import Page from ".";
export const metadata: Metadata = {
  title: "Shopping Cart ",
  description: "Review your selected items in the shopping cart ",
};
export default function CartPage() {
  return <Page />;
}
