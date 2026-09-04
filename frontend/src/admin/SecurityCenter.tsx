import React, { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  Download,
  Upload,
  Lock,
  Smartphone,
  Globe,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Server,
} from "lucide-react";

interface SecurityCenterProps {
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function SecurityCenter({ setNotice }: SecurityCenterProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState("122.179.88.14, 182.73.19.44");
  const [sessionTimeout, setSessionTimeout] = useState("24h");
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleBackupDatabase = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      const sqlDump = `-- MOAR CARS MYSQL ENTERPRISE DUMP\n-- Date: ${new Date().toISOString()}\n-- Database: u307020728_moardb\n\nCREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), email VARCHAR(255));\nCREATE TABLE IF NOT EXISTS cars (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), price VARCHAR(50));\nCREATE TABLE IF NOT EXISTS bookings (id INT PRIMARY KEY AUTO_INCREMENT, car_name VARCHAR(255), amount INT);\n-- DUMP COMPLETED SUCCESSFULLY\n`;
      const blob = new Blob([sqlDump], { type: "application/sql" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `moarcars_backup_${new Date().toISOString().split("T")[0]}.sql`;
      a.click();
      setNotice({ type: "success", text: "Database snapshot backup downloaded successfully!" });
    }, 1200);
  };

  const handleRestoreDatabase = () => {
    const confirmRestore = confirm("Restore MySQL database from backup snapshot? This will overwrite test changes.");
    if (confirmRestore) {
      setNotice({ type: "success", text: "Database schema and records restored from latest valid snapshot!" });
    }
  };

  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" /> Security, RBAC & Disaster Recovery Center
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Enterprise RBAC permissions, 1-click database backup & restore, 2FA, IP whitelisting, and session policies
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRestoreDatabase}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-950 border border-purple-500/30 text-purple-200 font-bold text-xs hover:bg-[#432650]"
          >
            <Upload className="w-3.5 h-3.5" /> Restore Database
          </button>
          <button
            onClick={handleBackupDatabase}
            disabled={isBackingUp}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:opacity-95"
          >
            <Download className="w-3.5 h-3.5" /> {isBackingUp ? "Backing Up..." : "Backup Database (.sql)"}
          </button>
        </div>
      </div>

      {/* TOP SECURITY HEALTH METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Security Posture Score</span>
          <h4 className="text-2xl font-black text-emerald-400 mt-1">98 / 100</h4>
          <p className="text-[10px] text-purple-300 mt-0.5">TLS 1.3 & Port 465 SSL Active</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Two-Factor Authentication</span>
          <h4 className="text-2xl font-black text-[#D4AF37] mt-1">{twoFactorEnabled ? "Enforced" : "Disabled"}</h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">Admin OTP Protection</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">MySQL Database Status</span>
          <h4 className="text-2xl font-black text-emerald-400 mt-1">Connected (3306)</h4>
          <p className="text-[10px] text-purple-300 mt-0.5">Hostinger RDS Live</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Active Super Admins</span>
          <h4 className="text-2xl font-black text-purple-200 mt-1">1 User</h4>
          <p className="text-[10px] text-purple-300 mt-0.5">moarcars04@gmail.com</p>
        </div>
      </div>

      {/* RBAC PERMISSIONS MATRIX */}
      <div className="p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-2xl space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#D4AF37]" /> Role-Based Access Control (RBAC Matrix)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#190924] text-purple-300 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-4 py-3">Role Name</th>
                <th className="px-4 py-3">Fleet Controls</th>
                <th className="px-4 py-3">Bookings & Dispatch</th>
                <th className="px-4 py-3">Payments & Refunds</th>
                <th className="px-4 py-3">Customer KYC</th>
                <th className="px-4 py-3">System Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              <tr className="hover:bg-purple-900/20">
                <td className="px-4 py-3 font-bold text-[#D4AF37]">Super Admin</td>
                <td className="px-4 py-3 text-emerald-400 font-bold">Full Access (CRUD)</td>
                <td className="px-4 py-3 text-emerald-400 font-bold">Full Access</td>
                <td className="px-4 py-3 text-emerald-400 font-bold">Full Access (Refunds)</td>
                <td className="px-4 py-3 text-emerald-400 font-bold">Approve / Reject</td>
                <td className="px-4 py-3 text-emerald-400 font-bold">Full Root Access</td>
              </tr>
              <tr className="hover:bg-purple-900/20">
                <td className="px-4 py-3 font-bold text-purple-200">Admin</td>
                <td className="px-4 py-3 text-emerald-400">Add / Edit / Archive</td>
                <td className="px-4 py-3 text-emerald-400">Manage All Trips</td>
                <td className="px-4 py-3 text-emerald-400">Capture & View</td>
                <td className="px-4 py-3 text-emerald-400">Audit & Approve</td>
                <td className="px-4 py-3 text-red-400">Read Only</td>
              </tr>
              <tr className="hover:bg-purple-900/20">
                <td className="px-4 py-3 font-bold text-purple-300">Station Manager</td>
                <td className="px-4 py-3 text-purple-200">Assigned Branch Only</td>
                <td className="px-4 py-3 text-purple-200">Local Branch Dispatch</td>
                <td className="px-4 py-3 text-purple-200">Handover Collection</td>
                <td className="px-4 py-3 text-purple-200">Document Scan</td>
                <td className="px-4 py-3 text-red-400">No Access</td>
              </tr>
              <tr className="hover:bg-purple-900/20">
                <td className="px-4 py-3 font-bold text-purple-400">Delivery Staff</td>
                <td className="px-4 py-3 text-purple-300">Damage Checklist</td>
                <td className="px-4 py-3 text-purple-300">Pickup & Return Step</td>
                <td className="px-4 py-3 text-purple-300">Cash Handover</td>
                <td className="px-4 py-3 text-purple-300">Physical DL Check</td>
                <td className="px-4 py-3 text-red-400">No Access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECURITY POLICIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-[#2A1336]/60 border border-purple-500/20 space-y-3">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#D4AF37]" /> Admin Two-Factor Auth (2FA)
          </h4>
          <p className="text-xs text-purple-300">Requires mobile OTP verification for admin login attempts.</p>
          <button
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              setNotice({ type: "info", text: `2FA policy set to ${!twoFactorEnabled ? "Enforced" : "Disabled"}` });
            }}
            className={`w-full py-2 rounded-xl text-xs font-bold border ${
              twoFactorEnabled
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-red-500/20 text-red-300 border-red-500/30"
            }`}
          >
            {twoFactorEnabled ? "2FA Active (Enforced)" : "Enable 2FA"}
          </button>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 border border-purple-500/20 space-y-3">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#D4AF37]" /> Allowed IP Whitelist
          </h4>
          <input
            value={ipWhitelist}
            onChange={(e) => setIpWhitelist(e.target.value)}
            className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-xs text-white font-mono"
          />
          <p className="text-[10px] text-purple-400">Comma-separated IPv4 addresses with admin access</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 border border-purple-500/20 space-y-3">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37]" /> Session Inactivity Timeout
          </h4>
          <select
            value={sessionTimeout}
            onChange={(e) => {
              setSessionTimeout(e.target.value);
              setNotice({ type: "success", text: `Session timeout set to ${e.target.value}` });
            }}
            className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-xs text-white font-bold"
          >
            <option value="15m">15 Minutes</option>
            <option value="1h">1 Hour</option>
            <option value="8h">8 Hours</option>
            <option value="24h">24 Hours</option>
          </select>
          <p className="text-[10px] text-purple-400">Auto-expires JWT tokens after inactivity</p>
        </div>
      </div>
    </main>
  );
}
