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
  const [pickup, setPickup] = useState(booking.pickup || "Tirupati Central Station Hub");
  const [startDate, setStartDate] = useState(booking.startDate?.split(" ")[0] || "2026-09-08");
  const [endDate, setEndDate] = useState(booking.endDate?.split(" ")[0] || "2026-09-10");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSuccess({
        ...booking,
        pickup,
        startDate: `${startDate} 09:00`,
        endDate: `${endDate} 21:00`,
      });
      onClose();
    }, 800);
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
              className="w-full p-2.5 rounded-xl bg-brand-mist/60 border border-border font-semibold text-brand-navy outline-none"
            >
              <option value="Tirupati Central Station Hub">Tirupati Central Station Hub</option>
              <option value="Renigunta Airport Hub (TIR T1)">Renigunta Airport Hub (TIR T1)</option>
              <option value="Alipiri Tirumala Checkpost">Alipiri Tirumala Checkpost</option>
              <option value="Chandragiri Heritage Point">Chandragiri Heritage Point</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-brand-navy">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-brand-mist/60 border border-border font-semibold text-brand-navy outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-brand-navy">Return Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-brand-mist/60 border border-border font-semibold text-brand-navy outline-none"
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

  const handleConfirmExtension = () => {
    setIsExtending(true);
    setTimeout(() => {
      setIsExtending(false);
      onSuccess({
        ...booking,
        grandTotal: (booking.grandTotal || 2499) + currentPlan.price,
        notes: `${booking.notes || ""} [Extended by ${currentPlan.title}]`,
      });
      onClose();
    }, 800);
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

  const refundAmount = booking.grandTotal || 2499;

  const handleConfirmCancel = () => {
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      onSuccess({
        ...booking,
        status: "Cancelled",
        notes: `Cancelled by customer: ${reason}`,
      });
      onClose();
    }, 800);
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
      name: "Hyundai Creta SX(O) Sunroof",
      category: "SUV 5-Seater",
      diffPrice: 600,
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "Innova",
      name: "Toyota Innova Crysta ZX Captain Seats",
      category: "Luxury 7-Seater",
      diffPrice: 1500,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "BMW",
      name: "BMW 3 Series Gran Limousine",
      category: "VIP Executive",
      diffPrice: 4200,
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const chosen = upgradeOptions.find((u) => u.id === selectedUpgrade)!;

  const handleConfirmUpgrade = () => {
    setIsUpgrading(true);
    setTimeout(() => {
      setIsUpgrading(false);
      onSuccess({
        ...booking,
        carName: chosen.name,
        grandTotal: (booking.grandTotal || 2499) + chosen.diffPrice,
        notes: `${booking.notes || ""} [Upgraded to ${chosen.name}]`,
      });
      onClose();
    }, 800);
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
