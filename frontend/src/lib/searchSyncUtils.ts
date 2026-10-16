import { getTodayDateStr, getFutureDateStr, clampBookingDate } from "./dateUtils";

export interface ActiveSearchParams {
  pickup: string;
  dropoff: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  category?: string;
}

const SEARCH_STORAGE_KEY = "moar_active_search_params";

export const DEFAULT_SEARCH_PARAMS: ActiveSearchParams = {
  pickup: "Tirupati Central (Alipiri Main Hub)",
  dropoff: "Tirupati Central (Alipiri Main Hub)",
  startDate: getTodayDateStr(),
  startTime: "09:00",
  endDate: getFutureDateStr(2),
  endTime: "21:00",
  category: "all",
};

/**
 * Retrieves the currently active search and reservation parameters from storage.
 * Automatically validates and clamps dates so past dates are blocked.
 */
export const getActiveSearchParams = (): ActiveSearchParams => {
  try {
    const raw = localStorage.getItem(SEARCH_STORAGE_KEY);
    if (!raw) return DEFAULT_SEARCH_PARAMS;

    const parsed: Partial<ActiveSearchParams> = JSON.parse(raw);
    const today = getTodayDateStr();

    let startDate = clampBookingDate(parsed.startDate || today);
    let endDate = clampBookingDate(parsed.endDate || getFutureDateStr(2));

    // Ensure endDate is at least startDate
    if (endDate < startDate) {
      endDate = startDate;
    }

    return {
      pickup: parsed.pickup || DEFAULT_SEARCH_PARAMS.pickup,
      dropoff: parsed.dropoff || parsed.pickup || DEFAULT_SEARCH_PARAMS.dropoff,
      startDate,
      startTime: parsed.startTime || DEFAULT_SEARCH_PARAMS.startTime,
      endDate,
      endTime: parsed.endTime || DEFAULT_SEARCH_PARAMS.endTime,
      category: parsed.category || DEFAULT_SEARCH_PARAMS.category,
    };
  } catch {
    return DEFAULT_SEARCH_PARAMS;
  }
};

/**
 * Saves updated search parameters to storage and notifies listening components.
 */
export const saveActiveSearchParams = (params: Partial<ActiveSearchParams>): ActiveSearchParams => {
  try {
    const current = getActiveSearchParams();
    const updated: ActiveSearchParams = {
      ...current,
      ...params,
    };

    // Ensure dates are valid
    if (updated.startDate < getTodayDateStr()) {
      updated.startDate = getTodayDateStr();
    }
    if (updated.endDate < updated.startDate) {
      updated.endDate = updated.startDate;
    }

    localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event for real-time tab/component sync
    window.dispatchEvent(new CustomEvent("moar_search_updated", { detail: updated }));

    return updated;
  } catch {
    return DEFAULT_SEARCH_PARAMS;
  }
};
