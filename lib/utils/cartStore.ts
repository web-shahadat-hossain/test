import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { Product } from "@/types/product";

// ✅ Types
export interface CartItem {
  product: Product;
  color?: string;
  size?: string;
  quantity: number;
  price: number;
}

export interface CartState {
  cart: CartItem[];
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  increaseQuantity: (item: CartItem) => void;
  decreaseQuantity: (item: CartItem) => void;
  clearCart: () => void;
}
export const useCartStore = create<CartState>()(
  persist<CartState>(
    (set, get) => {
      const calculateTotal = (cart: CartItem[]) =>
        cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

      return {
        cart: [],
        total: 0,

        addToCart: (item) => {
          const existingItem = get().cart.find(
            (i) =>
              i.product.id === item.product.id &&
              i.color === item.color &&
              i.size === item.size
          );

          let newCart;

          if (existingItem) {
            newCart = get().cart.map((i) =>
              i.product.id === item.product.id &&
              i.color === item.color &&
              i.size === item.size
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
            toast.success("Product quantity updated in cart.");
          } else {
            newCart = [...get().cart, item];
            toast.success("Product added to cart.");
          }

          set({
            cart: newCart,
            total: calculateTotal(newCart),
          });
        },

        removeFromCart: (item) => {
          const newCart = get().cart.filter(
            (i) =>
              !(
                i.product.id === item.product.id &&
                i.color === item.color &&
                i.size === item.size
              )
          );

          set({
            cart: newCart,
            total: calculateTotal(newCart),
          });

          toast.success("Product removed from cart.");
        },

        increaseQuantity: (item) => {
          const newCart = get().cart.map((i) =>
            i.product.id === item.product.id &&
            i.color === item.color &&
            i.size === item.size
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );

          set({
            cart: newCart,
            total: calculateTotal(newCart),
          });
        },

        decreaseQuantity: (item) => {
          const existingItem = get().cart.find(
            (i) =>
              i.product.id === item.product.id &&
              i.color === item.color &&
              i.size === item.size
          );

          if (!existingItem) return;

          let newCart;

          if (existingItem.quantity > 1) {
            newCart = get().cart.map((i) =>
              i.product.id === item.product.id &&
              i.color === item.color &&
              i.size === item.size
                ? { ...i, quantity: i.quantity - 1 }
                : i
            );
          } else {
            newCart = get().cart.filter(
              (i) =>
                !(
                  i.product.id === item.product.id &&
                  i.color === item.color &&
                  i.size === item.size
                )
            );
          }

          set({
            cart: newCart,
            total: calculateTotal(newCart),
          });
        },

        clearCart: () => {
          set({ cart: [], total: 0 });
          toast.success("Cart cleared.");
        },
      };
    },
    {
      name: "cart-storage",
    }
  )
);
