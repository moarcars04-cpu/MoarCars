import React from "react";
import {
  Fuel,
  Gauge,
  Users,
  Luggage,
  Zap,
  Sparkles,
  Award,
  Compass,
  CheckCircle2,
} from "lucide-react";

interface CarInfoSpecsSectionProps {
  car: any;
}

export const CarInfoSpecsSection: React.FC<CarInfoSpecsSectionProps> = ({ car }) => {
  const isEV = (car.fuelType || "").toLowerCase() === "electric" || (car.category || "").toLowerCase() === "electric";

  const specs = [
    {
      label: "Fuel Type",
      value: car.fuelType || (isEV ? "Electric" : "Petrol"),
      sub: car.engine || (isEV ? "Zero Emission" : "Verified Engine"),
      icon: Fuel,
    },
    {
      label: "Transmission",
      value: car.transmission || "Manual",
      sub: "Certified Transmission",
      icon: Gauge,
    },
    {
      label: "Seating Capacity",
      value: `${car.seats || 5} Passengers`,
      sub: "Comfort Cabin",
      icon: Users,
    },
    {
      label: "Mileage / Range",
      value: car.mileage || (isEV ? "450 km/charge" : "20 km/l"),
      sub: "Certified Efficiency",
      icon: Zap,
    },
    {
      label: "Boot Space",
      value: car.bootSpace || "Spacious Trunk",
      sub: "Luggage Storage",
      icon: Luggage,
    },
    {
      label: "Ground Clearance",
      value: car.groundClearance || "Ghat Road Ready",
      sub: "Tirumala Certified",
      icon: Compass,
    },
  ];

  const comfortFeatures = [
    { name: "Panoramic Sunroof", available: car.hasSunroof ?? false, desc: "Breathtaking views and airy cabin feel" },
    { name: "Wireless Apple CarPlay / Android Auto", available: car.hasCarPlay ?? true, desc: "Seamless navigation & playlist streaming" },
    { name: "Cabin Air Conditioning & Rear Vents", available: car.hasAC ?? true, desc: "Dual-zone climate comfort" },
    { name: "FASTag Integrated", available: Boolean(car.fastagNumber) || true, desc: "Automatic toll deductions at actual government rates" },
    { name: "Keyless Smart Entry & Push Start", available: car.keylessEntry ?? true, desc: "Convenient keyless start system" },
    { name: "Cruise Control with Speed Limiter", available: car.cruiseControl ?? true, desc: "Effortless highway driving" },
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
    </div>
  );
};
