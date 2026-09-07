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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { UserProfile, UserDashboardData, BookingItem } from "../../types/user";
import { KycSection } from "./KycSection";
import { BookingsSection } from "./BookingsSection";
import { ProfileSection } from "./ProfileSection";
import { WalletSection } from "./WalletSection";
import { SavedCarsSection } from "./SavedCarsSection";
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
    fetchDashboardData,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "kyc" | "profile" | "saved" | "wallet">("overview");
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchDashboardData();
    if (data) {
      setDashboardData(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-brand-gold">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black">Sign In Required</h2>
          <p className="text-xs text-white/60">
            Please log in or register to access your personal Moar Cars customer dashboard, KYC records, and trips.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              onClick={() => onNavigate("/")}
              className="h-10 px-6 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft"
            >
              Go to Home & Sign In
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

  const handleBookCar = (carName: string) => {
    if (onSelectCarToBook) onSelectCarToBook(carName);
    onNavigate("/#booking");
  };

  const handleRemoveSavedCar = async (carId: number | string) => {
    await toggleFavoriteCar(carId);
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col">
      {/* Top Luxury Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1120]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate("/")}
              className="flex items-center gap-2 text-xl font-black tracking-tight text-white hover:opacity-90"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-gold text-sm text-brand-gold font-bold">
                M
              </span>
              <span>
                MOAR <span className="text-brand-gold">CARS</span>
              </span>
            </button>

            <span className="hidden sm:inline-block rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-brand-gold uppercase tracking-wider">
              Customer Portal
            </span>
          </div>

          {/* Right Header Elements */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="outline"
              onClick={() => onNavigate("/")}
              className="h-9 px-3 rounded-xl border-white/20 bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 flex items-center gap-1.5"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="h-9 w-9 rounded-full overflow-hidden border border-brand-gold/60 bg-black shrink-0">
                <img
                  src={
                    currentUser.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                  }
                  alt={currentUser.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="hidden md:block text-left text-xs">
                <p className="font-bold text-white leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-brand-gold font-semibold">{currentUser.loyaltyTier || "Bronze VIP"}</p>
              </div>

              <button
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-white/70 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Overview Stats Bar */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
                  Self-Drive Membership Active
                </p>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                Namaste, {currentUser.name}! 🙏
              </h1>
              <p className="text-xs sm:text-sm text-white/60 max-w-xl">
                Manage your self-drive bookings, KYC documents, Moar Wallet funds, and rewards for Tirupati trips.
              </p>
            </div>

            {/* Profile Completion Meter */}
            <div className="flex items-center gap-4 rounded-2xl bg-slate-950/80 border border-white/10 p-4 shrink-0">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 border-2 border-brand-gold text-brand-gold font-black text-sm">
                {profileProgress}%
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">Profile Completion</p>
                <p className="text-[10px] text-white/60">
                  {profileProgress === 100
                    ? "All details completed & verified!"
                    : "Complete remaining details for instant booking."}
                </p>
                {profileProgress < 100 && (
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="text-[11px] font-bold text-brand-gold hover:underline flex items-center gap-1"
                  >
                    Complete Profile <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 4 Stat Highlights Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
            {/* Stat 1: KYC Status */}
            <button
              onClick={() => setActiveTab("kyc")}
              className="text-left p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-brand-gold/40 transition-all"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">KYC Status</p>
              <div className="mt-1 flex items-center gap-1.5">
                <ShieldCheck
                  className={`h-4 w-4 ${
                    currentUser.kycStatus === "Verified"
                      ? "text-emerald-400"
                      : currentUser.kycStatus === "Under Review"
                      ? "text-brand-gold"
                      : "text-rose-400"
                  }`}
                />
                <span className="text-sm font-bold text-white">
                  {currentUser.kycStatus === "Verified"
                    ? "Verified"
                    : currentUser.kycStatus === "Under Review"
                    ? "Under Review"
                    : currentUser.kycStatus === "Rejected"
                    ? "Rejected"
                    : "Pending"}
                </span>
              </div>
            </button>

            {/* Stat 2: Wallet Balance */}
            <button
              onClick={() => setActiveTab("wallet")}
              className="text-left p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-brand-gold/40 transition-all"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Moar Wallet</p>
              <p className="mt-1 text-sm font-black text-brand-gold">
                ₹{(currentUser.walletBalance || 0).toLocaleString("en-IN")}
              </p>
            </button>

            {/* Stat 3: Reward Coins */}
            <button
              onClick={() => setActiveTab("wallet")}
              className="text-left p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-brand-gold/40 transition-all"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Moar Coins</p>
              <p className="mt-1 text-sm font-black text-sky-400 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                {(currentUser.rewardPoints || 100).toLocaleString("en-IN")}
              </p>
            </button>

            {/* Stat 4: Upcoming Trips */}
            <button
              onClick={() => setActiveTab("bookings")}
              className="text-left p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-brand-gold/40 transition-all"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Active Trips</p>
              <p className="mt-1 text-sm font-black text-white flex items-center gap-1">
                <Car className="h-3.5 w-3.5 text-brand-gold" />
                {upcomingBookings.length} Booked
              </p>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: Home },
            { id: "bookings", label: `My Bookings (${upcomingBookings.length})`, icon: CalendarDays },
            { id: "kyc", label: "KYC Documents", icon: ShieldCheck },
            { id: "profile", label: "My Profile", icon: User },
            { id: "saved", label: `Saved Cars (${savedCars.length})`, icon: Heart },
            { id: "wallet", label: "Wallet & Rewards", icon: Wallet },
          ].map((tabItem) => {
            const Icon = tabItem.icon;
            const isActive = activeTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                onClick={() => setActiveTab(tabItem.id as any)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-brand-gold text-brand-navy shadow-lg shadow-amber-900/20 font-black"
                    : "bg-slate-900/80 border border-white/10 text-white/70 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tabItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Active Booking Hero Banner if exists */}
            {upcomingBookings.length > 0 ? (
              <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-brand-navy shadow">
                    <Car className="h-7 w-7" />
                  </div>
                  <div>
                    <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Upcoming Confirmed Trip
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{upcomingBookings[0].carName}</h3>
                    <p className="text-xs text-white/70 mt-0.5">
                      Pickup: <span className="text-white font-bold">{upcomingBookings[0].pickup}</span> · {upcomingBookings[0].startDate} to {upcomingBookings[0].endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setActiveTab("bookings")}
                    className="h-10 px-5 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft"
                  >
                    View Trip Details & Invoice
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center space-y-3">
                <h3 className="text-lg font-bold text-white">Ready for your next pilgrimage or road trip?</h3>
                <p className="text-xs text-white/60 max-w-md mx-auto">
                  Choose from luxury SUVs, executive sedans, and smart hatchbacks ready at Tirupati Central Station Hub and Airport.
                </p>
                <Button
                  onClick={() => onNavigate("/#fleet")}
                  className="h-10 px-6 rounded-xl bg-brand-gold text-brand-navy font-extrabold text-xs uppercase tracking-wide hover:bg-brand-gold-soft"
                >
                  Book a Self-Drive Car <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            )}

            {/* Quick 3 Actions Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: KYC Action */}
              <div
                onClick={() => setActiveTab("kyc")}
                className="cursor-pointer rounded-2xl border border-white/10 bg-slate-900/80 p-5 hover:border-brand-gold/50 transition-all shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-brand-gold">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-brand-gold flex items-center gap-1">
                    Manage <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">KYC Verification Vault</h4>
                  <p className="text-xs text-white/60 mt-1">
                    Driving License, Aadhaar, and selfie status for seamless express vehicle dispatch.
                  </p>
                </div>
              </div>

              {/* Card 2: Wallet Action */}
              <div
                onClick={() => setActiveTab("wallet")}
                className="cursor-pointer rounded-2xl border border-white/10 bg-slate-900/80 p-5 hover:border-brand-gold/50 transition-all shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-brand-gold flex items-center gap-1">
                    Top Up <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Moar Wallet & Points</h4>
                  <p className="text-xs text-white/60 mt-1">
                    Add balance with zero fees, redeem reward coins, and share referral codes.
                  </p>
                </div>
              </div>

              {/* Card 3: Saved Cars Action */}
              <div
                onClick={() => setActiveTab("saved")}
                className="cursor-pointer rounded-2xl border border-white/10 bg-slate-900/80 p-5 hover:border-brand-gold/50 transition-all shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                    <Heart className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-brand-gold flex items-center gap-1">
                    View ({savedCars.length}) <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Favorite Fleet Cars</h4>
                  <p className="text-xs text-white/60 mt-1">
                    Quickly reserve your favorite models whenever you visit Tirumala or Horsley Hills.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <BookingsSection
            upcomingBookings={upcomingBookings}
            recentBookings={recentBookings}
            onBrowseFleet={() => onNavigate("/#fleet")}
          />
        )}

        {activeTab === "kyc" && (
          <KycSection
            user={currentUser}
            onKycUpdated={(updated) => setDashboardData((prev) => (prev ? { ...prev, user: updated } : null))}
            onUploadKyc={uploadKyc}
          />
        )}

        {activeTab === "profile" && (
          <ProfileSection
            user={currentUser}
            onProfileUpdated={(updated) => setDashboardData((prev) => (prev ? { ...prev, user: updated } : null))}
            onUpdateProfile={updateProfile}
          />
        )}

        {activeTab === "saved" && (
          <SavedCarsSection
            savedCars={savedCars}
            onRemoveSavedCar={handleRemoveSavedCar}
            onBookCar={handleBookCar}
            onBrowseFleet={() => onNavigate("/#fleet")}
          />
        )}

        {activeTab === "wallet" && (
          <WalletSection
            user={currentUser}
            onAddFunds={addWalletFunds}
            onRedeemCoins={redeemRewards}
          />
        )}
      </div>
    </div>
  );
};
