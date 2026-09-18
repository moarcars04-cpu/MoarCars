import React from "react";
import { MapPin, Navigation, Clock, ShieldCheck, ArrowRight, Car, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocations } from "@/hooks/useLocations";

interface PopularHubsSectionProps {
  onSelectHub?: (hubName: string) => void;
}

const DEFAULT_HUB_IMAGES: Record<string, string> = {
  station: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
  airport: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
  alipiri: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=600&q=80",
  temple: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
  highway: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
  chandragiri: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
};

export const PopularHubsSection: React.FC<PopularHubsSectionProps> = ({ onSelectHub }) => {
  const { hubs } = useLocations();

  const displayHubs = hubs.length > 0
    ? hubs.map((h, i) => ({
        id: String(h.id),
        name: h.name,
        location: h.address || `${h.city}, ${h.state}`,
        tag: h.operatingHours || "24/7 Desk",
        carsAvailable: `${h.totalCars || 8}+ Cars`,
        deliveryTime: "Instant Handover",
        image: Object.values(DEFAULT_HUB_IMAGES)[i % Object.values(DEFAULT_HUB_IMAGES).length],
        description: `Dedicated pickup and key dispatch hub in ${h.city}. Managed by ${h.managerName || "Station Manager"} (${h.managerPhone || "+91 94400 11223"}).`,
      }))
    : [
        {
          id: "1",
          name: "Tirupati Central Hub (Station)",
          location: "Railway Station Road, Tirupati",
          tag: "24/7 Desk",
          carsAvailable: "24+ Cars",
          deliveryTime: "Instant (5 min)",
          image: DEFAULT_HUB_IMAGES.station,
          description: "Instant doorstep handover right outside the VIP exit or Station car park.",
        },
        {
          id: "2",
          name: "Renigunta Airport Hub (TIR T1)",
          location: "Terminal 1 Arrivals, Tirupati Airport",
          tag: "Airport Handover",
          carsAvailable: "18+ Cars",
          deliveryTime: "Flight-tracking",
          image: DEFAULT_HUB_IMAGES.airport,
          description: "Flight-tracking handovers with keyless curbside pickup upon landing.",
        },
        {
          id: "3",
          name: "Alipiri Tirumala Gate Hub",
          location: "Bypass Road, Alipiri Gate",
          tag: "Ghat Road Transit",
          carsAvailable: "15+ SUVs",
          deliveryTime: "Instant Handover",
          image: DEFAULT_HUB_IMAGES.alipiri,
          description: "Ghat-certified SUVs equipped with hill-hold and TTD pass clearance readiness.",
        },
      ];

  return (
    <section className="py-6 sm:py-8 bg-card border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-teal flex items-center gap-1.5">
              <Compass className="h-4 w-4" /> Strategic Pickup Points
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              Popular <span className="text-brand-teal">Delivery & Pickup Hubs</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              We deliver sanitized self-drive luxury vehicles directly to airports, stations, and pilgrim transit points across Tirupati with zero waiting time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" /> 100% On-Time Guarantee
            </span>
          </div>
        </div>

        {/* Hub Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayHubs.map((hub) => (
            <div
              key={hub.id}
              className="group relative rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Top Photo */}
              <div className="relative h-44 w-full overflow-hidden bg-brand-navy">
                <img
                  src={hub.image}
                  alt={hub.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-brand-gold text-brand-navy text-[10px] font-black uppercase tracking-wider shadow">
                  {hub.tag}
                </span>

                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-white text-xs font-medium">
                  <Car className="h-3.5 w-3.5 text-brand-gold" /> {hub.carsAvailable}
                </span>

                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-emerald-400 text-xs font-bold bg-black/50 backdrop-blur px-2.5 py-0.5 rounded-full">
                  <Clock className="h-3 w-3" /> {hub.deliveryTime}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-teal transition-colors">
                        {hub.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{hub.location}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    {hub.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-brand-navy/80 flex items-center gap-1">
                    <Navigation className="h-3 w-3 text-brand-teal" /> Free Delivery
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSelectHub?.(hub.name)}
                    className="text-xs font-bold text-brand-teal hover:text-brand-navy hover:bg-brand-teal/10 rounded-xl px-3 py-1.5 h-auto flex items-center gap-1"
                  >
                    Select Hub <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
