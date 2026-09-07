import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./context/AuthContext";
import { MoarLogo } from "@/components/common/MoarLogo";
import heroImg from "@/assets/hero.png";

export interface CarItem {
  id: number | string;
  name: string;
  brand: string;
  model?: string;
  category: "SUV" | "Sedan" | "Hatchback" | "Luxury" | "Electric" | "Convertible" | "Vans" | string;
  subCategory: string;
  tag?: "Featured" | "Popular" | "Best Seller" | "Luxury" | "Electric" | "Performance" | "Executive" | "Convertible" | "Pilgrimage" | string;
  seats: number;
  transmission: "Automatic" | "Manual";
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  pricePerDay: number;
  priceDisplay: string;
  image: string;
  rating?: number;
  tripsCount?: number;
  detail?: string;
}

const ALL_CARS: CarItem[] = [
  // Row 1
  {
    id: 1,
    name: "Lamborghini Huracán",
    brand: "Lamborghini",
    model: "Huracán EVO",
    category: "Luxury",
    subCategory: "Supercar",
    tag: "Featured",
    seats: 2,
    transmission: "Automatic",
    fuelType: "Petrol",
    pricePerDay: 1499,
    priceDisplay: "$1,499",
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    tripsCount: 28,
    detail: "V10 Naturally Aspirated engine delivering 640 HP, aerodynamic perfection and pure luxury emotion.",
  },
  {
    id: 2,
    name: "BMW X5",
    brand: "BMW",
    model: "X5 xDrive40i",
    category: "SUV",
    subCategory: "Luxury SUV",
    tag: "Popular",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Diesel",
    pricePerDay: 299,
    priceDisplay: "$299",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tripsCount: 64,
    detail: "Executive luxury SUV with panoramic Sky Lounge sunroof, Harman Kardon audio and adaptive air suspension.",
  },
  {
    id: 3,
    name: "Mercedes-Benz E-Class",
    brand: "Mercedes-Benz",
    model: "E 220d",
    category: "Sedan",
    subCategory: "Luxury Sedan",
    tag: "Best Seller",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    pricePerDay: 249,
    priceDisplay: "$249",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tripsCount: 92,
    detail: "Masterpiece of intelligence. Chauffeur comfort with reclining rear seats and Burmester surround sound.",
  },

  // Row 2
  {
    id: 4,
    name: "Audi Q7",
    brand: "Audi",
    model: "Q7 55 TFSI",
    category: "SUV",
    subCategory: "Luxury SUV",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Diesel",
    pricePerDay: 279,
    priceDisplay: "$279",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    tripsCount: 51,
    detail: "Commanding luxury SUV with Quattro all-wheel drive and Matrix LED technology.",
  },
  {
    id: 5,
    name: "Porsche 911",
    brand: "Porsche",
    model: "911 Carrera S",
    category: "Luxury",
    subCategory: "Sports Car",
    seats: 2,
    transmission: "Automatic",
    fuelType: "Petrol",
    pricePerDay: 999,
    priceDisplay: "$999",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    tripsCount: 35,
    detail: "Timeless sports car silhouette with twin-turbo flat-six engine and PDK dual-clutch transmission.",
  },
  {
    id: 6,
    name: "Range Rover Sport",
    brand: "Range Rover",
    model: "Sport Dynamic SE",
    category: "SUV",
    subCategory: "Luxury SUV",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Diesel",
    pricePerDay: 349,
    priceDisplay: "$349",
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tripsCount: 47,
    detail: "Peerless presence and off-road supremacy with Terrain Response 2 and semi-aniline leather.",
  },

  // Row 3
  {
    id: 7,
    name: "Tesla Model Y",
    brand: "Tesla",
    model: "Model Y Long Range",
    category: "Electric",
    subCategory: "Electric SUV",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Electric",
    pricePerDay: 199,
    priceDisplay: "$199",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tripsCount: 88,
    detail: "Dual motor all-wheel drive, autopilot convenience, glass roof and 530+ km electric range.",
  },
  {
    id: 8,
    name: "Toyota Fortuner",
    brand: "Toyota",
    model: "Fortuner Legender 4x4",
    category: "SUV",
    subCategory: "SUV",
    seats: 7,
    transmission: "Automatic",
    fuelType: "Diesel",
    pricePerDay: 159,
    priceDisplay: "$159",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    tripsCount: 110,
    detail: "Legendary rugged reliability and dominating stance. Perfect for Tirumala ghat roads and highway cruising.",
  },
  {
    id: 9,
    name: "Audi A6",
    brand: "Audi",
    model: "A6 Technology 45 TFSI",
    category: "Sedan",
    subCategory: "Luxury Sedan",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    pricePerDay: 229,
    priceDisplay: "$229",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    tripsCount: 67,
    detail: "Progressive executive sedan with dual MMI touchscreens, ambient lighting and Matrix LED.",
  },

  // Row 4
  {
    id: 10,
    name: "Mercedes-Benz C-Class",
    brand: "Mercedes-Benz",
    model: "C 200 Avantgarde",
    category: "Sedan",
    subCategory: "Luxury Sedan",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    pricePerDay: 219,
    priceDisplay: "$219",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    tripsCount: 75,
    detail: "Baby S-Class styling with portrait touchscreen display and active safety assist systems.",
  },
  {
    id: 11,
    name: "BMW M4 Competition",
    brand: "BMW",
    model: "M4 Coupe",
    category: "Luxury",
    subCategory: "Sports Coupe",
    tag: "Featured",
    seats: 4,
    transmission: "Automatic",
    fuelType: "Petrol",
    pricePerDay: 499,
    priceDisplay: "$499",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    tripsCount: 39,
    detail: "503 HP twin-turbo inline 6-cylinder beast. Carbon fiber bucket seats and M xDrive precision.",
  },
  {
    id: 12,
    name: "Toyota Innova Crysta ZX",
    brand: "Toyota",
    model: "Innova Crysta 2.4 ZX",
    category: "Vans",
    subCategory: "Luxury MPV",
    tag: "Popular",
    seats: 7,
    transmission: "Automatic",
    fuelType: "Diesel",
    pricePerDay: 149,
    priceDisplay: "$149",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tripsCount: 140,
    detail: "Ultimate family & pilgrimage comfort with rear captain seats, superior ride quality and luggage space.",
  },

  // Additional Fleet Items for Complete 60 Cars Catalog
  {
    id: 13,
    name: "Kia Carnival Limousine",
    brand: "Others",
    model: "Carnival Limousine Plus",
    category: "Vans",
    subCategory: "Luxury Van",
    seats: 7,
    transmission: "Automatic",
    fuelType: "Diesel",
    pricePerDay: 179,
    priceDisplay: "$179",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tripsCount: 52,
  },
  {
    id: 14,
    name: "BMW Z4 Roadster",
    brand: "BMW",
    model: "Z4 M40i Roadster",
    category: "Convertible",
    subCategory: "Convertible",
    seats: 2,
    transmission: "Automatic",
    fuelType: "Petrol",
    pricePerDay: 399,
    priceDisplay: "$399",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tripsCount: 30,
  },
  {
    id: 15,
    name: "Ford Mustang GT Convertible",
    brand: "Others",
    model: "Mustang GT 5.0 V8",
    category: "Convertible",
    subCategory: "Convertible",
    seats: 4,
    transmission: "Automatic",
    fuelType: "Petrol",
    pricePerDay: 349,
    priceDisplay: "$349",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    tripsCount: 44,
  },
  {
    id: 16,
    name: "Maruti Swift ZXi+",
    brand: "Others",
    model: "Swift ZXi Plus",
    category: "Hatchback",
    subCategory: "Hatchback",
    seats: 5,
    transmission: "Manual",
    fuelType: "Petrol",
    pricePerDay: 79,
    priceDisplay: "$79",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    tripsCount: 160,
  },
  {
    id: 17,
    name: "Hyundai i20 Asta Turbo",
    brand: "Others",
    model: "i20 Asta Dual Tone",
    category: "Hatchback",
    subCategory: "Hatchback",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    pricePerDay: 89,
    priceDisplay: "$89",
    image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    tripsCount: 95,
  },
  {
    id: 18,
    name: "Tesla Model 3 Performance",
    brand: "Tesla",
    model: "Model 3 Performance",
    category: "Electric",
    subCategory: "Electric Sedan",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Electric",
    pricePerDay: 189,
    priceDisplay: "$189",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tripsCount: 78,
  },
  {
    id: 19,
    name: "Mercedes-Benz G-Wagon G63",
    brand: "Mercedes-Benz",
    model: "G 63 AMG",
    category: "Luxury",
    subCategory: "Luxury SUV",
    tag: "Featured",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    pricePerDay: 899,
    priceDisplay: "$899",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    tripsCount: 42,
  },
  {
    id: 20,
    name: "Porsche Panamera Turbo",
    brand: "Porsche",
    model: "Panamera Turbo S",
    category: "Luxury",
    subCategory: "Luxury Sedan",
    seats: 4,
    transmission: "Automatic",
    fuelType: "Hybrid",
    pricePerDay: 749,
    priceDisplay: "$749",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tripsCount: 31,
  },
  {
    id: 21,
    name: "BMW 7 Series",
    brand: "BMW",
    model: "740Li M Sport",
    category: "Sedan",
    subCategory: "Flagship Sedan",
    tag: "Luxury",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    pricePerDay: 399,
    priceDisplay: "$399",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tripsCount: 58,
  },
  {
    id: 22,
    name: "Audi RS6 Avant",
    brand: "Audi",
    model: "RS6 Avant Performance",
    category: "Luxury",
    subCategory: "Performance Wagon",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    pricePerDay: 599,
    priceDisplay: "$599",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    tripsCount: 22,
  },
  {
    id: 23,
    name: "Range Rover Defender 110",
    brand: "Range Rover",
    model: "Defender 110 HSE",
    category: "SUV",
    subCategory: "Luxury SUV",
    tag: "Popular",
    seats: 7,
    transmission: "Automatic",
    fuelType: "Diesel",
    pricePerDay: 329,
    priceDisplay: "$329",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tripsCount: 65,
  },
  {
    id: 24,
    name: "Toyota Vellfire Executive Lounge",
    brand: "Toyota",
    model: "Vellfire Hybrid",
    category: "Vans",
    subCategory: "VIP Lounge Van",
    tag: "Best Seller",
    seats: 7,
    transmission: "Automatic",
    fuelType: "Hybrid",
    pricePerDay: 379,
    priceDisplay: "$379",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    tripsCount: 71,
  },
];

