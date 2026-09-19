import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string | number;
  name: string;
  location: string;
  avatar?: string;
  rating: number;
  quote: string;
}

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((res) => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: Testimonial[] = res.data.map((r: any) => ({
            id: r.id,
            name: r.customerName || r.name || "Verified Customer",
            location: r.location || "Tirupati",
            avatar: r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customerName || "Customer")}&background=c88d18&color=fff`,
            rating: Number(r.rating) || 5,
            quote: r.comment || r.review || r.quote || "",
          }));
          setTestimonials(mapped);
        }
      })
      .catch((err) => console.warn("[TestimonialsSection] Fetch reviews:", err));
  }, []);

  if (testimonials.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, testimonials.length - 3) : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= testimonials.length - 3 ? 0 : prev + 1));
  };

  const visibleTestimonials = testimonials.slice(startIndex, startIndex + 3);

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-5">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c88d18] block">
              HAPPY CUSTOMERS
            </span>
            <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Our Customers Say
            </h2>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-xs text-slate-400 font-medium">Real journeys. Real smiles.</span>
            {testimonials.length > 3 && (
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous review"
                  className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-[#c88d18] hover:text-[#c88d18] hover:bg-amber-50/50 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next review"
                  className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-[#c88d18] hover:text-[#c88d18] hover:bg-amber-50/50 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleTestimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 relative"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#d49b29] text-[#d49b29]" />
                ))}
              </div>

              {/* Review Quote */}
              <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 font-normal italic flex-1">
                "{t.quote}"
              </p>

              {/* User Profile */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="h-10 w-10 rounded-full overflow-hidden border border-amber-300/60 bg-slate-100 shrink-0">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
