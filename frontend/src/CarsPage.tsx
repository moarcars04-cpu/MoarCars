import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Heart,
  Car,
  Zap,
  ShieldCheck,
  Headphones,
  Award,
  Sparkles,
  Phone,
  ArrowRight,
  User,
  Users,
  Fuel,
  Gauge,
  Check,
  X,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  LayoutDashboard,
  LogOut,
  MapPin,
  Star,
  Rotate3d,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./context/AuthContext";
import { MoarLogo } from "@/components/common/MoarLogo";
import { DEFAULT_DATABASE_CARS, CarFleetItem } from "@/data/defaultCars";
import { Viewer360Modal } from "@/components/home/360ViewerModal";
import { QuickBookingModal } from "@/components/home/QuickBookingModal";

interface CarsPageProps {
  onNavigate?: (path: string, state?: any) => void;
}

export const CarsPage: React.FC<CarsPageProps> = ({ onNavigate }) => {
  const { user, openAuthModal, logout, toggleFavoriteCar } = useAuth();

  // Fleet state initialized with database defaults
  const [fleet, setFleet] = useState<CarFleetItem[]>(DEFAULT_DATABASE_CARS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [minPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [talkModalOpen, setTalkModalOpen] = useState(false);

  // Modals state
  const [selected360Car, setSelected360Car] = useState<CarFleetItem | null>(null);
  const [bookingTargetCar, setBookingTargetCar] = useState<CarFleetItem | null>(null);

  const carsPerPage = 12;

  // Fetch live fleet data from backend database API
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
          const mapped: CarFleetItem[] = res.data.map((car: any) => ({
            ...car,
            pricePerDay: Number(car.pricePerDay) || parseInt(String(car.price || "1699").replace(/[^0-9]/g, ""), 10) || 1699,
            priceDisplay: car.priceDisplay || (car.price ? (car.price.startsWith("₹") ? car.price : `₹${car.price}`) : `₹${(car.pricePerDay || 1699).toLocaleString("en-IN")}`),
            subCategory: car.subCategory || car.variant || `${car.category || "Fleet"} Vehicle`,
            hasSunroof: car.hasSunroof ?? (car.name?.includes("ZX") || car.name?.includes("Scorpio") || car.name?.includes("Creta") || car.name?.includes("BMW") || car.name?.includes("Mercedes")),
            hasGPS: car.hasGPS ?? true,
            hasAC: car.hasAC ?? true,
            instantBooking: car.instantBooking ?? true,
            freeCancellation: car.freeCancellation ?? true,
            doorstepDelivery: car.doorstepDelivery ?? true,
            rating: car.rating || 4.8,
            tripsCount: car.totalTrips || car.tripsCount || 35,
          }));
          setFleet(mapped);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch live cars from database, using verified database defaults:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic Category Tabs derived from actual database fleet
  const categoryTabs = useMemo(() => {
    const counts: Record<string, number> = {};
    fleet.forEach((c) => {
      const cat = c.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
      SUV: Car,
      Sedan: Car,
      Hatchback: Car,
      Luxury: Award,
      Electric: Zap,
      Vans: Users,
      Convertible: Sparkles,
    };

    const tabs = [
      { id: "all", label: "All Cars", icon: Car, count: fleet.length },
      ...Object.keys(counts).map((cat) => ({
        id: cat,
        label: cat,
        icon: categoryIcons[cat] || Car,
        count: counts[cat] || 0,
      })),
    ];

    return tabs;
  }, [fleet]);

  // Dynamic Brands Filter derived from actual database fleet
  const brandsList = useMemo(() => {
    const counts: Record<string, number> = {};
    fleet.forEach((c) => {
      const b = c.brand || "Other";
      counts[b] = (counts[b] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [fleet]);

  // Dynamic Car Types Filter derived from actual database fleet
  const carTypesList = useMemo(() => {
    const counts: Record<string, number> = {};
    fleet.forEach((c) => {
      const t = c.category || "Other";
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([id, count]) => ({ id, label: id, count }))
      .sort((a, b) => b.count - a.count);
  }, [fleet]);

  // Dynamic Transmissions Filter derived from actual database fleet
  const transmissionsList = useMemo(() => {
    const counts: Record<string, number> = {};
    fleet.forEach((c) => {
      const t = c.transmission || "Manual";
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts).map(([id, count]) => ({ id, label: id, count }));
  }, [fleet]);

  // Dynamic Fuel Types Filter derived from actual database fleet
  const fuelTypesList = useMemo(() => {
    const counts: Record<string, number> = {};
    fleet.forEach((c) => {
      const f = c.fuelType || "Petrol";
      counts[f] = (counts[f] || 0) + 1;
    });
    return Object.entries(counts).map(([id, count]) => ({ id, label: id, count }));
  }, [fleet]);

  // Toggle filter helper
  const toggleArrayFilter = (setArr: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setArr((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setActiveCategoryTab("all");
    setSelectedTypes([]);
    setSelectedBrands([]);
    setSelectedTransmissions([]);
    setSelectedFuels([]);
    setMaxPrice(10000);
    setSortBy("popular");
    setCurrentPage(1);
  };

  // Filtered & Sorted Cars
  const filteredCars = useMemo(() => {
    let result = fleet;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.brand && c.brand.toLowerCase().includes(q)) ||
          (c.model && c.model.toLowerCase().includes(q)) ||
          (c.variant && c.variant.toLowerCase().includes(q)) ||
          (c.subCategory && c.subCategory.toLowerCase().includes(q)) ||
          (c.category && c.category.toLowerCase().includes(q)) ||
          (c.location && c.location.toLowerCase().includes(q))
      );
    }

    // Category Tabs
    if (activeCategoryTab !== "all") {
      result = result.filter(
        (c) =>
          (c.category && c.category.toLowerCase() === activeCategoryTab.toLowerCase()) ||
          (c.subCategory && c.subCategory.toLowerCase().includes(activeCategoryTab.toLowerCase()))
      );
    }

    // Car Types checkbox
    if (selectedTypes.length > 0) {
      result = result.filter((c) =>
        selectedTypes.some(
          (t) =>
            (c.category && c.category.toLowerCase() === t.toLowerCase()) ||
            (c.subCategory && c.subCategory.toLowerCase().includes(t.toLowerCase()))
        )
      );
    }

    // Brands checkbox
    if (selectedBrands.length > 0) {
      result = result.filter((c) => selectedBrands.includes(c.brand));
    }

    // Transmission checkbox
    if (selectedTransmissions.length > 0) {
      result = result.filter((c) => selectedTransmissions.includes(c.transmission));
    }

    // Fuel checkbox
    if (selectedFuels.length > 0) {
      result = result.filter((c) => selectedFuels.includes(c.fuelType));
    }

    // Price range
    result = result.filter((c) => c.pricePerDay >= minPrice && c.pricePerDay <= maxPrice);

    // Sorting
    if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "trips") {
      result = [...result].sort((a, b) => (b.totalTrips || b.tripsCount || 0) - (a.totalTrips || a.tripsCount || 0));
    }

    return result;
  }, [
    fleet,
    searchQuery,
    activeCategoryTab,
    selectedTypes,
    selectedBrands,
    selectedTransmissions,
    selectedFuels,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  // Paginated Cars
  const totalPages = Math.ceil(filteredCars.length / carsPerPage) || 1;
  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * carsPerPage;
    return filteredCars.slice(start, start + carsPerPage);
  }, [filteredCars, currentPage, carsPerPage]);

  const wishlistIds = useMemo(() => {
    return user?.favoriteCars || [];
  }, [user]);

  const handleToggleWishlist = async (carId: number | string) => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    await toggleFavoriteCar(carId);
  };

  const handleCardClick = (car: CarFleetItem) => {
    if (onNavigate) {
      onNavigate(`/car/${car.id}`, { car });
    } else {
      window.location.href = `/car/${car.id}`;
    }
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
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      {/* 1. Top Luxury Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-xs">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-16 sm:h-18 flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate("/");
              }
            }}
            className="flex items-center gap-2 group"
            aria-label="MOAR CARS Home"
          >
            <MoarLogo size="navbar" />
          </a>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-[12px] xl:text-[13px] font-bold uppercase tracking-[0.15em] text-slate-700">
            <a
              href="/"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("/");
                }
              }}
              className="hover:text-[#c88d18] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              HOME
            </a>
            <a
              href="/cars"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-[#c88d18] font-black border-b-2 border-[#c88d18] pb-0.5 transition-colors"
            >
              CARS
            </a>
            <a
              href="/#collections"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("/#collections");
                }
              }}
              className="hover:text-[#c88d18] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              LUXURY FLEET
            </a>
            <a
              href="/#weekend-deals"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("/#weekend-deals");
                }
              }}
              className="hover:text-[#c88d18] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#c88d18]"
            >
              DEALS
            </a>
            <a
              href="/#why-choose-moar"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("/#why-choose-moar");
                }
              }}
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

          {/* Right Action Icons & User Menu */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Icon Shortcut */}
            <button
              onClick={() => {
                document.getElementById("cars-hero-search")?.focus();
              }}
              aria-label="Search cars"
              className="p-2 text-slate-700 hover:text-[#c88d18] transition-colors rounded-full hover:bg-slate-100"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist Shortcut */}
            <button
              onClick={() => {
                if (!user) {
                  openAuthModal("login");
                } else if (onNavigate) {
                  onNavigate("/dashboard?tab=wishlist");
                }
              }}
              aria-label="Wishlist"
              className="p-2 text-slate-700 hover:text-rose-500 transition-colors rounded-full hover:bg-slate-100 relative"
            >
              <Heart className="h-5 w-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full overflow-hidden bg-slate-900 border border-[#d49b29]">
                    <img
                      src={
                        user.avatar ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                      }
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-100 p-2 shadow-xl space-y-1 text-xs z-50">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onNavigate) onNavigate("/dashboard");
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left font-bold text-slate-800 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#c88d18]" />
                      <span>My Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left font-bold text-rose-500 hover:bg-rose-50"
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
                className="hidden sm:block text-xs font-bold text-slate-700 hover:text-[#c88d18] px-2 py-1"
              >
                Sign In
              </button>
            )}

            {/* Golden "Book Now →" Button */}
            <Button
              onClick={() => {
                document.getElementById("fleet-catalog-grid")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-10 px-5 rounded-full bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#c88d18]/25 flex items-center gap-1.5 transition-transform hover:scale-[1.02]"
            >
              <span>Book Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: "Find Your Perfect Drive" */}
      <section className="relative pt-10 sm:pt-14 pb-10 sm:pb-14 bg-[#090e18] text-white overflow-hidden border-b border-slate-800/40">
        {/* Subtle Dark Luxury Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070c16] via-[#0b1329] to-[#070c16]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d49b29]/10 via-transparent to-transparent pointer-events-none" />

        {/* Floating Typography Watermark on Top Right */}
        <div className="absolute top-8 right-6 sm:right-14 z-10 hidden md:block text-right select-none pointer-events-none opacity-40">
          <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-white/50 leading-relaxed drop-shadow-sm">
            DRIVE
            <br />
            MOAR.
            <br />
            EXPLORE
            <br />
            MOAR.
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col justify-center min-h-[260px] sm:min-h-[300px]">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            {/* Small uppercase tag */}
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#d49b29] block">
              EXPLORE OUR VERIFIED FLEET
            </span>

            {/* Serif Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif font-bold text-white tracking-tight leading-[1.1] drop-shadow-md">
              Find Your Perfect Drive
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl leading-relaxed">
              Available live in Tirupati & Andhra Pradesh. 100% verified, sanitized, and ready for instant booking.
            </p>

            {/* Search Input Bar with Golden Button */}
            <div className="pt-2 sm:pt-4 max-w-xl">
              <div className="relative flex items-center bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-2xl border border-white/20">
                <Search className="h-5 w-5 text-slate-400 ml-2.5 sm:ml-3 shrink-0" />
                <input
                  id="cars-hero-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search Swift, Innova, Scorpio, BMW, EV..."
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <Button
                  onClick={() => {
                    document.getElementById("fleet-catalog-grid")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="h-10 sm:h-11 px-5 sm:px-7 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#c88d18]/30 shrink-0"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Filter Tabs Bar (Horizontal Pills Bar) */}
      <div className="bg-white border-b border-slate-100 shadow-xs sticky top-16 sm:top-18 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max">
            {categoryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCategoryTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 shadow-xs ${
                    isActive
                      ? "bg-[#0b1329] text-white shadow-md shadow-black/20 scale-[1.02]"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#d49b29]" : "text-slate-500"}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Main 2-Column Fleet Layout */}
      <div id="fleet-catalog-grid" className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <Button
            onClick={() => setShowMobileFilterModal(true)}
            variant="outline"
            className="flex items-center gap-2 rounded-xl text-xs font-bold border-slate-300 bg-white"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#c88d18]" />
            <span>Filters ({selectedTypes.length + selectedBrands.length + selectedTransmissions.length + selectedFuels.length})</span>
          </Button>

          <span className="text-xs text-slate-500 font-semibold">
            Showing {filteredCars.length} cars
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: FILTERS PANEL (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Filters</h3>
              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-[#c88d18] hover:text-[#b57d14] hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* 1. Car Type Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Car Type</h4>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="space-y-2 pt-1">
                {carTypesList.map((t) => {
                  const isChecked = selectedTypes.includes(t.id);
                  return (
                    <label
                      key={t.id}
                      className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          onClick={() => toggleArrayFilter(setSelectedTypes, t.id)}
                          className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-[#0b1329] border-[#0b1329] text-white"
                              : "border-slate-300 bg-white group-hover:border-slate-400"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="font-semibold">{t.label}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">({t.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* 2. Brands Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Brands</h4>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="space-y-2 pt-1">
                {brandsList.map((b) => {
                  const isChecked = selectedBrands.includes(b.name);
                  return (
                    <label
                      key={b.name}
                      className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          onClick={() => toggleArrayFilter(setSelectedBrands, b.name)}
                          className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-[#0b1329] border-[#0b1329] text-white"
                              : "border-slate-300 bg-white group-hover:border-slate-400"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="font-semibold">{b.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">({b.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* 3. Price Range (per day in INR) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Tariff / Day (₹)</h4>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="pt-1 space-y-3">
                <input
                  type="range"
                  min={1000}
                  max={10000}
                  step={200}
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-[#c88d18] cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>₹{minPrice.toLocaleString("en-IN")}</span>
                  <span className="text-[#c88d18] font-black">Up to ₹{maxPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* 4. Transmission Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Transmission</h4>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="space-y-2 pt-1">
                {transmissionsList.map((t) => {
                  const isChecked = selectedTransmissions.includes(t.id);
                  return (
                    <label
                      key={t.id}
                      className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          onClick={() => toggleArrayFilter(setSelectedTransmissions, t.id)}
                          className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-[#0b1329] border-[#0b1329] text-white"
                              : "border-slate-300 bg-white group-hover:border-slate-400"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="font-semibold">{t.label}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">({t.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* 5. Fuel Type Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Fuel Type</h4>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="space-y-2 pt-1">
                {fuelTypesList.map((f) => {
                  const isChecked = selectedFuels.includes(f.id);
                  return (
                    <label
                      key={f.id}
                      className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          onClick={() => toggleArrayFilter(setSelectedFuels, f.id)}
                          className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-[#0b1329] border-[#0b1329] text-white"
                              : "border-slate-300 bg-white group-hover:border-slate-400"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="font-semibold">{f.label}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">({f.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Apply Filters Button */}
            <Button
              onClick={() => {
                document.getElementById("fleet-catalog-grid")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full h-10 rounded-xl bg-[#0b1329] hover:bg-[#152345] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-black/20"
            >
              Apply Filters
            </Button>
          </aside>

          {/* RIGHT FLEET CATALOG (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* Top Results & Sort Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs sm:text-sm font-semibold text-slate-600">
                Showing{" "}
                <strong className="text-slate-900">
                  {filteredCars.length > 0 ? (currentPage - 1) * carsPerPage + 1 : 0}–
                  {Math.min(currentPage * carsPerPage, filteredCars.length)}
                </strong>{" "}
                of <strong className="text-slate-900">{filteredCars.length}</strong> vehicles in database
              </span>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none focus:border-[#c88d18]"
                >
                  <option value="popular">Popular First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="trips">Most Trips</option>
                </select>
              </div>
            </div>

            {/* 3x4 Cars Grid */}
            {paginatedCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {paginatedCars.map((car) => {
                  const isFavorited = wishlistIds.includes(car.id);
                  return (
                    <div
                      key={car.id}
                      className="group rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
                    >
                      {/* Top Photo & Badges */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                        <img
                          src={car.image || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"}
                          alt={car.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top-Left Tag Badge */}
                        {car.tag && (
                          <div className="absolute top-3 left-3">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md ${
                                car.tag === "Featured"
                                  ? "bg-[#c88d18]"
                                  : car.tag === "Popular"
                                  ? "bg-[#d49b29]"
                                  : car.tag === "Best Seller"
                                  ? "bg-amber-600"
                                  : "bg-[#0b1329]"
                              }`}
                            >
                              {car.tag}
                            </span>
                          </div>
                        )}

                        {/* Top-Right Favorite/Wishlist & 360 Buttons */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected360Car(car);
                            }}
                            title="360° Studio View"
                            className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center text-slate-700 hover:text-[#c88d18] hover:scale-110 transition-all"
                          >
                            <Rotate3d className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWishlist(car.id);
                            }}
                            aria-label="Save to Wishlist"
                            className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center text-slate-600 hover:text-rose-500 hover:scale-110 transition-all"
                          >
                            <Heart
                              className={`h-4 w-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`}
                            />
                          </button>
                        </div>

                        {/* Bottom Location & Rating Badge */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white drop-shadow">
                          <span className="flex items-center gap-1 text-[11px] font-bold bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            <MapPin className="h-3 w-3 text-amber-400" /> {car.location || "Tirupati Hub"}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-bold bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full text-amber-300">
                            <Star className="h-3 w-3 fill-current" /> {car.rating || 4.8}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          {/* Title & SubCategory */}
                          <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#c88d18] transition-colors leading-tight">
                            {car.name}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">
                            {car.variant || car.subCategory || car.category}
                          </p>

                          {/* 3 Specs Badges */}
                          <div className="flex items-center gap-3 sm:gap-4 mt-3 text-[11px] font-bold text-slate-600">
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-slate-400" />
                              <span>{car.seats} Seats</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Gauge className="h-3.5 w-3.5 text-slate-400" />
                              <span>{car.transmission}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Fuel className="h-3.5 w-3.5 text-slate-400" />
                              <span>{car.fuelType}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Price & View Details */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-lg sm:text-xl font-black text-slate-900">
                              ₹{car.pricePerDay.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[11px] text-slate-500 font-semibold ml-1">/ day</span>
                            {car.securityDeposit && (
                              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                                <ShieldCheck className="h-3 w-3" /> Dep: ₹{car.securityDeposit.toLocaleString("en-IN")}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Button
                              onClick={() => handleCardClick(car)}
                              className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white font-bold text-xs shadow-md shadow-[#c88d18]/25 flex items-center gap-1 transition-transform hover:scale-[1.02]"
                            >
                              <span>Details</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 space-y-4">
                <Car className="h-12 w-12 text-slate-300 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">No vehicles found matching your filters</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your tariff range, car type, or search keyword to see available fleet vehicles.
                </p>
                <Button onClick={handleClearAll} className="h-9 px-5 rounded-xl bg-[#0b1329] text-white text-xs font-bold">
                  Reset All Filters
                </Button>
              </div>
            )}

            {/* Dynamic Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    document.getElementById("fleet-catalog-grid")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  aria-label="Previous Page"
                  className="h-9 w-9 rounded-xl border border-slate-200/90 bg-white flex items-center justify-center text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 shadow-xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      document.getElementById("fleet-catalog-grid")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`h-9 w-9 rounded-xl text-xs font-black transition-all shadow-xs ${
                      currentPage === page
                        ? "bg-[#c88d18] text-white shadow-md shadow-[#c88d18]/30"
                        : "bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    document.getElementById("fleet-catalog-grid")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  aria-label="Next Page"
                  className="h-9 w-9 rounded-xl border border-slate-200/90 bg-white flex items-center justify-center text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 shadow-xs"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Mobile Filter Modal Drawer */}
      {showMobileFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Filter Vehicles</h3>
              <button
                onClick={() => setShowMobileFilterModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Car Types */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase">Car Type</h4>
              <div className="space-y-2">
                {carTypesList.map((t) => (
                  <label key={t.id} className="flex items-center justify-between text-xs text-slate-700">
                    <span className="font-medium">{t.label}</span>
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(t.id)}
                      onChange={() => toggleArrayFilter(setSelectedTypes, t.id)}
                      className="rounded border-slate-300 text-[#0b1329]"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase">Brand</h4>
              <div className="space-y-2">
                {brandsList.map((b) => (
                  <label key={b.name} className="flex items-center justify-between text-xs text-slate-700">
                    <span className="font-medium">{b.name}</span>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b.name)}
                      onChange={() => toggleArrayFilter(setSelectedBrands, b.name)}
                      className="rounded border-slate-300 text-[#0b1329]"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase">Tariff / Day (₹)</h4>
              <input
                type="range"
                min={1000}
                max={10000}
                step={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#c88d18]"
              />
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>₹{minPrice.toLocaleString("en-IN")}</span>
                <span className="text-[#c88d18]">Up to ₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <Button onClick={handleClearAll} variant="outline" className="flex-1 rounded-xl text-xs font-bold">
                Reset
              </Button>
              <Button
                onClick={() => setShowMobileFilterModal(false)}
                className="flex-1 rounded-xl bg-[#0b1329] text-white text-xs font-bold"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Trust Badges Bar (4 in a row) */}
      <div className="w-full bg-white border-y border-slate-100/90 py-5 sm:py-6 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Badge 1 */}
            <div className="flex items-center gap-3.5 justify-center md:justify-start pt-2 md:pt-0">
              <div className="h-12 w-12 rounded-full border-2 border-[#d49b29] bg-amber-50/50 flex items-center justify-center text-[#c88d18] shrink-0 shadow-xs">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-none">Verified Fleet</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">Inspected & Sanitized</div>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-3.5 justify-center md:justify-start pt-2 md:pt-0 md:pl-6 lg:pl-8">
              <div className="h-12 w-12 rounded-full border-2 border-[#d49b29] bg-amber-50/50 flex items-center justify-center text-[#c88d18] shrink-0 shadow-xs">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-none">Best Price Guarantee</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">No Hidden Charges</div>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-3.5 justify-center md:justify-start pt-2 md:pt-0 md:pl-6 lg:pl-8">
              <div className="h-12 w-12 rounded-full border-2 border-[#d49b29] bg-amber-50/50 flex items-center justify-center text-[#c88d18] shrink-0 shadow-xs">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-none">24/7 Support</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">Always Here for You</div>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="flex items-center gap-3.5 justify-center md:justify-start pt-2 md:pt-0 md:pl-6 lg:pl-8">
              <div className="h-12 w-12 rounded-full border-2 border-[#d49b29] bg-amber-50/50 flex items-center justify-center text-[#c88d18] shrink-0 shadow-xs">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-none">Flexible Booking</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">Modify or Cancel Easily</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Dark Luxury Footer */}
      <footer id="contact" className="bg-[#070e1c] text-white pt-10 pb-8 border-t border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
          {/* Main Footer 4 Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1: Logo & Company Description */}
            <div className="space-y-4">
              <MoarLogo variant="light" size="lg" showTagline={true} />
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Premium car rentals for extraordinary journeys in Tirupati & Andhra Pradesh. Drive luxury. Drive MOAR.
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
                  <a
                    href="/"
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate("/");
                      }
                    }}
                    className="hover:text-[#c88d18] transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/cars"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-[#c88d18] transition-colors text-[#c88d18] font-bold"
                  >
                    Cars
                  </a>
                </li>
                <li>
                  <a
                    href="/#collections"
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate("/#collections");
                      }
                    }}
                    className="hover:text-[#c88d18] transition-colors"
                  >
                    Luxury Fleet
                  </a>
                </li>
                <li>
                  <a
                    href="/#weekend-deals"
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate("/#weekend-deals");
                      }
                    }}
                    className="hover:text-[#c88d18] transition-colors"
                  >
                    Deals
                  </a>
                </li>
                <li>
                  <a
                    href="/#why-choose-moar"
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate("/#why-choose-moar");
                      }
                    }}
                    className="hover:text-[#c88d18] transition-colors"
                  >
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
                  <a href="/cars" className="hover:text-[#c88d18] transition-colors">
                    Self Drive Rentals
                  </a>
                </li>
                <li>
                  <a href="/cars" className="hover:text-[#c88d18] transition-colors">
                    Chauffeur Driven
                  </a>
                </li>
                <li>
                  <a href="/#hubs" className="hover:text-[#c88d18] transition-colors">
                    Renigunta Airport Pickup
                  </a>
                </li>
                <li>
                  <a href="/cars" className="hover:text-[#c88d18] transition-colors">
                    Tirumala Pilgrimage Packages
                  </a>
                </li>
                <li>
                  <a href="/cars" className="hover:text-[#c88d18] transition-colors">
                    Long Term Monthly Fleet
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
                Get the latest deals and exclusive updates in Tirupati.
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
                      placeholder="Enter your email"
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
                  DRIVE MOAR.
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 block">
                  EXPLORE MOAR.
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 MOAR CARS. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms & Conditions</span>
              <span className="hover:text-slate-300 cursor-pointer transition-colors">Sitemap</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 360 Studio Viewer Modal */}
      {selected360Car && (
        <Viewer360Modal
          car={selected360Car}
          onClose={() => setSelected360Car(null)}
          onBookNow={(car) => {
            setSelected360Car(null);
            setBookingTargetCar(car);
          }}
        />
      )}

      {/* Quick Booking Modal */}
      {bookingTargetCar && (
        <QuickBookingModal
          car={bookingTargetCar}
          searchParams={{
            pickup: bookingTargetCar.location || "Tirupati Central Hub",
            dropoff: bookingTargetCar.location || "Tirupati Central Hub",
            startDate: new Date().toISOString().split("T")[0] || "2026-09-08",
            startTime: "09:00",
            endDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0] || "2026-09-10",
            endTime: "21:00",
          }}
          onClose={() => setBookingTargetCar(null)}
          onNavigate={onNavigate}
        />
      )}

      {/* Talk to Our Experts Modal */}
      {talkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-4 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setTalkModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="h-16 w-16 rounded-full bg-amber-50 text-[#c88d18] border-2 border-[#d49b29] flex items-center justify-center mx-auto shadow-md">
              <Headphones className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Talk to a Luxury Fleet Concierge</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our 24/7 fleet specialists are ready to help you customize your booking, Tirumala ghat road advice, and airport handovers.
            </p>
            <div className="space-y-2 pt-2">
              <a
                href="tel:+918500012345"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] text-white font-bold text-xs uppercase tracking-wider shadow-md"
              >
                <Phone className="h-4 w-4" />
                <span>Call Now: +91 85000 12345</span>
              </a>
              <a
                href="https://wa.me/918500012345?text=Hello%20MOAR%20CARS,%20I%20would%20like%20assistance%20choosing%20a%20car."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#0b1329] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#162447]"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
