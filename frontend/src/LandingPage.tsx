import { useState, useEffect, useMemo } from "react";
import { ArrowRight, CalendarDays, ChevronDown, ChevronRight, Compass, Headphones, Menu, MapPin, Phone, Play, Search, ShieldCheck, Ticket, X, Users, Fuel, Gauge, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/moar-hero.jpg";
import fleetImage from "@/assets/moar-fleet.jpg";

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
}

const fallbackFleet: CarFleetItem[] = [
  {
    id: 1,
    name: "Maruti Swift ZXi+",
    brand: "Maruti Suzuki",
    model: "Swift",
    variant: "ZXi Plus Dual Tone",
    detail: "Smart 5-seater hatchback, agile city commuter with touch infotainment & fuel efficiency",
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
    location: "Tirupati",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
    imagePosition: "left",
  },
  {
    id: 2,
    name: "Honda City ZX Automatic",
    brand: "Honda",
    model: "City",
    variant: "ZX CVT Sunroof",
    detail: "Executive sedan with electric sunroof, leather upholstery, and ADAS Level 2 safety",
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
    location: "Renigunta",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center",
  },
  {
    id: 3,
    name: "Mahindra Scorpio-N Z8L 4x4",
    brand: "Mahindra",
    model: "Scorpio-N",
    variant: "Z8L 4x4 Automatic Diesel",
    detail: "Dominant 7-seater luxury SUV, 4Xplorer terrain modes for Tirumala ghat roads",
    price: "₹2,499",
    pricePerDay: 2499,
    tag: "Popular",
    category: "SUV",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 7,
    mileage: "15 km/l",
    color: "Napoli Black",
    status: "Booked",
    branch: "Tirupati Central Hub",
    location: "Tirupati",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    imagePosition: "right",
  },
  {
    id: 4,
    name: "Toyota Innova Crysta ZX",
    brand: "Toyota",
    model: "Innova Crysta",
    variant: "2.4 ZX Captain Seats",
    detail: "Unmatched pilgrimage luxury, captain seats with climate control & ample luggage space",
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
    location: "Chandragiri",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center",
  },
  {
    id: 5,
    name: "Hyundai Creta SX(O)",
    brand: "Hyundai",
    model: "Creta",
    variant: "SX(O) Turbo DCT",
    detail: "Panoramic sunroof, ventilated front seats, premium Bose audio system",
    price: "₹2,299",
    pricePerDay: 2299,
    tag: "Popular",
    category: "SUV",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    mileage: "17 km/l",
    color: "Ranger Khaki",
    status: "In Maintenance",
    branch: "Tirupati Central Hub",
    location: "Tirupati",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    imagePosition: "left",
  },
];

const destinations = [
  { name: "Tirumala", detail: "Temple & pilgrimage", imagePosition: "left" },
  { name: "Chandragiri Fort", detail: "History & heritage", imagePosition: "center" },
  { name: "Horsley Hills", detail: "Weekend escape", imagePosition: "right" },
];

