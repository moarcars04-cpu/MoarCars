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
  Receipt,
  FileCheck2,
  Activity,
  XCircle,
  CircleDollarSign,
  X,
  ExternalLink,
} from "lucide-react";
import { BookingItem } from "../../types/user";
import { Button } from "@/components/ui/button";
import { TripCard } from "./trips/TripCard";
import { LiveTrackingModal } from "./trips/LiveTrackingModal";
import {
  ModifyBookingModal,
  ExtendBookingModal,
  CancelBookingModal,
  UpgradeCarModal,
} from "./trips/TripManagementModals";

interface BookingsSectionProps {
  upcomingBookings: BookingItem[];
  recentBookings: BookingItem[];
  onBrowseFleet: () => void;
}

// Fallback demo bookings for interactive exploration if database has empty trips
const DEMO_BOOKINGS: BookingItem[] = [
  {
    id: 1042,
    bookingType: "Self Drive (Unlimited KM)",
    pickup: "Tirupati Central Station Hub",
    startDate: "2026-09-08 09:00 AM",
    endDate: "2026-09-10 09:00 PM",
    carName: "Toyota Innova Crysta ZX Captain",
    status: "Active", // Ongoing
    customerName: "Moar Member",
    customerPhone: "+91 98765 43210",
    customerEmail: "member@moarcars.com",
    driverName: "K. Srinivasulu Reddy",
    driverPhone: "+91 85000 12345",
    amount: 5499,
    securityDeposit: 3000,
    taxAmount: 580,
    duration: "2 Days (48 Hours)",
  },
  {
    id: 1039,
    bookingType: "Self Drive Premium",
    pickup: "Renigunta Airport Hub (TIR T1)",
    startDate: "2026-09-14 10:00 AM",
    endDate: "2026-09-16 08:00 PM",
    carName: "Mahindra Thar 4x4 Hardtop",
    status: "Confirmed", // Upcoming
    customerName: "Moar Member",
    customerPhone: "+91 98765 43210",
    customerEmail: "member@moarcars.com",
    driverName: "B. Venkatesh Naik",
    driverPhone: "+91 85000 23456",
    amount: 4899,
    securityDeposit: 3000,
    taxAmount: 510,
    duration: "2 Days",
  },
  {
    id: 1018,
    bookingType: "Self Drive Executive",
    pickup: "Tirupati Central Hub",
    startDate: "2026-08-20 08:00 AM",
    endDate: "2026-08-22 09:00 PM",
    carName: "Hyundai Creta SX(O) Sunroof",
    status: "Completed",
    customerName: "Moar Member",
    customerPhone: "+91 98765 43210",
    customerEmail: "member@moarcars.com",
    amount: 4598,
    securityDeposit: 3000,
    taxAmount: 490,
    duration: "2 Days",
  },
  {
    id: 1005,
    bookingType: "Self Drive Compact",
    pickup: "Alipiri Tirumala Gate",
    startDate: "2026-08-05 06:00 AM",
    endDate: "2026-08-06 08:00 PM",
    carName: "Maruti Swift ZXi+",
    status: "Cancelled",
    customerName: "Moar Member",
    customerPhone: "+91 98765 43210",
    customerEmail: "member@moarcars.com",
    amount: 3398,
    securityDeposit: 3000,
    taxAmount: 360,
    duration: "1.5 Days",
  },
];

type TripTabType = "all" | "upcoming" | "ongoing" | "completed" | "cancelled" | "refunded";

