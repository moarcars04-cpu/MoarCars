import React, { useState, useMemo } from "react";
import {
  LayoutGrid,
  List,
  Map as MapIcon,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
  Check,
  X,
  MapPin,
  Car,
  Star,
  Zap,
} from "lucide-react";
import { CarCard } from "./CarCard";
import { Button } from "@/components/ui/button";

interface FleetSearchResultsProps {
  fleet: any[];
  searchPickup: string;
  wishlistIds: (number | string)[];
  compareList: any[];
  onToggleWishlist: (carId: number | string) => void;
  onToggleCompare: (car: any) => void;
  onOpen360: (car: any) => void;
  onBookCar: (car: any) => void;
  onViewDetails?: (car: any) => void;
}

export const FleetSearchResults: React.FC<FleetSearchResultsProps> = ({
  fleet,
  searchPickup,
  wishlistIds,
  compareList,
  onToggleWishlist,
  onToggleCompare,
  onOpen360,
  onBookCar,
  onViewDetails,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [sortBy, setSortBy] = useState<"popularity" | "price_asc" | "price_desc" | "rating" | "distance">("popularity");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedFuel, setSelectedFuel] = useState<string>("all");
  const [selectedTransmission, setSelectedTransmission] = useState<string>("all");
  const [selectedSeats, setSelectedSeats] = useState<number | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [filterSunroof, setFilterSunroof] = useState(false);
  const [filterEV, setFilterEV] = useState(false);
  const [filterInstant, setFilterInstant] = useState(false);
  const [filterDoorstep, setFilterDoorstep] = useState(false);

  const resetFilters = () => {
    setSelectedBrand("all");
    setSelectedFuel("all");
    setSelectedTransmission("all");
    setSelectedSeats("all");
    setMaxPrice(8000);
    setFilterSunroof(false);
    setFilterEV(false);
    setFilterInstant(false);
    setFilterDoorstep(false);
  };

  // Filter logic
  const filteredCars = useMemo(() => {
    return fleet.filter((car) => {
      // Brand
      if (selectedBrand !== "all" && (car.brand || "").toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      // Fuel
      if (selectedFuel !== "all" && (car.fuelType || "").toLowerCase() !== selectedFuel.toLowerCase()) {
        return false;
      }
      // Transmission
      if (selectedTransmission !== "all" && (car.transmission || "").toLowerCase() !== selectedTransmission.toLowerCase()) {
        return false;
      }
      // Seats
      if (selectedSeats !== "all" && Number(car.seats) !== Number(selectedSeats)) {
        return false;
      }
      // Price
      const dailyPrice = car.pricePerDay || 1999;
      if (dailyPrice > maxPrice) {
        return false;
      }
      // EV only
      if (filterEV && (car.fuelType || "").toLowerCase() !== "electric" && (car.category || "").toLowerCase() !== "electric") {
        return false;
      }
      // Sunroof
      if (filterSunroof && !(car.detail || "").toLowerCase().includes("sunroof") && !(car.variant || "").toLowerCase().includes("sunroof")) {
        return false;
      }
      return true;
    });
  }, [fleet, selectedBrand, selectedFuel, selectedTransmission, selectedSeats, maxPrice, filterSunroof, filterEV]);

  // Sort logic
  const sortedCars = useMemo(() => {
    const list = [...filteredCars];
    if (sortBy === "price_asc") {
      list.sort((a, b) => (a.pricePerDay || 1999) - (b.pricePerDay || 1999));
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => (b.pricePerDay || 1999) - (a.pricePerDay || 1999));
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.totalTrips || 0) - (a.totalTrips || 0));
    } else if (sortBy === "distance") {
      list.sort((a, b) => ((a.location || "").includes("Tirupati") ? -1 : 1));
    }
    return list;
  }, [filteredCars, sortBy]);

  const brands = ["All", "Maruti Suzuki", "Honda", "Mahindra", "Toyota", "Hyundai", "Tata", "BMW"];
  const fuels = ["All", "Petrol", "Diesel", "Electric"];

  return (
    <section id="search-results" className="scroll-mt-16 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Search Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-teal">
            <span className="h-2 w-2 rounded-full bg-brand-teal animate-ping" />
            <span>Live Telematics Fleet Availability</span>
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-black text-brand-navy">
            Available Self-Drive Cars in <span className="text-brand-teal">{searchPickup || "Tirupati"}</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Showing {sortedCars.length} vehicles matching your trip parameters with 100% verified insurance.
          </p>
        </div>

        {/* View Switchers & Sorters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter Trigger Button */}
          <Button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            variant="outline"
            className="h-10 rounded-2xl border-border bg-card text-xs font-bold text-brand-navy hover:bg-brand-mist flex items-center gap-1.5"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-brand-teal" />
            <span>Filters</span>
          </Button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3 h-10 text-xs font-bold text-brand-navy shadow-sm">
            <ArrowUpDown className="h-3.5 w-3.5 text-brand-teal shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold outline-none cursor-pointer"
            >
              <option value="popularity">Sort: Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated (4.8+)</option>
              <option value="distance">Nearest to Hub</option>
            </select>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center gap-1 rounded-2xl border border-border bg-card p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === "grid" ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-brand-navy"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === "list" ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-brand-navy"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === "map" ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-brand-navy"
              }`}
              title="Map View"
            >
              <MapIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FILTER DRAWER / FILTER PANEL */}
      {showFilterDrawer && (
        <div className="my-6 rounded-3xl bg-card border border-border p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-brand-navy flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-brand-teal" /> Refine Fleet Selection
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="font-bold text-brand-navy uppercase text-[11px]">Brand Manufacturer</label>
              <div className="flex flex-wrap gap-1.5">
                {brands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBrand(b.toLowerCase())}
                    className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                      selectedBrand === b.toLowerCase()
                        ? "bg-brand-navy text-white border-brand-navy shadow-sm"
                        : "bg-brand-mist/50 border-border text-muted-foreground hover:border-brand-teal"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <label className="font-bold text-brand-navy uppercase text-[11px]">Fuel / Powertrain</label>
              <div className="flex flex-wrap gap-1.5">
                {fuels.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFuel(f.toLowerCase())}
                    className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                      selectedFuel === f.toLowerCase()
                        ? "bg-brand-navy text-white border-brand-navy shadow-sm"
                        : "bg-brand-mist/50 border-border text-muted-foreground hover:border-brand-teal"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Capacity */}
            <div className="space-y-2">
              <label className="font-bold text-brand-navy uppercase text-[11px]">Seating Capacity</label>
              <div className="flex gap-2">
                {[
                  { label: "All", val: "all" },
                  { label: "5 Seats", val: 5 },
                  { label: "7 Seats", val: 7 },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setSelectedSeats(s.val as any)}
                    className={`flex-1 py-1.5 rounded-xl font-semibold border text-center transition-all ${
                      selectedSeats === s.val
                        ? "bg-brand-navy text-white border-brand-navy"
                        : "bg-brand-mist/50 border-border text-muted-foreground hover:border-brand-teal"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-bold text-brand-navy uppercase text-[11px]">Max Daily Rate</label>
                <span className="font-black text-brand-teal">₹{maxPrice.toLocaleString("en-IN")}/day</span>
              </div>
              <input
                type="range"
                min={1500}
                max={10000}
                step={250}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-teal cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>₹1,500</span>
                <span>₹10,000+</span>
              </div>
            </div>
          </div>

          {/* Quick Feature Checkboxes */}
          <div className="pt-3 border-t border-border flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-brand-navy">
              <input
                type="checkbox"
                checked={filterSunroof}
                onChange={(e) => setFilterSunroof(e.target.checked)}
                className="rounded text-brand-teal focus:ring-0"
              />
              <span>Panoramic Sunroof</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-brand-navy">
              <input
                type="checkbox"
                checked={filterEV}
                onChange={(e) => setFilterEV(e.target.checked)}
                className="rounded text-brand-teal focus:ring-0"
              />
              <span>100% Electric EV</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-brand-navy">
              <input
                type="checkbox"
                checked={filterInstant}
                onChange={(e) => setFilterInstant(e.target.checked)}
                className="rounded text-brand-teal focus:ring-0"
              />
              <span>Instant Keyless Booking</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-brand-navy">
              <input
                type="checkbox"
                checked={filterDoorstep}
                onChange={(e) => setFilterDoorstep(e.target.checked)}
                className="rounded text-brand-teal focus:ring-0"
              />
              <span>Doorstep Delivery Option</span>
            </label>
          </div>
        </div>
      )}

      {/* RESULTS DISPLAY CONTAINER */}
      <div className="mt-8">
        {/* VIEW 1 & 2: GRID / LIST */}
        {(viewMode === "grid" || viewMode === "list") && (
          <div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            }`}
          >
            {sortedCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                viewMode={viewMode}
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
        )}

        {/* VIEW 3: INTERACTIVE MAP SIMULATION */}
        {viewMode === "map" && (
          <div className="rounded-3xl border border-border bg-brand-navy p-6 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-brand-gold" /> Tirupati & Renigunta Live Telematics Hubs
                </h3>
                <p className="text-xs text-white/60">Live GPS tracking and nearest hub dispatch network</p>
              </div>
              <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-bold">
                GPS Active on All 50+ Cars
              </span>
            </div>

            {/* Map Graphic Canvas */}
            <div className="relative h-96 rounded-2xl bg-[#0a1124] border border-white/10 overflow-hidden flex items-center justify-center p-6">
              {/* Animated Map Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />

              {/* Hub Marker 1: Tirupati Station */}
              <div className="absolute top-1/4 left-1/3 p-3 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-xl text-center cursor-pointer hover:scale-110 transition-transform">
                <span className="flex h-3 w-3 mx-auto rounded-full bg-brand-gold animate-ping mb-1" />
                <p className="text-xs font-bold text-brand-gold">Tirupati Central Hub</p>
                <p className="text-[10px] text-white/70">18 Cars Ready · 0.5 km</p>
              </div>

              {/* Hub Marker 2: Renigunta Airport */}
              <div className="absolute top-1/3 right-1/4 p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-xl text-center cursor-pointer hover:scale-110 transition-transform">
                <span className="flex h-3 w-3 mx-auto rounded-full bg-emerald-400 animate-ping mb-1" />
                <p className="text-xs font-bold text-emerald-400">Renigunta Airport (T1)</p>
                <p className="text-[10px] text-white/70">12 Cars Ready · 14 km</p>
              </div>

              {/* Hub Marker 3: Chandragiri */}
              <div className="absolute bottom-1/4 left-1/4 p-3 rounded-2xl bg-slate-900/90 border border-sky-500/40 shadow-xl text-center cursor-pointer hover:scale-110 transition-transform">
                <span className="flex h-3 w-3 mx-auto rounded-full bg-sky-400 animate-ping mb-1" />
                <p className="text-xs font-bold text-sky-400">Chandragiri Heritage Point</p>
                <p className="text-[10px] text-white/70">8 Cars Ready · 11 km</p>
              </div>

              {/* Hub Marker 4: Tirumala Hill Gate */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 p-3 rounded-2xl bg-slate-900/90 border border-purple-500/40 shadow-xl text-center cursor-pointer hover:scale-110 transition-transform">
                <span className="flex h-3 w-3 mx-auto rounded-full bg-purple-400 animate-ping mb-1" />
                <p className="text-xs font-bold text-purple-300">Tirumala Ghat Gate</p>
                <p className="text-[10px] text-white/70">Express Checkpoint Hub</p>
              </div>
            </div>

            {/* Quick Map List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {sortedCars.slice(0, 3).map((car) => (
                <div key={car.id} className="p-4 rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{car.name}</p>
                    <p className="text-[10px] text-brand-gold">{car.location} · {car.price}</p>
                  </div>
                  <Button
                    onClick={() => onBookCar(car)}
                    className="h-8 px-3 rounded-xl bg-brand-gold text-brand-navy font-bold text-[11px]"
                  >
                    Book
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {sortedCars.length === 0 && (
          <div className="rounded-3xl border border-border bg-card p-12 text-center space-y-4">
            <Car className="h-12 w-12 mx-auto text-muted-foreground" />
            <h4 className="text-lg font-bold text-brand-navy">No Vehicles Match Your Current Filters</h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Try adjusting your price slider or relaxing the fuel and transmission filters to view all available cars.
            </p>
            <Button onClick={resetFilters} className="h-10 px-6 rounded-2xl bg-brand-teal text-white font-bold text-xs">
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
