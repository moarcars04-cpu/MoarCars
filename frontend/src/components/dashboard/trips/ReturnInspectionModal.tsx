import React, { useState } from "react";
import {
  X,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Fuel,
  Gauge,
  AlertCircle,
  Sparkles,
  Receipt,
  FileCheck2,
  Download,
  AlertTriangle,
  RotateCcw,
  CircleDollarSign,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReturnInspectionModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedBooking: any) => void;
}

const DEFAULT_RETURN_PHOTOS = [
  { id: "front", label: "Front Bumper & Windshield", url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=400&q=80" },
  { id: "rear", label: "Rear Bumper & Boot Lid", url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80" },
  { id: "left", label: "Left Body & Tyres", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80" },
  { id: "right", label: "Right Body & Tyres", url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80" },
  { id: "odo_fuel", label: "Final Odometer & Fuel Cluster", url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=400&q=80" },
  { id: "interior", label: "Interior Seats & Floor Mats", url: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80" },
];

export const ReturnInspectionModal: React.FC<ReturnInspectionModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Photos & Telematics, 2: Damage & Cleaning, 3: Settlement & Refund
  const startOdo = booking.startOdometer || 18450;
  const startFuel = booking.startFuel || 100;
  const deposit = booking.securityDeposit || 3000;

  // Return Telematics
  const [returnOdometer, setReturnOdometer] = useState<number>(startOdo + 240);
  const [returnFuel, setReturnFuel] = useState<number>(startFuel);
  const [damageStatus, setDamageStatus] = useState<"none" | "minor" | "major">("none");
  const [damageNotes, setDamageNotes] = useState<string>("");
  const [cleaningStatus, setCleaningStatus] = useState<"clean" | "deep_mud">("clean");
  const [lateHours, setLateHours] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [settlementResult, setSettlementResult] = useState<any>(null);

  if (!isOpen) return null;

  // Penalty Calculations
  const distanceDriven = Math.max(0, returnOdometer - startOdo);
  const fuelDeficit = Math.max(0, startFuel - returnFuel);
  const fuelPenalty = fuelDeficit > 0 ? fuelDeficit * 12 : 0; // ₹12 per 1% deficit
  const cleaningFee = cleaningStatus === "deep_mud" ? 400 : 0;
  const lateReturnFee = lateHours * 200;
  const damageFee = damageStatus === "minor" ? 0 : damageStatus === "major" ? 1500 : 0; // Zero-dep covers minor scratches!
  const totalPenalties = fuelPenalty + cleaningFee + lateReturnFee + damageFee;
  const refundAmount = Math.max(0, deposit - totalPenalties);

  const handleCompleteReturn = async () => {
    setIsSubmitting(true);
    const refundTxnId = `REF_UPI_2026_${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      await fetch("/api/bookings/return-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: booking.id,
          bookingId: booking.id,
          returnOdometer,
          returnFuel,
          returnPhotos: DEFAULT_RETURN_PHOTOS.map((p) => p.url),
          damageImages: damageStatus !== "none" ? [DEFAULT_RETURN_PHOTOS[0].url] : [],
          damageNotes: damageNotes || (damageStatus === "none" ? "All panels pristine and clean" : "Minor scratch reported"),
          cleaningFee,
          lateReturnFee,
          fuelPenalty,
          securityDeposit: deposit,
        }),
      });
    } catch (e) {}

    const resultData = {
      ...booking,
      status: "Completed",
      timelineStep: 9,
      returnOdometer,
      returnFuel,
      cleaningFee,
      lateReturnFee,
      fuelPenalty,
      penalties: totalPenalties,
      refundAmount,
      refundStatus: "Settled",
      refundTxnId,
      isRefunded: true,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSettlementResult(resultData);
      setStep(3);
      onSuccess(resultData);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden text-brand-ink">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-brand-navy text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <FileCheck2 className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-2">
                Vehicle Return Check-In & Settlement Inspection
              </h3>
              <p className="text-xs text-white/60">
                Booking #{booking.bookingId || `MC-${booking.id}`} • {booking.carName}
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

        {/* Step Tabs */}
        <div className="grid grid-cols-3 p-2.5 bg-brand-mist/50 border-b border-border text-center text-xs font-bold gap-2">
          <div
            onClick={() => setStep(1)}
            className={`py-1.5 rounded-xl cursor-pointer transition-all ${
              step === 1 ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-brand-navy"
            }`}
          >
            1. Return Photos & Odo
          </div>
          <div
            onClick={() => setStep(2)}
            className={`py-1.5 rounded-xl cursor-pointer transition-all ${
              step === 2 ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-brand-navy"
            }`}
          >
            2. Damage & Cleaning
          </div>
          <div
            className={`py-1.5 rounded-xl transition-all ${
              step === 3 ? "bg-emerald-600 text-white shadow" : "text-muted-foreground"
            }`}
          >
            3. Deposit Refund Receipt
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: RETURN PHOTOS & TELEMATICS */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-brand-mist/50 border border-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-navy flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="h-4 w-4 text-brand-teal" /> Return Odometer (KM)
                    </span>
                    <span className="text-xs font-mono font-bold text-brand-teal">
                      +{distanceDriven} km driven
                    </span>
                  </label>
                  <input
                    type="number"
                    value={returnOdometer}
                    min={startOdo}
                    onChange={(e) => setReturnOdometer(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-card border border-border font-mono font-bold text-brand-navy outline-none"
                  />
                  <span className="text-[10px] text-muted-foreground">Pickup Start Odometer: {startOdo} KM</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-navy flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Fuel className="h-4 w-4 text-amber-500" /> Return Fuel Level
                    </span>
                    <span className="text-brand-teal font-extrabold">{returnFuel}%</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={returnFuel}
                    onChange={(e) => setReturnFuel(Number(e.target.value))}
                    className="w-full accent-brand-teal mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Pickup Level: {startFuel}%</span>
                    {fuelDeficit > 0 ? (
                      <span className="text-amber-600 font-bold">Deficit: -{fuelDeficit}% (₹{fuelPenalty})</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">✓ Fuel Match / Extra</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 6 Return Inspection Photos */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-brand-gold" /> 6-Angle Check-Out Photos
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DEFAULT_RETURN_PHOTOS.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className="h-24 w-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="p-2 text-center bg-card border-t border-border">
                        <span className="text-[10px] font-bold text-brand-navy block truncate">{item.label}</span>
                        <span className="text-[9px] text-emerald-600 font-semibold flex items-center justify-center gap-0.5 mt-0.5">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Checked & Clear
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setStep(2)}
                  className="rounded-xl bg-brand-navy text-white font-bold text-xs px-6 h-10 shadow"
                >
                  Proceed to Damage & Penalty Audit <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: DAMAGE & CLEANING ASSESSMENT */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              {/* Damage Selector */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider">
                  Visual Damage Assessment
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "none", title: "No Damages", desc: "Pristine condition", fee: 0, badge: "₹0 Deductible" },
                    { id: "minor", title: "Minor Scratch / Scuff", desc: "Covered by Zero-Dep", fee: 0, badge: "100% Insurance Covered" },
                    { id: "major", title: "Dent / Glass Crack", desc: "Major body impact", fee: 1500, badge: "Claim Deductible" },
                  ].map((dmg) => (
                    <div
                      key={dmg.id}
                      onClick={() => setDamageStatus(dmg.id as any)}
                      className={`p-3 rounded-2xl border cursor-pointer text-center transition-all ${
                        damageStatus === dmg.id
                          ? "border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal"
                          : "border-border bg-card hover:border-brand-teal/40"
                      }`}
                    >
                      <h5 className="text-xs font-extrabold text-brand-navy">{dmg.title}</h5>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 inline-block my-1">
                        {dmg.badge}
                      </span>
                      <p className="text-[10px] text-muted-foreground">{dmg.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cleaning Assessment */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider">
                  Cabin Hygiene & Cleanliness
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setCleaningStatus("clean")}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      cleaningStatus === "clean"
                        ? "border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal"
                        : "border-border bg-card"
                    }`}
                  >
                    <h5 className="text-xs font-extrabold text-brand-navy">Standard Clean / Normal Dust</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Complimentary express wash & vacuum</p>
                    <span className="text-xs font-black text-emerald-600 block mt-1">₹0 Fee</span>
                  </div>

                  <div
                    onClick={() => setCleaningStatus("deep_mud")}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      cleaningStatus === "deep_mud"
                        ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500"
                        : "border-border bg-card"
                    }`}
                  >
                    <h5 className="text-xs font-extrabold text-brand-navy">Heavy Mud / Food Spill Detailing</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Requires deep steam shampoo extraction</p>
                    <span className="text-xs font-black text-amber-600 block mt-1">+₹400 Detailing Fee</span>
                  </div>
                </div>
              </div>

              {/* Late Hours */}
              <div className="p-3.5 rounded-2xl bg-brand-mist/50 border border-border flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-brand-navy">Overdue / Late Return Hours</h5>
                  <p className="text-[10px] text-muted-foreground">Grace buffer of 30 minutes is waived</p>
                </div>
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setLateHours(h)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        lateHours === h
                          ? "bg-brand-navy text-white shadow"
                          : "bg-card border border-border text-muted-foreground"
                      }`}
                    >
                      {h === 0 ? "On Time (0h)" : `+${h}h`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Penalty Live Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs shadow-lg">
                <div className="flex justify-between text-white/70">
                  <span>Initial Security Deposit Held:</span>
                  <span className="font-bold text-white">₹{deposit.toLocaleString("en-IN")}</span>
                </div>
                {fuelPenalty > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Fuel Deficit Surcharge ({fuelDeficit}%):</span>
                    <span>-₹{fuelPenalty}</span>
                  </div>
                )}
                {cleaningFee > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Deep Cleaning Detailing Fee:</span>
                    <span>-₹{cleaningFee}</span>
                  </div>
                )}
                {lateReturnFee > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Late Return Fee (+{lateHours}h):</span>
                    <span>-₹{lateReturnFee}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm text-emerald-400 pt-2 border-t border-white/10">
                  <span>Net Refund Payable to UPI:</span>
                  <span>₹{refundAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl text-xs">
                  Back
                </Button>
                <Button
                  onClick={handleCompleteReturn}
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 h-10 shadow"
                >
                  {isSubmitting ? "Settling Inspection & Refund..." : `Confirm Return & Refund ₹${refundAmount} 💳`}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: REFUND SETTLEMENT CERTIFICATE & INVOICE */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-base font-extrabold text-brand-navy">
                  Vehicle Return Completed & Certified!
                </h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Inspection verified at Tirupati Hub. Your refundable security deposit has been initiated via UPI Instant Settlement.
                </p>

                <div className="p-3.5 rounded-2xl bg-card border border-emerald-500/30 max-w-sm mx-auto text-left text-xs space-y-1">
                  <div className="flex justify-between font-bold text-brand-navy">
                    <span>Refund Amount:</span>
                    <span className="text-emerald-600 text-sm font-black">₹{refundAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Transaction ID:</span>
                    <span className="font-mono">{settlementResult?.refundTxnId || "REF_UPI_2026_88912"}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Settlement SLA:</span>
                    <span className="text-emerald-700 font-bold">Within 2 Hours (Instant Payout)</span>
                  </div>
                </div>
              </div>

              {/* Trip Reconciliation Metrics */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-brand-mist/50 border border-border text-center text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase">Distance Driven</span>
                  <span className="font-bold text-brand-navy">{distanceDriven} KM</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase">Fuel Retained</span>
                  <span className="font-bold text-brand-teal">{returnFuel}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase">Deductible Penalty</span>
                  <span className="font-bold text-emerald-600">₹{totalPenalties}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => window.print()}
                  className="flex-1 h-11 rounded-2xl bg-brand-navy text-white font-extrabold text-xs shadow flex items-center justify-center gap-1.5"
                >
                  <Download className="h-4 w-4" /> Download Final Inspection Report (PDF)
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="h-11 px-6 rounded-2xl border-border text-brand-navy font-bold text-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
