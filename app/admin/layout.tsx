import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Scentiva Aura | Admin Dashboard",
  description: "Manage products, orders, customers, and store settings for Scentiva Aura.",
};

import { AdminProvider } from "@/context/AdminContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