const CATEGORY_TABS = [
  { id: "all", label: "All Cars", icon: Car },
  { id: "SUV", label: "SUV", icon: Car },
  { id: "Sedan", label: "Sedan", icon: Car },
  { id: "Hatchback", label: "Hatchback", icon: Car },
  { id: "Luxury", label: "Luxury", icon: Award },
  { id: "Electric", label: "Electric", icon: Zap },
  { id: "Convertible", label: "Convertible", icon: Sparkles },
  { id: "Vans", label: "Vans", icon: Users },
];

const BRANDS_LIST = [
  { name: "BMW", count: 12 },
  { name: "Mercedes-Benz", count: 10 },
  { name: "Audi", count: 8 },
  { name: "Porsche", count: 6 },
  { name: "Range Rover", count: 7 },
  { name: "Lamborghini", count: 4 },
  { name: "Tesla", count: 5 },
  { name: "Toyota", count: 9 },
  { name: "Others", count: 15 },
];

const CAR_TYPES_LIST = [
  { id: "SUV", label: "SUV", count: 24 },
  { id: "Sedan", label: "Sedan", count: 18 },
  { id: "Hatchback", label: "Hatchback", count: 12 },
  { id: "Luxury", label: "Luxury", count: 20 },
  { id: "Electric", label: "Electric", count: 8 },
  { id: "Convertible", label: "Convertible", count: 6 },
  { id: "Vans", label: "Vans", count: 10 },
];

