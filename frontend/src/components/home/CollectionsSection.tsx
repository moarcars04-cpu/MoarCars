import React, { useState } from "react";
import { Sparkles, Crown, Mountain, Zap, Car, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarCard } from "./CarCard";

interface CollectionsSectionProps {
  fleet: any[];
  wishlistIds: (number | string)[];
  compareList: any[];
  onToggleWishlist: (carId: number | string) => void;
  onToggleCompare: (car: any) => void;
  onOpen360: (car: any) => void;
  onBookCar: (car: any) => void;
  onViewDetails?: (car: any) => void;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  fleet,
  wishlistIds,
  compareList,
  onToggleWishlist,
  onToggleCompare,
  onOpen360,
  onBookCar,
  onViewDetails,
}) => {
  const [activeCollection, setActiveCollection] = useState<"featured" | "luxury" | "suv" | "electric" | "budget">("featured");

  const collectionTabs = [
    { id: "featured", label: "Featured Fleet", icon: Sparkles, badge: "Popular" },
    { id: "luxury", label: "Luxury & VIP", icon: Crown, badge: "Premium" },
    { id: "suv", label: "SUV 4x4 Ghat Fleet", icon: Mountain, badge: "Terrain" },
    { id: "electric", label: "100% Electric (EV)", icon: Zap, badge: "Green" },
    { id: "budget", label: "Budget Everyday", icon: Car, badge: "Best Value" },
  ];

  const filteredCollection = fleet.filter((car) => {
    const cat = (car.category || "").toLowerCase();
    const tag = (car.tag || "").toLowerCase();
    const fuel = (car.fuelType || "").toLowerCase();
    const name = (car.name || "").toLowerCase();

    if (activeCollection === "featured") return true;
    if (activeCollection === "luxury") return cat === "luxury" || tag === "luxury" || name.includes("bmw") || name.includes("innova");
    if (activeCollection === "suv") return cat === "suv" || name.includes("scorpio") || name.includes("creta");
    if (activeCollection === "electric") return fuel === "electric" || cat === "electric" || name.includes("ev");
    if (activeCollection === "budget") return cat === "hatchback" || name.includes("swift") || name.includes("baleno");
    return true;
  });

  return (
    <section className="py-20 bg-brand-mist/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-teal flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Curated Fleet Categories
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              Explore Our Signature <span className="text-brand-teal">Vehicle Collections</span>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground max-w-xl">
              From pilgrimage comfort in executive captain seats to high-clearance 4x4 SUVs for Tirumala hills.
            </p>
          </div>

          <a
            href="#search-results"
            className="text-xs font-bold text-brand-navy hover:text-brand-teal flex items-center gap-1"
          >
            Browse All Fleet <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Collection Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {collectionTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCollection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCollection(tab.id as any)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? "bg-brand-navy text-white shadow-md scale-105"
                    : "bg-card border border-border text-muted-foreground hover:border-brand-teal hover:text-brand-teal"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-brand-gold" : "text-brand-teal"}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? "bg-brand-gold text-brand-navy" : "bg-brand-mist text-muted-foreground"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredCollection.slice(0, 6).map((car) => (
            <CarCard
              key={car.id}
              car={car}
              viewMode="grid"
              isWishlisted={wishlistIds.includes(car.id) || wishlistIds.includes(Number(car.id))}
              isCompared={compareList.some((c) => c.id === car.id)}
              onToggleWishlist={onToggleWishlist}
              onToggleCompare={onToggleCompare}
              onOpen360={onOpen360}
              onBookCar={onBookCar}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
