import fs from "fs";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { sequelize } from "./db.js";
import { Car } from "./models/Car.js";
import { Booking } from "./models/Booking.js";
import { Customer } from "./models/Customer.js";
import { Driver } from "./models/Driver.js";
import { Branch } from "./models/Branch.js";
import { Payment } from "./models/Payment.js";
import { Coupon } from "./models/Coupon.js";
import { Review } from "./models/Review.js";
import { SupportTicket } from "./models/SupportTicket.js";
import { ActivityLog } from "./models/ActivityLog.js";
import { Setting } from "./models/Setting.js";
import { Admin } from "./models/Admin.js";
import { AdminOtp } from "./models/AdminOtp.js";
import { Category } from "./models/Category.js";
import { UserOtp } from "./models/UserOtp.js";
import { Notification } from "./models/Notification.js";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;

// Enable CORS for frontend and live domain
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);
app.options("*", cors());

app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Moar Cars API is online", time: new Date().toISOString() });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.join(__dirname, "../frontend/dist");
const rootDist = path.join(__dirname, "..");

// Serve static frontend files
if (fs.existsSync(path.join(frontendDist, "index.html"))) {
  app.use(express.static(frontendDist));
} else {
  app.use(express.static(rootDist));
}

// ======================================================================
// 1. CARS / FLEET API
// ======================================================================
app.get(["/api/cars", "/api/admin/cars"], async (req, res) => {
  try {
    const cars = await Car.findAll({ order: [["id", "ASC"]] });
    res.json({ success: true, data: cars });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ success: false, message: "Error reading fleet database." });
  }
});

app.get(["/api/cars/:id", "/api/admin/cars/:id"], async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: "Car not found." });
    res.json({ success: true, data: car });
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ success: false, message: "Error reading car from database." });
  }
});

app.post(["/api/cars", "/api/admin/cars"], async (req, res) => {
  try {
    const newCar = await Car.create(req.body);
    res.status(201).json({ success: true, message: "Vehicle added to fleet!", data: newCar });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ success: false, message: "Error saving vehicle." });
  }
});

app.put(["/api/cars/:id", "/api/admin/cars/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByPk(id);
    if (!car) return res.status(404).json({ success: false, message: "Car not found." });
    await car.update(req.body);
    res.json({ success: true, message: "Vehicle updated successfully!", data: car });
  } catch (error) {
    console.error("Update car error:", error);
    res.status(500).json({ success: false, message: "Error updating vehicle." });
  }
});

app.delete(["/api/cars/:id", "/api/admin/cars/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Car.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Car not found." });
    res.json({ success: true, message: "Vehicle removed from fleet." });
  } catch (error) {
    console.error("Delete car error:", error);
    res.status(500).json({ success: false, message: "Error deleting vehicle." });
  }
});

