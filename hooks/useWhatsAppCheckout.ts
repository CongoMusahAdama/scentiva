"use client";

import { useCallback } from "react";
import {
  buildWhatsAppOrderMessage,
  isDeliveryDetailsValid,
  openWhatsAppOrder,
  type DeliveryDetails,
  type OrderLine,
} from "@/lib/delivery";
import { showError } from "@/lib/swal";

export function useWhatsAppCheckout() {
  return useCallback((lines: OrderLine[], total: number, delivery: DeliveryDetails) => {
    if (!isDeliveryDetailsValid(delivery)) {
      showError("Delivery Details Required", "Please fill in your delivery or pickup details before checkout.");
      return;
    }
    const message = buildWhatsAppOrderMessage(lines, total, delivery);
    openWhatsAppOrder(message);
  }, []);
}
