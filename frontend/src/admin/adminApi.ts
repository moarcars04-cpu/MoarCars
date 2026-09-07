import {
  CarItem,
  BookingItem,
  CustomerItem,
  DriverItem,
  BranchItem,
  PaymentItem,
  CouponItem,
  ReviewItem,
  SupportTicketItem,
  ActivityLogItem,
  CMSBannerItem,
  CMSOfferItem,
  CMSTestimonialItem,
  CMSFaqItem,
  CMSBlogItem,
  NotificationTemplateItem,
} from "./types";

const API_BASE = "/api";

// Generic fetch wrapper with timeout & fallback
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (err) {
    console.warn(`[API] Fetch failed for ${url}, fallback to local state:`, err);
    return null;
  }
}

export const adminApi = {
  // Cars
  async getCars(): Promise<CarItem[] | null> {
    return fetchJson<CarItem[]>(`${API_BASE}/admin/cars`);
  },
  async createCar(car: Partial<CarItem>): Promise<CarItem | null> {
    return fetchJson<CarItem>(`${API_BASE}/admin/cars`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });
  },
  async updateCar(id: number, car: Partial<CarItem>): Promise<CarItem | null> {
    return fetchJson<CarItem>(`${API_BASE}/admin/cars/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });
  },
  async deleteCar(id: number): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/cars/${id}`, {
      method: "DELETE",
    });
    return !!res;
  },

  // Bookings
  async getBookings(): Promise<BookingItem[] | null> {
    return fetchJson<BookingItem[]>(`${API_BASE}/admin/bookings`);
  },
  async createBooking(booking: Partial<BookingItem>): Promise<BookingItem | null> {
    return fetchJson<BookingItem>(`${API_BASE}/admin/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
  },
  async updateBooking(id: number, booking: Partial<BookingItem>): Promise<BookingItem | null> {
    return fetchJson<BookingItem>(`${API_BASE}/admin/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
  },
  async deleteBooking(id: number): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/bookings/${id}`, {
      method: "DELETE",
    });
    return !!res;
  },

  // Customers
  async getCustomers(): Promise<CustomerItem[] | null> {
    return fetchJson<CustomerItem[]>(`${API_BASE}/admin/customers`);
  },
  async createCustomer(customer: Partial<CustomerItem>): Promise<CustomerItem | null> {
    return fetchJson<CustomerItem>(`${API_BASE}/admin/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });
  },
  async updateCustomer(id: number, customer: Partial<CustomerItem>): Promise<CustomerItem | null> {
    return fetchJson<CustomerItem>(`${API_BASE}/admin/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });
  },
  async deleteCustomer(id: number): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/customers/${id}`, {
      method: "DELETE",
    });
    return !!res;
  },

  // Drivers
  async getDrivers(): Promise<DriverItem[] | null> {
    return fetchJson<DriverItem[]>(`${API_BASE}/admin/drivers`);
  },
  async createDriver(driver: Partial<DriverItem>): Promise<DriverItem | null> {
    return fetchJson<DriverItem>(`${API_BASE}/admin/drivers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(driver),
    });
  },
  async updateDriver(id: number, driver: Partial<DriverItem>): Promise<DriverItem | null> {
    return fetchJson<DriverItem>(`${API_BASE}/admin/drivers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(driver),
    });
  },
  async deleteDriver(id: number): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/drivers/${id}`, {
      method: "DELETE",
    });
    return !!res;
  },

  // Branches
  async getBranches(): Promise<BranchItem[] | null> {
    return fetchJson<BranchItem[]>(`${API_BASE}/admin/branches`);
  },
  async createBranch(branch: Partial<BranchItem>): Promise<BranchItem | null> {
    return fetchJson<BranchItem>(`${API_BASE}/admin/branches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(branch),
    });
  },
  async updateBranch(id: number, branch: Partial<BranchItem>): Promise<BranchItem | null> {
    return fetchJson<BranchItem>(`${API_BASE}/admin/branches/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(branch),
    });
  },
  async deleteBranch(id: number): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/branches/${id}`, {
      method: "DELETE",
    });
    return !!res;
  },

  // Payments
  async getPayments(): Promise<PaymentItem[] | null> {
    return fetchJson<PaymentItem[]>(`${API_BASE}/admin/payments`);
  },
  async createPayment(payment: Partial<PaymentItem>): Promise<PaymentItem | null> {
    return fetchJson<PaymentItem>(`${API_BASE}/admin/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });
  },
  async refundPayment(id: string, payload?: { damageDeduction?: number; refundAmount?: number }): Promise<PaymentItem | null> {
    return fetchJson<PaymentItem>(`${API_BASE}/admin/payments/${id}/refund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
  },
  async deletePayment(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/payments/${id}`, {
      method: "DELETE",
    });
    return !!res;
  },

  // Coupons
  async getCoupons(): Promise<CouponItem[] | null> {
    return fetchJson<CouponItem[]>(`${API_BASE}/admin/coupons`);
  },
  async createCoupon(coupon: Partial<CouponItem>): Promise<CouponItem | null> {
    return fetchJson<CouponItem>(`${API_BASE}/admin/coupons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coupon),
    });
  },
  async updateCoupon(id: number, coupon: Partial<CouponItem>): Promise<CouponItem | null> {
    return fetchJson<CouponItem>(`${API_BASE}/admin/coupons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coupon),
    });
  },
  async deleteCoupon(id: number): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/coupons/${id}`, {
      method: "DELETE",
    });
    return !!res;
  },

  // Reviews
  async getReviews(): Promise<ReviewItem[] | null> {
    return fetchJson<ReviewItem[]>(`${API_BASE}/admin/reviews`);
  },
  async createReview(review: Partial<ReviewItem>): Promise<ReviewItem | null> {
    return fetchJson<ReviewItem>(`${API_BASE}/admin/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
  },
  async replyReview(id: number, reply: string): Promise<ReviewItem | null> {
    return fetchJson<ReviewItem>(`${API_BASE}/admin/reviews/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    });
  },
  async updateReview(id: number, review: Partial<ReviewItem>): Promise<ReviewItem | null> {
    return fetchJson<ReviewItem>(`${API_BASE}/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
  },
  async deleteReview(id: number): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/reviews/${id}`, {
      method: "DELETE",
    });
    return !!res;
  },

  // Support Tickets
  async getSupportTickets(): Promise<SupportTicketItem[] | null> {
    return fetchJson<SupportTicketItem[]>(`${API_BASE}/admin/support/tickets`);
  },
  async createSupportTicket(ticket: Partial<SupportTicketItem>): Promise<SupportTicketItem | null> {
    return fetchJson<SupportTicketItem>(`${API_BASE}/admin/support/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    });
  },
  async updateSupportTicket(id: string, ticket: Partial<SupportTicketItem>): Promise<SupportTicketItem | null> {
    return fetchJson<SupportTicketItem>(`${API_BASE}/admin/support/tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    });
  },
  async deleteSupportTicket(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/support/tickets/${id}`, {
      method: "DELETE",
    });
    return !!res;
  },

  // Activity Logs
  async getActivityLogs(): Promise<ActivityLogItem[] | null> {
    return fetchJson<ActivityLogItem[]>(`${API_BASE}/admin/logs`);
  },
  async logActivity(log: Partial<ActivityLogItem>): Promise<ActivityLogItem | null> {
    return fetchJson<ActivityLogItem>(`${API_BASE}/admin/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });
  },

  // System Settings & CMS Key-Value
  async getSettings(): Promise<Record<string, any> | null> {
    return fetchJson<Record<string, any>>(`${API_BASE}/admin/settings`);
  },
  async saveSettings(settings: Record<string, any>): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    return !!res;
  },
};
