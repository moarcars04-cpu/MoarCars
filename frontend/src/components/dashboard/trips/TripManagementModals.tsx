import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTodayDateStr, getFutureDateStr, getMaxBookingDateStr } from "@/lib/dateUtils";
import { useLocations } from "@/hooks/useLocations";

interface ModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedBooking: any) => void;
}

// 1. MODIFY BOOKING MODAL
export const ModifyBookingModal: React.FC<ModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { locations } = useLocations();
  const [pickup, setPickup] = useState(booking.pickup || locations[0] || "Tirupati Central Station Hub");
  const [startDate, setStartDate] = useState(booking.startDate?.split(" ")[0] || getTodayDateStr());
  const [startTime, setStartTime] = useState(booking.startDate?.split(" ")[1] || "09:00");
  const [endDate, setEndDate] = useState(booking.endDate?.split(" ")[0] || getFutureDateStr(2));
  const [endTime, setEndTime] = useState(booking.endDate?.split(" ")[1] || "21:00");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const updatedData = {
      ...booking,
      pickup,
      pickupLocation: pickup,
      startDate: `${startDate} ${startTime}`,
      endDate: `${endDate} ${endTime}`,
    };

    try {
      await fetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
    } catch (e) {
      console.warn("Update booking error:", e);
    } finally {
      setIsSaving(false);
      onSuccess(updatedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-5 text-brand-ink">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-extrabold text-brand-navy">Modify Reservation Details</h3>
          <button onClick={onClose} className="h-7 w-7 rounded-full bg-brand-mist flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-brand-navy">Pickup & Return Station</label>
            <select
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-brand-mist/60 border border-border font-semibold text-brand-navy outline-none cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-brand-navy flex items-center gap-1">
                <Calendar className="h-3 w-3 text-brand-teal" /> Start Schedule
              </label>
              <input
                type="date"
                min={getTodayDateStr()}
                max={getMaxBookingDateStr(2)}
                value={startDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setStartDate(val);
                  if (endDate < val) {
                    setEndDate(val);
                  }
                }}
                className="w-full p-2 rounded-xl bg-brand-mist/60 border border-border font-semibold text-brand-navy outline-none cursor-pointer"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 rounded-xl bg-brand-mist/60 border border-border font-semibold text-brand-navy outline-none cursor-pointer text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-brand-navy flex items-center gap-1">
                <Clock className="h-3 w-3 text-brand-gold" /> Return Schedule
              </label>
              <input
                type="date"
                min={startDate || getTodayDateStr()}
                max={getMaxBookingDateStr(2)}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 rounded-xl bg-brand-mist/60 border border-border font-semibold text-brand-navy outline-none cursor-pointer"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 rounded-xl bg-brand-mist/60 border border-border font-semibold text-brand-navy outline-none cursor-pointer text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-xs">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-brand-teal text-white font-bold text-xs px-5"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// 2. EXTEND BOOKING MODAL
export const ExtendBookingModal: React.FC<ModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedExtension, setSelectedExtension] = useState<"4h" | "1d" | "2d">("1d");
  const [isExtending, setIsExtending] = useState(false);

  if (!isOpen) return null;

  const extensionPlans = [
    { id: "4h", title: "+4 Hours Extension", price: 599, desc: "Grace buffer for late temple darshan" },
    { id: "1d", title: "+1 Extra Day (24h)", price: 2199, desc: "Explore Talakona or Horsley Hills" },
    { id: "2d", title: "+2 Extra Days (48h)", price: 3999, desc: "Complete Andhra Pradesh road trip" },
  ];

  const currentPlan = extensionPlans.find((p) => p.id === selectedExtension)!;

  const handleConfirmExtension = async () => {
    setIsExtending(true);
    const updatedData = {
      ...booking,
      amount: (booking.amount || booking.grandTotal || 2499) + currentPlan.price,
      grandTotal: (booking.grandTotal || booking.amount || 2499) + currentPlan.price,
      notes: `${booking.notes || ""} [Extended by ${currentPlan.title}]`,
    };

    try {
      await fetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
    } catch (e) {
      console.warn("Extend booking error:", e);
    } finally {
      setIsExtending(false);
      onSuccess(updatedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-5 text-brand-ink">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-teal" /> Extend Your Rental Duration
          </h3>
          <button onClick={onClose} className="h-7 w-7 rounded-full bg-brand-mist flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {extensionPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedExtension(plan.id as any)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedExtension === plan.id
                  ? "border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal"
                  : "border-border bg-card hover:border-brand-teal/40"
              }`}
            >
              <div>
                <h4 className="text-xs font-bold text-brand-navy">{plan.title}</h4>
                <p className="text-[11px] text-muted-foreground">{plan.desc}</p>
              </div>
              <span className="text-sm font-black text-brand-teal">₹{plan.price.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-brand-mist/50 border border-border text-xs flex justify-between font-bold">
          <span>Pro-Rata Additional Fare:</span>
          <span className="text-brand-teal">₹{currentPlan.price.toLocaleString("en-IN")}</span>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-xs">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmExtension}
            disabled={isExtending}
            className="rounded-xl bg-brand-teal text-white font-bold text-xs px-5 shadow"
          >
            {isExtending ? "Authorizing Extension..." : `Extend & Pay ₹${currentPlan.price}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

// 3. CANCEL BOOKING MODAL
export const CancelBookingModal: React.FC<ModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState("Change of pilgrimage travel plans");
  const [isCancelling, setIsCancelling] = useState(false);

  if (!isOpen) return null;

  const refundAmount = booking.grandTotal || booking.amount || 2499;

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    const updatedData = {
      ...booking,
      status: "Cancelled",
      paymentStatus: "Refunded",
      notes: `Cancelled by customer: ${reason}`,
    };

    try {
      await fetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
    } catch (e) {
      console.warn("Cancel booking error:", e);
    } finally {
      setIsCancelling(false);
      onSuccess(updatedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-5 text-brand-ink">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-extrabold text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Cancel Reservation
          </h3>
          <button onClick={onClose} className="h-7 w-7 rounded-full bg-brand-mist flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <p className="text-muted-foreground leading-relaxed">
            You are eligible for a <strong>100% Full Refund</strong> (₹{refundAmount.toLocaleString("en-IN")}) as per our 6-hour free cancellation policy.
          </p>

          <div className="space-y-1.5">
            <label className="font-bold text-brand-navy">Reason for Cancellation</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-brand-mist/60 border border-border font-semibold text-brand-navy outline-none"
            >
              <option value="Change of pilgrimage travel plans">Change of pilgrimage travel plans</option>
              <option value="Flight / Train ticket delayed or cancelled">Flight / Train ticket delayed or cancelled</option>
              <option value="Medical / Personal emergency">Medical / Personal emergency</option>
              <option value="Found alternative transport">Found alternative transport</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-bold flex items-center justify-between">
            <span>Refund Payable via Original UPI / Card:</span>
            <span>₹{refundAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-xs">
            Keep Reservation
          </Button>
          <Button
            onClick={handleConfirmCancel}
            disabled={isCancelling}
            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 shadow"
          >
            {isCancelling ? "Processing..." : "Confirm Cancellation"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// 4. UPGRADE CAR MODAL
export const UpgradeCarModal: React.FC<ModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedUpgrade, setSelectedUpgrade] = useState<string>("Innova");
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!isOpen) return null;

  const upgradeOptions = [
    {
      id: "Creta",
      name: "Hyundai Creta SX(O) Turbo",
      category: "SUV 5-Seater",
      diffPrice: 600,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "Innova",
      name: "Toyota Innova Crysta 2.4 ZX",
      category: "Luxury 7-Seater",
      diffPrice: 1500,
      image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "Fortuner",
      name: "Toyota Fortuner Legender 4x4",
      category: "VIP Flagship",
      diffPrice: 3500,
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const chosen = upgradeOptions.find((u) => u.id === selectedUpgrade)!;

  const handleConfirmUpgrade = async () => {
    setIsUpgrading(true);
    const updatedData = {
      ...booking,
      carName: chosen.name,
      amount: (booking.amount || booking.grandTotal || 2499) + chosen.diffPrice,
      grandTotal: (booking.grandTotal || booking.amount || 2499) + chosen.diffPrice,
      notes: `${booking.notes || ""} [Upgraded to ${chosen.name}]`,
    };

    try {
      await fetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
    } catch (e) {
      console.warn("Upgrade booking error:", e);
    } finally {
      setIsUpgrading(false);
      onSuccess(updatedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-5 text-brand-ink">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-gold" /> Upgrade Your Vehicle Class
          </h3>
          <button onClick={onClose} className="h-7 w-7 rounded-full bg-brand-mist flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {upgradeOptions.map((opt) => (
            <div
              key={opt.id}
              onClick={() => setSelectedUpgrade(opt.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                selectedUpgrade === opt.id
                  ? "border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal"
                  : "border-border bg-card hover:border-brand-teal/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={opt.image} alt={opt.name} className="h-12 w-16 rounded-xl object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-brand-navy">{opt.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{opt.category}</p>
                </div>
              </div>
              <span className="text-xs font-black text-brand-teal">+₹{opt.diffPrice}/day</span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-xs">
            Keep Current Car
          </Button>
          <Button
            onClick={handleConfirmUpgrade}
            disabled={isUpgrading}
            className="rounded-xl bg-brand-gold text-brand-navy font-extrabold text-xs px-5 shadow"
          >
            {isUpgrading ? "Upgrading..." : `Upgrade to ${chosen.id} (+₹${chosen.diffPrice})`}
          </Button>
        </div>
      </div>
    </div>
  );
};
