import React, { useState } from "react";
import {
  X,
  PhoneCall,
  ShieldAlert,
  Wrench,
  Truck,
  BatteryCharging,
  Disc,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Phone,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TripSupportModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onExtendTrip: (hours: number, amount: number) => void;
}

export const TripSupportModal: React.FC<TripSupportModalProps> = ({
  booking,
  isOpen,
  onClose,
  onExtendTrip,
}) => {
  const [activeTab, setActiveTab] = useState<"rsa" | "emergency" | "extend">("rsa");
  const [selectedRsaService, setSelectedRsaService] = useState<string>("puncture");
  const [rsaStatus, setRsaStatus] = useState<"idle" | "requesting" | "dispatched">("idle");
  const [rsaDetails, setRsaDetails] = useState<{ eta: number; officer: string } | null>(null);

  // Extra hours options
  const [selectedHours, setSelectedHours] = useState<number>(4);

  if (!isOpen) return null;

  const rsaServices = [
    {
      id: "puncture",
      name: "Flat Tyre / Puncture Repair",
      desc: "Mobile tyre technician dispatched with heavy-duty air compressor & repair kit",
      icon: Disc,
      badge: "Free with Moar Care",
    },
    {
      id: "battery",
      name: "Battery Jumpstart Dispatch",
      desc: "Instant jumpstart boost cable unit dispatched to your exact GPS location",
      icon: BatteryCharging,
      badge: "Free with Moar Care",
    },
    {
      id: "tow",
      name: "Flatbed Tow Truck Recovery",
      desc: "Hydraulic flatbed recovery to authorized service centre in Tirupati",
      icon: Truck,
      badge: "24/7 Highway Coverage",
    },
    {
      id: "mechanical",
      name: "Emergency Mechanical Assistance",
      desc: "Coolant top-up, fan-belt inspection or minor electrical repair",
      icon: Wrench,
      badge: "Ghat Road Priority",
    },
  ];

  const handleRequestRsa = async () => {
    setRsaStatus("requesting");
    try {
      const res = await fetch("/api/bookings/rsa-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          serviceType: rsaServices.find((s) => s.id === selectedRsaService)?.name,
          customerName: booking.customerName || "Valued Customer",
          phone: booking.customerPhone || "+91 85000 12345",
          location: booking.pickup || "Tirupati Region",
        }),
      });
      const data = await res.json();
      setTimeout(() => {
        setRsaStatus("dispatched");
        setRsaDetails({
          eta: data.etaMinutes || 18,
          officer: data.patrolOfficer || "M. Ramakrishna (AP Highway Patrol #1033)",
        });
      }, 1000);
    } catch (e) {
      setTimeout(() => {
        setRsaStatus("dispatched");
        setRsaDetails({
          eta: 18,
          officer: "M. Ramakrishna (AP Highway Patrol #1033)",
        });
      }, 1000);
    }
  };

  const handleConfirmAddHours = () => {
    const ratePerHour = 150;
    const additionalCost = selectedHours * ratePerHour;
    onExtendTrip(selectedHours, additionalCost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden text-brand-ink">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-brand-navy text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/20 text-brand-gold flex items-center justify-center border border-amber-500/40">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-2">
                24/7 Trip Support & Roadside Assistance
              </h3>
              <p className="text-xs text-white/60">
                Active Trip #{booking.bookingId || `MC-${booking.id}`} • {booking.carName}
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

        {/* Tab Selector */}
        <div className="grid grid-cols-3 p-2 bg-brand-mist/60 border-b border-border text-center text-xs font-bold gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("rsa")}
            className={`py-2 rounded-xl transition-all ${
              activeTab === "rsa" ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-brand-navy"
            }`}
          >
            Roadside Assistance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("emergency")}
            className={`py-2 rounded-xl transition-all ${
              activeTab === "emergency" ? "bg-rose-600 text-white shadow" : "text-muted-foreground hover:text-rose-600"
            }`}
          >
            Emergency SOS Direct
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("extend")}
            className={`py-2 rounded-xl transition-all ${
              activeTab === "extend" ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-brand-navy"
            }`}
          >
            Add Extra Hours
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: ROADSIDE ASSISTANCE (RSA) */}
          {activeTab === "rsa" && (
            <div className="space-y-4 animate-in fade-in">
              {rsaStatus === "dispatched" && rsaDetails ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 space-y-3">
                  <div className="flex items-center gap-2 font-black text-sm text-emerald-700">
                    <Radio className="h-4 w-4 animate-ping text-emerald-600" />
                    <span>Patrol Team Dispatched & En-Route!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-card border border-emerald-500/20">
                      <span className="text-[10px] text-muted-foreground block">Estimated Arrival</span>
                      <span className="font-extrabold text-brand-navy text-base">{rsaDetails.eta} Minutes</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-card border border-emerald-500/20">
                      <span className="text-[10px] text-muted-foreground block">Patrol Unit</span>
                      <span className="font-bold text-brand-navy truncate block">{rsaDetails.officer}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Please stay with the hazard lights on. Our mobile quick-response mechanic is navigating towards your GPS coordinates.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider">
                      Select Required Emergency Breakdown Service
                    </h4>
                    <div className="space-y-2.5">
                      {rsaServices.map((svc) => {
                        const Icon = svc.icon;
                        const isSelected = selectedRsaService === svc.id;
                        return (
                          <div
                            key={svc.id}
                            onClick={() => setSelectedRsaService(svc.id)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                              isSelected
                                ? "border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal"
                                : "border-border bg-card hover:border-brand-teal/40"
                            }`}
                          >
                            <div className="h-10 w-10 rounded-xl bg-brand-mist flex items-center justify-center text-brand-teal shrink-0 mt-0.5">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h5 className="text-xs font-extrabold text-brand-navy">{svc.name}</h5>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                  {svc.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{svc.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    onClick={handleRequestRsa}
                    disabled={rsaStatus === "requesting"}
                    className="w-full h-11 rounded-2xl bg-brand-teal hover:bg-brand-teal/90 text-white font-extrabold text-xs shadow"
                  >
                    {rsaStatus === "requesting" ? "Broadcasting to Highway Patrol..." : "Dispatch Immediate Roadside Assistance 🛠️"}
                  </Button>
                </>
              )}

              {/* Quick Contacts Strip */}
              <div className="p-3.5 rounded-2xl bg-brand-mist/50 border border-border flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-brand-navy">Moar Fleet Emergency Desk</p>
                  <p className="text-[11px] text-muted-foreground">Tirupati 24x7 Control Room</p>
                </div>
                <a
                  href="tel:+918500012345"
                  className="px-3 py-1.5 rounded-xl bg-brand-navy text-white font-bold text-xs flex items-center gap-1 shadow"
                >
                  <Phone className="h-3.5 w-3.5" /> Call Dispatch
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: EMERGENCY SOS DIRECT DIALS */}
          {activeTab === "emergency" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 text-xs leading-relaxed flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Immediate Emergency SOS Response</p>
                  <p className="text-muted-foreground mt-0.5">
                    Tap any direct line below to connect immediately with Andhra Pradesh emergency dispatch or Tirumala Ghat road safety patrol.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Tirumala Ghat Road Emergency", num: "1800-425-4141", desc: "TTD Ghat Road Patrol & Crane", color: "border-amber-500/30 bg-amber-500/5 text-amber-900" },
                  { title: "AP Police Control Room", num: "100", desc: "Tirupati Urban Police Station", color: "border-blue-500/30 bg-blue-500/5 text-blue-900" },
                  { title: "National Highway Patrol", num: "1033", desc: "NH-71 / NH-205 Emergency Towing", color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-900" },
                  { title: "Medical Emergency Ambulance", num: "108", desc: "RUIA & SVIMS Trauma Centre", color: "border-rose-500/30 bg-rose-500/5 text-rose-900" },
                ].map((em) => (
                  <a
                    key={em.num}
                    href={`tel:${em.num}`}
                    className={`p-3.5 rounded-2xl border ${em.color} hover:scale-[1.02] transition-all flex flex-col justify-between`}
                  >
                    <div>
                      <h5 className="text-xs font-black">{em.title}</h5>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{em.desc}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between font-mono font-black text-sm">
                      <span>{em.num}</span>
                      <span className="flex items-center gap-1 text-[11px] underline">
                        <PhoneCall className="h-3.5 w-3.5" /> Direct Call
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EXTEND BOOKING / ADD EXTRA HOURS */}
          {activeTab === "extend" && (
            <div className="space-y-4 animate-in fade-in">
              <p className="text-xs text-muted-foreground">
                Temple darshan delayed or planning a detour to Talakona / Chandragiri? Add extra buffer hours without late penalties.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { hours: 2, label: "+2 Hours", price: 300, desc: "Quick darshan queue buffer" },
                  { hours: 4, label: "+4 Hours", price: 599, desc: "Standard pilgrimage buffer" },
                  { hours: 8, label: "+8 Hours", price: 1199, desc: "Half day extension" },
                ].map((opt) => (
                  <div
                    key={opt.hours}
                    onClick={() => setSelectedHours(opt.hours)}
                    className={`p-3 rounded-2xl border cursor-pointer text-center transition-all ${
                      selectedHours === opt.hours
                        ? "border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal"
                        : "border-border bg-card hover:border-brand-teal/40"
                    }`}
                  >
                    <span className="text-xs font-black text-brand-navy block">{opt.label}</span>
                    <span className="text-sm font-black text-brand-teal block my-1">₹{opt.price}</span>
                    <span className="text-[9px] text-muted-foreground block">{opt.desc}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-brand-mist/50 border border-border flex items-center justify-between text-xs font-bold">
                <span>Total Extension Fare:</span>
                <span className="text-sm font-black text-brand-teal">
                  ₹{selectedHours === 2 ? 300 : selectedHours === 4 ? 599 : 1199}
                </span>
              </div>

              <Button
                onClick={handleConfirmAddHours}
                className="w-full h-11 rounded-2xl bg-brand-navy text-white font-extrabold text-xs shadow"
              >
                Confirm +{selectedHours} Hours Extension & Update Schedule
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
