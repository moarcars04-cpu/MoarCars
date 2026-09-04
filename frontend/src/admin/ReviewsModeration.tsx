import React, { useState } from "react";
import {
  Star,
  Search,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
  Trash2,
  Flag,
  Car,
  User,
  Send,
  X,
} from "lucide-react";
import { ReviewItem } from "./types";
import { adminApi } from "./adminApi";

interface ReviewsModerationProps {
  reviews: ReviewItem[];
  setReviews: React.Dispatch<React.SetStateAction<ReviewItem[]>>;
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function ReviewsModeration({
  reviews,
  setReviews,
  setNotice,
}: ReviewsModerationProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [replyingReview, setReplyingReview] = useState<ReviewItem | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = filterStatus === "all" ? reviews : reviews.filter((r) => r.status === filterStatus);

  const handleUpdateStatus = (id: number, status: "Approved" | "Rejected") => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setNotice({ type: "success", text: `Review #${id} marked as "${status}".` });
    adminApi.updateReview(id, { status });
  };

  const handleToggleFeatured = (id: number) => {
    const current = reviews.find((r) => r.id === id);
    const newFeatured = !current?.isFeatured;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFeatured: newFeatured } : r))
    );
    setNotice({ type: "info", text: "Featured homepage review status toggled." });
    adminApi.updateReview(id, { isFeatured: newFeatured });
  };

  const handleSendReply = () => {
    if (!replyingReview || !replyText.trim()) return;
    const reviewId = replyingReview.id;
    const reply = replyText;
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, adminReply: reply } : r))
    );
    setNotice({ type: "success", text: `Reply published for ${replyingReview.customerName}'s review!` });
    adminApi.replyReview(reviewId, reply);
    setReplyingReview(null);
    setReplyText("");
  };


  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Star className="w-6 h-6 text-[#D4AF37]" /> Customer Reviews & Testimonials Moderation
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Audit customer feedback, approve ratings, feature on homepage, and publish official Moar Cars replies
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          {["all", "Approved", "Pending", "Rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all capitalize ${
                filterStatus === st
                  ? "bg-[#D4AF37] text-slate-950 font-black shadow-md"
                  : "bg-[#2A1336]/60 text-purple-300 border border-purple-500/20 hover:text-white"
              }`}
            >
              {st === "all" ? "All Reviews" : st}
            </button>
          ))}
        </div>
      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-2xl space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{r.customerName}</h4>
                  <span className="text-[10px] text-purple-400">{r.customerPhone}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      r.status === "Approved"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : r.status === "Pending"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30"
                    }`}
                  >
                    {r.status}
                  </span>
                  {r.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#D4AF37] text-slate-950">
                      ★ FEATURED ON HOME
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#D4AF37] font-semibold mt-0.5 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5" /> {r.carName} &bull; <span className="text-purple-300">{r.date}</span>
                </p>
              </div>

              <div className="flex items-center gap-1 text-[#D4AF37] font-black text-sm">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-4 h-4 ${idx < r.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-purple-900"}`}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-purple-200/90 leading-relaxed bg-[#14081E] p-3.5 rounded-2xl border border-purple-500/20">
              "{r.comment}"
            </p>

            {r.adminReply && (
              <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-[#D4AF37]/30 text-xs text-purple-200 space-y-1">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase block">Official Response from Moar Cars</span>
                <p className="italic">{r.adminReply}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-purple-500/20 text-xs">
              <button
                onClick={() => handleToggleFeatured(r.id)}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1 ${
                  r.isFeatured
                    ? "bg-[#D4AF37] text-slate-950 border-amber-400"
                    : "bg-purple-950 text-purple-300 border-purple-500/30 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> {r.isFeatured ? "Featured" : "Feature on Homepage"}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setReplyingReview(r);
                    setReplyText(r.adminReply || "");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-[#432650] text-[#D4AF37] border border-purple-500/30 font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1" /> Reply
                </button>
                {r.status !== "Approved" && (
                  <button
                    onClick={() => handleUpdateStatus(r.id, "Approved")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                  >
                    Approve
                  </button>
                )}
                {r.status !== "Rejected" && (
                  <button
                    onClick={() => handleUpdateStatus(r.id, "Rejected")}
                    className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 font-bold"
                  >
                    Reject / Hide
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* REPLY MODAL */}
      {replyingReview && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#D4AF37]" /> Reply to {replyingReview.customerName}
              </h3>
              <button onClick={() => setReplyingReview(null)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-purple-300 italic bg-[#14081E] p-3 rounded-xl">"{replyingReview.comment}"</p>

            <div>
              <label className="block text-purple-300 font-bold text-xs mb-1">Official Response Message</label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Thank you for choosing Moar Cars..."
                className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-3 text-xs text-white"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-purple-500/20">
              <button
                onClick={() => setReplyingReview(null)}
                className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs"
              >
                Publish Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