export const BookingsSection: React.FC<BookingsSectionProps> = ({
  upcomingBookings,
  recentBookings,
  onBrowseFleet,
}) => {
  // Combine all user bookings from props or fallback to demo data
  const rawList = [...upcomingBookings, ...recentBookings];
  const initialList = rawList.length > 0 ? rawList : DEMO_BOOKINGS;

  const [bookingsList, setBookingsList] = useState<BookingItem[]>(initialList);
  const [activeTab, setActiveTab] = useState<TripTabType>("upcoming");

  // Modal States
  const [selectedBookingForTracking, setSelectedBookingForTracking] = useState<BookingItem | null>(null);
  const [selectedBookingForModify, setSelectedBookingForModify] = useState<BookingItem | null>(null);
  const [selectedBookingForExtend, setSelectedBookingForExtend] = useState<BookingItem | null>(null);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<BookingItem | null>(null);
  const [selectedBookingForUpgrade, setSelectedBookingForUpgrade] = useState<BookingItem | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<BookingItem | null>(null);
  const [selectedAgreement, setSelectedAgreement] = useState<BookingItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Categorize bookings
  const upcomingList = bookingsList.filter(
    (b) => b.status === "Confirmed" || b.status === "Pending" || b.status === ("Upcoming" as any)
  );
  const ongoingList = bookingsList.filter(
    (b) => b.status === "Active" || b.status === ("Ongoing" as any) || b.status === ("In Progress" as any)
  );
  const completedList = bookingsList.filter(
    (b) => b.status === "Completed" || b.status === "Returned"
  );
  const cancelledList = bookingsList.filter(
    (b) => b.status === "Cancelled"
  );
  const refundedList = bookingsList.filter(
    (b) => (b as any).isRefunded || b.status === ("Refunded" as any) || b.status === "Completed" || b.status === "Cancelled"
  );

  // Active display list based on tab
  const getDisplayList = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingList;
      case "ongoing":
        return ongoingList;
      case "completed":
        return completedList;
      case "cancelled":
        return cancelledList;
      case "refunded":
        return refundedList;
      default:
        return bookingsList;
    }
  };

  const currentDisplayList = getDisplayList();

  // Handlers for Trip Management Actions
  const handleUpdateBooking = (updated: any) => {
    setBookingsList((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
    );
  };

  const handleModifySuccess = (updated: any) => {
    handleUpdateBooking(updated);
    showToast("✅ Trip itinerary details updated successfully!");
  };

  const handleExtendSuccess = (updated: any) => {
    handleUpdateBooking(updated);
    showToast("⏱️ Trip duration extended! Pro-rata fare confirmed.");
  };

  const handleCancelSuccess = (updated: any) => {
    handleUpdateBooking({ ...updated, status: "Cancelled", isRefunded: true });
    showToast("🛑 Reservation cancelled. 100% full refund initiated to your bank account/UPI.");
  };

  const handleUpgradeSuccess = (updated: any) => {
    handleUpdateBooking(updated);
    showToast(`✨ Car upgraded successfully to ${updated.carName}!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage("")} className="text-emerald-300 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Banner & Filter Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Car className="h-5 w-5 text-brand-gold" /> My Trips & Fleet Reservations
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Real-time GPS telematics, 9-step booking lifecycle, keyless unlock, and instant trip changes.
          </p>
        </div>

        <Button
          onClick={onBrowseFleet}
          className="h-9 rounded-xl bg-brand-gold text-brand-navy font-black text-xs hover:bg-brand-gold-soft flex items-center gap-1.5 shadow"
        >
          <Sparkles className="h-3.5 w-3.5" /> Book Another Car
        </Button>
      </div>

      {/* 5-Category Tabs Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {/* Tab 1: Upcoming */}
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "upcoming"
              ? "bg-brand-gold text-brand-navy shadow-md font-extrabold"
              : "bg-slate-900/60 text-white/70 hover:text-white border border-white/5"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Upcoming Trips</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === "upcoming" ? "bg-brand-navy text-white" : "bg-white/10 text-white/80"
            }`}
          >
            {upcomingList.length}
          </span>
        </button>

        {/* Tab 2: Ongoing */}
        <button
          type="button"
          onClick={() => setActiveTab("ongoing")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "ongoing"
              ? "bg-emerald-500 text-white shadow-md font-extrabold"
              : "bg-slate-900/60 text-white/70 hover:text-white border border-white/5"
          }`}
        >
          <Activity className="h-3.5 w-3.5 animate-pulse" />
          <span>Ongoing Trips</span>
          {ongoingList.length > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === "ongoing" ? "bg-white text-emerald-700" : "bg-emerald-500/20 text-emerald-400"
              }`}
            >
              {ongoingList.length}
            </span>
          )}
        </button>

        {/* Tab 3: Completed */}
        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "completed"
              ? "bg-brand-gold text-brand-navy shadow-md font-extrabold"
              : "bg-slate-900/60 text-white/70 hover:text-white border border-white/5"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Completed ({completedList.length})</span>
        </button>

        {/* Tab 4: Cancelled */}
        <button
          type="button"
          onClick={() => setActiveTab("cancelled")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "cancelled"
              ? "bg-rose-500 text-white shadow-md font-extrabold"
              : "bg-slate-900/60 text-white/70 hover:text-white border border-white/5"
          }`}
        >
          <XCircle className="h-3.5 w-3.5" />
          <span>Cancelled ({cancelledList.length})</span>
        </button>

        {/* Tab 5: Refunded */}
        <button
          type="button"
          onClick={() => setActiveTab("refunded")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "refunded"
              ? "bg-brand-teal text-white shadow-md font-extrabold"
              : "bg-slate-900/60 text-white/70 hover:text-white border border-white/5"
          }`}
        >
          <CircleDollarSign className="h-3.5 w-3.5" />
          <span>Refunded Deposits ({refundedList.length})</span>
        </button>
      </div>

      {/* Main Trip Cards Listing */}
      {currentDisplayList.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center space-y-4 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 border border-white/10 text-brand-gold">
            <Car className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-bold text-white">
            {activeTab === "upcoming"
              ? "No Upcoming Reservations"
              : activeTab === "ongoing"
              ? "No Active Ongoing Trips Right Now"
              : activeTab === "completed"
              ? "No Past Completed Trips"
              : activeTab === "cancelled"
              ? "No Cancelled Trips"
              : "No Refund Transactions Recorded"}
          </h4>
          <p className="text-xs text-white/60 max-w-sm mx-auto">
            {activeTab === "upcoming"
              ? "Reserve a sanitized self-drive car with ghat-pass permit for your Tirupati temple darshan or road trip."
              : "All your active bookings, digital car keys, and invoices will be accessible here."}
          </p>
          <Button
            onClick={onBrowseFleet}
            className="h-10 px-6 rounded-xl bg-brand-gold text-brand-navy font-extrabold text-xs uppercase tracking-wide hover:bg-brand-gold-soft"
          >
            Explore Available Fleet <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {currentDisplayList.map((booking) => (
            <TripCard
              key={booking.id}
              booking={booking}
              onOpenLiveTracking={(b) => setSelectedBookingForTracking(b)}
              onOpenModify={(b) => setSelectedBookingForModify(b)}
              onOpenExtend={(b) => setSelectedBookingForExtend(b)}
              onOpenCancel={(b) => setSelectedBookingForCancel(b)}
              onOpenUpgrade={(b) => setSelectedBookingForUpgrade(b)}
              onOpenInvoice={(b) => setSelectedInvoice(b)}
              onOpenAgreement={(b) => setSelectedAgreement(b)}
              onBookAgain={() => onBrowseFleet()}
            />
          ))}
        </div>
      )}

      {/* 1. LIVE TRACKING & DISPATCH MODAL */}
      {selectedBookingForTracking && (
        <LiveTrackingModal
          booking={selectedBookingForTracking}
          isOpen={!!selectedBookingForTracking}
          onClose={() => setSelectedBookingForTracking(null)}
        />
      )}

      {/* 2. MODIFY BOOKING MODAL */}
      {selectedBookingForModify && (
        <ModifyBookingModal
          booking={selectedBookingForModify}
          isOpen={!!selectedBookingForModify}
          onClose={() => setSelectedBookingForModify(null)}
          onSuccess={handleModifySuccess}
        />
      )}

      {/* 3. EXTEND TRIP MODAL */}
      {selectedBookingForExtend && (
        <ExtendBookingModal
          booking={selectedBookingForExtend}
          isOpen={!!selectedBookingForExtend}
          onClose={() => setSelectedBookingForExtend(null)}
          onSuccess={handleExtendSuccess}
        />
      )}

      {/* 4. CANCEL BOOKING MODAL */}
      {selectedBookingForCancel && (
        <CancelBookingModal
          booking={selectedBookingForCancel}
          isOpen={!!selectedBookingForCancel}
          onClose={() => setSelectedBookingForCancel(null)}
          onSuccess={handleCancelSuccess}
        />
      )}

      {/* 5. UPGRADE VEHICLE CLASS MODAL */}
      {selectedBookingForUpgrade && (
        <UpgradeCarModal
          booking={selectedBookingForUpgrade}
          isOpen={!!selectedBookingForUpgrade}
          onClose={() => setSelectedBookingForUpgrade(null)}
          onSuccess={handleUpgradeSuccess}
        />
      )}

      {/* 6. GST TAX INVOICE & RECEIPT MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-xl w-full rounded-3xl bg-slate-900 border border-brand-gold/40 p-6 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-gold text-brand-navy font-black text-sm shadow">
                  M
                </span>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-white">
                    Tax Invoice & Trip Receipt
                  </h3>
                  <p className="text-[10px] font-mono text-brand-gold">
                    GSTIN: 37AAHCM4412K1Z9 • INV-MC-2026-{(selectedInvoice as any).bookingId || selectedInvoice.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Invoice Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/70 border border-white/10">
                <div>
                  <span className="text-[10px] text-white/50 uppercase font-bold block">Vehicle Rented</span>
                  <p className="font-bold text-white text-sm">{selectedInvoice.carName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 uppercase font-bold block">Pickup Hub</span>
                  <p className="font-bold text-white">{selectedInvoice.pickup}</p>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 uppercase font-bold block">Rental Dates</span>
                  <p className="font-semibold text-white/90">
                    {selectedInvoice.startDate} &rarr; {selectedInvoice.endDate}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 uppercase font-bold block">Customer Details</span>
                  <p className="font-bold text-white">{selectedInvoice.customerName}</p>
                  <p className="text-[10px] text-white/60">{selectedInvoice.customerPhone}</p>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex justify-between text-white/70">
                  <span>Base Vehicle Rental (Unlimited KM)</span>
                  <span>₹{((selectedInvoice.amount || 3499) - (selectedInvoice.taxAmount || 360)).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>CGST (9%) + SGST (9%)</span>
                  <span>₹{(selectedInvoice.taxAmount || 360).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Security Deposit (100% Refunded)</span>
                  <span>₹{(selectedInvoice.securityDeposit || 3000).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-black text-base text-brand-gold pt-2 border-t border-white/10">
                  <span>Total Amount Paid</span>
                  <span>₹{(selectedInvoice.amount || 3499).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Print / Download CTA */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => window.print()}
                className="flex-1 h-10 rounded-xl bg-brand-gold text-brand-navy font-extrabold text-xs uppercase hover:bg-brand-gold-soft flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="h-4 w-4" /> Download Official GST PDF
              </Button>
              <Button
                onClick={() => setSelectedInvoice(null)}
                variant="outline"
                className="h-10 rounded-xl border-white/20 text-white hover:bg-white/10 text-xs font-bold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 7. DIGITAL RENTAL AGREEMENT MODAL */}
      {selectedAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-xl w-full rounded-3xl bg-slate-900 border border-brand-teal/40 p-6 text-white space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-teal text-white font-black text-sm shadow">
                  <FileCheck2 className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-white">
                    Self-Drive Master Rental Agreement
                  </h3>
                  <p className="text-[10px] font-mono text-brand-teal">
                    AGR-MC-2026-{(selectedAgreement as any).bookingId || selectedAgreement.id} • Digitally Certified
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgreement(null)}
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Contract Body */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-white/60 font-medium">Lessor / Service Provider:</span>
                  <span className="font-bold text-brand-gold">Moar Cars Luxury Mobility LLP, Tirupati</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-white/60 font-medium">Lessee (Customer):</span>
                  <span className="font-bold text-white">{selectedAgreement.customerName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-white/60 font-medium">Allocated Vehicle:</span>
                  <span className="font-bold text-white">{selectedAgreement.carName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 font-medium">Designated Route:</span>
                  <span className="font-bold text-brand-teal">Tirupati • Tirumala Ghats • AP/TN Permitted</span>
                </div>
              </div>

              {/* Key Clauses */}
              <div className="p-3.5 rounded-2xl bg-brand-mist/5 border border-white/10 space-y-2 text-[11px] text-white/80">
                <h4 className="text-xs font-black text-brand-gold uppercase">Terms & Indemnity:</h4>
                <ul className="list-disc list-inside space-y-1 text-white/70">
                  <li><strong>Ghat Road Safety:</strong> Speed limit on Tirumala first & second ghat roads strictly capped at 40 km/h with mandatory seatbelt enforcement.</li>
                  <li><strong>Security Deposit:</strong> ₹{(selectedAgreement.securityDeposit || 3000).toLocaleString("en-IN")} shall be released within 2 hours post vehicle check-in.</li>
                  <li><strong>Fuel Policy:</strong> Vehicle provided at 85%+ fuel; customer to return at equivalent level or fuel charges apply.</li>
                  <li><strong>Comprehensive Insurance:</strong> Bumper-to-bumper zero dep coverage active during rental window.</li>
                </ul>
              </div>

              {/* Digital Signature Verification */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">Digital Signature Verified</p>
                  <p className="text-xs font-black text-white">{selectedAgreement.customerName}</p>
                  <p className="text-[9px] text-white/50 font-mono">Timestamp: 2026-09-07 • IP: Verified e-Sign</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Download CTA */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => window.print()}
                className="flex-1 h-10 rounded-xl bg-brand-teal text-white font-extrabold text-xs uppercase hover:bg-brand-teal/90 flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="h-4 w-4" /> Download Signed Agreement
              </Button>
              <Button
                onClick={() => setSelectedAgreement(null)}
                variant="outline"
                className="h-10 rounded-xl border-white/20 text-white hover:bg-white/10 text-xs font-bold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
