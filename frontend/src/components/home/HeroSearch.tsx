import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Search,
  Navigation,
  ArrowRight,
  Car,
  Headphones,
  Zap,
  ChevronDown,
  User,
  Plane,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSearchProps {
  onSearch: (params: {
    pickup: string;
    dropoff: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    category?: string;
    serviceType?: string;
  }) => void;
  showBadges?: boolean;
}

const popularLocations = [
  "Tirupati Central Hub (Station)",
  "Renigunta Airport Hub (T1)",
  "Chandragiri Heritage Point",
  "Tirumala Hill Gate Hub",
  "Bengaluru Airport (BLR)",
  "Hyderabad RGI Airport (HYD)",
  "Chennai Central Hub",
  "Doorstep Delivery (Hotel / Home)",
];

const carTypes = [
  "All Types",
  "Supercars & Luxury",
  "Premium SUVs",
  "Executive Sedans",
  "100% Electric (EV)",
  "Hatchbacks",
];

export const TrustBadgesBar: React.FC = () => {
  return (
    <div className="w-full bg-white border-y border-slate-100/90 py-3.5 sm:py-4 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* 4 Badges with vertical dividers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 flex-1 w-full divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Badge 1 */}
            <div className="flex items-center gap-3.5 justify-center md:justify-start pt-2 md:pt-0">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border-2 border-[#d49b29] bg-amber-50/50 flex items-center justify-center text-[#c88d18] shrink-0 shadow-sm">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-black text-slate-900 leading-none">500+</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">Cars Available</div>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-3.5 justify-center md:justify-start pt-2 md:pt-0 md:pl-6 lg:pl-8">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border-2 border-[#d49b29] bg-amber-50/50 flex items-center justify-center text-[#c88d18] shrink-0 shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-black text-slate-900 leading-none">50+</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">Cities</div>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-3.5 justify-center md:justify-start pt-2 md:pt-0 md:pl-6 lg:pl-8">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border-2 border-[#d49b29] bg-amber-50/50 flex items-center justify-center text-[#c88d18] shrink-0 shadow-sm">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-black text-slate-900 leading-none">24/7</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">Premium Support</div>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="flex items-center gap-3.5 justify-center md:justify-start pt-2 md:pt-0 md:pl-6 lg:pl-8">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border-2 border-[#d49b29] bg-amber-50/50 flex items-center justify-center text-[#c88d18] shrink-0 shadow-sm">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-black text-slate-900 leading-none">Instant</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">Booking</div>
              </div>
            </div>
          </div>

          {/* Right Slogan: YOUR NEXT JOURNEY AWAITS */}
          <div className="hidden xl:flex items-center gap-3 pl-8 border-l border-slate-100 shrink-0">
            <div className="h-0.5 w-10 bg-[#c88d18]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c88d18] whitespace-nowrap">
              YOUR NEXT JOURNEY AWAITS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const [serviceType, setServiceType] = useState<"self" | "chauffeur" | "airport">("self");
  const [pickup, setPickup] = useState("Tirupati Central Hub (Station)");
  const [dropoff, setDropoff] = useState("Tirupati Central Hub (Station)");
  const [startDate, setStartDate] = useState("2026-09-08");
  const [returnDate, setReturnDate] = useState("2026-09-10");
  const [carType, setCarType] = useState("All Types");
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState("");

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice("Geolocation not supported.");
      return;
    }
    setIsLocating(true);
    setLocationNotice("Detecting nearest hub...");

    navigator.geolocation.getCurrentPosition(
      () => {
        setIsLocating(false);
        setPickup("Tirupati Central Hub (Station)");
        setLocationNotice("📍 Tirupati Central Hub selected");
        setTimeout(() => setLocationNotice(""), 3500);
      },
      () => {
        setIsLocating(false);
        setPickup("Tirupati Central Hub (Station)");
        setLocationNotice("📍 Tirupati Central Hub selected");
        setTimeout(() => setLocationNotice(""), 3500);
      },
      { timeout: 5000 }
    );
  };

  const handleTriggerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      pickup: pickup === "City, Airport or Area" ? "Tirupati Central Hub (Station)" : pickup,
      dropoff: dropoff === "City, Airport or Area" ? "Tirupati Central Hub (Station)" : dropoff,
      startDate,
      startTime: "09:00",
      endDate: returnDate,
      endTime: "21:00",
      category: carType === "All Types" ? undefined : carType,
      serviceType,
    });
    document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto relative z-20">
      {/* Service Tabs (3 pills across width on mobile) */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
        <button
          type="button"
          onClick={() => setServiceType("self")}
          className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
            serviceType === "self"
              ? "bg-[#c88d18] text-white shadow-md shadow-[#c88d18]/30"
              : "bg-white/95 hover:bg-white text-slate-700 border border-slate-200/90"
          }`}
        >
          <Car className="h-3.5 w-3.5" />
          <span>Self Drive</span>
        </button>

        <button
          type="button"
          onClick={() => setServiceType("chauffeur")}
          className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
            serviceType === "chauffeur"
              ? "bg-[#c88d18] text-white shadow-md shadow-[#c88d18]/30"
              : "bg-white/95 hover:bg-white text-slate-700 border border-slate-200/90"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Chauffeur</span>
        </button>

        <button
          type="button"
          onClick={() => setServiceType("airport")}
          className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
            serviceType === "airport"
              ? "bg-[#c88d18] text-white shadow-md shadow-[#c88d18]/30"
              : "bg-white/95 hover:bg-white text-slate-700 border border-slate-200/90"
          }`}
        >
          <Plane className="h-3.5 w-3.5" />
          <span>Airport Pickup</span>
        </button>
      </div>

      {/* Centered White Search Widget Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-4 shadow-xl shadow-slate-900/10 border border-slate-200/90 text-slate-900">
        {locationNotice && (
          <div className="mb-2.5 flex items-center justify-between rounded-xl bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#c88d18]" />
              {locationNotice}
            </span>
          </div>
        )}

        <form
          onSubmit={handleTriggerSearch}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-2.5 items-center"
        >
          {/* 1. Pickup Location Box */}
          <div className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-amber-400 transition-colors relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pickup Location
              </span>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="text-[9px] text-[#c88d18] hover:underline flex items-center gap-0.5 font-semibold"
                title="Detect GPS Location"
              >
                <Navigation className={`h-2.5 w-2.5 ${isLocating ? "animate-spin" : ""}`} />
                <span>GPS</span>
              </button>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#c88d18] shrink-0" />
              <select
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none truncate cursor-pointer"
              >
                {popularLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Drop-off Location Box */}
          <div className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-amber-400 transition-colors relative group">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Drop-off Location
            </span>
            <div className="mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none truncate cursor-pointer"
              >
                {popularLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3 & 4. Dates in 2-Column Grid on Mobile */}
          <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-2">
            {/* Pickup Date Box */}
            <div className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-amber-400 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Pickup Date
              </span>
              <div className="mt-1 flex items-center gap-1.5 sm:gap-2">
                <Calendar className="h-4 w-4 text-[#c88d18] shrink-0" />
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-[11px] sm:text-xs font-bold text-slate-800 outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Return Date Box */}
            <div className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-amber-400 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Return Date
              </span>
              <div className="mt-1 flex items-center gap-1.5 sm:gap-2">
                <Calendar className="h-4 w-4 text-[#c88d18] shrink-0" />
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent text-[11px] sm:text-xs font-bold text-slate-800 outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 5. Car Type Box */}
          <div className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-amber-400 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Car Type
            </span>
            <div className="mt-1 flex items-center gap-2">
              <Car className="h-4 w-4 text-[#c88d18] shrink-0" />
              <select
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none truncate cursor-pointer"
              >
                {carTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Action Button */}
          <div className="p-0.5 sm:col-span-2 lg:col-span-1">
            <Button
              type="submit"
              className="h-11 sm:h-12 w-full rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#c88d18]/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <span>Search Cars</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
