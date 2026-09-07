import React, { useState } from "react";
import {
  Star,
  Camera,
  Video,
  ThumbsUp,
  MessageSquare,
  Edit,
  Trash2,
  Flag,
  Plus,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  X,
  AlertTriangle,
} from "lucide-react";
import { ReviewItem, BookingItem } from "../../types/user";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "./ReviewModal";

interface ReviewsSectionProps {
  userReviews?: ReviewItem[];
  completedBookings?: BookingItem[];
  onBrowseFleet: () => void;
}

const DEMO_REVIEWS: ReviewItem[] = [
  {
    id: 101,
    customerName: "S. Vishnu Vardhan",
    customerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    carName: "Toyota Innova Crysta ZX Captain",
    rating: 5,
    cleanlinessRating: 5,
    performanceRating: 5,
    handoverRating: 5,
    valueRating: 5,
    comment: "The Innova was in pristine condition! Cruised up the Tirumala second ghat road effortlessly with full family and luggage. Fastag was active and security deposit was refunded in 45 minutes!",
    photoUrls: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
    ],
    date: "September 2026",
    status: "Approved",
    isFeatured: true,
    likesCount: 14,
    adminReply: "Thank you for choosing Moar Cars for your family pilgrimage! We look forward to serving you again.",
  },
  {
    id: 102,
    customerName: "Dr. K. Raghavendra",
    customerAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    carName: "Mahindra Thar 4x4 Hardtop",
    rating: 5,
    cleanlinessRating: 5,
    performanceRating: 5,
    handoverRating: 4,
    valueRating: 5,
    comment: "Took the Thar for a weekend road trip to Talakona waterfalls. Phenomenal ground clearance and rugged suspension. Digital keyless unlock worked seamlessly through the app.",
    photoUrls: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    ],
    videoUrl: "https://youtube.com/shorts/demo-thar",
    date: "August 2026",
    status: "Approved",
    likesCount: 9,
  },
  {
    id: 103,
    customerName: "P. Sneha Rao",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    carName: "Hyundai Creta SX(O) Sunroof",
    rating: 5,
    cleanlinessRating: 5,
    performanceRating: 4,
    handoverRating: 5,
    valueRating: 5,
    comment: "Very clean interior with fresh lavender fragrance. Airport delivery at Renigunta TIR T1 was right on time. Highly recommended self-drive service in AP!",
    photoUrls: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
    ],
    date: "August 2026",
    status: "Approved",
    likesCount: 6,
  },
];

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  userReviews,
  completedBookings = [],
  onBrowseFleet,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(
    userReviews && userReviews.length > 0 ? userReviews : DEMO_REVIEWS
  );
  const [filterRating, setFilterRating] = useState<string>("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [reportingReview, setReportingReview] = useState<ReviewItem | null>(null);
  const [reportReason, setReportReason] = useState("Inappropriate language or spam");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSaveReview = (review: ReviewItem) => {
    if (editingReview) {
      setReviews((prev) => prev.map((r) => (r.id === review.id ? review : r)));
      showToast("✅ Review updated successfully!");
    } else {
      setReviews((prev) => [review, ...prev]);
      showToast("🌟 Thank you! Your verified review has been published.");
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!window.confirm("Are you sure you want to remove this review?")) return;
    try {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    } catch (e) {}
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast("🗑️ Review deleted.");
  };

  const handleLikeReview = async (id: number) => {
    try {
      await fetch(`/api/reviews/${id}/like`, { method: "POST" });
    } catch (e) {}
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likesCount: (r.likesCount || 0) + 1 } : r))
    );
    showToast("👍 Helpful vote recorded!");
  };

  const handleReportSubmit = async () => {
    if (!reportingReview) return;
    try {
      await fetch(`/api/reviews/${reportingReview.id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason }),
      });
    } catch (e) {}
    setReportingReview(null);
    showToast("🚩 Review reported to moderation team for verification.");
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (filterRating === "5") return r.rating === 5;
    if (filterRating === "photos") return r.photoUrls && r.photoUrls.length > 0;
    if (filterRating === "video") return !!r.videoUrl;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage("")} className="text-emerald-300 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Banner & Rating Highlights */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-gold text-brand-navy font-black text-sm">
              ★
            </span>
            <h2 className="text-xl font-extrabold text-white">Community Reviews & Ratings</h2>
          </div>
          <p className="text-xs text-white/60">
            Real feedback from verified travelers across Tirupati, Tirumala ghats, and AP tourism destinations.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-3xl font-black text-brand-gold">4.92 / 5.0</span>
            <span className="text-[10px] text-white/50 block">Based on 1,420+ Verified Trips</span>
          </div>

          <Button
            onClick={() => {
              setEditingReview(null);
              setShowReviewModal(true);
            }}
            className="h-11 px-5 rounded-2xl bg-brand-gold text-brand-navy font-extrabold text-xs uppercase hover:bg-brand-gold-soft flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="h-4 w-4" /> Write a Review
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
        {[
          { id: "all", label: `All Reviews (${reviews.length})` },
          { id: "5", label: "★ 5 Star Ratings" },
          { id: "photos", label: "📸 With Car Photos" },
          { id: "video", label: "🎥 With Video Tour" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterRating(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterRating === f.id
                ? "bg-brand-gold text-brand-navy font-black shadow"
                : "bg-slate-900/60 border border-white/5 text-white/70 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl space-y-4 hover:border-brand-gold/30 transition-all text-xs"
          >
            {/* Top Bar: Customer info, car, stars */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    rev.customerAvatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                  }
                  alt={rev.customerName}
                  className="h-11 w-11 rounded-full object-cover border border-brand-gold/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {rev.customerName}
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="h-2.5 w-2.5" /> Verified Trip
                    </span>
                  </h4>
                  <p className="text-[11px] text-brand-gold font-semibold mt-0.5">
                    {rev.carName} • {rev.date}
                  </p>
                </div>
              </div>

              {/* Star Badges */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Review Comment */}
            <p className="text-white/80 leading-relaxed text-sm">{rev.comment}</p>

            {/* Multi-Category Score Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-slate-950 border border-white/5 text-center">
                <span className="text-[9px] text-white/50 block uppercase">Cleanliness</span>
                <span className="font-bold text-brand-gold">★ {rev.cleanlinessRating || 5}/5</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-white/5 text-center">
                <span className="text-[9px] text-white/50 block uppercase">Performance</span>
                <span className="font-bold text-brand-gold">★ {rev.performanceRating || 5}/5</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-white/5 text-center">
                <span className="text-[9px] text-white/50 block uppercase">Handover</span>
                <span className="font-bold text-brand-gold">★ {rev.handoverRating || 5}/5</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-white/5 text-center">
                <span className="text-[9px] text-white/50 block uppercase">Value</span>
                <span className="font-bold text-brand-gold">★ {rev.valueRating || 5}/5</span>
              </div>
            </div>

            {/* Photo & Video Previews */}
            {rev.photoUrls && rev.photoUrls.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto pt-2 scrollbar-none">
                {rev.photoUrls.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Customer Fleet Photo"
                    className="h-20 w-28 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                ))}
              </div>
            )}

            {/* Admin Reply */}
            {rev.adminReply && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                <p className="font-bold text-brand-gold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Response from Moar Cars Fleet Manager:
                </p>
                <p className="text-white/80">{rev.adminReply}</p>
              </div>
            )}

            {/* Footer Actions: Likes, Edit, Delete, Report */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-white/60">
              <button
                type="button"
                onClick={() => handleLikeReview(rev.id)}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <ThumbsUp className="h-3.5 w-3.5 text-brand-gold" />
                <span>Helpful ({rev.likesCount || 0})</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingReview(rev);
                    setShowReviewModal(true);
                  }}
                  className="flex items-center gap-1 hover:text-white transition-colors text-[11px]"
                >
                  <Edit className="h-3 w-3" /> Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteReview(rev.id)}
                  className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors text-[11px]"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>

                <button
                  type="button"
                  onClick={() => setReportingReview(rev)}
                  className="flex items-center gap-1 hover:text-amber-400 transition-colors text-[11px]"
                >
                  <Flag className="h-3 w-3" /> Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          existingReview={editingReview}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSuccess={handleSaveReview}
        />
      )}

      {/* Report Review Modal */}
      {reportingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-md w-full rounded-3xl bg-slate-900 border border-amber-500/40 p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-bold flex items-center gap-2 text-amber-400">
                <AlertTriangle className="h-4 w-4" /> Report Review
              </h4>
              <button
                onClick={() => setReportingReview(null)}
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-white/70">
                Please select the reason you believe this review violates Moar community guidelines:
              </p>

              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white outline-none"
              >
                <option value="Inappropriate language or spam">Inappropriate language or spam</option>
                <option value="False information or competitor spam">False information or competitor spam</option>
                <option value="Personal harassment or conflict">Personal harassment or conflict</option>
                <option value="Irrelevant to car rental experience">Irrelevant to car rental experience</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setReportingReview(null)}
                className="flex-1 h-10 rounded-xl border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReportSubmit}
                className="flex-1 h-10 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                Submit Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