const benefits = [
  { icon: ShieldCheck, title: "Verified & maintained", copy: "Every car is checked before your key handover." },
  { icon: Ticket, title: "No surprise pricing", copy: "Clear rates, flexible plans and no hidden fees." },
  { icon: Compass, title: "Go beyond the usual", copy: "Curated road-trip inspiration from Tirupati." },
  { icon: Headphones, title: "Here when you need us", copy: "Real people and 24/7 roadside assistance." },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickup, setPickup] = useState("Tirupati Central Hub");
  const [startDate, setStartDate] = useState("2026-09-06");
  const [endDate, setEndDate] = useState("2026-09-08");
  const [notice, setNotice] = useState("");
  const [selectedFleet, setSelectedFleet] = useState("All cars");
  const [fleet, setFleet] = useState<CarFleetItem[]>(fallbackFleet);
  const [selectedCar, setSelectedCar] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
          setFleet(res.data);
        }
      })
      .catch((err) => {
        console.warn("[Fleet API] Live fetch error, active fallback enabled:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter cars dynamically by selected category tab
  const filteredFleet = useMemo(() => {
    if (selectedFleet === "All cars") return fleet;
    return fleet.filter((car) => {
      const cat = (car.category || "").toLowerCase();
      const tag = (car.tag || "").toLowerCase();
      const name = (car.name || "").toLowerCase();
      if (selectedFleet === "Hatchbacks") return cat.includes("hatchback") || name.includes("swift");
      if (selectedFleet === "Sedans") return cat.includes("sedan") || name.includes("city");
      if (selectedFleet === "SUVs") return cat.includes("suv") || name.includes("scorpio") || name.includes("creta");
      if (selectedFleet === "Luxury") return cat.includes("luxury") || tag.includes("luxury") || name.includes("innova");
      return cat === selectedFleet.toLowerCase();
    });
  }, [fleet, selectedFleet]);

  const handleSearch = () => {
    setNotice("Sending booking reservation...");
    const targetCar = selectedCar || (filteredFleet.length > 0 ? filteredFleet[0].name : "General Search Inquiry");

    fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pickup,
        startDate,
        endDate,
        carName: targetCar,
        bookingType: "Self Drive",
        status: "Pending",
        bookingSource: "Web Portal",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setNotice(`✅ Reservation requested for ${targetCar} in ${pickup} from ${startDate} to ${endDate}! Our fleet manager will contact you.`);
        } else {
          setNotice(`Failed to book: ${res.message || "Please try again"}`);
        }
      })
      .catch((err) => {
        console.error("Booking submission error:", err);
        setNotice(`Local Search: Showing vehicles available in ${pickup} from ${startDate} to ${endDate}.`);
      });

    document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-brand-cream text-brand-ink">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary-foreground/10 bg-brand-navy/80 backdrop-blur-md">
        <div className="relative mx-auto max-w-7xl px-5 py-4 sm:px-8 lg:px-10 flex items-center justify-between">
          <a href="#top" className="brand-mark flex items-center gap-2 text-xl tracking-tight text-primary-foreground" aria-label="Moar Cars home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-gold text-sm text-brand-gold font-bold">M</span>
            <span>MOAR <span className="text-brand-gold">CARS</span></span>
          </a>
          <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground/80 lg:flex">
            <a className="text-brand-gold" href="#top">Home</a>
            <a className="transition-colors hover:text-brand-gold" href="#fleet">Our fleet</a>
            <a className="transition-colors hover:text-brand-gold" href="#how-it-works">How it works</a>
            <a className="transition-colors hover:text-brand-gold" href="#explore">Explore</a>
            <a className="transition-colors hover:text-brand-gold" href="#about">About us</a>
            <a className="transition-colors hover:text-brand-gold" href="/admin">Admin Area</a>
          </nav>
          <div className="hidden items-center gap-5 lg:flex">
            <a href="tel:+918500012345" className="flex items-center gap-2 text-xs font-medium text-primary-foreground/85">
              <Phone className="h-3.5 w-3.5 text-brand-gold" /> +91 85000 12345
            </a>
            <Button
              className="h-10 rounded-sm bg-brand-gold px-5 text-xs font-bold uppercase tracking-[0.12em] text-brand-navy shadow-none hover:bg-brand-gold-soft"
              onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
            >
              Book a car <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <button
            className="rounded-sm p-2 text-primary-foreground lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mx-auto max-w-7xl grid gap-3 px-5 pb-5 text-sm text-primary-foreground lg:hidden">
            <a href="#fleet" onClick={() => setMenuOpen(false)}>Our fleet</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#explore" onClick={() => setMenuOpen(false)}>Explore Tirupati</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About us</a>
            <a href="/admin" onClick={() => setMenuOpen(false)}>Admin Area</a>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-68px)] flex items-center pt-16 bg-brand-navy text-primary-foreground">
        <img src={heroImage} alt="SUV driving through the Tirupati hills" className="absolute inset-0 h-full w-full object-cover object-center" width={1600} height={900} />
        <div className="hero-wash absolute inset-0" />
        <div className="absolute inset-0 bg-brand-navy/20" />
        
        <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10 flex flex-col justify-between gap-10">
          <div id="top" className="grid max-w-3xl gap-6 pt-4 sm:pt-6 lg:pt-8">
            <div className="animate-float-in flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              <span className="gold-rule" /> Tirupati&apos;s premium car rental
            </div>
            <h1 className="animate-float-in max-w-2xl text-5xl font-extrabold leading-[1.03] tracking-[-0.05em] sm:text-7xl" style={{ animationDelay: "80ms" }}>
              Your journey.<br />Your car.<br /><span className="text-brand-gold">Your way.</span>
            </h1>
            <p className="animate-float-in max-w-md text-base leading-7 text-primary-foreground/75 sm:text-lg" style={{ animationDelay: "160ms" }}>
              Take the long way home. Premium self-drive cars, simple booking and the freedom to explore Andhra Pradesh on your terms.
            </p>
            <div className="animate-float-in flex flex-wrap items-center gap-4" style={{ animationDelay: "240ms" }}>
              <Button
                className="h-12 rounded-sm bg-brand-gold px-6 font-bold text-brand-navy shadow-none hover:bg-brand-gold-soft"
                onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
              >
                Find your car <Search className="h-4 w-4 ml-2" />
              </Button>
              <a href="#how-it-works" className="group flex items-center gap-2 text-sm font-semibold text-primary-foreground/90">
                See how it works
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-foreground/40 transition-colors group-hover:border-brand-gold group-hover:text-brand-gold">
                  <Play className="h-3 w-3 fill-current" />
                </span>
              </a>
            </div>
          </div>

          {/* Booking Bar */}
          <div id="booking" className="w-full rounded-sm bg-brand-cream p-4 text-brand-ink shadow-2xl shadow-brand-navy/30 sm:p-5 border border-amber-900/10">
            <div className="grid gap-3 lg:grid-cols-[1.1fr_1.1fr_1fr_1fr_auto] lg:items-end">
              <label className="grid gap-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Pick-up location
                <span className="flex h-12 items-center gap-3 border-b border-border px-2 text-sm font-semibold normal-case tracking-normal">
                  <MapPin className="h-4 w-4 text-brand-gold shrink-0" />
                  <select value={pickup} onChange={(event) => setPickup(event.target.value)} className="w-full bg-transparent outline-none">
                    <option value="Tirupati Central Hub">Tirupati Central Hub (Station)</option>
                    <option value="Renigunta Airport Hub">Renigunta Airport Hub (T1)</option>
                    <option value="Chandragiri Heritage Point">Chandragiri Heritage Point</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                </span>
              </label>

              <label className="grid gap-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Select Model
                <span className="flex h-12 items-center gap-3 border-b border-border px-2 text-sm font-semibold normal-case tracking-normal">
                  <Sparkles className="h-4 w-4 text-brand-gold shrink-0" />
                  <select value={selectedCar} onChange={(event) => setSelectedCar(event.target.value)} className="w-full bg-transparent outline-none">
                    <option value="">Any Available Vehicle</option>
                    {fleet.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.price})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                </span>
              </label>

              <label className="grid gap-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Start date
                <span className="flex h-12 items-center gap-3 border-b border-border px-2">
                  <CalendarDays className="h-4 w-4 text-brand-gold shrink-0" />
                  <input aria-label="Start date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none" />
                </span>
              </label>

              <label className="grid gap-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Return date
                <span className="flex h-12 items-center gap-3 border-b border-border px-2">
                  <CalendarDays className="h-4 w-4 text-brand-gold shrink-0" />
                  <input aria-label="Return date" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none" />
                </span>
              </label>

              <Button onClick={handleSearch} className="h-12 rounded-sm bg-brand-teal px-7 font-bold text-primary-foreground shadow-none hover:bg-brand-teal/90 flex items-center justify-center gap-2">
                Search cars <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            {notice && (
              <div role="status" className="mt-3 flex items-center gap-2 rounded bg-brand-teal/10 px-3 py-2 text-xs font-semibold text-brand-teal">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {notice}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-b border-border bg-brand-cream py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-4 lg:px-10">
          {benefits.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex gap-4 border-l border-border pl-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold-soft text-brand-navy">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fleet Collection Section */}
      <section id="fleet" className="page-grid scroll-mt-10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">The Moar collection</p>
              <h2 className="mt-3 max-w-xl text-4xl font-extrabold leading-tight tracking-[-0.04em] sm:text-5xl">
                Find a car that feels like <span className="text-brand-teal">you.</span>
              </h2>
            </div>
            <a href="#booking" className="flex items-center gap-2 text-sm font-bold text-brand-navy hover:text-brand-teal">
              View all {fleet.length} cars <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {/* Filter Categories */}
          <div className="mt-9 flex flex-wrap gap-2" role="tablist" aria-label="Vehicle categories">
            {["All cars", "Hatchbacks", "Sedans", "SUVs", "Luxury"].map((filter) => (
              <button
                key={filter}
                role="tab"
                aria-selected={selectedFleet === filter}
                onClick={() => setSelectedFleet(filter)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                  selectedFleet === filter
                    ? "border-brand-navy bg-brand-navy text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-brand-teal hover:text-brand-teal"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Cars Grid */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFleet.map((car) => {
              const carImg = car.image || fleetImage;
              return (
                <article key={car.name} className="group overflow-hidden rounded-md border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between">
                  <div className="relative h-60 overflow-hidden bg-brand-navy">
                    <img
                      src={carImg}
                      alt={`${car.name} vehicle collection`}
                      loading="lazy"
                      width={800}
                      height={500}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fleetImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    
                    {/* Tags */}
                    <span className="absolute left-4 top-4 rounded-full bg-brand-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-navy shadow">
                      {car.tag || car.category}
                    </span>

                    {car.status && (
                      <span
                        className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          car.status === "Available"
                            ? "bg-emerald-600/90 text-white"
                            : car.status === "Booked"
                            ? "bg-amber-600/90 text-white"
                            : "bg-purple-600/90 text-white"
                        }`}
                      >
                        {car.status}
                      </span>
                    )}

                    {car.location && (
                      <span className="absolute bottom-3 left-4 flex items-center gap-1 text-[11px] font-medium text-white/90 drop-shadow">
                        <MapPin className="h-3.5 w-3.5 text-brand-gold" /> {car.location}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-4 p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-teal transition-colors">
                          {car.name}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {car.detail}
                      </p>

                      {/* Specs Badge Bar */}
                      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border/60 pt-3 text-[11px] font-semibold text-muted-foreground">
                        {car.seats && (
                          <span className="flex items-center gap-1 bg-brand-mist/60 px-2 py-1 rounded">
                            <Users className="h-3.5 w-3.5 text-brand-teal" /> {car.seats} Seats
                          </span>
                        )}
                        {car.fuelType && (
                          <span className="flex items-center gap-1 bg-brand-mist/60 px-2 py-1 rounded">
                            <Fuel className="h-3.5 w-3.5 text-brand-teal" /> {car.fuelType}
                          </span>
                        )}
                        {car.transmission && (
                          <span className="flex items-center gap-1 bg-brand-mist/60 px-2 py-1 rounded">
                            <Gauge className="h-3.5 w-3.5 text-brand-teal" /> {car.transmission}
                          </span>
                        )}
                        {car.mileage && (
                          <span className="flex items-center gap-1 bg-brand-mist/60 px-2 py-1 rounded">
                            ⚡ {car.mileage}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-end justify-between border-t border-border pt-4 mt-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Starting From</p>
                        <p className="mt-0.5 text-xl font-black text-brand-teal">
                          {car.price || (car.pricePerDay ? `₹${car.pricePerDay.toLocaleString('en-IN')}` : "₹1,699")}
                          <span className="text-xs font-normal text-muted-foreground"> / day</span>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-sm border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-primary-foreground font-semibold text-xs"
                        onClick={() => {
                          setSelectedCar(car.name);
                          setNotice(`🚗 ${car.name} selected! Choose your dates above and click Search.`);
                          document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        Choose car <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-brand-navy py-24 text-primary-foreground sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">More than a rental</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.04em] sm:text-5xl">
              The best stories start when you <span className="text-brand-gold">take the wheel.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/70">
              We make self-drive simple, so you can spend less time organising and more time discovering. From an early temple visit to a late-night hill drive, your next chapter starts here.
            </p>
            <a href="#how-it-works" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand-gold">
              Why drive with Moar <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="relative overflow-hidden rounded-sm border border-primary-foreground/15">
            <img src={heroImage} alt="Road winding through the hills around Tirupati" loading="lazy" width={1600} height={900} className="h-[360px] w-full object-cover sm:h-[450px]" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border border-primary-foreground/20 bg-brand-navy/80 p-4 backdrop-blur-sm">
              <div>
                <p className="text-2xl font-extrabold">50+</p>
                <p className="text-xs text-primary-foreground/60">cars ready to go</p>
              </div>
              <div className="h-9 w-px bg-primary-foreground/20" />
              <div>
                <p className="text-2xl font-extrabold">4.9/5</p>
                <p className="text-xs text-primary-foreground/60">traveller rating</p>
              </div>
              <div className="h-9 w-px bg-primary-foreground/20" />
              <div>
                <p className="text-2xl font-extrabold">24/7</p>
                <p className="text-xs text-primary-foreground/60">roadside care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Destinations Section */}
      <section id="explore" className="bg-brand-cream py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">Make a day of it</p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">Explore from Tirupati.</h2>
            </div>
            <Compass className="hidden h-12 w-12 text-brand-gold sm:block" />
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {destinations.map((destination) => (
              <a key={destination.name} href="#booking" className="group relative h-72 overflow-hidden rounded-sm bg-brand-navy">
                <img
                  src={heroImage}
                  alt={destination.name}
                  loading="lazy"
                  width={1600}
                  height={900}
                  className={`h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100 ${
                    destination.imagePosition === "left" ? "object-left" : destination.imagePosition === "right" ? "object-right" : "object-center"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/15 to-transparent" />
                <div className="absolute bottom-5 left-5 text-primary-foreground">
                  <p className="text-xl font-bold">{destination.name}</p>
                  <p className="mt-1 text-xs text-primary-foreground/70">{destination.detail}</p>
                </div>
                <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold text-brand-navy transition-transform group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="border-y border-border bg-brand-mist py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-teal">Simple by design</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.04em]">Your road, in four easy steps.</h2>
          </div>
          <div className="grid gap-0 sm:grid-cols-4">
            {[
              { n: "01", title: "Choose", copy: "Pick a car that fits your day." },
              { n: "02", title: "Reserve", copy: "Select dates and lock it in." },
              { n: "03", title: "Collect", copy: "Meet us or choose doorstep delivery." },
              { n: "04", title: "Drive", copy: "Turn the key and go your way." },
            ].map((step, index) => (
              <div key={step.n} className="relative border-l border-brand-teal/30 py-4 pl-5 sm:py-0">
                <span className="text-xs font-bold text-brand-gold">{step.n}</span>
                <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 pr-4 text-xs leading-5 text-muted-foreground">{step.copy}</p>
                {index < 3 && <ChevronRight className="absolute -right-2 top-1/2 hidden h-4 w-4 bg-brand-mist text-brand-teal sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-ink py-14 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 border-b border-primary-foreground/15 pb-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <a href="#top" className="brand-mark flex items-center gap-2 text-xl">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-gold text-sm text-brand-gold">M</span>
                MOAR <span className="text-brand-gold">CARS</span>
              </a>
              <p className="mt-5 max-w-xs text-sm leading-6 text-primary-foreground/55">
                Drive more. Explore more. Premium self-drive cars for every Tirupati story.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs text-primary-foreground/60">
                <MapPin className="h-4 w-4 text-brand-gold" /> Tirupati, Andhra Pradesh
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">Discover</h3>
              <div className="mt-5 grid gap-3 text-sm text-primary-foreground/65">
                <a href="#fleet" className="hover:text-brand-gold">Our fleet</a>
                <a href="#explore" className="hover:text-brand-gold">Explore Tirupati</a>
                <a href="#how-it-works" className="hover:text-brand-gold">How it works</a>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">Company</h3>
              <div className="mt-5 grid gap-3 text-sm text-primary-foreground/65">
                <a href="#about" className="hover:text-brand-gold">About Moar</a>
                <a href="mailto:hello@moarcars.in" className="hover:text-brand-gold">Contact us</a>
                <a href="#booking" className="hover:text-brand-gold">Book a car</a>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">Need a hand?</h3>
              <a href="tel:+918500012345" className="mt-5 flex items-center gap-2 text-sm text-primary-foreground/65 hover:text-brand-gold">
                <Phone className="h-4 w-4" /> +91 85000 12345
              </a>
              <p className="mt-3 text-xs text-primary-foreground/45">Available every day, all day.</p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 pt-7 text-xs text-primary-foreground/40 sm:flex-row">
            <p>© 2026 Moar Cars. All rights reserved.</p>
            <p>Made for the road ahead.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
