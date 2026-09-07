import React, { useState } from "react";
import { Star, Quote, CheckCircle2, ThumbsUp, ShieldCheck, Heart, Sparkles } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  carRented: string;
  rating: number;
  category: "pilgrim" | "luxury" | "family" | "all";
  avatar: string;
  comment: string;
  date: string;
  tripType: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Suresh Reddy",
    location: "Hyderabad",
    role: "Pilgrim & Entrepreneur",
    carRented: "Toyota Innova Crysta (7-Seater)",
    rating: 5,
    category: "pilgrim",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    comment:
      "Seamless experience for our family's Tirumala Darshan! The Innova Crysta was delivered spotless at Renigunta Airport right as we landed. Driving on the Tirumala ghat road was super smooth with great engine power. Deposit refund came back in 2 hours!",
    date: "August 2026",
    tripType: "Family Pilgrimage",
  },
  {
    id: "2",
    name: "Ananya Sharma",
    location: "Bangalore",
    role: "Tech Lead",
    carRented: "BMW 3 Series Gran Limousine",
    rating: 5,
    category: "luxury",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    comment:
      "Rented the BMW 3 Series for an executive client visit and VIP darshan in Tirupati. The car was in pristine showroom condition with pristine ambient lighting. The digital key unlock via the Moar Cars app made it ultra-futuristic!",
    date: "July 2026",
    tripType: "Corporate & VIP",
  },
  {
    id: "3",
    name: "Venkat Ramanathan",
    location: "Chennai",
    role: "Architect",
    carRented: "Mahindra Scorpio-N 4x4",
    rating: 5,
    category: "family",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    comment:
      "Booked the Scorpio-N for a multi-day trip covering Tirupati, Talakona Waterfalls, and Horsley Hills. Outstanding suspension and high ground clearance. Transparent fuel policy with zero hidden charges. Highly recommended!",
    date: "September 2026",
    tripType: "Weekend Getaway",
  },
  {
    id: "4",
    name: "Pooja & Karthik Varma",
    location: "Vijayawada",
    role: "Software Consultant",
    carRented: "Tata Nexon EV Max",
    rating: 5,
    category: "pilgrim",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    comment:
      "Electric self-drive in Tirupati was such an eco-friendly breeze. 400km range handled our city trips, Srikalahasti, and Kanipakam without needing a recharge. Fast charging point support at Alipiri was a great plus!",
    date: "August 2026",
    tripType: "Eco-Temple Tour",
  },
];

export const TestimonialsSection: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "pilgrim" | "luxury" | "family">("all");

  const filteredReviews = filter === "all" ? TESTIMONIALS : TESTIMONIALS.filter((t) => t.category === filter);

  return (
    <section className="py-24 bg-brand-mist/40 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-teal inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10">
            <Sparkles className="h-3.5 w-3.5" /> Verified Customer Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Trusted by Over <span className="text-brand-teal">15,000+ Travellers</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Read authentic reviews from devotees, families, and business travellers who trust Moar Cars for their self-drive journey in Tirupati & Andhra Pradesh.
          </p>
        </div>

        {/* Rating Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-card border border-border shadow-sm">
          <div className="text-center space-y-1">
            <div className="text-3xl font-black text-brand-navy flex items-center justify-center gap-1">
              4.9 <Star className="h-6 w-6 text-brand-gold fill-brand-gold" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">Average Rating (2,400+ reviews)</p>
          </div>
          <div className="text-center space-y-1 border-l border-border">
            <div className="text-3xl font-black text-brand-teal">15,000+</div>
            <p className="text-xs font-medium text-muted-foreground">Successful Trips Completed</p>
          </div>
          <div className="text-center space-y-1 border-l border-border">
            <div className="text-3xl font-black text-brand-navy">100%</div>
            <p className="text-xs font-medium text-muted-foreground">Ghat Road Certified Fleet</p>
          </div>
          <div className="text-center space-y-1 border-l border-border">
            <div className="text-3xl font-black text-emerald-600">2 Hours</div>
            <p className="text-xs font-medium text-muted-foreground">Instant Deposit Refund Average</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: "All Reviews" },
            { id: "pilgrim", label: "Tirumala Pilgrims" },
            { id: "luxury", label: "VIP & Luxury" },
            { id: "family", label: "Road Trips & SUV" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === cat.id
                  ? "bg-brand-navy text-white shadow-md"
                  : "bg-card text-muted-foreground hover:text-brand-navy border border-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <Quote className="absolute top-4 right-4 h-12 w-12 text-brand-teal/10 pointer-events-none" />

              <div className="space-y-4">
                {/* Rating & Car */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-brand-gold fill-brand-gold" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-mist text-brand-navy border border-border">
                    {rev.tripType}
                  </span>
                </div>

                {/* Review text */}
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* User info & Car Tag */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="h-11 w-11 rounded-full object-cover border-2 border-brand-teal shadow"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-brand-navy flex items-center gap-1.5">
                      {rev.name}
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-100" />
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {rev.role} • {rev.location}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-semibold text-brand-teal block">{rev.carRented}</span>
                  <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
