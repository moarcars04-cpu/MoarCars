import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Compass,
  Headphones,
  Menu,
  MapPin,
  Phone,
  Play,
  Search,
  ShieldCheck,
  Ticket,
  X,
  Users,
  Fuel,
  Gauge,
  Sparkles,
  CheckCircle2,
  Heart,
  User,
  LogOut,
  LayoutDashboard,
  Scale,
  History,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./context/AuthContext";
import heroImage from "@/assets/moar-hero.jpg";
import fleetImage from "@/assets/moar-fleet.jpg";

// Home Components
import { HeroSearch } from "./components/home/HeroSearch";
import { CollectionsSection } from "./components/home/CollectionsSection";
import { FleetSearchResults } from "./components/home/FleetSearchResults";
import { OffersSection } from "./components/home/OffersSection";
import { PopularHubsSection } from "./components/home/PopularHubsSection";
import { HowItWorksSection } from "./components/home/HowItWorksSection";
import { TestimonialsSection } from "./components/home/TestimonialsSection";
import { FaqSection } from "./components/home/FaqSection";
import { BlogSection } from "./components/home/BlogSection";
import { AppDownloadSection } from "./components/home/AppDownloadSection";
import { RecentlyViewedSection } from "./components/home/RecentlyViewedSection";
import { Viewer360Modal } from "./components/home/360ViewerModal";
import { CompareModal } from "./components/home/CompareModal";
import { QuickBookingModal } from "./components/home/QuickBookingModal";

export interface CarFleetItem {
  id?: number | string;
  name: string;
  brand?: string;
  model?: string;
  variant?: string;
  detail: string;
  price: string;
  pricePerDay?: number;
  tag: string;
  category: string;
  fuelType?: string;
  transmission?: string;
  seats?: number;
  mileage?: string;
  color?: string;
  status?: string;
  branch?: string;
  location?: string;
  image?: string;
  imagePosition?: string;
  hasSunroof?: boolean;
  hasGPS?: boolean;
  hasAC?: boolean;
  instantBooking?: boolean;
  freeCancellation?: boolean;
  doorstepDelivery?: boolean;
  rating?: number;
}

const fallbackFleet: CarFleetItem[] = [
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
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    hasAC: true,
    hasGPS: true,
    freeCancellation: true,
    rating: 4.7,
  },
];

interface LandingPageProps {
  onNavigate?: (path: string) => void;
  preselectedCar?: string;
}

