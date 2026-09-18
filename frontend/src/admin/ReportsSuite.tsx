import React, { useState } from "react";
import {
  TrendingUp,
  Download,
  Calendar,
  Filter,
  FileText,
  DollarSign,
  PieChart as PieIcon,
  BarChart2,
  Printer,
  Building2,
  Car,
  Users,
  ShieldCheck,
  Percent,
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
} from "recharts";
import { CarItem, BookingItem, BranchItem, PaymentItem } from "./types";

interface ReportsSuiteProps {
  fleet: CarItem[];
  bookings: BookingItem[];
  branches: BranchItem[];
  payments: PaymentItem[];
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function ReportsSuite({
  fleet,
  bookings,
  branches,
  payments,
  setNotice,
}: ReportsSuiteProps) {
  const [selectedReport, setSelectedReport] = useState<string>("revenue");
  const [dateRange, setDateRange] = useState<string>("month");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const revenueData = [
    { period: "Sep 01", revenue: 18400, bookings: 4, gst: 2800 },
    { period: "Sep 02", revenue: 24900, bookings: 6, gst: 3796 },
    { period: "Sep 03", revenue: 31200, bookings: 7, gst: 4759 },
    { period: "Sep 04", revenue: 42800, bookings: 9, gst: 6528 },
    { period: "Sep 05", revenue: 58900, bookings: 12, gst: 8984 },
    { period: "Sep 06", revenue: 64200, bookings: 14, gst: 9793 },
    { period: "Sep 07", revenue: 52100, bookings: 11, gst: 7947 },
  ];

  const handleExportReport = (format: "pdf" | "excel") => {
    if (format === "pdf") {
      window.print();
    } else {
      const csv = `Report: ${selectedReport.toUpperCase()}\nDate Range: ${dateRange}\nBranch: ${selectedBranch}\nGenerated: ${new Date().toLocaleString()}\n\nPeriod,Revenue,Bookings,GST\n` +
        revenueData.map((d) => `${d.period},${d.revenue},${d.bookings},${d.gst}`).join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `moar_${selectedReport}_report_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      setNotice({ type: "success", text: `${selectedReport.toUpperCase()} report exported as CSV/Excel!` });
    }
  };

  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <TrendingUp className="w-6 h-6 text-[#c88d18]" /> Enterprise Business Intelligence & Reports Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Audited financial statements, GST 18% tax ledger, fleet utilization, and profit & loss analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportReport("excel")}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-[#c88d18] font-bold text-xs hover:bg-[#c88d18]/20"
          >
            <Download className="w-3.5 h-3.5" /> Download Excel
          </button>
          <button
            onClick={() => handleExportReport("pdf")}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#c88d18] to-[#d49b29] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="p-4 rounded-2xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#c88d18]" /> Select Report:
          </span>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#070e1c] border border-slate-800 text-[#c88d18] font-bold focus:outline-none"
          >
            <option value="revenue">1. Revenue Velocity Report</option>
            <option value="bookings">2. Booking Volume & Conversion</option>
            <option value="fleet">3. Fleet Utilization & Idle Time</option>
            <option value="customers">4. Customer Acquisition & LTV</option>
            <option value="drivers">5. Driver Earnings & Payouts</option>
            <option value="branches">6. Branch Station Hub Revenue</option>
            <option value="gst">7. GST Statutory Tax Report (18%)</option>
            <option value="tds">8. Tax & TDS Compliance</option>
            <option value="coupons">9. Coupon ROI & Campaign Usage</option>
            <option value="refunds">10. Security Escrow & Refunds</option>
            <option value="pnl">11. Profit & Loss (P&L) Statement</option>
            <option value="expenses">12. Operating Expense Report</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#070e1c] border border-slate-800 text-white font-bold"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="month">This Month (September 2026)</option>
            <option value="quarter">Q3 2026</option>
            <option value="year">FY 2026-27</option>
          </select>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#070e1c] border border-slate-800 text-white"
          >
            <option value="all">All Stations (Tirupati, Airport, Chandragiri)</option>
            <option value="Tirupati Central Hub">Tirupati Central Hub</option>
            <option value="Renigunta Airport Hub">Renigunta Airport Hub</option>
            <option value="Chandragiri Heritage Point">Chandragiri Heritage Point</option>
          </select>
        </div>
      </div>

      {/* REPORT SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0b1426]/60 border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-bold block">Gross Network Volume</span>
          <h4 className="text-2xl font-black text-white mt-1">₹5,98,400</h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">+24.8% vs Last Month</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0b1426]/60 border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-bold block">GST Tax Collected (18%)</span>
          <h4 className="text-2xl font-black text-[#c88d18] mt-1">₹91,281</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">GSTIN: 37AAAAA0000A1Z5</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0b1426]/60 border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-bold block">Operating Expenses</span>
          <h4 className="text-2xl font-black text-amber-300 mt-1">₹1,42,800</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">Fuel, Maintenance & Staff</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0b1426]/60 border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-bold block">Net Operating Profit</span>
          <h4 className="text-2xl font-black text-emerald-400 mt-1">₹3,64,319</h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">60.8% Net Margin</p>
        </div>
      </div>

      {/* VISUAL CHART */}
      <div className="p-6 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-black text-sm text-white capitalize">{selectedReport} Performance Velocity</h4>
            <p className="text-[11px] text-slate-400">September 2026 Daily Collections & Tax Inflows</p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-slate-900 text-[#c88d18] border border-amber-400/30 text-xs font-bold font-mono">
            LIVE TELEMETRY
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c88d18" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#c88d18" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#c88d18/20" />
              <XAxis dataKey="period" stroke="#A78BFA" fontSize={11} />
              <YAxis stroke="#A78BFA" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0b1426",
                  borderColor: "#8B5CF6",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#c88d18" strokeWidth={3} fill="url(#reportGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DETAILED STATUTORY TABLE */}
      <div className="rounded-3xl border border-slate-800 bg-[#0b1426]/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#070e1c] text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
            <tr>
              <th className="px-5 py-4">Report Timeframe</th>
              <th className="px-5 py-4">Total Trips</th>
              <th className="px-5 py-4">Gross Rental (₹)</th>
              <th className="px-5 py-4">CGST 9%</th>
              <th className="px-5 py-4">SGST 9%</th>
              <th className="px-5 py-4">Operating Expense</th>
              <th className="px-5 py-4 text-right">Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {revenueData.map((d, i) => (
              <tr key={i} className="hover:bg-slate-800/60 transition-colors">
                <td className="px-5 py-4 font-bold text-white">{d.period}, 2026</td>
                <td className="px-5 py-4 text-slate-300">{d.bookings} Dispatched</td>
                <td className="px-5 py-4 font-black text-emerald-400">₹{d.revenue.toLocaleString()}</td>
                <td className="px-5 py-4 text-slate-400">₹{(d.gst / 2).toLocaleString()}</td>
                <td className="px-5 py-4 text-slate-400">₹{(d.gst / 2).toLocaleString()}</td>
                <td className="px-5 py-4 text-amber-300">₹{Math.round(d.revenue * 0.24).toLocaleString()}</td>
                <td className="px-5 py-4 text-right font-black text-[#c88d18]">
                  ₹{Math.round(d.revenue * 0.61).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
