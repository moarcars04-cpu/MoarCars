import React, { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Eye,
  Wallet,
  Gift,
  Ban,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCheck,
  MapPin,
  Car,
  Receipt,
  X,
  Shield,
  Coins,
  Share2,
} from "lucide-react";
import { CustomerItem, BookingItem } from "./types";
import { adminApi } from "./adminApi";

interface CustomerManagementProps {
  customers: CustomerItem[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerItem[]>>;
  bookings: BookingItem[];
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function CustomerManagement({
  customers,
  setCustomers,
  bookings,
  setNotice,
}: CustomerManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKyc, setFilterKyc] = useState<string>("all");

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
  const [viewingKycCustomer, setViewingKycCustomer] = useState<CustomerItem | null>(null);
  const [viewingWalletCustomer, setViewingWalletCustomer] = useState<CustomerItem | null>(null);
  const [viewingHistoryCustomer, setViewingHistoryCustomer] = useState<CustomerItem | null>(null);

  // Wallet form
  const [walletAmount, setWalletAmount] = useState<number>(500);
  const [walletRemark, setWalletRemark] = useState<string>("Promotion Bonus Credit");

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dlNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.aadhaarNumber.includes(searchQuery);

      const matchKyc =
        filterKyc === "all"
          ? true
          : filterKyc === "Blacklisted"
          ? c.isBlacklisted
          : c.kycStatus === filterKyc;

      return matchSearch && matchKyc;
    });
  }, [customers, searchQuery, filterKyc]);

  // Actions
  const handleSaveCustomer = (formData: Partial<CustomerItem>) => {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...formData } : c))
      );
      setNotice({ type: "success", text: `Customer "${formData.name || editingCustomer.name}" updated successfully!` });
      adminApi.updateCustomer(editingCustomer.id, formData);
    } else {
      const newCustomer: CustomerItem = {
        id: Math.floor(200 + Math.random() * 800),
        name: formData.name || "New Customer",
        phone: formData.phone || "+91 98765 00000",
        email: formData.email || "customer@example.com",
        avatar: formData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        kycStatus: (formData.kycStatus as any) || "Verified",
        dlNumber: formData.dlNumber || "AP03 2024009182",
        dlExpiry: formData.dlExpiry || "2032-05-15",
        dlFrontDocUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
        dlBackDocUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
        aadhaarNumber: formData.aadhaarNumber || "1234 5678 9900",
        aadhaarFrontDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
        passportNumber: formData.passportNumber || "Z8899001",
        walletBalance: formData.walletBalance || 0,
        loyaltyPoints: 150,
        loyaltyTier: "Gold",
        referralCode: `MOAR${Math.floor(100 + Math.random() * 900)}`,
        referredCount: 2,
        referralEarnings: 600,
        savedAddresses: formData.savedAddresses || ["Tirupati Railway Station Exit Desk"],
        favoriteCars: formData.favoriteCars || ["Mahindra Scorpio-N Z8L 4x4"],
        isBlacklisted: false,
        notes: formData.notes || "Registered via Admin Console",
        totalBookings: 0,
        totalSpent: 0,
        joinedDate: "2026-09-04",
      };
      setCustomers([newCustomer, ...customers]);
      setNotice({ type: "success", text: `Customer "${newCustomer.name}" registered successfully!` });
      adminApi.createCustomer(newCustomer);
    }
    setIsAddEditModalOpen(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (id: number) => {
    if (confirm("Are you sure you want to delete this customer profile?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setNotice({ type: "info", text: `Customer #${id} removed from system.` });
    }
  };

  const handleToggleBlacklist = (c: CustomerItem) => {
    const reason = !c.isBlacklisted
      ? prompt("Enter justification reason for blacklisting this customer:", "Repeated late returns / cabin smoking violation")
      : undefined;

    if (!c.isBlacklisted && reason === null) return;

    const newBlacklisted = !c.isBlacklisted;
    setCustomers((prev) =>
      prev.map((item) =>
        item.id === c.id
          ? {
              ...item,
              isBlacklisted: newBlacklisted,
              blacklistReason: newBlacklisted ? reason || "Admin flagged" : undefined,
            }
          : item
      )
    );
    setNotice({
      type: c.isBlacklisted ? "info" : "error",
      text: c.isBlacklisted ? `Customer ${c.name} removed from blacklist.` : `Customer ${c.name} has been BLACKLISTED.`,
    });
    adminApi.updateCustomer(c.id, { isBlacklisted: newBlacklisted });
  };

  const handleUpdateKycStatus = (customerId: number, status: "Verified" | "Rejected") => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, kycStatus: status } : c))
    );
    setNotice({
      type: status === "Verified" ? "success" : "error",
      text: `Customer #${customerId} KYC status marked as "${status}".`,
    });
    setViewingKycCustomer(null);
    adminApi.updateCustomer(customerId, { kycStatus: status });
  };

  const handleWalletAdjust = (isCredit: boolean) => {
    if (!viewingWalletCustomer || walletAmount <= 0) return;
    const newBal = isCredit
      ? viewingWalletCustomer.walletBalance + walletAmount
      : Math.max(0, viewingWalletCustomer.walletBalance - walletAmount);

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === viewingWalletCustomer.id
          ? {
              ...c,
              walletBalance: newBal,
            }
          : c
      )
    );
    setNotice({
      type: "success",
      text: `${isCredit ? "Credited" : "Debited"} ₹${walletAmount} for ${viewingWalletCustomer.name}! (${walletRemark})`,
    });
    adminApi.updateCustomer(viewingWalletCustomer.id, { walletBalance: newBal });
    setViewingWalletCustomer(null);
    setWalletAmount(500);
  };


  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Users className="w-6 h-6 text-[#D4AF37]" /> Customer CRM & KYC Verification Hub
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Manage registered renters, KYC document audit, prepaid wallets, loyalty rewards & blacklists
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
            <input
              type="text"
              placeholder="Search customer, phone, DL, Aadhaar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#14081E] border border-purple-500/30 rounded-2xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            onClick={() => {
              setEditingCustomer(null);
              setIsAddEditModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:opacity-95"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Total Registered Renters</span>
          <h4 className="text-2xl font-black text-white mt-1">{customers.length} Active</h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">100% Mobile & OTP Verified</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">KYC Verified Profiles</span>
          <h4 className="text-2xl font-black text-emerald-400 mt-1">
            {customers.filter((c) => c.kycStatus === "Verified").length} Users
          </h4>
          <p className="text-[10px] text-purple-300 mt-0.5">DL & Aadhaar Approved</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Total Prepaid Wallet Escrow</span>
          <h4 className="text-2xl font-black text-[#D4AF37] mt-1">
            ₹{customers.reduce((acc, c) => acc + c.walletBalance, 0).toLocaleString()}
          </h4>
          <p className="text-[10px] text-purple-300 mt-0.5">Prepaid Customer Balance</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Loyalty Points Issued</span>
          <h4 className="text-2xl font-black text-purple-200 mt-1">
            {customers.reduce((acc, c) => acc + c.loyaltyPoints, 0).toLocaleString()} Pts
          </h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">Moar Club Rewards Active</p>
        </div>
      </div>

      {/* KYC STATUS FILTER PILLS */}
      <div className="flex flex-wrap gap-2 text-xs">
        {["all", "Verified", "Pending", "Rejected", "Blacklisted"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterKyc(tab)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all capitalize ${
              filterKyc === tab
                ? "bg-[#D4AF37] text-slate-950 font-black shadow-md"
                : "bg-[#2A1336]/60 text-purple-300 border border-purple-500/20 hover:text-white"
            }`}
          >
            {tab === "all" ? "All Customers" : tab}
          </button>
        ))}
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="rounded-3xl border border-purple-500/20 bg-[#2A1336]/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#190924] text-purple-300 uppercase tracking-wider font-bold border-b border-purple-500/20">
            <tr>
              <th className="px-5 py-4">Customer Details</th>
              <th className="px-5 py-4">KYC Documents</th>
              <th className="px-5 py-4">Wallet & Loyalty</th>
              <th className="px-5 py-4">Referral & Tier</th>
              <th className="px-5 py-4">Trip History</th>
              <th className="px-5 py-4">CRM Notes</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="hover:bg-purple-900/20 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
                    />
                    <div>
                      <p className="font-bold text-white flex items-center gap-1.5">
                        {c.name}
                        {c.isBlacklisted && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] bg-red-500/20 text-red-400 font-black border border-red-500/30">
                            BLACKLISTED
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-purple-300">{c.phone}</p>
                      <p className="text-[10px] text-purple-400/80">{c.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                      c.kycStatus === "Verified"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : c.kycStatus === "Pending"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30"
                    }`}
                  >
                    {c.kycStatus}
                  </span>
                  <p className="text-[10px] text-purple-300 mt-1 font-mono">DL: {c.dlNumber}</p>
                  <p className="text-[9px] text-purple-400 font-mono">Aadhaar: {c.aadhaarNumber}</p>
                </td>

                <td className="px-5 py-4">
                  <p className="font-bold text-emerald-400 flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" /> ₹{c.walletBalance.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-[#D4AF37] font-semibold flex items-center gap-1 mt-0.5">
                    <Gift className="w-3 h-3" /> {c.loyaltyPoints} Pts
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 border border-purple-500/30 text-purple-200">
                    {c.loyaltyTier || "Silver"} Tier
                  </span>
                  <p className="text-[10px] text-purple-300 mt-1 font-mono flex items-center gap-1">
                    <Share2 className="w-2.5 h-2.5 text-[#D4AF37]" /> {c.referralCode}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="font-bold text-white">{c.totalBookings} Trips</p>
                  <p className="text-[10px] text-emerald-400 font-bold">Spent: ₹{c.totalSpent.toLocaleString()}</p>
                </td>

                <td className="px-5 py-4 text-purple-300 text-[11px] max-w-xs truncate">
                  {c.notes}
                </td>

                <td className="px-5 py-4 text-right space-x-1.5">
                  <button
                    onClick={() => setViewingKycCustomer(c)}
                    className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-[#D4AF37] border border-purple-500/30"
                    title="Audit KYC Documents (DL, Aadhaar, Passport)"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewingWalletCustomer(c)}
                    className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-emerald-300 border border-purple-500/30"
                    title="Prepaid Wallet & Loyalty Points Manager"
                  >
                    <Coins className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewingHistoryCustomer(c)}
                    className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-blue-300 border border-purple-500/30"
                    title="View Trip History"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCustomer(c);
                      setIsAddEditModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-purple-200 border border-purple-500/30"
                    title="Edit Customer Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleBlacklist(c)}
                    className={`p-1.5 rounded-lg border ${
                      c.isBlacklisted
                        ? "bg-red-500 text-white border-red-400"
                        : "bg-red-500/10 text-red-300 hover:bg-red-500/20 border-red-500/30"
                    }`}
                    title={c.isBlacklisted ? "Remove Blacklist" : "Blacklist Customer"}
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(c.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    title="Delete Customer Profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====================================================================
          MODAL 1: KYC VERIFICATION STUDIO
          ==================================================================== */}
      {viewingKycCustomer && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-2xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#D4AF37]" /> KYC Document Verification Studio: {viewingKycCustomer.name}
              </h3>
              <button onClick={() => setViewingKycCustomer(null)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/20 space-y-2">
                <span className="text-purple-400 text-[10px] uppercase font-bold block">Driving License (Front & Back)</span>
                <img
                  src={viewingKycCustomer.dlFrontDocUrl || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80"}
                  alt="DL Doc"
                  className="w-full h-32 object-cover rounded-xl border border-purple-500/30"
                />
                <p className="text-white font-mono font-bold text-xs">{viewingKycCustomer.dlNumber}</p>
                <p className="text-[10px] text-purple-300">Expires: {viewingKycCustomer.dlExpiry || "2032-05-15"}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/20 space-y-2">
                <span className="text-purple-400 text-[10px] uppercase font-bold block">Government Aadhaar Card</span>
                <img
                  src={viewingKycCustomer.aadhaarFrontDocUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"}
                  alt="Aadhaar Doc"
                  className="w-full h-32 object-cover rounded-xl border border-purple-500/30"
                />
                <p className="text-white font-mono font-bold text-xs">{viewingKycCustomer.aadhaarNumber}</p>
                <p className="text-[10px] text-purple-300">UIDAI Verified via Digilocker OTP</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/20 text-xs">
              <span className="text-purple-400 text-[10px] uppercase font-bold block mb-1">CRM Audit Notes</span>
              <p className="text-purple-200">{viewingKycCustomer.notes}</p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-purple-500/20">
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-300 font-bold">Current Status:</span>
                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-purple-950 text-[#D4AF37] border border-amber-400/30">
                  {viewingKycCustomer.kycStatus}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateKycStatus(viewingKycCustomer.id, "Rejected")}
                  className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 font-bold text-xs hover:bg-red-500/30"
                >
                  Reject KYC
                </button>
                <button
                  onClick={() => handleUpdateKycStatus(viewingKycCustomer.id, "Verified")}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
                >
                  Approve & Verify KYC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: WALLET & LOYALTY POINTS MANAGER
          ==================================================================== */}
      {viewingWalletCustomer && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#D4AF37]" /> Wallet & Loyalty Points: {viewingWalletCustomer.name}
              </h3>
              <button onClick={() => setViewingWalletCustomer(null)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#14081E] border border-purple-500/20">
                <span className="text-purple-400 text-[10px] uppercase font-bold block">Prepaid Balance</span>
                <span className="text-xl font-black text-emerald-400">₹{viewingWalletCustomer.walletBalance}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#14081E] border border-purple-500/20">
                <span className="text-purple-400 text-[10px] uppercase font-bold block">Loyalty Points</span>
                <span className="text-xl font-black text-[#D4AF37]">{viewingWalletCustomer.loyaltyPoints} Pts</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-purple-300 font-bold mb-1">Adjustment Amount (₹)</label>
                <input
                  type="number"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">Transaction Remark / Note</label>
                <input
                  type="text"
                  value={walletRemark}
                  onChange={(e) => setWalletRemark(e.target.value)}
                  placeholder="e.g. Compensation for delay, promo bonus..."
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-purple-500/20">
              <button
                onClick={() => handleWalletAdjust(false)}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 font-bold text-xs"
              >
                Debit (Deduct)
              </button>
              <button
                onClick={() => handleWalletAdjust(true)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs"
              >
                Credit (Add Balance)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: CUSTOMER BOOKING HISTORY
          ==================================================================== */}
      {viewingHistoryCustomer && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#D4AF37]" /> Booking History: {viewingHistoryCustomer.name}
              </h3>
              <button onClick={() => setViewingHistoryCustomer(null)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {bookings
                .filter((b) => b.customerPhone === viewingHistoryCustomer.phone || b.customerName === viewingHistoryCustomer.name)
                .map((b) => (
                  <div key={b.id} className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/20 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-[#D4AF37]" /> {b.carName}
                      </p>
                      <p className="text-[10px] text-purple-300 mt-0.5">
                        Booking #{b.id} &bull; {b.startDate} to {b.endDate}
                      </p>
                      <p className="text-[10px] text-purple-400">{b.pickup}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-400 text-sm">₹{b.amount.toLocaleString()}</p>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-950 text-purple-200 border border-purple-500/30 mt-1 inline-block">
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-purple-500/20">
              <button
                onClick={() => setViewingHistoryCustomer(null)}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 4: ADD / EDIT CUSTOMER PROFILE
          ==================================================================== */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D4AF37]" /> {editingCustomer ? `Edit Customer: ${editingCustomer.name}` : "Add New Renter Profile"}
              </h3>
              <button onClick={() => setIsAddEditModalOpen(false)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const t = e.target as any;
                handleSaveCustomer({
                  name: t.name.value,
                  phone: t.phone.value,
                  email: t.email.value,
                  avatar: t.avatar.value,
                  dlNumber: t.dlNumber.value,
                  aadhaarNumber: t.aadhaarNumber.value,
                  passportNumber: t.passportNumber.value,
                  walletBalance: parseInt(t.walletBalance.value) || 0,
                  notes: t.notes.value,
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-purple-300 font-bold mb-1">Full Name *</label>
                <input
                  name="name"
                  defaultValue={editingCustomer?.name || ""}
                  required
                  placeholder="Ramesh Kumar"
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Mobile Phone *</label>
                  <input
                    name="phone"
                    defaultValue={editingCustomer?.phone || ""}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Email</label>
                  <input
                    name="email"
                    defaultValue={editingCustomer?.email || ""}
                    placeholder="ramesh@gmail.com"
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Driving License</label>
                  <input
                    name="dlNumber"
                    defaultValue={editingCustomer?.dlNumber || "AP03 2024009182"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Aadhaar Number</label>
                  <input
                    name="aadhaarNumber"
                    defaultValue={editingCustomer?.aadhaarNumber || "1234 5678 9012"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Passport No</label>
                  <input
                    name="passportNumber"
                    defaultValue={editingCustomer?.passportNumber || "Z8899001"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Avatar Image URL</label>
                  <input
                    name="avatar"
                    defaultValue={editingCustomer?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Prepaid Wallet Credit (₹)</label>
                  <input
                    name="walletBalance"
                    type="number"
                    defaultValue={editingCustomer?.walletBalance || 0}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Admin CRM Notes</label>
                <input
                  name="notes"
                  defaultValue={editingCustomer?.notes || ""}
                  placeholder="VIP guest, preferences..."
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs"
                >
                  {editingCustomer ? "Save Changes" : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
