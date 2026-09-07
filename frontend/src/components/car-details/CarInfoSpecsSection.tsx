import React from "react";
import {
  Fuel,
  Gauge,
  Users,
  Luggage,
  ShieldCheck,
  Zap,
  Sparkles,
  Award,
  Compass,
  Radio,
  Sun,
  Key,
  Wind,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  HeartHandshake,
} from "lucide-react";

interface CarInfoSpecsSectionProps {
  car: any;
}

export const CarInfoSpecsSection: React.FC<CarInfoSpecsSectionProps> = ({ car }) => {
  // Dynamic or fallback specs calculations
  const isEV = (car.fuelType || "").toLowerCase() === "electric" || (car.category || "").toLowerCase() === "electric";
  const isLuxury = (car.category || "").toLowerCase() === "luxury" || car.name.includes("BMW") || car.name.includes("Innova");
  const isSUV = (car.category || "").toLowerCase() === "suv" || car.name.includes("Scorpio") || car.name.includes("Creta");

  const specs = [
    {
      label: "Fuel Type",
      value: car.fuelType || (isEV ? "100% Electric" : "Petrol"),
      sub: isEV ? "Zero Emission" : "BS6 Phase 2",
      icon: Fuel,
    },
    {
      label: "Transmission",
      value: car.transmission || "Automatic",
      sub: "Smooth Shift",
      icon: Gauge,
    },
    {
      label: "Seating Capacity",
      value: `${car.seats || 5} Passengers`,
      sub: car.seats === 7 ? "Captain Seats Layout" : "Ergonomic Cushion",
      icon: Users,
    },
    {
      label: "Mileage / Range",
      value: car.mileage || (isEV ? "405 km / charge" : "18 km/l"),
      sub: "Real-world Tested",
      icon: Zap,
    },
    {
      label: "Boot Space",
      value: car.bootSpace || (car.seats === 7 ? "520 Litres" : "380 Litres"),
      sub: "Holds 3 Large + 2 Small Bags",
      icon: Luggage,
    },
    {
      label: "Ground Clearance",
      value: isSUV ? "205 mm" : "175 mm",
      sub: "Ghat Road Optimized",
      icon: Compass,
    },
  ];

  const comfortFeatures = [
    { name: "Panoramic Sunroof", available: car.hasSunroof ?? true, desc: "Breathtaking views of Tirumala hills" },
    { name: "Wireless Apple CarPlay / Android Auto", available: true, desc: "Seamless navigation & playlist streaming" },
    { name: "Ventilated Front Seats", available: isLuxury || isSUV, desc: "Keeps you cool during sunny temple tours" },
    { name: "Dual-Zone Automatic Climate Control", available: true, desc: "Independent temperature with rear AC vents" },
    { name: "Premium Bose / Harman Sound", available: isLuxury || isSUV, desc: "Devotional chants & crystal audio" },
    { name: "Wireless Smartphone Charging", available: true, desc: "Fast 15W inductive charge pad" },
    { name: "Keyless Smart Entry & Push Start", available: true, desc: "Walk-in access with digital key sync" },
    { name: "Cruise Control with Speed Limiter", available: true, desc: "Effortless highway driving on NH140/NH71" },
  ];

  const safetyFeatures = [
    { name: "5-Star Bharat NCAP Safety Rating", desc: "Top-tier passenger & pedestrian crash protection" },
    { name: "6 Airbags (Front, Side & Curtain)", desc: "Full cabin surround impact mitigation" },
    { name: "Hill-Hold Assist & Hill Descent Control", desc: "Certified for safe Tirumala Up & Down ghat driving" },
    { name: "Electronic Stability Program (ESP) & ABS", desc: "Anti-skid cornering traction control" },
    { name: "ISOFIX Child Seat Mounts", desc: "Secure anchor points for toddler seats" },
    { name: "Reverse Parking Camera & Sensors", desc: "Dynamic guidelines for tight parking spaces" },
  ];

  return (
    <div className="space-y-10">
      {/* 1. Hero Specs Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
            <Award className="h-5 w-5 text-brand-teal" /> Key Vehicle Specifications
          </h3>
          <span className="text-xs font-bold text-muted-foreground">Certified Fleet Data</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-card border border-border hover:border-brand-teal/40 transition-all shadow-sm flex items-start gap-3.5"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-mist flex items-center justify-center text-brand-navy shrink-0">
                  <Icon className="h-5 w-5 text-brand-teal" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm sm:text-base font-black text-brand-navy mt-0.5">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Premium Comfort & Cabin Technology */}
      <div>
        <h3 className="text-xl font-extrabold text-brand-navy flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-brand-gold" /> Comfort & Cabin Features
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {comfortFeatures.map((feat, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                feat.available ? "bg-card border-border" : "bg-muted/30 border-border/40 opacity-60"
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  feat.available ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-navy">{feat.name}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Safety & Ghat Road Certified */}
      <div className="p-6 rounded-3xl bg-brand-navy text-white space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> 100% Ghat Road Certified
            </span>
            <h3 className="text-xl font-extrabold mt-1">Safety & Roadworthiness Package</h3>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            TTD Compliance Cleared
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {safetyFeatures.map((saf, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <h4 className="text-xs sm:text-sm font-bold text-white">{saf.name}</h4>
              </div>
              <p className="text-[11px] text-white/60 pl-6">{saf.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Included with Every Booking */}
      <div className="p-6 rounded-3xl bg-brand-mist/50 border border-border space-y-4">
        <h4 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <HeartHandshake className="h-5 w-5 text-brand-teal" /> What's Included in Your Rental
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {[
            { title: "Zero-Dep Insurance", desc: "Comprehensive coverage with zero accidental hassle" },
            { title: "Active FASTag", desc: "Automatic toll deductions at actual government rates" },
            { title: "24/7 Highway RSA", desc: "Emergency backup car replacement anywhere in AP" },
            { title: "Sanitized & Sealed", desc: "Clean cabin, fresh AC filters, full fluid top-up" },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-card border border-border text-center space-y-1">
              <span className="text-xs font-bold text-brand-teal block">{item.title}</span>
              <span className="text-[10px] text-muted-foreground block">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
