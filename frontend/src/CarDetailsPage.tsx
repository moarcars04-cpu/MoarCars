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

const defaultCars = [
  {
    id: 1,
    name: "Maruti Swift ZXi+",
    brand: "Maruti Suzuki",
    model: "Swift",
    variant: "ZXi Plus Dual Tone",
    detail: "Smart 5-seater hatchback, agile city commuter with touch infotainment & high fuel efficiency",
    price: "₹1,699",
    pricePerDay: 1699,
    tag: "Everyday",
    category: "Hatchback",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
    mileage: "22 km/l",
    color: "Pearl Arctic White",
    status: "Available",
    branch: "Tirupati Central Hub",
    location: "Tirupati Central Hub",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80",
    hasAC: true,
    hasGPS: true,
    freeCancellation: true,
    doorstepDelivery: true,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Honda City ZX Automatic",
    brand: "Honda",
    model: "City",
    variant: "ZX CVT Sunroof",
    detail: "Executive sedan with electric sunroof, leather upholstery, and ADAS Level 2 safety features",
    price: "₹2,199",
    pricePerDay: 2199,
    tag: "Comfort",
    category: "Sedan",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    mileage: "18 km/l",
    color: "Platinum White Pearl",
    status: "Available",
    branch: "Renigunta Airport Hub",
    location: "Renigunta Airport Hub",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    hasSunroof: true,
    hasAC: true,
    hasGPS: true,
    instantBooking: true,
    freeCancellation: true,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Mahindra Scorpio-N Z8L 4x4",
    brand: "Mahindra",
    model: "Scorpio-N",
    variant: "Z8L 4x4 Automatic Diesel",
    detail: "Dominant 7-seater luxury SUV, 4Xplorer terrain modes specifically tuned for Tirumala ghat roads",
    price: "₹2,499",
    pricePerDay: 2499,
    tag: "Popular",
    category: "SUV",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 7,
    mileage: "15 km/l",
    color: "Napoli Black",
    status: "Available",
    branch: "Tirupati Central Hub",
    location: "Tirupati Central Hub",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    hasSunroof: true,
    hasAC: true,
    hasGPS: true,
    instantBooking: true,
    doorstepDelivery: true,
    rating: 4.9,
  },
  {
    id: 4,
    name: "Toyota Innova Crysta ZX",
    brand: "Toyota",
    model: "Innova Crysta",
    variant: "2.4 ZX Captain Seats",
    detail: "Unmatched pilgrimage luxury, captain seats with climate control & generous luggage capacity",
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
    location: "Chandragiri Heritage Point",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    hasAC: true,
    hasGPS: true,
    instantBooking: true,
    freeCancellation: true,
    doorstepDelivery: true,
    rating: 5.0,
  },
  {
    id: 5,
    name: "Hyundai Creta SX(O)",
    brand: "Hyundai",
    model: "Creta",
    variant: "SX(O) Turbo DCT",
    detail: "Panoramic sunroof, ventilated front seats, premium Bose audio and effortless cruise control",
    price: "₹2,299",
    pricePerDay: 2299,
    tag: "Popular",
    category: "SUV",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    mileage: "17 km/l",
    color: "Ranger Khaki",
    status: "Available",
    branch: "Tirupati Central Hub",
    location: "Tirupati Central Hub",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    hasSunroof: true,
    hasAC: true,
    hasGPS: true,
    instantBooking: true,
    rating: 4.8,
  },
  {
    id: 6,
    name: "Tata Nexon EV Max",
    brand: "Tata",
    model: "Nexon EV",
    variant: "Max Empowered+ 405km Range",
    detail: "100% Zero-emission electric SUV with wireless charger, smart regenerative braking and fast charging",
    price: "₹2,099",
    pricePerDay: 2099,
    tag: "Electric",
    category: "Electric",
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 5,
    mileage: "405 km/charge",
    color: "Intensi Teal",
    status: "Available",
    branch: "Renigunta Airport Hub",
    location: "Renigunta Airport Hub",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    hasSunroof: true,
    hasAC: true,
    hasGPS: true,
    freeCancellation: true,
    rating: 4.9,
  },
  {
    id: 7,
    name: "BMW 3 Series Gran Limousine",
    brand: "BMW",
    model: "3 Series",
    variant: "330Li M Sport",
    detail: "Executive VIP chauffeur or self-drive luxury with Harman Kardon audio and ambient interior lounge",
    price: "₹6,999",
    pricePerDay: 6999,
    tag: "VIP Luxury",
    category: "Luxury",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    mileage: "14 km/l",
    color: "Portimao Blue",
    status: "Available",
    branch: "Renigunta Airport Hub",
    location: "Renigunta Airport Hub",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    hasSunroof: true,
    hasAC: true,
    hasGPS: true,
    instantBooking: true,
    freeCancellation: true,
    doorstepDelivery: true,
    rating: 5.0,
  },
  {
    id: 8,
    name: "Maruti Baleno Alpha",
    brand: "Maruti Suzuki",
    model: "Baleno",
    variant: "Alpha 1.2 DualJet",
    detail: "Compact economical hatchback with Heads-Up Display (HUD) and 360-degree view camera",
    price: "₹1,499",
    pricePerDay: 1499,
    tag: "Budget",
    category: "Hatchback",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
    mileage: "23 km/l",
    color: "Nexa Blue",
    status: "Available",
    branch: "Tirupati Central Hub",
    location: "Tirupati Central Hub",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    hasAC: true,
    hasGPS: true,
    freeCancellation: true,
    rating: 4.7,
  },
];

