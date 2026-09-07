export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  gender?: string;
  dob?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  preferredLanguage?: string;
  kycStatus: "Pending" | "Under Review" | "Verified" | "Rejected";
  kycRejectionReason?: string;
  dlNumber?: string;
  dlExpiry?: string;
  dlFrontDocUrl?: string;
  dlBackDocUrl?: string;
  aadhaarNumber?: string;
  aadhaarFrontDocUrl?: string;
  aadhaarBackDocUrl?: string;
  passportNumber?: string;
  passportDocUrl?: string;
  selfieDocUrl?: string;
  walletBalance: number;
  rewardPoints: number;
  loyaltyPoints: number;
  loyaltyTier: string;
  referralCode?: string;
  referredBy?: string;
  referredCount?: number;
  referralEarnings?: number;
  savedAddresses?: SavedAddress[];
  savedPaymentMethods?: SavedPaymentMethod[];
  notificationPreferences?: NotificationPreferences;
  themePreference?: "dark" | "navy" | "contrast";
  favoriteCars?: (number | string)[];
  totalBookings?: number;
  token?: string;
  createdAt?: string;
}

export interface BookingItem {
  id: number;
  bookingType: string;
  pickup: string;
  startDate: string;
  endDate: string;
  carName: string;
  status: "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled" | "Returned";
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  driverName?: string;
  driverPhone?: string;
  deliveryStaff?: string;
  pickupAddress?: string;
  dropAddress?: string;
  duration?: string;
  extras?: any[];
  insurancePlan?: string;
  couponCode?: string;
  discountAmount?: number;
  taxAmount?: number;
  securityDeposit?: number;
  amount: number;
  branch?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  bookingSource?: string;
  notes?: string;
  startOdometer?: number;
  returnOdometer?: number;
  startFuel?: number;
  returnFuel?: number;
  penalties?: number;
  createdAt?: string;
}

export interface TransactionItem {
  id: string;
  title: string;
  amount: number;
  type: "credit" | "debit";
  category: "topup" | "booking_paid" | "cashback" | "deposit_refund" | "referral_bonus" | "withdrawal";
  status: "Captured" | "Pending" | "Refunded" | "Settled";
  date: string;
  invoiceNumber?: string;
  gateway?: string;
  transactionId?: string;
  notes?: string;
}

export interface ReviewItem {
  id: number;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAvatar?: string;
  carName: string;
  rating: number;
  cleanlinessRating?: number;
  performanceRating?: number;
  handoverRating?: number;
  valueRating?: number;
  comment: string;
  photoUrls?: string[];
  videoUrl?: string;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
  isFeatured?: boolean;
  adminReply?: string;
  bookingId?: number;
  likesCount?: number;
  isReported?: boolean;
  reportReason?: string;
}

export interface ReferralFriend {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
  joinedDate: string;
  status: "Signed Up" | "First Trip Booked" | "Trip Completed";
  rewardEarned: number;
}

export interface RewardVoucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountValue: number;
  minBooking: number;
  expiryDate: string;
  isClaimed: boolean;
  category: "birthday" | "festival" | "cashback" | "vip";
}

export interface SavedAddress {
  id: string;
  label: "Home" | "Office" | "Hotel / Temple" | "Other";
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  type: "upi" | "card";
  upiVpa?: string;
  bankName?: string;
  cardLast4?: string;
  cardBrand?: "Visa" | "Mastercard" | "RuPay" | "Amex";
  cardExpiry?: string;
  holderName?: string;
  isDefault?: boolean;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  bookingAlerts: boolean;
  pickupReminders: boolean;
  returnReminders: boolean;
  promotionalOffers: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "booking" | "pickup" | "return" | "offer" | "support" | "system";
  channel: "push" | "sms" | "whatsapp" | "email";
  isRead: boolean;
  link?: string;
  timestamp: string;
}

export interface UserSupportTicket {
  id: string;
  bookingId?: number;
  category: "Booking Issue" | "Car Breakdown" | "Payment / Refund" | "KYC Verification" | "General Enquiry";
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedAgent?: string;
  subject: string;
  messages: { sender: "Customer" | "Agent" | "AI Assistant"; text: string; time: string; attachmentUrl?: string }[];
  createdAt: string;
  lastUpdated?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "agent";
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface UserDashboardData {
  user: UserProfile;
  profileProgress: number;
  kycStatus: "Pending" | "Under Review" | "Verified" | "Rejected";
  kycRejectionReason?: string;
  walletBalance: number;
  rewardPoints: number;
  loyaltyTier: string;
  upcomingBookings: BookingItem[];
  recentBookings: BookingItem[];
  savedCars: any[];
  totalTrips: number;
  transactions?: TransactionItem[];
  reviews?: ReviewItem[];
  userReviews?: ReviewItem[];
  referrals?: ReferralFriend[];
  vouchers?: RewardVoucher[];
  notifications?: NotificationItem[];
  tickets?: UserSupportTicket[];
}
