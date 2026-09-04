import React, { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Clock,
  Phone,
  Mail,
  Car,
  Users,
  DollarSign,
  Edit,
  Trash2,
  X,
  Navigation,
} from "lucide-react";
import { BranchItem, CarItem } from "./types";
import { adminApi } from "./adminApi";

interface BranchManagementProps {
  branches: BranchItem[];
  setBranches: React.Dispatch<React.SetStateAction<BranchItem[]>>;
  fleet: CarItem[];
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function BranchManagement({
  branches,
  setBranches,
  fleet,
  setNotice,
}: BranchManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null);
  const [viewingFleetBranch, setViewingFleetBranch] = useState<BranchItem | null>(null);

  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.managerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveBranch = (formData: Partial<BranchItem>) => {
    if (editingBranch) {
      setBranches((prev) =>
        prev.map((b) => (b.id === editingBranch.id ? { ...b, ...formData } : b))
      );
      setNotice({ type: "success", text: `Station Hub "${formData.name || editingBranch.name}" updated!` });
      adminApi.updateBranch(editingBranch.id, formData);
    } else {
      const newB: BranchItem = {
        id: Math.floor(400 + Math.random() * 600),
        name: formData.name || "New Station Hub",
        city: formData.city || "Tirupati",
        state: formData.state || "Andhra Pradesh",
        address: formData.address || "Main Highway Road, Tirupati",
        operatingHours: formData.operatingHours || "24 Hours (7 Days)",
        managerName: formData.managerName || "M. Ramesh Reddy",
        managerPhone: formData.managerPhone || "+91 94400 11223",
        managerEmail: formData.managerEmail || "hub@moarcars.in",
        totalCars: formData.totalCars || 4,
        staffCount: formData.staffCount || 3,
        monthlyRevenue: formData.monthlyRevenue || 120000,
        isActive: true,
      };
      setBranches([newB, ...branches]);
      setNotice({ type: "success", text: `Station Hub "${newB.name}" created successfully!` });
      adminApi.createBranch(newB);
    }
    setIsAddEditModalOpen(false);
    setEditingBranch(null);
  };

  const handleDeleteBranch = (id: number) => {
    if (confirm("Are you sure you want to delete this station hub?")) {
      setBranches((prev) => prev.filter((b) => b.id !== id));
      setNotice({ type: "info", text: `Station Hub #${id} deleted.` });
    }
  };


  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Building2 className="w-6 h-6 text-[#D4AF37]" /> Station Hubs & Dispatch Centers
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Manage pickup station locations, managers, 24/7 operating hours, stationed cars, and revenue
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
            <input
              type="text"
              placeholder="Search branch, city, manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#14081E] border border-purple-500/30 rounded-2xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            onClick={() => {
              setEditingBranch(null);
              setIsAddEditModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:opacity-95"
          >
            <Plus className="w-4 h-4" /> Add Station Hub
          </button>
        </div>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Active Station Hubs</span>
          <h4 className="text-2xl font-black text-white mt-1">{branches.length} Locations</h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">100% Operational</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Stationed Fleet Total</span>
          <h4 className="text-2xl font-black text-[#D4AF37] mt-1">
            {branches.reduce((acc, b) => acc + b.totalCars, 0)} Cars
          </h4>
          <p className="text-[10px] text-purple-300 mt-0.5">Across All Branches</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Total Station Staff</span>
          <h4 className="text-2xl font-black text-purple-200 mt-1">
            {branches.reduce((acc, b) => acc + b.staffCount, 0)} Agents
          </h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">24/7 Handover Ready</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Monthly Network Revenue</span>
          <h4 className="text-2xl font-black text-emerald-400 mt-1">
            ₹{branches.reduce((acc, b) => acc + b.monthlyRevenue, 0).toLocaleString()}
          </h4>
          <p className="text-[10px] text-purple-300 mt-0.5">September 2026</p>
        </div>
      </div>