export const CarDetailsPage: React.FC<CarDetailsPageProps> = ({ carIdOrName, onNavigate }) => {
  const { user, openAuthModal, logout, toggleFavoriteCar } = useAuth();

  const [fleet, setFleet] = useState<any[]>(defaultCars);
  const [currentCar, setCurrentCar] = useState<any>(defaultCars[3]); // Default Toyota Innova
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [copiedShareNotice, setCopiedShareNotice] = useState(false);

  // Modals
  const [selected360Car, setSelected360Car] = useState<any | null>(null);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Fetch live fleet data
  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setFleet(res.data);
        }
      })
      .catch((err) => console.warn(err));
  }, []);

  // Sync current car when ID / Name prop changes
  useEffect(() => {
    if (!carIdOrName) return;
    const found = fleet.find(
      (c) =>
        String(c.id) === String(carIdOrName) ||
        c.name.toLowerCase().includes(String(carIdOrName).toLowerCase())
    );
    if (found) setCurrentCar(found);
  }, [carIdOrName, fleet]);

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
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

      {/* Breadcrumb & Vehicle Title Header */}
      <div className="pt-24 pb-6 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
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

            <div className="flex items-center gap-4 bg-brand-mist/60 px-4 py-3 rounded-2xl border border-border shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="h-8 w-8 rounded-xl bg-brand-gold text-brand-navy flex items-center justify-center font-black text-sm">
                  ★
                </div>
                <div>
                  <span className="text-sm font-black text-brand-navy">{currentCar.rating || "4.9"}</span>
                  <span className="text-[10px] text-muted-foreground block">140+ Trips</span>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-right">
                <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider block">Ghat Ready</span>
                <span className="text-xs font-bold text-brand-navy">TTD Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Details & Booking Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (8 cols): HD Gallery, Specs, Pricing Tiers, Ghat Advice */}
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
          </div>

          {/* Right Column (4 cols): Sticky Luxury Booking Calculator Panel */}
          <div className="lg:col-span-4">
            <LuxuryBookingPanel
              car={currentCar}
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

      {/* Mobile App Download */}
      <AppDownloadSection />

      {/* Luxury Footer */}
      <footer className="bg-brand-ink py-14 text-primary-foreground border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
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
          images={[
            selected360Car.image || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
          ]}
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
