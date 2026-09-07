import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  Navigation,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Car,
  Headphones,
  Zap,
  ChevronDown,
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
      setLocationNotice("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setLocationNotice("Detecting nearest rental hub...");

    navigator.geolocation.getCurrentPosition(
      () => {
        setIsLocating(false);
        setPickup("Tirupati Central Hub (Station)");
        setLocationNotice("📍 Detected closest hub: Tirupati Central Hub");
        setTimeout(() => setLocationNotice(""), 4000);
      },
      () => {
        setIsLocating(false);
        setPickup("Tirupati Central Hub (Station)");
        setLocationNotice("📍 Tirupati Central Station Hub selected");
        setTimeout(() => setLocationNotice(""), 4000);
      },
      { timeout: 5000 }
    );
  };

  const handleTriggerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      pickup,
      dropoff,
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
    <div className="w-full relative z-20 space-y-3">
      {/* Service Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setServiceType("self")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            serviceType === "self"
              ? "bg-[#c88d18] text-white shadow-md shadow-[#c88d18]/30"
              : "bg-white/80 hover:bg-white text-slate-700 border border-slate-200"
          }`}
        >
          Self Drive
        </button>
        <button
          type="button"
          onClick={() => setServiceType("chauffeur")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            serviceType === "chauffeur"
              ? "bg-[#c88d18] text-white shadow-md shadow-[#c88d18]/30"
              : "bg-white/80 hover:bg-white text-slate-700 border border-slate-200"
          }`}
        >
          Chauffeur Driven
        </button>
        <button
          type="button"
          onClick={() => setServiceType("airport")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            serviceType === "airport"
              ? "bg-[#c88d18] text-white shadow-md shadow-[#c88d18]/30"
              : "bg-white/80 hover:bg-white text-slate-700 border border-slate-200"
          }`}
        >
          Airport Pickup
        </button>
      </div>

      {/* Floating White Search Widget Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-5 shadow-2xl shadow-slate-900/10 border border-slate-200/90 text-slate-900 backdrop-blur-sm">
        {locationNotice && (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800 border border-amber-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#c88d18]" />
              {locationNotice}
            </span>
          </div>
        )}

        <form
          onSubmit={handleTriggerSearch}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-2 items-center"
        >
          {/* Pickup Location */}
          <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors lg:border-r border-slate-100 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pickup Location
              </span>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="text-[10px] text-[#c88d18] hover:underline flex items-center gap-1 font-semibold"
                title="Detect GPS Location"
              >
                <Navigation className={`h-3 w-3 ${isLocating ? "animate-spin" : ""}`} />
                <span>GPS</span>
              </button>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#c88d18] shrink-0" />
              <select
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-[13px] font-bold text-slate-800 outline-none truncate cursor-pointer"
              >
                {popularLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drop-off Location */}
          <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors lg:border-r border-slate-100 relative group">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Drop-off Location
            </span>
            <div className="mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-[13px] font-bold text-slate-800 outline-none truncate cursor-pointer"
              >
                {popularLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pickup Date */}
          <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors lg:border-r border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Pickup Date
            </span>
            <div className="mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#c88d18] shrink-0" />
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-[13px] font-bold text-slate-800 outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Return Date */}
          <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors lg:border-r border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Return Date
            </span>
            <div className="mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#c88d18] shrink-0" />
              <input
                type="date"
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-[13px] font-bold text-slate-800 outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Car Type */}
          <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors lg:border-r border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Car Type
            </span>
            <div className="mt-1 flex items-center gap-2">
              <Car className="h-4 w-4 text-[#c88d18] shrink-0" />
              <select
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-[13px] font-bold text-slate-800 outline-none truncate cursor-pointer"
              >
                {carTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Action Button */}
          <div className="p-1">
            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c88d18]/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <span>Search Cars</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Trust & Stats Bar directly underneath search widget */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 pb-2">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="h-10 w-10 rounded-full border border-amber-300 bg-amber-50 flex items-center justify-center text-[#c88d18] shrink-0 shadow-sm">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-none">500+</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Cars Available</div>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="h-10 w-10 rounded-full border border-amber-300 bg-amber-50 flex items-center justify-center text-[#c88d18] shrink-0 shadow-sm">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-none">50+</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Cities</div>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="h-10 w-10 rounded-full border border-amber-300 bg-amber-50 flex items-center justify-center text-[#c88d18] shrink-0 shadow-sm">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-none">24/7</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Support</div>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="h-10 w-10 rounded-full border border-amber-300 bg-amber-50 flex items-center justify-center text-[#c88d18] shrink-0 shadow-sm">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-none">Instant</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Booking</div>
          </div>
        </div>
      </div>
    </div>
  );
};
