import React, { useState, useEffect } from "react";
import {
  User,
  ShieldCheck,
  CalendarDays,
  Heart,
  Wallet,
  Sparkles,
  LogOut,
  Home,
  ChevronRight,
  Car,
  Gift,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Phone,
  Settings,
  Bell,
  Coins,
  Star,
  Share2,
  Headphones,
  Scale,
  CreditCard,
  FileText,
  MapPin,
  Compass,
  MessageSquare,
  KeyRound,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { UserProfile, UserDashboardData, BookingItem, NotificationItem } from "../../types/user";
import { KycSection } from "./KycSection";
import { BookingsSection } from "./BookingsSection";
import { ProfileSection } from "./ProfileSection";
import { WalletSection } from "./WalletSection";
import { RewardsSection } from "./RewardsSection";
import { ReferralSection } from "./ReferralSection";
import { ReviewsSection } from "./ReviewsSection";
import { SavedCarsSection } from "./SavedCarsSection";
import { SupportSection } from "./SupportSection";
import { SettingsSection } from "./SettingsSection";
import { LegalSection } from "./LegalSection";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { GstInvoiceModal } from "./trips/GstInvoiceModal";
import { Button } from "@/components/ui/button";

interface UserDashboardProps {
  onNavigate: (path: string) => void;
  onSelectCarToBook?: (carName: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate, onSelectCarToBook }) => {
  const {
    user,
    logout,
    updateProfile,
    uploadKyc,
    toggleFavoriteCar,
    addWalletFunds,
    redeemRewards,
    claimBirthdayReward,
    fetchDashboardData,
  } = useAuth();

  // Simplified, clear primary tabs: trips | kyc | wallet | support | profile
  const [primaryTab, setPrimaryTab] = useState<"trips" | "kyc" | "wallet" | "support" | "profile">("trips");
  const [walletSubTab, setWalletSubTab] = useState<"wallet" | "rewards" | "referral">("wallet");
  const [profileSubTab, setProfileSubTab] = useState<"profile" | "saved" | "reviews" | "settings" | "legal">("profile");

  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<any>(null);
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedBookingId, setCopiedBookingId] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchDashboardData();
    if (data) {
      setDashboardData(data);
    }
    setIsLoading(false);
  };

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/user/notifications?userId=${user.id}&userEmail=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setNotifications(data.data);
      }
    } catch {}
  };

  const handleMarkNotificationRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await fetch("/api/user/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId: user?.id, userEmail: user?.email }),
      });
    } catch {}
  };

  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch("/api/user/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "all", userId: user?.id, userEmail: user?.email }),
      });
    } catch {}
  };

  useEffect(() => {
    loadData();
    loadNotifications();
  }, []);

  // Backwards-compatible tab router for notifications
  const handleTabSwitch = (tab: string) => {
    if (tab === "bookings" || tab === "overview" || tab === "trips") setPrimaryTab("trips");
    else if (tab === "kyc") setPrimaryTab("kyc");
    else if (tab === "wallet") { setPrimaryTab("wallet"); setWalletSubTab("wallet"); }
    else if (tab === "rewards") { setPrimaryTab("wallet"); setWalletSubTab("rewards"); }
    else if (tab === "referral") { setPrimaryTab("wallet"); setWalletSubTab("referral"); }
    else if (tab === "support") setPrimaryTab("support");
    else if (tab === "profile") { setPrimaryTab("profile"); setProfileSubTab("profile"); }
    else if (tab === "saved") { setPrimaryTab("profile"); setProfileSubTab("saved"); }
    else if (tab === "reviews") { setPrimaryTab("profile"); setProfileSubTab("reviews"); }
    else if (tab === "settings") { setPrimaryTab("profile"); setProfileSubTab("settings"); }
    else if (tab === "legal") { setPrimaryTab("profile"); setProfileSubTab("legal"); }
    else setPrimaryTab("trips");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-[#b57d14]">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Sign In Required</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Please log in or register to access your personal Moar Cars customer portal, digital trip pass, KYC vault, and wallet.
          </p>
          <div className="pt-2">
            <Button
              onClick={() => onNavigate("/")}
              className="h-11 px-8 rounded-2xl bg-gradient-to-r from-[#d49b29] via-[#c88d18] to-[#b57d14] text-slate-950 font-black text-xs uppercase hover:opacity-95 shadow-md"
            >
              Go to Home &amp; Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentUser = dashboardData?.user || user;
  const profileProgress = dashboardData?.profileProgress ?? 80;
  const upcomingBookings = dashboardData?.upcomingBookings || [];
  const recentBookings = dashboardData?.recentBookings || [];
  const savedCars = dashboardData?.savedCars || [];
  const totalTripsCount = upcomingBookings.length + recentBookings.length;

  // Active / Upcoming Booking Hero Details
  const activeTrip = upcomingBookings[0] || null;
  const activeBookingId = activeTrip ? (activeTrip.bookingId || `MC-2026-${activeTrip.id}`) : "";
  const activeKeyPin = activeTrip ? String(
    activeTrip.pickupOtp ||
    activeTrip.keyPin ||
    Math.floor(1000 + (Math.abs(activeBookingId.split("").reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % 9000))
  ) : "1542";

  const activeGrandTotal = activeTrip ? Number(activeTrip.grandTotal || activeTrip.amount || 0) : 0;
  const activePaid = activeTrip ? Number(activeTrip.paidAmount !== undefined ? activeTrip.paidAmount : (activeTrip.advancePaid || activeGrandTotal)) : 0;
  const activeBalance = activeTrip ? Number(activeTrip.balanceDue !== undefined ? activeTrip.balanceDue : Math.max(0, activeGrandTotal - activePaid)) : 0;

  const handleCopyActiveId = () => {
    if (!activeBookingId) return;
    navigator.clipboard.writeText(activeBookingId);
    setCopiedBookingId(true);
    setTimeout(() => setCopiedBookingId(false), 2000);
  };

  const handleCopyActivePin = () => {
    navigator.clipboard.writeText(activeKeyPin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleShareWhatsApp = (trip: any, bId: string, pin: string) => {
    const text = encodeURIComponent(
      `🚗 *MOAR CARS TIRUPATI - DIGITAL TRIP PASS*\n\n` +
      `• *Booking ID:* #${bId}\n` +
      `• *Vehicle:* ${trip.carName || "Fleet Car"}\n` +
      `• *Pickup Hub:* ${trip.pickup || "Tirupati Central Hub"} (${trip.startDate})\n` +
      `• *Return Hub:* ${trip.dropLocation || trip.pickup || "Tirupati Central Hub"} (${trip.endDate})\n` +
      `• *Station Handover Key PIN:* ${pin}\n` +
      `• *Total Trip Fare:* ₹${activeGrandTotal.toLocaleString("en-IN")}\n` +
      `• *Advance Paid Online:* ₹${activePaid.toLocaleString("en-IN")}\n` +
      `• *Balance at Handover:* ₹${activeBalance.toLocaleString("en-IN")}\n\n` +
      `24/7 Helpline: +91 85000 12345 • www.moarcars.com`
    );
    window.open(`https://wa.me/918500012345?text=${text}`, "_blank");
  };

  // Direct Razorpay balance payment on dashboard
  const handlePayActiveBalance = async (bookingItem: any) => {
    if (activeBalance <= 0) {
      alert("This booking has already been fully paid!");
      return;
    }

    try {
      if (!(window as any).Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        await new Promise((res) => {
          script.onload = () => res(true);
          script.onerror = () => res(false);
          document.body.appendChild(script);
        });
      }

      const bRef = bookingItem.bookingId || `MC-2026-${bookingItem.id}`;
      const amountInPaise = Math.max(100, Math.round(activeBalance * 100));

      const options = {
        key: "rzp_test_SwedUUn1KgRMs0",
        amount: amountInPaise,
        currency: "INR",
        name: "MOAR CARS",
        description: `Remaining Balance Settlement: #${bRef}`,
        image: "https://moarcars.com/assets/moarcars-logo-DK578w77.png",
        prefill: {
          name: currentUser.name || "Guest",
          email: currentUser.email || "",
          contact: (currentUser.phone || "").replace(/\D/g, ""),
        },
        notes: {
          bookingId: bRef,
          carName: bookingItem.carName || "Vehicle",
        },
        theme: { color: "#0b1426" },
        handler: async function (response: any) {
          const paymentId = response.razorpay_payment_id || `rzp_bal_${Date.now()}`;
          await fetch("/api/bookings/pay-balance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: bRef,
              transactionId: paymentId,
              amountPaid: activeBalance,
              paymentMethod: "Razorpay",
            }),
          });
          loadData();
          alert(`Remaining balance of ₹${activeBalance.toLocaleString("en-IN")} successfully paid! Updated voucher emailed.`);
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e: any) {
      alert(e?.message || "Failed to initialize payment gateway.");
    }
  };

  const handleBookCar = (carName: string) => {
    if (onSelectCarToBook) onSelectCarToBook(carName);
    onNavigate("/#fleet");
  };

  const handleRemoveSavedCar = async (carId: number | string) => {
    await toggleFavoriteCar(carId);
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50/90 text-slate-900 flex flex-col font-sans">
      {/* 1. Top Luxury Navigation Header (Clean White & Sticky) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("/")}
              className="flex items-center gap-2 text-lg sm:text-xl font-black tracking-tight text-slate-900 hover:opacity-90"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-amber-400 font-black text-xs shadow-xs">
                M
              </span>
              <span>
                MOAR <span className="text-[#b57d14]">CARS</span>
              </span>
            </button>

            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-[#b57d14] uppercase tracking-wider">
              Customer Portal
            </span>
          </div>

          {/* Right Header Navigation Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationsDropdown
              notifications={notifications}
              onMarkRead={handleMarkNotificationRead}
              onMarkAllRead={handleMarkAllNotificationsRead}
              onNavigateTab={handleTabSwitch}
            />

            <Button
              variant="outline"
              onClick={() => onNavigate("/")}
              className="h-9 px-3 rounded-xl border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
            >
              <Home className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="h-9 w-9 rounded-xl overflow-hidden border border-amber-300 bg-amber-50 text-[#b57d14] font-bold text-sm flex items-center justify-center shrink-0">
                {currentUser.avatar && !currentUser.avatar.includes("unsplash.com") ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-[#b57d14]" />
                )}
              </div>

              <div className="hidden md:block text-left text-xs">
                <p className="font-bold text-slate-900 leading-tight truncate max-w-[120px]">{currentUser.name}</p>
                <p className="text-[10px] text-[#b57d14] font-semibold">{currentUser.loyaltyTier || "Gold VIP"}</p>
              </div>

              <button
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Body */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Welcome Banner Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Self-Drive Membership Active
                </span>
                <span className="text-[11px] font-bold text-slate-400">• Tirupati AP</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                Namaste, {currentUser.name}! 🙏
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                Manage your self-drive bookings, digital trip pass, KYC documents, Moar Wallet funds, and rewards.
              </p>
            </div>

            {/* Profile Completion Meter */}
            <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border-2 border-amber-400 text-slate-950 font-black text-xs shadow-2xs">
                {profileProgress}%
              </div>
              <div className="space-y-0.5 text-left">
                <p className="text-xs font-bold text-slate-900">Profile Completion</p>
                <p className="text-[10px] text-slate-500">
                  {profileProgress === 100
                    ? "Verified for express dispatch"
                    : "Complete profile for instant booking"}
                </p>
                {profileProgress < 100 && (
                  <button
                    onClick={() => {
                      setPrimaryTab("profile");
                      setProfileSubTab("profile");
                    }}
                    className="text-[11px] font-bold text-[#b57d14] hover:underline flex items-center gap-0.5 cursor-pointer pt-0.5"
                  >
                    Complete Profile <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 4 Stat Highlights Grid */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-5 border-t border-slate-100">
            {/* Stat 1: Active Trips */}
            <button
              onClick={() => setPrimaryTab("trips")}
              className={`text-left p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
                primaryTab === "trips"
                  ? "bg-amber-50/60 border-amber-300 shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100/70 border-slate-200"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Active Trips
              </span>
              <p className="mt-1 text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                <Car className="h-4 w-4 text-[#b57d14] shrink-0" />
                {upcomingBookings.length} Booked
              </p>
            </button>

            {/* Stat 2: Moar Wallet */}
            <button
              onClick={() => {
                setPrimaryTab("wallet");
                setWalletSubTab("wallet");
              }}
              className={`text-left p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
                primaryTab === "wallet" && walletSubTab === "wallet"
                  ? "bg-amber-50/60 border-amber-300 shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100/70 border-slate-200"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Moar Wallet
              </span>
              <p className="mt-1 text-sm sm:text-base font-black text-[#b57d14] flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-[#b57d14] shrink-0" />
                ₹{(currentUser.walletBalance || 0).toLocaleString("en-IN")}
              </p>
            </button>

            {/* Stat 3: Reward Coins */}
            <button
              onClick={() => {
                setPrimaryTab("wallet");
                setWalletSubTab("rewards");
              }}
              className={`text-left p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
                primaryTab === "wallet" && walletSubTab === "rewards"
                  ? "bg-amber-50/60 border-amber-300 shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100/70 border-slate-200"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Moar Coins
              </span>
              <p className="mt-1 text-sm sm:text-base font-black text-amber-700 flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-amber-600 shrink-0" />
                {(currentUser.rewardPoints || 100).toLocaleString("en-IN")}
              </p>
            </button>

            {/* Stat 4: KYC Status */}
            <button
              onClick={() => setPrimaryTab("kyc")}
              className={`text-left p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
                primaryTab === "kyc"
                  ? "bg-amber-50/60 border-amber-300 shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100/70 border-slate-200"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                KYC Status
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <ShieldCheck
                  className={`h-4 w-4 shrink-0 ${
                    currentUser.kycStatus === "Verified"
                      ? "text-emerald-600"
                      : currentUser.kycStatus === "Under Review"
                      ? "text-amber-600"
                      : "text-amber-500"
                  }`}
                />
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {currentUser.kycStatus === "Verified"
                    ? "Verified"
                    : currentUser.kycStatus === "Under Review"
                    ? "In Review"
                    : "Pending"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 3. Streamlined Primary Tab Navigation (Clear & Anti-Confusion) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-2xs overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 min-w-max sm:min-w-0 sm:grid sm:grid-cols-5">
            {[
              {
                id: "trips",
                label: "My Trips",
                count: totalTripsCount,
                icon: Car,
              },
              {
                id: "kyc",
                label: "KYC Documents",
                badge: currentUser.kycStatus === "Verified" ? "✓" : "!",
                icon: ShieldCheck,
              },
              {
                id: "wallet",
                label: "Wallet & Rewards",
                icon: Wallet,
              },
              {
                id: "support",
                label: "24/7 Support & RSA",
                icon: Headphones,
              },
              {
                id: "profile",
                label: "Profile & Settings",
                icon: Settings,
              },
            ].map((tabItem) => {
              const Icon = tabItem.icon;
              const isActive = primaryTab === tabItem.id;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => setPrimaryTab(tabItem.id as any)}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-slate-950 text-amber-400 font-black shadow-sm"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tabItem.label}</span>
                  {tabItem.count !== undefined && tabItem.count > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isActive ? "bg-amber-400 text-slate-950" : "bg-slate-200 text-slate-800"
                      }`}
                    >
                      {tabItem.count}
                    </span>
                  )}
                  {tabItem.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        tabItem.badge === "✓"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {tabItem.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. TAB CONTENT AREA */}

        {/* TAB 1: MY TRIPS & ACTIVE DIGITAL BOARDING PASS */}
        {primaryTab === "trips" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Active / Upcoming Boarding Pass Hero */}
            {activeTrip ? (
              <div className="bg-white rounded-3xl border-2 border-amber-400/80 shadow-lg overflow-hidden">
                {/* Top Gold Ribbon */}
                <div className="px-5 sm:px-7 py-3 bg-gradient-to-r from-[#d49b29] via-[#c88d18] to-[#b57d14] flex items-center justify-between text-slate-950 font-black">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-xs font-black text-amber-400 shadow-2xs">
                      M
                    </span>
                    <span className="text-xs sm:text-sm uppercase tracking-wider">
                      Official Digital Trip Pass
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-emerald-300 text-[10px] sm:text-xs font-bold border border-emerald-400/40 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Dispatch Ready
                  </span>
                </div>

                <div className="p-5 sm:p-7 space-y-5">
                  {/* Car & Handover Key PIN Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#b57d14] shrink-0">
                        <Car className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopyActiveId}
                            className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md hover:bg-amber-200 flex items-center gap-1 cursor-pointer"
                            title="Click to copy ID"
                          >
                            <span>Ref: #{activeBookingId}</span>
                            {copiedBookingId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 opacity-60" />}
                          </button>
                          <span className="text-[10px] font-bold text-slate-400">• Self-Drive</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                          {activeTrip.carName || "Fleet Vehicle"}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Duration: {activeTrip.totalDays || 1} Days • Unlimited KM
                        </p>
                      </div>
                    </div>

                    {/* Handover Key PIN Box */}
                    <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2 shadow-sm">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                          Station Handover PIN
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Quote at station key pickup
                        </span>
                      </div>
                      <button
                        onClick={handleCopyActivePin}
                        className="text-xl sm:text-2xl font-black font-mono tracking-widest text-amber-400 bg-slate-800 px-3 py-1 rounded-xl flex items-center gap-1.5 hover:bg-slate-700 cursor-pointer transition-colors"
                        title="Click to copy PIN"
                      >
                        <span>#{activeKeyPin}</span>
                        {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
                      </button>
                    </div>
                  </div>

                  {/* Pickup & Return Station Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup Station
                      </span>
                      <strong className="text-slate-900 block text-sm font-extrabold">
                        {activeTrip.pickup || activeTrip.pickupLocation || "Tirupati Central Station Hub"}
                      </strong>
                      <span className="text-slate-500 block text-[11px]">
                        📅 {activeTrip.startDate}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Return Station
                      </span>
                      <strong className="text-slate-900 block text-sm font-extrabold">
                        {activeTrip.dropLocation || activeTrip.pickup || "Tirupati Central Station Hub"}
                      </strong>
                      <span className="text-slate-500 block text-[11px]">
                        📅 {activeTrip.endDate}
                      </span>
                    </div>
                  </div>

                  {/* Payment Status Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                      <span className="text-slate-500 text-[10px] font-medium block">Total Fare (incl. 18% GST)</span>
                      <p className="text-base sm:text-lg font-black text-slate-900">₹{activeGrandTotal.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-0.5">
                      <span className="text-emerald-800 text-[10px] font-bold block">Advance Paid Online</span>
                      <p className="text-base sm:text-lg font-black text-emerald-700">₹{activePaid.toLocaleString("en-IN")}</p>
                    </div>
                    <div className={`p-3 rounded-xl border space-y-0.5 ${activeBalance > 0 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                      <span className={`text-[10px] font-bold block ${activeBalance > 0 ? "text-amber-800" : "text-emerald-800"}`}>
                        {activeBalance > 0 ? "Balance at Handover" : "Remaining Balance"}
                      </span>
                      <p className={`text-base sm:text-lg font-black ${activeBalance > 0 ? "text-amber-800" : "text-emerald-700"}`}>
                        ₹{activeBalance.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {activeBalance > 0 ? (
                      <Button
                        onClick={() => handlePayActiveBalance(activeTrip)}
                        className="h-11 rounded-xl bg-gradient-to-r from-[#d49b29] via-[#c88d18] to-[#b57d14] text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <CreditCard className="w-4 h-4" /> Pay ₹{activeBalance.toLocaleString("en-IN")} Online
                      </Button>
                    ) : (
                      <div className="h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fully Paid &amp; Settled
                      </div>
                    )}

                    <Button
                      onClick={() => setSelectedInvoiceBooking(activeTrip)}
                      className="h-11 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-amber-600" /> View GST Tax Invoice
                    </Button>

                    <Button
                      onClick={() => handleShareWhatsApp(activeTrip, activeBookingId, activeKeyPin)}
                      className="h-11 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-white" /> Save on WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            {/* All Trips List with Filter Tabs */}
            <BookingsSection
              upcomingBookings={upcomingBookings}
              recentBookings={recentBookings}
              onBrowseFleet={() => onNavigate("/#fleet")}
            />
          </div>
        )}

        {/* TAB 2: KYC & VERIFICATION */}
        {primaryTab === "kyc" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <KycSection
              user={currentUser}
              onKycUpdated={(updated) => setDashboardData((prev) => (prev ? { ...prev, user: updated } : null))}
              onUploadKyc={uploadKyc}
            />
          </div>
        )}

        {/* TAB 3: WALLET & REWARDS (UNIFIED HUB) */}
        {primaryTab === "wallet" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Sub-Tabs for Wallet Hub */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              {[
                { id: "wallet", label: "Moar Wallet", icon: Wallet },
                { id: "rewards", label: "Coins & Rewards", icon: Coins },
                { id: "referral", label: "Refer & Earn ₹500", icon: Gift },
              ].map((subItem) => {
                const SubIcon = subItem.icon;
                const isSubActive = walletSubTab === subItem.id;
                return (
                  <button
                    key={subItem.id}
                    onClick={() => setWalletSubTab(subItem.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSubActive
                        ? "bg-[#b57d14] text-white shadow-xs font-extrabold"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5" />
                    <span>{subItem.label}</span>
                  </button>
                );
              })}
            </div>

            {walletSubTab === "wallet" && (
              <WalletSection
                user={currentUser}
                onAddFunds={addWalletFunds}
                onRedeemCoins={redeemRewards}
              />
            )}

            {walletSubTab === "rewards" && (
              <RewardsSection
                user={currentUser}
                onRedeemCoins={redeemRewards}
                onClaimBirthday={claimBirthdayReward}
                onBookFleet={() => onNavigate("/#fleet")}
              />
            )}

            {walletSubTab === "referral" && (
              <ReferralSection
                user={currentUser}
                onBrowseFleet={() => onNavigate("/#fleet")}
              />
            )}
          </div>
        )}

        {/* TAB 4: 24/7 SUPPORT & RSA */}
        {primaryTab === "support" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <SupportSection
              user={currentUser}
              bookings={upcomingBookings.concat(recentBookings)}
              userTickets={dashboardData?.tickets}
            />
          </div>
        )}

        {/* TAB 5: PROFILE & SETTINGS */}
        {primaryTab === "profile" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Sub-Tabs for Profile Hub */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-200 scrollbar-none">
              {[
                { id: "profile", label: "My Profile", icon: User },
                { id: "saved", label: `Saved Cars (${savedCars.length})`, icon: Heart },
                { id: "reviews", label: "Trip Reviews", icon: Star },
                { id: "settings", label: "Account Settings", icon: Settings },
                { id: "legal", label: "Legal & Policies", icon: Scale },
              ].map((subItem) => {
                const SubIcon = subItem.icon;
                const isSubActive = profileSubTab === subItem.id;
                return (
                  <button
                    key={subItem.id}
                    onClick={() => setProfileSubTab(subItem.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isSubActive
                        ? "bg-slate-950 text-amber-400 shadow-xs font-extrabold"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5" />
                    <span>{subItem.label}</span>
                  </button>
                );
              })}
            </div>

            {profileSubTab === "profile" && (
              <ProfileSection
                user={currentUser}
                onProfileUpdated={(updated) => setDashboardData((prev) => (prev ? { ...prev, user: updated } : null))}
                onUpdateProfile={updateProfile}
              />
            )}

            {profileSubTab === "saved" && (
              <SavedCarsSection
                savedCars={savedCars}
                onRemoveSavedCar={handleRemoveSavedCar}
                onBookCar={handleBookCar}
                onBrowseFleet={() => onNavigate("/#fleet")}
              />
            )}

            {profileSubTab === "reviews" && (
              <ReviewsSection
                userReviews={dashboardData?.userReviews || []}
                completedBookings={upcomingBookings.concat(recentBookings)}
                onBrowseFleet={() => onNavigate("/#fleet")}
              />
            )}

            {profileSubTab === "settings" && (
              <SettingsSection
                user={currentUser}
                onProfileUpdated={(updated) =>
                  setDashboardData((prev) => (prev ? { ...prev, user: updated } : null))
                }
                onLogout={logout}
                onNavigateToTab={handleTabSwitch}
              />
            )}

            {profileSubTab === "legal" && <LegalSection />}
          </div>
        )}
      </main>

      {/* 5. GST Tax Invoice Modal */}
      {selectedInvoiceBooking && (
        <GstInvoiceModal
          isOpen={!!selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
          booking={selectedInvoiceBooking}
        />
      )}
    </div>
  );
};
