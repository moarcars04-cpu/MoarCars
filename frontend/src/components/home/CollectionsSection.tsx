import React, { useState, useMemo } from "react";
import { ArrowRight, ChevronRight, Heart, User, Gauge, Fuel, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollectionsSectionProps {
  fleet?: any[];
  wishlistIds?: (number | string)[];
  compareList?: any[];
  onToggleWishlist?: (carId: number | string) => void;
  onToggleCompare?: (car: any) => void;
  onOpen360?: (car: any) => void;
  onBookCar?: (car: any) => void;
  onViewDetails?: (car: any) => void;
  onSelectBrand?: (brand: string) => void;
}

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "SUV", label: "SUV" },
  { id: "Sedan", label: "Sedan" },
  { id: "Luxury", label: "Luxury" },
];

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  fleet = [],
  wishlistIds = [],
  onToggleWishlist,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Filter cars for luxury collection
  const collectionCars = useMemo(() => {
    if (!fleet || fleet.length === 0) return [];
    if (activeTab === "all") return fleet.slice(0, 6);
    return fleet
      .filter(
        (c) =>
          (c.category && c.category.toLowerCase() === activeTab.toLowerCase()) ||
          (c.subCategory && c.subCategory.toLowerCase().includes(activeTab.toLowerCase()))
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
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {collectionCars.map((car, idx) => {
            const isFavorited = wishlistIds.includes(car.id);
            return (
              <div
                key={car.id || idx}
                className="group rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
              >
                {/* Photo Container */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={car.image || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"}
                    alt={car.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

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
                    {/* Title & SubCategory */}
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#c88d18] transition-colors leading-tight">
                      {car.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">
                      {car.subCategory || car.variant || car.category}
                    </p>

                    {/* 3 Specs Badges */}
                    <div className="flex items-center gap-3 sm:gap-4 mt-3 text-[11px] font-bold text-slate-600">
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>{car.seats || 5}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge className="h-3.5 w-3.5 text-slate-400" />
                        <span>{car.transmission || "Automatic"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-3.5 w-3.5 text-slate-400" />
                        <span>{car.fuelType || "Petrol"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Price & View Details Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-lg sm:text-xl font-black text-slate-900">
                        {car.price || (car.pricePerDay ? `₹${car.pricePerDay.toLocaleString("en-IN")}` : "₹1,699")}
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
