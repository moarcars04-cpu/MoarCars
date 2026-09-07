import React, { useState } from "react";
import {
  X,
  Star,
  Camera,
  Video,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Car,
} from "lucide-react";
import { ReviewItem, BookingItem } from "../../types/user";
import { Button } from "@/components/ui/button";

interface ReviewModalProps {
  booking?: BookingItem | null;
  existingReview?: ReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (review: ReviewItem) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  booking,
  existingReview,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(existingReview?.cleanlinessRating || 5);
  const [performanceRating, setPerformanceRating] = useState<number>(existingReview?.performanceRating || 5);
  const [handoverRating, setHandoverRating] = useState<number>(existingReview?.handoverRating || 5);
  const [valueRating, setValueRating] = useState<number>(existingReview?.valueRating || 5);
  const [comment, setComment] = useState<string>(
    existingReview?.comment ||
      "Pristine vehicle condition and smooth ghat road climb to Tirumala! Zero deposit deduction and super fast handover."
  );
  const [carName, setCarName] = useState<string>(
    existingReview?.carName || booking?.carName || "Toyota Innova Crysta ZX"
  );
  const [photoUrls, setPhotoUrls] = useState<string[]>(
    existingReview?.photoUrls || [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80",
    ]
  );
  const [videoUrl, setVideoUrl] = useState<string>(existingReview?.videoUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reviewData: ReviewItem = {
      id: existingReview?.id || Math.floor(1000 + Math.random() * 9000),
      customerName: existingReview?.customerName || booking?.customerName || "Verified Pilgrim",
      customerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      carName,
      rating,
      cleanlinessRating,
      performanceRating,
      handoverRating,
      valueRating,
      comment,
      photoUrls,
      videoUrl: videoUrl || undefined,
      date: existingReview?.date || "September 2026",
      status: "Approved",
      bookingId: booking?.id || existingReview?.bookingId || 1018,
      likesCount: existingReview?.likesCount || 0,
    };

    try {
      if (existingReview) {
        await fetch(`/api/reviews/${existingReview.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        });
      } else {
        await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        });
      }
    } catch (e) {}

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(reviewData);
      onClose();
    }, 600);
  };

  const renderStarSelector = (
    value: number,
    onChange: (val: number) => void,
    label: string
  ) => (
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-white/80">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 text-amber-400 hover:scale-110 transition-transform"
          >
            <Star
              className={`h-4 w-4 ${
                star <= value ? "fill-amber-400 text-amber-400" : "text-white/20"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative max-w-lg w-full max-h-[92vh] rounded-3xl bg-slate-900 border border-brand-gold/40 p-6 text-white space-y-5 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-gold text-brand-navy font-black text-sm">
              ★
            </span>
            <div>
              <h4 className="text-sm font-bold">
                {existingReview ? "Edit Your Vehicle Review" : "Share Your Rental Experience"}
              </h4>
              <p className="text-[10px] text-white/60">{carName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Multi-Category Ratings Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2.5">
            {renderStarSelector(rating, setRating, "Overall Trip Rating")}
            {renderStarSelector(cleanlinessRating, setCleanlinessRating, "Cleanliness & Fragrance")}
            {renderStarSelector(performanceRating, setPerformanceRating, "Engine & Ghat Performance")}
            {renderStarSelector(handoverRating, setHandoverRating, "Executive Handover Speed")}
            {renderStarSelector(valueRating, setValueRating, "Pricing & Value for Money")}
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-white/70">
              Detailed Written Feedback
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other travelers about your driving experience, fuel economy, comfort..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white outline-none focus:border-brand-gold"
            />
          </div>

          {/* Photos Upload & Video Preview */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-white/70 flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-brand-gold" /> Uploaded Car Photos & Video Tour
            </label>

            <div className="grid grid-cols-3 gap-2">
              {photoUrls.map((url, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-white/10 h-20">
                  <img src={url} alt="Review" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 right-1 rounded-full bg-black/70 px-1.5 text-[8px] font-bold text-white">
                    HD
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <input
                type="text"
                placeholder="Optional: Paste YouTube Shorts or Drive video link"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 rounded-xl bg-brand-gold text-brand-navy font-extrabold text-xs uppercase hover:bg-brand-gold-soft shadow-lg"
            >
              {isSubmitting ? "Publishing..." : existingReview ? "Save Changes" : "Submit Verified Review ★"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
