import { useState, useEffect } from "react";

export interface LocationHub {
  id: number;
  name: string;
  city: string;
  state: string;
  address?: string;
  phone?: string;
  managerName?: string;
  managerPhone?: string;
  managerEmail?: string;
  operatingHours?: string;
  totalCars?: number;
  staffCount?: number;
  monthlyRevenue?: number;
  isActive?: boolean;
}

export const DEFAULT_LOCATIONS = [
  "Tirupati Central Hub (Station)",
  "Renigunta Airport Hub (TIR T1)",
  "Alipiri Tirumala Gate Hub",
  "Chandragiri Heritage Point",
  "Horsley Hills Route Hub",
  "Srikalahasti Temple Hub",
  "Kanipakam Temple Corridor",
];

export function useLocations() {
  const [locations, setLocations] = useState<string[]>(DEFAULT_LOCATIONS);
  const [hubs, setHubs] = useState<LocationHub[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch("/api/locations")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch locations");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.locations) && data.locations.length > 0) {
          setLocations(data.locations);
        }
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setHubs(data.data);
        }
      })
      .catch((err) => {
        console.warn("[useLocations] Fallback to default locations:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { locations, hubs, loading };
}
