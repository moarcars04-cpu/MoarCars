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
import { getTodayDateStr, getFutureDateStr, getMaxBookingDateStr } from "@/lib/dateUtils";

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
  CategoryItem,
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
import CategoryManagement from "./admin/CategoryManagement";
import ReportsSuite from "./admin/ReportsSuite";
import CMSManagement from "./admin/CMSManagement";
import SettingsManagement from "./admin/SettingsManagement";
import NotificationsCenter from "./admin/NotificationsCenter";
import ReviewsModeration from "./admin/ReviewsModeration";
import SupportDesk from "./admin/SupportDesk";
import SecurityCenter from "./admin/SecurityCenter";
import ActivityLogsTimeline from "./admin/ActivityLogsTimeline";
import { AdminOtpLogin } from "./admin/AdminOtpLogin";
import { adminApi } from "./admin/adminApi";

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const saved = localStorage.getItem("moar_admin_theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      // fallback
    }
    return "dark";
  });
  const isDark = theme === "dark";

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("moar_admin_theme", nextTheme);
    } catch {
      // ignore
    }
  };

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("moar_admin_authenticated") === "true";
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    email: string;
    role: UserRole;
    branch: string;
  }>(() => {
    try {
      const saved = sessionStorage.getItem("moar_admin_user");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      username: "Executive Super Admin",
      email: "moarcars04@gmail.com",
      role: "Super Admin",
      branch: "All Branches",
    };
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

  // Dynamic Fleet Categories
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  // Fleet Sub-Tab State
  const [fleetSubTab, setFleetSubTab] = useState<"roster" | "calendar" | "maintenance" | "analytics" | "categories">("roster");
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
  // OPERATIONAL STATE (Dynamic from Backend Database)
  // ----------------------------------------------------------------------
  const [fleet, setFleet] = useState<CarItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);

  // ----------------------------------------------------------------------
  // REVENUE & DISPATCH STATS (Dynamic Calculation)
  // ----------------------------------------------------------------------
  const stats = useMemo(() => {
    const totalCars = fleet.length;
    const availableCars = fleet.filter((c) => c.status === "Available").length;
    const bookedCars = fleet.filter((c) => c.status === "Booked").length;
    const maintenanceCars = fleet.filter((c) => c.status === "In Maintenance" || c.status === "Maintenance").length;
    const activeBookings = bookings.filter((b) => b.status === "Ongoing Trip" || b.status === "Active" || b.status === "Confirmed").length;
    const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
    const todayPickups = bookings.filter((b) => b.status === "Active" || b.status === "Confirmed").length;
    const todayReturns = bookings.filter((b) => b.status === "Completed").length;
    const cancelledBookings = bookings.filter((b) => b.status === "Cancelled").length;
    const totalRevenue = payments.filter((p) => p.status === "Paid").reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const revenueToday = totalRevenue;
    const revenueMonth = totalRevenue;
    const totalMaintenance = fleet.reduce((acc, c) => acc + (Number(c.maintenanceCost) || 0), 0);
    const utilizationRate = totalCars > 0 ? Math.round(((totalCars - availableCars) / totalCars) * 100) : 0;

    return {
      totalCars,
      availableCars,
      bookedCars,
      maintenanceCars,
      activeBookings,
      pendingBookings,
      todayPickups,
      todayReturns,
      revenueToday,
      revenueMonth,
      cancelledBookings,
      totalRevenue,
      totalMaintenance,
      utilizationRate,
    };
  }, [fleet, bookings, payments]);

  // Filtered Fleet
  const filteredFleet = useMemo(() => {
    return fleet.filter((c) => {
      const matchSearch =
        (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.brand || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.registrationNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.vinNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.branch || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = fleetFilterStatus === "all" || c.status === fleetFilterStatus;
      const matchCat = fleetFilterCategory === "all" || c.category === fleetFilterCategory;
      return matchSearch && matchStatus && matchCat;
    });
  }, [fleet, searchQuery, fleetFilterStatus, fleetFilterCategory]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        (b.id || "").toString().includes(searchQuery) ||
        (b.customerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.carName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.pickup || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.customerPhone || "").includes(searchQuery);
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
          dbCategories,
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
          dbSettings,
        ] = await Promise.all([
          adminApi.getCategories(),
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
          adminApi.getSettings(),
        ]);

        if (!isMounted) return;

        if (Array.isArray(dbCategories)) setCategories(dbCategories);
        if (Array.isArray(dbCars)) setFleet(dbCars);
        if (Array.isArray(dbBookings)) setBookings(dbBookings);
        if (Array.isArray(dbCustomers)) setCustomers(dbCustomers);
        if (Array.isArray(dbDrivers)) setDrivers(dbDrivers);
        if (Array.isArray(dbBranches)) setBranches(dbBranches);
        if (Array.isArray(dbPayments)) setPayments(dbPayments);
        if (Array.isArray(dbCoupons)) setCoupons(dbCoupons);
        if (Array.isArray(dbReviews)) setReviews(dbReviews);
        if (Array.isArray(dbTickets)) setTickets(dbTickets);
        if (Array.isArray(dbLogs)) setActivityLogs(dbLogs);
        if (dbSettings) {
          if (Array.isArray(dbSettings.cms_banners)) setBanners(dbSettings.cms_banners);
          if (Array.isArray(dbSettings.cms_offers)) setOffers(dbSettings.cms_offers);
          if (Array.isArray(dbSettings.cms_testimonials)) setTestimonials(dbSettings.cms_testimonials);
          if (Array.isArray(dbSettings.cms_faqs)) setFaqs(dbSettings.cms_faqs);
          if (Array.isArray(dbSettings.cms_blogs)) setBlogs(dbSettings.cms_blogs);
          if (Array.isArray(dbSettings.notification_templates)) setTemplates(dbSettings.notification_templates);
        }
      } catch (err) {
        console.warn("[Admin] Live DB initial load:", err);
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
      const primaryImg = carData.image || (Array.isArray(carData.galleryImages) && carData.galleryImages[0] ? carData.galleryImages[0] : "");
      const newCar: CarItem = {
        id: Math.floor(100 + Math.random() * 900),
        name: carData.name || "Fleet Vehicle",
        brand: carData.brand || "",
        model: carData.model || "",
        variant: carData.variant || "",
        year: carData.year || new Date().getFullYear(),
        registrationNumber: carData.registrationNumber || "",
        vinNumber: carData.vinNumber || "",
        detail: carData.detail || "Self-drive rental vehicle",
        price: carData.price || `₹${carData.pricePerDay || 0}/day`,
        pricePerHour: carData.pricePerHour || 0,
        pricePerDay: carData.pricePerDay || 0,
        pricePerWeek: carData.pricePerWeek || 0,
        pricePerMonth: carData.pricePerMonth || 0,
        securityDeposit: carData.securityDeposit || 0,
        lateFeePerHour: carData.lateFeePerHour || 0,
        tag: carData.tag || "New",
        category: (carData.category as any) || (categories[0]?.name || "Fleet"),
        fuelType: (carData.fuelType as any) || "Petrol",
        transmission: (carData.transmission as any) || "Manual",
        seats: carData.seats || 5,
        mileage: carData.mileage || "",
        color: carData.color || "",
        status: (carData.status as any) || "Available",
        branch: carData.branch || "Tirupati Central Hub",
        location: carData.location || "Tirupati",
        gpsEnabled: carData.gpsEnabled !== undefined ? carData.gpsEnabled : true,
        fastagNumber: carData.fastagNumber || "",
        insuranceExpiry: carData.insuranceExpiry || "",
        pollutionExpiry: carData.pollutionExpiry || "",
        fitnessExpiry: carData.fitnessExpiry || "",
        permitExpiry: carData.permitExpiry || "",
        image: primaryImg,
        galleryImages: Array.isArray(carData.galleryImages) && carData.galleryImages.length > 0
          ? carData.galleryImages
          : (primaryImg ? [primaryImg] : []),
        angle360Images: Array.isArray(carData.angle360Images) && carData.angle360Images.length > 0
          ? carData.angle360Images
          : (primaryImg ? [primaryImg] : []),
        totalTrips: 0,
        totalRevenue: 0,
        maintenanceCost: 0,
        lastServiceKm: 0,
        nextServiceKm: 10000,
        oilChangeStatus: "Good",
        tyreHealth: "Excellent",
        batteryHealth: "Good",
      };
      setFleet((prev) => [newCar, ...prev]);
      setNotice({ type: "success", text: `Vehicle "${newCar.name}" added to live fleet!` });
      adminApi.createCar(newCar).then((saved) => {
        if (saved && (saved as any).id) {
          setFleet((prev) => prev.map((c) => (c.id === newCar.id ? { ...c, id: (saved as any).id } : c)));
        }
      });
    }
    setIsAddCarModalOpen(false);
    setEditingCar(null);
  };

  const handleDeleteCar = async (id: number) => {
    if (confirm("Are you sure you want to delete this vehicle from the fleet?")) {
      setFleet((prev) => prev.filter((c) => c.id !== id));
      setNotice({ type: "info", text: `Vehicle #${id} removed from fleet.` });
      const ok = await adminApi.deleteCar(id);
      if (!ok) {
        setNotice({ type: "error", text: `Failed to delete vehicle #${id} from database. Please refresh.` });
      }
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

  const handleBulkDelete = async () => {
    if (confirm(`Delete all ${selectedCarIds.length} selected vehicle(s)?`)) {
      const idsToDelete = [...selectedCarIds];
      setFleet((prev) => prev.filter((c) => !idsToDelete.includes(c.id)));
      setSelectedCarIds([]);
      setNotice({ type: "info", text: `Deleted ${idsToDelete.length} vehicle(s).` });
      await Promise.all(idsToDelete.map((id) => adminApi.deleteCar(id)));
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

  const handleDeleteBooking = async (id: number) => {
    if (confirm("Are you sure you want to cancel and remove this booking?")) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setNotice({ type: "info", text: `Booking #${id} removed.` });
      const ok = await adminApi.deleteBooking(id);
      if (!ok) {
        setNotice({ type: "error", text: `Failed to remove booking #${id} from database. Please refresh.` });
      }
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
    try {
      sessionStorage.removeItem("moar_admin_authenticated");
      sessionStorage.removeItem("moar_admin_user");
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <AdminOtpLogin
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
        onNavigateHome={() => onNavigate("/")}
      />
    );
  }

  // ----------------------------------------------------------------------
  return (
    <div className={`min-h-screen flex font-sans antialiased transition-colors duration-200 ${isDark ? "admin-dark dark bg-[#070e1c] text-slate-100" : "admin-light bg-[#f8fafc] text-slate-900"}`}>
      {/* SIDEBAR NAVIGATION */}
      <aside className={`w-72 border-r flex flex-col shrink-0 z-40 h-screen sticky top-0 transition-colors duration-200 ${isDark ? "bg-[#070e1c] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"}`}>
        <div className={`p-6 border-b flex items-center justify-between transition-colors ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c88d18] to-[#d49b29] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25">M</div>
            <div>
              <h1 className={`text-base font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>MOAR <span className="text-[#c88d18]">CARS</span></h1>
              <p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Enterprise Suite</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {/* 1. CORE OPERATIONS */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Core Operations</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><BarChart3 className="w-4 h-4" /> Executive Dashboard</div>
              </button>

              <button
                onClick={() => setActiveTab("fleet")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "fleet"
                    ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><Car className="w-4 h-4" /> Fleet Management</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-[#c88d18] border border-slate-800">{fleet.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "bookings"
                    ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><Calendar className="w-4 h-4" /> Bookings & Dispatch</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-[#c88d18] border border-slate-800">{bookings.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("branches")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "branches" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><Building2 className="w-4 h-4" /> Station Hubs</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-[#c88d18] border border-slate-800">{branches.length}</span>
              </button>
            </nav>
          </div>

          {/* 2. PEOPLE & CRM */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">People & CRM</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("customers")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "customers" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><Users className="w-4 h-4" /> Customer CRM</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-emerald-400 border border-slate-800">{customers.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("drivers")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "drivers" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><Award className="w-4 h-4" /> Driver Roster</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-blue-400 border border-slate-800">{drivers.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "reviews" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><Star className="w-4 h-4" /> Customer Reviews</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-[#c88d18] border border-slate-800">{reviews.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("support")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "support" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><Headphones className="w-4 h-4" /> Support & Live Chat</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-red-400 border border-slate-800">
                  {tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length}
                </span>
              </button>
            </nav>
          </div>

          {/* 3. FINANCE & GROWTH */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Finance & Analytics</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("payments")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "payments" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><CreditCard className="w-4 h-4" /> Payments & Escrow</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-emerald-400 border border-slate-800">₹5.98L</span>
              </button>
              <button
                onClick={() => setActiveTab("coupons")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "coupons" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><Tag className="w-4 h-4" /> Coupon Engine</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-[#c88d18] border border-slate-800">{coupons.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "reports" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <TrendingUp className="w-4 h-4" /> Analytics & Reports
              </button>
            </nav>
          </div>

          {/* 4. CMS & MARKETING */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">CMS & Marketing</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("cms")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "cms" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><LayoutTemplate className="w-4 h-4" /> CMS & Page Builder</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-[#c88d18] border border-slate-800">13</span>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "notifications" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><Bell className="w-4 h-4" /> Notifications & Alerts</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-[#c88d18] border border-slate-800">{templates.length}</span>
              </button>
            </nav>
          </div>

          {/* 5. SECURITY & GOVERNANCE */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Security & Governance</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "settings" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Settings className="w-4 h-4" /> System Settings & APIs
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "security" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Security & 2FA Center
              </button>
              <button
                onClick={() => setActiveTab("logs")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "logs" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3"><History className="w-4 h-4" /> Activity Audit Logs</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-slate-400 border border-slate-800">{activityLogs.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("roles")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "roles" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Shield className="w-4 h-4" /> Roles & RBAC Matrix
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "sessions" ? "bg-[#c88d18]/20 text-[#c88d18] border border-amber-400/30 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Smartphone className="w-4 h-4" /> Active Devices & Sessions
              </button>
            </nav>
          </div>
        </div>

        <div className={`p-4 border-t flex items-center justify-between transition-colors ${isDark ? "border-slate-800 bg-[#0b1426]/80 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`}>
          <div className="truncate">
            <p className="text-xs font-bold truncate">{currentUser.username}</p>
            <p className="text-[10px] text-emerald-500 font-bold">All Modules Active</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all ${
                isDark ? "text-slate-400 hover:text-amber-400 hover:bg-slate-800/60" : "text-slate-600 hover:text-amber-600 hover:bg-slate-200/70"
              }`}
              title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#c88d18]" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* TOP HEADER */}
        <header className={`h-20 border-b px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl transition-colors ${isDark ? "border-slate-800 bg-[#070e1c]/95 text-white" : "border-slate-200 bg-white/95 text-slate-900 shadow-sm"}`}>
          <div className="relative w-96">
            <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
            <input
              type="text"
              placeholder="Search vehicles, registration, customer, booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-xl py-2 pl-10 pr-4 text-xs transition-colors focus:outline-none focus:border-[#c88d18] ${
                isDark
                  ? "bg-[#070e1c] border-slate-800 text-white placeholder:text-slate-400"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
              }`}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Dark & White Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-sm ${
                isDark
                  ? "bg-[#0b1426] border-slate-800 text-amber-300 hover:border-amber-400/40 hover:text-white"
                  : "bg-white border-slate-200 text-slate-800 hover:border-amber-500/50 hover:text-[#c88d18]"
              }`}
              title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-[#c88d18]" />
                  <span className="hidden md:inline font-bold">Light Theme</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden md:inline font-bold">Dark Theme</span>
                </>
              )}
            </button>

            {activeTab === "fleet" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBulkCsvModalOpen(true)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border font-bold text-xs transition-colors ${
                    isDark
                      ? "bg-[#0b1426] border-slate-800 text-slate-300 hover:text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-[#c88d18]" /> Bulk CSV Upload
                </button>
                <button
                  onClick={() => {
                    setEditingCar(null);
                    setIsAddCarModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#c88d18] to-[#d49b29] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" /> Add Vehicle
                </button>
              </div>
            ) : activeTab === "coupons" ? (
              <button
                onClick={() => {
                  setActiveTab("coupons");
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#c88d18] to-[#d49b29] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                <Tag className="w-4 h-4" /> Manage Coupons
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingBooking(null);
                  setIsCreateBookingModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#c88d18] to-[#d49b29] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" /> Create Reservation
              </button>
            )}

            <button
              onClick={() => onNavigate("/")}
              className={`p-2.5 rounded-xl border transition-colors ${
                isDark
                  ? "bg-[#0b1426] border-slate-800 text-slate-300 hover:text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
              }`}
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
                  : "bg-[#c88d18]/15 border-slate-800 text-slate-400"
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-[#c88d18]" /> Executive Performance Dashboard
                </h2>
                <p className="text-xs text-slate-400 mt-1">
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
              <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400">Total Cars</span>
                  <Car className="w-4 h-4 text-[#c88d18]" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-white">{stats.totalCars}</h3>
                <p className="text-[10px] text-slate-400 mt-1">100% Active Fleet</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400">Available Ready</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-emerald-400">{stats.availableCars}</h3>
                <p className="text-[10px] text-emerald-400/80 mt-1">Ready for instant dispatch</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400">Active Bookings</span>
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-blue-300">{stats.activeBookings}</h3>
                <p className="text-[10px] text-blue-400/80 mt-1">On road across stations</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400">Pending Inquiries</span>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-amber-300">{stats.pendingBookings}</h3>
                <p className="text-[10px] text-amber-400/80 mt-1">Requires driver allocation</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400">Today Pickups</span>
                  <Send className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-slate-300">{stats.todayPickups}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Scheduled Handover</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400">Today Returns</span>
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-slate-300">{stats.todayReturns}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Damage Inspection Pending</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400">Revenue Today</span>
                  <DollarSign className="w-4 h-4 text-[#c88d18]" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-[#c88d18]">₹{stats.revenueToday.toLocaleString()}</h3>
                <p className="text-[10px] text-emerald-400 mt-1">+14.2% vs yesterday</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400">Revenue Month</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-emerald-400">₹{stats.revenueMonth.toLocaleString()}</h3>
                <p className="text-[10px] text-slate-400 mt-1">+28.5% YoY Growth</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400">Cancelled Trips</span>
                  <XCircle className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-red-300">{stats.cancelledBookings}</h3>
                <p className="text-[10px] text-slate-400 mt-1">0 Refunds Processed</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400">Fleet Utilization</span>
                  <Activity className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-2xl font-black mt-2 text-amber-300">{stats.utilizationRate}%</h3>
                <p className="text-[10px] text-slate-400 mt-1">High Demand Ratio</p>
              </div>
            </div>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-black text-sm text-white">Booking & Revenue Velocity Trend</h4>
                    <p className="text-[11px] text-slate-400">Monthly booking volume and Gross Rental Value</p>
                  </div>
                  <span className="text-xs font-mono text-[#c88d18]">Year-to-Date 2026</span>
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
                          <stop offset="5%" stopColor="#c88d18" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#c88d18" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#94a3b8" textAnchor="end" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#0b1426", borderColor: "rgba(200, 141, 24, 0.3)", color: "#fff", borderRadius: "12px" }} />
                      <Area type="monotone" dataKey="revenue" stroke="#c88d18" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-2xl">
                <h4 className="font-black text-sm text-white mb-1">Station Hub Utilization</h4>
                <p className="text-[11px] text-slate-400 mb-4">Booking share per pickup hub</p>
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
                        <Cell fill="#c88d18" />
                        <Cell fill="#3B82F6" />
                        <Cell fill="#10B981" />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#0b1426", borderColor: "rgba(200, 141, 24, 0.3)", color: "#fff", borderRadius: "12px" }} />
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-2">
                  <Car className="w-6 h-6 text-[#c88d18]" /> Fleet Management & Telematics Hub
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage unlimited fleet vehicles, tiered rates, compliance countdowns, 360° gallery, and availability surge
                </p>
              </div>

              <div className="flex flex-wrap bg-[#070e1c] p-1.5 rounded-2xl border border-slate-800 gap-1">
                <button
                  onClick={() => setFleetSubTab("roster")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    fleetSubTab === "roster" ? "bg-[#c88d18] text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" /> Vehicles Roster ({fleet.length})
                </button>
                <button
                  onClick={() => setFleetSubTab("categories")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    fleetSubTab === "categories" ? "bg-[#c88d18] text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" /> Categories & Filters ({categories.length})
                </button>
                <button
                  onClick={() => setFleetSubTab("calendar")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    fleetSubTab === "calendar" ? "bg-[#c88d18] text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" /> Availability & Surge
                </button>
                <button
                  onClick={() => setFleetSubTab("maintenance")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    fleetSubTab === "maintenance" ? "bg-[#c88d18] text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" /> Maintenance & Expiries
                </button>
                <button
                  onClick={() => setFleetSubTab("analytics")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    fleetSubTab === "analytics" ? "bg-[#c88d18] text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Fleet Analytics & Heatmap
                </button>
              </div>
            </div>

            {fleetSubTab === "categories" && (
              <CategoryManagement
                categories={categories}
                setCategories={setCategories}
                fleet={fleet}
                setNotice={setNotice}
              />
            )}

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
                              ? "bg-[#c88d18] text-slate-950 font-black shadow-md"
                              : "bg-[#0b1426]/60 text-slate-400 border border-slate-800 hover:text-white"
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
                    className="px-3.5 py-1.5 rounded-xl bg-[#070e1c] border border-slate-800 text-[#c88d18] text-xs font-bold focus:outline-none"
                  >
                    <option value="all">All Categories ({categories.length})</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCarIds.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[#c88d18]"></span>
                      <span className="text-xs font-bold text-white">
                        {selectedCarIds.length} Vehicle(s) Selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) => handleBulkStatusChange(e.target.value as CarStatus)}
                        className="px-3 py-1.5 rounded-xl bg-[#070e1c] border border-slate-800 text-xs font-bold text-[#c88d18]"
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

                <div className="rounded-3xl border border-slate-800 bg-[#0b1426]/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#070e1c] text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedCarIds.length === filteredFleet.length && filteredFleet.length > 0}
                            onChange={handleToggleSelectAll}
                            className="accent-[#c88d18] w-4 h-4 rounded"
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
                    <tbody className="divide-y divide-slate-800">
                      {filteredFleet.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-800/60 transition-colors">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedCarIds.includes(c.id)}
                              onChange={() => handleToggleSelectCar(c.id)}
                              className="accent-[#c88d18] w-4 h-4 rounded"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={c.image}
                                alt={c.name}
                                className="w-12 h-10 object-cover rounded-xl border border-slate-800"
                              />
                              <div>
                                <p className="font-bold text-white">{c.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{c.registrationNumber}</p>
                                <p className="text-[9px] text-slate-400 font-mono truncate max-w-[140px]">VIN: {c.vinNumber}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-900 border border-slate-800 text-slate-300">
                              {c.category}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-1">{c.fuelType} &bull; {c.transmission}</p>
                            <p className="text-[10px] text-slate-400">{c.seats} Seats &bull; {c.mileage}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-black text-emerald-400 text-sm">{c.price}/day</p>
                            <p className="text-[10px] text-slate-400">₹{c.pricePerHour}/hr &bull; ₹{c.pricePerWeek}/wk</p>
                            <p className="text-[9px] text-[#c88d18]">Dep: ₹{c.securityDeposit}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-bold text-white flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#c88d18]" /> {c.branch}
                            </p>
                            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                              <Navigation className="w-2.5 h-2.5" /> GPS Active ({c.fastagNumber})
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-0.5 text-[10px]">
                              <p className="text-slate-400">Ins: <span className="text-white font-mono">{c.insuranceExpiry}</span></p>
                              <p className="text-slate-400">PUC: <span className="text-white font-mono">{c.pollutionExpiry}</span></p>
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
                                  : "bg-[#c88d18]/15 text-slate-400 border-slate-800"
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
                              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#c88d18]/20 text-[#c88d18] border border-slate-800"
                              title="View 360° Interactive Angle"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingCar(c);
                                setIsAddCarModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#c88d18]/20 text-slate-300 border border-slate-800"
                              title="Edit Vehicle"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateCar(c)}
                              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#c88d18]/20 text-amber-300 border border-slate-800"
                              title="Duplicate Vehicle"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleArchiveCar(c)}
                              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#c88d18]/20 text-slate-400 border border-slate-800"
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
                <div className="p-6 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div>
                      <h4 className="font-black text-sm text-white">Fleet Availability & Dynamic Surge Calendar</h4>
                      <p className="text-[11px] text-slate-400">September 2026 &bull; Automatic Weekend (+20%) & Pilgrimage Surge Pricing Active</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">🟢 Available</span>
                      <span className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">🔵 Booked</span>
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">🟡 Weekend (+20%)</span>
                      <span className="px-3 py-1 rounded-xl bg-[#c88d18]/15 text-[#c88d18] border border-amber-400/30 text-xs font-bold">🟣 Festival Peak</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-3">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                      <div key={d} className="text-center text-xs font-bold text-slate-400 py-1 uppercase">{d}</div>
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
                              ? "bg-slate-800/60 border-amber-500/40 shadow-lg shadow-amber-500/10"
                              : isWeekend
                              ? "bg-amber-900/20 border-amber-500/30"
                              : "bg-[#070e1c] border-slate-800 hover:border-[#c88d18]"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-xs text-white">Sep {day}</span>
                            {isFestival && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#c88d18] text-slate-950 font-black">SURGE</span>}
                          </div>
                          <p className="text-[10px] text-slate-400">
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
                <div className="p-6 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-4">
                  <h4 className="font-black text-sm text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#c88d18]" /> Mechanical Health & Service Reminders
                  </h4>
                  <div className="space-y-3 text-xs">
                    {fleet.map((c) => (
                      <div key={c.id} className="p-3.5 rounded-2xl bg-[#070e1c] border border-slate-800 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{c.name} ({c.registrationNumber})</p>
                          <p className="text-[10px] text-slate-400">Next Service at {c.nextServiceKm.toLocaleString()} km &bull; Last: {c.lastServiceKm.toLocaleString()} km</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.oilChangeStatus === "Overdue" ? "bg-red-500/20 text-red-300" : c.oilChangeStatus === "Due Soon" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
                          }`}>
                            Oil: {c.oilChangeStatus}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1">Tyres: {c.tyreHealth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-4">
                  <h4 className="font-black text-sm text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" /> Statutory Document Expiry Monitor
                  </h4>
                  <div className="space-y-3 text-xs">
                    {fleet.map((c) => (
                      <div key={c.id} className="p-3.5 rounded-2xl bg-[#070e1c] border border-slate-800 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{c.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">PUC: {c.pollutionExpiry} &bull; Ins: {c.insuranceExpiry}</p>
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
                  <div className="p-5 rounded-3xl bg-[#0b1426]/60 border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold block">Most Booked Car</span>
                    <h4 className="text-lg font-black text-white mt-1">Mahindra Scorpio-N</h4>
                    <p className="text-[10px] text-[#c88d18] mt-0.5">48 Successful Trips</p>
                  </div>
                  <div className="p-5 rounded-3xl bg-[#0b1426]/60 border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold block">Highest Grossing</span>
                    <h4 className="text-lg font-black text-emerald-400 mt-1">₹1,19,952</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Scorpio-N Z8L</p>
                  </div>
                  <div className="p-5 rounded-3xl bg-[#0b1426]/60 border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold block">Idle Vehicles</span>
                    <h4 className="text-lg font-black text-amber-300 mt-1">1 Car</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Available for dispatch</p>
                  </div>
                  <div className="p-5 rounded-3xl bg-[#0b1426]/60 border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold block">Maintenance ROI</span>
                    <h4 className="text-lg font-black text-slate-300 mt-1">₹36,700 Total</h4>
                    <p className="text-[10px] text-emerald-400 mt-0.5">9.2% of Gross Rental</p>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-2xl">
                  <h4 className="font-black text-sm text-white mb-1">Booking Demand Heatmap (Day of Week vs Time Slot)</h4>
                  <p className="text-[11px] text-slate-400 mb-4">Darker gold squares represent peak booking velocity hours</p>
                  <div className="grid grid-cols-7 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dIdx) => (
                      <div key={day} className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase text-center block">{day}</span>
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-[#c88d18]" /> Enterprise Bookings & Dispatch Suite
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage live trips, 9 booking categories, chauffeur allocation, damage audit, and rental contracts
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={bookingFilterType}
                  onChange={(e) => setBookingFilterType(e.target.value)}
                  className="px-4 py-2 rounded-2xl bg-[#070e1c] border border-slate-800 text-[#c88d18] text-xs font-bold focus:outline-none"
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
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#c88d18] to-[#d49b29] text-slate-950 font-black text-xs"
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
                      ? "bg-[#c88d18] text-slate-950 font-black shadow-md"
                      : "bg-[#0b1426]/60 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Bookings Table */}
            <div className="rounded-3xl border border-slate-800 bg-[#0b1426]/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#070e1c] text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
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
                <tbody className="divide-y divide-slate-800">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="px-4 py-4 font-mono font-bold text-[#c88d18]">#{b.id}</td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-300">
                          {b.bookingType}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-white">{b.customerName}</p>
                        <p className="text-[10px] text-slate-400">{b.customerPhone}</p>
                        <p className="text-[10px] text-slate-400/80">{b.customerEmail}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold flex items-center gap-1.5 text-white">
                          <Car className="w-3.5 h-3.5 text-[#c88d18]" /> {b.carName}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Driver: <span className="font-semibold text-emerald-400">{b.driverName || "Self Driven"}</span>
                        </p>
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        <p className="font-bold">{b.startDate} ➔ {b.endDate}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{b.pickupAddress}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-black text-emerald-400 text-sm">₹{Number(b.grandTotal || b.amount || 0).toLocaleString()}</p>
                        <div className="text-[10px] space-y-0.5 mt-0.5">
                          <p className="text-emerald-400/90 font-medium">
                            Paid: ₹{Number(b.paidAmount !== undefined ? b.paidAmount : (b.grandTotal || b.amount || 0)).toLocaleString()}
                          </p>
                          {Number(b.balanceDue || 0) > 0 ? (
                            <p className="text-amber-400 font-bold">
                              Due: ₹{Number(b.balanceDue).toLocaleString()}
                            </p>
                          ) : (
                            <p className="text-slate-500 font-medium">Full Paid</p>
                          )}
                          <p className="text-slate-500">Dep: ₹{b.securityDeposit || 0}</p>
                        </div>
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
                              ? "bg-[#c88d18]/15 text-slate-400 border-slate-800"
                              : b.status === "Pending"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-red-500/20 text-red-300 border-red-500/40"
                          }`}
                        >
                          <option value="Pending" className="bg-[#070e1c] text-white">Pending</option>
                          <option value="Confirmed" className="bg-[#070e1c] text-white">Confirmed</option>
                          <option value="Assigned Driver" className="bg-[#070e1c] text-white">Assigned Driver</option>
                          <option value="Vehicle Ready" className="bg-[#070e1c] text-white">Vehicle Ready</option>
                          <option value="Pickup Started" className="bg-[#070e1c] text-white">Pickup Started</option>
                          <option value="Ongoing Trip" className="bg-[#070e1c] text-white">Ongoing Trip</option>
                          <option value="Trip Completed" className="bg-[#070e1c] text-white">Trip Completed</option>
                          <option value="Returned" className="bg-[#070e1c] text-white">Returned</option>
                          <option value="Cancelled" className="bg-[#070e1c] text-white">Cancelled</option>
                          <option value="Refunded" className="bg-[#070e1c] text-white">Refunded</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingBooking(b);
                            setIsCreateBookingModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#c88d18]/20 text-slate-300 border border-slate-800"
                          title="Modify / Edit Booking"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("assign_driver");
                          }}
                          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#c88d18]/20 text-emerald-300 border border-slate-800"
                          title="Assign Chauffeur & Delivery Staff"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("timeline");
                          }}
                          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#c88d18]/20 text-[#c88d18] border border-slate-800"
                          title="Live 8-Step Journey Timeline"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("inspection");
                          }}
                          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#c88d18]/20 text-emerald-300 border border-slate-800"
                          title="Pre & Post Damage Inspection"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("reschedule");
                          }}
                          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#c88d18]/20 text-slate-300 border border-slate-800"
                          title="Reschedule Dates"
                        >
                          <CalendarDays className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("upgrade");
                          }}
                          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#c88d18]/20 text-amber-300 border border-slate-800"
                          title="1-Click Car Upgrade"
                        >
                          <Zap className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("invoice");
                          }}
                          className="p-1.5 rounded-lg bg-[#c88d18]/20 text-[#c88d18] font-bold"
                          title="Generate & Print GST Invoice"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setActiveBookingModal("agreement");
                          }}
                          className="p-1.5 rounded-lg bg-[#c88d18]/20 text-slate-300 font-bold"
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
            bookings={bookings}
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
            fleet={fleet}
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
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#c88d18]" /> {editingCar ? `Edit Vehicle: ${editingCar.name}` : "Add New Fleet Vehicle"}
                </h3>
                <p className="text-xs text-slate-400">Complete 30+ attribute registration</p>
              </div>
              <button onClick={() => setIsAddCarModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex bg-[#070e1c] p-1 rounded-xl border border-slate-800 text-xs">
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
                    activeCarModalTab === tb.id ? "bg-[#c88d18] text-slate-950 font-black shadow-md" : "text-slate-400"
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
                const brand = form.brand?.value?.trim() || "";
                const model = form.model?.value?.trim() || "";
                const variant = form.variant?.value?.trim() || "";
                const name = `${brand} ${model} ${variant}`.trim() || "Fleet Vehicle";
                const pricePerDay = parseInt(form.pricePerDay?.value) || 0;

                const primaryImage = form.image?.value?.trim() || "";
                const galleryRaw = form.galleryImages?.value?.trim() || "";
                let galleryImagesList: string[] = [];
                if (galleryRaw) {
                  galleryImagesList = galleryRaw.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean);
                }
                if (primaryImage && !galleryImagesList.includes(primaryImage)) {
                  galleryImagesList = [primaryImage, ...galleryImagesList];
                }

                handleSaveCar({
                  brand,
                  model,
                  variant,
                  name,
                  year: parseInt(form.year?.value) || new Date().getFullYear(),
                  registrationNumber: form.registrationNumber?.value?.trim() || "",
                  vinNumber: form.vinNumber?.value?.trim() || "",
                  fuelType: form.fuelType?.value || "Petrol",
                  transmission: form.transmission?.value || "Manual",
                  seats: parseInt(form.seats?.value) || 5,
                  mileage: form.mileage?.value?.trim() || "20 km/l",
                  color: form.color?.value?.trim() || "White",
                  category: form.category?.value || (categories[0]?.name || "Hatchback"),
                  pricePerHour: parseInt(form.pricePerHour?.value) || (pricePerDay > 0 ? Math.round(pricePerDay / 10) : 0),
                  pricePerDay,
                  price: pricePerDay > 0 ? `₹${pricePerDay.toLocaleString("en-IN")}/day` : "₹0/day",
                  pricePerWeek: parseInt(form.pricePerWeek?.value) || (pricePerDay * 6),
                  pricePerMonth: parseInt(form.pricePerMonth?.value) || (pricePerDay * 22),
                  securityDeposit: parseInt(form.securityDeposit?.value) || 0,
                  advancePaymentPercent: form.advancePaymentPercent?.value ? parseInt(form.advancePaymentPercent.value) : undefined,
                  lateFeePerHour: parseInt(form.lateFeePerHour?.value) || 0,
                  status: form.status?.value || "Available",
                  branch: form.branch?.value || "Tirupati Central Hub",
                  location: form.location?.value || "Tirupati",
                  fastagNumber: form.fastagNumber?.value?.trim() || "",
                  insuranceExpiry: form.insuranceExpiry?.value || "",
                  pollutionExpiry: form.pollutionExpiry?.value || "",
                  fitnessExpiry: form.fitnessExpiry?.value || "",
                  permitExpiry: form.permitExpiry?.value || "",
                  image: primaryImage || (galleryImagesList[0] || ""),
                  galleryImages: galleryImagesList.length > 0 ? galleryImagesList : (primaryImage ? [primaryImage] : []),
                });
              }}
              className="space-y-4 text-xs"
            >
              {activeCarModalTab === "specs" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Brand *</label>
                      <input
                        name="brand"
                        defaultValue={editingCar?.brand || ""}
                        placeholder="e.g. Maruti Suzuki / Hyundai / Toyota"
                        required
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Model *</label>
                      <input
                        name="model"
                        defaultValue={editingCar?.model || ""}
                        placeholder="e.g. Swift / Creta / Innova"
                        required
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Variant</label>
                      <input
                        name="variant"
                        defaultValue={editingCar?.variant || ""}
                        placeholder="e.g. ZXi Plus / SX(O)"
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Reg Number *</label>
                      <input
                        name="registrationNumber"
                        defaultValue={editingCar?.registrationNumber || ""}
                        placeholder="e.g. AP 03 TX 1024"
                        required
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white uppercase font-mono placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">VIN / Chassis No</label>
                      <input
                        name="vinNumber"
                        defaultValue={editingCar?.vinNumber || ""}
                        placeholder="e.g. MA3EYD21S00192844"
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Year</label>
                      <input
                        name="year"
                        type="number"
                        defaultValue={editingCar?.year || ""}
                        placeholder="e.g. 2024"
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-400 font-bold">Category *</label>
                        <button
                          type="button"
                          onClick={() => {
                            const newCatName = window.prompt("Enter new category name (e.g. 7-Seater, Convertible, Luxury SUV):");
                            if (newCatName && newCatName.trim()) {
                              const trimmed = newCatName.trim();
                              if (!categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
                                const newCatItem: CategoryItem = {
                                  id: Math.floor(100 + Math.random() * 900),
                                  name: trimmed,
                                  description: `${trimmed} fleet segment`,
                                  icon: "Car",
                                  displayOrder: categories.length + 1,
                                  isActive: true,
                                };
                                setCategories((prev) => [...prev, newCatItem]);
                                adminApi.createCategory(newCatItem);
                                setNotice({ type: "success", text: `Category "${trimmed}" created & ready!` });
                              }
                            }
                          }}
                          className="text-[10px] text-[#c88d18] hover:underline font-bold flex items-center gap-0.5"
                          title="Quick create new category"
                        >
                          <Plus className="w-3 h-3" /> New
                        </button>
                      </div>
                      <select
                        name="category"
                        defaultValue={editingCar?.category || categories[0]?.name || "Hatchback"}
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c88d18]"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                        {editingCar?.category && !categories.some((c) => c.name === editingCar.category) && (
                          <option value={editingCar.category}>{editingCar.category}</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Fuel Type</label>
                      <select name="fuelType" defaultValue={editingCar?.fuelType || "Petrol"} className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white">
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="CNG">CNG</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Transmission</label>
                      <select name="transmission" defaultValue={editingCar?.transmission || "Manual"} className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white">
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Seats</label>
                      <input
                        name="seats"
                        type="number"
                        defaultValue={editingCar?.seats || ""}
                        placeholder="e.g. 5"
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeCarModalTab === "pricing" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Price Per Day (₹) *</label>
                      <input
                        name="pricePerDay"
                        type="number"
                        defaultValue={editingCar?.pricePerDay || ""}
                        placeholder="e.g. 1999"
                        required
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-bold text-sm placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Price Per Hour (₹)</label>
                      <input
                        name="pricePerHour"
                        type="number"
                        defaultValue={editingCar?.pricePerHour || ""}
                        placeholder="e.g. 199"
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Price Per Week (₹)</label>
                      <input
                        name="pricePerWeek"
                        type="number"
                        defaultValue={editingCar?.pricePerWeek || ""}
                        placeholder="e.g. 9999"
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Security Deposit (₹)</label>
                      <input
                        name="securityDeposit"
                        type="number"
                        defaultValue={editingCar?.securityDeposit || ""}
                        placeholder="e.g. 3000"
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-[#c88d18] font-bold placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Late Fee / Hr (₹)</label>
                      <input
                        name="lateFeePerHour"
                        type="number"
                        defaultValue={editingCar?.lateFeePerHour || ""}
                        placeholder="e.g. 150"
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Initial Status</label>
                      <select name="status" defaultValue={editingCar?.status || "Available"} className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white">
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="In Maintenance">In Maintenance</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Reserved">Reserved</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Online Advance Payment (%)</label>
                      <input
                        name="advancePaymentPercent"
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={editingCar?.advancePaymentPercent || ""}
                        placeholder="e.g. 30 (Leave blank for global setting)"
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Overrides global advance % setting for this vehicle.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeCarModalTab === "compliance" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Branch / Station Hub</label>
                      <select name="branch" defaultValue={editingCar?.branch || "Tirupati Central Hub"} className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white">
                        <option value="Tirupati Central Hub">Tirupati Central Hub</option>
                        <option value="Renigunta Airport Hub">Renigunta Airport Hub</option>
                        <option value="Chandragiri Heritage Point">Chandragiri Heritage Point</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">FASTag Number</label>
                      <input
                        name="fastagNumber"
                        defaultValue={editingCar?.fastagNumber || ""}
                        placeholder="e.g. FTG-889021-39"
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Insurance Expiry Date</label>
                      <input
                        name="insuranceExpiry"
                        type="date"
                        defaultValue={editingCar?.insuranceExpiry || ""}
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Pollution (PUC) Expiry</label>
                      <input
                        name="pollutionExpiry"
                        type="date"
                        defaultValue={editingCar?.pollutionExpiry || ""}
                        className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c88d18]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeCarModalTab === "media" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Primary Display Image URL *</label>
                    <input
                      name="image"
                      defaultValue={editingCar?.image || ""}
                      placeholder="e.g. https://your-domain.com/car.jpg or image URL"
                      className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Additional Gallery Photos (Optional - One URL per line)</label>
                    <textarea
                      name="galleryImages"
                      rows={4}
                      defaultValue={
                        Array.isArray(editingCar?.galleryImages)
                          ? editingCar.galleryImages.filter((img: string) => img !== editingCar?.image).join("\n")
                          : ""
                      }
                      placeholder="https://.../photo2.jpg&#10;https://.../photo3.jpg"
                      className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#c88d18]"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Leave empty if you only have 1 image. Only images you enter here will be saved and displayed.</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddCarModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black text-xs">
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
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-black flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#c88d18]" /> Bulk Upload Cars (CSV Importer)
              </h3>
              <button onClick={() => setIsBulkCsvModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste your CSV vehicle rows below. Format: <code className="text-[#c88d18]">Brand, Model, Variant, PricePerDay, RegNumber, Category</code>
            </p>

            <textarea
              rows={6}
              value={bulkCsvInput}
              onChange={(e) => setBulkCsvInput(e.target.value)}
              placeholder={`Brand, Model, Variant, PricePerDay, RegNumber, Category
Maruti Suzuki, Swift, ZXi+, 1699, AP 03 TX 1024, Hatchback
Mahindra, Scorpio-N, Z8L 4x4, 2499, AP 03 ZX 9900, SUV
Honda, City, ZX CVT, 2199, AP 03 DX 5088, Sedan`}
              className="w-full bg-[#070e1c] border border-slate-800 rounded-2xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#c88d18]"
            ></textarea>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() =>
                  setBulkCsvInput(
                    `Brand, Model, Variant, PricePerDay, RegNumber, Category\nMaruti Suzuki, Baleno, Alpha, 1799, AP 03 BX 1122, Hatchback\nTata, Harrier, Fearless+, 2699, AP 03 HX 8899, SUV\nHyundai, Verna, SX(O) Turbo, 2299, AP 03 VX 4455, Sedan`
                  )
                }
                className="text-[11px] text-[#c88d18] underline"
              >
                Insert Sample Template
              </button>
              <div className="flex gap-2">
                <button onClick={() => setIsBulkCsvModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs">
                  Cancel
                </button>
                <button onClick={handleBulkCsvImport} className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black text-xs">
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
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-4 text-center">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-black flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-[#c88d18]" /> 360° Studio Showcase: {viewing360Car.name}
              </h3>
              <button onClick={() => setViewing360Car(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-64 bg-slate-950 flex items-center justify-center">
              <img src={viewing360Car.image} alt="360" className="max-h-full object-contain" />
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
                {["Front (0°)", "Right (90°)", "Rear (180°)", "Left (270°)"].map((angle, idx) => (
                  <button
                    key={angle}
                    onClick={() => setAngle360Index(idx)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold ${
                      angle360Index === idx ? "bg-[#c88d18] text-slate-950 font-black" : "bg-[#070e1c]/80 text-slate-400"
                    }`}
                  >
                    {angle}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-400">Registration: <strong className="text-white">{viewing360Car.registrationNumber}</strong> &bull; {viewing360Car.color}</p>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 1: LIVE 8-STEP JOURNEY TIMELINE
          ==================================================================== */}
      {activeBookingModal === "timeline" && selectedBooking && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <History className="w-5 h-5 text-[#c88d18]" /> Booking #{selectedBooking.id} Live Journey Timeline
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedBooking.customerName} &bull; {selectedBooking.carName}</p>
              </div>
              <button onClick={() => setActiveBookingModal(null)} className="text-slate-400 hover:text-white">
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
                    item.done ? "bg-[#c88d18] text-slate-950 font-black shadow-md" : "bg-[#070e1c] text-slate-400 border border-slate-800"
                  }`}>
                    {item.done ? <Check className="w-4 h-4" /> : item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h5 className={`font-bold ${item.done ? "text-white" : "text-slate-400"}`}>{item.title}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveBookingModal(null)}
                className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black text-xs"
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
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[#c88d18]" /> Pre & Post Trip Damage Audit & Penalty Reconciler
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Booking #{selectedBooking.id} &bull; {selectedBooking.carName}</p>
              </div>
              <button onClick={() => setActiveBookingModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#070e1c] border border-slate-800">
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Pickup Odometer</span>
                <span className="text-sm font-bold text-white">{selectedBooking.startOdometer} km</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#070e1c] border border-slate-800">
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Return Odometer</span>
                <span className="text-sm font-bold text-emerald-400">{selectedBooking.returnOdometer} km (+250 km)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-[#c88d18] text-[11px] uppercase tracking-wider">6-Point Damage Checklist</h4>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                {["Front Bumper", "Rear Bumper", "Doors & Panels", "Windshield & Glass", "Cabin Upholstery", "Tyres & Rims"].map((chk) => (
                  <label key={chk} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer">
                    <input type="checkbox" className="accent-[#c88d18] w-3.5 h-3.5 rounded" />
                    <span className="truncate">{chk}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-[#c88d18]">Violation & Surcharge Ledger</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Fuel Deficit (Litres Missing)</label>
                  <input
                    type="number"
                    value={inspectionState.fuelDeficitLitres}
                    onChange={(e) => setInspectionState({ ...inspectionState, fuelDeficitLitres: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cleaning Charge (₹)</label>
                  <input
                    type="number"
                    value={inspectionState.cleaningFee}
                    onChange={(e) => setInspectionState({ ...inspectionState, cleaningFee: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Late Return (Hours @ ₹250/hr)</label>
                  <input
                    type="number"
                    value={inspectionState.lateHours}
                    onChange={(e) => setInspectionState({ ...inspectionState, lateHours: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Dent / Scratch Surcharge (₹)</label>
                  <input
                    type="number"
                    value={inspectionState.scratchDamageFee}
                    onChange={(e) => setInspectionState({ ...inspectionState, scratchDamageFee: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#070e1c] border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inspectionState.smokingViolation}
                  onChange={(e) => setInspectionState({ ...inspectionState, smokingViolation: e.target.checked })}
                  className="accent-[#c88d18] w-4 h-4 rounded"
                />
                <span className="font-bold text-red-300">Smoking Charge Violation (+₹2,500 Fine)</span>
              </label>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Security Deposit Held:</span>
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
              <div className="flex justify-between font-black text-sm text-[#c88d18] pt-1.5 border-t border-slate-800">
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
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplyInspectionPenalties(selectedBooking.id)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#c88d18] to-[#d49b29] text-slate-950 font-black text-xs"
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
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <h3 className="text-base font-black flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#c88d18]" /> Assign Chauffeur & Staff for Booking #{selectedBooking.id}
            </h3>
            <p className="text-xs text-slate-400">Allocate verified driver & delivery agent for trip</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Select Chauffeur</label>
                <select
                  value={driverAssignForm.driverName}
                  onChange={(e) => setDriverAssignForm({ ...driverAssignForm, driverName: e.target.value })}
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="Self Driven">Self Driven (Customer Drives)</option>
                  <option value="Suresh Kumar (+91 98765 00001)">Suresh Kumar (+91 98765 00001)</option>
                  <option value="Gopal Naidu (+91 98765 00002)">Gopal Naidu (+91 98765 00002)</option>
                  <option value="Srinivas (+91 98765 00003)">Srinivas (+91 98765 00003)</option>
                  <option value="Venkatesh (+91 98765 00004)">Venkatesh (+91 98765 00004)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Delivery & Handover Agent</label>
                <select
                  value={driverAssignForm.deliveryStaff}
                  onChange={(e) => setDriverAssignForm({ ...driverAssignForm, deliveryStaff: e.target.value })}
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Ravi Teja (Central Hub)">Ravi Teja (Central Hub)</option>
                  <option value="Kiran Reddy (Airport Hub)">Kiran Reddy (Airport Hub)</option>
                  <option value="Rajesh (Chandragiri Point)">Rajesh (Chandragiri Point)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setActiveBookingModal(null)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs">
                Cancel
              </button>
              <button
                onClick={() => handleAssignDriverSubmit(selectedBooking.id)}
                className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black text-xs"
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
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <h3 className="text-base font-black flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#c88d18]" /> Reschedule Booking #{selectedBooking.id}
            </h3>
            <p className="text-xs text-slate-400">Update pickup and return reservation dates</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">New Pickup Date</label>
                <input
                  type="date"
                  min={getTodayDateStr()}
                  max={getMaxBookingDateStr(2)}
                  value={rescheduleDates.startDate}
                  onChange={(e) => setRescheduleDates({ ...rescheduleDates, startDate: e.target.value })}
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">New Return Date</label>
                <input
                  type="date"
                  min={rescheduleDates.startDate || getTodayDateStr()}
                  max={getMaxBookingDateStr(2)}
                  value={rescheduleDates.endDate}
                  onChange={(e) => setRescheduleDates({ ...rescheduleDates, endDate: e.target.value })}
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setActiveBookingModal(null)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs">
                Cancel
              </button>
              <button
                onClick={() => handleApplyReschedule(selectedBooking.id)}
                className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black text-xs"
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
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <h3 className="text-base font-black flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#c88d18]" /> Upgrade Vehicle for Booking #{selectedBooking.id}
            </h3>
            <p className="text-xs text-slate-400">Current Vehicle: <strong className="text-white">{selectedBooking.carName}</strong></p>

            <div className="space-y-3 text-xs">
              <label className="block text-slate-400 font-bold">Select Higher Segment Vehicle</label>
              <select
                value={upgradeCarTarget}
                onChange={(e) => setUpgradeCarTarget(e.target.value)}
                className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-3 text-[#c88d18] font-bold"
              >
                {fleet.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.category}) - {c.price}/day
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setActiveBookingModal(null)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs">
                Cancel
              </button>
              <button
                onClick={() => handleApplyCarUpgrade(selectedBooking.id)}
                className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black text-xs"
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
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-xl p-8 shadow-2xl text-white space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#c88d18] text-slate-950 font-black flex items-center justify-center">M</div>
                <div>
                  <h3 className="text-base font-black">Moar Cars Tax Invoice</h3>
                  <p className="text-[10px] text-slate-400">GSTIN: 37AAAAA0000A1Z5 &bull; CIN: U50100AP2026PTC012345</p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#c88d18] font-bold">INV-2026-BK{selectedBooking.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Information</span>
                <p className="font-bold text-white">{selectedBooking.customerName}</p>
                <p className="text-slate-400">{selectedBooking.customerPhone}</p>
                <p className="text-slate-400">{selectedBooking.customerEmail}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Trip & Station Details</span>
                <p className="font-bold text-white">{selectedBooking.startDate} to {selectedBooking.endDate}</p>
                <p className="text-slate-400">{selectedBooking.pickup}</p>
                <p className="text-[#c88d18] font-bold">Category: {selectedBooking.bookingType}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Vehicle Rental ({selectedBooking.carName})</span>
                <span className="font-bold">₹{Number(selectedBooking.baseFare !== undefined ? selectedBooking.baseFare : selectedBooking.amount).toLocaleString()}</span>
              </div>
              {selectedBooking.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount Applied ({selectedBooking.couponCode || "Promo"})</span>
                  <span>-₹{Number(selectedBooking.discountAmount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>GST Tax ({selectedBooking.gstRate || 18}%)</span>
                <span>₹{Number(selectedBooking.gstAmount !== undefined ? selectedBooking.gstAmount : (selectedBooking.taxAmount || 0)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Refundable Security Deposit</span>
                <span>₹{Number(selectedBooking.securityDeposit || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-[#c88d18] pt-2 border-t border-slate-800">
                <span>Total Booking Value</span>
                <span>₹{Number(selectedBooking.grandTotal || (selectedBooking.amount + (selectedBooking.securityDeposit || 0))).toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 mt-1 text-[11px]">
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Advance Paid Online:</span>
                  <span>₹{Number(selectedBooking.paidAmount !== undefined ? selectedBooking.paidAmount : (selectedBooking.grandTotal || selectedBooking.amount || 0)).toLocaleString()}</span>
                </div>
                {Number(selectedBooking.balanceDue || 0) > 0 ? (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>Remaining Balance Due at Pickup:</span>
                    <span>₹{Number(selectedBooking.balanceDue).toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-slate-400">
                    <span>Balance Due:</span>
                    <span>₹0 (Full Paid)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveBookingModal(null)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs">
                Close
              </button>
              <button onClick={() => window.print()} className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black text-xs flex items-center gap-1.5">
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
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-xl p-8 shadow-2xl text-white space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-[#c88d18]" /> Self-Drive Legal Rental Agreement
              </h3>
              <button onClick={() => setActiveBookingModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300/90 leading-relaxed bg-[#070e1c] p-4 rounded-2xl border border-slate-800">
              <p><strong>Parties:</strong> This agreement is between Moar Cars Rental Services and <strong>{selectedBooking.customerName}</strong> ({selectedBooking.customerPhone}).</p>
              <p><strong>Vehicle:</strong> {selectedBooking.carName} under Booking ID #{selectedBooking.id}.</p>
              <p><strong>Duration:</strong> From {selectedBooking.startDate} to {selectedBooking.endDate}.</p>
              <p><strong>Key Terms & Liability:</strong></p>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-400">
                <li>Zero tolerance for commercial contraband, drunken driving, or smoking inside cabin (₹2,500 penalty).</li>
                <li>Renter must return vehicle with same fuel level as recorded at pickup.</li>
                <li>Comprehensive Insurance plan active with standard deductible terms.</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800 text-xs">
              <div>
                <p className="text-slate-400 text-[10px] uppercase">Renter Signature</p>
                <div className="h-12 border-b border-slate-800 mt-2 font-mono text-slate-400 flex items-end">
                  Digitally Acknowledged (OTP Verified)
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase">Authorized Signatory (Moar Cars)</p>
                <div className="h-12 border-b border-slate-800 mt-2 font-mono text-[#c88d18] flex items-end">
                  Moar Cars Executive Seal
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveBookingModal(null)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs">
                Close
              </button>
              <button onClick={() => window.print()} className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black text-xs flex items-center gap-1.5">
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
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-black flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#c88d18]" /> {editingBooking ? `Modify Booking #${editingBooking.id}` : "Create Enterprise Reservation"}
              </h3>
              <button onClick={() => setIsCreateBookingModalOpen(false)} className="text-slate-400 hover:text-white">
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
                  setBookings((prev) => [newB, ...prev]);
                  setNotice({ type: "success", text: `Reservation #${newB.id} created successfully!` });
                  adminApi.createBooking(newB).then((saved) => {
                    if (saved && (saved as any).id) {
                      setBookings((prev) => prev.map((b) => (b.id === newB.id ? { ...b, id: (saved as any).id } : b)));
                    }
                  });
                }

                setIsCreateBookingModalOpen(false);
                setEditingBooking(null);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Booking Category *</label>
                  <select name="bookingType" defaultValue={editingBooking?.bookingType || "Self Drive"} className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-[#c88d18] font-bold">
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
                  <label className="block text-slate-400 font-bold mb-1">Vehicle Selection *</label>
                  <select name="carName" defaultValue={editingBooking?.carName || fleet[0]?.name} className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white">
                    {fleet.map((c) => (
                      <option key={c.id} value={c.name}>{c.name} - {c.price}/day</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Customer Name *</label>
                  <input name="customerName" defaultValue={editingBooking?.customerName || ""} required placeholder="Ramesh Chandra" className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Phone Number *</label>
                  <input name="customerPhone" defaultValue={editingBooking?.customerPhone || ""} required placeholder="+91 98765 43210" className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Email</label>
                  <input name="customerEmail" defaultValue={editingBooking?.customerEmail || ""} placeholder="ramesh@gmail.com" className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Pickup Station / Hub</label>
                  <select name="pickup" defaultValue={editingBooking?.pickup || "Tirupati Central Hub"} className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white">
                    <option value="Tirupati Central Hub">Tirupati Central Hub</option>
                    <option value="Renigunta Airport Hub">Renigunta Airport Hub</option>
                    <option value="Chandragiri Heritage Point">Chandragiri Heritage Point</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Assigned Chauffeur</label>
                  <input name="driverName" defaultValue={editingBooking?.driverName || "Self Driven"} placeholder="Self Driven (or Chauffeur Name)" className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Pickup Date</label>
                  <input
                    name="startDate"
                    type="date"
                    min={getTodayDateStr()}
                    max={getMaxBookingDateStr(2)}
                    defaultValue={editingBooking?.startDate || getTodayDateStr()}
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Return Date</label>
                  <input
                    name="endDate"
                    type="date"
                    min={getTodayDateStr()}
                    max={getMaxBookingDateStr(2)}
                    defaultValue={editingBooking?.endDate || getFutureDateStr(2)}
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Exact Pickup Address</label>
                  <input name="pickupAddress" defaultValue={editingBooking?.pickupAddress || "Near Tirupati Railway Station"} className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Total Fare (₹) *</label>
                  <input name="amount" type="number" defaultValue={editingBooking?.amount || 4998} className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white font-bold text-emerald-400" />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Admin Notes / Instructions</label>
                <input name="notes" defaultValue={editingBooking?.notes || ""} placeholder="Special requirements, child seat, flight number..." className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsCreateBookingModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black text-xs">
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
