import React, { useState } from "react";
import { Sparkles, Compass, History, Car, ArrowRight } from "lucide-react";
import { CarCard } from "../home/CarCard";

interface SimilarAndRecommendedCarsProps {
  currentCar: any;
  allCars: any[];
  wishlistIds: (number | string)[];
  compareList: any[];
  onToggleWishlist: (carId: number | string) => void;
  onToggleCompare: (car: any) => void;
  onOpen360: (car: any) => void;
  onSelectCar: (car: any) => void;
}

export const SimilarAndRecommendedCars: React.FC<SimilarAndRecommendedCarsProps> = ({
  currentCar,
  allCars,
  wishlistIds,
  compareList,
  onToggleWishlist,
  onToggleCompare,
  onOpen360,
  onSelectCar,
}) => {
  const [activeTab, setActiveTab] = useState<"similar" | "pilgrim" | "trending">("similar");

  // Filter similar cars (same category or price range)
  const similarCars = allCars
    .filter((c) => c.id !== currentCar.id && c.name !== currentCar.name)
    .filter((c) => {
      if (activeTab === "similar") {
        return c.category === currentCar.category || Math.abs((c.pricePerDay || 2000) - (currentCar.pricePerDay || 2000)) <= 1000;
      }
      if (activeTab === "pilgrim") {
        return c.seats === 7 || c.category === "SUV" || c.category === "Luxury";
      }
      return true; // trending
    })
    .slice(0, 3);

  return (
    <section className="space-y-8 pt-12 border-t border-border">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-teal flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Discover More Vehicles
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
            Cars You Might Also <span className="text-brand-teal">Like to Drive</span>
          </h3>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2">
          {[
            { id: "similar", label: "Similar Segment" },
            { id: "pilgrim", label: "Pilgrim Specials" },
            { id: "trending", label: "Trending This Week" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === t.id
                  ? "bg-brand-navy text-white shadow"
                  : "bg-brand-mist/60 text-muted-foreground hover:text-brand-navy border border-border"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarCars.map((car) => (
          <div key={car.id || car.name} onClick={() => onSelectCar(car)} className="cursor-pointer">
            <CarCard
              car={car}
              viewMode="grid"
              isWishlisted={wishlistIds.includes(car.id)}
              isCompared={compareList.some((c) => c.id === car.id)}
              onToggleWishlist={onToggleWishlist}
              onToggleCompare={onToggleCompare}
              onOpen360={onOpen360}
              onBookCar={onSelectCar}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
