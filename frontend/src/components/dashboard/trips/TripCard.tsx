import React, { useState } from "react";
import {
  CalendarDays,
  MapPin,
  Car,
  Clock,
  CheckCircle2,
  FileText,
  Phone,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Navigation,
  Key,
  Lock,
  Download,
  Share2,
  TrendingUp,
  MessageSquare,
  Edit,
  Trash2,
  Star,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingTimelineStepper } from "./BookingTimelineStepper";

interface TripCardProps {
  booking: any;
  onOpenLiveTracking: (booking: any) => void;
  onOpenModify: (booking: any) => void;
  onOpenExtend: (booking: any) => void;
  onOpenCancel: (booking: any) => void;
  onOpenUpgrade: (booking: any) => void;
  onOpenInvoice: (booking: any) => void;
  onOpenAgreement?: (booking: any) => void;
  onOpenPickupInspection?: (booking: any) => void;
  onOpenTripSupport?: (booking: any) => void;
  onOpenReturnInspection?: (booking: any) => void;
  onBookAgain?: (carName: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  booking,
  onOpenLiveTracking,
  onOpenModify,
  onOpenExtend,
  onOpenCancel,
  onOpenUpgrade,
  onOpenInvoice,
  onOpenAgreement,
  onOpenPickupInspection,
  onOpenTripSupport,
  onOpenReturnInspection,
  onBookAgain,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockFeedback, setUnlockFeedback] = useState("");

  const status = booking.status || "Confirmed";
  const isOngoing = status === "Ongoing" || status === "In Progress";
  const isUpcoming = status === "Confirmed" || status === "Upcoming";
  const isCompleted = status === "Completed";
  const isCancelled = status === "Cancelled";
  const isRefunded = booking.isRefunded || isCompleted || isCancelled;

  const handleToggleDigitalKey = () => {
    if (!isUnlocked) {
      setIsUnlocked(true);
      setUnlockFeedback("🔓 Doors Unlocked Digitally via BLE & Cloud");
      setTimeout(() => setUnlockFeedback(""), 3000);
    } else {
      setIsUnlocked(false);
      setUnlockFeedback("🔒 Doors Locked Securely");
      setTimeout(() => setUnlockFeedback(""), 3000);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-md hover:shadow-xl transition-all space-y-5 text-brand-ink">
      {/* Top Bar: Status Badge, Booking ID & Price */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              isOngoing
                ? "bg-emerald-500 text-white animate-pulse"
                : isUpcoming
                ? "bg-brand-gold text-brand-navy"
                : isCompleted
                ? "bg-brand-navy text-white"
                : "bg-rose-500/10 text-rose-600 border border-rose-500/30"
            }`}
          >
            {status}
          </span>

          <span className="font-mono text-xs font-bold text-muted-foreground">
            #{booking.bookingId || `MC-2026-${booking.id || "8812"}`}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              {isCancelled ? "Refunded Amount" : "Total Amount"}
            </span>
            <span className="text-lg font-black text-brand-teal">
              ₹{(booking.grandTotal || booking.amount || 2499).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Vehicle & Itinerary Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Car Photo & Specs */}
        <div className="md:col-span-4 flex items-center gap-3.5">
          <img
            src={
              booking.car?.image ||
              "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80"
            }
            alt={booking.carName}
            className="h-20 w-28 rounded-2xl object-cover border border-border bg-brand-navy shrink-0"
          />
          <div>
            <h4 className="text-base font-black text-brand-navy">{booking.carName || "Toyota Innova Crysta"}</h4>
            <p className="text-xs text-muted-foreground">{booking.bookingType || "Self Drive (Unlimited KM)"}</p>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">
              ✓ Verified & Ghat Ready
            </span>
          </div>
        </div>

        {/* Itinerary Timeline */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-brand-mist/50 border border-border text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <MapPin className="h-3 w-3 text-brand-teal" /> Pickup Station
            </span>
            <p className="font-bold text-brand-navy">{booking.pickup || "Tirupati Central Station"}</p>
            <p className="text-[11px] text-brand-teal font-semibold">{booking.startDate || "2026-09-08 09:00"}</p>
          </div>

          <div className="space-y-0.5 sm:border-l sm:border-border sm:pl-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Clock className="h-3 w-3 text-brand-gold" /> Return Schedule
            </span>
            <p className="font-bold text-brand-navy">{booking.dropLocation || booking.pickup || "Tirupati Hub"}</p>
            <p className="text-[11px] text-brand-gold font-semibold">{booking.endDate || "2026-09-10 21:00"}</p>
          </div>
        </div>
      </div>

      {/* 9-Step Lifecycle Progression Bar */}
      <BookingTimelineStepper
        currentStepIndex={booking.timelineStep || (isOngoing ? 6 : isCompleted ? 9 : 3)}
        status={status}
        isRefunded={isRefunded}
      />

      {/* Dynamic Action Buttons per Trip Type */}
      <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-3">
        {/* Left Sub-Action Indicators */}
        <div className="flex items-center gap-2">
          {unlockFeedback && (
            <span className="text-xs font-bold text-emerald-600 animate-in fade-in">
              {unlockFeedback}
            </span>
          )}

          {isRefunded && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5" /> Deposit Refund Settled (₹{booking.securityDeposit || 3000})
            </span>
          )}
        </div>

        {/* Right CTA Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ongoing Trip Actions */}
          {isOngoing && (
            <>
              <Button
                size="sm"
                onClick={handleToggleDigitalKey}
                className={`rounded-xl text-xs font-bold flex items-center gap-1.5 shadow ${
                  isUnlocked ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {isUnlocked ? <Lock className="h-3.5 w-3.5" /> : <Key className="h-3.5 w-3.5" />}
                {isUnlocked ? "Lock Doors" : "Unlock Car (Keyless)"}
              </Button>

              <Button
                size="sm"
                onClick={() => onOpenLiveTracking(booking)}
                className="rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Navigation className="h-3.5 w-3.5 animate-pulse" /> Live Tracking
              </Button>

              {onOpenTripSupport && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenTripSupport(booking)}
                  className="rounded-xl border-amber-500/40 bg-amber-500/10 text-brand-gold hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Phone className="h-3.5 w-3.5" /> 24/7 Support & RSA
                </Button>
              )}

              {onOpenReturnInspection && (
                <Button
                  size="sm"
                  onClick={() => onOpenReturnInspection(booking)}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow"
                >
                  <FileText className="h-3.5 w-3.5" /> Return & Inspection
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenExtend(booking)}
                className="rounded-xl border-border text-xs font-bold text-brand-navy flex items-center gap-1"
              >
                <Clock className="h-3.5 w-3.5" /> Extend Trip
              </Button>
            </>
          )}

