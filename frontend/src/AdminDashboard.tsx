import React, { useState, useEffect, useMemo } from "react";
import {
  Lock,
  User,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Car,
  DollarSign,
  LogOut,
  Shield,
  Mail,
  KeyRound,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  BarChart3,
  Layers,
  Settings,
  Globe,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Activity,
  ArrowUpRight,
  Phone,
  Eye,
  Bell,
  Sparkles,
  Users,
  Building2,
  CreditCard,
  Tag,
  Star,
  FileText,
  LayoutTemplate,
  Headphones,
  ShieldCheck,
  History,
  Moon,
  Sun,
  Smartphone,
  Laptop,
  Check,
  X,
  Filter,
  Download,
  Send,
  Printer,
  ChevronRight,
  Percent,
  Sliders,
  Award,
  CircleDot,
  Wrench,
  Fuel,
  Gauge,
  UserCheck,
  Copy,
  Archive,
  Upload,
  Camera,
  Video,
  FileCheck,
  Navigation,
  Compass,
  Flame,
  Zap,
  CalendarDays,
  Grid,
  List,
  RotateCw,
  AlertTriangle,
  Plane,
  Briefcase,
  Repeat,
  FileSignature,
  Receipt,
  CarTaxiFront,
  BadgeAlert,
  SlidersVertical,
  Wallet,
  Gift,
  Ban,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ----------------------------------------------------------------------
// TYPES & MODULAR COMPONENTS
// ----------------------------------------------------------------------
import {
  UserRole,
  BookingType,
  BookingStatus,
  CarStatus,
  BookingItem,
  CarItem,
  CustomerItem,
  DriverItem,
  BranchItem,
  PaymentItem,
  CouponItem,
  CMSBannerItem,
  CMSOfferItem,
  CMSTestimonialItem,
  CMSFaqItem,
  CMSBlogItem,
  NotificationTemplateItem,
  ReviewItem,
  SupportTicketItem,
  ActivityLogItem,
} from "./admin/types";

import {
  initialBanners,
  initialOffers,
  initialTestimonials,
  initialFaqs,
  initialBlogs,
  initialNotificationTemplates,
  initialReviews,
  initialSupportTickets,
  initialActivityLogs,
} from "./admin/mockData";

import CustomerManagement from "./admin/CustomerManagement";
import DriverManagement from "./admin/DriverManagement";
import BranchManagement from "./admin/BranchManagement";
import PaymentManagement from "./admin/PaymentManagement";
import CouponEngine from "./admin/CouponEngine";
import ReportsSuite from "./admin/ReportsSuite";
import CMSManagement from "./admin/CMSManagement";
import SettingsManagement from "./admin/SettingsManagement";
import NotificationsCenter from "./admin/NotificationsCenter";
import ReviewsModeration from "./admin/ReviewsModeration";
import SupportDesk from "./admin/SupportDesk";
import SecurityCenter from "./admin/SecurityCenter";
import ActivityLogsTimeline from "./admin/ActivityLogsTimeline";
import { adminApi } from "./admin/adminApi";

interface AdminDashboardProps {

  onNavigate: (path: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isDark = theme === "dark";

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    email: string;
    role: UserRole;
    branch: string;
  }>({
    username: "Executive Super Admin",
    email: "moarcars04@gmail.com",
    role: "Super Admin",
    branch: "All Branches",
  });

  // Active Main Navigation Tab
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "fleet"
    | "bookings"
    | "customers"
    | "drivers"
    | "branches"
    | "payments"
    | "coupons"
    | "reports"
    | "cms"
    | "notifications"
    | "reviews"
    | "support"
    | "security"
    | "logs"
    | "roles"
    | "sessions"
    | "settings"
  >("dashboard");

  // CMS & Engagement State
  const [banners, setBanners] = useState<CMSBannerItem[]>(initialBanners);
  const [offers, setOffers] = useState<CMSOfferItem[]>(initialOffers);
  const [testimonials, setTestimonials] = useState<CMSTestimonialItem[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<CMSFaqItem[]>(initialFaqs);
  const [blogs, setBlogs] = useState<CMSBlogItem[]>(initialBlogs);
  const [templates, setTemplates] = useState<NotificationTemplateItem[]>(initialNotificationTemplates);
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [tickets, setTickets] = useState<SupportTicketItem[]>(initialSupportTickets);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(initialActivityLogs);

  // Fleet Sub-Tab State
  const [fleetSubTab, setFleetSubTab] = useState<"roster" | "calendar" | "maintenance" | "analytics">("roster");
  const [fleetFilterStatus, setFleetFilterStatus] = useState<string>("all");
  const [fleetFilterCategory, setFleetFilterCategory] = useState<string>("all");
  const [selectedCarIds, setSelectedCarIds] = useState<number[]>([]);

  // Booking Sub-Tab State
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>("all");
  const [bookingFilterType, setBookingFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals State
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingItem | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [activeBookingModal, setActiveBookingModal] = useState<
    "timeline" | "inspection" | "reschedule" | "upgrade" | "invoice" | "agreement" | "assign_driver" | "summary" | null
  >(null);

  // Fleet Modals
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarItem | null>(null);
  const [activeCarModalTab, setActiveCarModalTab] = useState<"specs" | "pricing" | "compliance" | "media">("specs");
  const [isBulkCsvModalOpen, setIsBulkCsvModalOpen] = useState(false);
  const [bulkCsvInput, setBulkCsvInput] = useState("");
  const [viewing360Car, setViewing360Car] = useState<CarItem | null>(null);
  const [angle360Index, setAngle360Index] = useState(0);

  // Notice
  const [notice, setNotice] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Reschedule & Upgrade & Inspection Form State
  const [rescheduleDates, setRescheduleDates] = useState({ startDate: "", endDate: "" });
  const [upgradeCarTarget, setUpgradeCarTarget] = useState("");
  const [driverAssignForm, setDriverAssignForm] = useState({
    driverName: "Suresh Kumar (+91 98765 00001)",
    driverPhone: "+91 98765 00001",
    deliveryStaff: "Ravi Teja",
  });

  const [inspectionState, setInspectionState] = useState({
    startOdo: 24100,
    returnOdo: 24350,
    startFuel: 100,
    returnFuel: 90,
    fuelDeficitLitres: 5,
    smokingViolation: false,
    lateHours: 0,
    cleaningFee: 0,
    scratchDamageFee: 0,
    checklist: {
      frontBumper: false,
      rearBumper: false,
      doors: false,
      windshield: false,
      interiorCabin: false,
      tyres: false,
    },
  });

  // ----------------------------------------------------------------------
  // FLEET STATE
  // ----------------------------------------------------------------------
  const [fleet, setFleet] = useState<CarItem[]>([
    {
      id: 1,
      name: "Maruti Swift ZXi+",
      brand: "Maruti Suzuki",
      model: "Swift",
      variant: "ZXi Plus Dual Tone",
      year: 2024,
      registrationNumber: "AP 03 TX 1024",
      vinNumber: "MA3EYD21S00192844",
      detail: "Smart 5-seater hatchback, agile city commuter with touch infotainment",
      price: "₹1,699",
      pricePerHour: 199,
      pricePerDay: 1699,
      pricePerWeek: 9999,
      pricePerMonth: 34999,
      securityDeposit: 3000,
      lateFeePerHour: 150,
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
      gpsEnabled: true,
      fastagNumber: "FTG-889021-39",
      insuranceExpiry: "2027-04-15",
      pollutionExpiry: "2026-11-20",
      fitnessExpiry: "2028-08-10",
      permitExpiry: "2027-12-31",
      rcDocUrl: "https://moarcars.com/docs/rc_1024.pdf",
      insuranceDocUrl: "https://moarcars.com/docs/ins_1024.pdf",
      image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      ],
      angle360Images: [
        "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-country-road-4101-large.mp4",
      totalTrips: 42,
      totalRevenue: 71358,
      maintenanceCost: 4500,
      lastServiceKm: 18000,
      nextServiceKm: 25000,
      oilChangeStatus: "Good",
      tyreHealth: "Excellent",
      batteryHealth: "Good",
    },
    {
      id: 2,
      name: "Honda City ZX Automatic",
      brand: "Honda",
      model: "City",
      variant: "ZX CVT Sunroof",
      year: 2024,
      registrationNumber: "AP 03 DX 5088",
      vinNumber: "MAKGM21S00288190",
      detail: "Executive sedan with sunroof, leather upholstery, and ADAS Level 2 safety",
      price: "₹2,199",
      pricePerHour: 249,
      pricePerDay: 2199,
      pricePerWeek: 12999,
      pricePerMonth: 44999,
      securityDeposit: 4000,
      lateFeePerHour: 200,
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
      gpsEnabled: true,
      fastagNumber: "FTG-994012-77",
      insuranceExpiry: "2027-02-10",
      pollutionExpiry: "2026-10-15",
      fitnessExpiry: "2028-05-12",
      permitExpiry: "2027-11-20",
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
      galleryImages: [],
      angle360Images: [],
      totalTrips: 36,
      totalRevenue: 79164,
      maintenanceCost: 6200,
      lastServiceKm: 22000,
      nextServiceKm: 30000,
      oilChangeStatus: "Good",
      tyreHealth: "Good",
      batteryHealth: "Good",
    },
    {
      id: 3,
      name: "Mahindra Scorpio-N Z8L 4x4",
      brand: "Mahindra",
      model: "Scorpio-N",
      variant: "Z8L 4x4 Automatic Diesel",
      year: 2024,
      registrationNumber: "AP 03 ZX 9900",
      vinNumber: "MA1Z8L44A00993812",
      detail: "Dominant 7-seater luxury SUV, 4Xplorer terrain modes for Tirumala ghat roads",
      price: "₹2,499",
      pricePerHour: 299,
      pricePerDay: 2499,
      pricePerWeek: 14999,
      pricePerMonth: 54999,
      securityDeposit: 5000,
      lateFeePerHour: 250,
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
      gpsEnabled: true,
      fastagNumber: "FTG-771120-45",
      insuranceExpiry: "2027-08-30",
      pollutionExpiry: "2026-09-25",
      fitnessExpiry: "2029-01-15",
      permitExpiry: "2028-04-10",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      galleryImages: [],
      angle360Images: [],
      totalTrips: 48,
      totalRevenue: 119952,
      maintenanceCost: 8900,
      lastServiceKm: 28000,
      nextServiceKm: 30000,
      oilChangeStatus: "Due Soon",
      tyreHealth: "Good",
      batteryHealth: "Good",
    },
    {
      id: 4,
      name: "Toyota Innova Crysta ZX",
      brand: "Toyota",
      model: "Innova Crysta",
      variant: "2.4 ZX Captain Seats",
      year: 2024,
      registrationNumber: "AP 03 AX 7777",
      vinNumber: "MB7CRYS2400777123",
      detail: "Unmatched pilgrimage luxury, captain seats with climate control",
      price: "₹3,499",
      pricePerHour: 399,
      pricePerDay: 3499,
      pricePerWeek: 20999,
      pricePerMonth: 74999,
      securityDeposit: 6000,
      lateFeePerHour: 300,
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
      gpsEnabled: true,
      fastagNumber: "FTG-556677-88",
      insuranceExpiry: "2027-06-18",
      pollutionExpiry: "2026-12-05",
      fitnessExpiry: "2029-03-20",
      permitExpiry: "2028-06-15",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      galleryImages: [],
      angle360Images: [],
      totalTrips: 29,
      totalRevenue: 101471,
      maintenanceCost: 5100,
      lastServiceKm: 31000,
      nextServiceKm: 40000,
      oilChangeStatus: "Good",
      tyreHealth: "Good",
      batteryHealth: "Good",
    },
    {
      id: 5,
      name: "Hyundai Creta SX(O)",
      brand: "Hyundai",
      model: "Creta",
      variant: "SX(O) Turbo DCT",
      year: 2024,
      registrationNumber: "AP 03 KX 4421",
      vinNumber: "MALHC81SB00399120",
      detail: "Panoramic sunroof, ventilated front seats, premium Bose audio system",
      price: "₹2,299",
      pricePerHour: 259,
      pricePerDay: 2299,
      pricePerWeek: 13999,
      pricePerMonth: 48999,
      securityDeposit: 4000,
      lateFeePerHour: 220,
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
      gpsEnabled: true,
      fastagNumber: "FTG-112233-44",
      insuranceExpiry: "2027-05-10",
      pollutionExpiry: "2026-10-30",
      fitnessExpiry: "2028-11-15",
      permitExpiry: "2027-09-20",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
      galleryImages: [],
      angle360Images: [],
      totalTrips: 34,
      totalRevenue: 78166,
      maintenanceCost: 12000,
      lastServiceKm: 25000,
      nextServiceKm: 26000,
      oilChangeStatus: "Overdue",
      tyreHealth: "Replace Soon",
      batteryHealth: "Check Required",
    },
  ]);

  // ----------------------------------------------------------------------
  // CRM CUSTOMERS DATABASE
  // ----------------------------------------------------------------------
  const [customers, setCustomers] = useState<CustomerItem[]>([
    {
      id: 201,
      name: "Rajesh Varma",
      phone: "+91 98765 11223",
      email: "rajesh.v@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      kycStatus: "Verified",
      dlNumber: "AP03 20210088992",
      aadhaarNumber: "7890 1234 5678",
      walletBalance: 2500,
      loyaltyPoints: 1250,
      referralCode: "RAJESH77",
      savedAddresses: ["Platform 1 Exit, Tirupati Main Station", "Fortune Grand Hotel, Tirupati"],
      favoriteCars: ["Mahindra Scorpio-N Z8L 4x4"],
      isBlacklisted: false,
      notes: "VIP Gold Renter. Frequent pilgrimage weekend visitor.",
      totalBookings: 8,
      totalSpent: 48900,
      joinedDate: "2025-11-10",
    },
    {
      id: 202,
      name: "Ananya Sharma",
      phone: "+91 98480 33445",
      email: "ananya.s@outlook.com",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      kycStatus: "Verified",
      dlNumber: "KA05 20220019283",
      aadhaarNumber: "4567 8901 2345",
      walletBalance: 1200,
      loyaltyPoints: 840,
      referralCode: "ANANYA22",
      savedAddresses: ["Terminal 1, Renigunta Airport"],
      favoriteCars: ["Honda City ZX Automatic"],
      isBlacklisted: false,
      notes: "Corporate executive. Always requests child seat booster.",
      totalBookings: 5,
      totalSpent: 28400,
      joinedDate: "2026-01-15",
    },
    {
      id: 203,
      name: "Vikram Rathore",
      phone: "+91 94401 77889",
      email: "vikram.r@yahoo.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      kycStatus: "Pending",
      dlNumber: "DL04 20230099182",
      aadhaarNumber: "9012 3456 7890",
      walletBalance: 0,
      loyaltyPoints: 150,
      referralCode: "VIKRAM99",
      savedAddresses: ["Chandragiri Fort Heritage Gate"],
      favoriteCars: ["Toyota Innova Crysta ZX"],
      isBlacklisted: false,
      notes: "Aadhaar pending manual back-side photo verification.",
      totalBookings: 2,
      totalSpent: 13996,
      joinedDate: "2026-08-01",
    },
    {
      id: 204,
      name: "Praveen Rao",
      phone: "+91 98852 99001",
      email: "praveen@gmail.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      kycStatus: "Verified",
      dlNumber: "TS09 20200044192",
      aadhaarNumber: "1234 5678 9012",
      walletBalance: 500,
      loyaltyPoints: 620,
      referralCode: "PRAVEEN10",
      savedAddresses: ["Tirupati City Center"],
      favoriteCars: ["Maruti Swift ZXi+"],
      isBlacklisted: false,
      notes: "Punctual returns, 100% on-time record.",
      totalBookings: 6,
      totalSpent: 21500,
      joinedDate: "2026-02-20",
    },
  ]);

  // ----------------------------------------------------------------------
  // DRIVER ROSTER DATABASE
  // ----------------------------------------------------------------------
  const [drivers, setDrivers] = useState<DriverItem[]>([
    {
      id: 301,
      name: "Suresh Kumar",
      phone: "+91 98765 00001",
      email: "suresh.driver@moarcars.in",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
      licenseNumber: "AP03 20180099182",
      licenseExpiry: "2029-06-30",
      bgVerification: "Passed",
      branch: "Renigunta Airport Hub",
      status: "Available",
      liveLocation: "Renigunta Airport Terminal 1 Hub",
      todayTrips: 2,
      totalTrips: 184,
      earnings: 46200,
      rating: 4.9,
      ratingCount: 142,
    },
    {
      id: 302,
      name: "Gopal Naidu",
      phone: "+91 98765 00002",
      email: "gopal.naidu@moarcars.in",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      licenseNumber: "AP03 20160088192",
      licenseExpiry: "2028-11-15",
      bgVerification: "Passed",
      branch: "Chandragiri Heritage Point",
      status: "On Trip",
      liveLocation: "En route to Horsley Hills Resort",
      todayTrips: 1,
      totalTrips: 210,
      earnings: 58900,
      rating: 4.8,
      ratingCount: 198,
    },
    {
      id: 303,
      name: "Srinivas Reddy",
      phone: "+91 98765 00003",
      email: "srinivas.r@moarcars.in",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
      licenseNumber: "AP03 20190011223",
      licenseExpiry: "2030-01-20",
      bgVerification: "Passed",
      branch: "Tirupati Central Hub",
      status: "Available",
      liveLocation: "Tirupati Central Hub Station Desk",
      todayTrips: 1,
      totalTrips: 145,
      earnings: 38400,
      rating: 5.0,
      ratingCount: 110,
    },
    {
      id: 304,
      name: "Venkatesh Rao",
      phone: "+91 98765 00004",
      email: "venkatesh.v@moarcars.in",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      licenseNumber: "AP03 20170077441",
      licenseExpiry: "2027-08-10",
      bgVerification: "Passed",
      branch: "Tirupati Central Hub",
      status: "Off Duty",
      liveLocation: "Station Rest Lounge",
      todayTrips: 0,
      totalTrips: 172,
      earnings: 44500,
      rating: 4.7,
      ratingCount: 130,
    },
  ]);

  // ----------------------------------------------------------------------
  // BRANCHES / STATION HUBS DATABASE
  // ----------------------------------------------------------------------
  const [branches, setBranches] = useState<BranchItem[]>([
    {
      id: 401,
      name: "Tirupati Central Hub",
      city: "Tirupati",
      state: "Andhra Pradesh",
      address: "Opposite Main Bus Stand, Railway Station Road, Tirupati - 517501",
      operatingHours: "24 Hours (7 Days)",
      managerName: "M. Ramesh Reddy",
      managerPhone: "+91 94400 11223",
      totalCars: 8,
      staffCount: 6,
      monthlyRevenue: 348000,
      isActive: true,
    },
    {
      id: 402,
      name: "Renigunta Airport Hub",
      city: "Renigunta / Tirupati",
      state: "Andhra Pradesh",
      address: "Terminal 1 Exit Desk, Tirupati International Airport, Renigunta - 517520",
      operatingHours: "05:00 AM - 11:30 PM",
      managerName: "K. Suresh Babu",
      managerPhone: "+91 94400 33445",
      totalCars: 5,
      staffCount: 4,
      monthlyRevenue: 168000,
      isActive: true,
    },
    {
      id: 403,
      name: "Chandragiri Heritage Point",
      city: "Chandragiri",
      state: "Andhra Pradesh",
      address: "Fort Main Entrance Road, Chandragiri Station - 517101",
      operatingHours: "07:00 AM - 09:00 PM",
      managerName: "G. Pratap Varma",
      managerPhone: "+91 94400 55667",
      totalCars: 2,
      staffCount: 2,
      monthlyRevenue: 82000,
      isActive: true,
    },
  ]);

  // ----------------------------------------------------------------------
  // PAYMENTS & FINANCIAL LEDGER DATABASE
  // ----------------------------------------------------------------------
  const [payments, setPayments] = useState<PaymentItem[]>([
    {
      id: "PAY-9901",
      bookingId: 1042,
      customerName: "Rajesh Varma",
      amount: 4998,
      depositAmount: 5000,
      gateway: "UPI",
      status: "Captured",
      gstAmount: 762,
      tdsAmount: 0,
      transactionId: "UPI_TXN_881928471029",
      date: "2026-09-04 18:31:00",
      refundStatus: "N/A",
    },
    {
      id: "PAY-9902",
      bookingId: 1041,
      customerName: "Ananya Sharma",
      amount: 4398,
      depositAmount: 4000,
      gateway: "Razorpay",
      status: "Captured",
      gstAmount: 670,
      tdsAmount: 0,
      transactionId: "rzp_live_992100881234",
      date: "2026-09-04 14:16:00",
      refundStatus: "N/A",
    },
    {
      id: "PAY-9903",
      bookingId: 1040,
      customerName: "Vikram Rathore",
      amount: 6998,
      depositAmount: 6000,
      gateway: "UPI",
      status: "Pending",
      gstAmount: 1067,
      tdsAmount: 0,
      transactionId: "PENDING_AUTH_001",
      date: "2026-09-04 11:00:00",
      refundStatus: "N/A",
    },
    {
      id: "PAY-9904",
      bookingId: 1039,
      customerName: "Praveen Rao",
      amount: 3398,
      depositAmount: 3000,
      gateway: "UPI",
      status: "Refunded",
      gstAmount: 518,
      tdsAmount: 0,
      transactionId: "UPI_TXN_771928301928",
      date: "2026-09-02 08:05:00",
      refundStatus: "Processed",
    },
  ]);

  // ----------------------------------------------------------------------
  // PROMOTIONAL COUPONS DATABASE
  // ----------------------------------------------------------------------
  const [coupons, setCoupons] = useState<CouponItem[]>([
    {
      id: 501,
      code: "MOARFIRST",
      type: "Flat Discount",
      discountValue: 500,
      isPercent: false,
      minBookingValue: 2500,
      usageLimit: 500,
      usedCount: 124,
      expiryDate: "2027-03-31",
      isActive: true,
    },
    {
      id: 502,
      code: "TIRUMALA20",
      type: "Percentage Discount",
      discountValue: 20,
      isPercent: true,
      minBookingValue: 3500,
      maxDiscount: 1000,
      usageLimit: 1000,
      usedCount: 412,
      expiryDate: "2026-12-31",
      isActive: true,
    },
    {
      id: 503,
      code: "WEEKEND10",
      type: "Weekend Offer",
      discountValue: 10,
      isPercent: true,
      minBookingValue: 2000,
      maxDiscount: 500,
      usageLimit: 300,
      usedCount: 88,
      expiryDate: "2027-01-31",
      isActive: true,
    },
    {
      id: 504,
      code: "FREEDELIVERY",
      type: "Free Delivery",
      discountValue: 300,
      isPercent: false,
      minBookingValue: 4000,
      usageLimit: 200,
      usedCount: 65,
      expiryDate: "2026-11-30",
      isActive: true,
    },
    {
      id: 505,
      code: "CORP25",
      type: "Corporate Coupon",
      discountValue: 25,
      isPercent: true,
      minBookingValue: 5000,
      maxDiscount: 2000,
      usageLimit: 100,
      usedCount: 29,
      expiryDate: "2027-06-30",
      isActive: true,
    },
  ]);

  // ----------------------------------------------------------------------
  // BOOKINGS DATABASE
  // ----------------------------------------------------------------------
  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      id: 1042,
      bookingType: "Self Drive",
      pickup: "Tirupati Central Hub",
      startDate: "2026-09-05",
      endDate: "2026-09-07",
      carName: "Mahindra Scorpio-N Z8L 4x4",
      status: "Ongoing Trip",
      customerName: "Rajesh Varma",
      customerPhone: "+91 98765 11223",
      customerEmail: "rajesh.v@gmail.com",
      driverName: "Self Driven",
      driverPhone: "N/A",
      deliveryStaff: "Ravi Teja",
      pickupAddress: "Platform 1 Exit, Tirupati Main Railway Station",
      dropAddress: "Tirupati Central Hub, Bus Stand Road",
      duration: "2 Days (48 Hours)",
      extras: ["Zero Dep Platinum Insurance", "FASTag Auto-Recharge"],
      insurancePlan: "Zero Dep Platinum",
      couponCode: "MOARFIRST",
      discountAmount: 500,
      taxAmount: 762,
      securityDeposit: 5000,
      amount: 4998,
      branch: "Tirupati Central Hub",
      paymentMethod: "UPI (PhonePe)",
      paymentStatus: "Paid",
      bookingSource: "Mobile App",
      notes: "Customer travelling to Tirumala temple. Requested child booster seat.",
      startOdometer: 24100,
      returnOdometer: 24350,
      startFuel: 100,
      returnFuel: 95,
      penalties: 0,
      timelineStep: 5,
      createdAt: "2026-09-04T18:30:00Z",
    },
    {
      id: 1041,
      bookingType: "Airport Pickup",
      pickup: "Renigunta Airport Hub",
      startDate: "2026-09-04",
      endDate: "2026-09-06",
      carName: "Honda City ZX Automatic",
      status: "Confirmed",
      customerName: "Ananya Sharma",
      customerPhone: "+91 98480 33445",
      customerEmail: "ananya.s@outlook.com",
      driverName: "Suresh Kumar",
      driverPhone: "+91 98765 00001",
      deliveryStaff: "Kiran Reddy",
      pickupAddress: "Terminal 1 Flight Arrival Gate, Renigunta Airport",
      dropAddress: "Fortune Select Grand Ridge Hotel, Tirupati",
      duration: "2 Days",
      extras: ["Airport Meet & Greet", "Executive Chauffeur"],
      insurancePlan: "Standard Corporate Cover",
      couponCode: "TIRUMALA20",
      discountAmount: 880,
      taxAmount: 670,
      securityDeposit: 4000,
      amount: 4398,
      branch: "Renigunta Airport Hub",
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
      bookingSource: "Web Portal",
      notes: "Flight AI-542 arriving at 3:15 PM.",
      startOdometer: 18200,
      returnOdometer: 18410,
      startFuel: 100,
      returnFuel: 100,
      penalties: 0,
      timelineStep: 2,
      createdAt: "2026-09-04T14:15:00Z",
    },
    {
      id: 1040,
      bookingType: "Outstation",
      pickup: "Chandragiri Heritage Point",
      startDate: "2026-09-06",
      endDate: "2026-09-08",
      carName: "Toyota Innova Crysta ZX",
      status: "Pending",
      customerName: "Vikram Rathore",
      customerPhone: "+91 94401 77889",
      customerEmail: "vikram.r@yahoo.com",
      driverName: "Gopal Naidu",
      driverPhone: "+91 98765 00002",
      deliveryStaff: "Srinivas",
      pickupAddress: "Chandragiri Fort Road, Heritage Station",
      dropAddress: "Horsley Hills Resort & Return",
      duration: "2 Days (Outstation)",
      extras: ["Interstate Permit Pass", "Chauffeur Night Allowance"],
      insurancePlan: "Executive Fleet Cover",
      discountAmount: 0,
      taxAmount: 1067,
      securityDeposit: 6000,
      amount: 6998,
      branch: "Chandragiri Heritage Point",
      paymentMethod: "UPI",
      paymentStatus: "Pending",
      bookingSource: "Airport Concierge",
      notes: "VIP pilgrimage delegate group.",
      startOdometer: 32100,
      returnOdometer: 32450,
      startFuel: 100,
      returnFuel: 100,
      penalties: 0,
      timelineStep: 1,
      createdAt: "2026-09-04T11:00:00Z",
    },
    {
      id: 1039,
      bookingType: "Hourly Rental",
      pickup: "Tirupati Central Hub",
      startDate: "2026-09-02",
      endDate: "2026-09-04",
      carName: "Maruti Swift ZXi+",
      status: "Returned",
      customerName: "Praveen Rao",
      customerPhone: "+91 98852 99001",
      customerEmail: "praveen@gmail.com",
      driverName: "Self Driven",
      driverPhone: "N/A",
      deliveryStaff: "Ravi Teja",
      pickupAddress: "Tirupati City Center",
      dropAddress: "Tirupati Central Hub",
      duration: "8 Hours Package",
      extras: ["FASTag Pass"],
      insurancePlan: "Basic Cover",
      couponCode: "WEEKEND10",
      discountAmount: 300,
      taxAmount: 518,
      securityDeposit: 3000,
      amount: 3398,
      branch: "Tirupati Central Hub",
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      bookingSource: "Walk-in Desk",
      notes: "Completed smoothly with 0 penalties.",
      startOdometer: 15200,
      returnOdometer: 15320,
      startFuel: 100,
      returnFuel: 100,
      penalties: 0,
      timelineStep: 7,
      createdAt: "2026-09-02T08:00:00Z",
    },
  ]);

  // ----------------------------------------------------------------------
  // REVENUE & DISPATCH STATS
  // ----------------------------------------------------------------------
  const stats = useMemo(() => {
    const totalCars = fleet.length;
    const availableCars = fleet.filter((c) => c.status === "Available").length;
    const bookedCars = fleet.filter((c) => c.status === "Booked").length;
    const maintenanceCars = fleet.filter((c) => c.status === "In Maintenance").length;
    const activeBookings = bookings.filter((b) => b.status === "Ongoing Trip" || b.status === "Confirmed").length;
    const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
    const totalRevenue = fleet.reduce((acc, c) => acc + c.totalRevenue, 0);
    const totalMaintenance = fleet.reduce((acc, c) => acc + c.maintenanceCost, 0);
    const utilizationRate = Math.round(((totalCars - availableCars) / Math.max(1, totalCars)) * 100);

    return {
      totalCars,
      availableCars,
      bookedCars,
      maintenanceCars,
      activeBookings,
      pendingBookings,
      todayPickups: 3,
      todayReturns: 2,
      revenueToday: 9396,
      revenueMonth: 598000,
      cancelledBookings: 0,
      totalRevenue,
      totalMaintenance,
      utilizationRate,
    };
  }, [fleet, bookings]);

  // Filtered Fleet
  const filteredFleet = useMemo(() => {
    return fleet.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.vinNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.branch.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = fleetFilterStatus === "all" || c.status === fleetFilterStatus;
      const matchCat = fleetFilterCategory === "all" || c.category === fleetFilterCategory;
      return matchSearch && matchStatus && matchCat;
    });
  }, [fleet, searchQuery, fleetFilterStatus, fleetFilterCategory]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.id.toString().includes(searchQuery) ||
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerPhone.includes(searchQuery);
      const matchStatus = bookingFilterStatus === "all" || b.status === bookingFilterStatus;
      const matchType = bookingFilterType === "all" || b.bookingType === bookingFilterType;
      return matchSearch && matchStatus && matchType;
    });
  }, [bookings, searchQuery, bookingFilterStatus, bookingFilterType]);

  // Auto-dismiss notice
  useEffect(() => {
    if (notice) {
      const t = setTimeout(() => setNotice(null), 4000);
      return () => clearTimeout(t);
    }
  }, [notice]);

  // Fetch live database records on initial load
  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      try {
        const [
          dbCars,
          dbBookings,
          dbCustomers,
          dbDrivers,
          dbBranches,
          dbPayments,
          dbCoupons,
          dbReviews,
          dbTickets,
          dbLogs,
        ] = await Promise.all([
          adminApi.getCars(),
          adminApi.getBookings(),
          adminApi.getCustomers(),
          adminApi.getDrivers(),
          adminApi.getBranches(),
          adminApi.getPayments(),
          adminApi.getCoupons(),
          adminApi.getReviews(),
          adminApi.getSupportTickets(),
          adminApi.getActivityLogs(),
        ]);

        if (!isMounted) return;

        if (dbCars && dbCars.length > 0) setFleet(dbCars);
        if (dbBookings && dbBookings.length > 0) setBookings(dbBookings);
        if (dbCustomers && dbCustomers.length > 0) setCustomers(dbCustomers);
        if (dbDrivers && dbDrivers.length > 0) setDrivers(dbDrivers);
        if (dbBranches && dbBranches.length > 0) setBranches(dbBranches);
        if (dbPayments && dbPayments.length > 0) setPayments(dbPayments);
        if (dbCoupons && dbCoupons.length > 0) setCoupons(dbCoupons);
        if (dbReviews && dbReviews.length > 0) setReviews(dbReviews);
        if (dbTickets && dbTickets.length > 0) setTickets(dbTickets);
        if (dbLogs && dbLogs.length > 0) setActivityLogs(dbLogs);
      } catch (err) {
        console.warn("[Admin] Live DB initial load fallback active:", err);
      }
    };
    fetchAllData();
    return () => {
      isMounted = false;
    };
  }, []);

  // ----------------------------------------------------------------------
  // FLEET CRUD ACTIONS
  // ----------------------------------------------------------------------
  const handleSaveCar = async (carData: Partial<CarItem>) => {
    if (editingCar) {
      setFleet((prev) =>
        prev.map((c) => (c.id === editingCar.id ? ({ ...c, ...carData } as CarItem) : c))
      );
      setNotice({ type: "success", text: `Vehicle "${carData.name || editingCar.name}" updated successfully!` });
      adminApi.updateCar(editingCar.id, carData);
    } else {
      const newCar: CarItem = {
        id: Math.floor(100 + Math.random() * 900),
        name: carData.name || "New Fleet Vehicle",
        brand: carData.brand || "Maruti Suzuki",
        model: carData.model || "Brezza",
        variant: carData.variant || "ZXi",
        year: carData.year || 2024,
        registrationNumber: carData.registrationNumber || "AP 03 BX 2024",
        vinNumber: carData.vinNumber || "MA3BREZ202400918",
        detail: carData.detail || "Premium fleet addition",
        price: `₹${carData.pricePerDay || 1999}`,
        pricePerHour: carData.pricePerHour || 220,
        pricePerDay: carData.pricePerDay || 1999,
        pricePerWeek: carData.pricePerWeek || 11999,
        pricePerMonth: carData.pricePerMonth || 41999,
        securityDeposit: carData.securityDeposit || 4000,
        lateFeePerHour: carData.lateFeePerHour || 200,
        tag: carData.tag || "New",
        category: (carData.category as any) || "SUV",
        fuelType: (carData.fuelType as any) || "Petrol",
        transmission: (carData.transmission as any) || "Automatic",
        seats: carData.seats || 5,
        mileage: carData.mileage || "19 km/l",
        color: carData.color || "Metallic Silver",
        status: (carData.status as any) || "Available",
        branch: carData.branch || "Tirupati Central Hub",
        location: carData.location || "Tirupati",
        gpsEnabled: carData.gpsEnabled !== undefined ? carData.gpsEnabled : true,
        fastagNumber: carData.fastagNumber || "FTG-990011-22",
        insuranceExpiry: carData.insuranceExpiry || "2027-10-10",
        pollutionExpiry: carData.pollutionExpiry || "2026-12-31",
        fitnessExpiry: carData.fitnessExpiry || "2029-01-01",
        permitExpiry: carData.permitExpiry || "2028-05-15",
        image:
          carData.image ||
          "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        galleryImages: [
          carData.image ||
            "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        ],
        angle360Images: [
          carData.image ||
            "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        ],
        totalTrips: 0,
        totalRevenue: 0,
        maintenanceCost: 0,
        lastServiceKm: 0,
        nextServiceKm: 10000,
        oilChangeStatus: "Good",
        tyreHealth: "Excellent",
        batteryHealth: "Good",
      };
      setFleet([newCar, ...fleet]);
      setNotice({ type: "success", text: `Vehicle "${newCar.name}" added to live fleet!` });
      adminApi.createCar(newCar);
    }
    setIsAddCarModalOpen(false);
    setEditingCar(null);
  };

  const handleDeleteCar = (id: number) => {
    if (confirm("Are you sure you want to delete this vehicle from the fleet?")) {
      setFleet((prev) => prev.filter((c) => c.id !== id));
      setNotice({ type: "info", text: `Vehicle #${id} removed from fleet.` });
      adminApi.deleteCar(id);
    }
  };

  const handleDuplicateCar = (car: CarItem) => {
    const cloned: CarItem = {
      ...car,
      id: Math.floor(100 + Math.random() * 900),
      name: `${car.name} (Copy)`,
      registrationNumber: `AP 03 DX ${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Available",
      totalTrips: 0,
      totalRevenue: 0,
    };
    setFleet([cloned, ...fleet]);
    setNotice({ type: "success", text: `Cloned "${car.name}" into new vehicle #${cloned.id}!` });
    adminApi.createCar(cloned);
  };

  const handleArchiveCar = (id: number) => {
    const target = fleet.find((c) => c.id === id);
    const newArchived = !target?.isArchived;
    const newStatus: CarStatus = newArchived ? "Inactive" : "Available";

    setFleet((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isArchived: newArchived, status: newStatus } : c))
    );
    setNotice({ type: "info", text: `Vehicle status updated.` });
    adminApi.updateCar(id, { isArchived: newArchived, status: newStatus });
  };

  const handleToggleSelectAll = () => {
    if (selectedCarIds.length === filteredFleet.length) {
      setSelectedCarIds([]);
    } else {
      setSelectedCarIds(filteredFleet.map((c) => c.id));
    }
  };

  const handleToggleSelectCar = (id: number) => {
    setSelectedCarIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleBulkStatusChange = (status: CarStatus) => {
    setFleet((prev) => prev.map((c) => (selectedCarIds.includes(c.id) ? { ...c, status } : c)));
    setNotice({ type: "success", text: `Updated status to "${status}" for ${selectedCarIds.length} vehicle(s)!` });
    selectedCarIds.forEach((id) => adminApi.updateCar(id, { status }));
    setSelectedCarIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete all ${selectedCarIds.length} selected vehicle(s)?`)) {
      const idsToDelete = [...selectedCarIds];
      setFleet((prev) => prev.filter((c) => !idsToDelete.includes(c.id)));
      setNotice({ type: "info", text: `Deleted ${idsToDelete.length} vehicle(s).` });
      idsToDelete.forEach((id) => adminApi.deleteCar(id));
      setSelectedCarIds([]);
    }
  };

  const handleBulkCsvImport = () => {
    if (!bulkCsvInput.trim()) return;
    const lines = bulkCsvInput.trim().split("\n");
    let count = 0;
    const newCars: CarItem[] = [];

    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes("brand")) return;
      const parts = line.split(",").map((s) => s.trim());
      if (parts.length >= 4) {
        const [brand, model, variant, priceDay, regNo, cat] = parts;
        const carObj: CarItem = {
          id: Math.floor(200 + Math.random() * 800),
          name: `${brand} ${model} ${variant || ""}`.trim(),
          brand: brand || "Maruti Suzuki",
          model: model || "Car",
          variant: variant || "Base",
          year: 2024,
          registrationNumber: regNo || `AP 03 TX ${Math.floor(1000 + Math.random() * 9000)}`,
          vinNumber: `MA3CSV${Math.floor(100000 + Math.random() * 900000)}`,
          detail: "Bulk imported fleet vehicle",
          price: `₹${priceDay || "1,999"}`,
          pricePerHour: Math.round((parseInt(priceDay) || 1999) / 8),
          pricePerDay: parseInt(priceDay) || 1999,
          pricePerWeek: (parseInt(priceDay) || 1999) * 6,
          pricePerMonth: (parseInt(priceDay) || 1999) * 22,
          securityDeposit: 4000,
          lateFeePerHour: 200,
          tag: "Standard",
          category: (cat as any) || "Hatchback",
          fuelType: "Petrol",
          transmission: "Manual",
          seats: 5,
          mileage: "20 km/l",
          color: "White",
          status: "Available",
          branch: "Tirupati Central Hub",
          location: "Tirupati",
          gpsEnabled: true,
          fastagNumber: `FTG-CSV-${Math.floor(1000 + Math.random() * 9000)}`,
          insuranceExpiry: "2027-12-31",
          pollutionExpiry: "2026-12-31",
          fitnessExpiry: "2029-01-01",
          permitExpiry: "2028-01-01",
          image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
          galleryImages: [],
          angle360Images: [],
          totalTrips: 0,
          totalRevenue: 0,
          maintenanceCost: 0,
          lastServiceKm: 0,
          nextServiceKm: 10000,
          oilChangeStatus: "Good",
          tyreHealth: "Excellent",
          batteryHealth: "Good",
        };
        newCars.push(carObj);
        adminApi.createCar(carObj);
        count++;
      }
    });

    if (newCars.length > 0) {
      setFleet([...newCars, ...fleet]);
      setNotice({ type: "success", text: `Successfully bulk imported ${count} vehicles via CSV!` });
      setIsBulkCsvModalOpen(false);
      setBulkCsvInput("");
    } else {
      setNotice({ type: "error", text: "Invalid CSV format. Please use the sample template." });
    }
  };

  // ----------------------------------------------------------------------
  // BOOKINGS DISPATCH CONTROLS
  // ----------------------------------------------------------------------
  const handleUpdateStatus = (id: number, status: BookingStatus) => {
    const timelineStep = getStepForStatus(status);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status, timelineStep } : b))
    );
    setNotice({ type: "success", text: `Booking #${id} status changed to "${status}"!` });
    adminApi.updateBooking(id, { status, timelineStep });
  };

  const getStepForStatus = (status: BookingStatus): number => {
    switch (status) {
      case "Pending":
        return 1;
      case "Confirmed":
        return 2;
      case "Assigned Driver":
        return 3;
      case "Vehicle Ready":
        return 4;
      case "Pickup Started":
        return 4;
      case "Ongoing Trip":
        return 5;
      case "Trip Completed":
        return 6;
      case "Returned":
        return 7;
      case "Refunded":
        return 8;
      default:
        return 1;
    }
  };

  const handleDeleteBooking = (id: number) => {
    if (confirm("Are you sure you want to cancel and remove this booking?")) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setNotice({ type: "info", text: `Booking #${id} removed.` });
      adminApi.deleteBooking(id);
    }
  };

  const handleApplyReschedule = (bookingId: number) => {
    if (!rescheduleDates.startDate || !rescheduleDates.endDate) return;
    const current = bookings.find((b) => b.id === bookingId);
    const updatedNotes = `${current?.notes || ""} | Rescheduled to ${rescheduleDates.startDate} - ${rescheduleDates.endDate}`;
    
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              startDate: rescheduleDates.startDate,
              endDate: rescheduleDates.endDate,
              notes: updatedNotes,
            }
          : b
      )
    );
    setActiveBookingModal(null);
    setNotice({ type: "success", text: `Booking #${bookingId} rescheduled successfully!` });
    adminApi.updateBooking(bookingId, {
      startDate: rescheduleDates.startDate,
      endDate: rescheduleDates.endDate,
      notes: updatedNotes,
    });
  };

  const handleApplyCarUpgrade = (bookingId: number) => {
    if (!upgradeCarTarget) return;
    const current = bookings.find((b) => b.id === bookingId);
    const updatedNotes = `${current?.notes || ""} | 1-Click Car Upgrade Applied: ${upgradeCarTarget}`;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              carName: upgradeCarTarget,
              notes: updatedNotes,
            }
          : b
      )
    );
    setActiveBookingModal(null);
    setNotice({ type: "success", text: `Booking #${bookingId} upgraded to ${upgradeCarTarget}!` });
    adminApi.updateBooking(bookingId, {
      carName: upgradeCarTarget,
      notes: updatedNotes,
    });
  };

  const handleAssignDriverSubmit = (bookingId: number) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              driverName: driverAssignForm.driverName,
              driverPhone: driverAssignForm.driverPhone,
              deliveryStaff: driverAssignForm.deliveryStaff,
              status: "Assigned Driver",
              timelineStep: 3,
            }
          : b
      )
    );
    setActiveBookingModal(null);
    setNotice({ type: "success", text: `Driver & Staff assigned to Booking #${bookingId}!` });
    adminApi.updateBooking(bookingId, {
      driverName: driverAssignForm.driverName,
      driverPhone: driverAssignForm.driverPhone,
      deliveryStaff: driverAssignForm.deliveryStaff,
      status: "Assigned Driver",
      timelineStep: 3,
    });
  };

  const handleApplyInspectionPenalties = (bookingId: number) => {
    const fuelPen = inspectionState.fuelDeficitLitres * 110;
    const smokingPen = inspectionState.smokingViolation ? 2500 : 0;
    const latePen = inspectionState.lateHours * 250;
    const totalPen = fuelPen + smokingPen + latePen + inspectionState.cleaningFee + inspectionState.scratchDamageFee;
    const current = bookings.find((b) => b.id === bookingId);
    const updatedNotes = `${current?.notes || ""} | Inspection Done: Deducted ₹${totalPen} from deposit.`;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              penalties: totalPen,
              status: "Returned",
              timelineStep: 7,
              notes: updatedNotes,
            }
          : b
      )
    );
    setActiveBookingModal(null);
    setNotice({ type: "success", text: `Inspection recorded. Total penalty ₹${totalPen} reconciled.` });
    adminApi.updateBooking(bookingId, {
      penalties: totalPen,
      status: "Returned",
      timelineStep: 7,
      notes: updatedNotes,
    });
  };

  // ----------------------------------------------------------------------
  // CRM & OPERATIONS ACTION HANDLERS
  // ----------------------------------------------------------------------
  const handleToggleBlacklist = (customerId: number) => {
    const current = customers.find((c) => c.id === customerId);
    const newStatus = !current?.isBlacklisted;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, isBlacklisted: newStatus } : c
      )
    );
    setNotice({ type: "info", text: `Customer blacklist status updated.` });
    adminApi.updateCustomer(customerId, { isBlacklisted: newStatus });
  };

  const handleToggleDriverStatus = (driverId: number, status: any) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, status } : d))
    );
    setNotice({ type: "success", text: `Driver status updated to "${status}".` });
    adminApi.updateDriver(driverId, { status });
  };

  const handleToggleCouponStatus = (couponId: number) => {
    const current = coupons.find((cp) => cp.id === couponId);
    const newActive = !current?.isActive;
    setCoupons((prev) =>
      prev.map((cp) => (cp.id === couponId ? { ...cp, isActive: newActive } : cp))
    );
    setNotice({ type: "info", text: `Coupon status toggled.` });
    adminApi.updateCoupon(couponId, { isActive: newActive });
  };

  const handleTriggerRefund = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: "Refunded", refundStatus: "Processed" } : p))
    );
    setNotice({ type: "success", text: `Security deposit refund of ₹${payments.find(p=>p.id===paymentId)?.depositAmount} processed via instant UPI!` });
    adminApi.refundPayment(paymentId);
  };


  // ----------------------------------------------------------------------
  // AUTH LOGIN (OPTIONAL LOGOUT)
  // ----------------------------------------------------------------------
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#13091B] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#2E1439]/80 backdrop-blur-2xl border border-purple-500/25 rounded-3xl p-8 shadow-2xl text-white">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xl flex items-center justify-center mx-auto mb-3">
              M
            </div>
            <h1 className="text-2xl font-black">Moar Cars Enterprise Suite</h1>
            <p className="text-xs text-purple-300 mt-1">Car Booking & Fleet Management Suite</p>
          </div>

          <button
            onClick={() => setIsAuthenticated(true)}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black py-3.5 rounded-2xl text-xs shadow-lg shadow-amber-500/25 hover:opacity-95"
          >
            Launch Admin Console (Instant Login)
          </button>

          <div className="text-center mt-6">
            <button onClick={() => onNavigate("/")} className="text-xs text-purple-300 underline">
              Return to Public Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // MAIN VIEWPORT RENDER
  // ----------------------------------------------------------------------
  return (
    <div className={`min-h-screen flex font-sans antialiased ${isDark ? "bg-[#13091B] text-slate-100" : "bg-[#F5F0FA] text-slate-900"}`}>
      {/* SIDEBAR NAVIGATION */}
      <aside className={`w-72 border-r flex flex-col shrink-0 z-40 ${isDark ? "bg-[#1E0F2B]/90 backdrop-blur-2xl border-purple-500/20" : "bg-white/80 border-purple-200"}`}>
        <div className="p-6 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F59E0B] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25">M</div>
            <div>
              <h1 className="text-base font-black tracking-tight">MOAR <span className="text-[#D4AF37]">CARS</span></h1>
              <p className="text-[10px] text-purple-300 uppercase tracking-widest font-bold">Enterprise Suite</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {/* 1. CORE OPERATIONS */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Core Operations</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md"
                    : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><BarChart3 className="w-4 h-4" /> Executive Dashboard</div>
              </button>

              <button
                onClick={() => setActiveTab("fleet")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "fleet"
                    ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md"
                    : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><Car className="w-4 h-4" /> Fleet Management</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/60 text-[#D4AF37] border border-purple-500/20">{fleet.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "bookings"
                    ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md"
                    : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><Calendar className="w-4 h-4" /> Bookings & Dispatch</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/60 text-[#D4AF37] border border-purple-500/20">{bookings.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("branches")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "branches" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><Building2 className="w-4 h-4" /> Station Hubs</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/60 text-[#D4AF37] border border-purple-500/20">{branches.length}</span>
              </button>
            </nav>
          </div>

          {/* 2. PEOPLE & CRM */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">People & CRM</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("customers")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "customers" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><Users className="w-4 h-4" /> Customer CRM</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/60 text-emerald-400 border border-purple-500/20">{customers.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("drivers")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "drivers" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><Award className="w-4 h-4" /> Driver Roster</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/60 text-blue-400 border border-purple-500/20">{drivers.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "reviews" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><Star className="w-4 h-4" /> Customer Reviews</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/60 text-[#D4AF37] border border-purple-500/20">{reviews.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("support")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "support" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><Headphones className="w-4 h-4" /> Support & Live Chat</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/60 text-red-400 border border-purple-500/20">
                  {tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length}
                </span>
              </button>
            </nav>
          </div>

          {/* 3. FINANCE & GROWTH */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Finance & Analytics</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("payments")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "payments" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><CreditCard className="w-4 h-4" /> Payments & Escrow</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/60 text-emerald-400 border border-purple-500/20">₹5.98L</span>
              </button>
              <button
                onClick={() => setActiveTab("coupons")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "coupons" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><Tag className="w-4 h-4" /> Coupon Engine</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/60 text-[#D4AF37] border border-purple-500/20">{coupons.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "reports" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <TrendingUp className="w-4 h-4" /> Analytics & Reports
              </button>
            </nav>
          </div>

          {/* 4. CMS & MARKETING */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">CMS & Marketing</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("cms")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "cms" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><LayoutTemplate className="w-4 h-4" /> CMS & Page Builder</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/60 text-[#D4AF37] border border-purple-500/20">13</span>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "notifications" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><Bell className="w-4 h-4" /> Notifications & Alerts</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/60 text-[#D4AF37] border border-purple-500/20">{templates.length}</span>
              </button>
            </nav>
          </div>

          {/* 5. SECURITY & GOVERNANCE */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Security & Governance</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "settings" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <Settings className="w-4 h-4" /> System Settings & APIs
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "security" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Security & 2FA Center
              </button>
              <button
                onClick={() => setActiveTab("logs")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "logs" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <div className="flex items-center gap-3"><History className="w-4 h-4" /> Activity Audit Logs</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950/60 text-purple-300 border border-purple-500/20">{activityLogs.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("roles")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "roles" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <Shield className="w-4 h-4" /> Roles & RBAC Matrix
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "sessions" ? "bg-[#432650] text-[#D4AF37] border border-amber-400/30 shadow-md" : "text-purple-200 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                <Smartphone className="w-4 h-4" /> Active Devices & Sessions
              </button>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-purple-500/20 bg-[#160A20]/80 flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-bold truncate">{currentUser.username}</p>
            <p className="text-[10px] text-emerald-400">All Modules Active</p>
          </div>
          <button onClick={handleLogout} className="p-2 text-purple-300 hover:text-red-400 rounded-xl" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* TOP HEADER */}
        <header className="h-20 border-b border-purple-500/20 px-8 flex items-center justify-between sticky top-0 z-30 bg-[#1E0F2B]/80 backdrop-blur-xl">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
            <input
              type="text"
              placeholder="Search vehicles, registration, customer, booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "fleet" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBulkCsvModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#2A1336] border border-purple-500/30 text-purple-200 hover:text-white font-bold text-xs"
                >
                  <Upload className="w-3.5 h-3.5 text-[#D4AF37]" /> Bulk CSV Upload
                </button>
                <button
                  onClick={() => {
                    setEditingCar(null);
                    setIsAddCarModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" /> Add Vehicle
                </button>
              </div>
            ) : activeTab === "coupons" ? (
              <button
                onClick={() => {
                  setEditingCoupon(null);
                  setIsCouponModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" /> Create Coupon
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingBooking(null);
                  setIsCreateBookingModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" /> Create Reservation
              </button>
            )}

            <button
              onClick={() => onNavigate("/")}
              className="p-2.5 rounded-xl bg-[#2A1336] border border-purple-500/30 text-purple-200 hover:text-white"
              title="Open Public Website"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* NOTIFICATION BANNER */}
        {notice && (
          <div className="px-8 pt-4">
            <div
              className={`p-3.5 rounded-2xl border text-xs font-bold flex justify-between ${
                notice.type === "success"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : notice.type === "error"
                  ? "bg-red-500/15 border-red-500/30 text-red-300"
                  : "bg-purple-500/15 border-purple-500/30 text-purple-300"
              }`}
            >
              <span>{notice.text}</span>
              <button onClick={() => setNotice(null)} className="underline">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 1: EXECUTIVE PERFORMANCE DASHBOARD */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "dashboard" && (
          <main className="flex-1 p-8 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-[#D4AF37]" /> Executive Performance Dashboard
                </h2>
                <p className="text-xs text-purple-300 mt-1">
                  Real-time telematics, revenue velocity, fleet utilization, and trip dispatches
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live Fleet Telematics
                </span>
              </div>
            </div>

            {/* 9 TOP KPI CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-purple-300">Total Cars</span>
                  <Car className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-white">{stats.totalCars}</h3>
                <p className="text-[10px] text-purple-400 mt-1">100% Active Fleet</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-purple-300">Available Ready</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-emerald-400">{stats.availableCars}</h3>
                <p className="text-[10px] text-emerald-400/80 mt-1">Ready for instant dispatch</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-purple-300">Active Bookings</span>
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-blue-300">{stats.activeBookings}</h3>
                <p className="text-[10px] text-blue-400/80 mt-1">On road across stations</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-purple-300">Pending Inquiries</span>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-amber-300">{stats.pendingBookings}</h3>
                <p className="text-[10px] text-amber-400/80 mt-1">Requires driver allocation</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-purple-300">Today Pickups</span>
                  <Send className="w-4 h-4 text-purple-300" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-purple-200">{stats.todayPickups}</h3>
                <p className="text-[10px] text-purple-400 mt-1">Scheduled Handover</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-purple-300">Today Returns</span>
                  <RotateCcw className="w-4 h-4 text-purple-300" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-purple-200">{stats.todayReturns}</h3>
                <p className="text-[10px] text-purple-400 mt-1">Damage Inspection Pending</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-purple-300">Revenue Today</span>
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-[#D4AF37]">₹{stats.revenueToday.toLocaleString()}</h3>
                <p className="text-[10px] text-emerald-400 mt-1">+14.2% vs yesterday</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-purple-300">Revenue Month</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-emerald-400">₹{stats.revenueMonth.toLocaleString()}</h3>
                <p className="text-[10px] text-purple-400 mt-1">+28.5% YoY Growth</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-purple-300">Cancelled Trips</span>
                  <XCircle className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-red-300">{stats.cancelledBookings}</h3>
                <p className="text-[10px] text-purple-400 mt-1">0 Refunds Processed</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-purple-300">Fleet Utilization</span>
                  <Activity className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-amber-300">{stats.utilizationRate}%</h3>
                <p className="text-[10px] text-purple-400 mt-1">High Demand Ratio</p>
              </div>
            </div>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-black text-sm text-white">Booking & Revenue Velocity Trend</h4>
                    <p className="text-[11px] text-purple-300">Monthly booking volume and Gross Rental Value</p>
                  </div>
                  <span className="text-xs font-mono text-[#D4AF37]">Year-to-Date 2026</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: "Jan", revenue: 320000, bookings: 78 },
                        { month: "Feb", revenue: 360000, bookings: 86 },
                        { month: "Mar", revenue: 410000, bookings: 102 },
                        { month: "Apr", revenue: 480000, bookings: 120 },
                        { month: "May", revenue: 530000, bookings: 135 },
                        { month: "Jun", revenue: 490000, bookings: 118 },
                        { month: "Jul", revenue: 560000, bookings: 142 },
                        { month: "Aug", revenue: 610000, bookings: 158 },
                      ]}
                    >
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#432650" />
                      <XAxis dataKey="month" stroke="#C084FC" textAnchor="end" />
                      <YAxis stroke="#C084FC" />
                      <Tooltip contentStyle={{ backgroundColor: "#1E0F2B", borderColor: "#432650", color: "#fff" }} />
                      <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-2xl">
                <h4 className="font-black text-sm text-white mb-1">Station Hub Utilization</h4>
                <p className="text-[11px] text-purple-300 mb-4">Booking share per pickup hub</p>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Tirupati Central", value: 58 },
                          { name: "Renigunta Airport", value: 28 },
                          { name: "Chandragiri Point", value: 14 },
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#D4AF37" />
                        <Cell fill="#3B82F6" />
                        <Cell fill="#10B981" />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1E0F2B", borderColor: "#432650", color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 2: FLEET MANAGEMENT MODULE */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "fleet" && (
          <main className="flex-1 p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-2">
                  <Car className="w-6 h-6 text-[#D4AF37]" /> Fleet Management & Telematics Hub
                </h2>
                <p className="text-xs text-purple-300 mt-1">
                  Manage unlimited fleet vehicles, tiered rates, compliance countdowns, 360° gallery, and availability surge
                </p>
              </div>

              <div className="flex bg-[#14081E] p-1.5 rounded-2xl border border-purple-500/30">
                <button
                  onClick={() => setFleetSubTab("roster")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    fleetSubTab === "roster" ? "bg-[#D4AF37] text-slate-950 font-black shadow-md" : "text-purple-300 hover:text-white"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" /> Vehicles Roster ({fleet.length})
                </button>
                <button
                  onClick={() => setFleetSubTab("calendar")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    fleetSubTab === "calendar" ? "bg-[#D4AF37] text-slate-950 font-black shadow-md" : "text-purple-300 hover:text-white"
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" /> Availability & Surge
                </button>
                <button
                  onClick={() => setFleetSubTab("maintenance")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    fleetSubTab === "maintenance" ? "bg-[#D4AF37] text-slate-950 font-black shadow-md" : "text-purple-300 hover:text-white"
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" /> Maintenance & Expiries
                </button>
                <button
                  onClick={() => setFleetSubTab("analytics")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    fleetSubTab === "analytics" ? "bg-[#D4AF37] text-slate-950 font-black shadow-md" : "text-purple-300 hover:text-white"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Fleet Analytics & Heatmap
                </button>
              </div>
            </div>

            {fleetSubTab === "roster" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {["all", "Available", "Booked", "In Maintenance", "Inactive", "Reserved", "Under Inspection", "Sold"].map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => setFleetFilterStatus(st)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all capitalize ${
                            fleetFilterStatus === st
                              ? "bg-[#D4AF37] text-slate-950 font-black shadow-md"
                              : "bg-[#2A1336]/60 text-purple-300 border border-purple-500/20 hover:text-white"
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>

                  <select
                    value={fleetFilterCategory}
                    onChange={(e) => setFleetFilterCategory(e.target.value)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#14081E] border border-purple-500/30 text-[#D4AF37] text-xs font-bold focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                {selectedCarIds.length > 0 && (
                  <div className="p-4 rounded-2xl bg-purple-950/80 border border-purple-500/40 backdrop-blur-xl flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[#D4AF37]"></span>
                      <span className="text-xs font-bold text-white">
                        {selectedCarIds.length} Vehicle(s) Selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) => handleBulkStatusChange(e.target.value as CarStatus)}
                        className="px-3 py-1.5 rounded-xl bg-[#14081E] border border-purple-500/30 text-xs font-bold text-[#D4AF37]"
                      >
                        <option value="">Bulk Status Update...</option>
                        <option value="Available">Set Available</option>
                        <option value="Booked">Set Booked</option>
                        <option value="In Maintenance">Set In Maintenance</option>
                        <option value="Inactive">Set Inactive</option>
                        <option value="Reserved">Set Reserved</option>
                      </select>
                      <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold hover:bg-red-500/30"
                      >
                        Bulk Delete
                      </button>
                    </div>
                  </div>
                )}

                <div className="rounded-3xl border border-purple-500/20 bg-[#2A1336]/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#190924] text-purple-300 uppercase tracking-wider font-bold border-b border-purple-500/20">
                      <tr>
                        <th className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedCarIds.length === filteredFleet.length && filteredFleet.length > 0}
                            onChange={handleToggleSelectAll}
                            className="accent-[#D4AF37] w-4 h-4 rounded"
                          />
                        </th>
                        <th className="px-4 py-4">Vehicle Identity</th>
                        <th className="px-4 py-4">Category & Specs</th>
                        <th className="px-4 py-4">Tiered Pricing</th>
                        <th className="px-4 py-4">Station & Telematics</th>
                        <th className="px-4 py-4">Compliance Status</th>
                        <th className="px-4 py-4">Lifecycle Status</th>
                        <th className="px-4 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/10">
                      {filteredFleet.map((c) => (
                        <tr key={c.id} className="hover:bg-purple-900/20 transition-colors">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedCarIds.includes(c.id)}
                              onChange={() => handleToggleSelectCar(c.id)}
                              className="accent-[#D4AF37] w-4 h-4 rounded"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={c.image}
                                alt={c.name}
                                className="w-12 h-10 object-cover rounded-xl border border-purple-500/30"
                              />
                              <div>
                                <p className="font-bold text-white">{c.name}</p>
                                <p className="text-[10px] text-purple-300 font-mono">{c.registrationNumber}</p>
                                <p className="text-[9px] text-purple-400 font-mono truncate max-w-[140px]">VIN: {c.vinNumber}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-950 border border-purple-500/30 text-purple-200">
                              {c.category}
                            </span>
                            <p className="text-[10px] text-purple-300 mt-1">{c.fuelType} &bull; {c.transmission}</p>
                            <p className="text-[10px] text-purple-400">{c.seats} Seats &bull; {c.mileage}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-black text-emerald-400 text-sm">{c.price}/day</p>
                            <p className="text-[10px] text-purple-300">₹{c.pricePerHour}/hr &bull; ₹{c.pricePerWeek}/wk</p>
                            <p className="text-[9px] text-[#D4AF37]">Dep: ₹{c.securityDeposit}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-bold text-white flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#D4AF37]" /> {c.branch}
                            </p>
                            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                              <Navigation className="w-2.5 h-2.5" /> GPS Active ({c.fastagNumber})
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-0.5 text-[10px]">
                              <p className="text-purple-300">Ins: <span className="text-white font-mono">{c.insuranceExpiry}</span></p>
                              <p className="text-purple-300">PUC: <span className="text-white font-mono">{c.pollutionExpiry}</span></p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                                c.status === "Available"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                  : c.status === "Booked"
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                                  : c.status === "In Maintenance"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                  : "bg-purple-500/20 text-purple-300 border-purple-500/40"
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                setViewing360Car(c);
                                setAngle360Index(0);
                              }}
                              className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-[#D4AF37] border border-purple-500/30"
                              title="View 360° Interactive Angle"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingCar(c);
                                setIsAddCarModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-purple-200 border border-purple-500/30"
                              title="Edit Vehicle"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateCar(c)}
                              className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-amber-300 border border-purple-500/30"
                              title="Duplicate Vehicle"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleArchiveCar(c)}
                              className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-purple-300 border border-purple-500/30"
                              title="Archive Vehicle"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCar(c.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              title="Delete Vehicle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {fleetSubTab === "calendar" && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-purple-500/20">
                    <div>
                      <h4 className="font-black text-sm text-white">Fleet Availability & Dynamic Surge Calendar</h4>
                      <p className="text-[11px] text-purple-300">September 2026 &bull; Automatic Weekend (+20%) & Pilgrimage Surge Pricing Active</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">🟢 Available</span>
                      <span className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">🔵 Booked</span>
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">🟡 Weekend (+20%)</span>
                      <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-[#D4AF37] border border-amber-400/30 text-xs font-bold">🟣 Festival Peak</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-3">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                      <div key={d} className="text-center text-xs font-bold text-purple-400 py-1 uppercase">{d}</div>
                    ))}
                    {Array.from({ length: 30 }).map((_, i) => {
                      const day = i + 1;
                      const isWeekend = (day % 7 === 5) || (day % 7 === 6);
                      const isBooked = [5, 6, 7, 12, 13, 20, 21].includes(day);
                      const isFestival = [15, 16, 17].includes(day);

                      return (
                        <div
                          key={day}
                          className={`p-3 rounded-2xl border transition-all ${
                            isBooked
                              ? "bg-blue-900/30 border-blue-500/30"
                              : isFestival
                              ? "bg-purple-900/40 border-amber-500/40 shadow-lg shadow-amber-500/10"
                              : isWeekend
                              ? "bg-amber-900/20 border-amber-500/30"
                              : "bg-[#14081E] border-purple-500/20 hover:border-[#D4AF37]"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-xs text-white">Sep {day}</span>
                            {isFestival && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37] text-slate-950 font-black">SURGE</span>}
                          </div>
                          <p className="text-[10px] text-purple-300">
                            {isBooked ? "3 Cars Booked" : isFestival ? "Peak Festival (+35%)" : isWeekend ? "Weekend (+20%)" : "100% Ready"}
                          </p>
                          <p className="text-[11px] font-bold text-emerald-400 mt-2">
                            ₹{isFestival ? "3,499" : isWeekend ? "2,899" : "2,499"}/day
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {fleetSubTab === "maintenance" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-2xl space-y-4">
                  <h4 className="font-black text-sm text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#D4AF37]" /> Mechanical Health & Service Reminders
                  </h4>
                  <div className="space-y-3 text-xs">
                    {fleet.map((c) => (
                      <div key={c.id} className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/20 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{c.name} ({c.registrationNumber})</p>
                          <p className="text-[10px] text-purple-300">Next Service at {c.nextServiceKm.toLocaleString()} km &bull; Last: {c.lastServiceKm.toLocaleString()} km</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.oilChangeStatus === "Overdue" ? "bg-red-500/20 text-red-300" : c.oilChangeStatus === "Due Soon" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
                          }`}>
                            Oil: {c.oilChangeStatus}
                          </span>
                          <p className="text-[10px] text-purple-400 mt-1">Tyres: {c.tyreHealth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-2xl space-y-4">
                  <h4 className="font-black text-sm text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" /> Statutory Document Expiry Monitor
                  </h4>
                  <div className="space-y-3 text-xs">
                    {fleet.map((c) => (
                      <div key={c.id} className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/20 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{c.name}</p>
                          <p className="text-[10px] text-purple-300 font-mono">PUC: {c.pollutionExpiry} &bull; Ins: {c.insuranceExpiry}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          100% Compliant
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {fleetSubTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-5 rounded-3xl bg-[#2A1336]/60 border border-purple-500/20">
                    <span className="text-xs text-purple-300 font-bold block">Most Booked Car</span>
                    <h4 className="text-lg font-black text-white mt-1">Mahindra Scorpio-N</h4>
                    <p className="text-[10px] text-[#D4AF37] mt-0.5">48 Successful Trips</p>
                  </div>
                  <div className="p-5 rounded-3xl bg-[#2A1336]/60 border border-purple-500/20">
                    <span className="text-xs text-purple-300 font-bold block">Highest Grossing</span>
                    <h4 className="text-lg font-black text-emerald-400 mt-1">₹1,19,952</h4>
                    <p className="text-[10px] text-purple-300 mt-0.5">Scorpio-N Z8L</p>
                  </div>
                  <div className="p-5 rounded-3xl bg-[#2A1336]/60 border border-purple-500/20">
                    <span className="text-xs text-purple-300 font-bold block">Idle Vehicles</span>
                    <h4 className="text-lg font-black text-amber-300 mt-1">1 Car</h4>
                    <p className="text-[10px] text-purple-300 mt-0.5">Available for dispatch</p>
                  </div>
                  <div className="p-5 rounded-3xl bg-[#2A1336]/60 border border-purple-500/20">
                    <span className="text-xs text-purple-300 font-bold block">Maintenance ROI</span>
                    <h4 className="text-lg font-black text-purple-200 mt-1">₹36,700 Total</h4>
                    <p className="text-[10px] text-emerald-400 mt-0.5">9.2% of Gross Rental</p>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-2xl">
                  <h4 className="font-black text-sm text-white mb-1">Booking Demand Heatmap (Day of Week vs Time Slot)</h4>
                  <p className="text-[11px] text-purple-300 mb-4">Darker gold squares represent peak booking velocity hours</p>
                  <div className="grid grid-cols-7 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dIdx) => (
                      <div key={day} className="space-y-2">
                        <span className="text-[10px] font-bold text-purple-400 uppercase text-center block">{day}</span>
                        {["Morning", "Afternoon", "Evening", "Night"].map((slot, sIdx) => {
                          const intensity = (dIdx >= 4 ? 0.8 : 0.3) + sIdx * 0.1;
                          return (
                            <div
                              key={slot}
                              className="h-10 rounded-xl flex items-center justify-center text-[9px] font-bold text-slate-950 transition-transform hover:scale-105"
                              style={{
                                backgroundColor: `rgba(212, 175, 55, ${intensity})`,
                              }}
                            >
                              {slot}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 3: BOOKINGS & DISPATCH SUITE */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "bookings" && (
          <main className="flex-1 p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-[#D4AF37]" /> Enterprise Bookings & Dispatch Suite
                </h2>
                <p className="text-xs text-purple-300 mt-1">
                  Manage live trips, 9 booking categories, chauffeur allocation, damage audit, and rental contracts
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={bookingFilterType}
                  onChange={(e) => setBookingFilterType(e.target.value)}
                  className="px-4 py-2 rounded-2xl bg-[#14081E] border border-purple-500/30 text-[#D4AF37] text-xs font-bold focus:outline-none"
                >
                  <option value="all">All 9 Booking Categories</option>
                  <option value="Self Drive">Self Drive</option>
                  <option value="With Driver">With Driver (Chauffeur)</option>
                  <option value="Airport Pickup">Airport Pickup</option>
                  <option value="Airport Drop">Airport Drop</option>
                  <option value="Outstation">Outstation</option>
                  <option value="Local Rental">Local Rental</option>
                  <option value="Hourly Rental">Hourly Rental</option>
                  <option value="Corporate Booking">Corporate Booking</option>
                  <option value="Subscription Booking">Subscription Booking</option>
                </select>

                <button
                  onClick={() => {
                    setEditingBooking(null);
                    setIsCreateBookingModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> New Booking
                </button>
              </div>
            </div>

            {/* 10 Lifecycle Status Pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "all",
                "Pending",
                "Confirmed",
                "Assigned Driver",
                "Vehicle Ready",
                "Pickup Started",
                "Ongoing Trip",
                "Trip Completed",
                "Returned",
                "Cancelled",
                "Refunded",
              ].map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all capitalize ${
                    bookingFilterStatus === st
                      ? "bg-[#D4AF37] text-slate-950 font-black shadow-md"
                      : "bg-[#2A1336]/60 text-purple-300 border border-purple-500/20 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Bookings Table */}
            <div className="rounded-3xl border border-purple-500/20 bg-[#2A1336]/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#190924] text-purple-300 uppercase tracking-wider font-bold border-b border-purple-500/20">
                  <tr>
                    <th className="px-4 py-4">Booking ID</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Customer</th>
                    <th className="px-4 py-4">Vehicle & Chauffeur</th>
                    <th className="px-4 py-4">Schedule & Route</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Lifecycle Status</th>
                    <th className="px-4 py-4 text-right">Admin Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-purple-900/20 transition-colors">
                      <td className="px-4 py-4 font-mono font-bold text-[#D4AF37]">#{b.id}</td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-950 border border-purple-500/30 text-purple-200">
                          {b.bookingType}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-white">{b.customerName}</p>
                        <p className="text-[10px] text-purple-300">{b.customerPhone}</p>
                        <p className="text-[10px] text-purple-400/80">{b.customerEmail}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold flex items-center gap-1.5 text-white">
                          <Car className="w-3.5 h-3.5 text-[#D4AF37]" /> {b.carName}
                        </p>
                        <p className="text-[10px] text-purple-300 mt-0.5">
                          Driver: <span className="font-semibold text-emerald-400">{b.driverName || "Self Driven"}</span>
                        </p>
                      </td>
                      <td className="px-4 py-4 text-purple-200">
                        <p className="font-bold">{b.startDate} ➔ {b.endDate}</p>
                        <p className="text-[10px] text-purple-400 truncate max-w-[180px]">{b.pickupAddress}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-black text-emerald-400 text-sm">₹{b.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-purple-400 font-bold">Dep: ₹{b.securityDeposit}</p>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value as BookingStatus)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                            b.status === "Ongoing Trip"
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                              : b.status === "Confirmed"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : b.status === "Returned"
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                              : b.status === "Pending"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-red-500/20 text-red-300 border-red-500/40"
                          }`}
                        >
                          <option value="Pending" className="bg-[#14081E] text-white">Pending</option>
                          <option value="Confirmed" className="bg-[#14081E] text-white">Confirmed</option>
                          <option value="Assigned Driver" className="bg-[#14081E] text-white">Assigned Driver</option>
                          <option value="Vehicle Ready" className="bg-[#14081E] text-white">Vehicle Ready</option>
                          <option value="Pickup Started" className="bg-[#14081E] text-white">Pickup Started</option>
                          <option value="Ongoing Trip" className="bg-[#14081E] text-white">Ongoing Trip</option>
                          <option value="Trip Completed" className="bg-[#14081E] text-white">Trip Completed</option>
                          <option value="Returned" className="bg-[#14081E] text-white">Returned</option>
                          <option value="Cancelled" className="bg-[#14081E] text-white">Cancelled</option>
                          <option value="Refunded" className="bg-[#14081E] text-white">Refunded</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingBooking(b);
                            setIsCreateBookingModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-purple-200 border border-purple-500/30"
                          title="Modify / Edit Booking"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("assign_driver");
                          }}
                          className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-emerald-300 border border-purple-500/30"
                          title="Assign Chauffeur & Delivery Staff"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("timeline");
                          }}
                          className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-[#D4AF37] border border-purple-500/30"
                          title="Live 8-Step Journey Timeline"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("inspection");
                          }}
                          className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-emerald-300 border border-purple-500/30"
                          title="Pre & Post Damage Inspection"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("reschedule");
                          }}
                          className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-purple-200 border border-purple-500/30"
                          title="Reschedule Dates"
                        >
                          <CalendarDays className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("upgrade");
                          }}
                          className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-amber-300 border border-purple-500/30"
                          title="1-Click Car Upgrade"
                        >
                          <Zap className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("invoice");
                          }}
                          className="p-1.5 rounded-lg bg-[#432650] text-[#D4AF37] font-bold"
                          title="Generate & Print GST Invoice"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("agreement");
                          }}
                          className="p-1.5 rounded-lg bg-[#432650] text-purple-200 font-bold"
                          title="Generate Self-Drive Agreement"
                        >
                          <FileSignature className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          title="Cancel / Delete Booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: CUSTOMER CRM & KYC MANAGEMENT */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "customers" && (
          <CustomerManagement
            customers={customers}
            setCustomers={setCustomers}
            setNotice={setNotice}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: DRIVER & CHAUFFEUR ROSTER */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "drivers" && (
          <DriverManagement
            drivers={drivers}
            setDrivers={setDrivers}
            setNotice={setNotice}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: BRANCHES & STATION HUBS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "branches" && (
          <BranchManagement
            branches={branches}
            setBranches={setBranches}
            setNotice={setNotice}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: PAYMENTS LEDGER & ESCROW */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "payments" && (
          <PaymentManagement
            payments={payments}
            setPayments={setPayments}
            setNotice={setNotice}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: PROMOTIONAL COUPON ENGINE */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "coupons" && (
          <CouponEngine
            coupons={coupons}
            setCoupons={setCoupons}
            setNotice={setNotice}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: ENTERPRISE ANALYTICS & REPORTS SUITE */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "reports" && (
          <ReportsSuite
            fleet={fleet}
            bookings={bookings}
            branches={branches}
            payments={payments}
            setNotice={setNotice}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: CMS & WEBSITE CONTENT BUILDER */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "cms" && (
          <CMSManagement
            banners={banners}
            setBanners={setBanners}
            offers={offers}
            setOffers={setOffers}
            testimonials={testimonials}
            setTestimonials={setTestimonials}
            faqs={faqs}
            setFaqs={setFaqs}
            blogs={blogs}
            setBlogs={setBlogs}
            setNotice={setNotice}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: NOTIFICATIONS & MULTI-CHANNEL ALERTS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "notifications" && (
          <NotificationsCenter
            templates={templates}
            setTemplates={setTemplates}
            setNotice={setNotice}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: CUSTOMER REVIEWS MODERATION */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "reviews" && (
          <ReviewsModeration
            reviews={reviews}
            setReviews={setReviews}
            setNotice={setNotice}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: SUPPORT DESK & LIVE CHAT */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "support" && (
          <SupportDesk
            tickets={tickets}
            setTickets={setTickets}
            setNotice={setNotice}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: ENTERPRISE SYSTEM SETTINGS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "settings" && (
          <SettingsManagement setNotice={setNotice} />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: SECURITY & 2FA CENTER */}
        {/* ------------------------------------------------------------------ */}
        {(activeTab === "security" || activeTab === "roles" || activeTab === "sessions") && (
          <SecurityCenter
            initialTab={activeTab === "sessions" ? "sessions" : "rbac"}
            setNotice={setNotice}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW: SEARCHABLE ACTIVITY AUDIT LOGS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "logs" && (
          <ActivityLogsTimeline
            logs={activityLogs}
            setNotice={setNotice}
          />
        )}
      </div>

      {/* ====================================================================
          MODAL A: ADD / EDIT CAR 4-TAB WIZARD
          ==================================================================== */}
      {isAddCarModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-2xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#D4AF37]" /> {editingCar ? `Edit Vehicle: ${editingCar.name}` : "Add New Fleet Vehicle"}
                </h3>
                <p className="text-xs text-purple-300">Complete 30+ attribute registration</p>
              </div>
              <button onClick={() => setIsAddCarModalOpen(false)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex bg-[#14081E] p-1 rounded-xl border border-purple-500/30 text-xs">
              {[
                { id: "specs", label: "Specs & Identity" },
                { id: "pricing", label: "Tiered Pricing & Status" },
                { id: "compliance", label: "Compliance & Expiries" },
                { id: "media", label: "Media & 360 Gallery" },
              ].map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => setActiveCarModalTab(tb.id as any)}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                    activeCarModalTab === tb.id ? "bg-[#D4AF37] text-slate-950 font-black shadow-md" : "text-purple-300"
                  }`}
                >
                  {tb.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                handleSaveCar({
                  brand: form.brand?.value || "Maruti Suzuki",
                  model: form.model?.value || "Swift",
                  variant: form.variant?.value || "ZXi+",
                  name: `${form.brand?.value || "Maruti"} ${form.model?.value || "Swift"} ${form.variant?.value || ""}`.trim(),
                  year: parseInt(form.year?.value) || 2024,
                  registrationNumber: form.registrationNumber?.value || "AP 03 TX 1024",
                  vinNumber: form.vinNumber?.value || "MA3EYD21S00192844",
                  fuelType: form.fuelType?.value || "Petrol",
                  transmission: form.transmission?.value || "Manual",
                  seats: parseInt(form.seats?.value) || 5,
                  mileage: form.mileage?.value || "20 km/l",
                  color: form.color?.value || "Pearl White",
                  category: form.category?.value || "Hatchback",
                  pricePerHour: parseInt(form.pricePerHour?.value) || 199,
                  pricePerDay: parseInt(form.pricePerDay?.value) || 1699,
                  pricePerWeek: parseInt(form.pricePerWeek?.value) || 9999,
                  pricePerMonth: parseInt(form.pricePerMonth?.value) || 34999,
                  securityDeposit: parseInt(form.securityDeposit?.value) || 3000,
                  lateFeePerHour: parseInt(form.lateFeePerHour?.value) || 150,
                  status: form.status?.value || "Available",
                  branch: form.branch?.value || "Tirupati Central Hub",
                  location: form.location?.value || "Tirupati",
                  fastagNumber: form.fastagNumber?.value || "FTG-102030-40",
                  insuranceExpiry: form.insuranceExpiry?.value || "2027-04-15",
                  pollutionExpiry: form.pollutionExpiry?.value || "2026-11-20",
                  fitnessExpiry: form.fitnessExpiry?.value || "2028-08-10",
                  permitExpiry: form.permitExpiry?.value || "2027-12-31",
                  image: form.image?.value || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
                });
              }}
              className="space-y-4 text-xs"
            >
              {activeCarModalTab === "specs" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Brand *</label>
                      <input name="brand" defaultValue={editingCar?.brand || "Maruti Suzuki"} required className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Model *</label>
                      <input name="model" defaultValue={editingCar?.model || "Swift"} required className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Variant</label>
                      <input name="variant" defaultValue={editingCar?.variant || "ZXi Plus"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Reg Number *</label>
                      <input name="registrationNumber" defaultValue={editingCar?.registrationNumber || "AP 03 TX 1024"} required className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white uppercase font-mono" />
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">VIN / Chassis No</label>
                      <input name="vinNumber" defaultValue={editingCar?.vinNumber || "MA3EYD21S00192844"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono" />
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Year</label>
                      <input name="year" type="number" defaultValue={editingCar?.year || 2024} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Category</label>
                      <select name="category" defaultValue={editingCar?.category || "Hatchback"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white">
                        <option value="Hatchback">Hatchback</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Fuel Type</label>
                      <select name="fuelType" defaultValue={editingCar?.fuelType || "Petrol"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white">
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="CNG">CNG</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Transmission</label>
                      <select name="transmission" defaultValue={editingCar?.transmission || "Manual"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white">
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Seats</label>
                      <input name="seats" type="number" defaultValue={editingCar?.seats || 5} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                    </div>
                  </div>
                </div>
              )}

              {activeCarModalTab === "pricing" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Price Per Day (₹) *</label>
                      <input name="pricePerDay" type="number" defaultValue={editingCar?.pricePerDay || 1699} required className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-emerald-400 font-bold text-sm" />
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Price Per Hour (₹)</label>
                      <input name="pricePerHour" type="number" defaultValue={editingCar?.pricePerHour || 199} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Price Per Week (₹)</label>
                      <input name="pricePerWeek" type="number" defaultValue={editingCar?.pricePerWeek || 9999} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Security Deposit (₹)</label>
                      <input name="securityDeposit" type="number" defaultValue={editingCar?.securityDeposit || 3000} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-[#D4AF37] font-bold" />
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Late Fee / Hr (₹)</label>
                      <input name="lateFeePerHour" type="number" defaultValue={editingCar?.lateFeePerHour || 150} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Initial Status</label>
                      <select name="status" defaultValue={editingCar?.status || "Available"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white">
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="In Maintenance">In Maintenance</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Reserved">Reserved</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeCarModalTab === "compliance" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Branch / Station Hub</label>
                      <select name="branch" defaultValue={editingCar?.branch || "Tirupati Central Hub"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white">
                        <option value="Tirupati Central Hub">Tirupati Central Hub</option>
                        <option value="Renigunta Airport Hub">Renigunta Airport Hub</option>
                        <option value="Chandragiri Heritage Point">Chandragiri Heritage Point</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">FASTag Number</label>
                      <input name="fastagNumber" defaultValue={editingCar?.fastagNumber || "FTG-889021-39"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Insurance Expiry Date</label>
                      <input name="insuranceExpiry" type="date" defaultValue={editingCar?.insuranceExpiry || "2027-04-15"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                    </div>
                    <div>
                      <label className="block text-purple-300 font-bold mb-1">Pollution (PUC) Expiry</label>
                      <input name="pollutionExpiry" type="date" defaultValue={editingCar?.pollutionExpiry || "2026-11-20"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                    </div>
                  </div>
                </div>
              )}

              {activeCarModalTab === "media" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-purple-300 font-bold mb-1">Primary Image URL / Cloudinary</label>
                    <input name="image" defaultValue={editingCar?.image || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/20 text-center">
                    <p className="text-purple-300 text-xs">360° Angle Views & Walkaround Video configured automatically upon image upload</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-purple-500/20">
                <button type="button" onClick={() => setIsAddCarModalOpen(false)} className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs">
                  {editingCar ? "Save Changes" : "Create Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL B: BULK CSV UPLOADER
          ==================================================================== */}
      {isBulkCsvModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#D4AF37]" /> Bulk Upload Cars (CSV Importer)
              </h3>
              <button onClick={() => setIsBulkCsvModalOpen(false)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-purple-300">
              Paste your CSV vehicle rows below. Format: <code className="text-[#D4AF37]">Brand, Model, Variant, PricePerDay, RegNumber, Category</code>
            </p>

            <textarea
              rows={6}
              value={bulkCsvInput}
              onChange={(e) => setBulkCsvInput(e.target.value)}
              placeholder={`Brand, Model, Variant, PricePerDay, RegNumber, Category
Maruti Suzuki, Swift, ZXi+, 1699, AP 03 TX 1024, Hatchback
Mahindra, Scorpio-N, Z8L 4x4, 2499, AP 03 ZX 9900, SUV
Honda, City, ZX CVT, 2199, AP 03 DX 5088, Sedan`}
              className="w-full bg-[#14081E] border border-purple-500/30 rounded-2xl p-3 text-xs font-mono text-purple-200 focus:outline-none focus:border-[#D4AF37]"
            ></textarea>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() =>
                  setBulkCsvInput(
                    `Brand, Model, Variant, PricePerDay, RegNumber, Category\nMaruti Suzuki, Baleno, Alpha, 1799, AP 03 BX 1122, Hatchback\nTata, Harrier, Fearless+, 2699, AP 03 HX 8899, SUV\nHyundai, Verna, SX(O) Turbo, 2299, AP 03 VX 4455, Sedan`
                  )
                }
                className="text-[11px] text-[#D4AF37] underline"
              >
                Insert Sample Template
              </button>
              <div className="flex gap-2">
                <button onClick={() => setIsBulkCsvModalOpen(false)} className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs">
                  Cancel
                </button>
                <button onClick={handleBulkCsvImport} className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs">
                  Import CSV Fleet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL C: 360° INTERACTIVE ANGLE SHOWCASE
          ==================================================================== */}
      {viewing360Car && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-4 text-center">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-[#D4AF37]" /> 360° Studio Showcase: {viewing360Car.name}
              </h3>
              <button onClick={() => setViewing360Car(null)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 h-64 bg-slate-950 flex items-center justify-center">
              <img src={viewing360Car.image} alt="360" className="max-h-full object-contain" />
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
                {["Front (0°)", "Right (90°)", "Rear (180°)", "Left (270°)"].map((angle, idx) => (
                  <button
                    key={angle}
                    onClick={() => setAngle360Index(idx)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold ${
                      angle360Index === idx ? "bg-[#D4AF37] text-slate-950 font-black" : "bg-[#14081E]/80 text-purple-300"
                    }`}
                  >
                    {angle}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-purple-300">Registration: <strong className="text-white">{viewing360Car.registrationNumber}</strong> &bull; {viewing360Car.color}</p>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 1: LIVE 8-STEP JOURNEY TIMELINE
          ==================================================================== */}
      {activeBookingModal === "timeline" && selectedBooking && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-purple-500/20">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <History className="w-5 h-5 text-[#D4AF37]" /> Booking #{selectedBooking.id} Live Journey Timeline
                </h3>
                <p className="text-xs text-purple-300 mt-0.5">{selectedBooking.customerName} &bull; {selectedBooking.carName}</p>
              </div>
              <button onClick={() => setActiveBookingModal(null)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {[
                { step: 1, title: "Customer Booked", desc: "Reservation submitted via Mobile App / Web Portal.", time: "Sep 4, 6:30 PM", done: selectedBooking.timelineStep >= 1 },
                { step: 2, title: "Payment Received", desc: "Advance fare & deposit paid via UPI gateway.", time: "Sep 4, 6:31 PM", done: selectedBooking.timelineStep >= 2 },
                { step: 3, title: "Driver Assigned", desc: "Chauffeur & delivery agent dispatched.", time: "Sep 4, 7:00 PM", done: selectedBooking.timelineStep >= 3 },
                { step: 4, title: "Vehicle Delivered", desc: "Vehicle pre-inspected & handed over to customer.", time: "Sep 5, 9:00 AM", done: selectedBooking.timelineStep >= 4 },
                { step: 5, title: "Trip Started", desc: "Live GPS tracking activated & on road.", time: "Sep 5, 9:15 AM", done: selectedBooking.timelineStep >= 5 },
                { step: 6, title: "Trip Ended", desc: "Customer returned to designated station hub.", time: "Sep 7, 5:00 PM", done: selectedBooking.timelineStep >= 6 },
                { step: 7, title: "Vehicle Returned", desc: "Digital damage inspection & fuel audit logged.", time: "Pending", done: selectedBooking.timelineStep >= 7 },
                { step: 8, title: "Refund Completed", desc: "Security deposit released after reconciliation.", time: "Pending", done: selectedBooking.timelineStep >= 8 },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    item.done ? "bg-[#D4AF37] text-slate-950 font-black shadow-md" : "bg-[#14081E] text-purple-400 border border-purple-500/30"
                  }`}>
                    {item.done ? <Check className="w-4 h-4" /> : item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h5 className={`font-bold ${item.done ? "text-white" : "text-purple-400"}`}>{item.title}</h5>
                      <span className="text-[10px] text-purple-400 font-mono">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-purple-300/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-purple-500/20">
              <button
                onClick={() => setActiveBookingModal(null)}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: DIGITAL DAMAGE INSPECTION & PENALTY ENGINE
          ==================================================================== */}
      {activeBookingModal === "inspection" && selectedBooking && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[#D4AF37]" /> Pre & Post Trip Damage Audit & Penalty Reconciler
                </h3>
                <p className="text-xs text-purple-300 mt-0.5">Booking #{selectedBooking.id} &bull; {selectedBooking.carName}</p>
              </div>
              <button onClick={() => setActiveBookingModal(null)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/20">
                <span className="text-purple-400 uppercase text-[10px] font-bold block">Pickup Odometer</span>
                <span className="text-sm font-bold text-white">{selectedBooking.startOdometer} km</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/20">
                <span className="text-purple-400 uppercase text-[10px] font-bold block">Return Odometer</span>
                <span className="text-sm font-bold text-emerald-400">{selectedBooking.returnOdometer} km (+250 km)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/20 space-y-2 text-xs">
              <h4 className="font-bold text-[#D4AF37] text-[11px] uppercase tracking-wider">6-Point Damage Checklist</h4>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                {["Front Bumper", "Rear Bumper", "Doors & Panels", "Windshield & Glass", "Cabin Upholstery", "Tyres & Rims"].map((chk) => (
                  <label key={chk} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/20 cursor-pointer">
                    <input type="checkbox" className="accent-[#D4AF37] w-3.5 h-3.5 rounded" />
                    <span className="truncate">{chk}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-[#D4AF37]">Violation & Surcharge Ledger</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 mb-1">Fuel Deficit (Litres Missing)</label>
                  <input
                    type="number"
                    value={inspectionState.fuelDeficitLitres}
                    onChange={(e) => setInspectionState({ ...inspectionState, fuelDeficitLitres: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-1">Cleaning Charge (₹)</label>
                  <input
                    type="number"
                    value={inspectionState.cleaningFee}
                    onChange={(e) => setInspectionState({ ...inspectionState, cleaningFee: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 mb-1">Late Return (Hours @ ₹250/hr)</label>
                  <input
                    type="number"
                    value={inspectionState.lateHours}
                    onChange={(e) => setInspectionState({ ...inspectionState, lateHours: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-1">Dent / Scratch Surcharge (₹)</label>
                  <input
                    type="number"
                    value={inspectionState.scratchDamageFee}
                    onChange={(e) => setInspectionState({ ...inspectionState, scratchDamageFee: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#14081E] border border-purple-500/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inspectionState.smokingViolation}
                  onChange={(e) => setInspectionState({ ...inspectionState, smokingViolation: e.target.checked })}
                  className="accent-[#D4AF37] w-4 h-4 rounded"
                />
                <span className="font-bold text-red-300">Smoking Charge Violation (+₹2,500 Fine)</span>
              </label>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/30 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-300">Security Deposit Held:</span>
                <span className="font-bold text-white">₹{selectedBooking.securityDeposit}</span>
              </div>
              <div className="flex justify-between text-red-400">
                <span>Total Penalties Deducted:</span>
                <span>
                  -₹
                  {inspectionState.fuelDeficitLitres * 110 +
                    (inspectionState.smokingViolation ? 2500 : 0) +
                    inspectionState.lateHours * 250 +
                    inspectionState.cleaningFee +
                    inspectionState.scratchDamageFee}
                </span>
              </div>
              <div className="flex justify-between font-black text-sm text-[#D4AF37] pt-1.5 border-t border-purple-500/20">
                <span>Net Refund to Customer:</span>
                <span>
                  ₹
                  {Math.max(
                    0,
                    selectedBooking.securityDeposit -
                      (inspectionState.fuelDeficitLitres * 110 +
                        (inspectionState.smokingViolation ? 2500 : 0) +
                        inspectionState.lateHours * 250 +
                        inspectionState.cleaningFee +
                        inspectionState.scratchDamageFee)
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveBookingModal(null)}
                className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplyInspectionPenalties(selectedBooking.id)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs"
              >
                Reconcile & Complete Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: ASSIGN DRIVER & DELIVERY STAFF
          ==================================================================== */}
      {activeBookingModal === "assign_driver" && selectedBooking && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <h3 className="text-base font-black flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#D4AF37]" /> Assign Chauffeur & Staff for Booking #{selectedBooking.id}
            </h3>
            <p className="text-xs text-purple-300">Allocate verified driver & delivery agent for trip</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-purple-300 font-bold mb-1">Select Chauffeur</label>
                <select
                  value={driverAssignForm.driverName}
                  onChange={(e) => setDriverAssignForm({ ...driverAssignForm, driverName: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="Self Driven">Self Driven (Customer Drives)</option>
                  <option value="Suresh Kumar (+91 98765 00001)">Suresh Kumar (+91 98765 00001)</option>
                  <option value="Gopal Naidu (+91 98765 00002)">Gopal Naidu (+91 98765 00002)</option>
                  <option value="Srinivas (+91 98765 00003)">Srinivas (+91 98765 00003)</option>
                  <option value="Venkatesh (+91 98765 00004)">Venkatesh (+91 98765 00004)</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Delivery & Handover Agent</label>
                <select
                  value={driverAssignForm.deliveryStaff}
                  onChange={(e) => setDriverAssignForm({ ...driverAssignForm, deliveryStaff: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                >
                  <option value="Ravi Teja (Central Hub)">Ravi Teja (Central Hub)</option>
                  <option value="Kiran Reddy (Airport Hub)">Kiran Reddy (Airport Hub)</option>
                  <option value="Rajesh (Chandragiri Point)">Rajesh (Chandragiri Point)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setActiveBookingModal(null)} className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs">
                Cancel
              </button>
              <button
                onClick={() => handleAssignDriverSubmit(selectedBooking.id)}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs"
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 4: RESCHEDULE DATES
          ==================================================================== */}
      {activeBookingModal === "reschedule" && selectedBooking && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <h3 className="text-base font-black flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#D4AF37]" /> Reschedule Booking #{selectedBooking.id}
            </h3>
            <p className="text-xs text-purple-300">Update pickup and return reservation dates</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-purple-300 font-bold mb-1">New Pickup Date</label>
                <input
                  type="date"
                  value={rescheduleDates.startDate}
                  onChange={(e) => setRescheduleDates({ ...rescheduleDates, startDate: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">New Return Date</label>
                <input
                  type="date"
                  value={rescheduleDates.endDate}
                  onChange={(e) => setRescheduleDates({ ...rescheduleDates, endDate: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setActiveBookingModal(null)} className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs">
                Cancel
              </button>
              <button
                onClick={() => handleApplyReschedule(selectedBooking.id)}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 5: 1-CLICK CAR UPGRADE
          ==================================================================== */}
      {activeBookingModal === "upgrade" && selectedBooking && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <h3 className="text-base font-black flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#D4AF37]" /> Upgrade Vehicle for Booking #{selectedBooking.id}
            </h3>
            <p className="text-xs text-purple-300">Current Vehicle: <strong className="text-white">{selectedBooking.carName}</strong></p>

            <div className="space-y-3 text-xs">
              <label className="block text-purple-300 font-bold">Select Higher Segment Vehicle</label>
              <select
                value={upgradeCarTarget}
                onChange={(e) => setUpgradeCarTarget(e.target.value)}
                className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-3 text-[#D4AF37] font-bold"
              >
                {fleet.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.category}) - {c.price}/day
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setActiveBookingModal(null)} className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs">
                Cancel
              </button>
              <button
                onClick={() => handleApplyCarUpgrade(selectedBooking.id)}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs"
              >
                Apply Car Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 6: PRINTABLE CORPORATE INVOICE
          ==================================================================== */}
      {activeBookingModal === "invoice" && selectedBooking && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#1E0F2B] border border-purple-500/40 rounded-3xl w-full max-w-xl p-8 shadow-2xl text-white space-y-6">
            <div className="flex justify-between items-center border-b border-purple-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#D4AF37] text-slate-950 font-black flex items-center justify-center">M</div>
                <div>
                  <h3 className="text-base font-black">Moar Cars Tax Invoice</h3>
                  <p className="text-[10px] text-purple-300">GSTIN: 37AAAAA0000A1Z5 &bull; CIN: U50100AP2026PTC012345</p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#D4AF37] font-bold">INV-2026-BK{selectedBooking.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-400 block">Customer Information</span>
                <p className="font-bold text-white">{selectedBooking.customerName}</p>
                <p className="text-purple-300">{selectedBooking.customerPhone}</p>
                <p className="text-purple-400">{selectedBooking.customerEmail}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-400 block">Trip & Station Details</span>
                <p className="font-bold text-white">{selectedBooking.startDate} to {selectedBooking.endDate}</p>
                <p className="text-purple-300">{selectedBooking.pickup}</p>
                <p className="text-[#D4AF37] font-bold">Category: {selectedBooking.bookingType}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#14081E] border border-purple-500/20 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Vehicle Rental ({selectedBooking.carName})</span>
                <span className="font-bold">₹{selectedBooking.amount}</span>
              </div>
              {selectedBooking.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({selectedBooking.couponCode})</span>
                  <span>-₹{selectedBooking.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-purple-300">
                <span>GST Tax (18% inclusive)</span>
                <span>₹{selectedBooking.taxAmount}</span>
              </div>
              <div className="flex justify-between text-purple-300">
                <span>Refundable Security Deposit</span>
                <span>₹{selectedBooking.securityDeposit}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-[#D4AF37] pt-2 border-t border-purple-500/20">
                <span>Grand Total Paid</span>
                <span>₹{(selectedBooking.amount + selectedBooking.securityDeposit).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveBookingModal(null)} className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs">
                Close
              </button>
              <button onClick={() => window.print()} className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5" /> Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 7: LEGAL RENTAL AGREEMENT PDF
          ==================================================================== */}
      {activeBookingModal === "agreement" && selectedBooking && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#1E0F2B] border border-purple-500/40 rounded-3xl w-full max-w-xl p-8 shadow-2xl text-white space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
              <h3 className="text-base font-black flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-[#D4AF37]" /> Self-Drive Legal Rental Agreement
              </h3>
              <button onClick={() => setActiveBookingModal(null)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-purple-200/90 leading-relaxed bg-[#14081E] p-4 rounded-2xl border border-purple-500/20">
              <p><strong>Parties:</strong> This agreement is between Moar Cars Rental Services and <strong>{selectedBooking.customerName}</strong> ({selectedBooking.customerPhone}).</p>
              <p><strong>Vehicle:</strong> {selectedBooking.carName} under Booking ID #{selectedBooking.id}.</p>
              <p><strong>Duration:</strong> From {selectedBooking.startDate} to {selectedBooking.endDate}.</p>
              <p><strong>Key Terms & Liability:</strong></p>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-purple-300">
                <li>Zero tolerance for commercial contraband, drunken driving, or smoking inside cabin (₹2,500 penalty).</li>
                <li>Renter must return vehicle with same fuel level as recorded at pickup.</li>
                <li>Comprehensive Insurance plan active with standard deductible terms.</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-purple-500/20 text-xs">
              <div>
                <p className="text-purple-400 text-[10px] uppercase">Renter Signature</p>
                <div className="h-12 border-b border-purple-500/40 mt-2 font-mono text-purple-300 flex items-end">
                  Digitally Acknowledged (OTP Verified)
                </div>
              </div>
              <div>
                <p className="text-purple-400 text-[10px] uppercase">Authorized Signatory (Moar Cars)</p>
                <div className="h-12 border-b border-purple-500/40 mt-2 font-mono text-[#D4AF37] flex items-end">
                  Moar Cars Executive Seal
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveBookingModal(null)} className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs">
                Close
              </button>
              <button onClick={() => window.print()} className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5" /> Print Agreement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 8: CREATE / MODIFY RESERVATION WIZARD (9 CATEGORIES)
          ==================================================================== */}
      {isCreateBookingModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" /> {editingBooking ? `Modify Booking #${editingBooking.id}` : "Create Enterprise Reservation"}
              </h3>
              <button onClick={() => setIsCreateBookingModalOpen(false)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as any;
                if (editingBooking) {
                  const updatedData = {
                    bookingType: target.bookingType.value as BookingType,
                    pickup: target.pickup.value,
                    startDate: target.startDate.value,
                    endDate: target.endDate.value,
                    carName: target.carName.value,
                    customerName: target.customerName.value,
                    customerPhone: target.customerPhone.value,
                    customerEmail: target.customerEmail.value,
                    driverName: target.driverName.value,
                    pickupAddress: target.pickupAddress.value,
                    amount: parseInt(target.amount.value) || editingBooking.amount,
                    notes: target.notes.value,
                  };
                  setBookings((prev) =>
                    prev.map((b) =>
                      b.id === editingBooking.id
                        ? { ...b, ...updatedData }
                        : b
                    )
                  );
                  setNotice({ type: "success", text: `Booking #${editingBooking.id} updated successfully!` });
                  adminApi.updateBooking(editingBooking.id, updatedData);
                } else {
                  const newB: BookingItem = {
                    id: Math.floor(1000 + Math.random() * 9000),
                    bookingType: target.bookingType.value as BookingType,
                    pickup: target.pickup.value,
                    startDate: target.startDate.value,
                    endDate: target.endDate.value,
                    carName: target.carName.value,
                    status: "Confirmed",
                    customerName: target.customerName.value,
                    customerPhone: target.customerPhone.value,
                    customerEmail: target.customerEmail.value || "customer@example.com",
                    driverName: target.driverName.value || "Self Driven",
                    driverPhone: "+91 98765 00001",
                    deliveryStaff: "Ravi Teja",
                    pickupAddress: target.pickupAddress.value || "Tirupati Central Hub",
                    dropAddress: target.dropAddress.value || "Tirupati Central Hub",
                    duration: "2 Days",
                    insurancePlan: "Zero Dep Platinum",
                    couponCode: "MOARFIRST",
                    discountAmount: 500,
                    taxAmount: 600,
                    securityDeposit: 3000,
                    amount: parseInt(target.amount.value) || 3999,
                    branch: target.pickup.value,
                    paymentMethod: "UPI",
                    paymentStatus: "Paid",
                    bookingSource: "Admin Console",
                    notes: target.notes.value || "Created via Admin Portal",
                    startOdometer: 20000,
                    returnOdometer: 20250,
                    startFuel: 100,
                    returnFuel: 100,
                    penalties: 0,
                    timelineStep: 2,
                  };
                  setBookings([newB, ...bookings]);
                  setNotice({ type: "success", text: `Reservation #${newB.id} created successfully!` });
                  adminApi.createBooking(newB);
                }

                setIsCreateBookingModalOpen(false);
                setEditingBooking(null);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Booking Category *</label>
                  <select name="bookingType" defaultValue={editingBooking?.bookingType || "Self Drive"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-[#D4AF37] font-bold">
                    <option value="Self Drive">Self Drive</option>
                    <option value="With Driver">With Driver (Chauffeur)</option>
                    <option value="Airport Pickup">Airport Pickup</option>
                    <option value="Airport Drop">Airport Drop</option>
                    <option value="Outstation">Outstation</option>
                    <option value="Local Rental">Local Rental</option>
                    <option value="Hourly Rental">Hourly Rental</option>
                    <option value="Corporate Booking">Corporate Booking</option>
                    <option value="Subscription Booking">Subscription Booking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Vehicle Selection *</label>
                  <select name="carName" defaultValue={editingBooking?.carName || fleet[0]?.name} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white">
                    {fleet.map((c) => (
                      <option key={c.id} value={c.name}>{c.name} - {c.price}/day</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Customer Name *</label>
                  <input name="customerName" defaultValue={editingBooking?.customerName || ""} required placeholder="Ramesh Chandra" className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Phone Number *</label>
                  <input name="customerPhone" defaultValue={editingBooking?.customerPhone || ""} required placeholder="+91 98765 43210" className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Email</label>
                  <input name="customerEmail" defaultValue={editingBooking?.customerEmail || ""} placeholder="ramesh@gmail.com" className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Pickup Station / Hub</label>
                  <select name="pickup" defaultValue={editingBooking?.pickup || "Tirupati Central Hub"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white">
                    <option value="Tirupati Central Hub">Tirupati Central Hub</option>
                    <option value="Renigunta Airport Hub">Renigunta Airport Hub</option>
                    <option value="Chandragiri Heritage Point">Chandragiri Heritage Point</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Assigned Chauffeur</label>
                  <input name="driverName" defaultValue={editingBooking?.driverName || "Self Driven"} placeholder="Self Driven (or Chauffeur Name)" className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Pickup Date</label>
                  <input name="startDate" type="date" defaultValue={editingBooking?.startDate || "2026-09-06"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Return Date</label>
                  <input name="endDate" type="date" defaultValue={editingBooking?.endDate || "2026-09-08"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Exact Pickup Address</label>
                  <input name="pickupAddress" defaultValue={editingBooking?.pickupAddress || "Near Tirupati Railway Station"} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Total Fare (₹) *</label>
                  <input name="amount" type="number" defaultValue={editingBooking?.amount || 4998} className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-bold text-emerald-400" />
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Admin Notes / Instructions</label>
                <input name="notes" defaultValue={editingBooking?.notes || ""} placeholder="Special requirements, child seat, flight number..." className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-purple-500/20">
                <button type="button" onClick={() => setIsCreateBookingModalOpen(false)} className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs">
                  {editingBooking ? "Save Changes" : "Create Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
