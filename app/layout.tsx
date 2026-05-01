import type { Metadata } from "next";
import { Lora, Poppins } from "next/font/google";
import "./globals.css";
import StoreProviders from "@/components/StoreProviders";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Scentiva Aura | Premium Fragrances",
  description: "Discover high-quality fragrances designed for your lifestyle. Own your scent with Scentiva Aura.",
  icons: {
    icon: [
      { url: "/01_primary_logo_transparent.png", sizes: "32x32", type: "image/png" },
      { url: "/01_primary_logo_transparent.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/01_primary_logo_transparent.png",
    apple: "/01_primary_logo_transparent.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${poppins.variable} antialiased`}>
      <body className="bg-[#0D0D0F] text-[#FFF4DE] font-sans" suppressHydrationWarning>
        <StoreProviders>{children}</StoreProviders>
      </body>
    </html>
  );
}