          {/* Upcoming Trip Actions */}
          {isUpcoming && (
            <>
              {onOpenPickupInspection && (
                <Button
                  size="sm"
                  onClick={() => onOpenPickupInspection(booking)}
                  className="rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-extrabold flex items-center gap-1.5 shadow"
                >
                  <Camera className="h-3.5 w-3.5 text-brand-gold" /> Pickup & Handover
                </Button>
              )}

              <Button
                size="sm"
                onClick={() => onOpenLiveTracking(booking)}
                className="rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Navigation className="h-3.5 w-3.5" /> Track Driver Handover
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenModify(booking)}
                className="rounded-xl border-border text-xs font-bold text-brand-navy flex items-center gap-1"
              >
                <Edit className="h-3.5 w-3.5" /> Modify
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenUpgrade(booking)}
                className="rounded-xl border-amber-500/30 text-xs font-bold text-brand-gold hover:bg-amber-500/10 flex items-center gap-1"
              >
                <TrendingUp className="h-3.5 w-3.5" /> Upgrade Car
              </Button>

              {onOpenAgreement && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenAgreement(booking)}
                  className="rounded-xl border-border text-xs font-bold text-brand-navy flex items-center gap-1"
                >
                  <FileText className="h-3.5 w-3.5" /> Agreement
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onOpenCancel(booking)}
                className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
              >
                Cancel
              </Button>
            </>
          )}

          {/* Completed Trip Actions */}
          {isCompleted && (
            <>
              {onOpenReturnInspection && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenReturnInspection(booking)}
                  className="rounded-xl border-emerald-500/30 text-xs font-bold text-emerald-700 hover:bg-emerald-500/10 flex items-center gap-1 shadow-sm"
                >
                  <FileText className="h-3.5 w-3.5 text-emerald-600" /> Inspection Report
                </Button>
              )}

              {onOpenAgreement && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenAgreement(booking)}
                  className="rounded-xl border-border text-xs font-bold text-brand-navy flex items-center gap-1"
                >
                  <FileText className="h-3.5 w-3.5" /> Agreement
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenInvoice(booking)}
                className="rounded-xl border-border text-xs font-bold text-brand-navy flex items-center gap-1.5 shadow-sm"
              >
                <Receipt className="h-3.5 w-3.5 text-brand-teal" /> Tax Invoice & Receipt
              </Button>

              <Button
                size="sm"
                onClick={() => onBookAgain?.(booking.carName)}
                className="rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-gold" /> Book Again
              </Button>
            </>
          )}

          {/* Cancelled Trip Actions */}
          {isCancelled && (
            <Button
              size="sm"
              onClick={() => onBookAgain?.(booking.carName)}
              className="rounded-xl bg-brand-navy text-white text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Re-Book Fleet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
