import React, { useState, useMemo } from "react";
import {
  Tag,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Sparkles,
  Car,
  Shield,
  Award,
  Zap,
  Users,
  Flame,
  Compass,
  CheckCircle2,
  Eye,
  Sliders,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { CategoryItem, CarItem } from "./types";
import { adminApi } from "./adminApi";

interface CategoryManagementProps {
  categories: CategoryItem[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
  fleet: CarItem[];
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

const AVAILABLE_ICONS = [
  { id: "Car", label: "Standard Car", icon: Car },
  { id: "Shield", label: "SUV / Rugged", icon: Shield },
  { id: "Award", label: "Luxury / Premium", icon: Award },
  { id: "Zap", label: "Electric / EV", icon: Zap },
  { id: "Users", label: "Van / MUV (7+)", icon: Users },
  { id: "Sparkles", label: "Exclusive / VIP", icon: Sparkles },
  { id: "Flame", label: "Supercar / Sport", icon: Flame },
  { id: "Compass", label: "Off-Road / Adventure", icon: Compass },
];

export default function CategoryManagement({
  categories,
  setCategories,
  fleet,
  setNotice,
}: CategoryManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Compute number of vehicles in each category
  const categoryCarCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    fleet.forEach((car) => {
      const cat = car.category || "Unassigned";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [fleet]);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && cat.isActive) ||
        (filterStatus === "inactive" && !cat.isActive);

      return matchSearch && matchStatus;
    });
  }, [categories, searchQuery, filterStatus]);

  const handleSaveCategory = async (formData: Partial<CategoryItem>) => {
    const name = (formData.name || "").trim();
    if (!name) {
      setNotice({ type: "error", text: "Category name cannot be empty." });
      return;
    }

    if (editingCategory) {
      const updated: CategoryItem = {
        ...editingCategory,
        ...formData,
        name,
      };

      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? updated : c))
      );
      setNotice({ type: "success", text: `Category "${name}" updated successfully!` });
      setIsAddEditModalOpen(false);
      setEditingCategory(null);

      const res = await adminApi.updateCategory(editingCategory.id, updated);
      if (res) {
        setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? res : c)));
      }
    } else {
      const tempId = Math.floor(100 + Math.random() * 900);
      const newCat: CategoryItem = {
        id: tempId,
        name,
        description: formData.description || "",
        icon: formData.icon || "Car",
        image: formData.image || undefined,
        displayOrder: formData.displayOrder !== undefined ? formData.displayOrder : categories.length + 1,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
      };

      setCategories((prev) => [...prev, newCat]);
      setNotice({ type: "success", text: `New Category "${name}" created!` });
      setIsAddEditModalOpen(false);

      const saved = await adminApi.createCategory(newCat);
      if (saved && saved.id) {
        setCategories((prev) =>
          prev.map((c) => (c.id === tempId ? saved : c))
        );
      }
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    const vehicleCount = categoryCarCounts[name] || 0;
    const confirmMsg = vehicleCount > 0
      ? `Category "${name}" has ${vehicleCount} active vehicle(s) assigned to it. Deleting will not delete the vehicles, but will remove this category from customer filters. Continue?`
      : `Are you sure you want to delete category "${name}"?`;

    if (window.confirm(confirmMsg)) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setNotice({ type: "info", text: `Category "${name}" deleted.` });
      await adminApi.deleteCategory(id);
    }
  };

  const handleToggleActive = async (cat: CategoryItem) => {
    const newStatus = !cat.isActive;
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, isActive: newStatus } : c))
    );
    setNotice({
      type: "info",
      text: `Category "${cat.name}" is now ${newStatus ? "Active (visible to users)" : "Inactive (hidden from users)"}.`,
    });
    await adminApi.updateCategory(cat.id, { isActive: newStatus });
  };

  const renderIcon = (iconName?: string) => {
    const found = AVAILABLE_ICONS.find((i) => i.id === iconName);
    const IconComp = found ? found.icon : Car;
    return <IconComp className="w-4 h-4 text-[#c88d18]" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1426]/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#c88d18]/10 text-[#c88d18] border border-[#c88d18]/20">
              <Tag className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Fleet Categories & Filter Management
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Create and manage custom vehicle categories. Active categories dynamically populate the user-facing search, filter tabs, and fleet wizard.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setIsAddEditModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-slate-950 font-black text-xs shadow-lg shadow-[#c88d18]/20 flex items-center gap-2 transition-all hover:scale-[1.02] self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0b1426]/40 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Categories</div>
          <div className="text-2xl font-black text-white mt-1">{categories.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Configured in system</div>
        </div>

        <div className="bg-[#0b1426]/40 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active for Customers</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {categories.filter((c) => c.isActive).length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Shown on website search & filters</div>
        </div>

        <div className="bg-[#0b1426]/40 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Vehicles</div>
          <div className="text-2xl font-black text-[#c88d18] mt-1">{fleet.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Total cars in active fleet</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0b1426]/60 border border-slate-800 p-3.5 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search category name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#070e1c] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c88d18]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(["all", "active", "inactive"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filterStatus === st
                  ? "bg-[#c88d18] text-slate-950 font-black shadow-md"
                  : "bg-[#070e1c] text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {st} ({st === "all" ? categories.length : categories.filter((c) => (st === "active" ? c.isActive : !c.isActive)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-3xl bg-[#0b1426]/30">
          <Tag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-white">No categories found matching your query</p>
          <p className="text-xs text-slate-500 mt-1">Try changing search keyword or add a new category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => {
            const count = categoryCarCounts[cat.name] || 0;
            return (
              <div
                key={cat.id}
                className="bg-[#0b1426]/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-black/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-[#070e1c] border border-slate-800 shadow-inner">
                        {renderIcon(cat.icon)}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white group-hover:text-[#c88d18] transition-colors">
                          {cat.name}
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400">
                          Order: #{cat.displayOrder || 0}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                        cat.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {cat.description || "Custom category for categorized customer self-drive rentals."}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <Car className="w-3.5 h-3.5 text-[#c88d18]" />
                    <span>{count} {count === 1 ? "Vehicle" : "Vehicles"}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsAddEditModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-[#070e1c] border border-slate-800 text-slate-300 hover:text-white hover:border-[#c88d18] transition-all"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 rounded-lg bg-[#070e1c] border border-slate-800 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#c88d18]" />
                <h3 className="text-base font-black">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddEditModalOpen(false);
                  setEditingCategory(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                handleSaveCategory({
                  name: form.name?.value,
                  description: form.description?.value,
                  icon: form.icon?.value,
                  displayOrder: parseInt(form.displayOrder?.value) || 0,
                  isActive: form.isActive?.checked,
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-400 font-bold mb-1">Category Name *</label>
                <input
                  name="name"
                  defaultValue={editingCategory?.name || ""}
                  placeholder="e.g. 7-Seater Luxury, Convertible, Budget Hatchback"
                  required
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#c88d18]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingCategory?.description || ""}
                  placeholder="Short description shown to customers on filter tabs..."
                  rows={3}
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#c88d18] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Icon Representation</label>
                  <select
                    name="icon"
                    defaultValue={editingCategory?.icon || "Car"}
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c88d18]"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.id} value={ic.id}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Display Order</label>
                  <input
                    name="displayOrder"
                    type="number"
                    defaultValue={editingCategory?.displayOrder !== undefined ? editingCategory.displayOrder : categories.length + 1}
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#c88d18]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCat"
                  name="isActive"
                  defaultChecked={editingCategory ? editingCategory.isActive : true}
                  className="w-4 h-4 rounded text-[#c88d18] focus:ring-0 bg-[#070e1c] border-slate-700"
                />
                <label htmlFor="isActiveCat" className="text-slate-300 font-bold cursor-pointer">
                  Active (Visible on website filters and booking portal)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddEditModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#070e1c] border border-slate-800 text-slate-400 font-bold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black shadow-md hover:bg-[#d49b29]"
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
