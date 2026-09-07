import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "1",
    name: "Rahul Mehta",
    location: "Hyderabad",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    quote:
      "“Amazing experience! The car was in perfect condition and the booking process was so smooth. MOAR CARS made our trip unforgettable.”",
  },
  {
    id: "2",
    name: "Sneha Reddy",
    location: "Bengaluru",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    quote:
      "“Premium cars, professional service and no hidden charges. Highly recommended for anyone who loves to drive in style!”",
  },
  {
    id: "3",
    name: "Arjun Varma",
    location: "Chennai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    quote:
      "“Picked up the car at the airport, super convenient! The vehicle was clean, and the support team was available 24/7. Truly a premium service.”",
  },
  {
    id: "4",
    name: "Pooja Sharma",
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    quote:
      "“Rented the BMW for our executive summit. Flawless doorstep delivery and luxury interior. Definitely booking again for our next tour!”",
  },
];

export const TestimonialsSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 3 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= TESTIMONIALS_DATA.length - 3 ? 0 : prev + 1));
  };

  const visibleTestimonials = [
    TESTIMONIALS_DATA[startIndex % TESTIMONIALS_DATA.length],
    TESTIMONIALS_DATA[(startIndex + 1) % TESTIMONIALS_DATA.length],
    TESTIMONIALS_DATA[(startIndex + 2) % TESTIMONIALS_DATA.length],
  ];

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
          </div>
        </div>

        {/* 3 Testimonial Cards Grid */}
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
                {t.quote}
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
