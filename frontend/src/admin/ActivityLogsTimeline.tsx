import React, { useState, useMemo } from "react";
import {
  History,
  Search,
  Filter,
  ShieldAlert,
  Car,
  Calendar,
  CreditCard,
  Users,
  Settings,
  Tag,
} from "lucide-react";
import { ActivityLogItem } from "./types";

interface ActivityLogsTimelineProps {
  logs: ActivityLogItem[];
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function ActivityLogsTimeline({
  logs,
  setNotice,
}: ActivityLogsTimelineProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModule, setFilterModule] = useState<string>("all");

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchSearch =
        l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

      const matchModule = filterModule === "all" || l.module === filterModule;
      return matchSearch && matchModule;
    });
  }, [logs, searchQuery, filterModule]);

  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <History className="w-6 h-6 text-[#D4AF37]" /> Activity Logs & Enterprise Audit Trail
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Searchable live timeline of every administrative action, fleet update, booking transition, and payment event
          </p>
        </div>

        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
          <input
            type="text"
            placeholder="Search action, admin, IP address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#14081E] border border-purple-500/30 rounded-2xl py-2 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="flex flex-wrap gap-2 text-xs">
        {["all", "Fleet", "Bookings", "Customers", "Drivers", "Payments", "Coupons", "Security"].map((mod) => (
          <button
            key={mod}
            onClick={() => setFilterModule(mod)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all capitalize ${
              filterModule === mod
                ? "bg-[#D4AF37] text-slate-950 font-black shadow-md"
                : "bg-[#2A1336]/60 text-purple-300 border border-purple-500/20 hover:text-white"
            }`}
          >
            {mod === "all" ? "All Modules" : mod}
          </button>
        ))}
      </div>

      {/* TIMELINE LIST */}
      <div className="rounded-3xl border border-purple-500/20 bg-[#2A1336]/60 backdrop-blur-2xl overflow-hidden shadow-2xl p-6 space-y-4">
        <div className="divide-y divide-purple-500/10">
          {filteredLogs.map((l) => (
            <div key={l.id} className="py-4 flex items-start gap-4 hover:bg-purple-900/10 transition-colors rounded-2xl px-3">
              <div className="w-9 h-9 rounded-2xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-[#D4AF37] shrink-0 font-bold text-xs mt-0.5">
                {l.module === "Fleet" && <Car className="w-4 h-4" />}
                {l.module === "Bookings" && <Calendar className="w-4 h-4" />}
                {l.module === "Payments" && <CreditCard className="w-4 h-4" />}
                {l.module === "Customers" && <Users className="w-4 h-4" />}
                {l.module === "Coupons" && <Tag className="w-4 h-4" />}
                {l.module === "Security" && <ShieldAlert className="w-4 h-4" />}
                {!["Fleet", "Bookings", "Payments", "Customers", "Coupons", "Security"].includes(l.module) && (
                  <History className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{l.action}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30">
                      {l.module}
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-400 font-mono">{l.timestamp}</span>
                </div>

                <p className="text-xs text-purple-200/90 leading-relaxed font-mono bg-[#14081E] p-2.5 rounded-xl border border-purple-500/20">
                  {l.details}
                </p>

                <div className="flex justify-between items-center text-[10px] text-purple-400 pt-1">
                  <span>Authorized By: <strong className="text-purple-200">{l.adminName}</strong></span>
                  <span className="font-mono">{l.ipAddress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
