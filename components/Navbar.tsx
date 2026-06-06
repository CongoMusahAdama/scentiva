"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

const homeSections = [
  { label: "Find Your Scent", href: "/#scent-assistant" },
  { label: "Collections", href: "/#categories" },
  { label: "Featured Shop", href: "/#shop" },
  { label: "Get Started", href: "/#cta" },
];

const shopCategories = [
  { label: "All Products", href: "/shop" },
  { label: "Men's Perfumes", href: "/shop?category=mens" },
  { label: "Women's Perfumes", href: "/shop?category=womens" },
  { label: "Unisex Sprays", href: "/shop?category=unisex" },
];

const simpleLinks = [
  { label: "About", href: "/about" },
];

function NavDropdown({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: { label: string; href: string }[];
  onNavigate?: () => void;
}) {
  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-1 font-bold text-parchment hover:text-gold-oud transition-colors py-1"
        aria-haspopup="true"
      >
        {label}
        <ChevronDown size={12} className="opacity-60 group-hover:rotate-180 transition-transform duration-200" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-elevated border border-parchment/10 min-w-[200px] py-2 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="block px-5 py-2.5 text-parchment/70 hover:text-parchment hover:bg-parchment/5 transition-colors text-left normal-case"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileHomeOpen, setMobileHomeOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const accountHref = isAdmin ? "/admin" : "/signin";
  const accountLabel = isAdmin ? "Admin" : "Account";

  const closeMobile = () => {
    setIsMobileMenuOpen(false);
    setMobileHomeOpen(false);
    setMobileShopOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const utilityLinks = (
    <div className="flex items-center gap-4 sm:gap-6 font-bold text-parchment">
      <ThemeToggle className="font-bold" />
      <Link href={accountHref} className="hover:text-gold-oud transition-colors">
        {accountLabel}
      </Link>
      <button
        onClick={() => setIsCartOpen(true)}
        className="hover:text-gold-oud transition-colors"
      >
        Cart [{totalItems}]
      </button>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md uppercase">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Logo */}
          <div className="flex justify-center py-4 md:py-5">
            <Link href="/" className="inline-block">
              <Image
                src="/01_primary_logo_transparent.png"
                alt="Scentiva Aura"
                width={360}
                height={120}
                className="object-contain h-14 sm:h-16 md:h-[4.5rem] lg:h-20 w-auto min-w-[200px] sm:min-w-[240px] md:min-w-[280px] brightness-0 dark:brightness-100 opacity-90 dark:opacity-100"
                priority
              />
            </Link>
          </div>

          {/* One row: Account/Cart ← far apart → Nav ← far apart → Menu (mobile) */}
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-4 pb-5 font-bold text-parchment">
            <div aria-hidden="true" />
            <nav className="flex items-center justify-center gap-6 lg:gap-10">
              <NavDropdown label="Home" items={homeSections} />
              <NavDropdown label="Shop" items={shopCategories} />
              {simpleLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-gold-oud transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="justify-self-end">{utilityLinks}</div>
          </div>

          {/* Mobile: same row — Menu left, Account/Cart right */}
          <div className="flex md:hidden items-center justify-between pb-4 font-bold text-parchment">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="hover:text-gold-oud transition-colors py-1"
              aria-label="Open menu"
            >
              Menu
            </button>
            {utilityLinks}
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-surface md:hidden flex flex-col uppercase overflow-y-auto">
          <div className="flex justify-between items-center px-4 h-12 border-b border-parchment/10 shrink-0">
            <span className="text-parchment/50">Menu</span>
            <button
              onClick={closeMobile}
              className="text-parchment flex items-center gap-2 py-2"
              aria-label="Close menu"
            >
              Close <X size={16} />
            </button>
          </div>

          <div className="flex-1 px-6 py-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setMobileHomeOpen(!mobileHomeOpen)}
              className="flex items-center justify-between text-lg text-parchment py-3 border-b border-parchment/5"
            >
              Home
              <ChevronDown size={16} className={`transition-transform ${mobileHomeOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileHomeOpen && (
              <div className="pl-4 pb-2 flex flex-col gap-2 normal-case">
                {homeSections.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className="text-parchment/70 py-2 hover:text-gold-oud"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileShopOpen(!mobileShopOpen)}
              className="flex items-center justify-between text-lg text-parchment py-3 border-b border-parchment/5"
            >
              Shop
              <ChevronDown size={16} className={`transition-transform ${mobileShopOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileShopOpen && (
              <div className="pl-4 pb-2 flex flex-col gap-2 normal-case">
                {shopCategories.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className="text-parchment/70 py-2 hover:text-gold-oud"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {simpleLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMobile}
                className="text-lg text-parchment py-3 border-b border-parchment/5 hover:text-gold-oud"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
