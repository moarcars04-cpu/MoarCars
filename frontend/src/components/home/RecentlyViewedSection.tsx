import React from "react";
import { History, Sparkles, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarCard } from "./CarCard";

interface RecentlyViewedSectionProps {
  recentlyViewedCars: any[];
  wishlistIds: (number | string)[];
  compareList: any[];
  onToggleWishlist: (carId: number | string) => void;
  onToggleCompare: (car: any) => void;
  onOpen360: (car: any) => void;
  onBookCar: (car: any) => void;
  onViewDetails?: (car: any) => void;
  onClearHistory: () => void;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  recentlyViewedCars,
  wishlistIds,
  compareList,
  onToggleWishlist,
  onToggleCompare,
  onOpen360,
  onBookCar,
  onViewDetails,
  onClearHistory,
}) => {
  if (!recentlyViewedCars || recentlyViewedCars.length === 0) {
    return null;
  }

  return (
    <section className="py-5 sm:py-6 bg-card border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-brand-navy">
                Recently <span className="text-brand-teal">Viewed Vehicles</span>
              </h3>
              <p className="text-xs text-muted-foreground">Continue where you left off</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="text-xs text-muted-foreground hover:text-rose-500 flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear History
          </Button>
        </div>

        {/* Cars Grid / Tray */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentlyViewedCars.slice(0, 4).map((car) => (
            <CarCard
              key={car.id}
              car={car}
              viewMode="grid"
              isWishlisted={wishlistIds.includes(car.id)}
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
