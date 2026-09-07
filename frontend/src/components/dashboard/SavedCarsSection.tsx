import React from "react";
import { Heart, Car, ArrowRight, MapPin, Gauge, Fuel, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedCarsSectionProps {
  savedCars: any[];
  onRemoveSavedCar: (carId: number | string) => void;
  onBookCar: (carName: string) => void;
  onBrowseFleet: () => void;
}

export const SavedCarsSection: React.FC<SavedCarsSectionProps> = ({
  savedCars,
  onRemoveSavedCar,
  onBookCar,
  onBrowseFleet,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Your Saved Fleet Vehicles</h3>
          <p className="text-xs text-white/60">
            Bookmarked cars for your upcoming pilgrimage and leisure trips around Tirupati.
          </p>
        </div>

        <Button
          onClick={onBrowseFleet}
          className="h-9 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs hover:bg-brand-gold-soft flex items-center gap-1.5"
        >
          <Car className="h-3.5 w-3.5" /> Explore All Cars
        </Button>
      </div>

      {savedCars.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 border border-white/10 text-brand-gold">
            <Heart className="h-8 w-8 text-rose-400" />
          </div>
          <h4 className="text-lg font-bold text-white">No Saved Cars Yet</h4>
          <p className="text-xs text-white/60 max-w-sm mx-auto">
            Click the heart icon on any vehicle card in the fleet collection to save it for quick booking anytime.
          </p>
          <Button
            onClick={onBrowseFleet}
            className="h-10 px-6 rounded-xl bg-brand-gold text-brand-navy font-extrabold text-xs uppercase tracking-wide hover:bg-brand-gold-soft"
          >
            Browse Fleet Cars <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCars.map((car) => (
            <div
              key={car.id}
              className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden shadow-lg hover:border-brand-gold/40 transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-950">
                <img
                  src={car.image || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"}
                  alt={car.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-brand-gold px-2.5 py-0.5 text-[10px] font-bold text-brand-navy uppercase">
                  {car.category || "Hatchback"}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveSavedCar(car.id)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{car.name}</h4>
                  <p className="text-xs text-white/60 line-clamp-2 mt-1">{car.detail}</p>

                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 text-[11px] text-white/70">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-brand-gold" /> {car.seats || 5} Seats
                    </span>
                    <span className="flex items-center gap-1">
                      <Fuel className="h-3.5 w-3.5 text-brand-gold" /> {car.fuelType || "Petrol"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Gauge className="h-3.5 w-3.5 text-brand-gold" /> {car.transmission || "Manual"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/40">Daily Rate</p>
                    <p className="text-base font-black text-brand-gold">{car.price || "₹1,699/day"}</p>
                  </div>
                  <Button
                    onClick={() => onBookCar(car.name)}
                    className="h-9 px-4 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft"
                  >
                    Book Now <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
