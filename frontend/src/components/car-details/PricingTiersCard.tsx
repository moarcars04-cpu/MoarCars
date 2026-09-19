import React, { useState } from "react";
import { Tag, Calendar, Clock, ShieldCheck, Zap, AlertCircle, Check, Info } from "lucide-react";

interface PricingTiersCardProps {
  car: any;
}

export const PricingTiersCard: React.FC<PricingTiersCardProps> = ({ car }) => {
  const [selectedTier, setSelectedTier] = useState<"daily" | "hourly" | "weekly" | "monthly">("daily");

  const dailyPrice = Number(car.pricePerDay) || parseInt(String(car.price || "0").replace(/[^0-9]/g, ""), 10) || 0;
  const hourlyPrice = Number(car.pricePerHour) || (dailyPrice > 0 ? Math.round(dailyPrice / 10) : 0);
  const weeklyPrice = Number(car.pricePerWeek) || (dailyPrice > 0 ? dailyPrice * 7 : 0);
  const monthlyPrice = Number(car.pricePerMonth) || (dailyPrice > 0 ? dailyPrice * 30 : 0);
  const deposit = Number(car.securityDeposit) || 0;
  const lateFee = Number(car.lateFeePerHour) || 0;

  if (dailyPrice === 0) {
    return null;
  }

  const tiers = [
    {
      id: "hourly",
      title: "Hourly Rental",
      duration: "Flexible Hours",
      price: `₹${hourlyPrice.toLocaleString("en-IN")}`,
      unit: "per hour",
      badge: "Hourly",
      savings: "Short Trips",
    },
    {
      id: "daily",
      title: "Daily Plan",
      duration: "24 Hours (Standard)",
      price: `₹${dailyPrice.toLocaleString("en-IN")}`,
      unit: "per day",
      badge: "Standard",
      savings: "24-Hour Rental",
    },
    {
      id: "weekly",
      title: "Weekly Pass",
      duration: "7 Days",
      price: `₹${weeklyPrice.toLocaleString("en-IN")}`,
      unit: "per week",
      badge: "Weekly",
      savings: "7 Days Fleet",
    },
    {
      id: "monthly",
      title: "Monthly Flexi",
      duration: "30 Days",
      price: `₹${monthlyPrice.toLocaleString("en-IN")}`,
      unit: "per month",
      badge: "Monthly",
      savings: "30 Days Fleet",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-teal flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" /> Transparent Pricing Models
          </span>
          <h3 className="text-xl font-extrabold text-brand-navy mt-1">Flexible Duration & Pricing Tiers</h3>
        </div>
        <span className="text-xs text-muted-foreground font-semibold">Zero Hidden Surcharges</span>
      </div>

      {/* Pricing Tier Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((t) => (
          <div
            key={t.id}
            onClick={() => setSelectedTier(t.id as any)}
            className={`p-5 rounded-3xl border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 ${
              selectedTier === t.id
                ? "border-brand-teal bg-brand-teal/5 ring-2 ring-brand-teal/30 shadow-lg scale-[1.02]"
                : "border-border bg-card hover:border-brand-teal/30 hover:shadow-md"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">{t.title}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    selectedTier === t.id ? "bg-brand-teal text-white" : "bg-brand-mist text-brand-navy"
                  }`}
                >
                  {t.badge}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-2xl sm:text-3xl font-black text-brand-navy">{t.price}</span>
                <span className="text-xs text-muted-foreground block">{t.unit}</span>
              </div>

              <p className="text-[11px] text-muted-foreground">{t.duration}</p>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-semibold text-emerald-600">
              <span>{t.savings}</span>
              {selectedTier === t.id && <Check className="h-4 w-4 text-brand-teal" />}
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Transparency Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-card border border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-navy">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Refundable Security Deposit</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {deposit > 0 ? `₹${deposit.toLocaleString("en-IN")} • Credited back via UPI upon return.` : "₹0 Security Deposit"}
          </p>
        </div>

        <div className="space-y-1 sm:border-l sm:border-border sm:pl-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-navy">
            <Clock className="h-4 w-4 text-brand-gold" />
            <span>Late Return Policy</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {lateFee > 0 ? `₹${lateFee}/hr for delay beyond scheduled dropoff.` : "No extra hourly late penalty configured."}
          </p>
        </div>
      </div>
    </div>
  );
};
