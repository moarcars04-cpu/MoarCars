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
  Search,
  ShieldCheck,
  X,
  Heart,
  User,
  LogOut,
  LayoutDashboard,
  Scale,
  Sparkles,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./context/AuthContext";
import heroLuxuryImg from "@/assets/moar-hero-luxury.jpg";
import { MoarLogo } from "@/components/common/MoarLogo";

// Home Subcomponents
import { HeroSearch } from "./components/home/HeroSearch";
import { CollectionsSection } from "./components/home/CollectionsSection";
import { WhyChooseMoarSection } from "./components/home/WhyChooseMoarSection";
import { WeekendDealBanner } from "./components/home/WeekendDealBanner";
import { TestimonialsSection } from "./components/home/TestimonialsSection";
import { FleetSearchResults } from "./components/home/FleetSearchResults";
import { PopularHubsSection } from "./components/home/PopularHubsSection";
import { HowItWorksSection } from "./components/home/HowItWorksSection";
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
    name: "Lamborghini Huracán Evo",
    brand: "Lamborghini",
    model: "Huracán",
    variant: "LP 610-4 V10",
    detail: "Breathtaking 640hp naturally aspirated V10 supercar. Dynamic steering and active aerodynamics.",
    price: "₹24,999",
    pricePerDay: 24999,
    tag: "Supercar",
    category: "Supercar",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 2,
    mileage: "7 km/l",
    color: "Nero Noctis Black",
    status: "Available",
    branch: "Renigunta Airport Hub",
    location: "Renigunta Airport Hub",
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
    hasAC: true,
    hasGPS: true,
    instantBooking: true,
    doorstepDelivery: true,
    rating: 5.0,
  },
  {
    id: 2,
    name: "BMW X5 xDrive40i M Sport",
    brand: "BMW",
    model: "X5",
    variant: "xDrive40i M Sport",
    detail: "Commanding luxury SUV with TwinPower Turbo inline 6, panoramic sky lounge and air suspension.",
    price: "₹6,999",
    pricePerDay: 6999,
    tag: "VIP Luxury",
    category: "SUV",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    mileage: "12 km/l",
    color: "Phytonic Blue Metallic",
    status: "Available",
    branch: "Tirupati Central Hub",
    location: "Tirupati Central Hub",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    hasSunroof: true,
    hasAC: true,
    hasGPS: true,
    instantBooking: true,
    doorstepDelivery: true,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Mercedes-Benz E-Class Exclusive",
    brand: "Mercedes-Benz",
    model: "E-Class",
    variant: "E 220d AMG Line",
    detail: "Executive rear reclining lounge seating, Burmester 3D sound, and whisper-quiet road refinement.",
    price: "₹7,499",
    pricePerDay: 7499,
    tag: "Chauffeur",
    category: "Luxury",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 5,
    mileage: "16 km/l",
    color: "Polar White",
    status: "Available",
    branch: "Renigunta Airport Hub",
    location: "Renigunta Airport Hub",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    hasSunroof: true,
    hasAC: true,
    hasGPS: true,
    instantBooking: true,
    freeCancellation: true,
    rating: 5.0,
  },
  {
    id: 4,
    name: "Audi RS7 Sportback",
    brand: "Audi",
    model: "RS7",
    variant: "Performance Quattro",
    detail: "High-octane luxury grand tourer with matrix laser headlights and sport adaptive air suspension.",
    price: "₹14,999",
    pricePerDay: 14999,
    tag: "Performance",
    category: "Supercar",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 4,
    mileage: "9 km/l",
    color: "Daytona Grey Pearl",
    status: "Available",
    branch: "Tirupati Central Hub",
    location: "Tirupati Central Hub",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
    hasSunroof: true,
    hasAC: true,
    hasGPS: true,
    instantBooking: true,
    rating: 4.9,
  },
  {
    id: 5,
    name: "Porsche 911 Carrera GTS",
    brand: "Porsche",
    model: "911",
    variant: "Carrera GTS PDK",
    detail: "Iconic rear-engine precision sports car with sport chrono package and active sports exhaust.",
    price: "₹18,999",
    pricePerDay: 18999,
    tag: "Iconic",
    category: "Supercar",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 2,
    mileage: "10 km/l",
    color: "GT Silver Metallic",
    status: "Available",
    branch: "Renigunta Airport Hub",
    location: "Renigunta Airport Hub",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
    hasAC: true,
    hasGPS: true,
    instantBooking: true,
    rating: 5.0,
  },
  {
    id: 6,
    name: "Range Rover Autobiography",
    brand: "Range Rover",
    model: "Range Rover",
    variant: "Autobiography LWB",
    detail: "Peerless luxury flagship SUV. Executive Class seating with hot stone massage & all-wheel steering.",
    price: "₹16,999",
    pricePerDay: 16999,
    tag: "Flagship",
    category: "SUV",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 5,
    mileage: "11 km/l",
    color: "Santorini Black",
    status: "Available",
    branch: "Tirupati Central Hub",
    location: "Tirupati Central Hub",
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80",
    hasSunroof: true,
    hasAC: true,
    hasGPS: true,
    instantBooking: true,
    doorstepDelivery: true,
    rating: 5.0,
  },
  {
    id: 7,
    name: "Toyota Innova Crysta ZX",
    brand: "Toyota",
    model: "Innova Crysta",
    variant: "2.4 ZX Captain Seats",
    detail: "Unmatched pilgrimage luxury, captain seats with climate control & generous luggage capacity.",
    price: "₹3,499",
    pricePerDay: 3499,
    tag: "Pilgrimage",
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
    id: 8,
    name: "Mahindra Scorpio-N Z8L 4x4",
    brand: "Mahindra",
    model: "Scorpio-N",
    variant: "Z8L 4x4 Automatic Diesel",
    detail: "Dominant 7-seater luxury SUV, 4Xplorer terrain modes specifically tuned for Tirumala ghat roads.",
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
];