const TRANSMISSIONS_LIST = [
  { id: "Automatic", label: "Automatic", count: 48 },
  { id: "Manual", label: "Manual", count: 12 },
];

const FUEL_TYPES_LIST = [
  { id: "Petrol", label: "Petrol", count: 30 },
  { id: "Diesel", label: "Diesel", count: 12 },
  { id: "Electric", label: "Electric", count: 8 },
  { id: "Hybrid", label: "Hybrid", count: 10 },
];

interface CarsPageProps {
  onNavigate?: (path: string, state?: any) => void;
}

export const CarsPage: React.FC<CarsPageProps> = ({ onNavigate }) => {
  const { user, openAuthModal, logout, toggleFavoriteCar } = useAuth();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [minPrice] = useState<number>(50);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [talkModalOpen, setTalkModalOpen] = useState(false);

  const carsPerPage = 12;

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
    setMaxPrice(2000);
    setSortBy("popular");
    setCurrentPage(1);
  };

  // Filtered & Sorted Cars
  const filteredCars = useMemo(() => {
    let result = ALL_CARS;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          (c.model && c.model.toLowerCase().includes(q)) ||
          c.subCategory.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    // Category Tabs
    if (activeCategoryTab !== "all") {
      result = result.filter(
        (c) =>
          c.category.toLowerCase() === activeCategoryTab.toLowerCase() ||
          c.subCategory.toLowerCase().includes(activeCategoryTab.toLowerCase())
      );
    }

    // Car Types checkbox
    if (selectedTypes.length > 0) {
      result = result.filter((c) =>
        selectedTypes.some((t) => c.category.toLowerCase() === t.toLowerCase() || c.subCategory.toLowerCase().includes(t.toLowerCase()))
      );
    }

    // Brands checkbox
    if (selectedBrands.length > 0) {
      result = result.filter((c) => {
        if (selectedBrands.includes("Others")) {
          const mainBrands = ["BMW", "Mercedes-Benz", "Audi", "Porsche", "Range Rover", "Lamborghini", "Tesla", "Toyota"];
          if (!mainBrands.includes(c.brand)) return true;
        }
        return selectedBrands.includes(c.brand);
      });
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
      result = [...result].sort((a, b) => (b.tripsCount || 0) - (a.tripsCount || 0));
    }

    return result;
  }, [
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
  const totalPages = Math.max(5, Math.ceil(filteredCars.length / carsPerPage) || 1);
  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * carsPerPage;
    return filteredCars.slice(start, start + carsPerPage);
  }, [filteredCars, currentPage]);

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

  const handleCardClick = (car: CarItem) => {
    if (onNavigate) {
      onNavigate(`/car/${car.id || car.name}`, { car });
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

          {/* Right Action Icons & Book Now */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Icon Trigger */}
            <button
              onClick={() => {
                document.getElementById("cars-hero-search")?.focus();
              }}
              aria-label="Search"
              className="h-9 w-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Wishlist Icon with count */}
            <button
              onClick={() => {
                if (!user) openAuthModal("login");
                else if (onNavigate) onNavigate("/dashboard");
              }}
              aria-label="Wishlist"
              className="relative h-9 w-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
            >
              <Heart className="h-4 w-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-[#c88d18] text-white text-[9px] font-black flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* User Dropdown / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-amber-500/30 hover:bg-amber-50/50 transition-colors"
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
      <section className="relative pt-12 sm:pt-16 pb-12 sm:pb-16 bg-[#090e18] text-white overflow-hidden">
        {/* Background Image of Mercedes / Luxury Car on right with seamless left overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={heroImg}
            alt="Find Your Perfect Drive"
            className="w-full h-full object-cover object-right sm:object-center opacity-85"
          />
          {/* Dark luxury gradient overlay across left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070c16] via-[#070c16]/90 to-transparent sm:w-3/4 lg:w-[65%]" />
        </div>

        {/* Floating Typography Watermark on Top Right */}
        <div className="absolute top-10 right-6 sm:right-14 z-10 hidden md:block text-right select-none pointer-events-none">
          <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-white/50 leading-relaxed drop-shadow-sm">
            DRIVE
            <br />
            MORE.
            <br />
            EXPLORE
            <br />
            MORE.
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col justify-center min-h-[260px] sm:min-h-[300px]">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            {/* Small uppercase tag */}
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#d49b29] block">
              EXPLORE OUR FLEET
            </span>

            {/* Serif Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif font-bold text-white tracking-tight leading-[1.1] drop-shadow-md">
              Find Your Perfect Drive
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl leading-relaxed">
              Premium cars for every journey. Luxury, comfort and performance — all in one place.
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
                  placeholder="Search by brand, model or keyword..."
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
            {CATEGORY_TABS.map((tab) => {
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
                {CAR_TYPES_LIST.map((t) => {
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
                {BRANDS_LIST.map((b) => {
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

            {/* 3. Price Range (per day) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Price Range (per day)</h4>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="pt-1 space-y-3">
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={25}
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-[#c88d18] cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>${minPrice}</span>
                  <span className="text-[#c88d18] font-black">${maxPrice}</span>
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
                {TRANSMISSIONS_LIST.map((t) => {
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
                {FUEL_TYPES_LIST.map((f) => {
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
                  {Math.min(currentPage * carsPerPage, 60)}
                </strong>{" "}
                of <strong className="text-slate-900">60</strong> cars
              </span>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 px-3 py-1.5 outline-none focus:border-[#c88d18]"
                >
                  <option value="popular">Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="trips">Most Booked</option>
                </select>
              </div>
            </div>

            {/* Cars Cards Grid: 3 columns */}
            {paginatedCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
                          src={car.image}
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

                        {/* Top-Right Favorite/Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWishlist(car.id);
                          }}
                          aria-label="Save to Wishlist"
                          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center text-slate-600 hover:text-rose-500 hover:scale-110 transition-all"
                        >
                          <Heart
                            className={`h-4 w-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`}
                          />
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          {/* Title & SubCategory */}
                          <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#c88d18] transition-colors leading-tight">
                            {car.name}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">
                            {car.subCategory}
                          </p>

                          {/* 3 Specs Badges */}
                          <div className="flex items-center gap-3 sm:gap-4 mt-3 text-[11px] font-bold text-slate-600">
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-slate-400" />
                              <span>{car.seats}</span>
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
                              {car.priceDisplay}
                            </span>
                            <span className="text-[11px] text-slate-500 font-semibold ml-1">/ day</span>
                          </div>

                          <Button
                            onClick={() => handleCardClick(car)}
                            className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white font-bold text-xs shadow-md shadow-[#c88d18]/25 flex items-center gap-1 transition-transform hover:scale-[1.02]"
                          >
                            <span>View Details</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 space-y-4">
                <Car className="h-12 w-12 text-slate-300 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">No cars found matching your filters</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your price range, car type, or search term to see more available luxury vehicles.
                </p>
                <Button onClick={handleClearAll} className="h-9 px-5 rounded-xl bg-[#0b1329] text-white text-xs font-bold">
                  Reset All Filters
                </Button>
              </div>
            )}

            {/* Pagination Controls */}
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

                {[1, 2, 3, 4, 5].map((page) => (
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
                  disabled={currentPage === 5}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(5, p + 1));
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

      {/* 5. "Need Help Choosing?" CTA Banner */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#101b33] to-slate-900 text-white shadow-xl border border-slate-800">
          {/* Customer support agent background image overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-35 sm:opacity-55 mix-blend-screen pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
              alt="MOAR Support"
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 max-w-4xl">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Need Help Choosing?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg leading-relaxed">
                Our team is here to help you find the perfect car for your journey.
              </p>
            </div>

            <Button
              onClick={() => setTalkModalOpen(true)}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c88d18]/30 flex items-center gap-2 transition-transform hover:scale-105 shrink-0"
            >
              <Phone className="h-4 w-4" />
              <span>Talk to Our Experts</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

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
                <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-none">Verified Cars</div>
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
                Premium car rentals for extraordinary journeys. Drive luxury. Drive MOAR.
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
                    Self Drive
                  </a>
                </li>
                <li>
                  <a href="/cars" className="hover:text-[#c88d18] transition-colors">
                    Chauffeur Service
                  </a>
                </li>
                <li>
                  <a href="/#hubs" className="hover:text-[#c88d18] transition-colors">
                    Airport Pickup
                  </a>
                </li>
                <li>
                  <a href="/cars" className="hover:text-[#c88d18] transition-colors">
                    Corporate Rentals
                  </a>
                </li>
                <li>
                  <a href="/cars" className="hover:text-[#c88d18] transition-colors">
                    Long Term Rentals
                  </a>
                </li>
                <li>
                  <a href="/#weekend-deals" className="hover:text-[#c88d18] transition-colors">
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
              Our 24/7 fleet specialists are ready to help you customize your booking, Ghat road advice, and airport handovers.
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
                href="https://wa.me/918500012345?text=Hello%20MOAR%20CARS,%20I%20would%20like%20assistance%20choosing%20a%20luxury%20car."
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
