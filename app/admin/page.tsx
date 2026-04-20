"use client";

import { useAdmin } from "@/context/AdminContext";
import DashboardPage from "@/components/admin/pages/DashboardPage";
import ProductsPage from "@/components/admin/pages/ProductsPage";
import OrdersPage from "@/components/admin/pages/OrdersPage";
import CustomersPage from "@/components/admin/pages/CustomersPage";
import ReviewsPage from "@/components/admin/pages/ReviewsPage";
import ReferralsPage from "@/components/admin/pages/ReferralsPage";
import SettingsPage from "@/components/admin/pages/SettingsPage";
import ReceiptsPage from "@/components/admin/pages/ReceiptsPage";

function AdminPageRouter() {
  const { activePage } = useAdmin();

  switch (activePage) {
    case "dashboard":
      return <DashboardPage />;
    case "products":
      return <ProductsPage />;
    case "orders":
      return <OrdersPage />;
    case "customers":
      return <CustomersPage />;
    case "reviews":
      return <ReviewsPage />;
    case "referrals":
      return <ReferralsPage />;
    case "settings":
      return <SettingsPage />;
    case "receipts":
      return <ReceiptsPage />;
    default:
      return <DashboardPage />;
  }
}

export default function AdminPage() {
  return <AdminPageRouter />;
}
