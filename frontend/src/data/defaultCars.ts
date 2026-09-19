export interface CarFleetItem {
  id: number | string;
  name: string;
  brand: string;
  model: string;
  variant: string;
  year?: number;
  registrationNumber?: string;
  vinNumber?: string;
  detail: string;
  price: string;
  pricePerDay: number;
  pricePerHour?: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  priceDisplay?: string;
  securityDeposit?: number;
  lateFeePerHour?: number;
  tag: string;
  category: string;
  subCategory?: string;
  fuelType: string;
  transmission: string;
  seats: number;
  mileage: string;
  color?: string;
  status?: string;
  branch?: string;
  location: string;
  gpsEnabled?: boolean | number;
  fastagNumber?: string;
  image: string;
  galleryImages?: string[];
  angle360Images?: string[];
  hasSunroof?: boolean;
  hasGPS?: boolean;
  hasAC?: boolean;
  instantBooking?: boolean;
  freeCancellation?: boolean;
  doorstepDelivery?: boolean;
  rating?: number;
  tripsCount?: number;
  totalTrips?: number;
  totalRevenue?: number;
  maintenanceCost?: number;
  isArchived?: number;
}

// Default Fleet for instant hydration & resilient offline/initial rendering
export const DEFAULT_DATABASE_CARS: CarFleetItem[] = [
  {
    id: 1,
    name: "Toyota Innova Crysta 2.4 ZX",
    brand: "Toyota",
    model: "Innova Crysta",
    variant: "2.4 ZX Automatic",
    year: 2024,
    registrationNumber: "AP 03 TC 2024",
    detail: "Flagship 7-seater luxury MUV. Supreme comfort with captain seats, rear AC vents, and massive boot space for pilgrimage families.",
    price: "₹3,499/day",
    pricePerHour: 299,
    pricePerDay: 3499,
    pricePerWeek: 21999,
    pricePerMonth: 79999,
    securityDeposit: 5000,
    lateFeePerHour: 250,
    tag: "Family Favorite",
    category: "MUV",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 7,
    mileage: "15 km/l",
    color: "Super White",
    status: "Available",
    branch: "Tirupati Central Hub",
    location: "Tirupati",
    gpsEnabled: true,
    fastagNumber: "FTG-881920-01",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    ],
    angle360Images: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.9,
    totalTrips: 184,
    tripsCount: 184,
  },
  {
    id: 2,
    name: "Mahindra Scorpio-N Z8L 4x4",
    brand: "Mahindra",
    model: "Scorpio-N",
    variant: "Z8L 4WD AT",
    year: 2024,
    registrationNumber: "AP 03 SN 8821",
    detail: "Big Daddy of SUVs with 4x4 off-road capability. High ground clearance, hill descent control, and dual-zone climate control.",
    price: "₹3,199/day",
    pricePerHour: 249,
    pricePerDay: 3199,
    pricePerWeek: 19999,
    pricePerMonth: 74999,
    securityDeposit: 5000,
    lateFeePerHour: 200,
    tag: "Off-Road Ready",
    category: "SUV",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 7,
    mileage: "16 km/l",
    color: "Deep Forest",
    status: "Available",
    branch: "Tirupati Central Hub",
    location: "Tirupati",
    gpsEnabled: true,
    fastagNumber: "FTG-881920-02",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.8,
    totalTrips: 142,
    tripsCount: 142,
  },
  {
    id: 3,
    name: "Mahindra Thar 4x4 Hardtop",
    brand: "Mahindra",
    model: "Thar",
    variant: "LX 4x4 Hardtop AT",
    year: 2024,
    registrationNumber: "AP 03 TH 1024",
    detail: "Iconic 4x4 off-road adventure beast. Hardtop insulation, touch display with off-road statistics, and heavy-duty 18-inch all-terrain tyres.",
    price: "₹2,499/day",
    pricePerHour: 199,
    pricePerDay: 2499,
    pricePerWeek: 15999,
    pricePerMonth: 59999,
    securityDeposit: 3000,
    lateFeePerHour: 150,
    tag: "Adventure",
    category: "SUV",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 4,
    mileage: "15 km/l",
    color: "Rocky Beige",
    status: "Available",
    branch: "Renigunta Airport Hub",
    location: "Renigunta / Tirupati",
    gpsEnabled: true,
    fastagNumber: "FTG-881920-03",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.9,
    totalTrips: 110,
    tripsCount: 110,
  },
  {
    id: 4,
    name: "Hyundai Creta SX(O) Turbo",
    brand: "Hyundai",
    model: "Creta",
    variant: "SX(O) 1.5 Turbo DCT",
    year: 2024,
    registrationNumber: "AP 03 CR 4410",
    detail: "Premium 5-seater compact SUV with panoramic sunroof, ventilated leatherette seats, and Level 2 ADAS active safety suite.",
    price: "₹2,399/day",
    pricePerHour: 189,
    pricePerDay: 2399,
    pricePerWeek: 14999,
    pricePerMonth: 54999,
    securityDeposit: 3000,
    lateFeePerHour: 150,
    tag: "Executive Luxury",
    category: "SUV",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    mileage: "18 km/l",
    color: "Titan Grey Matte",
    status: "Available",
    branch: "Tirupati Central Hub",
    location: "Tirupati",
    gpsEnabled: true,
    fastagNumber: "FTG-881920-04",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.8,
    totalTrips: 98,
    tripsCount: 98,
  },
  {
    id: 5,
    name: "Maruti Suzuki Ertiga ZXi+ Hybrid",
    brand: "Maruti Suzuki",
    model: "Ertiga",
    variant: "ZXi+ Smart Hybrid",
    year: 2024,
    registrationNumber: "AP 03 ER 6620",
    detail: "Smart hybrid 7-seater family cruiser. Maximum fuel efficiency (20.5 km/l), chilled cup holders, and comfortable legroom.",
    price: "₹2,199/day",
    pricePerHour: 169,
    pricePerDay: 2199,
    pricePerWeek: 13999,
    pricePerMonth: 49999,
    securityDeposit: 3000,
    lateFeePerHour: 120,
    tag: "Best Value",
    category: "MUV",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 7,
    mileage: "20 km/l",
    color: "Splendid Silver",
    status: "Available",
    branch: "Alipiri Tirumala Gate",
    location: "Tirupati",
    gpsEnabled: true,
    fastagNumber: "FTG-881920-05",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.7,
    totalTrips: 156,
    tripsCount: 156,
  },
  {
    id: 6,
    name: "Toyota Fortuner Legender 4x4",
    brand: "Toyota",
    model: "Fortuner",
    variant: "Legender 4x4 Automatic",
    year: 2024,
    registrationNumber: "AP 03 FL 9999",
    detail: "Ultra-premium flagship SUV. 500Nm torque, wireless charger, JBL 11-speaker acoustic sound, and commanding road presence.",
    price: "₹6,499/day",
    pricePerHour: 599,
    pricePerDay: 6499,
    pricePerWeek: 39999,
    pricePerMonth: 149999,
    securityDeposit: 10000,
    lateFeePerHour: 450,
    tag: "VIP Flagship",
    category: "Luxury",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 7,
    mileage: "14 km/l",
    color: "Dual Tone Pearl White & Black",
    status: "Available",
    branch: "Tirupati Central Hub",
    location: "Tirupati",
    gpsEnabled: true,
    fastagNumber: "FTG-881920-06",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 5.0,
    totalTrips: 64,
    tripsCount: 64,
  },
  {
    id: 7,
    name: "Maruti Suzuki Swift ZXi+ DualTone",
    brand: "Maruti Suzuki",
    model: "Swift",
    variant: "ZXi+ Dual Tone",
    year: 2024,
    registrationNumber: "AP 03 SW 5500",
    detail: "Zippy, compact hatchback ideal for local temple visits and tight city lanes. Keyless push button start and 22 km/l mileage.",
    price: "₹1,499/day",
    pricePerHour: 119,
    pricePerDay: 1499,
    pricePerWeek: 8999,
    pricePerMonth: 29999,
    securityDeposit: 2000,
    lateFeePerHour: 100,
    tag: "City Cruiser",
    category: "Hatchback",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
    mileage: "22 km/l",
    color: "Luster Blue / Midnight Black",
    status: "Available",
    branch: "Tirupati Central Hub",
    location: "Tirupati",
    gpsEnabled: true,
    fastagNumber: "FTG-881920-07",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.8,
    totalTrips: 210,
    tripsCount: 210,
  },
  {
    id: 8,
    name: "Tata Nexon EV Max Long Range",
    brand: "Tata",
    model: "Nexon EV",
    variant: "Empowered+ LR",
    year: 2024,
    registrationNumber: "AP 03 EV 3300",
    detail: "100% Zero-emission electric SUV. 453 km ARAI range, rapid DC fast charging, and whisper-quiet ghat road performance.",
    price: "₹2,299/day",
    pricePerHour: 179,
    pricePerDay: 2299,
    pricePerWeek: 14499,
    pricePerMonth: 51999,
    securityDeposit: 3000,
    lateFeePerHour: 140,
    tag: "Eco Green",
    category: "Electric",
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 5,
    mileage: "453 km/charge",
    color: "Intensi-Teal",
    status: "Available",
    branch: "Renigunta Airport Hub",
    location: "Renigunta / Tirupati",
    gpsEnabled: true,
    fastagNumber: "FTG-881920-08",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.9,
    totalTrips: 88,
    tripsCount: 88,
  },
];
