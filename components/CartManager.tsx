"use client";

import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

const CartManager = () => {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <CartDrawer 
      isOpen={isCartOpen} 
      onClose={() => setIsCartOpen(false)} 
    />
  );
};

export default CartManager;
