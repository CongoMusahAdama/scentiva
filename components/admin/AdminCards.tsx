"use client";

import { ReactNode } from "react";

// ─── Colorful Stat Card (image-style) ─────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  subLabel?: string;
  color: string; // bg color
  textColor?: string;
}

export function StatCard({ label, value, subLabel, color, textColor = "#FFFFFF" }: StatCardProps) {
  return (
    <div
      className="p-5 flex flex-col justify-between"
      style={{ background: color, minHeight: "110px", borderRadius: "0px" }}
    >
      <p style={{ fontSize: "11px", color: `${textColor}cc`, fontFamily: "var(--font-poppins, sans-serif)", fontWeight: 500, letterSpacing: "0.04em" }}>
        {label}
      </p>
      <div>
        <p style={{ fontSize: "30px", fontFamily: "var(--font-lora, serif)", color: textColor, fontWeight: 700, lineHeight: 1.1 }}>
          {value}
        </p>
        {subLabel && (
          <p style={{ fontSize: "10px", color: `${textColor}99`, fontFamily: "var(--font-poppins, sans-serif)", marginTop: "4px" }}>
            {subLabel}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Generic white card ────────────────────────────────────────────────────────

interface AdminCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  noPad?: boolean;
}

export function AdminCard({ title, children, className = "", action, noPad }: AdminCardProps) {
  return (
    <div
      className={`${className}`}
      style={{ background: "#FFFFFF", border: "1px solid #E8E9EC", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", borderRadius: "0px" }}
    >
      {title && (
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #F0F1F4" }}
        >
          <p style={{ fontFamily: "var(--font-lora, serif)", fontSize: "14px", fontWeight: 700, color: "#1A1B23" }}>
            {title}
          </p>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPad ? "" : "p-5"}>{children}</div>
    </div>
  );
}
