"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { allProducts } from "@/lib/products";

import { useAuth } from "@/context/AuthContext";
import { ReviewService, Review } from "@/lib/services/review.service";

export default function ReviewsSection() {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.fullName) {
      fetchMyReviews();
    }
  }, [user]);

  const fetchMyReviews = async () => {
    try {
      if (!user?.fullName) return;
      const data = await ReviewService.getCustomerReviews(user.fullName);
      setMyReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || rating === 0 || !comment || !user?.fullName) return;
    
    try {
      const productObj = allProducts.find((p) => p.id === selectedProduct);
      await ReviewService.createReview({
        customer: user.fullName,
        product: productObj ? productObj.name : selectedProduct,
        rating,
        comment,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: "pending"
      });
      
      setSubmitted(true);
      fetchMyReviews();
      
      setTimeout(() => {
        setSubmitted(false);
        setSelectedProduct("");
        setRating(0);
        setComment("");
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-gray-100 pb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#1A1B23]">Submit a Review</h2>
        <p className="text-gray-400 text-xs mt-1">Share your experience with our fragrances.</p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 border border-emerald-100 p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-serif text-emerald-900 mb-2">Thank you!</h3>
            <p className="text-emerald-700 text-sm max-w-xs mx-auto">Your review has been sent to our team and will be visible once approved.</p>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-[#E8E9EC] p-8 md:p-12 space-y-8"
          >
            {/* Product Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Select Product</label>
                <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                  {allProducts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProduct(p.id)}
                      className={`flex items-center gap-4 p-3 border transition-all text-left ${
                        selectedProduct === p.id 
                          ? "border-[#D8B34B] bg-[#D8B34B]/5" 
                          : "border-[#E8E9EC] hover:border-[#1A1B23]"
                      }`}
                    >
                      <div className="relative w-12 h-12 bg-gray-50 flex-shrink-0">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[#1A1B23] uppercase tracking-tight">{p.name}</p>
                        <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">{p.id}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                {/* Rating */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 transition-transform hover:scale-110 ${
                          rating >= star ? "text-[#D8B34B]" : "text-gray-200"
                        }`}
                      >
                        <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you think about the fragrance..."
                    rows={5}
                    className="w-full bg-[#F9FAFB] border border-[#E8E9EC] p-4 text-[13px] outline-none focus:border-[#D8B34B] focus:bg-white transition-all resize-none"
                    style={{ borderRadius: "0px" }}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={!selectedProduct || rating === 0 || !comment}
                className="bg-[#1A1B23] text-white px-10 py-4 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={14} /> Send Review
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Past Reviews */}
      <div className="mt-12">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#1A1B23]">My Past Reviews</h2>
        </div>
        
        {loading ? (
          <p className="text-xs text-gray-400">Loading reviews...</p>
        ) : myReviews.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 border border-gray-100">
             <p className="text-xs text-gray-400">You haven't submitted any reviews yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myReviews.map((review) => (
              <div key={review.id} className="bg-white border border-[#E8E9EC] p-6 relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1B23] uppercase tracking-widest">{review.product}</h4>
                    <p className="text-[10px] text-gray-400 mt-1">{review.date}</p>
                  </div>
                  <div className={`px-2 py-1 text-[9px] uppercase tracking-widest font-bold ${
                    review.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                    review.status === 'rejected' ? 'bg-rose-50 text-rose-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {review.status}
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                   {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < review.rating ? "#D8B34B" : "none"} className={i < review.rating ? "text-[#D8B34B]" : "text-gray-200"} />
                   ))}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
