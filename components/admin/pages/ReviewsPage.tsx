"use client";

import { useState } from "react";
import { showSuccess } from "@/lib/swal";
import { Check, X } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCards";
import { AdminButton, Badge, AdminPagination } from "@/components/admin/AdminUI";

type ReviewStatus = "pending" | "approved" | "rejected";

interface Review {
  id: number;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
}

const initialReviews: Review[] = [
  { id: 1, customer: "Ama Asante", product: "Oud Royale", rating: 5, comment: "Absolutely divine. The longevity is unmatched — I still get compliments 10 hours later.", date: "Apr 20, 2026", status: "pending" },
  { id: 2, customer: "Kwame Mensah", product: "Velvet Noir", rating: 4, comment: "Rich and sophisticated. Perfect for evening wear. Would recommend to anyone who loves depth.", date: "Apr 19, 2026", status: "pending" },
  { id: 3, customer: "Efua Boateng", product: "Citrus Bloom", rating: 5, comment: "So fresh and uplifting. My go-to for office days. Light but lasts through the day.", date: "Apr 18, 2026", status: "approved" },
  { id: 4, customer: "Nana Yaw", product: "Amber Mist", rating: 3, comment: "Nice scent but the bottle leaked during shipping. Would appreciate better packaging.", date: "Apr 17, 2026", status: "pending" },
  { id: 5, customer: "Abena Sarpong", product: "Oud Royale", rating: 5, comment: "Worth every pesewa. Truly a luxury experience.", date: "Apr 16, 2026", status: "approved" },
  { id: 6, customer: "Kofi Darko", product: "Velvet Noir", rating: 2, comment: "Not what I expected. Too heavy for my preference.", date: "Apr 15, 2026", status: "rejected" },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filter, setFilter] = useState<"all" | ReviewStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  const updateStatus = (id: number, status: "approved" | "rejected") => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    showSuccess(
      status === "approved" ? "Review Approved" : "Review Hidden",
      `The review has been ${status === "approved" ? "published" : "removed"} successfully.`
    );
  };

  const onFilterChange = (f: "all" | ReviewStatus) => {
    setFilter(f);
    setCurrentPage(1);
  };

  const stars = (n: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < n ? "#D8B34B" : "#2A2A2E", fontSize: "13px" }}>★</span>
    ));

  const counts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              style={{
                padding: "6px 16px", borderRadius: "20px", fontSize: "11px",
                fontFamily: "var(--font-poppins, sans-serif)", fontWeight: isActive ? 600 : 400,
                textTransform: "capitalize", cursor: "pointer",
                border: isActive ? "1px solid rgba(216,179,75,0.4)" : "1px solid #E8E9EC",
                background: isActive ? "rgba(216,179,75,0.08)" : "#FFFFFF",
                color: isActive ? "#B8942A" : "#6B7280", transition: "all 0.15s ease",
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((r) => (
          <AdminCard key={r.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Avatar */}
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: "38px", height: "38px", background: "rgba(216,179,75,0.08)", border: "1px solid rgba(216,179,75,0.15)" }}
                >
                  <span style={{ fontSize: "14px", color: "#D8B34B", fontWeight: 600 }}>{r.customer.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span style={{ fontSize: "13px", color: "#1A1B23", fontFamily: "var(--font-poppins, sans-serif)", fontWeight: 600 }}>
                      {r.customer}
                    </span>
                    <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-poppins, sans-serif)" }}>
                      on <span style={{ color: "#1A1B23", fontWeight: 500 }}>{r.product}</span>
                    </span>
                    <Badge
                      variant={r.status === "pending" ? "pending" : r.status === "approved" ? "approved" : "rejected"}
                      label={r.status}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-1">{stars(r.rating)}</div>
                  <p style={{ fontSize: "13px", color: "#374151", fontFamily: "var(--font-poppins, sans-serif)", lineHeight: 1.65, marginTop: "8px" }}>
                    &ldquo;{r.comment}&rdquo;
                  </p>
                  <p style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-poppins, sans-serif)", marginTop: "6px" }}>
                    {r.date}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {r.status === "pending" && (
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <AdminButton variant="secondary" size="sm" onClick={() => updateStatus(r.id, "approved")}
                    style={{ color: "#059669", borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.07)" }}
                  >
                    <Check size={12} /> Approve
                  </AdminButton>
                  <AdminButton variant="danger" size="sm" onClick={() => updateStatus(r.id, "rejected")}>
                    <X size={12} /> Reject
                  </AdminButton>
                </div>
              )}
            </div>
          </AdminCard>
        ))}
        {filtered.length > pageSize && (
          <div className="mt-4">
            <AdminPagination 
              currentPage={currentPage}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: "#6B7280", fontFamily: "var(--font-poppins, sans-serif)", fontSize: "13px" }}>
            No reviews in this category.
          </div>
        )}
      </div>
    </div>

  );
}
