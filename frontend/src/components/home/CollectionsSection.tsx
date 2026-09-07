import React from "react";
import { ArrowRight, ChevronRight } from "lucide-react";

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

interface LuxuryBrand {
  name: string;
  tagline: string;
  image: string;
  category: string;
  startingPrice: string;
}

const LUXURY_BRANDS: LuxuryBrand[] = [
  {
    name: "Lamborghini",
    tagline: "Unleash the Extraordinary",
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
    category: "Supercar",
    startingPrice: "₹24,999/day",
  },
  {
    name: "BMW",
    tagline: "Performance Redefined",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    category: "Luxury SUV / Sedan",
    startingPrice: "₹6,999/day",
  },
  {
    name: "Mercedes-Benz",
    tagline: "Elegance in Motion",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    category: "Executive Luxury",
    startingPrice: "₹7,499/day",
  },
  {
    name: "Audi",
    tagline: "Progress You Can Feel",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
    category: "Sportback & Sedan",
    startingPrice: "₹5,999/day",
  },
  {
    name: "Porsche",
    tagline: "Built for Real Emotions",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
    category: "Sports Coupe",
    startingPrice: "₹18,999/day",
  },
  {
    name: "Range Rover",
    tagline: "Go Beyond Limits",
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80",
    category: "All-Terrain Luxury",
    startingPrice: "₹11,999/day",
  },
];

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  fleet,
  onBookCar,
  onViewDetails,
  onSelectBrand,
}) => {
  const handleCardClick = (brand: LuxuryBrand) => {
    if (onSelectBrand) {
      onSelectBrand(brand.name);
    } else {
      // Find matching car in fleet or scroll to search
      const matched = fleet?.find((c) =>
        c.name.toLowerCase().includes(brand.name.toLowerCase()) ||
        (c.brand && c.brand.toLowerCase().includes(brand.name.toLowerCase()))
      );
      if (matched && onViewDetails) {
        onViewDetails(matched);
      } else {
        document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c88d18] block">
              PREMIUM RIDES FOR EVERY JOURNEY
            </span>
            <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Luxury Collection
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
              From iconic supercars to premium SUVs, find the perfect ride for every occasion.
            </p>
          </div>

          <a
            href="#search-results"
            className="text-xs sm:text-sm font-bold text-[#c88d18] hover:text-[#a87410] flex items-center gap-1.5 self-start sm:self-auto transition-colors group"
          >
            <span>View All Cars</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* 6 Luxury Brand Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
          {LUXURY_BRANDS.map((brand) => (
            <div
              key={brand.name}
              onClick={() => handleCardClick(brand)}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
            >
              {/* Car Image Preview */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 relative flex items-center justify-center p-2">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover rounded-lg transform group-hover:scale-108 transition-transform duration-500"
                />
              </div>

              {/* Brand Title & Subtitle */}
              <div className="mt-3.5 flex items-end justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#c88d18] transition-colors leading-tight">
                    {brand.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {brand.tagline}
                  </p>
                </div>

                {/* Circular Arrow Action Button */}
                <div className="h-7 w-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-[#c88d18] group-hover:bg-[#c88d18] group-hover:text-white transition-all shrink-0">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