      {/* BRANCH CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBranches.map((br) => (
          <div
            key={br.id}
            className="p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-2xl space-y-4 hover:border-[#D4AF37]/50 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">HUB #{br.id}</span>
                <h4 className="font-black text-base text-white mt-0.5">{br.name}</h4>
                <p className="text-[11px] text-purple-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" /> {br.city}, {br.state}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
            </div>

            <p className="text-xs text-purple-200/80 bg-[#14081E] p-3 rounded-2xl border border-purple-500/20">
              {br.address}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-purple-400 text-[10px] block font-bold">Station Manager</span>
                <p className="font-bold text-white">{br.managerName}</p>
                <p className="text-[10px] text-purple-300">{br.managerPhone}</p>
              </div>
              <div>
                <span className="text-purple-400 text-[10px] block font-bold">Operating Hours</span>
                <p className="font-bold text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {br.operatingHours}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-purple-500/20 flex justify-between items-center text-xs">
              <div>
                <span className="text-purple-400 text-[10px] block">Stationed Fleet</span>
                <button
                  onClick={() => setViewingFleetBranch(br)}
                  className="font-bold text-white hover:text-[#D4AF37] underline"
                >
                  {br.totalCars} Cars &bull; {br.staffCount} Staff
                </button>
              </div>
              <div className="text-right">
                <span className="text-purple-400 text-[10px] block">Monthly Gross</span>
                <p className="font-black text-[#D4AF37]">₹{br.monthlyRevenue.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setEditingBranch(br);
                  setIsAddEditModalOpen(true);
                }}
                className="p-2 rounded-xl bg-purple-950/60 hover:bg-[#432650] text-purple-200 border border-purple-500/30 text-xs font-bold flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Hub
              </button>
              <button
                onClick={() => handleDeleteBranch(br.id)}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ====================================================================
          MODAL 1: ADD / EDIT BRANCH
          ==================================================================== */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#D4AF37]" /> {editingBranch ? `Edit Station Hub: ${editingBranch.name}` : "Create New Station Hub"}
              </h3>
              <button onClick={() => setIsAddEditModalOpen(false)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const t = e.target as any;
                handleSaveBranch({
                  name: t.name.value,
                  city: t.city.value,
                  state: t.state.value,
                  address: t.address.value,
                  operatingHours: t.operatingHours.value,
                  managerName: t.managerName.value,
                  managerPhone: t.managerPhone.value,
                  managerEmail: t.managerEmail.value,
                  totalCars: parseInt(t.totalCars.value) || 5,
                  staffCount: parseInt(t.staffCount.value) || 3,
                  monthlyRevenue: parseInt(t.monthlyRevenue.value) || 150000,
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-purple-300 font-bold mb-1">Hub Name *</label>
                <input
                  name="name"
                  defaultValue={editingBranch?.name || ""}
                  required
                  placeholder="Tirupati Central Hub"
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">City *</label>
                  <input
                    name="city"
                    defaultValue={editingBranch?.city || "Tirupati"}
                    required
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">State *</label>
                  <input
                    name="state"
                    defaultValue={editingBranch?.state || "Andhra Pradesh"}
                    required
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Full Station Address *</label>
                <input
                  name="address"
                  defaultValue={editingBranch?.address || ""}
                  required
                  placeholder="Opposite Main Bus Stand, Railway Station Road..."
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Station Manager Name</label>
                  <input
                    name="managerName"
                    defaultValue={editingBranch?.managerName || "M. Ramesh Reddy"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Manager Mobile Phone</label>
                  <input
                    name="managerPhone"
                    defaultValue={editingBranch?.managerPhone || "+91 94400 11223"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Operating Hours</label>
                  <input
                    name="operatingHours"
                    defaultValue={editingBranch?.operatingHours || "24 Hours (7 Days)"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Stationed Cars</label>
                  <input
                    name="totalCars"
                    type="number"
                    defaultValue={editingBranch?.totalCars || 6}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Staff Count</label>
                  <input
                    name="staffCount"
                    type="number"
                    defaultValue={editingBranch?.staffCount || 4}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Monthly Gross Revenue (₹)</label>
                <input
                  name="monthlyRevenue"
                  type="number"
                  defaultValue={editingBranch?.monthlyRevenue || 250000}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-emerald-400 font-bold"
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
                  {editingBranch ? "Save Hub Changes" : "Create Station Hub"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: VIEW BRANCH FLEET BREAKDOWN
          ==================================================================== */}
      {viewingFleetBranch && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <Car className="w-5 h-5 text-[#D4AF37]" /> Station Fleet: {viewingFleetBranch.name}
              </h3>
              <button onClick={() => setViewingFleetBranch(null)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {fleet
                .filter((c) => c.branch === viewingFleetBranch.name)
                .map((c) => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt={c.name} className="w-12 h-10 object-cover rounded-xl border border-purple-500/30" />
                      <div>
                        <p className="font-bold text-white">{c.name}</p>
                        <p className="text-[10px] text-purple-300 font-mono">{c.registrationNumber}</p>
                        <p className="text-[9px] text-[#D4AF37]">{c.category} &bull; {c.fuelType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-400">{c.price}/day</p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        c.status === "Available" ? "bg-emerald-500/20 text-emerald-300" : "bg-blue-500/20 text-blue-300"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-purple-500/20">
              <button
                onClick={() => setViewingFleetBranch(null)}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs"
              >
                Close Fleet
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