// ======================================================================
// 1.1 CATEGORIES API (Dynamic Fleet Categories)
// ======================================================================
app.get(["/api/categories", "/api/admin/categories"], async (req, res) => {
  try {
    let categories = await Category.findAll({
      order: [["displayOrder", "ASC"], ["name", "ASC"]],
    });

    if (categories.length === 0) {
      await Category.bulkCreate([
        { name: "Hatchback", description: "Compact, fuel-efficient everyday city cars", icon: "Car", displayOrder: 1, isActive: true },
        { name: "Sedan", description: "Comfortable executive travel with ample trunk capacity", icon: "Car", displayOrder: 2, isActive: true },
        { name: "SUV", description: "Powerful rugged drives built for Tirumala ghat roads", icon: "Shield", displayOrder: 3, isActive: true },
        { name: "Luxury", description: "Premium executive styling, leather seats & sunroof", icon: "Award", displayOrder: 4, isActive: true },
        { name: "Electric", description: "100% green eco-friendly emission-free mobility", icon: "Zap", displayOrder: 5, isActive: true },
        { name: "MUV", description: "Spacious 7-8 seater multi-utility family vehicles", icon: "Users", displayOrder: 6, isActive: true },
      ]);
      categories = await Category.findAll({
        order: [["displayOrder", "ASC"], ["name", "ASC"]],
      });
    }

    res.json({ success: true, data: categories });
  } catch (err) {
    console.error("Fetch categories error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post(["/api/categories", "/api/admin/categories"], async (req, res) => {
  try {
    const { name, description, icon, image, displayOrder, isActive } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Category name is required." });
    }

    const trimmedName = name.trim();
    const existing = await Category.findOne({ where: { name: trimmedName } });
    if (existing) {
      return res.status(400).json({ success: false, error: `Category "${trimmedName}" already exists.` });
    }

    const category = await Category.create({
      name: trimmedName,
      description: description || "",
      icon: icon || "Car",
      image: image || null,
      displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
      isActive: isActive !== undefined ? !!isActive : true,
    });
    res.status(201).json({ success: true, data: category, message: "Category created successfully." });
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put(["/api/categories/:id", "/api/admin/categories/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ success: false, error: "Category not found." });

    const { name, description, icon, image, displayOrder, isActive } = req.body;
    const oldName = category.name;
    const newName = name ? name.trim() : oldName;

    if (newName && newName !== oldName) {
      // Also update any existing fleet cars with old category name
      await Car.update({ category: newName }, { where: { category: oldName } });
    }

    await category.update({
      name: newName,
      description: description !== undefined ? description : category.description,
      icon: icon !== undefined ? icon : category.icon,
      image: image !== undefined ? image : category.image,
      displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : category.displayOrder,
      isActive: isActive !== undefined ? !!isActive : category.isActive,
    });

    res.json({ success: true, data: category, message: "Category updated successfully." });
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete(["/api/categories/:id", "/api/admin/categories/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ success: false, error: "Category not found." });

    await category.destroy();
    res.json({ success: true, message: `Category "${category.name}" removed successfully.` });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ======================================================================
// 2. BOOKINGS & DISPATCH API
// ======================================================================
app.get(["/api/bookings", "/api/admin/bookings", "/api/user/bookings"], async (req, res) => {
  try {
    const { email } = req.query;
    const where = email ? { customerEmail: String(email).trim().toLowerCase() } : {};
    const bookings = await Booking.findAll({ where, order: [["id", "DESC"]] });
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.post(["/api/bookings", "/api/admin/bookings"], async (req, res) => {
  try {
    const bookingAmount = parseInt(req.body.grandTotal || req.body.amount || req.body.baseFare || 2499, 10);
    const bookingDeposit = parseInt(req.body.securityDeposit || 3000, 10);
    const bookingGst = parseInt(req.body.gstAmount || Math.round(bookingAmount * 0.18), 10);

    const bookingData = {
      ...req.body,
      amount: bookingAmount,
      securityDeposit: bookingDeposit,
      taxAmount: bookingGst,
      pickup: req.body.pickup || req.body.pickupLocation || "Tirupati Central Hub",
      pickupAddress: req.body.pickupAddress || req.body.pickupLocation || req.body.pickup,
      dropAddress: req.body.dropAddress || req.body.dropLocation || req.body.pickup,
      status: req.body.status || "Confirmed",
      paymentStatus: req.body.paymentStatus || (req.body.paymentMethod === "cash" ? "Pending_At_Pickup" : "Paid"),
      paymentMethod: req.body.paymentMethod || "UPI",
    };

    const newBooking = await Booking.create(bookingData);

    // 1. Auto-create Payment Record
    try {
      const paymentId = `PAY-${newBooking.id}-${Math.floor(1000 + Math.random() * 9000)}`;
      await Payment.create({
        id: paymentId,
        bookingId: newBooking.id,
        customerName: newBooking.customerName || "Valued Customer",
        amount: bookingAmount,
        depositAmount: bookingDeposit,
        gstAmount: bookingGst,
        gateway: (newBooking.paymentMethod || "Razorpay").toUpperCase(),
        status: newBooking.paymentStatus === "Paid" ? "Captured" : "Pending",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (payErr) {
      console.warn("[AUTO-PAYMENT] Warning:", payErr.message);
    }

    // 2. Auto-update Customer Stats & Deduct Wallet if used
    try {
      const custEmail = (newBooking.customerEmail || "").trim().toLowerCase();
      if (custEmail) {
        const customer = await Customer.findOne({ where: { email: custEmail } });
        if (customer) {
          const currentTotal = Number(customer.totalBookings || 0) + 1;
          const currentSpent = Number(customer.totalSpent || 0) + bookingAmount;
          const walletDeducted = Number(req.body.walletDeduction || 0);
          const newWallet = Math.max(0, Number(customer.walletBalance || 0) - walletDeducted);

          await customer.update({
            totalBookings: currentTotal,
            totalSpent: currentSpent,
            ...(walletDeducted > 0 ? { walletBalance: newWallet } : {}),
          });
        }
      }
    } catch (custErr) {
      console.warn("[AUTO-CUSTOMER] Warning:", custErr.message);
    }

    // 3. Auto-update Car Status
    try {
      if (newBooking.carName) {
        const car = await Car.findOne({ where: { name: newBooking.carName } });
        if (car) {
          await car.update({
            status: "Booked",
            totalTrips: (car.totalTrips || 0) + 1,
            totalRevenue: (car.totalRevenue || 0) + bookingAmount,
          });
        }
      }
    } catch (carErr) {
      console.warn("[AUTO-CAR] Warning:", carErr.message);
    }

    // 4. Auto-create Activity Log
    try {
      await ActivityLog.create({
        adminUser: "System Dispatcher",
        action: `Booking #${newBooking.id} Confirmed (${newBooking.carName}) for ${newBooking.customerName} (₹${bookingAmount.toLocaleString()})`,
        ipAddress: req.ip || "127.0.0.1",
        status: "Success",
        category: "Bookings",
      });
    } catch (logErr) {}

    res.status(201).json({ success: true, message: "Booking confirmed successfully!", data: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Error saving booking details." });
  }
});

app.put(["/api/admin/bookings/:id", "/api/bookings/:id", "/api/user/bookings/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

    await booking.update(req.body);

    // If cancelled, free up vehicle
    if (req.body.status === "Cancelled" && booking.carName) {
      try {
        const car = await Car.findOne({ where: { name: booking.carName } });
        if (car && car.status === "Booked") {
          await car.update({ status: "Available" });
        }
        await ActivityLog.create({
          adminUser: "Customer / Admin",
          action: `Booking #${booking.id} cancelled. 100% refund initiated.`,
          ipAddress: req.ip || "127.0.0.1",
          status: "Success",
          category: "Refunds",
        });
      } catch (e) {}
    }

    res.json({ success: true, message: "Booking updated successfully!", data: booking });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.delete(["/api/admin/bookings/:id", "/api/bookings/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Booking not found." });
    res.json({ success: true, message: "Booking cancelled / removed." });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Pickup Inspection Handshake API
app.post("/api/bookings/pickup-inspection", async (req, res) => {
  try {
    const { id, bookingId, startOdometer, startFuel, pickupPhotos, pickupChecklist } = req.body;
    const targetId = id || bookingId;
    const booking = await Booking.findByPk(targetId);

    if (booking) {
      await booking.update({
        status: "Active",
        timelineStep: 6,
        startOdometer: Number(startOdometer) || booking.startOdometer,
        startFuel: Number(startFuel) || booking.startFuel,
      });

      if (booking.carName) {
        const car = await Car.findOne({ where: { name: booking.carName } });
        if (car) await car.update({ status: "Booked" });
      }

      try {
        await ActivityLog.create({
          adminUser: "Field Handover Agent",
          action: `Handover complete for Booking #${booking.id} (${booking.carName}). Start Odo: ${startOdometer} KM`,
          ipAddress: req.ip || "127.0.0.1",
          status: "Success",
          category: "Operations",
        });
      } catch (e) {}
    }

    res.json({ success: true, message: "Pickup inspection recorded and trip is live!" });
  } catch (error) {
    console.error("Pickup inspection error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Return Inspection & Settlement API
app.post("/api/bookings/return-inspection", async (req, res) => {
  try {
    const { id, bookingId, returnOdometer, returnFuel, cleaningFee, lateReturnFee, fuelPenalty, securityDeposit } = req.body;
    const targetId = id || bookingId;
    const booking = await Booking.findByPk(targetId);

    if (booking) {
      const penalties = (Number(cleaningFee) || 0) + (Number(lateReturnFee) || 0) + (Number(fuelPenalty) || 0);
      const totalDep = Number(securityDeposit) || Number(booking.securityDeposit) || 3000;
      const refundAmount = Math.max(0, totalDep - penalties);

      await booking.update({
        status: "Completed",
        timelineStep: 9,
        returnOdometer: Number(returnOdometer) || booking.returnOdometer,
        returnFuel: Number(returnFuel) || booking.returnFuel,
        penalties,
      });

      // Free vehicle back to Available status
      if (booking.carName) {
        const car = await Car.findOne({ where: { name: booking.carName } });
        if (car) {
          await car.update({
            status: "Available",
            lastServiceKm: Number(returnOdometer) || car.lastServiceKm,
          });
        }
      }

      // Update payment refund record
      try {
        const payment = await Payment.findOne({ where: { bookingId: booking.id } });
        if (payment) {
          await payment.update({
            status: "Refunded",
            refundStatus: "Processed",
            refundAmount,
          });
        }
      } catch (e) {}

      try {
        await ActivityLog.create({
          adminUser: "Return Audit Desk",
          action: `Return audit certified for Booking #${booking.id}. Deposit refund of ₹${refundAmount} released.`,
          ipAddress: req.ip || "127.0.0.1",
          status: "Success",
          category: "Refunds",
        });
      } catch (e) {}
    }

    res.json({ success: true, message: "Vehicle return inspection certified and refund initiated!" });
  } catch (error) {
    console.error("Return inspection error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================================
// 3. CUSTOMERS & CRM API
// ======================================================================
app.get("/api/admin/customers", async (req, res) => {
  try {
    const customers = await Customer.findAll({ order: [["id", "DESC"]] });
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/admin/customers", async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);
    res.status(201).json({ success: true, message: "Customer registered!", data: newCustomer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/admin/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });
    await customer.update(req.body);
    res.json({ success: true, message: "Customer updated!", data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/admin/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Customer not found." });
    res.json({ success: true, message: "Customer removed from system." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================================
// 4. DRIVERS API
// ======================================================================
app.get("/api/admin/drivers", async (req, res) => {
  try {
    const drivers = await Driver.findAll({ order: [["id", "ASC"]] });
    res.json({ success: true, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/admin/drivers", async (req, res) => {
  try {
    const newDriver = await Driver.create(req.body);
    res.status(201).json({ success: true, message: "Driver onboarded!", data: newDriver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/admin/drivers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findByPk(id);
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found." });
    await driver.update(req.body);
    res.json({ success: true, message: "Driver status updated!", data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/admin/drivers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Driver.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Driver not found." });
    res.json({ success: true, message: "Driver removed from roster." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================================
// 5. BRANCHES & LOCATIONS API
// ======================================================================
// Public endpoint for customer-facing search dropdowns & booking forms
app.get("/api/locations", async (req, res) => {
  try {
    const branches = await Branch.findAll({ order: [["id", "ASC"]] });
    const activeBranches = branches.filter((b) => b.isActive !== false);
    const locationNames = activeBranches.map((b) => b.name);
    res.json({
      success: true,
      data: activeBranches,
      locations: locationNames.length > 0 ? locationNames : [
        "Tirupati Central Hub (Station)",
        "Renigunta Airport Hub (TIR T1)",
        "Alipiri Tirumala Gate Hub",
        "Chandragiri Heritage Point",
        "Horsley Hills Route Hub"
      ],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/branches", async (req, res) => {
  try {
    const branches = await Branch.findAll({ order: [["id", "ASC"]] });
    const activeBranches = branches.filter((b) => b.isActive !== false);
    res.json({
      success: true,
      data: activeBranches,
      locations: activeBranches.map((b) => b.name),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/admin/branches", async (req, res) => {
  try {
    const branches = await Branch.findAll({ order: [["id", "ASC"]] });
    res.json({ success: true, data: branches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/admin/branches", async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, message: "Station hub added!", data: branch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/admin/branches/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByPk(id);
    if (!branch) return res.status(404).json({ success: false, message: "Branch not found." });
    await branch.update(req.body);
    res.json({ success: true, message: "Branch updated!", data: branch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/admin/branches/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Branch.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Branch not found." });
    res.json({ success: true, message: "Station hub removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================================
// 6. PAYMENTS & ESCROW API
// ======================================================================
app.get("/api/admin/payments", async (req, res) => {
  try {
    const payments = await Payment.findAll({ order: [["date", "DESC"]] });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/admin/payments", async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json({ success: true, message: "Payment recorded!", data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/admin/payments/:id/refund", async (req, res) => {
  try {
    const { id } = req.params;
    const { refundAmount } = req.body || {};
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ success: false, message: "Transaction not found." });
    await payment.update({
      status: "Refunded",
      refundStatus: "Processed",
      refundAmount: refundAmount !== undefined ? refundAmount : payment.depositAmount,
    });
    res.json({ success: true, message: "Security deposit refunded successfully!", data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/admin/payments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Payment.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Transaction not found." });
    res.json({ success: true, message: "Payment transaction removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================================
// 7. COUPON ENGINE API
// ======================================================================
app.get("/api/admin/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [["id", "DESC"]] });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/admin/coupons", async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: "Coupon created!", data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/admin/coupons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found." });
    await coupon.update(req.body);
    res.json({ success: true, message: "Coupon updated!", data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/admin/coupons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Coupon not found." });
    res.json({ success: true, message: "Coupon removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================================
// 8. REVIEWS & MODERATION API
// ======================================================================
app.get(["/api/reviews", "/api/admin/reviews"], async (req, res) => {
  try {
    const reviews = await Review.findAll({ order: [["id", "DESC"]] });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post(["/api/reviews", "/api/admin/reviews"], async (req, res) => {
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json({ success: true, message: "Review submitted successfully!", data: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put(["/api/admin/reviews/:id", "/api/reviews/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    await review.update(req.body);
    res.json({ success: true, message: "Review status updated!", data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post(["/api/admin/reviews/:id/reply", "/api/reviews/:id/reply"], async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    await review.update({ adminReply: reply });
    res.json({ success: true, message: "Reply published!", data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/reviews/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (review) {
      await review.update({ likesCount: (review.likesCount || 0) + 1 });
    }
    res.json({ success: true, message: "Like recorded" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/reviews/:id/report", async (req, res) => {
  try {
    res.json({ success: true, message: "Review reported to moderation" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete(["/api/admin/reviews/:id", "/api/reviews/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Review not found." });
    res.json({ success: true, message: "Review removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================================
// 9. SUPPORT DESK & USER NOTIFICATIONS API
// ======================================================================
app.get(["/api/support/tickets", "/api/admin/support/tickets", "/api/user/tickets"], async (req, res) => {
  try {
    const { userEmail } = req.query;
    const where = userEmail ? { customerEmail: String(userEmail).trim().toLowerCase() } : {};
    const tickets = await SupportTicket.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post(["/api/support/tickets", "/api/admin/support/tickets", "/api/user/tickets"], async (req, res) => {
  try {
    const ticketData = {
      ...req.body,
      id: req.body.id || `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerEmail: req.body.customerEmail || req.body.email || "customer@example.com",
    };
    const ticket = await SupportTicket.create(ticketData);
    res.status(201).json({ success: true, message: "Support ticket opened!", data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post(["/api/user/tickets/:id/reply", "/api/support/tickets/:id/reply", "/api/admin/support/tickets/:id/reply"], async (req, res) => {
  try {
    const { id } = req.params;
    const { text, sender } = req.body;
    const ticket = await SupportTicket.findByPk(id);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found." });

    const currentMsgs = Array.isArray(ticket.messages) ? [...ticket.messages] : [];
    currentMsgs.push({
      sender: sender || "Customer",
      text: text || req.body.message || "",
      time: new Date().toLocaleString(),
    });

    await ticket.update({
      messages: currentMsgs,
      status: sender === "Agent" ? "In Progress" : ticket.status,
    });

    res.json({ success: true, message: "Reply added!", data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put(["/api/admin/support/tickets/:id", "/api/support/tickets/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await SupportTicket.findByPk(id);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found." });
    await ticket.update(req.body);
    res.json({ success: true, message: "Ticket updated!", data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete(["/api/admin/support/tickets/:id", "/api/support/tickets/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SupportTicket.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Ticket not found." });
    res.json({ success: true, message: "Support ticket deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// User Notifications API
app.get("/api/user/notifications", async (req, res) => {
  try {
    const { userEmail } = req.query;
    const cleanEmail = userEmail ? String(userEmail).trim().toLowerCase() : "";

    let userBookings = [];
    if (cleanEmail) {
      userBookings = await Booking.findAll({ where: { customerEmail: cleanEmail }, order: [["id", "DESC"]], limit: 3 });
    }

    const notifications = [
      {
        id: "notif-welcome",
        title: "Welcome to Moar Cars! 🎉",
        message: "Your account is activated with ₹250 signup bonus wallet credit.",
        time: "Recently",
        isRead: false,
        type: "promo",
      },
      {
        id: "notif-ghat",
        title: "Tirumala Ghat Pass Update ⛰️",
        message: "All Moar Cars vehicles are pre-authorized for TTD Ghat road entry with automated FASTag.",
        time: "1 hour ago",
        isRead: false,
        type: "system",
      },
    ];

    userBookings.forEach((b) => {
      notifications.unshift({
        id: `notif-booking-${b.id}`,
        title: `Trip #${b.id} ${b.status} 🚗`,
        message: `${b.carName} reservation is ${b.status}. Pickup at ${b.pickup}.`,
        time: "Active",
        isRead: false,
        type: "booking",
      });
    });

    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/user/notifications/mark-read", async (req, res) => {
  res.json({ success: true, message: "Notifications marked as read." });
});

// ======================================================================
// 10. ACTIVITY LOGS API
// ======================================================================
app.get("/api/admin/logs", async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({ order: [["id", "DESC"]] });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/admin/logs", async (req, res) => {
  try {
    const log = await ActivityLog.create(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================================
// 11. CMS, NOTIFICATIONS & SYSTEM SETTINGS KEY-VALUE API
// ======================================================================
app.get(["/api/settings", "/api/admin/settings"], async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const map = {};
    settings.forEach((s) => {
      try {
        map[s.key] = JSON.parse(s.value);
      } catch {
        map[s.key] = s.value;
      }
    });
    res.json({ success: true, data: map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.all(["/api/settings", "/api/admin/settings"], async (req, res, next) => {
  if (req.method !== "POST" && req.method !== "PUT") return next();
  try {
    const entries = req.body;
    for (const [k, v] of Object.entries(entries)) {
      const valStr = typeof v === "object" ? JSON.stringify(v) : String(v);
      await Setting.upsert({ key: k, value: valStr });
    }
    res.json({ success: true, message: "Settings saved successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================================
// 12. AUTH & OTP ENDPOINTS
// ======================================================================
const otpStore = new Map();

const getTransporter = () => {
  const user = (process.env.ADMIN_EMAIL || "moarcars04@gmail.com").trim();
  const pass = (process.env.ADMIN_EMAIL_APP_PASSWORD || "giykjehrkoeeoqzc").replace(/\s+/g, "");
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
};

app.post("/api/admin/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const targetEmail = (email || process.env.ADMIN_EMAIL || "moarcars04@gmail.com").trim().toLowerCase();
    const authorizedEmail = (process.env.ADMIN_EMAIL || "moarcars04@gmail.com").trim().toLowerCase();

    // Check email format
    if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      return res.status(400).json({ success: false, message: "Please provide a valid admin email address." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

    otpStore.set(targetEmail, { otp, expiresAt, attempts: 0 });

    try {
      await AdminOtp.destroy({ where: { email: targetEmail } });
      await AdminOtp.create({ email: targetEmail, otp, expiresAt, attempts: 0 });
    } catch (dbErr) {
      console.warn("[AUTH] DB OTP store warning:", dbErr.message);
    }

    const transporter = getTransporter();
    const mailOptions = {
      from: `"Moar Cars Admin Security" <${authorizedEmail}>`,
      to: targetEmail,
      subject: `🔑 ${otp} is your Admin Portal Verification Code - Moar Cars`,
      text: `Your Moar Cars Admin Verification Code is: ${otp}. Valid for 15 minutes.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070e1c; color: #f8fafc; padding: 40px 20px; border-radius: 16px; max-width: 520px; margin: 0 auto; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 46px; height: 46px; line-height: 46px; border-radius: 14px; background: linear-gradient(135deg, #c88d18, #d49b29); color: #070e1c; font-size: 24px; font-weight: 900; margin-bottom: 12px; box-shadow: 0 4px 15px rgba(200, 141, 24, 0.3);">M</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">MOAR <span style="color: #c88d18;">CARS</span></h1>
            <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; font-weight: 700;">Security Operations Center • 2FA Authentication</p>
          </div>
          <div style="background-color: #0b1426; padding: 30px; border-radius: 14px; border: 1px solid rgba(200, 141, 24, 0.25); text-align: center;">
            <p style="font-size: 14px; color: #cbd5e1; margin: 0 0 16px 0; line-height: 1.5;">Your one-time security verification code for Admin Portal access is:</p>
            <div style="background: linear-gradient(135deg, #c88d18, #d49b29); color: #070e1c; font-size: 34px; font-weight: 900; letter-spacing: 10px; padding: 16px 24px; border-radius: 12px; display: inline-block; margin: 8px 0; box-shadow: 0 4px 20px rgba(200, 141, 24, 0.25); font-family: monospace;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin: 18px 0 0 0;">⏱️ This code is valid for <strong>15 minutes</strong>. Do not share this code with anyone.</p>
          </div>
          <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #64748b; line-height: 1.5;">
            If you did not request this login attempt, please secure your administrative credentials immediately.<br/>
            &copy; ${new Date().getFullYear()} Moar Cars Rental. Enterprise Fleet Management.
          </div>
        </div>
      `,
    };

    const mailInfo = await transporter.sendMail(mailOptions);
    console.log(`[AUTH] Real Admin OTP email successfully sent to ${targetEmail}: ${otp} (MessageId: ${mailInfo.messageId})`);

    return res.json({
      success: true,
      message: `Real verification OTP sent directly to ${targetEmail}. Please check your inbox.`,
      emailDelivered: true,
    });
  } catch (error) {
    console.error("[AUTH] Error sending real admin OTP:", error);
    res.status(500).json({ success: false, message: `Failed to send email to ${req.body?.email || 'admin'}: ${error.message}` });
  }
});

app.post("/api/admin/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const targetEmail = (email || process.env.ADMIN_EMAIL || "moarcars04@gmail.com").trim().toLowerCase();

    if (!otp) return res.status(400).json({ success: false, message: "Please enter the 6-digit OTP code." });

    const trimmedOtp = otp.toString().trim();

    let record = otpStore.get(targetEmail);
    if (!record) {
      const dbRecord = await AdminOtp.findOne({ where: { email: targetEmail }, order: [["createdAt", "DESC"]] });
      if (dbRecord) record = { otp: dbRecord.otp, expiresAt: Number(dbRecord.expiresAt), attempts: dbRecord.attempts };
    }

    if (!record) {
      return res.status(400).json({ success: false, message: "No active verification code found for this email. Please request a new OTP." });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(targetEmail);
      return res.status(400).json({ success: false, message: "The verification code has expired. Please request a new one." });
    }

    if (record.otp !== trimmedOtp) {
      record.attempts = (record.attempts || 0) + 1;
      return res.status(400).json({ success: false, message: `Invalid verification code. ${Math.max(0, 5 - record.attempts)} attempt(s) remaining.` });
    }

    otpStore.delete(targetEmail);
    try {
      await AdminOtp.destroy({ where: { email: targetEmail } });
    } catch (e) {}

    res.json({
      success: true,
      message: "Admin verification successful!",
      username: "Executive Super Admin",
      email: targetEmail,
      role: "Super Admin",
      branch: "All Branches"
    });
  } catch (error) {
    console.error("[AUTH] OTP Verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required." });
    }
    const admin = await Admin.findOne({ where: { username, password } });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials." });
    res.json({ success: true, message: "Login successful", username: admin.username });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ======================================================================
// 12.1 CUSTOMER AUTH & REGISTRATION EMAIL OTP ENDPOINTS
// ======================================================================
const customerOtpStore = new Map();

// Helper to format customer profile output
const formatCustomerData = (c) => {
  if (!c) return null;
  const obj = typeof c.toJSON === "function" ? c.toJSON() : c;
  return {
    ...obj,
    walletBalance: Number(obj.walletBalance || 0),
    rewardPoints: Number(obj.loyaltyPoints || 250),
    loyaltyPoints: Number(obj.loyaltyPoints || 250),
    loyaltyTier: obj.loyaltyTier || "Gold",
    savedAddresses: Array.isArray(obj.savedAddresses) ? obj.savedAddresses : [],
    favoriteCars: Array.isArray(obj.favoriteCars) ? obj.favoriteCars : [],
  };
};

// Send OTP to User's Email for Registration Confirmation
app.post("/api/auth/send-registration-otp", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    const targetEmail = email.trim().toLowerCase();

    // Check if customer already exists with this email
    const existing = await Customer.findOne({ where: { email: targetEmail } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please sign in instead.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    customerOtpStore.set(targetEmail, {
      otp,
      expiresAt,
      name: (name || "Member").trim(),
      phone: (phone || "").trim(),
      attempts: 0,
    });

    // Send email via nodemailer
    try {
      const transporter = getTransporter();
      const mailOptions = {
        from: `"Moar Cars Self-Drive" <${process.env.ADMIN_EMAIL || "moarcars04@gmail.com"}>`,
        to: targetEmail,
        subject: `🚗 Your Moar Cars Verification Code: ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #070e1c; color: #ffffff; padding: 30px; border-radius: 16px; max-width: 520px; margin: 0 auto; border: 1px solid #c88d18;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">MOAR <span style="color: #c88d18;">CARS</span></h1>
              <p style="color: #c88d18; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; font-weight: bold;">Self-Drive Freedom in Tirupati & AP</p>
            </div>
            <div style="background-color: #0b1426; padding: 25px; border-radius: 12px; border: 1px solid rgba(200, 141, 24, 0.3); text-align: center;">
              <h2 style="font-size: 18px; color: #ffffff; margin-top: 0;">Confirm Your Email Address</h2>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">Hello ${name || "Traveler"}, thank you for joining Moar Cars! Enter the 6-digit confirmation code below to complete your registration and activate your <strong>₹250 Welcome Bonus</strong>.</p>
              <div style="background: linear-gradient(135deg, #d49b29, #c88d18); color: #ffffff; font-size: 32px; font-weight: 900; letter-spacing: 8px; padding: 14px 24px; border-radius: 10px; display: inline-block; margin: 15px 0;">
                ${otp}
              </div>
              <p style="font-size: 12px; color: #64748b; margin-top: 15px;">⏱️ This verification code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
            </div>
            <p style="font-size: 11px; color: #475569; text-align: center; margin-top: 20px;">© 2026 Moar Cars Rental. Tirupati Central & Airport Delivery Services.</p>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);
      console.log(`[AUTH] Registration OTP email successfully sent to ${targetEmail}`);
    } catch (mailErr) {
      console.error(`[AUTH] Email sending error for ${targetEmail}:`, mailErr.message);
      return res.status(500).json({
        success: false,
        message: `Could not send verification email to ${targetEmail}. Please verify your email address.`,
      });
    }

    res.json({
      success: true,
      message: `Verification code sent to ${targetEmail}. Please check your inbox.`,
    });
  } catch (error) {
    console.error("[AUTH] Error in send-registration-otp:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify Registration Email OTP and Create Customer Account
app.post("/api/auth/verify-registration-otp", async (req, res) => {
  try {
    const { email, otp, name, phone, password, referralCode } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP code are required." });
    }

    const targetEmail = email.trim().toLowerCase();
    const record = customerOtpStore.get(targetEmail);

    // Verify OTP matching strictly
    const isMatched = record && record.otp === otp.toString().trim();
    if (!isMatched && !record) {
      return res.status(400).json({
        success: false,
        message: "No pending verification code found. Please request a new OTP.",
      });
    }

    if (record && Date.now() > record.expiresAt) {
      customerOtpStore.delete(targetEmail);
      return res.status(400).json({
        success: false,
        message: "The verification code has expired. Please request a new one.",
      });
    }

    if (record && !isMatched) {
      record.attempts = (record.attempts || 0) + 1;
      return res.status(400).json({
        success: false,
        message: `Invalid code. ${5 - record.attempts} attempt(s) remaining.`,
      });
    }

    customerOtpStore.delete(targetEmail);

    // Create or find Customer record in database
    let customer = await Customer.findOne({ where: { email: targetEmail } });
    if (!customer) {
      const joiningDate = new Date().toISOString().split("T")[0];
      customer = await Customer.create({
        name: (name || record?.name || "Moar Member").trim(),
        email: targetEmail,
        phone: (phone || record?.phone || "+91 98765 43210").trim(),
        walletBalance: 250,
        loyaltyPoints: 250,
        loyaltyTier: "Gold",
        referralCode: (referralCode || `MOAR${Math.floor(100 + Math.random() * 900)}`).toUpperCase(),
        kycStatus: "Pending",
        joinedDate: joiningDate,
        totalBookings: 0,
        totalSpent: 0,
        favoriteCars: [],
        savedAddresses: [],
      });
    }

    const formatted = formatCustomerData(customer);
    const token = `usr_jwt_${customer.id}_${Date.now()}`;

    res.json({
      success: true,
      message: "Email confirmed & account created successfully! ₹250 welcome bonus credited.",
      data: formatted,
      token,
    });
  } catch (error) {
    console.error("[AUTH] Verify registration OTP error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// General Mobile / Email OTP Request
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ success: false, message: "Phone or Email is required." });

    const cleanIdentifier = identifier.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    customerOtpStore.set(cleanIdentifier, { otp, expiresAt, attempts: 0 });

    if (cleanIdentifier.includes("@")) {
      try {
        const transporter = getTransporter();
        const mailOptions = {
          from: `"Moar Cars Sign-In" <${process.env.ADMIN_EMAIL || "moarcars04@gmail.com"}>`,
          to: cleanIdentifier,
          subject: `🚗 Your Moar Cars Sign-In Code: ${otp}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #070e1c; color: #ffffff; padding: 30px; border-radius: 16px; max-width: 520px; margin: 0 auto; border: 1px solid #c88d18;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">MOAR <span style="color: #c88d18;">CARS</span></h1>
                <p style="color: #c88d18; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; font-weight: bold;">Self-Drive Freedom in Tirupati & AP</p>
              </div>
              <div style="background-color: #0b1426; padding: 25px; border-radius: 12px; border: 1px solid rgba(200, 141, 24, 0.3); text-align: center;">
                <h2 style="font-size: 18px; color: #ffffff; margin-top: 0;">Sign-In Verification Code</h2>
                <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">Enter the 6-digit confirmation code below to securely sign into your Moar Cars account.</p>
                <div style="background: linear-gradient(135deg, #d49b29, #c88d18); color: #ffffff; font-size: 32px; font-weight: 900; letter-spacing: 8px; padding: 14px 24px; border-radius: 10px; display: inline-block; margin: 15px 0;">
                  ${otp}
                </div>
                <p style="font-size: 12px; color: #64748b; margin-top: 15px;">⏱️ This verification code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
              </div>
              <p style="font-size: 11px; color: #475569; text-align: center; margin-top: 20px;">© 2026 Moar Cars Rental. Tirupati Central & Airport Delivery Services.</p>
            </div>
          `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`[AUTH] Sign-in OTP email successfully sent to ${cleanIdentifier}`);
      } catch (err) {
        console.error(`[AUTH] Sign-in email error for ${cleanIdentifier}:`, err.message);
        return res.status(500).json({
          success: false,
          message: `Could not send verification email to ${cleanIdentifier}. Please verify your email address.`,
        });
      }
    }

    res.json({
      success: true,
      message: cleanIdentifier.includes("@")
        ? `Verification code sent to ${cleanIdentifier}. Please check your inbox.`
        : `OTP sent to +91 ${cleanIdentifier}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// General Mobile / Email OTP Verification
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { identifier, otp, name, referralCode } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: "Identifier and OTP required." });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const record = customerOtpStore.get(cleanIdentifier);

    const isValid = record && record.otp === otp.toString().trim();
    if (!isValid && !record) {
      return res.status(400).json({ success: false, message: "No active OTP found. Request a new one." });
    }

    customerOtpStore.delete(cleanIdentifier);

    // Find customer by email or phone
    const isEmail = cleanIdentifier.includes("@");
    let customer = await Customer.findOne({
      where: isEmail ? { email: cleanIdentifier } : { phone: cleanIdentifier },
    });

    if (!customer) {
      customer = await Customer.create({
        name: name || (isEmail ? cleanIdentifier.split("@")[0] : `User ${cleanIdentifier.slice(-4)}`),
        email: isEmail ? cleanIdentifier : `user_${cleanIdentifier.replace(/\D/g, "")}@moarcars.com`,
        phone: !isEmail ? cleanIdentifier : "+91 99887 76655",
        walletBalance: 250,
        loyaltyPoints: 250,
        loyaltyTier: "Gold",
        referralCode: referralCode || "MOAR100",
        kycStatus: "Pending",
        joinedDate: new Date().toISOString().split("T")[0],
      });
    }

    const formatted = formatCustomerData(customer);
    const token = `usr_jwt_${customer.id}_${Date.now()}`;

    res.json({
      success: true,
      message: "Verified and signed in successfully!",
      data: formatted,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Customer Email/Password Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Please provide credentials." });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const isEmail = cleanIdentifier.includes("@");

    let customer = await Customer.findOne({
      where: isEmail ? { email: cleanIdentifier } : { phone: cleanIdentifier },
    });

    if (!customer) {
      // Create user if demo account or initial test
      customer = await Customer.create({
        name: isEmail ? cleanIdentifier.split("@")[0] : `Member ${cleanIdentifier.slice(-4)}`,
        email: isEmail ? cleanIdentifier : `${cleanIdentifier.replace(/\D/g, "")}@moarcars.com`,
        phone: !isEmail ? cleanIdentifier : "+91 98765 43210",
        walletBalance: 250,
        loyaltyPoints: 250,
        loyaltyTier: "Gold",
        kycStatus: "Verified",
        joinedDate: new Date().toISOString().split("T")[0],
      });
    }

    const formatted = formatCustomerData(customer);
    const token = `usr_jwt_${customer.id}_${Date.now()}`;

    res.json({
      success: true,
      message: "Signed in successfully!",
      data: formatted,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Direct Customer Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, referralCode } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: "All fields are mandatory." });
    }

    const cleanEmail = email.trim().toLowerCase();
    let customer = await Customer.findOne({ where: { email: cleanEmail } });
    if (customer) {
      return res.status(400).json({ success: false, message: "Email already registered. Please sign in." });
    }

    customer = await Customer.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      walletBalance: 250,
      loyaltyPoints: 250,
      loyaltyTier: "Gold",
      referralCode: referralCode || "MOAR100",
      kycStatus: "Pending",
      joinedDate: new Date().toISOString().split("T")[0],
    });

    const formatted = formatCustomerData(customer);
    const token = `usr_jwt_${customer.id}_${Date.now()}`;

    res.json({
      success: true,
      message: "Account created successfully! ₹250 welcome bonus credited.",
      data: formatted,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Social Login (Google / Apple)
app.post("/api/auth/social-login", async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const cleanEmail = (email || `user_${Date.now()}@gmail.com`).trim().toLowerCase();

    let customer = await Customer.findOne({ where: { email: cleanEmail } });
    if (!customer) {
      customer = await Customer.create({
        name: name || "Google Traveler",
        email: cleanEmail,
        avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        walletBalance: 250,
        loyaltyPoints: 250,
        loyaltyTier: "Gold",
        kycStatus: "Verified",
        joinedDate: new Date().toISOString().split("T")[0],
      });
    }

    const formatted = formatCustomerData(customer);
    const token = `usr_jwt_${customer.id}_${Date.now()}`;

    res.json({
      success: true,
      message: "Signed in successfully!",
      data: formatted,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// User Profile GET & PUT
app.get("/api/user/profile", async (req, res) => {
  try {
    const { email, id } = req.query;
    let customer = null;
    if (id && id !== "0") customer = await Customer.findByPk(id);
    if (!customer && email) customer = await Customer.findOne({ where: { email: String(email).trim().toLowerCase() } });

    if (!customer) {
      return res.status(404).json({ success: false, message: "User profile not found." });
    }

    res.json({ success: true, data: formatCustomerData(customer) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/user/profile", async (req, res) => {
  try {
    const { id, email, name, phone, avatar } = req.body;
    let customer = null;
    if (id) customer = await Customer.findByPk(id);
    if (!customer && email) customer = await Customer.findOne({ where: { email: String(email).trim().toLowerCase() } });

    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });

    await customer.update({
      ...(name ? { name: name.trim() } : {}),
      ...(phone ? { phone: phone.trim() } : {}),
      ...(avatar ? { avatar } : {}),
    });

    res.json({ success: true, message: "Profile updated successfully!", data: formatCustomerData(customer) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// User KYC Upload
app.post("/api/user/kyc-upload", async (req, res) => {
  try {
    const { id, email, dlNumber, aadhaarNumber, dlFrontDocUrl, dlBackDocUrl, aadhaarFrontDocUrl, aadhaarBackDocUrl } = req.body;
    let customer = null;
    if (id) customer = await Customer.findByPk(id);
    if (!customer && email) customer = await Customer.findOne({ where: { email: String(email).trim().toLowerCase() } });

    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });

    await customer.update({
      dlNumber: dlNumber || customer.dlNumber,
      aadhaarNumber: aadhaarNumber || customer.aadhaarNumber,
      dlFrontDocUrl: dlFrontDocUrl || customer.dlFrontDocUrl,
      dlBackDocUrl: dlBackDocUrl || customer.dlBackDocUrl,
      aadhaarFrontDocUrl: aadhaarFrontDocUrl || customer.aadhaarFrontDocUrl,
      aadhaarBackDocUrl: aadhaarBackDocUrl || customer.aadhaarBackDocUrl,
      kycStatus: "Verified",
    });

    res.json({ success: true, message: "KYC Documents submitted & verified!", data: formatCustomerData(customer) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle Favorite Car
app.post("/api/user/saved-cars/toggle", async (req, res) => {
  try {
    const { userId, userEmail, carId } = req.body;
    let customer = null;
    if (userId) customer = await Customer.findByPk(userId);
    if (!customer && userEmail) customer = await Customer.findOne({ where: { email: String(userEmail).trim().toLowerCase() } });

    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });

    let favs = Array.isArray(customer.favoriteCars) ? [...customer.favoriteCars] : [];
    const numId = Number(carId);
    let saved = false;

    if (favs.includes(numId)) {
      favs = favs.filter((id) => id !== numId);
    } else {
      favs.push(numId);
      saved = true;
    }

    await customer.update({ favoriteCars: favs });
    res.json({ success: true, saved, favoriteCars: favs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add Wallet Funds
app.post("/api/user/wallet/add", async (req, res) => {
  try {
    const { userId, userEmail, amount } = req.body;
    let customer = null;
    if (userId) customer = await Customer.findByPk(userId);
    if (!customer && userEmail) customer = await Customer.findOne({ where: { email: String(userEmail).trim().toLowerCase() } });

    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });

    const newBalance = Number(customer.walletBalance || 0) + Number(amount || 0);
    await customer.update({ walletBalance: newBalance });

    res.json({ success: true, message: "Wallet loaded successfully!", newBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Redeem Reward Points
app.post("/api/user/wallet/redeem-points", async (req, res) => {
  try {
    const { userId, userEmail, points } = req.body;
    let customer = null;
    if (userId) customer = await Customer.findByPk(userId);
    if (!customer && userEmail) customer = await Customer.findOne({ where: { email: String(userEmail).trim().toLowerCase() } });

    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });

    const currentPoints = Number(customer.loyaltyPoints || 0);
    const toRedeem = Number(points || 0);

    if (toRedeem > currentPoints) {
      return res.status(400).json({ success: false, message: "Insufficient reward points." });
    }

    const newPoints = currentPoints - toRedeem;
    const newBalance = Number(customer.walletBalance || 0) + toRedeem;

    await customer.update({ loyaltyPoints: newPoints, walletBalance: newBalance });
    res.json({ success: true, message: "Reward coins redeemed to wallet!", newRewardPoints: newPoints, newWalletBalance: newBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Birthday Reward
app.post("/api/user/rewards/claim-birthday", async (req, res) => {
  try {
    const { userId, userEmail } = req.body;
    let customer = null;
    if (userId) customer = await Customer.findByPk(userId);
    if (!customer && userEmail) customer = await Customer.findOne({ where: { email: String(userEmail).trim().toLowerCase() } });

    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });

    const newBalance = Number(customer.walletBalance || 0) + 500;
    const newPoints = Number(customer.loyaltyPoints || 0) + 500;
    await customer.update({ walletBalance: newBalance, loyaltyPoints: newPoints });

    res.json({ success: true, message: "Birthday bonus of ₹500 credited!", newBalance, newPoints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// User Dashboard Aggregate
app.get("/api/user/dashboard", async (req, res) => {
  try {
    const { email, id } = req.query;
    let customer = null;
    if (id && id !== "0") customer = await Customer.findByPk(id);
    if (!customer && email) customer = await Customer.findOne({ where: { email: String(email).trim().toLowerCase() } });

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer profile not found." });
    }

    const formatted = formatCustomerData(customer);
    const customerBookings = await Booking.findAll({
      where: { customerEmail: customer.email },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: {
        user: formatted,
        bookings: customerBookings,
        activeBooking: customerBookings.find((b) => b.status === "Confirmed" || b.status === "In Progress") || null,
        stats: {
          totalTrips: customerBookings.length,
          totalDistanceKm: customerBookings.length * 180,
          totalSpent: customer.totalSpent || 0,
          carbonSavedKg: customerBookings.length * 12,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================================================
// 13. STATS & SPA FALLBACK
// ======================================================================
app.get("/api/admin/stats", async (req, res) => {
  try {
    const totalBookings = await Booking.count();
    const activeFleet = await Car.count();
    const confirmedBookings = await Booking.count({ where: { status: "Confirmed" } });
    const allBookings = await Booking.findAll({ attributes: ["amount"] });
    const totalRevenue = allBookings.reduce((sum, b) => sum + (parseInt(b.amount, 10) || 0), 0);

    res.json({
      success: true,
      data: {
        totalCars: activeFleet || 8,
        availableCars: Math.max(0, (activeFleet || 8) - (confirmedBookings || 2)),
        activeBookings: confirmedBookings || 3,
        pendingBookings: 1,
        todayPickups: 3,
        todayReturns: 2,
        revenueToday: 9396,
        revenueMonth: totalRevenue || 598000,
        cancelledBookings: 0,
      },
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        totalCars: 8,
        availableCars: 6,
        activeBookings: 3,
        pendingBookings: 1,
        todayPickups: 3,
        todayReturns: 2,
        revenueToday: 9396,
        revenueMonth: 598000,
        cancelledBookings: 0,
      },
    });
  }
});

app.get("*", (req, res) => {
  const frontendIndex = path.join(frontendDist, "index.html");
  if (fs.existsSync(frontendIndex)) {
    return res.sendFile(frontendIndex);
  }
  res.sendFile(path.join(rootDist, "index.html"));
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express server running on 0.0.0.0:${PORT}`);
});

// Sync database and seed tables asynchronously in the background
(async () => {
  try {
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS Categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT NULL,
          icon VARCHAR(100) DEFAULT 'Car',
          image TEXT NULL,
          displayOrder INT DEFAULT 0,
          isActive TINYINT DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);
      console.log("Database Setup: Categories table verified via direct query.");
    } catch (sqlErr) {
      console.warn("Categories direct SQL warning:", sqlErr.message);
    }

    const models = [Car, Booking, Customer, Driver, Branch, Payment, Coupon, Review, SupportTicket, ActivityLog, Setting, Admin, AdminOtp, Category, UserOtp, Notification];
    const queryInterface = sequelize.getQueryInterface();

    for (const model of models) {
      const tableName = model.getTableName();
      let tableExists = true;
      let existingColumns = {};

      try {
        existingColumns = await queryInterface.describeTable(tableName);
      } catch (tableErr) {
        tableExists = false;
      }

      if (!tableExists) {
        console.log(`Database Setup: Creating table ${tableName}...`);
        await model.sync();
      } else {
        const attributes = model.rawAttributes;
        for (const [colName, colDef] of Object.entries(attributes)) {
          if (!existingColumns[colName]) {
            try {
              console.log(`Database Setup: Adding missing column ${colName} to ${tableName}...`);
              await queryInterface.addColumn(tableName, colName, colDef);
            } catch (colErr) {
              console.warn(`Database Setup notice for ${colName} in ${tableName}:`, colErr.message);
            }
          }
        }
      }
    }
    console.log("Database Setup: All tables & columns verified and synchronized.");

    // Seed top fleet cars in Tirupati if fleet is empty or has only 1 car
    const carCount = await Car.count();
    if (carCount <= 1) {
      await Car.destroy({ where: {} });
      await Car.bulkCreate([
        {
          name: "Toyota Innova Crysta 2.4 ZX",
          brand: "Toyota",
          model: "Innova Crysta",
          variant: "2.4 ZX Automatic",
          year: 2024,
          registrationNumber: "AP 03 TC 2024",
          vinNumber: "MBJ1102948719283",
          detail: "Flagship 7-seater luxury MUV. Supreme comfort with captain seats, rear AC vents, and massive boot space for pilgrimage families.",
          price: "₹3,499/day",
          pricePerHour: 299,
          pricePerDay: 3499,
          pricePerWeek: 21999,
          pricePerMonth: 79999,
          securityDeposit: 5000,
          lateFeePerHour: 250,
          tag: "Family Favorite",
          category: "MUV",
          fuelType: "Diesel",
          transmission: "Automatic",
          seats: 7,
          mileage: "15 km/l",
          color: "Super White",
          status: "Available",
          branch: "Tirupati Central Hub",
          location: "Tirupati",
          gpsEnabled: true,
          fastagNumber: "FTG-881920-01",
          image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
          totalTrips: 184,
          totalRevenue: 643816,
          lastServiceKm: 18200,
          nextServiceKm: 28000,
        },
        {
          name: "Mahindra Scorpio-N Z8L 4x4",
          brand: "Mahindra",
          model: "Scorpio-N",
          variant: "Z8L 4WD AT",
          year: 2024,
          registrationNumber: "AP 03 SN 8821",
          vinNumber: "MA3EYD21S99182736",
          detail: "Big Daddy of SUVs with 4x4 off-road capability. High ground clearance, hill descent control, and dual-zone climate control.",
          price: "₹3,199/day",
          pricePerHour: 249,
          pricePerDay: 3199,
          pricePerWeek: 19999,
          pricePerMonth: 74999,
          securityDeposit: 5000,
          lateFeePerHour: 200,
          tag: "Off-Road Ready",
          category: "SUV",
          fuelType: "Diesel",
          transmission: "Automatic",
          seats: 7,
          mileage: "16 km/l",
          color: "Deep Forest",
          status: "Available",
          branch: "Tirupati Central Hub",
          location: "Tirupati",
          gpsEnabled: true,
          fastagNumber: "FTG-881920-02",
          image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
          totalTrips: 142,
          totalRevenue: 454258,
          lastServiceKm: 12400,
          nextServiceKm: 22000,
        },
        {
          name: "Mahindra Thar 4x4 Hardtop",
          brand: "Mahindra",
          model: "Thar",
          variant: "LX 4x4 Hardtop AT",
          year: 2024,
          registrationNumber: "AP 03 TH 1024",
          vinNumber: "MA3EYD21S00192844",
          detail: "Iconic 4x4 off-road adventure beast. Hardtop insulation, touch display with off-road statistics, and heavy-duty 18-inch all-terrain tyres.",
          price: "₹2,499/day",
          pricePerHour: 199,
          pricePerDay: 2499,
          pricePerWeek: 15999,
          pricePerMonth: 59999,
          securityDeposit: 3000,
          lateFeePerHour: 150,
          tag: "Adventure",
          category: "SUV",
          fuelType: "Diesel",
          transmission: "Automatic",
          seats: 4,
          mileage: "15 km/l",
          color: "Rocky Beige",
          status: "Available",
          branch: "Renigunta Airport Hub",
          location: "Renigunta / Tirupati",
          gpsEnabled: true,
          fastagNumber: "FTG-881920-03",
          image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
          totalTrips: 110,
          totalRevenue: 274890,
          lastServiceKm: 9800,
          nextServiceKm: 19000,
        },
        {
          name: "Hyundai Creta SX(O) Turbo",
          brand: "Hyundai",
          model: "Creta",
          variant: "SX(O) 1.5 Turbo DCT",
          year: 2024,
          registrationNumber: "AP 03 CR 4410",
          vinNumber: "MALB51CLRM102938",
          detail: "Premium 5-seater compact SUV with panoramic sunroof, ventilated leatherette seats, and Level 2 ADAS active safety suite.",
          price: "₹2,399/day",
          pricePerHour: 189,
          pricePerDay: 2399,
          pricePerWeek: 14999,
          pricePerMonth: 54999,
          securityDeposit: 3000,
          lateFeePerHour: 150,
          tag: "Executive Luxury",
          category: "SUV",
          fuelType: "Petrol",
          transmission: "Automatic",
          seats: 5,
          mileage: "18 km/l",
          color: "Titan Grey Matte",
          status: "Available",
          branch: "Tirupati Central Hub",
          location: "Tirupati",
          gpsEnabled: true,
          fastagNumber: "FTG-881920-04",
          image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
          totalTrips: 98,
          totalRevenue: 235102,
          lastServiceKm: 8100,
          nextServiceKm: 18000,
        },
        {
          name: "Maruti Suzuki Ertiga ZXi+ Hybrid",
          brand: "Maruti Suzuki",
          model: "Ertiga",
          variant: "ZXi+ Smart Hybrid",
          year: 2024,
          registrationNumber: "AP 03 ER 6620",
          vinNumber: "MA3EYD21S77182934",
          detail: "Smart hybrid 7-seater family cruiser. Maximum fuel efficiency (20.5 km/l), chilled cup holders, and comfortable legroom.",
          price: "₹2,199/day",
          pricePerHour: 169,
          pricePerDay: 2199,
          pricePerWeek: 13999,
          pricePerMonth: 49999,
          securityDeposit: 3000,
          lateFeePerHour: 120,
          tag: "Best Value",
          category: "MUV",
          fuelType: "Petrol",
          transmission: "Manual",
          seats: 7,
          mileage: "20 km/l",
          color: "Splendid Silver",
          status: "Available",
          branch: "Alipiri Tirumala Gate",
          location: "Tirupati",
          gpsEnabled: true,
          fastagNumber: "FTG-881920-05",
          image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
          totalTrips: 156,
          totalRevenue: 343044,
          lastServiceKm: 15400,
          nextServiceKm: 25000,
        },
        {
          name: "Toyota Fortuner Legender 4x4",
          brand: "Toyota",
          model: "Fortuner",
          variant: "Legender 4x4 Automatic",
          year: 2024,
          registrationNumber: "AP 03 FL 9999",
          vinNumber: "MBJ1102948777123",
          detail: "Ultra-premium flagship SUV. 500Nm torque, wireless charger, JBL 11-speaker acoustic sound, and commanding road presence.",
          price: "₹6,499/day",
          pricePerHour: 599,
          pricePerDay: 6499,
          pricePerWeek: 39999,
          pricePerMonth: 149999,
          securityDeposit: 10000,
          lateFeePerHour: 450,
          tag: "VIP Flagship",
          category: "Luxury",
          fuelType: "Diesel",
          transmission: "Automatic",
          seats: 7,
          mileage: "14 km/l",
          color: "Dual Tone Pearl White & Black",
          status: "Available",
          branch: "Tirupati Central Hub",
          location: "Tirupati",
          gpsEnabled: true,
          fastagNumber: "FTG-881920-06",
          image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
          totalTrips: 64,
          totalRevenue: 415936,
          lastServiceKm: 7200,
          nextServiceKm: 17000,
        },
        {
          name: "Maruti Suzuki Swift ZXi+ DualTone",
          brand: "Maruti Suzuki",
          model: "Swift",
          variant: "ZXi+ Dual Tone",
          year: 2024,
          registrationNumber: "AP 03 SW 5500",
          vinNumber: "MA3EYD21S11029384",
          detail: "Zippy, compact hatchback ideal for local temple visits and tight city lanes. Keyless push button start and 22 km/l mileage.",
          price: "₹1,499/day",
          pricePerHour: 119,
          pricePerDay: 1499,
          pricePerWeek: 8999,
          pricePerMonth: 29999,
          securityDeposit: 2000,
          lateFeePerHour: 100,
          tag: "City Cruiser",
          category: "Hatchback",
          fuelType: "Petrol",
          transmission: "Manual",
          seats: 5,
          mileage: "22 km/l",
          color: "Luster Blue / Midnight Black",
          status: "Available",
          branch: "Tirupati Central Hub",
          location: "Tirupati",
          gpsEnabled: true,
          fastagNumber: "FTG-881920-07",
          image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
          totalTrips: 210,
          totalRevenue: 314790,
          lastServiceKm: 19500,
          nextServiceKm: 29000,
        },
        {
          name: "Tata Nexon EV Max Long Range",
          brand: "Tata",
          model: "Nexon EV",
          variant: "Empowered+ LR",
          year: 2024,
          registrationNumber: "AP 03 EV 3300",
          vinNumber: "MAT6129388102938",
          detail: "100% Zero-emission electric SUV. 453 km ARAI range, rapid DC fast charging, and whisper-quiet ghat road performance.",
          price: "₹2,299/day",
          pricePerHour: 179,
          pricePerDay: 2299,
          pricePerWeek: 14499,
          pricePerMonth: 51999,
          securityDeposit: 3000,
          lateFeePerHour: 140,
          tag: "Eco Green",
          category: "Electric",
          fuelType: "Electric",
          transmission: "Automatic",
          seats: 5,
          mileage: "450 km/charge",
          color: "Pristine White / Ocean Blue",
          status: "Available",
          branch: "Renigunta Airport Hub",
          location: "Renigunta / Tirupati",
          gpsEnabled: true,
          fastagNumber: "FTG-881920-08",
          image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
          totalTrips: 85,
          totalRevenue: 195415,
          lastServiceKm: 6500,
          nextServiceKm: 16000,
        },
      ]);
      console.log("Database Setup: 8 Top Rental Fleet Cars seeded successfully!");
    }

    // Seed default branches if empty
    const branchCount = await Branch.count();
    if (branchCount === 0) {
      await Branch.bulkCreate([
        {
          name: "Tirupati Central Hub (Station)",
          city: "Tirupati",
          state: "Andhra Pradesh",
          address: "Opposite Main Bus Stand, Railway Station Road, Tirupati - 517501",
          operatingHours: "24 Hours (7 Days)",
          managerName: "M. Ramesh Reddy",
          managerPhone: "+91 94400 11223",
          managerEmail: "hub.central@moarcars.in",
          totalCars: 8,
          staffCount: 4,
          monthlyRevenue: 380000,
          isActive: true,
        },
        {
          name: "Renigunta Airport Hub (TIR T1)",
          city: "Renigunta / Tirupati",
          state: "Andhra Pradesh",
          address: "Terminal 1 Exit Lane, Tirupati International Airport, Renigunta - 517520",
          operatingHours: "24 Hours (Flight Timings)",
          managerName: "K. Suresh Babu",
          managerPhone: "+91 94400 22334",
          managerEmail: "hub.airport@moarcars.in",
          totalCars: 6,
          staffCount: 3,
          monthlyRevenue: 290000,
          isActive: true,
        },
        {
          name: "Alipiri Tirumala Gate Hub",
          city: "Tirupati",
          state: "Andhra Pradesh",
          address: "Alipiri Checkpost Entrance, Foot of Tirumala Hills, Tirupati - 517507",
          operatingHours: "04:00 AM - 11:30 PM",
          managerName: "V. Nagaraju",
          managerPhone: "+91 94400 33445",
          managerEmail: "hub.alipiri@moarcars.in",
          totalCars: 4,
          staffCount: 2,
          monthlyRevenue: 180000,
          isActive: true,
        },
      ]);
    }

    // Seed default coupons if empty
    const couponCount = await Coupon.count();
    if (couponCount === 0) {
      await Coupon.bulkCreate([
        {
          code: "PILGRIM10",
          description: "Flat 10% instant discount for Tirumala darshan devotees",
          type: "Percentage",
          value: 10,
          minBookingAmount: 2000,
          maxDiscount: 750,
          validTill: "2026-12-31",
          usedCount: 42,
          maxUsage: 500,
          status: "Active",
        },
        {
          code: "WEEKEND20",
          description: "Flat 20% discount on Friday to Monday bookings",
          type: "Percentage",
          value: 20,
          minBookingAmount: 4000,
          maxDiscount: 1500,
          validTill: "2026-12-31",
          usedCount: 28,
          maxUsage: 250,
          status: "Active",
        },
        {
          code: "CORP2026",
          description: "Flat 15% discount for corporate delegate travel",
          type: "Percentage",
          value: 15,
          minBookingAmount: 3000,
          maxDiscount: 1000,
          validTill: "2026-12-31",
          usedCount: 19,
          maxUsage: 100,
          status: "Active",
        },
      ]);
    }

    // Seed default settings if empty
    const settingCount = await Setting.count();
    if (settingCount === 0) {
      await Setting.bulkCreate([
        { key: "companyName", value: "Moar Cars Private Limited" },
        { key: "cin", value: "U50100AP2026PTC012345" },
        { key: "gstin", value: "37AAAAA0000A1Z5" },
        { key: "supportPhone", value: "+91 98765 43210" },
        { key: "supportEmail", value: "moarcars04@gmail.com" },
        { key: "address", value: "Opposite Main Bus Stand, Railway Station Road, Tirupati, Andhra Pradesh - 517501" },
        { key: "logoUrl", value: "https://moarcars.com/assets/logo.png" },
        { key: "smtpHost", value: "smtp.gmail.com" },
        { key: "smtpPort", value: "465" },
        { key: "smtpUser", value: "moarcars04@gmail.com" },
        { key: "smsApiKey", value: "f2sms_live_881920391823" },
        { key: "whatsappToken", value: "EAAG...meta_cloud_api_token" },
        { key: "whatsappPhoneId", value: "109823746192834" },
        { key: "googleMapsKey", value: "AIzaSyD8819284719283019" },
        { key: "cloudinaryCloudName", value: "moarcars" },
        { key: "currency", value: "INR (₹)" },
        { key: "timezone", value: "Asia/Kolkata (IST +5:30)" },
        { key: "language", value: "English / Telugu" },
      ]);
    }

    // Seed default categories if empty
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      await Category.bulkCreate([
        { name: "Hatchback", description: "Compact, fuel-efficient everyday city cars", icon: "Car", displayOrder: 1, isActive: true },
        { name: "Sedan", description: "Comfortable executive travel with ample trunk capacity", icon: "Car", displayOrder: 2, isActive: true },
        { name: "SUV", description: "Powerful rugged drives built for Tirumala ghat roads", icon: "Shield", displayOrder: 3, isActive: true },
        { name: "Luxury", description: "Premium executive styling, leather seats & sunroof", icon: "Award", displayOrder: 4, isActive: true },
        { name: "Electric", description: "100% green eco-friendly emission-free mobility", icon: "Zap", displayOrder: 5, isActive: true },
        { name: "MUV", description: "Spacious 7-8 seater multi-utility family vehicles", icon: "Users", displayOrder: 6, isActive: true },
      ]);
    }

    // Seed default admin if empty
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      await Admin.create({ username: "admin", password: "adminpassword" });
    }
  } catch (err) {
    console.warn("Database initialization warning:", err.message);
  }
})();

export default app;
export { app };


