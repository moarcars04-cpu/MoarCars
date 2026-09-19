import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Phone,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  Compass,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./context/AuthContext";
import { CarGallerySection } from "./components/car-details/CarGallerySection";
import { CarInfoSpecsSection } from "./components/car-details/CarInfoSpecsSection";
import { PricingTiersCard } from "./components/car-details/PricingTiersCard";
import { LuxuryBookingPanel } from "./components/car-details/LuxuryBookingPanel";
import { SimilarAndRecommendedCars } from "./components/car-details/SimilarAndRecommendedCars";
import { FaqSection } from "./components/home/FaqSection";
import { AppDownloadSection } from "./components/home/AppDownloadSection";
import { Viewer360Modal } from "./components/home/360ViewerModal";
import { CompareModal } from "./components/home/CompareModal";

interface CarDetailsPageProps {
  carIdOrName?: string | number;
  onNavigate?: (path: string) => void;
}

export const CarDetailsPage: React.FC<CarDetailsPageProps> = ({ carIdOrName, onNavigate }) => {
  const { user, openAuthModal, logout, toggleFavoriteCar } = useAuth();

  const [fleet, setFleet] = useState<any[]>([]);
  const [currentCar, setCurrentCar] = useState<any | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [copiedShareNotice, setCopiedShareNotice] = useState(false);

  // Modals
  const [selected360Car, setSelected360Car] = useState<any | null>(null);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [carReviews, setCarReviews] = useState<any[]>([]);

  // Fetch live fleet data
  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setFleet(res.data);
          if (carIdOrName) {
            const found = res.data.find(
              (c: any) =>
                String(c.id) === String(carIdOrName) ||
                (c.name && c.name.toLowerCase().includes(String(carIdOrName).toLowerCase()))
            );
            setCurrentCar(found || res.data[0]);
          } else {
            setCurrentCar(res.data[0]);
          }
        }
      })
      .catch((err) => console.warn(err));
  }, [carIdOrName]);

  // Sync current car when ID / Name prop changes
  useEffect(() => {
    if (!carIdOrName || fleet.length === 0) return;
    const found = fleet.find(
      (c) =>
        String(c.id) === String(carIdOrName) ||
        (c.name && c.name.toLowerCase().includes(String(carIdOrName).toLowerCase()))
    );
    if (found) setCurrentCar(found);
  }, [carIdOrName, fleet]);

  // Fetch verified reviews specifically for this vehicle from database
  useEffect(() => {
    if (!currentCar?.id && !currentCar?.name) return;
    const params = new URLSearchParams();
    if (currentCar.id) params.set("carId", String(currentCar.id));
    if (currentCar.name) params.set("carName", currentCar.name);

    fetch(`/api/reviews?${params.toString()}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setCarReviews(res.data);
        } else {
          setCarReviews([]);
        }
      })
      .catch(() => setCarReviews([]));
  }, [currentCar?.id, currentCar?.name]);

  // Dynamic rating derived strictly from database reviews
  const dynamicRating = useMemo(() => {
    if (carReviews.length > 0) {
      const sum = carReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
      return (sum / carReviews.length).toFixed(1);
    }
    if (currentCar?.rating && Number(currentCar.rating) > 0 && currentCar?.reviewCount > 0) {
      return Number(currentCar.rating).toFixed(1);
    }
    return null;
  }, [carReviews, currentCar]);

  const dynamicReviewCount = useMemo(() => {
    return carReviews.length > 0 ? carReviews.length : (Number(currentCar?.reviewCount) || 0);
  }, [carReviews, currentCar]);

  // Wishlist state
  const wishlistIds = useMemo(() => {
    return user?.favoriteCars || [];
  }, [user]);

  const isSaved = wishlistIds.includes(currentCar?.id);

  // Toggle wishlist
  const handleToggleWishlist = async (carId: number | string) => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    await toggleFavoriteCar(carId);
  };

  // Toggle compare
  const handleToggleCompare = (car: any) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === car.id || c.name === car.name);
      if (exists) return prev.filter((c) => c.id !== car.id && c.name !== car.name);
      if (prev.length >= 3) {
        alert("Maximum 3 cars can be compared simultaneously.");
        return prev;
      }
      return [...prev, car];
    });
  };

  // Copy share URL
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShareNotice(true);
      setTimeout(() => setCopiedShareNotice(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-brand-cream text-brand-ink">
      {/* Top Luxury Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary-foreground/10 bg-brand-navy/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16 py-3.5 flex items-center justify-between">
          {/* Logo & Back button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (onNavigate) onNavigate("/");
                else window.history.back();
              }}
              className="text-white hover:text-brand-gold hover:bg-white/10 rounded-xl px-2.5 py-1.5 h-auto flex items-center gap-1 text-xs font-bold"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Fleet
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

          {/* Right Header Navigation & User Profile */}
          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompareModal(true)}
                className="h-9 rounded-xl border-brand-teal bg-brand-teal/10 text-xs font-bold text-brand-teal hover:bg-brand-teal hover:text-white"
              >
                Compare ({compareList.length})
              </Button>
            )}

            <a
              href="tel:+918500012345"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white px-2"
            >
              <Phone className="h-3.5 w-3.5 text-brand-gold" /> +91 85000 12345
            </a>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-slate-900/80 p-1 pl-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  <span className="text-brand-gold">{user.name.split(" ")[0]}</span>
                  <div className="h-7 w-7 rounded-full overflow-hidden border border-brand-gold bg-black shrink-0">
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-white/60 mr-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-amber-500/30 p-2 shadow-2xl space-y-1 text-xs z-50 animate-in fade-in">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onNavigate) onNavigate("/dashboard");
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left font-bold text-white hover:bg-white/10"
                    >
                      <LayoutDashboard className="h-4 w-4 text-brand-gold" />
                      <span>My Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onNavigate) onNavigate("/dashboard");
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left font-semibold text-white/80 hover:bg-white/10"
                    >
                      <CalendarDays className="h-4 w-4 text-brand-gold" />
                      <span>My Bookings</span>
                    </button>
                    <div className="border-t border-white/10 my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left font-bold text-rose-400 hover:bg-rose-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => openAuthModal("login")}
                className="h-9 rounded-xl border-amber-500/40 bg-amber-500/10 text-xs font-bold text-brand-gold hover:bg-amber-500/20"
              >
                <User className="h-3.5 w-3.5 mr-1" /> Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Vehicle Content or Empty State */}
      {!currentCar ? (
        <div className="pt-32 pb-24 max-w-[1600px] mx-auto px-4 sm:px-8 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-brand-gold">
            <Car className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-brand-navy">Vehicle Details Unavailable</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            This vehicle is currently not in the active database or has been updated by the administrator.
          </p>
          <Button
            onClick={() => {
              if (onNavigate) onNavigate("/cars");
              else window.history.back();
            }}
            className="h-10 px-6 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs"
          >
            Explore Available Cars
          </Button>
        </div>
      ) : (
        <>
          {/* Breadcrumb & Vehicle Title Header */}
          <div className="pt-20 pb-4 bg-card border-b border-border">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-3">
              {/* Breadcrumb row */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <a
                    href="/"
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate("/");
                      }
                    }}
                    className="hover:text-brand-navy"
                  >
                    Home
                  </a>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                  <span>Fleet</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                  <span className="font-bold text-brand-navy">{currentCar.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-mist hover:bg-brand-mist/80 text-brand-navy text-xs font-bold transition-colors"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>{copiedShareNotice ? "Link Copied!" : "Share"}</span>
                  </button>

                  {/* Wishlist button */}
                  <button
                    onClick={() => handleToggleWishlist(currentCar.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSaved
                        ? "bg-rose-500 text-white shadow"
                        : "bg-brand-mist hover:bg-brand-mist/80 text-brand-navy"
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
                    <span>{isSaved ? "Saved" : "Save Car"}</span>
                  </button>
                </div>
              </div>

              {/* Title & Ratings row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-brand-gold text-brand-navy text-[10px] font-black uppercase tracking-wider">
                      {currentCar.tag || currentCar.category || "Luxury"}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {currentCar.branch || "Tirupati Central Station Hub"}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight mt-1">
                    {currentCar.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                    {currentCar.detail}
                  </p>
                </div>

                {dynamicRating && dynamicReviewCount > 0 ? (
                  <div className="flex items-center gap-3 bg-brand-mist/60 px-4 py-3 rounded-2xl border border-border shrink-0">
                    <div className="h-8 w-8 rounded-xl bg-brand-gold text-brand-navy flex items-center justify-center font-black text-sm shadow">
                      ★
                    </div>
                    <div>
                      <span className="text-sm font-black text-brand-navy">{dynamicRating} / 5.0</span>
                      <span className="text-[10px] text-muted-foreground block">
                        {dynamicReviewCount} Verified {dynamicReviewCount === 1 ? "Review" : "Reviews"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 bg-brand-mist/60 px-4 py-3 rounded-2xl border border-border shrink-0">
                    <Sparkles className="h-4 w-4 text-brand-gold" />
                    <div>
                      <span className="text-xs font-black text-brand-navy">New Fleet Addition</span>
                      <span className="text-[10px] text-muted-foreground block">No reviews yet</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main 2-Column Details & Booking Grid */}
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column (8 cols): HD Gallery, Specs, Pricing Tiers, Ghat Advice, Real Reviews */}
              <div className="lg:col-span-8 space-y-12">
                {/* 1. HD Gallery */}
                <CarGallerySection car={currentCar} />

                {/* 2. Comprehensive Specs & Safety Matrix */}
                <CarInfoSpecsSection car={currentCar} />

                {/* 3. Multi-Duration Pricing Tiers Card */}
                <PricingTiersCard car={currentCar} />

                {/* 4. Ghat Road Guidelines for this Model */}
                <div className="p-6 rounded-3xl bg-brand-mist/40 border border-border space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-teal flex items-center gap-1.5">
                    <Compass className="h-4 w-4" /> Tirumala Ghat Road Guidelines
                  </span>
                  <h4 className="text-lg font-bold text-brand-navy">
                    Driving the {currentCar.name} to Tirumala Hills
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This vehicle is equipped with Hill-Hold Assist and automated braking sensors. Please observe TTD's minimum travel duration rule (28 mins Up-Ghat, 40 mins Down-Ghat). All required toll passes & FASTag are pre-calibrated.
                  </p>
                </div>

                {/* 5. Verified Customer Reviews for this specific car */}
                <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-teal flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-brand-gold fill-brand-gold" /> Customer Experiences
                      </span>
                      <h4 className="text-xl font-black text-brand-navy mt-1">
                        Verified Reviews for {currentCar.name}
                      </h4>
                    </div>
                    {dynamicRating && dynamicReviewCount > 0 && (
                      <div className="flex items-center gap-2 bg-brand-mist/50 px-4 py-2 rounded-2xl border border-border">
                        <span className="text-2xl font-black text-brand-navy">{dynamicRating}</span>
                        <div className="text-xs">
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3.5 w-3.5 ${
                                  s <= Math.round(Number(dynamicRating))
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {dynamicReviewCount} {dynamicReviewCount === 1 ? "trip review" : "trip reviews"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {carReviews.length > 0 ? (
                    <div className="space-y-4">
                      {carReviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-4 rounded-2xl bg-brand-mist/30 border border-border space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-brand-navy text-brand-gold flex items-center justify-center font-bold text-xs">
                                {(rev.customerName || "V").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-brand-navy block">
                                  {rev.customerName || "Verified Traveler"}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {rev.date || "Verified Trip"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3.5 w-3.5 ${
                                    star <= (Number(rev.rating) || 5)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {rev.comment && (
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              "{rev.comment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-brand-mist/20 border border-dashed border-border text-center space-y-2">
                      <p className="text-xs font-bold text-brand-navy">
                        No customer reviews yet for this vehicle
                      </p>
                      <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
                        Ratings and feedback are collected exclusively from verified customers after their vehicle pickup and return completion.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (4 cols): Sticky Luxury Booking Calculator Panel */}
              <div className="lg:col-span-4">
                <LuxuryBookingPanel
                  car={currentCar}
                  onNavigate={onNavigate}
                  onBookingSuccess={() => {
                    if (onNavigate) onNavigate("/dashboard");
                  }}
                />
              </div>
            </div>

            {/* Similar Cars & Recommendations */}
            <SimilarAndRecommendedCars
              currentCar={currentCar}
              allCars={fleet}
              wishlistIds={wishlistIds}
              compareList={compareList}
              onToggleWishlist={handleToggleWishlist}
              onToggleCompare={handleToggleCompare}
              onOpen360={(c) => setSelected360Car(c)}
              onSelectCar={(c) => {
                setCurrentCar(c);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />

            {/* FAQ Section */}
            <div className="mt-16">
              <FaqSection />
            </div>
          </div>
        </>
      )}

      {/* Mobile App Download */}
      <AppDownloadSection />

      {/* Luxury Footer */}
      <footer className="bg-brand-ink py-10 text-primary-foreground border-t border-white/10">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <p>© 2026 Moar Cars. All rights reserved. Self-Drive Car Rental Tirupati.</p>
          <div className="flex items-center gap-4">
            <span>Zero Deposit Delay Guarantee</span>
            <span>•</span>
            <span>Ghat Road Certified</span>
          </div>
        </div>
      </footer>

      {/* 360 Viewer Modal */}
      {selected360Car && (
        <Viewer360Modal
          carName={selected360Car.name}
          images={
            selected360Car.angle360Images && selected360Car.angle360Images.length > 0
              ? selected360Car.angle360Images
              : selected360Car.galleryImages && selected360Car.galleryImages.length > 0
              ? selected360Car.galleryImages
              : selected360Car.image
              ? [selected360Car.image]
              : []
          }
          onClose={() => setSelected360Car(null)}
          onBookNow={() => {
            const c = selected360Car;
            setSelected360Car(null);
            setCurrentCar(c);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <CompareModal
          cars={compareList}
          onClose={() => setShowCompareModal(false)}
          onRemoveFromCompare={(carId) => {
            setCompareList((prev) => prev.filter((c) => c.id !== carId));
          }}
          onBookCar={(carName) => {
            setShowCompareModal(false);
            const found = fleet.find((c) => c.name === carName);
            if (found) {
              setCurrentCar(found);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        />
      )}
    </main>
  );
};
export default CarDetailsPage;
