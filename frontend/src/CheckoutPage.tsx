import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  Phone,
  User,
  MapPin,
  Calendar,
  Clock,
  Car,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./context/AuthContext";
import { BookingSummaryCard } from "./components/checkout/BookingSummaryCard";
import { DiscountsAndWalletSection } from "./components/checkout/DiscountsAndWalletSection";
import { DigitalSignaturePad } from "./components/checkout/DigitalSignaturePad";
import { RentalAgreementModal } from "./components/checkout/RentalAgreementModal";
import { PaymentMethodsSection, PaymentMethodType } from "./components/checkout/PaymentMethodsSection";
import { BookingConfirmationScreen } from "./components/checkout/BookingConfirmationScreen";

interface CheckoutPageProps {
  initialCar?: any;
  initialParams?: any;
  onNavigate?: (path: string) => void;
}

const defaultCar = {
  id: 4,
  name: "Toyota Innova Crysta ZX",
  brand: "Toyota",
  model: "Innova Crysta",
  variant: "2.4 ZX Captain Seats",
  detail: "Unmatched pilgrimage luxury, captain seats with climate control & ample luggage space",
  price: "₹3,499",
  pricePerDay: 3499,
  tag: "Luxury",
  category: "Luxury",
  fuelType: "Diesel",
  transmission: "Automatic",
  seats: 7,
  mileage: "14 km/l",
  color: "Super White",
  status: "Available",
  branch: "Chandragiri Heritage Point",
  location: "Tirupati Central Station Hub",
  image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
};

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  initialCar,
  initialParams,
  onNavigate,
}) => {
  const { user, openAuthModal } = useAuth();

  const [car, setCar] = useState<any>(initialCar || defaultCar);
  const [currentStep, setCurrentStep] = useState<"details" | "payment" | "confirmed">("details");

  // Renter Details
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [drivingLicense, setDrivingLicense] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Trip Timeline
  const [pickupLocation, setPickupLocation] = useState(
    initialParams?.pickup || "Tirupati Central Station Hub"
  );
  const [dropLocation, setDropLocation] = useState(
    initialParams?.dropoff || initialParams?.pickup || "Tirupati Central Station Hub"
  );
  const [startDate, setStartDate] = useState(initialParams?.startDate || "2026-09-08");
  const [startTime, setStartTime] = useState(initialParams?.startTime || "09:00");
  const [endDate, setEndDate] = useState(initialParams?.endDate || "2026-09-10");
  const [endTime, setEndTime] = useState(initialParams?.endTime || "21:00");

  // Options & Extras
  const [withDriver, setWithDriver] = useState(initialParams?.withDriver || false);
  const [deliveryMode, setDeliveryMode] = useState<"hub" | "doorstep">(
    initialParams?.deliveryMode || "hub"
  );
  const [selectedExtras, setSelectedExtras] = useState<string[]>(["Zero-Dep Waiver"]);

  // Discounts & Wallet
  const [useWallet, setUseWallet] = useState(false);
  const [useRewards, setUseRewards] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    percent: number;
    discount: number;
  } | null>(null);
  const [referralDiscount, setReferralDiscount] = useState(0);

  // Agreement & Signature
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  // Payment Method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>("upi");

  // Submission & Confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [confirmedBookingData, setConfirmedBookingData] = useState<any | null>(null);

  // Sync with logged in user
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name || "");
      if (!customerPhone) setCustomerPhone(user.phone || "");
      if (!customerEmail) setCustomerEmail(user.email || "");
    }
  }, [user]);

  // Duration in Days
  const rentalDays = useMemo(() => {
    try {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    } catch {
      return 2;
    }
  }, [startDate, startTime, endDate, endTime]);

  // Calculations
  const dailyRate =
    car.pricePerDay ||
    parseInt(String(car.price || "2499").replace(/[^0-9]/g, ""), 10) ||
    2499;
  const baseFare = dailyRate * rentalDays;
  const deliveryFee = deliveryMode === "doorstep" ? 299 : 0;
  const driverFee = withDriver ? 699 * rentalDays : 0;
  const extrasTotal = (selectedExtras.includes("Zero-Dep Waiver") ? 299 * rentalDays : 0);

  const subtotalBeforeDiscounts = baseFare + deliveryFee + driverFee + extrasTotal;

  // Wallet and Points values
  const userWalletBalance = 1500; // Simulated available wallet balance
  const userRewardPoints = 500; // Simulated reward points (500 pts = ₹100)

  const walletDeduction = useWallet ? Math.min(userWalletBalance, Math.round(subtotalBeforeDiscounts * 0.5)) : 0;
  const rewardDeduction = useRewards ? 100 : 0;
  const couponDiscount = appliedCoupon ? Math.round((subtotalBeforeDiscounts * appliedCoupon.percent) / 100) : 0;

  const totalDiscounts = walletDeduction + rewardDeduction + couponDiscount + referralDiscount;
  const subtotalAfterDiscounts = Math.max(0, subtotalBeforeDiscounts - totalDiscounts);

  // GST 18%
  const gstAmount = Math.round(subtotalAfterDiscounts * 0.18);

  // Security Deposit
  const securityDeposit = dailyRate > 3000 ? 5000 : 3000;

  // Grand Total
  const grandTotal = subtotalAfterDiscounts + gstAmount + securityDeposit;

  // Apply Coupon Handler
  const handleApplyCoupon = (code: string) => {
    if (code === "PILGRIM10") {
      setAppliedCoupon({ code, percent: 10, discount: Math.round(subtotalBeforeDiscounts * 0.1) });
    } else if (code === "WEEKEND20") {
      setAppliedCoupon({ code, percent: 20, discount: Math.round(subtotalBeforeDiscounts * 0.2) });
    } else if (code === "CORP2026") {
      setAppliedCoupon({ code, percent: 15, discount: Math.round(subtotalBeforeDiscounts * 0.15) });
    }
  };

  // Referral Handler
  const handleApplyReferral = (code: string) => {
    if (code.toUpperCase().includes("FRIEND") || code.toUpperCase().includes("TIRUPATI") || code.length >= 6) {
      setReferralDiscount(250);
      return true;
    }
    return false;
  };

  // Final Payment & Reservation Submission
  const handleConfirmAndPay = async () => {
    if (!customerName || !customerPhone) {
      setSubmissionError("Please fill in your legal name and contact mobile number.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!hasAcceptedTerms) {
      setSubmissionError("Please accept the Moar Cars Self-Drive Rental Agreement & Ghat road rules.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");

    const bookingId = `MC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const transactionId = `TXN-MOAR-${Date.now().toString().slice(-6)}`;

    const bookingPayload = {
      bookingId,
      transactionId,
      pickup: pickupLocation,
      pickupLocation,
      dropLocation,
      startDate: `${startDate} ${startTime}`,
      endDate: `${endDate} ${endTime}`,
      carName: car.name,
      car,
      bookingType: withDriver ? "Chauffeur Driven" : "Self Drive",
      customerName: customerName || "Valued Customer",
      customerPhone: customerPhone || "+91 98765 43210",
      customerEmail: customerEmail || "customer@moarcars.com",
      drivingLicense: drivingLicense || "DL-AP03-2024-XXXX",
      emergencyContact,
      status: "Confirmed",
      paymentStatus: selectedPaymentMethod === "cash" ? "Pending_At_Pickup" : "Paid",
      paymentMethod: selectedPaymentMethod,
      bookingSource: "Web Checkout Gateway",
      totalDays: rentalDays,
      baseFare,
      deliveryFee,
      driverFee,
      extrasTotal,
      couponDiscount,
      walletDeduction,
      rewardDeduction,
      referralDiscount,
      discountAmount: totalDiscounts,
      gstAmount,
      securityDeposit,
      grandTotal,
      signatureData: signatureDataUrl || "DIGITAL_SIGNED_ON_CHECKOUT",
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });
      const data = await res.json();

      setConfirmedBookingData({
        ...bookingPayload,
        bookingId: data.data?.id ? `MC-2026-${data.data.id}` : bookingId,
      });
      setCurrentStep("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.warn("Optimistic booking confirmation:", err);
      setConfirmedBookingData(bookingPayload);
      setCurrentStep("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-cream text-brand-ink pb-20">
      {/* Checkout Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary-foreground/10 bg-brand-navy/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentStep === "payment") setCurrentStep("details");
                else if (onNavigate) onNavigate(`/car/${car.id || car.name}`);
                else window.history.back();
              }}
              className="text-white hover:text-brand-gold hover:bg-white/10 rounded-xl px-2.5 py-1.5 h-auto flex items-center gap-1 text-xs font-bold"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>

            <a
              href="/"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("/");
                }
              }}
              className="brand-mark flex items-center gap-2 text-xl font-black text-primary-foreground"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-gold text-sm text-brand-gold font-bold">
                M
              </span>
              <span>
                MOAR <span className="text-brand-gold">CARS</span>
              </span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Lock className="h-3.5 w-3.5" /> 256-Bit SSL Checkout
            </div>
            <a href="tel:+918500012345" className="flex items-center gap-1.5 text-white/80 hover:text-white font-medium">
              <Phone className="h-3.5 w-3.5 text-brand-gold" /> +91 85000 12345
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-8">
        {/* Stepper Progress Bar */}
        {currentStep !== "confirmed" && (
          <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs font-bold text-muted-foreground pt-4">
            <div className={`flex items-center gap-2 ${currentStep === "details" ? "text-brand-teal" : "text-emerald-600"}`}>
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black ${
                  currentStep === "details" ? "bg-brand-teal text-white" : "bg-emerald-500 text-white"
                }`}
              >
                1
              </div>
              <span>Renter & Itinerary</span>
            </div>

            <div className="h-0.5 w-8 sm:w-16 bg-border" />

            <div className={`flex items-center gap-2 ${currentStep === "payment" ? "text-brand-teal" : "text-muted-foreground"}`}>
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black ${
                  currentStep === "payment" ? "bg-brand-teal text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span>Agreement & Payment</span>
            </div>

            <div className="h-0.5 w-8 sm:w-16 bg-border" />

            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-black">
                3
              </div>
              <span>Instant Confirmation</span>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMATION VIEW */}
        {currentStep === "confirmed" && confirmedBookingData && (
          <BookingConfirmationScreen
            bookingData={confirmedBookingData}
            onGoToDashboard={() => {
              if (onNavigate) onNavigate("/dashboard");
            }}
            onGoHome={() => {
              if (onNavigate) onNavigate("/");
            }}
          />
        )}

        {/* STEP 1 & 2: CHECKOUT FORM & SUMMARY */}
        {currentStep !== "confirmed" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Input Forms */}
            <div className="lg:col-span-7 space-y-6">
              {/* Error Notice */}
              {submissionError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* 1. RENTER & DRIVER IDENTIFICATION */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
                    <User className="h-4 w-4 text-brand-teal" /> Primary Renter Details
                  </h3>
                  {!user && (
                    <button
                      type="button"
                      onClick={() => openAuthModal("login")}
                      className="text-xs font-bold text-brand-teal hover:underline"
                    >
                      Already have an account? Sign In
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Full Legal Name (as per DL)</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Reddy"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-brand-mist/60 border border-border text-xs font-semibold text-brand-navy outline-none focus:ring-1 focus:ring-brand-teal"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-brand-mist/60 border border-border text-xs font-semibold text-brand-navy outline-none focus:ring-1 focus:ring-brand-teal"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Email Address</label>
                    <input
                      type="email"
                      placeholder="rajesh@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-brand-mist/60 border border-border text-xs font-semibold text-brand-navy outline-none focus:ring-1 focus:ring-brand-teal"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Driving License Number</label>
                    <input
                      type="text"
                      placeholder="AP03 20220019281"
                      value={drivingLicense}
                      onChange={(e) => setDrivingLicense(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-brand-mist/60 border border-border text-xs uppercase font-semibold text-brand-navy outline-none focus:ring-1 focus:ring-brand-teal"
                    />
                  </div>
                </div>
              </div>

              {/* 2. DISCOUNTS, WALLET & LOYALTY */}
              <DiscountsAndWalletSection
                userWalletBalance={userWalletBalance}
                userRewardPoints={userRewardPoints}
                subtotal={subtotalBeforeDiscounts}
                useWallet={useWallet}
                onToggleWallet={setUseWallet}
                useRewards={useRewards}
                onToggleRewards={setUseRewards}
                appliedCoupon={appliedCoupon}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={() => setAppliedCoupon(null)}
                referralDiscount={referralDiscount}
                onApplyReferral={handleApplyReferral}
                onRemoveReferral={() => setReferralDiscount(0)}
              />

              {/* 3. DIGITAL SIGNATURE & RENTAL AGREEMENT */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
                    <FileText className="h-4 w-4 text-brand-teal" /> Self-Drive Rental Agreement & Signature
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAgreementModalOpen(true)}
                    className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1"
                  >
                    View Full Agreement <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <DigitalSignaturePad
                  onSignatureChange={(dataUrl) => setSignatureDataUrl(dataUrl)}
                  signerName={customerName || "Primary Renter"}
                />

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-brand-navy font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAcceptedTerms}
                      onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                      className="mt-0.5 rounded text-brand-teal focus:ring-0 accent-brand-teal"
                    />
                    <span>
                      I agree to the Moar Cars Self-Drive Rental Agreement, Tirumala Ghat Road speed bylaws, like-to-like fuel terms, and authorize my digital signature on the rental contract.
                    </span>
                  </label>
                </div>
              </div>

              {/* 4. PAYMENT METHOD SELECTOR */}
              <PaymentMethodsSection
                grandTotal={grandTotal}
                selectedMethod={selectedPaymentMethod}
                onSelectMethod={setSelectedPaymentMethod}
              />

              {/* Final Submit / Pay CTA */}
              <div className="space-y-3 pt-2">
                <Button
                  size="lg"
                  disabled={isSubmitting}
                  onClick={handleConfirmAndPay}
                  className="w-full h-14 rounded-2xl bg-brand-gold hover:bg-brand-gold/90 text-brand-navy text-sm font-black uppercase tracking-wider shadow-2xl hover:shadow-brand-gold/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  {isSubmitting ? (
                    "Securing Booking..."
                  ) : (
                    <>
                      <span>
                        Authorize ₹
                        {(selectedPaymentMethod === "split" ? Math.round(grandTotal * 0.2) : grandTotal).toLocaleString("en-IN")} & Complete Booking
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>
                    100% Free Cancellation up to 6 hours before trip • 2-Hour Security Deposit Refund Guarantee
                  </span>
                </p>
              </div>
            </div>

            {/* Right Column (5 cols): Live Summary Card */}
            <div className="lg:col-span-5 sticky top-24">
              <BookingSummaryCard
                car={car}
                pickupLocation={pickupLocation}
                dropLocation={dropLocation}
                startDate={startDate}
                startTime={startTime}
                endDate={endDate}
                endTime={endTime}
                rentalDays={rentalDays}
                withDriver={withDriver}
                deliveryMode={deliveryMode}
                baseFare={baseFare}
                deliveryFee={deliveryFee}
                driverFee={driverFee}
                extrasTotal={extrasTotal}
                selectedExtras={selectedExtras}
                couponDiscount={couponDiscount}
                couponCode={appliedCoupon?.code}
                walletDeduction={walletDeduction}
                rewardDeduction={rewardDeduction}
                referralDiscount={referralDiscount}
                gstAmount={gstAmount}
                securityDeposit={securityDeposit}
                grandTotal={grandTotal}
                paymentMode={selectedPaymentMethod}
              />
            </div>
          </div>
        )}
      </div>

      {/* Agreement Modal */}
      <RentalAgreementModal
        car={car}
        renterName={customerName}
        renterPhone={customerPhone}
        renterEmail={customerEmail}
        startDate={startDate}
        endDate={endDate}
        pickupLocation={pickupLocation}
        signatureDataUrl={signatureDataUrl}
        isOpen={isAgreementModalOpen}
        onClose={() => setIsAgreementModalOpen(false)}
        onAccept={() => setHasAcceptedTerms(true)}
      />
    </main>
  );
};
export default CheckoutPage;