interface LandingPageProps {
  onNavigate?: (path: string, state?: any) => void;
  preselectedCar?: string;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { user, openAuthModal, logout, toggleFavoriteCar } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [fleet, setFleet] = useState<CarFleetItem[]>(fallbackFleet);
  const [isLoading, setIsLoading] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Search & Booking parameters
  const [searchParams, setSearchParams] = useState({
    pickup: "Tirupati Central Hub (Station)",
    dropoff: "Tirupati Central Hub (Station)",
    startDate: "2026-09-08",
    startTime: "09:00",
    endDate: "2026-09-10",
    endTime: "21:00",
  });

  // Recently viewed cars state
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
          const mapped = res.data.map((car: any) => ({
            ...car,
            pricePerDay: car.pricePerDay || parseInt(String(car.price || "1699").replace(/[^0-9]/g, ""), 10) || 1699,
            hasSunroof: car.hasSunroof ?? (car.name.includes("ZX") || car.name.includes("Scorpio") || car.name.includes("Creta") || car.name.includes("BMW") || car.name.includes("Mercedes")),
            hasGPS: car.hasGPS ?? true,
            hasAC: car.hasAC ?? true,
            instantBooking: car.instantBooking ?? true,
            freeCancellation: car.freeCancellation ?? true,
            doorstepDelivery: car.doorstepDelivery ?? true,
            rating: car.rating || 4.9,
          }));
          setFleet(mapped);
        }
      })
      .catch((err) => {
        console.warn("[Fleet API] Fallback fleet loaded:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleToggleWishlist = async (carId: number | string) => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    await toggleFavoriteCar(carId);
  };

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

  const handleOpen360 = (car: CarFleetItem) => {
    addRecentlyViewed(car);
    setSelected360Car(car);
  };

  const handleBookCar = (car: CarFleetItem) => {
    addRecentlyViewed(car);
    if (onNavigate) {
      onNavigate("/checkout", {
        car,
        pickup: searchParams.pickup,
        dropoff: searchParams.dropoff,
        startDate: searchParams.startDate,
        startTime: searchParams.startTime,
        endDate: searchParams.endDate,
        endTime: searchParams.endTime,
      });
    } else {
      setBookingTargetCar(car);
    }
  };

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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail("");
      setNewsletterSubscribed(false);
    }, 4000);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900 font-sans">
      {/* 1. Top Luxury Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100/90 shadow-sm transition-all">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 h-20 sm:h-24 flex items-center justify-between">
          {/* Logo (Increased Size & Prominence) */}
          <a href="#top" className="flex items-center gap-3 py-1 group" aria-label="MOAR CARS Home">
            <MoarLogo size="navbar" />
          </a>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-[13px] font-semibold uppercase tracking-[0.14em] text-slate-700">
            <a
              href="#top"
              className="text-[#c88d18] font-bold border-b-2 border-[#c88d18] pb-1 transition-colors"
            >
              Home
            </a>
            <a
              href="#search-results"
              className="hover:text-[#c88d18] transition-colors pb-1 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              Cars
            </a>
            <a
              href="#collections"
              className="hover:text-[#c88d18] transition-colors pb-1 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              Luxury Fleet
            </a>
            <a
              href="#weekend-deals"
              className="hover:text-[#c88d18] transition-colors pb-1 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              Deals
            </a>
            <a
              href="#why-choose-moar"
              className="hover:text-[#c88d18] transition-colors pb-1 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              About
            </a>
            <a
              href="#contact"
              className="hover:text-[#c88d18] transition-colors pb-1 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              Contact
            </a>
          </nav>

          {/* Right Action Icons & Book Now Button */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6">
            {/* Search Trigger */}
            <button
              onClick={() => {
                document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="p-2 text-slate-600 hover:text-[#c88d18] transition-colors"
              title="Search Cars"
              aria-label="Search fleet"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (!user) openAuthModal("login");
                else if (onNavigate) onNavigate("/dashboard");
              }}
              className="p-2 text-slate-600 hover:text-rose-500 transition-colors relative"
              title="Saved Cars"
            >
              <Heart className={`h-4.5 w-4.5 ${wishlistIds.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* User Profile dropdown / sign in */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-[#c88d18]">{user.name.split(" ")[0]}</span>
                  <div className="h-7 w-7 rounded-full overflow-hidden border border-[#c88d18] bg-slate-200 shrink-0">
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 p-2 shadow-2xl space-y-1 text-xs z-50 animate-in fade-in">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onNavigate) onNavigate("/dashboard");
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#c88d18]" />
                      <span>My Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onNavigate) onNavigate("/dashboard");
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <CalendarDays className="h-4 w-4 text-[#c88d18]" />
                      <span>My Bookings</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="text-xs font-bold text-slate-700 hover:text-[#c88d18] px-2.5 py-1.5"
              >
                Sign In
              </button>
            )}

            {/* Golden "Book Now →" Button */}
            <Button
              onClick={() => {
                document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-11 px-6 rounded-full bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#c88d18]/25 flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <span>Book Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <button
            className="p-2 text-slate-700 lg:hidden rounded-lg hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {menuOpen && (
          <nav className="mx-auto max-w-[1600px] px-6 py-5 bg-white border-t border-slate-100 grid gap-3.5 text-sm font-semibold text-slate-800 lg:hidden shadow-xl">
            <a href="#top" onClick={() => setMenuOpen(false)} className="text-[#c88d18] font-bold">
              Home
            </a>
            <a href="#search-results" onClick={() => setMenuOpen(false)}>
              Cars & Fleet
            </a>
            <a href="#collections" onClick={() => setMenuOpen(false)}>
              Luxury Fleet
            </a>
            <a href="#weekend-deals" onClick={() => setMenuOpen(false)}>
              Weekend Deals
            </a>
            <a href="#why-choose-moar" onClick={() => setMenuOpen(false)}>
              Why Choose MOAR?
            </a>
            <a href="#reviews" onClick={() => setMenuOpen(false)}>
              Customer Reviews
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact Us
            </a>
            {user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  if (onNavigate) onNavigate("/dashboard");
                }}
                className="text-left text-[#c88d18] font-bold flex items-center gap-2 pt-2 border-t border-slate-100"
              >
                <LayoutDashboard className="h-4 w-4" /> My Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openAuthModal("login");
                }}
                className="text-left text-[#c88d18] font-bold flex items-center gap-2 pt-2 border-t border-slate-100"
              >
                <User className="h-4 w-4" /> Sign In / Join MOAR
              </button>
            )}
          </nav>
        )}
      </header>

      {/* 2. Hero Section */}
      <section
        id="top"
        className="relative pt-28 sm:pt-36 pb-14 sm:pb-20 bg-gradient-to-b from-[#f8f9fc] via-white to-white overflow-hidden"
      >
        {/* Background Luxury Showroom Image & Accents */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroLuxuryImg}
            alt="MOAR CARS Luxury Showroom"
            className="w-full h-full object-cover object-right-bottom sm:object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30" />
        </div>

        {/* Floating Typography Watermarks */}
        <div className="absolute top-32 right-8 sm:right-16 z-0 hidden md:block text-right select-none pointer-events-none opacity-40">
          <div className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-700 leading-relaxed">
            LUXURY
            <br />
            FREEDOM
            <br />
            ANY DESTINATION
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 space-y-8 sm:space-y-10">
          {/* Left Title & CTA Hero Header */}
          <div className="max-w-2xl pt-6 sm:pt-10 space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-slate-900 tracking-tight leading-[1.05]">
              Drive Luxury.
              <br />
              Drive <span className="text-[#d49b29]">MOAR.</span>
            </h1>

            <p className="text-xs sm:text-sm font-medium text-slate-600 tracking-wide">
              Premium Car Rentals • Self Drive • Chauffeur Service • Airport Pickup
            </p>

            {/* Dual CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Button
                onClick={() => {
                  document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-12 px-7 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c88d18]/25 flex items-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <span>Explore Cars</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => {
                  document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-12 px-7 rounded-xl bg-[#0b1329] hover:bg-[#152345] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-black/15 flex items-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <span>Book Instantly</span>
              </Button>
            </div>

            {/* Tagline Rule */}
            <div className="pt-2 flex items-center gap-3">
              <div className="h-0.5 w-10 bg-[#c88d18]" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#c88d18]">
                DRIVE MORE. EXPLORE MORE.
              </span>
            </div>
          </div>

          {/* Cursive script floating badge */}
          <div className="flex justify-end pr-4 sm:pr-8">
            <span className="font-serif italic text-lg sm:text-2xl text-slate-400 font-normal tracking-wide select-none">
              More Than Just a Ride
            </span>
          </div>

          {/* Floating Search Widget Component & Stats Bar */}
          <HeroSearch onSearch={handleHeroSearch} />
        </div>
      </section>

      {/* 3. Our Luxury Collection Section */}
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
          onSelectBrand={(brand) => {
            document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>

      {/* 4. Why Choose MOAR? Section */}
      <div id="why-choose-moar">
        <WhyChooseMoarSection />
      </div>

      {/* 5. Weekend Luxury Deals Banner */}
      <div id="weekend-deals">
        <WeekendDealBanner
          onGrabDeal={() => {
            document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>

      {/* 6. What Our Customers Say Section */}
      <div id="reviews">
        <TestimonialsSection />
      </div>

      {/* 7. Interactive Fleet Search Results (Map, Grid, List & Live Filters) */}
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

      {/* 8. Popular Pickup Hubs */}
      <div id="hubs">
        <PopularHubsSection
          onSelectHub={(hub) => {
            setSearchParams((prev) => ({ ...prev, pickup: hub, dropoff: hub }));
            document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>

      {/* 9. 4-Step Booking Workflow */}
      <div id="how-it-works">
        <HowItWorksSection
          onStartBooking={() => {
            document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>

      {/* 10. Frequently Asked Questions */}
      <div id="faqs">
        <FaqSection />
      </div>

      {/* 11. Travel Guides & Blogs */}
      <BlogSection />

      {/* 12. App Download Banner */}
      <AppDownloadSection />

      {/* 13. Luxury Dark Footer */}
      <footer id="contact" className="bg-[#070e1c] text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Footer 4 Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1: Logo & Company Description */}
            <div className="space-y-4">
              <MoarLogo variant="light" size="lg" showTagline={true} />
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Premium car rentals for extraordinary journeys. Drive luxury, Drive MOAR.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="h-8 w-8 rounded-full border border-slate-700 bg-slate-900/80 flex items-center justify-center text-slate-400 hover:text-[#c88d18] hover:border-[#c88d18] transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="h-8 w-8 rounded-full border border-slate-700 bg-slate-900/80 flex items-center justify-center text-slate-400 hover:text-[#c88d18] hover:border-[#c88d18] transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="h-8 w-8 rounded-full border border-slate-700 bg-slate-900/80 flex items-center justify-center text-slate-400 hover:text-[#c88d18] hover:border-[#c88d18] transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="h-8 w-8 rounded-full border border-slate-700 bg-slate-900/80 flex items-center justify-center text-slate-400 hover:text-[#c88d18] hover:border-[#c88d18] transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <a href="#top" className="hover:text-[#c88d18] transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#search-results" className="hover:text-[#c88d18] transition-colors">
                    Cars
                  </a>
                </li>
                <li>
                  <a href="#collections" className="hover:text-[#c88d18] transition-colors">
                    Luxury Fleet
                  </a>
                </li>
                <li>
                  <a href="#weekend-deals" className="hover:text-[#c88d18] transition-colors">
                    Deals
                  </a>
                </li>
                <li>
                  <a href="#why-choose-moar" className="hover:text-[#c88d18] transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#c88d18] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Our Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                Our Services
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <a href="#search-results" className="hover:text-[#c88d18] transition-colors">
                    Self Drive
                  </a>
                </li>
                <li>
                  <a href="#search-results" className="hover:text-[#c88d18] transition-colors">
                    Chauffeur Service
                  </a>
                </li>
                <li>
                  <a href="#hubs" className="hover:text-[#c88d18] transition-colors">
                    Airport Pickup
                  </a>
                </li>
                <li>
                  <a href="#search-results" className="hover:text-[#c88d18] transition-colors">
                    Corporate Rentals
                  </a>
                </li>
                <li>
                  <a href="#search-results" className="hover:text-[#c88d18] transition-colors">
                    Long Term Rentals
                  </a>
                </li>
                <li>
                  <a href="#weekend-deals" className="hover:text-[#c88d18] transition-colors">
                    Special Offers
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Newsletter Subscription */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                Newsletter
              </h4>
              <p className="text-xs text-slate-400">
                Get the latest deals and luxury updates.
              </p>

              {newsletterSubscribed ? (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-400 font-semibold">
                  ✓ Thank you! You are subscribed to MOAR CARS updates.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#c88d18]"
                    />
                  </div>
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-105"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}

              {/* Tagline watermark */}
              <div className="pt-2 border-l border-slate-800 pl-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#d49b29] block">
                  DRIVE MORE.
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 block">
                  EXPLORE MORE.
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2024 MOAR CARS. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms & Conditions</span>
              <span className="hover:text-slate-300 cursor-pointer transition-colors">Sitemap</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals: 360 Viewer, Compare, Quick Booking */}
      {selected360Car && (
        <Viewer360Modal
          carName={selected360Car.name}
          images={[
            selected360Car.image || "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80",
          ]}
          onClose={() => setSelected360Car(null)}
          onBookNow={() => {
            const c = selected360Car;
            setSelected360Car(null);
            handleBookCar(c);
          }}
        />
      )}

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
