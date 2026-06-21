import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gold-oud pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand column with logo */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/01_primary_logo_transparent.png"
                alt="Scentiva Aura"
                width={160}
                height={56}
                className="object-contain h-12 w-auto brightness-0 opacity-85"
              />
            </Link>
            <p className="text-deep-noir/70 text-sm font-sans leading-relaxed">
              Designing scents for the modern identity. Premium fragrances designed for your lifestyle.
            </p>
          </div>

          <div>
            <h4 className="text-deep-noir font-bold text-xs uppercase tracking-widest mb-8">Navigation</h4>
            <div className="flex flex-col space-y-4">
              {[
                { label: "Shop", href: "/shop" },
                { label: "About", href: "/about" },
                { label: "Sustainability", href: "#" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-deep-noir/65 hover:text-deep-noir transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-deep-noir font-bold text-xs uppercase tracking-widest mb-8">Contact</h4>
            <div className="flex flex-col space-y-4 text-sm text-deep-noir/65 font-sans">
              <p className="flex items-center gap-2">
                <MessageCircle size={14} className="text-deep-noir" />
                <span>WhatsApp: 0203154307</span>
              </p>
              <p>Studio: Takoradi, Ghana</p>
            </div>
          </div>

          <div>
            <h4 className="text-deep-noir font-bold text-xs uppercase tracking-widest mb-8">Follow Us</h4>
            <div className="flex space-x-6 text-deep-noir/65">
              <a
                href="https://www.instagram.com/scentivaaura?igsh=MTV6MnhtODV0aXI5bA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-deep-noir transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com/ScentivaAura"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-deep-noir transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-deep-noir/15 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-deep-noir/50 text-[10px] uppercase tracking-widest">
            © 2026 Scentiva Aura. All rights reserved.
          </p>
          <div className="flex space-x-8 text-deep-noir/50 text-[10px] uppercase tracking-widest">
            <Link href="#" className="hover:text-deep-noir transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-deep-noir transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
