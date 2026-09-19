import React, { useState, useMemo } from "react";
import { ArrowRight, ChevronRight, Heart, User, Gauge, Fuel, Star, Sparkles, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollectionsSectionProps {
  fleet?: any[];
  categories?: any[];
  wishlistIds?: (number | string)[];
  compareList?: any[];
  onToggleWishlist?: (carId: number | string) => void;
  onToggleCompare?: (car: any) => void;
  onOpen360?: (car: any) => void;
  onBookCar?: (car: any) => void;
  onViewDetails?: (car: any) => void;
  onSelectBrand?: (brand: string) => void;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  fleet = [],
  categories = [],
  wishlistIds = [],
  onToggleWishlist,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Dynamic Category Tabs from database + fleet
  const categoryTabs = useMemo(() => {
    const tabs: Array<{ id: string; label: string }> = [{ id: "all", label: "All Vehicles" }];

    if (categories && categories.length > 0) {
      categories
        .filter((c: any) => c.isActive !== false)
        .forEach((c: any) => {
          if (!tabs.some((t) => t.id.toLowerCase() === c.name.toLowerCase())) {
            tabs.push({ id: c.name, label: c.name });
          }
        });
    }

    // Include categories currently assigned to fleet
    fleet.forEach((c) => {
      if (c.category && !tabs.some((t) => t.id.toLowerCase() === c.category.toLowerCase())) {
        tabs.push({ id: c.category, label: c.category });
      }
    });

    return tabs;
  }, [categories, fleet]);

  // Filter cars for collection
  const collectionCars = useMemo(() => {
    if (!fleet || fleet.length === 0) return [];
    if (activeTab === "all") return fleet.slice(0, 6);
    return fleet
      .filter(
        (c) =>
          (c.category && c.category.toLowerCase() === activeTab.toLowerCase()) ||
          (c.subCategory && c.subCategory.toLowerCase().includes(activeTab.toLowerCase())) ||
          (c.tag && c.tag.toLowerCase() === activeTab.toLowerCase())
      )
      .slice(0, 6);
  }, [fleet, activeTab]);

  return (
    <section className="py-6 sm:py-10 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-5 sm:space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#c88d18] block">
              PREMIUM RIDES FOR EVERY JOURNEY
            </span>
            <h2 className="mt-1 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Luxury Collection
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
              From iconic supercars to premium SUVs, find the perfect ride for every occasion.
            </p>
          </div>

          <a
            href="/cars"
            onClick={(e) => {
              if (onViewDetails) {
                // Navigate to cars catalog
              }
            }}
            className="hidden sm:flex text-xs sm:text-sm font-bold text-[#c88d18] hover:text-[#a87410] items-center gap-1.5 self-start sm:self-auto transition-colors group"
          >
            <span>View All Cars</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Category Pills Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {categoryTabs.map((tab) => {
            const isActive = activeTab.toLowerCase() === tab.id.toLowerCase();
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentSlideIndex(0);
                }}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-[#c88d18] text-white shadow-md shadow-[#c88d18]/25 scale-[1.02]"
                    : "bg-slate-100 hover:bg-slate-200/70 text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Car Cards Grid / Carousel List */}
        {collectionCars.length === 0 ? (
          <div className="py-12 px-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No vehicles available in this category currently</p>
            <p className="text-xs text-slate-500">Vehicles added via the Admin portal will appear here immediately.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {collectionCars.map((car, idx) => {
              const isFavorited = wishlistIds.includes(car.id);
              return (
                <div
                  key={car.id || idx}
                  className="group rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
                >
                  {/* Photo Container */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 py-6">
                        <Car className="h-12 w-12 mb-1 text-slate-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Photo Pending</span>
                      </div>
                    )}

                    {/* Top-Left Tag Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md flex items-center gap-1 ${
                          idx === 0
                            ? "bg-[#c88d18]"
                            : idx === 1
                            ? "bg-[#d49b29]"
                            : "bg-[#0b1329]"
                        }`}
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>{car.tag || "Featured"}</span>
                      </span>
                    </div>

                    {/* Top-Right Favorite Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleWishlist) onToggleWishlist(car.id);
                      }}
                      aria-label="Save to Wishlist"
                      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center text-slate-600 hover:text-rose-500 hover:scale-110 transition-all"
                    >
                      <Heart
                        className={`h-4 w-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#c88d18]">
                          {car.brand || "Luxury"}
                        </span>
                        {car.rating && Number(car.rating) > 0 ? (
                          <div className="flex items-center gap-1 text-xs font-black text-slate-800">
                            <Star className="h-3.5 w-3.5 fill-[#c88d18] text-[#c88d18]" />
                            <span>{Number(car.rating).toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">New Fleet</span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-tight group-hover:text-[#c88d18] transition-colors">
                        {car.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {car.detail || "Refined executive engineering with pristine ghat road readiness."}
                      </p>
                    </div>

                    {/* Specs Row */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-[11px] text-slate-600 font-semibold">
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>{car.seats || 5} Seats</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge className="h-3.5 w-3.5 text-slate-400" />
                        <span>{car.transmission || "Auto"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-3.5 w-3.5 text-slate-400" />
                        <span>{car.fuelType || "Diesel"}</span>
                      </div>
                    </div>

                    {/* Bottom Price & View Details Action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-lg sm:text-xl font-black text-slate-900">
                          {car.price || (car.pricePerDay ? `₹${car.pricePerDay.toLocaleString("en-IN")}` : "₹2,499")}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold ml-1">/ day</span>
                      </div>

                      <Button
                        onClick={() => {
                          if (onViewDetails) {
                            onViewDetails(car);
                          } else {
                            window.location.href = `/car/${car.id}`;
                          }
                        }}
                        className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white font-bold text-xs shadow-md shadow-[#c88d18]/25 flex items-center gap-1 transition-transform hover:scale-[1.02]"
                      >
                        <span>View Details</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Carousel Slider Indicator Dots (Mobile) */}
        <div className="flex items-center justify-center gap-2 pt-2 sm:hidden">
          <div className="h-2 w-2 rounded-full bg-[#c88d18]" />
          <div className="h-2 w-2 rounded-full bg-slate-200" />
          <div className="h-2 w-2 rounded-full bg-slate-200" />
        </div>

        {/* Full-width "View All Cars →" Button on Mobile */}
        <div className="pt-2 sm:hidden">
          <a
            href="/cars"
            className="w-full h-11 rounded-xl border border-[#c88d18] text-[#c88d18] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#c88d18] hover:text-white transition-colors"
          >
            <span>View All Cars</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