export default function LandingPage({ onNavigate, preselectedCar }: LandingPageProps) {
  const { user, openAuthModal, logout, toggleFavoriteCar } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [fleet, setFleet] = useState<CarFleetItem[]>(fallbackFleet);
  const [isLoading, setIsLoading] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Search & Booking parameters
  const [searchParams, setSearchParams] = useState({
    pickup: "Tirupati Central Hub",
    dropoff: "Tirupati Central Hub",
    startDate: "2026-09-08",
    startTime: "09:00",
    endDate: "2026-09-10",
    endTime: "21:00",
  });

  // Recently viewed cars state (stored in localStorage for persistence)
  const [recentlyViewed, setRecentlyViewed] = useState<CarFleetItem[]>(() => {
    try {
      const saved = localStorage.getItem("moar_recently_viewed");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare List state (max 3 cars)
  const [compareList, setCompareList] = useState<CarFleetItem[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // 360 Viewer state
  const [selected360Car, setSelected360Car] = useState<CarFleetItem | null>(null);

  // Quick Booking modal state
  const [bookingTargetCar, setBookingTargetCar] = useState<CarFleetItem | null>(null);

  // Wishlist IDs list
  const wishlistIds = useMemo(() => {
    if (!user || !user.favoriteCars) return [];
    return user.favoriteCars;
  }, [user]);

  // Fetch live fleet data from backend API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch("/api/cars")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((res) => {
        if (!isMounted) return;
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          // Normalize car data with boolean flags & numbers
          const mapped = res.data.map((car: any) => ({
            ...car,
            pricePerDay: car.pricePerDay || parseInt(String(car.price || "1699").replace(/[^0-9]/g, ""), 10) || 1699,
            hasSunroof: car.hasSunroof ?? (car.name.includes("ZX") || car.name.includes("Scorpio") || car.name.includes("Creta") || car.name.includes("BMW")),
            hasGPS: car.hasGPS ?? true,
            hasAC: car.hasAC ?? true,
            instantBooking: car.instantBooking ?? (car.status === "Available"),
            freeCancellation: car.freeCancellation ?? true,
            doorstepDelivery: car.doorstepDelivery ?? true,
            rating: car.rating || 4.9,
          }));
          setFleet(mapped);
        }
      })
      .catch((err) => {
        console.warn("[Fleet API] Live fetch fallback enabled:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Save recently viewed car helper
  const addRecentlyViewed = (car: CarFleetItem) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((c) => c.id !== car.id && c.name !== car.name);
      const updated = [car, ...filtered].slice(0, 6);
      try {
        localStorage.setItem("moar_recently_viewed", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleClearRecentlyViewed = () => {
    setRecentlyViewed([]);
    try {
      localStorage.removeItem("moar_recently_viewed");
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Wishlist
  const handleToggleWishlist = async (carId: number | string) => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    await toggleFavoriteCar(carId);
  };

  // Toggle Compare
  const handleToggleCompare = (car: CarFleetItem) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === car.id || c.name === car.name);
      if (exists) {
        return prev.filter((c) => c.id !== car.id && c.name !== car.name);
      }
      if (prev.length >= 3) {
        alert("You can compare a maximum of 3 vehicles simultaneously.");
        return prev;
      }
      return [...prev, car];
    });
  };

  // Open 360 Viewer
  const handleOpen360 = (car: CarFleetItem) => {
    addRecentlyViewed(car);
    setSelected360Car(car);
  };

  // Trigger Booking Flow
  const handleBookCar = (car: CarFleetItem) => {
    addRecentlyViewed(car);
    setBookingTargetCar(car);
  };

  // Hero Search trigger
  const handleHeroSearch = (params: {
    pickup: string;
    dropoff: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    category?: string;
  }) => {
    setSearchParams(params);
    document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
  };

  // Hub selection handler
  const handleSelectHub = (hubName: string) => {
    setSearchParams((prev) => ({ ...prev, pickup: hubName, dropoff: hubName }));
    document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-brand-cream text-brand-ink">
      {/* Top Luxury Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary-foreground/10 bg-brand-navy/95 backdrop-blur-md">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <a
            href="#top"
            className="brand-mark flex items-center gap-2 text-xl tracking-tight text-primary-foreground font-black"
            aria-label="Moar Cars home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-gold text-sm text-brand-gold font-bold shadow-md shadow-brand-gold/20">
              M
            </span>
            <span>
              MOAR <span className="text-brand-gold">CARS</span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground/80 lg:flex">
            <a className="text-brand-gold font-bold" href="#top">
              Home
            </a>
            <a className="transition-colors hover:text-brand-gold" href="#search-results">
              Search Fleet
            </a>
            <a className="transition-colors hover:text-brand-gold" href="#collections">
              Collections
            </a>
            <a className="transition-colors hover:text-brand-gold" href="#offers">
              Coupons & Deals
            </a>
            <a className="transition-colors hover:text-brand-gold" href="#hubs">
              Pickup Hubs
            </a>
            <a className="transition-colors hover:text-brand-gold" href="#how-it-works">
              How it works
            </a>
            <a className="transition-colors hover:text-brand-gold" href="#reviews">
              Reviews
            </a>
            <a className="transition-colors hover:text-brand-gold" href="#faqs">
              FAQs
            </a>
            <a
              className="transition-colors hover:text-brand-gold"
              href="/admin"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("/admin");
                }
              }}
            >
              Admin
            </a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {/* Compare tray pill button */}
            {compareList.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompareModal(true)}
                className="h-9 rounded-xl border-brand-teal bg-brand-teal/10 text-xs font-bold text-brand-teal hover:bg-brand-teal hover:text-white transition-all flex items-center gap-1.5"
              >
                <Scale className="h-3.5 w-3.5" />
                <span>Compare ({compareList.length})</span>
              </Button>
            )}

            {/* Wishlist button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!user) openAuthModal("login");
                else if (onNavigate) onNavigate("/dashboard");
              }}
              className="h-9 rounded-xl border-amber-500/30 bg-white/5 text-xs font-bold text-white hover:bg-white/10 flex items-center gap-1.5"
            >
              <Heart className={`h-3.5 w-3.5 ${wishlistIds.length > 0 ? "fill-rose-500 text-rose-500" : "text-white"}`} />
              <span>Wishlist ({wishlistIds.length})</span>
            </Button>

            {/* 24/7 Phone */}
            <a
              href="tel:+918500012345"
              className="flex items-center gap-1.5 text-xs font-medium text-primary-foreground/85 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-brand-gold" /> +91 85000 12345
            </a>

            {/* User Logged In Dropdown or Sign In CTA */}
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
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-amber-500/30 p-2 shadow-2xl space-y-1 text-xs z-50 animate-in fade-in slide-in-from-top-2">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onNavigate) onNavigate("/dashboard");
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left font-bold text-white hover:bg-white/10 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-brand-gold" />
                      <span>My Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onNavigate) onNavigate("/dashboard");
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left font-semibold text-white/80 hover:bg-white/10 transition-colors"
                    >
                      <CalendarDays className="h-4 w-4 text-brand-gold" />
                      <span>My Bookings</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onNavigate) onNavigate("/dashboard");
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left font-semibold text-white/80 hover:bg-white/10 transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4 text-brand-gold" />
                      <span>KYC Verification</span>
                    </button>
                    <div className="border-t border-white/10 my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
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
                <User className="h-3.5 w-3.5 mr-1" /> Sign In / Join
              </Button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            className="rounded-xl p-2 text-primary-foreground lg:hidden hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <nav className="mx-auto max-w-7xl grid gap-3 px-5 pb-5 text-sm text-primary-foreground lg:hidden bg-brand-navy border-t border-white/10 pt-4">
            <a href="#search-results" onClick={() => setMenuOpen(false)}>
              Search Fleet
            </a>
            <a href="#collections" onClick={() => setMenuOpen(false)}>
              Collections
            </a>
            <a href="#offers" onClick={() => setMenuOpen(false)}>
              Deals & Coupons
            </a>
            <a href="#hubs" onClick={() => setMenuOpen(false)}>
              Pickup Hubs
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <a href="#reviews" onClick={() => setMenuOpen(false)}>
              Reviews
            </a>
            <a href="#faqs" onClick={() => setMenuOpen(false)}>
              FAQs
            </a>
            {user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  if (onNavigate) onNavigate("/dashboard");
                }}
                className="text-left text-brand-gold font-bold flex items-center gap-2 pt-2 border-t border-white/10"
              >
                <LayoutDashboard className="h-4 w-4" /> My Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openAuthModal("login");
                }}
                className="text-left text-brand-gold font-bold flex items-center gap-2 pt-2 border-t border-white/10"
              >
                <User className="h-4 w-4" /> Sign In / Register
              </button>
            )}
            <a
              href="/admin"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("/admin");
                }
                setMenuOpen(false);
              }}
              className="text-white/60 hover:text-brand-gold"
            >
              Admin Area
            </a>
          </nav>
        )}
      </header>

      {/* Hero Section with HeroSearch */}
      <section id="top" className="relative min-h-[90vh] flex items-center pt-24 pb-16 bg-brand-navy text-primary-foreground">
        <img
          src={heroImage}
          alt="SUV driving through the Tirupati hills"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
          width={1600}
          height={900}
        />
        <div className="hero-wash absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-brand-navy/80 to-brand-cream/20 pointer-events-none" />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-between gap-12 z-10">
          <div className="grid max-w-3xl gap-4 pt-6">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              <span className="gold-rule" /> Tirupati&apos;s #1 Self-Drive Car Rental
            </div>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Your Journey. <br />
              Your Car. <br />
              <span className="text-brand-gold">Your Sacred Way.</span>
            </h1>
            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-primary-foreground/80">
              Sanitized luxury SUVs, sedans, and hatchbacks with 24/7 airport and railway station doorstep delivery. Experience Tirumala, Chandragiri, and Andhra Pradesh on your terms.
            </p>
          </div>

          {/* Hero Search Box */}
          <HeroSearch onSearch={handleHeroSearch} />
        </div>
      </section>

      {/* Recently Viewed Cars Tray (if any) */}
      <RecentlyViewedSection
        recentlyViewedCars={recentlyViewed}
        wishlistIds={wishlistIds}
        compareList={compareList}
        onToggleWishlist={handleToggleWishlist}
        onToggleCompare={handleToggleCompare}
        onOpen360={handleOpen360}
        onBookCar={handleBookCar}
        onViewDetails={(car) => onNavigate?.(`/car/${car.id || car.name}`)}
        onClearHistory={handleClearRecentlyViewed}
      />

      {/* Best Offers & Coupons Section */}
      <div id="offers">
        <OffersSection />
      </div>

      {/* Signature Collections Section */}
      <div id="collections">
        <CollectionsSection
          fleet={fleet}
          wishlistIds={wishlistIds}
          compareList={compareList}
          onToggleWishlist={handleToggleWishlist}
          onToggleCompare={handleToggleCompare}
          onOpen360={handleOpen360}
          onBookCar={handleBookCar}
          onViewDetails={(car) => onNavigate?.(`/car/${car.id || car.name}`)}
        />
      </div>

      {/* Interactive Fleet Search Results (Map, Grid, List & Filters) */}
      <div id="search-results">
        <FleetSearchResults
          fleet={fleet}
          searchPickup={searchParams.pickup}
          wishlistIds={wishlistIds}
          compareList={compareList}
          onToggleWishlist={handleToggleWishlist}
          onToggleCompare={handleToggleCompare}
          onOpen360={handleOpen360}
          onBookCar={handleBookCar}
          onViewDetails={(car) => onNavigate?.(`/car/${car.id || car.name}`)}
        />
      </div>

      {/* Popular Pickup Hubs in Tirupati & AP */}
      <div id="hubs">
        <PopularHubsSection onSelectHub={handleSelectHub} />
      </div>

      {/* How It Works Workflow */}
      <div id="how-it-works">
        <HowItWorksSection
          onStartBooking={() => {
            document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>

      {/* Verified Reviews & Testimonials */}
      <div id="reviews">
        <TestimonialsSection />
      </div>

      {/* Frequently Asked Questions */}
      <div id="faqs">
        <FaqSection />
      </div>

      {/* Travel Journal & Guides */}
      <BlogSection />

      {/* iOS / Android Mobile App Download */}
      <AppDownloadSection />

      {/* Luxury Footer */}
      <footer className="bg-brand-ink py-16 text-primary-foreground border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 border-b border-primary-foreground/15 pb-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="space-y-4">
              <a href="#top" className="brand-mark flex items-center gap-2 text-xl font-black">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-gold text-sm text-brand-gold font-bold">
                  M
                </span>
                MOAR <span className="text-brand-gold">CARS</span>
              </a>
              <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-primary-foreground/60">
                Tirupati's premier self-drive mobility service. Transparent pricing, sanitized fleet, ghat-road compliance, and instant security deposit refunds.
              </p>
              <div className="flex items-center gap-2 text-xs text-primary-foreground/70">
                <MapPin className="h-4 w-4 text-brand-gold shrink-0" />
                <span>Station Road, Tirupati, Andhra Pradesh 517501</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">Quick Links</h3>
              <div className="mt-4 grid gap-2.5 text-xs text-primary-foreground/70">
                <a href="#search-results" className="hover:text-brand-gold transition-colors">
                  Search All Cars
                </a>
                <a href="#collections" className="hover:text-brand-gold transition-colors">
                  Luxury & SUV Fleets
                </a>
                <a href="#offers" className="hover:text-brand-gold transition-colors">
                  Coupons & Promos
                </a>
                <a href="#hubs" className="hover:text-brand-gold transition-colors">
                  Airport & Station Hubs
                </a>
                <a href="#how-it-works" className="hover:text-brand-gold transition-colors">
                  4-Step Booking Guide
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">Account & Trust</h3>
              <div className="mt-4 grid gap-2.5 text-xs text-primary-foreground/70">
                {user ? (
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate("/dashboard");
                    }}
                    className="text-left text-brand-gold hover:underline"
                  >
                    My User Dashboard
                  </button>
                ) : (
                  <button onClick={() => openAuthModal("login")} className="text-left text-brand-gold hover:underline">
                    Sign In / Register
                  </button>
                )}
                <a href="#reviews" className="hover:text-brand-gold transition-colors">
                  Customer Reviews
                </a>
                <a href="#faqs" className="hover:text-brand-gold transition-colors">
                  Deposit & Fuel FAQs
                </a>
                <a
                  href="/admin"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate("/admin");
                    }
                  }}
                  className="hover:text-brand-gold transition-colors"
                >
                  Admin Portal
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">24/7 Tirupati Desk</h3>
              <a
                href="tel:+918500012345"
                className="mt-4 flex items-center gap-2 text-xs font-bold text-white hover:text-brand-gold"
              >
                <Phone className="h-4 w-4 text-brand-gold" /> +91 85000 12345
              </a>
              <p className="mt-2 text-[11px] text-primary-foreground/50">
                Roadside Assistance & Flight Arrival Handover Desk available 24 hours a day, 7 days a week.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 pt-8 text-xs text-primary-foreground/40 sm:flex-row">
            <p>© 2026 Moar Cars Private Limited. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Tirumala Ghat Guidelines</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 360 Viewer Modal */}
      {selected360Car && (
        <Viewer360Modal
          carName={selected360Car.name}
          images={[
            selected360Car.image || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
          ]}
          onClose={() => setSelected360Car(null)}
          onBookNow={() => {
            const c = selected360Car;
            setSelected360Car(null);
            handleBookCar(c);
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
            if (found) handleBookCar(found);
          }}
        />
      )}

      {/* Quick Booking Modal */}
      {bookingTargetCar && (
        <QuickBookingModal
          car={bookingTargetCar}
          pickup={searchParams.pickup}
          startDate={searchParams.startDate}
          endDate={searchParams.endDate}
          onClose={() => setBookingTargetCar(null)}
          onBookingSuccess={() => {
            setBookingTargetCar(null);
            if (onNavigate) onNavigate("/dashboard");
          }}
        />
      )}
    </main>
  );
}
