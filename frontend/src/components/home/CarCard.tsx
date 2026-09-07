import React from "react";
import {
  Heart,
  Rotate3d,
  Users,
  Fuel,
  Gauge,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Check,
  Plus,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarCardProps {
  car: any;
  viewMode?: "grid" | "list";
  isWishlisted: boolean;
  isCompared: boolean;
  onToggleWishlist: (carId: number | string) => void;
  onToggleCompare: (car: any) => void;
  onOpen360: (car: any) => void;
  onBookCar: (car: any) => void;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  viewMode = "grid",
  isWishlisted,
  isCompared,
  onToggleWishlist,
  onToggleCompare,
  onOpen360,
  onBookCar,
}) => {
  const isList = viewMode === "list";

  return (
    <article
      className={`group rounded-3xl border border-border bg-card shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl overflow-hidden flex ${
        isList ? "flex-col md:flex-row" : "flex-col"
      } justify-between`}
    >
      {/* Photo Container */}
      <div className={`relative ${isList ? "w-full md:w-80 h-56 md:h-auto" : "h-60"} overflow-hidden bg-brand-navy shrink-0`}>
        <img
          src={car.image || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"}
          alt={car.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />

        {/* Category Tag */}
        <span className="absolute left-4 top-4 rounded-full bg-brand-gold px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-brand-navy shadow-md">
          {car.tag || car.category}
        </span>

        {/* Top Right Controls: 360 view + Wishlist */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {/* 360 degree trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen360(car);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/90 backdrop-blur-md hover:bg-brand-gold hover:text-brand-navy transition-colors"
            title="360° Studio View"
          >
            <Rotate3d className="h-4 w-4" />
          </button>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(car.id);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${
              isWishlisted
                ? "bg-rose-500 text-white shadow-lg scale-110"
                : "bg-black/60 text-white/80 hover:bg-black/80 hover:text-rose-400"
            }`}
            title={isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Location & Rating at bottom of image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90 drop-shadow">
          <span className="flex items-center gap-1 font-semibold text-[11px]">
            <MapPin className="h-3.5 w-3.5 text-brand-gold" /> {car.location || "Tirupati"}
          </span>
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full font-bold text-amber-300 text-[11px]">
            <Star className="h-3 w-3 fill-current" /> 4.9 ({car.totalTrips || 35}+ trips)
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-brand-navy group-hover:text-brand-teal transition-colors">
                {car.name}
              </h3>
              <p className="text-[11px] font-bold text-brand-teal">{car.variant || "Executive Spec"}</p>
            </div>

            {/* Compare Checkbox */}
            <label className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground cursor-pointer hover:text-brand-navy select-none">
              <input
                type="checkbox"
                checked={isCompared}
                onChange={() => onToggleCompare(car)}
                className="rounded border-border text-brand-teal focus:ring-0"
              />
              <span>Compare</span>
            </label>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {car.detail}
          </p>

          {/* Specs Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3 text-[11px] font-semibold text-muted-foreground">
            <span className="flex items-center gap-1 bg-brand-mist/70 px-2.5 py-1 rounded-lg">
              <Users className="h-3.5 w-3.5 text-brand-teal" /> {car.seats || 5} Seats
            </span>
            <span className="flex items-center gap-1 bg-brand-mist/70 px-2.5 py-1 rounded-lg">
              <Fuel className="h-3.5 w-3.5 text-brand-teal" /> {car.fuelType || "Petrol"}
            </span>
            <span className="flex items-center gap-1 bg-brand-mist/70 px-2.5 py-1 rounded-lg">
              <Gauge className="h-3.5 w-3.5 text-brand-teal" /> {car.transmission || "Automatic"}
            </span>
            {car.mileage && (
              <span className="flex items-center gap-1 bg-brand-mist/70 px-2.5 py-1 rounded-lg text-emerald-700 font-bold">
                ⚡ {car.mileage}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tariff Starting</p>
            <p className="text-xl font-black text-brand-teal">
              {car.price || (car.pricePerDay ? `₹${car.pricePerDay.toLocaleString("en-IN")}` : "₹1,999")}
              <span className="text-xs font-normal text-muted-foreground"> / day</span>
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <ShieldCheck className="h-3 w-3" /> Dep: ₹{car.securityDeposit || 3000} (100% Refundable)
            </p>
          </div>

          <Button
            onClick={() => onBookCar(car)}
            className="h-10 px-5 rounded-2xl bg-brand-teal text-primary-foreground font-black text-xs uppercase hover:bg-brand-teal/90 shadow-lg shadow-teal-900/10 flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            Book Now <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
};
