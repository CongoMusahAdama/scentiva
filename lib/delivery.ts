export type DeliveryMethod = "delivery" | "pickup";

export type DeliveryDetails = {
  fullName: string;
  phone: string;
  country: string;
  method: DeliveryMethod;
  street: string;
  city: string;
  region: string;
  pickupStation: string;
};

export const DELIVERY_STORAGE_KEY = "scentiva_delivery_details";

export const COUNTRY_OPTIONS = [
  "Ghana",
  "Nigeria",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
  "Canada",
  "Germany",
  "France",
  "Netherlands",
  "United Arab Emirates",
  "Other",
] as const;

export const PICKUP_STATIONS = [
  "Takoradi — Studio pickup",
  "Accra — Osu / East Legon",
  "Accra — Madina",
  "Kumasi — Adum",
  "Cape Coast — central",
  "Other — specify below",
] as const;

export const defaultDeliveryDetails = (): DeliveryDetails => ({
  fullName: "",
  phone: "",
  country: "Ghana",
  method: "delivery",
  street: "",
  city: "",
  region: "",
  pickupStation: "",
});

export function loadDeliveryDetails(): DeliveryDetails {
  if (typeof window === "undefined") return defaultDeliveryDetails();
  try {
    const raw = localStorage.getItem(DELIVERY_STORAGE_KEY);
    if (!raw) return defaultDeliveryDetails();
    return { ...defaultDeliveryDetails(), ...JSON.parse(raw) };
  } catch {
    return defaultDeliveryDetails();
  }
}

export function saveDeliveryDetails(details: DeliveryDetails) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(details));
}

export function isDeliveryDetailsValid(details: DeliveryDetails): boolean {
  const phoneDigits = details.phone.replace(/\D/g, "");
  if (!details.fullName.trim()) return false;
  if (phoneDigits.length < 9 || phoneDigits.length > 15) return false;
  if (!details.city.trim()) return false;
  if (details.method === "pickup") {
    return !!details.pickupStation.trim();
  }
  return true;
}

export const WHATSAPP_NUMBER = "233203154307";

export type OrderLine = {
  name: string;
  id: string;
  quantity: number;
  price: number;
  image?: string;
};

function getSiteOrigin(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "";
}

export function getAbsoluteAssetUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = getSiteOrigin() || "http://localhost:3000";
  try {
    return new URL(path.startsWith("/") ? path : `/${path}`, base).href;
  } catch {
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  }
}

export function getProductPageUrl(id: string): string {
  const base = getSiteOrigin() || "http://localhost:3000";
  try {
    return new URL(`/shop/${encodeURIComponent(id)}`, base).href;
  } catch {
    return `${base}/shop/${encodeURIComponent(id)}`;
  }
}

function formatCurrency(amount: number): string {
  return `GH₵ ${amount.toLocaleString("en-GH")}`;
}

function sanitizeWhatsAppField(value: string): string {
  return value.trim().replace(/[*_~`]/g, "");
}

export { formatCurrency };

export function formatDeliveryBlock(details: DeliveryDetails): string {
  const lines = [
    "📦 *DELIVERY INFORMATION*",
    "─────────────────",
    `👤 *Name:* ${sanitizeWhatsAppField(details.fullName)}`,
    `📱 *Phone:* ${sanitizeWhatsAppField(details.phone)}`,
    `📍 *Area / City:* ${sanitizeWhatsAppField(details.city)}`,
    `🚚 *Method:* ${details.method === "delivery" ? "Home Delivery" : "Pickup"}`,
  ];

  if (details.method === "delivery" && details.street.trim()) {
    lines.push(`🏠 *Address:* ${sanitizeWhatsAppField(details.street)}`);
  }
  if (details.region.trim()) {
    lines.push(`🗺 *Region:* ${sanitizeWhatsAppField(details.region)}`);
  }
  if (details.method === "pickup" && details.pickupStation.trim()) {
    lines.push(`📍 *Pickup:* ${sanitizeWhatsAppField(details.pickupStation)}`);
  }
  if (details.country.trim() && details.country !== "Ghana") {
    lines.push(`🌍 *Country:* ${sanitizeWhatsAppField(details.country)}`);
  }

  return lines.join("\n");
}

function formatOrderItems(lines: OrderLine[]): string {
  return lines
    .map((item, index) => {
      const lineTotal = item.price * item.quantity;
      const parts = [
        `${index + 1}. *${item.name}*`,
        `   SKU: ${item.id}`,
        `   Qty: ${item.quantity} × ${formatCurrency(item.price)} = *${formatCurrency(lineTotal)}*`,
        `   View: ${getProductPageUrl(item.id)}`,
      ];

      if (item.image) {
        parts.push(`   Image: ${getAbsoluteAssetUrl(item.image)}`);
      }

      return parts.join("\n");
    })
    .join("\n\n");
}

export function buildWhatsAppOrderMessage(
  lines: OrderLine[],
  total: number,
  details: DeliveryDetails
): string {
  const itemCount = lines.reduce((sum, item) => sum + item.quantity, 0);

  return [
    "✨ *SCENTIVA AURA — NEW ORDER*",
    "",
    "Hello! I would like to place the following order:",
    "",
    "🛍 *ORDER SUMMARY*",
    "─────────────────",
    formatOrderItems(lines),
    "",
    `💰 *Order Total:* ${formatCurrency(total)} (${itemCount} item${itemCount === 1 ? "" : "s"})`,
    "",
    formatDeliveryBlock(details),
    "",
    "Please confirm availability, total with delivery, and payment options.",
    "Thank you! — Scentiva Aura",
  ].join("\n");
}

export function openWhatsAppOrder(message: string) {
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
}
