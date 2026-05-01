"use client";

import { useState, useEffect } from "react";
import { showSuccess, showError } from "@/lib/swal";
import { Check, X } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCards";
import { AdminButton, Badge, AdminPagination } from "@/components/admin/AdminUI";
import { ReviewService, Review } from "@/lib/services/review.service";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await ReviewService.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error(error);
      showError("Sync Error", "Failed to load reviews from database.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await ReviewService.updateStatus(id, status);
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      showSuccess(
        status === "approved" ? "Review Approved" : "Review Hidden",
        `The review has been ${status === "approved" ? "published" : "removed"} successfully.`
      );
    } catch (error) {
      showError("Update Failed", "Could not update the review status.");
    }
  };

  const onFilterChange = (f: "all" | "pending" | "approved" | "rejected") => {
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
                  <AdminButton variant="secondary" size="sm" onClick={() => updateStatus(r.id as string, "approved")}
                    style={{ color: "#059669", borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.07)" }}
                  >
                    <Check size={12} /> Approve
                  </AdminButton>
                  <AdminButton variant="danger" size="sm" onClick={() => updateStatus(r.id as string, "rejected")}>
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
