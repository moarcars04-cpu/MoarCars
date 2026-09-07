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
import heroLuxuryImg from "@/assets/hero.png";
import { MoarLogo } from "@/components/common/MoarLogo";

// Home Subcomponents
import { HeroSearch, TrustBadgesBar } from "./components/home/HeroSearch";
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

import { DEFAULT_DATABASE_CARS } from "@/data/defaultCars";

const fallbackFleet: CarFleetItem[] = DEFAULT_DATABASE_CARS;

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
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-16 sm:h-18 flex items-center justify-between">
          {/* Logo (Prominently Scaled inside Compact Navbar) */}
          <a href="#top" className="flex items-center gap-2 py-0.5 group" aria-label="MOAR CARS Home">
            <MoarLogo size="navbar" />
          </a>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-[12px] xl:text-[13px] font-bold uppercase tracking-[0.15em] text-slate-700">
            <a
              href="#top"
              className="text-[#c88d18] font-black border-b-2 border-[#c88d18] pb-0.5 transition-colors"
            >
              HOME
            </a>
            <a
              href="/cars"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("/cars");
                }
              }}
              className="hover:text-[#c88d18] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              CARS
            </a>
            <a
              href="#collections"
              className="hover:text-[#c88d18] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              LUXURY FLEET
            </a>
            <a
              href="#weekend-deals"
              className="hover:text-[#c88d18] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              DEALS
            </a>
            <a
              href="#why-choose-moar"
              className="hover:text-[#c88d18] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              ABOUT
            </a>
            <a
              href="#contact"
              className="hover:text-[#c88d18] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              CONTACT
            </a>
          </nav>

          {/* Right Action Icons & Book Now Button */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5">
            {/* Search Trigger */}
            <button
              onClick={() => {
                document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="p-1.5 text-slate-600 hover:text-[#c88d18] transition-colors"
              title="Search Cars"
              aria-label="Search fleet"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (!user) openAuthModal("login");
                else if (onNavigate) onNavigate("/dashboard");
              }}
              className="p-1.5 text-slate-600 hover:text-rose-500 transition-colors relative"
              title="Saved Cars"
            >
              <Heart className={`h-4 w-4 ${wishlistIds.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
              {wishlistIds.length > 0 && (
                <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* User Profile dropdown / sign in */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 px-3 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-[#c88d18]">{user.name.split(" ")[0]}</span>
                  <div className="h-6 w-6 rounded-full overflow-hidden border border-[#c88d18] bg-slate-200 shrink-0">
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
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
                className="text-xs font-bold text-slate-700 hover:text-[#c88d18] px-2 py-1"
              >
                Sign In
              </button>
            )}

            {/* Golden "BOOK NOW →" Button */}
            <Button
              onClick={() => {
                document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-10 px-5 rounded-full bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#c88d18]/25 flex items-center gap-1.5 transition-transform hover:scale-[1.02]"
            >
              <span>BOOK NOW</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <button
            className="p-2 text-slate-700 lg:hidden rounded-lg hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {menuOpen && (
          <nav className="mx-auto max-w-[1600px] px-6 py-4 bg-white border-t border-slate-100 grid gap-3 text-sm font-semibold text-slate-800 lg:hidden shadow-xl">
            <a href="#top" onClick={() => setMenuOpen(false)} className="text-[#c88d18] font-bold">
              HOME
            </a>
            <a
              href="/cars"
              onClick={(e) => {
                setMenuOpen(false);
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("/cars");
                }
              }}
            >
              CARS
            </a>
            <a href="#collections" onClick={() => setMenuOpen(false)}>
              LUXURY FLEET
            </a>
            <a href="#weekend-deals" onClick={() => setMenuOpen(false)}>
              DEALS
            </a>
            <a href="#why-choose-moar" onClick={() => setMenuOpen(false)}>
              ABOUT
            </a>
            <a href="#reviews" onClick={() => setMenuOpen(false)}>
              REVIEWS
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              CONTACT
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
        className="relative pt-6 sm:pt-14 pb-4 sm:pb-6 bg-white overflow-hidden"
      >
        {/* Crisp Luxury Showroom Background Image (Desktop) */}
        <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
          <img
            src={heroLuxuryImg}
            alt="MOAR CARS Luxury Showroom"
            className="w-full h-full object-cover object-right opacity-100"
          />
          {/* Soft white gradient on left side to highlight text readability */}
          <div className="absolute inset-y-0 left-0 w-3/5 lg:w-[48%] bg-gradient-to-r from-white via-white/85 to-transparent pointer-events-none" />
        </div>

        {/* Floating Typography Watermarks (Desktop) */}
        <div className="absolute top-20 right-6 sm:right-14 z-10 hidden md:block text-right select-none pointer-events-none">
          <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-slate-700/80 leading-relaxed drop-shadow-sm">
            LUXURY
            <br />
            FREEDOM.
            <br />
            ANY DESTINATION.
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col space-y-3 sm:space-y-6">
          {/* Headline (Visible on Mobile at Top & Desktop) */}
          <div className="max-w-xl space-y-2 pt-1 sm:pt-4">
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif font-black text-slate-900 tracking-tight leading-[1.08] drop-shadow-sm">
              Drive Luxury.
              <br />
              Drive <span className="text-[#c88d18]">MOAR.</span>
            </h1>

            <p className="text-xs sm:text-[13px] font-medium text-slate-600 tracking-wide leading-relaxed">
              Premium Car Rentals • Self Drive • Chauffeur Service • Airport Pickup & Drop
            </p>
          </div>

          {/* On Mobile: Hero Car Image */}
          <div className="lg:hidden w-full rounded-2xl overflow-hidden shadow-md my-1 bg-slate-900">
            <img
              src={heroLuxuryImg}
              alt="Drive MOAR Luxury Fleet"
              className="w-full h-44 sm:h-56 object-cover object-center"
            />
          </div>

          {/* Floating Search Widget */}
          <div className="w-full">
            <HeroSearch onSearch={handleHeroSearch} />
          </div>
        </div>
      </section>

      {/* 2.5. Trust & Stats Badges Bar on clean white background above collections */}
      <TrustBadgesBar />

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
      <footer id="contact" className="bg-[#070e1c] text-white pt-10 pb-8 border-t border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
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
