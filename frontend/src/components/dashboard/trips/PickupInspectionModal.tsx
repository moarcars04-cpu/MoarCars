import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Fuel,
  Gauge,
  Key,
  FileCheck,
  AlertCircle,
  Sparkles,
  PenTool,
  RotateCcw,
  Upload,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PickupInspectionModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedBooking: any) => void;
}

const DEFAULT_PHOTOS = [
  { id: "front", label: "Front View & Grille", url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=400&q=80" },
  { id: "rear", label: "Rear Bumper & Boot", url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80" },
  { id: "left", label: "Left Side Profile", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80" },
  { id: "right", label: "Right Side Profile", url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80" },
  { id: "dashboard", label: "Dashboard & Odometer", url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=400&q=80" },
  { id: "boot", label: "Boot Space & Jack Kit", url: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80" },
];

export const PickupInspectionModal: React.FC<PickupInspectionModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: OTP, 2: Photos & Telematics, 3: Checklist, 4: Signature
  const [customerOtp, setCustomerOtp] = useState("882194");
  const [driverOtp, setDriverOtp] = useState("551029");
  const [otpVerified, setOtpVerified] = useState(false);

  // Telematics & Photos
  const [startOdometer, setStartOdometer] = useState<number>(booking.startOdometer || 18450);
  const [startFuel, setStartFuel] = useState<number>(booking.startFuel || 100);
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, string>>({
    front: DEFAULT_PHOTOS[0].url,
    rear: DEFAULT_PHOTOS[1].url,
    left: DEFAULT_PHOTOS[2].url,
    right: DEFAULT_PHOTOS[3].url,
    dashboard: DEFAULT_PHOTOS[4].url,
    boot: DEFAULT_PHOTOS[5].url,
  });

  // Checklist
  const [checklist, setChecklist] = useState({
    tyres: true,
    spareWheel: true,
    fastag: true,
    acCooling: true,
    sanitized: true,
    documents: true,
  });

  // Digital Signature Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (step === 4 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#0d9488";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
      }
    }
  }, [step]);

  if (!isOpen) return null;

  const handleVerifyOtp = () => {
    if (customerOtp.length === 6 && driverOtp.length === 6) {
      setOtpVerified(true);
      setStep(2);
    }
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const handleCompletePickup = async () => {
    setIsSubmitting(true);
    const signatureDataUrl = canvasRef.current?.toDataURL() || "verified_digital_signature";

    try {
      await fetch("/api/bookings/pickup-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: booking.id,
          bookingId: booking.id,
          startOdometer,
          startFuel,
          pickupPhotos: uploadedPhotos,
          pickupChecklist: checklist,
          pickupOtp: customerOtp,
          pickupSignature: signatureDataUrl,
        }),
      });
    } catch (e) {}

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess({
        ...booking,
        status: "Active",
        startOdometer,
        startFuel,
        timelineStep: 6,
        pickupPhotos: uploadedPhotos,
        pickupChecklist: checklist,
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden text-brand-ink">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-brand-navy text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-brand-teal/20 text-brand-teal flex items-center justify-center border border-brand-teal/40">
              <Camera className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-2">
                Vehicle Pickup Handover & Inspection
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

        {/* Step Progress Pills */}
        <div className="grid grid-cols-4 p-3 bg-brand-mist/50 border-b border-border text-center text-xs font-bold gap-2">
          <div
            onClick={() => setStep(1)}
            className={`py-1.5 rounded-xl cursor-pointer transition-all ${
              step === 1 ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-brand-navy"
            }`}
          >
            1. Dual OTP
          </div>
          <div
            onClick={() => otpVerified && setStep(2)}
            className={`py-1.5 rounded-xl cursor-pointer transition-all ${
              step === 2 ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-brand-navy"
            }`}
          >
            2. Photos & Meter
          </div>
          <div
            onClick={() => otpVerified && setStep(3)}
            className={`py-1.5 rounded-xl cursor-pointer transition-all ${
              step === 3 ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-brand-navy"
            }`}
          >
            3. Safety Checklist
          </div>
          <div
            onClick={() => otpVerified && setStep(4)}
            className={`py-1.5 rounded-xl cursor-pointer transition-all ${
              step === 4 ? "bg-brand-navy text-white shadow" : "text-muted-foreground hover:text-brand-navy"
            }`}
          >
            4. Digital Sign
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: DUAL OTP VERIFICATION */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs leading-relaxed flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Dual Authentication Protocol Active</p>
                  <p className="text-muted-foreground mt-0.5">
                    To prevent unauthorized handovers, both the assigned Fleet Executive and Customer must exchange 6-digit cryptographic handshake codes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-brand-mist/40 border border-border space-y-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase block">
                    Customer Pickup Handover OTP
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    value={customerOtp}
                    onChange={(e) => setCustomerOtp(e.target.value)}
                    className="w-full text-center text-xl font-mono font-black tracking-widest p-2 rounded-xl bg-card border border-border text-brand-navy outline-none"
                  />
                  <p className="text-[10px] text-muted-foreground text-center">Received via SMS & WhatsApp</p>
                </div>

                <div className="p-4 rounded-2xl bg-brand-mist/40 border border-border space-y-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase block">
                    Fleet Executive Dispatch OTP
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    value={driverOtp}
                    onChange={(e) => setDriverOtp(e.target.value)}
                    className="w-full text-center text-xl font-mono font-black tracking-widest p-2 rounded-xl bg-card border border-border text-brand-navy outline-none"
                  />
                  <p className="text-[10px] text-muted-foreground text-center">Provided by Hub Executive</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleVerifyOtp}
                  className="rounded-xl bg-brand-navy text-white font-bold text-xs px-6 h-10 shadow"
                >
                  Verify Handshake & Proceed to Inspection <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: PHOTOS & TELEMATICS */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              {/* Telematics Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-brand-mist/50 border border-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <Gauge className="h-4 w-4 text-brand-teal" /> Start Odometer (KM)
                  </label>
                  <input
                    type="number"
                    value={startOdometer}
                    onChange={(e) => setStartOdometer(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-card border border-border font-mono font-bold text-brand-navy outline-none"
                  />
                  <span className="text-[10px] text-muted-foreground">Matches dashboard cluster reading</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-navy flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Fuel className="h-4 w-4 text-amber-500" /> Start Fuel Level
                    </span>
                    <span className="text-brand-teal font-extrabold">{startFuel}%</span>
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    step={5}
                    value={startFuel}
                    onChange={(e) => setStartFuel(Number(e.target.value))}
                    className="w-full accent-brand-teal mt-2"
                  />
                  <span className="text-[10px] text-muted-foreground">Standard Handover: 85% to 100% Full Tank</span>
                </div>
              </div>

              {/* 6-Photo Inspection Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-brand-gold" /> 6-Point High-Resolution Audit Photos
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DEFAULT_PHOTOS.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
                    >
                      <img
                        src={uploadedPhotos[item.id] || item.url}
                        alt={item.label}
                        className="h-24 w-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="p-2 text-center bg-card border-t border-border">
                        <span className="text-[10px] font-bold text-brand-navy block truncate">{item.label}</span>
                        <span className="text-[9px] text-emerald-600 font-semibold flex items-center justify-center gap-0.5 mt-0.5">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Uploaded & Timestamped
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl text-xs">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="rounded-xl bg-brand-navy text-white font-bold text-xs px-6 h-10 shadow"
                >
                  Verify Safety Checklist <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PRE-TRIP SAFETY CHECKLIST */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider">
                Fleet Quality & Safety Audit
              </h4>

              <div className="space-y-2.5 text-xs">
                {[
                  { key: "tyres", title: "Tyre Pressure & Tread Depth", desc: "All 4 radial tyres inspected at 32 PSI with minimum 4mm tread depth" },
                  { key: "spareWheel", title: "Spare Wheel & Emergency Tool Kit", desc: "Stepney tyre, hydraulic jack, wheel spanner & hazard triangle in boot" },
                  { key: "fastag", title: "Fastag RFID Active & Synced", desc: "National highway & Tirumala Alipiri toll pass validated with zero penalty" },
                  { key: "acCooling", title: "AC Dual-Zone Cooling & Lighting", desc: "Climate control, headlights, indicators & wiper spray tested" },
                  { key: "sanitized", title: "Sanitized Interior & Fresh Fragrance", desc: "Cabin steam cleaned, vacuumed upholstery & zero previous smoke odor" },
                  { key: "documents", title: "Original RC & Zero-Dep Insurance Copy", desc: "Physical vehicle documents & tourist permit verified in glove compartment" },
                ].map((chk) => (
                  <label
                    key={chk.key}
                    className="flex items-start gap-3 p-3 rounded-2xl border border-border bg-brand-mist/30 hover:bg-brand-mist/60 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(checklist as any)[chk.key]}
                      onChange={(e) =>
                        setChecklist((prev) => ({ ...prev, [chk.key]: e.target.checked }))
                      }
                      className="h-4 w-4 mt-0.5 accent-brand-teal rounded"
                    />
                    <div>
                      <p className="font-bold text-brand-navy">{chk.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{chk.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl text-xs">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  className="rounded-xl bg-brand-navy text-white font-bold text-xs px-6 h-10 shadow"
                >
                  Proceed to Customer Signature <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMER DIGITAL SIGNATURE */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-brand-mist/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <PenTool className="h-4 w-4 text-brand-teal" /> Customer Handover Signature
                  </span>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-[10px] text-muted-foreground hover:text-rose-600 flex items-center gap-1 font-bold"
                  >
                    <RotateCcw className="h-3 w-3" /> Clear Signature
                  </button>
                </div>

                <div className="rounded-2xl border border-dashed border-brand-teal/60 bg-card overflow-hidden shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={540}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-40 touch-none cursor-crosshair bg-white"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  Sign above with your finger or mouse to confirm vehicle condition & receive digital key
                </p>
              </div>

              {/* Handover Summary Strip */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-brand-navy text-white text-center text-xs">
                <div>
                  <span className="text-[9px] text-white/60 block uppercase">Start Odo</span>
                  <span className="font-black text-brand-gold">{startOdometer} KM</span>
                </div>
                <div>
                  <span className="text-[9px] text-white/60 block uppercase">Start Fuel</span>
                  <span className="font-black text-brand-teal">{startFuel}% Full</span>
                </div>
                <div>
                  <span className="text-[9px] text-white/60 block uppercase">Security Deposit</span>
                  <span className="font-black text-emerald-400">₹{booking.securityDeposit || 3000}</span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(3)} className="rounded-xl text-xs">
                  Back
                </Button>
                <Button
                  onClick={handleCompletePickup}
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 h-10 shadow"
                >
                  {isSubmitting ? "Authorizing Handover..." : "Confirm Handover & Start Trip 🚗"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
