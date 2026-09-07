import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  Navigation,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Zap,
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
  }) => void;
}

const hubs = [
  { name: "Tirupati Central Hub (Station)", value: "Tirupati Central Hub", distanceKm: 0.5, lat: 13.6288, lng: 79.4192 },
  { name: "Renigunta Airport Hub (T1)", value: "Renigunta Airport Hub", distanceKm: 14.2, lat: 13.6325, lng: 79.5435 },
  { name: "Chandragiri Heritage Point", value: "Chandragiri Heritage Point", distanceKm: 11.8, lat: 13.5833, lng: 79.3167 },
  { name: "Tirumala Hill Gate Hub", value: "Tirumala Hill Gate Hub", distanceKm: 18.5, lat: 13.6788, lng: 79.3492 },
  { name: "Doorstep Delivery (Any Hotel/Address)", value: "Doorstep Delivery", distanceKm: 0, lat: 13.6288, lng: 79.4192 },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const [pickup, setPickup] = useState("Tirupati Central Hub");
  const [dropoff, setDropoff] = useState("Tirupati Central Hub");
  const [sameDropoff, setSameDropoff] = useState(true);
  const [startDate, setStartDate] = useState("2026-09-08");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("2026-09-10");
  const [endTime, setEndTime] = useState("21:00");
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
      (pos) => {
        setIsLocating(false);
        // Find closest hub
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        let closest = hubs[0];
        let minD = 999999;
        hubs.forEach((h) => {
          if (h.value !== "Doorstep Delivery") {
            const d = Math.hypot(h.lat - userLat, h.lng - userLng);
            if (d < minD) {
              minD = d;
              closest = h;
            }
          }
        });

        setPickup(closest.value);
        if (sameDropoff) setDropoff(closest.value);
        setLocationNotice(`📍 Detected! Closest Hub: ${closest.name}`);
      },
      (err) => {
        setIsLocating(false);
        // Fallback simulation for Tirupati
        setPickup("Tirupati Central Hub");
        setLocationNotice("📍 Tirupati Central Station Hub selected (Nearest).");
      },
      { timeout: 6000 }
    );
  };

  const handleTriggerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      pickup,
      dropoff: sameDropoff ? pickup : dropoff,
      startDate,
      startTime,
      endDate,
      endTime,
    });
    document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full rounded-3xl bg-brand-cream/95 backdrop-blur-md p-5 sm:p-7 text-brand-ink shadow-2xl shadow-black/40 border border-amber-900/15 animate-in fade-in duration-300">
      {/* Top Search Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-900/10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-brand-navy px-3 py-1 text-xs font-bold text-white shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-brand-gold" /> Self-Drive Car Rental
          </span>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-brand-ink/80 cursor-pointer">
            <input
              type="checkbox"
              checked={sameDropoff}
              onChange={(e) => setSameDropoff(e.target.checked)}
              className="rounded border-amber-900/20 text-brand-teal focus:ring-0"
            />
            <span>Return to same location</span>
          </label>
        </div>

        {/* Current Location GPS Button */}
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 text-xs font-bold text-brand-teal hover:text-brand-navy bg-brand-teal/10 hover:bg-brand-teal/20 px-3 py-1.5 rounded-full transition-all"
        >
          <Navigation className={`h-3.5 w-3.5 ${isLocating ? "animate-spin" : ""}`} />
          <span>{isLocating ? "Detecting GPS..." : "📍 Use My Current Location"}</span>
        </button>
      </div>

      {locationNotice && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-teal/10 px-3.5 py-2 text-xs font-semibold text-brand-teal animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{locationNotice}</span>
        </div>
      )}

      {/* Main Search Inputs Grid */}
      <form onSubmit={handleTriggerSearch} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:items-end">
        {/* Pickup Hub */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Pick-up Location
          </label>
          <div className="flex h-12 items-center gap-2.5 rounded-xl border border-amber-900/15 bg-white px-3 shadow-sm focus-within:border-brand-teal">
            <MapPin className="h-4 w-4 text-brand-gold shrink-0" />
            <select
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
                if (sameDropoff) setDropoff(e.target.value);
              }}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-brand-navy outline-none"
            >
              {hubs.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dropoff Location (if different) */}
        {!sameDropoff ? (
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Drop-off Location
            </label>
            <div className="flex h-12 items-center gap-2.5 rounded-xl border border-amber-900/15 bg-white px-3 shadow-sm focus-within:border-brand-teal">
              <MapPin className="h-4 w-4 text-brand-teal shrink-0" />
              <select
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-brand-navy outline-none"
              >
                {hubs.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          /* Pickup Date & Time */
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Pick-up Date & Time
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex h-12 items-center gap-2 rounded-xl border border-amber-900/15 bg-white px-2.5 shadow-sm">
                <Calendar className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-brand-navy outline-none"
                />
              </div>
              <div className="flex h-12 items-center gap-1.5 rounded-xl border border-amber-900/15 bg-white px-2 shadow-sm">
                <Clock className="h-3.5 w-3.5 text-brand-teal shrink-0" />
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-brand-navy outline-none"
                >
                  <option value="06:00">06:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                  <option value="21:00">09:00 PM</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Return Date & Time */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Return Date & Time
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex h-12 items-center gap-2 rounded-xl border border-amber-900/15 bg-white px-2.5 shadow-sm">
              <Calendar className="h-3.5 w-3.5 text-brand-gold shrink-0" />
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-brand-navy outline-none"
              />
            </div>
            <div className="flex h-12 items-center gap-1.5 rounded-xl border border-amber-900/15 bg-white px-2 shadow-sm">
              <Clock className="h-3.5 w-3.5 text-brand-teal shrink-0" />
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-brand-navy outline-none"
              >
                <option value="09:00">09:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="18:00">06:00 PM</option>
                <option value="21:00">09:00 PM</option>
                <option value="23:30">11:30 PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Cars Button */}
        <div>
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-brand-navy text-primary-foreground font-black text-xs uppercase tracking-wider hover:bg-brand-navy/90 shadow-xl shadow-brand-navy/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <Search className="h-4 w-4 text-brand-gold" />
            <span>Search Available Fleet</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </form>

      {/* Quick Perks Bar */}
      <div className="mt-5 pt-4 border-t border-amber-900/10 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-ink/75">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" /> ₹0 Hidden Fees · Zero Deposit on Verified KYC
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-amber-600" /> Instant Key Handover at Station & Airport
        </span>
        <span className="flex items-center gap-1.5 font-bold text-brand-teal">
          <Compass className="h-4 w-4" /> 24/7 Tirumala Ghat Road Roadside Assistance
        </span>
      </div>
    </div>
  );
};
