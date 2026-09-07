import React, { useState } from "react";
import { Tag, Sparkles, Copy, CheckCircle2, Gift, Clock, ShieldCheck, ArrowRight, Building, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

export const OffersSection: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const offers = [
    {
      code: "PILGRIM10",
      discount: "Flat ₹500 OFF",
      title: "Tirumala Pilgrimage Special",
      desc: "Valid on all 7-seater Innova Crysta & Scorpio-N bookings with zero security deposit perk.",
      tag: "Top Choice",
      color: "from-amber-600/30 to-amber-950/40 border-amber-500/40",
      badgeColor: "bg-brand-gold text-brand-navy",
    },
    {
      code: "WEEKEND20",
      discount: "20% Discount",
      title: "Horsley Hills Weekend Escape",
      desc: "Book Friday to Monday and enjoy unlimited km with 24/7 roadside assistance included.",
      tag: "Weekend Deal",
      color: "from-emerald-600/30 to-emerald-950/40 border-emerald-500/40",
      badgeColor: "bg-emerald-400 text-slate-950",
    },
    {
      code: "CORP2026",
      discount: "Corporate Tariff",
      title: "Executive & Chauffeur Rentals",
      desc: "Monthly billing, GST invoice input credit, and dedicated priority fleet manager for companies.",
      tag: "Business",
      color: "from-sky-600/30 to-sky-950/40 border-sky-500/40",
      badgeColor: "bg-sky-400 text-slate-950",
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="py-20 bg-brand-navy text-primary-foreground relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold flex items-center justify-center gap-1.5">
            <Gift className="h-4 w-4" /> Exclusive Travel Offers
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Best Deals & <span className="text-brand-gold">Pilgrimage Promo Codes</span>
          </h2>
          <p className="text-xs text-primary-foreground/70">
            Apply any promo code at instant checkout to claim flat cash discounts on your self-drive rental.
          </p>
        </div>

        {/* 3 Offer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.code}
              className={`rounded-3xl border bg-gradient-to-br ${offer.color} p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider ${offer.badgeColor}`}>
                    {offer.tag}
                  </span>
                  <span className="text-lg font-black text-white">{offer.discount}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{offer.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">{offer.desc}</p>
                </div>
              </div>

              {/* Coupon Box & Copy Button */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="rounded-xl bg-slate-950/80 border border-white/20 px-3 py-1.5">
                  <span className="text-[10px] uppercase font-bold text-white/40 block">Coupon Code</span>
                  <span className="font-mono text-sm font-black text-brand-gold tracking-widest">{offer.code}</span>
                </div>

                <Button
                  onClick={() => handleCopy(offer.code)}
                  className="h-10 px-4 rounded-xl bg-white text-brand-navy font-black text-xs uppercase hover:bg-brand-gold transition-colors flex items-center gap-1.5"
                >
                  {copiedCode === offer.code ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedCode === offer.code ? "Copied!" : "Copy Code"}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
