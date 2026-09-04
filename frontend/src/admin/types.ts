export type UserRole = "Super Admin" | "Admin" | "Manager" | "Staff";

export type BookingType =
  | "Self Drive"
  | "With Driver"
  | "Airport Pickup"
  | "Airport Drop"
  | "Outstation"
  | "Local Rental"
  | "Hourly Rental"
  | "Corporate Booking"
  | "Subscription Booking";

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Assigned Driver"
  | "Vehicle Ready"
  | "Pickup Started"
  | "Ongoing Trip"
  | "Trip Completed"
  | "Returned"
  | "Cancelled"
  | "Refunded";

export type CarStatus =
  | "Available"
  | "Booked"
  | "In Maintenance"
  | "Inactive"
  | "Reserved"
  | "Under Inspection"
  | "Sold";

export interface BookingItem {
  id: number;
  bookingType: BookingType;
  pickup: string;
  startDate: string;
  endDate: string;
  carName: string;
  status: BookingStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  driverName?: string;
  driverPhone?: string;
  deliveryStaff?: string;
  pickupAddress: string;
  dropAddress: string;
  duration: string;
  extras?: string[];
  insurancePlan: string;
  couponCode?: string;
  discountAmount: number;
  taxAmount: number;
  securityDeposit: number;
  amount: number;
  branch: string;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Refunded" | "Partial";
  bookingSource: string;
  notes?: string;
  startOdometer: number;
  returnOdometer: number;
  startFuel: number;
  returnFuel: number;
  penalties: number;
  timelineStep: number;
  createdAt?: string;
}

export interface CarItem {
  id: number;
  name: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  registrationNumber: string;
  vinNumber: string;
  detail: string;
  price: string;
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  securityDeposit: number;
  lateFeePerHour: number;
  tag: string;
  category: "Hatchback" | "Sedan" | "SUV" | "Luxury";
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid" | "CNG";
  transmission: "Manual" | "Automatic";
  seats: number;
  mileage: string;
  color: string;
  status: CarStatus;
  branch: string;
  location: string;
  gpsEnabled: boolean;
  fastagNumber: string;
  insuranceExpiry: string;
  pollutionExpiry: string;
  fitnessExpiry: string;
  permitExpiry: string;
  rcDocUrl?: string;
  insuranceDocUrl?: string;
  image: string;
  galleryImages: string[];
  angle360Images: string[];
  videoUrl?: string;
  totalTrips: number;
  totalRevenue: number;
  maintenanceCost: number;
  lastServiceKm: number;
  nextServiceKm: number;
  oilChangeStatus: "Good" | "Due Soon" | "Overdue";
  tyreHealth: "Excellent" | "Good" | "Replace Soon";
  batteryHealth: "Good" | "Check Required";
  isArchived?: boolean;
}

export interface CustomerItem {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  kycStatus: "Verified" | "Pending" | "Rejected";
  dlNumber: string;
  dlExpiry?: string;
  dlFrontDocUrl?: string;
  dlBackDocUrl?: string;
  aadhaarNumber: string;
  aadhaarFrontDocUrl?: string;
  aadhaarBackDocUrl?: string;
  passportNumber?: string;
  passportDocUrl?: string;
  walletBalance: number;
  loyaltyPoints: number;
  loyaltyTier?: "Silver" | "Gold" | "Platinum";
  referralCode: string;
  referredCount?: number;
  referralEarnings?: number;
  savedAddresses: string[];
  favoriteCars: string[];
  isBlacklisted: boolean;
  blacklistReason?: string;
  notes: string;
  totalBookings: number;
  totalSpent: number;
  joinedDate: string;
}

export interface DriverItem {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseDocUrl?: string;
  bgVerification: "Passed" | "Pending" | "Failed";
  bgDocUrl?: string;
  branch: string;
  status: "Available" | "On Trip" | "Off Duty" | "On Leave";
  liveLocation: string;
  todayTrips: number;
  totalTrips: number;
  earnings: number;
  rating: number;
  ratingCount: number;
  hillDrivingCertified?: boolean;
}

export interface BranchItem {
  id: number;
  name: string;
  city: string;
  state: string;
  address: string;
  operatingHours: string;
  managerName: string;
  managerPhone: string;
  managerEmail?: string;
  totalCars: number;
  staffCount: number;
  monthlyRevenue: number;
  isActive: boolean;
}

export interface PaymentItem {
  id: string;
  bookingId: number;
  customerName: string;
  amount: number;
  depositAmount: number;
  gateway: "UPI" | "Razorpay" | "Stripe" | "Cash" | "Wallet";
  status: "Captured" | "Pending" | "Refunded" | "Partial";
  advancePaid?: number;
  balanceDue?: number;
  gstAmount: number;
  cgstAmount?: number;
  sgstAmount?: number;
  tdsAmount: number;
  transactionId: string;
  date: string;
  refundStatus?: "N/A" | "Processed" | "Initiated";
  refundAmount?: number;
}

export interface CouponItem {
  id: number;
  code: string;
  type: "Flat Discount" | "Percentage Discount" | "Free Delivery" | "Weekend Offer" | "Festival Offer" | "Referral Coupon" | "Corporate Coupon";
  discountValue: number;
  isPercent: boolean;
  minBookingValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
}

export interface CMSBannerItem {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

export interface CMSOfferItem {
  id: number;
  title: string;
  tag: string;
  discountText: string;
  description: string;
  validTill: string;
  badge: string;
  imageUrl: string;
  isActive: boolean;
}

export interface CMSTestimonialItem {
  id: number;
  name: string;
  role: string;
  city: string;
  avatar: string;
  rating: number;
  comment: string;
  carRented: string;
  isFeatured: boolean;
}

export interface CMSFaqItem {
  id: number;
  category: "General" | "Bookings" | "Security Deposit" | "Documents";
  question: string;
  answer: string;
}

export interface CMSBlogItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  summary: string;
  imageUrl: string;
  isPublished: boolean;
}

export interface NotificationTemplateItem {
  id: string;
  channel: "Email" | "SMS" | "WhatsApp" | "Push";
  trigger: "Booking Confirmation" | "Pickup Reminder" | "Return Reminder" | "Payment Reminder" | "KYC Document Request";
  subject?: string;
  body: string;
  isActive: boolean;
}

export interface ReviewItem {
  id: number;
  customerName: string;
  customerPhone: string;
  carName: string;
  rating: number;
  comment: string;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
  isFeatured: boolean;
  adminReply?: string;
}

export interface SupportTicketItem {
  id: string;
  customerName: string;
  customerPhone: string;
  bookingId?: number;
  category: "Booking Issue" | "Car Breakdown" | "Payment / Refund" | "KYC Verification" | "General Enquiry";
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedAgent: string;
  subject: string;
  messages: { sender: "Customer" | "Agent"; text: string; time: string }[];
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  adminName: string;
  module: "Fleet" | "Bookings" | "Customers" | "Drivers" | "Payments" | "Coupons" | "Security" | "Settings" | "CMS" | "Reports";
  action: string;
  details: string;
  ipAddress: string;
}
