import React from "react";
import { X, Check, Minus, ArrowRight, ShieldCheck, Fuel, Gauge, Users, Zap, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompareModalProps {
  cars: any[];
  onClose: () => void;
  onRemoveFromCompare: (carId: number | string) => void;
  onBookCar: (carName: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  cars,
  onClose,
  onRemoveFromCompare,
  onBookCar,
}) => {
  if (cars.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-amber-500/30 p-6 text-white space-y-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-brand-gold">
              <Scale className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Compare Fleet Vehicles</h3>
              <p className="text-xs text-white/50">Side-by-side specifications, rental tariffs, and safety inclusions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Comparison Table Grid */}
        <div className="flex-1 overflow-x-auto overflow-y-auto pr-1">
          <div className="min-w-[650px] grid grid-cols-4 gap-4 text-xs">
            {/* Column 1: Labels */}
            <div className="space-y-4 pt-44 font-bold text-white/60">
              <div className="h-10 flex items-center border-b border-white/5">Daily Rental Tariff</div>
              <div className="h-10 flex items-center border-b border-white/5">Category & Segment</div>
              <div className="h-10 flex items-center border-b border-white/5">Transmission</div>
              <div className="h-10 flex items-center border-b border-white/5">Fuel / Powertrain</div>
              <div className="h-10 flex items-center border-b border-white/5">Seating Capacity</div>
              <div className="h-10 flex items-center border-b border-white/5">Claimed Mileage / Range</div>
              <div className="h-10 flex items-center border-b border-white/5">Security Deposit (Refundable)</div>
              <div className="h-10 flex items-center border-b border-white/5">GPS Live Telematics</div>
              <div className="h-10 flex items-center border-b border-white/5">Zero-Dep Insurance</div>
              <div className="h-10 flex items-center">Action</div>
            </div>

            {/* Vehicle Columns */}
            {cars.map((car) => (
              <div key={car.id} className="space-y-4 rounded-2xl bg-slate-950/80 border border-white/10 p-4 relative">
                <button
                  type="button"
                  onClick={() => onRemoveFromCompare(car.id)}
                  className="absolute right-3 top-3 p-1 rounded-full bg-slate-800 text-white/60 hover:text-white"
                  title="Remove from comparison"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {/* Car Photo & Title */}
                <div className="h-36 flex flex-col justify-between">
                  <div className="h-24 rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                    <img src={car.image || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"} alt={car.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white truncate">{car.name}</h4>
                    <p className="text-[10px] text-brand-gold font-semibold">{car.variant || car.tag}</p>
                  </div>
                </div>

                {/* Rows */}
                <div className="h-10 flex items-center border-b border-white/5 font-black text-brand-gold text-sm">
                  {car.price || `₹${car.pricePerDay || 1999}/day`}
                </div>

                <div className="h-10 flex items-center border-b border-white/5 font-semibold text-white">
                  {car.category || "Hatchback"}
                </div>

                <div className="h-10 flex items-center border-b border-white/5 text-white/90">
                  {car.transmission || "Automatic"}
                </div>

                <div className="h-10 flex items-center border-b border-white/5 text-white/90">
                  {car.fuelType || "Petrol"}
                </div>

                <div className="h-10 flex items-center border-b border-white/5 text-white/90">
                  {car.seats || 5} Passengers
                </div>

                <div className="h-10 flex items-center border-b border-white/5 text-white/90">
                  {car.mileage || "20 km/l"}
                </div>

                <div className="h-10 flex items-center border-b border-white/5 text-emerald-400 font-bold">
                  ₹{car.securityDeposit || 3000}
                </div>

                <div className="h-10 flex items-center border-b border-white/5 text-white/90">
                  <Check className="h-4 w-4 text-emerald-400 mr-1" /> Yes (Active)
                </div>

                <div className="h-10 flex items-center border-b border-white/5 text-white/90">
                  <Check className="h-4 w-4 text-emerald-400 mr-1" /> Included
                </div>

                <div className="h-10 flex items-center pt-1">
                  <Button
                    onClick={() => {
                      onClose();
                      onBookCar(car.name);
                    }}
                    className="w-full h-9 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft"
                  >
                    Select & Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
