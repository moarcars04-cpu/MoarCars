import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  Share2,
  X,
  ShieldCheck,
  Zap,
  Clock,
  Car,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DriverChatModal } from "./DriverChatModal";

interface LiveTrackingModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [shareNotice, setShareNotice] = useState(false);

  if (!isOpen) return null;

  const driverName = booking.driverName || "K. Srinivasulu Reddy";
  const driverPhone = booking.driverPhone || "+91 85000 12345";
  const carName = booking.carName || "Toyota Innova Crysta";
  const regNumber = booking.registrationNumber || "AP 03 TX 1024";

  const handleShareTrip = () => {
    const shareText = encodeURIComponent(
      `Track my Moar Cars trip (#${booking.bookingId || booking.id}) for ${carName} in Tirupati: https://moarcars.com/my-trips`
    );
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://moarcars.com/my-trips?track=${booking.id}`);
      setShareNotice(true);
      setTimeout(() => setShareNotice(false), 2500);
    }
    window.open(`https://wa.me/?text=${shareText}`, "_blank");
  };

  const handleOpenGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=Tirupati+Railway+Station`,
      "_blank"
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
        <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-brand-navy border border-white/10 shadow-2xl flex flex-col overflow-hidden text-white">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-teal/20 text-brand-teal flex items-center justify-center border border-brand-teal/40">
                <Navigation className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  Live Dispatch & Driver Tracking
                  <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                </h3>
                <p className="text-xs text-white/60">
                  {carName} • Reg: {regNumber}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Simulated Telematics Map Canvas */}
          <div className="relative h-64 sm:h-72 w-full bg-[#070b14] border-b border-white/10 overflow-hidden flex items-center justify-center p-4">
            {/* Grid Mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

            {/* Simulated Route Arc Line */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none">
              <path
                d="M 120 180 Q 250 80 420 120"
                fill="none"
                stroke="#0d9488"
                strokeWidth="4"
                strokeDasharray="6 6"
                className="animate-pulse"
              />
            </svg>

            {/* Destination Hub Marker */}
            <div className="absolute top-16 right-16 p-2.5 rounded-2xl bg-slate-900/90 border border-brand-gold shadow-xl text-center">
              <span className="flex h-2.5 w-2.5 mx-auto rounded-full bg-brand-gold mb-1" />
              <p className="text-[10px] font-bold text-brand-gold">Pickup Destination</p>
              <p className="text-[9px] text-white/70">{booking.pickup || "Tirupati Station"}</p>
            </div>

            {/* Driver Live Marker with Pulse */}
            <div className="absolute bottom-12 left-16 p-3 rounded-2xl bg-brand-teal/90 text-white shadow-2xl text-center animate-bounce">
              <Car className="h-4 w-4 mx-auto mb-0.5" />
              <p className="text-[10px] font-black">Driver En-Route</p>
              <p className="text-[9px] text-white/90">Speed: 38 km/h</p>
            </div>

            {/* Floating ETA Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur border border-white/20 text-xs font-bold text-white shadow-lg">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Arriving in 11 Mins</span>
              <span className="text-white/50">• 3.4 km</span>
            </div>
          </div>

          {/* Driver Profile & Telemetry Strip */}
          <div className="p-5 space-y-5 bg-card text-brand-navy">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-brand-mist/50 border border-border">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-full bg-brand-teal/20 border-2 border-brand-teal text-brand-navy flex items-center justify-center font-black text-base shadow">
                  {driverName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-brand-navy flex items-center gap-1.5">
                    {driverName}
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      ★ 4.9 (420+ Trips)
                    </span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Moar Cars Senior Handover Executive
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${driverPhone}`}
                  className="px-3.5 py-2 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" /> Call Driver
                </a>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsChatOpen(true)}
                  className="rounded-xl border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Chat
                </Button>
              </div>
            </div>

            {/* Live Telemetry Info */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-brand-mist/40 border border-border">
                <span className="text-[10px] text-muted-foreground block">Fuel Status</span>
                <span className="font-bold text-brand-navy text-sm">85% Full</span>
              </div>
              <div className="p-2.5 rounded-xl bg-brand-mist/40 border border-border">
                <span className="text-[10px] text-muted-foreground block">Ghat Pass</span>
                <span className="font-bold text-emerald-600 text-sm">Active & Certified</span>
              </div>
              <div className="p-2.5 rounded-xl bg-brand-mist/40 border border-border">
                <span className="text-[10px] text-muted-foreground block">Odometer</span>
                <span className="font-bold text-brand-navy text-sm">18,450 km</span>
              </div>
            </div>

            {/* Map Links & Share */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenGoogleMaps}
                className="text-xs font-bold text-brand-teal hover:text-brand-navy p-0 flex items-center gap-1.5"
              >
                <Compass className="h-4 w-4" /> Open in Google Maps
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleShareTrip}
                className="rounded-xl border-border text-xs font-bold text-brand-navy flex items-center gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{shareNotice ? "Link Copied!" : "Share Live Trip"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Driver Chat */}
      <DriverChatModal
        driverName={driverName}
        driverPhone={driverPhone}
        carName={carName}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};
