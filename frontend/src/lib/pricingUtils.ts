/**
 * Unified Pricing Engine for MOAR CARS
 * Guarantees identical duration, base fare, discounts, GST, 10% advance, and balance calculations
 * across CarDetailsPage, LuxuryBookingPanel, and CheckoutPage.
 */

export interface PricingInput {
  pricePerDay: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  deliveryFee?: number;
  appliedCouponPercent?: number;
  gstRate?: number;
  advancePaymentPercent?: number;
}

export interface PricingResult {
  totalHours: number;
  totalDays: number;
  durationLabel: string;
  dailyRate: number;
  baseFare: number;
  deliveryFee: number;
  subtotalBeforeDiscounts: number;
  couponDiscount: number;
  subtotalAfterDiscounts: number;
  gstRate: number;
  gstAmount: number;
  grandTotal: number;
  advancePaymentPercent: number;
  payableNow: number;
  balanceDue: number;
}

export const calculateRentalPricing = ({
  pricePerDay,
  startDate,
  startTime,
  endDate,
  endTime,
  deliveryFee = 0,
  appliedCouponPercent = 0,
  gstRate = 18,
  advancePaymentPercent = 10,
}: PricingInput): PricingResult => {
  const safeDailyRate = Math.max(0, Number(pricePerDay) || 1699);

  let totalHours = 48;
  let totalDays = 2;

  try {
    const sDate = startDate || new Date().toISOString().split("T")[0];
    const sTime = startTime || "09:00";
    const eDate = endDate || sDate;
    const eTime = endTime || "21:00";

    const startDateTime = new Date(`${sDate}T${sTime}:00`);
    const endDateTime = new Date(`${eDate}T${eTime}:00`);

    const diffMs = endDateTime.getTime() - startDateTime.getTime();
    if (diffMs > 0) {
      totalHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
      totalDays = Math.max(1, Math.ceil(totalHours / 24));
    } else {
      totalHours = 24;
      totalDays = 1;
    }
  } catch {
    totalHours = 48;
    totalDays = 2;
  }

  const durationLabel = `${totalHours} Hours (${totalDays} ${totalDays === 1 ? "Day" : "Days"} Tariff)`;
  const baseFare = safeDailyRate * totalDays;
  const safeDeliveryFee = Math.max(0, Number(deliveryFee) || 0);
  const subtotalBeforeDiscounts = baseFare + safeDeliveryFee;

  const validCouponPercent = Math.min(100, Math.max(0, Number(appliedCouponPercent) || 0));
  const couponDiscount = validCouponPercent > 0
    ? Math.round((subtotalBeforeDiscounts * validCouponPercent) / 100)
    : 0;

  const subtotalAfterDiscounts = Math.max(0, subtotalBeforeDiscounts - couponDiscount);

  const safeGstRate = Math.max(0, Number(gstRate) || 18);
  const gstAmount = Math.round(subtotalAfterDiscounts * (safeGstRate / 100));

  const grandTotal = subtotalAfterDiscounts + gstAmount;

  const safeAdvancePercent = Math.min(100, Math.max(1, Number(advancePaymentPercent) || 10));
  const payableNow = Math.round(grandTotal * (safeAdvancePercent / 100));
  const balanceDue = Math.max(0, grandTotal - payableNow);

  return {
    totalHours,
    totalDays,
    durationLabel,
    dailyRate: safeDailyRate,
    baseFare,
    deliveryFee: safeDeliveryFee,
    subtotalBeforeDiscounts,
    couponDiscount,
    subtotalAfterDiscounts,
    gstRate: safeGstRate,
    gstAmount,
    grandTotal,
    advancePaymentPercent: safeAdvancePercent,
    payableNow,
    balanceDue,
  };
};
