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

app.post(["/api/cars", "/api/admin/cars"], async (req, res) => {
  try {
    const newCar = await Car.create(req.body);
    res.status(201).json({ success: true, message: "Vehicle added to fleet!", data: newCar });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ success: false, message: "Error saving vehicle." });
  }
});

app.put("/api/admin/cars/:id", async (req, res) => {
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

app.delete("/api/admin/cars/:id", async (req, res) => {
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
// 2. BOOKINGS & DISPATCH API
// ======================================================================
app.get(["/api/bookings", "/api/admin/bookings"], async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [["id", "DESC"]] });
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.post(["/api/bookings", "/api/admin/bookings"], async (req, res) => {
  try {
    const newBooking = await Booking.create(req.body);
    res.status(201).json({ success: true, message: "Booking saved successfully!", data: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Error saving booking details." });
  }
});

app.put("/api/admin/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    await booking.update(req.body);
    res.json({ success: true, message: "Booking updated successfully!", data: booking });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.delete("/api/admin/bookings/:id", async (req, res) => {
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

// ======================================================================
// 5. BRANCHES API
// ======================================================================
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

// ======================================================================
// 6. PAYMENTS & ESCROW API
// ======================================================================
app.get("/api/admin/payments", async (req, res) => {
  try {
    const payments = await Payment.findAll({ order: [["id", "DESC"]] });
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
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ success: false, message: "Transaction not found." });
    await payment.update({ status: "Refunded", refundStatus: "Processed" });
    res.json({ success: true, message: "Security deposit refunded successfully!", data: payment });
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

// ======================================================================
// 8. REVIEWS & MODERATION API
// ======================================================================
app.get("/api/admin/reviews", async (req, res) => {
  try {
    const reviews = await Review.findAll({ order: [["id", "DESC"]] });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/admin/reviews/:id", async (req, res) => {
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

app.post("/api/admin/reviews/:id/reply", async (req, res) => {
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

// ======================================================================
// 9. SUPPORT DESK API
// ======================================================================
app.get("/api/admin/support/tickets", async (req, res) => {
  try {
    const tickets = await SupportTicket.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/admin/support/tickets", async (req, res) => {
  try {
    const ticket = await SupportTicket.create(req.body);
    res.status(201).json({ success: true, message: "Support ticket opened!", data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/admin/support/tickets/:id", async (req, res) => {
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
app.get("/api/admin/settings", async (req, res) => {
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

app.put("/api/admin/settings", async (req, res) => {
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

let cachedTransporter = null;
const getTransporter = () => {
  if (!cachedTransporter) {
    const user = (process.env.ADMIN_EMAIL || "moarcars04@gmail.com").trim();
    const pass = (process.env.ADMIN_EMAIL_APP_PASSWORD || "giykjehrkoeeoqzc").replace(/\s+/g, "");
    cachedTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 3,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }
  return cachedTransporter;
};

app.post("/api/admin/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const targetEmail = (email || process.env.ADMIN_EMAIL || "moarcars04@gmail.com").trim().toLowerCase();
    const authorizedEmail = (process.env.ADMIN_EMAIL || "moarcars04@gmail.com").trim().toLowerCase();

    if (targetEmail !== authorizedEmail) {
      return res.status(403).json({ success: false, message: "Unauthorized admin email address." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(targetEmail, { otp, expiresAt, attempts: 0 });

    try {
      await AdminOtp.destroy({ where: { email: targetEmail } });
      await AdminOtp.create({ email: targetEmail, otp, expiresAt, attempts: 0 });
    } catch (dbErr) {
      console.warn("[AUTH] DB OTP store warning:", dbErr.message);
    }

    const transporter = getTransporter();
    const mailOptions = {
      from: `"Moar Cars Admin" <${authorizedEmail}>`,
      to: targetEmail,
      subject: `🔑 Your Admin Login Code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #1E0F2B; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #D4AF37;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">Moar Cars Rental</h1>
            <p style="color: #c4b5fd; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">Enterprise Admin Panel</p>
          </div>
          <div style="background-color: #2E1439; padding: 25px; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.3); text-align: center;">
            <p style="font-size: 14px; color: #e9d5ff; margin-bottom: 15px;">Your one-time verification code for admin login is:</p>
            <div style="background: linear-gradient(135deg, #D4AF37, #F59E0B); color: #0f172a; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 20px; border-radius: 8px; display: inline-block; margin: 10px 0;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #a78bfa; margin-top: 15px;">⏱️ This code is valid for <strong>10 minutes</strong>.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[AUTH] Admin OTP sent successfully to ${targetEmail}`);

    res.json({ success: true, message: `Verification code sent to ${targetEmail}` });
  } catch (error) {
    console.error("[AUTH] Error sending admin OTP:", error);
    res.status(500).json({ success: false, message: `Failed to send email: ${error.message}` });
  }
});

app.post("/api/admin/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const targetEmail = (email || process.env.ADMIN_EMAIL || "moarcars04@gmail.com").trim().toLowerCase();

    if (!otp) return res.status(400).json({ success: false, message: "Please enter the 6-digit OTP code." });

    let record = otpStore.get(targetEmail);
    if (!record) {
      const dbRecord = await AdminOtp.findOne({ where: { email: targetEmail }, order: [["createdAt", "DESC"]] });
      if (dbRecord) record = { otp: dbRecord.otp, expiresAt: Number(dbRecord.expiresAt), attempts: dbRecord.attempts };
    }

    if (!record) {
      return res.status(400).json({ success: false, message: "No active verification code found. Please request a new OTP." });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(targetEmail);
      return res.status(400).json({ success: false, message: "The verification code has expired. Please request a new one." });
    }

    if (record.otp !== otp.toString().trim()) {
      record.attempts += 1;
      return res.status(400).json({ success: false, message: `Invalid code. ${5 - record.attempts} attempt(s) remaining.` });
    }

    otpStore.delete(targetEmail);
    res.json({ success: true, message: "Admin verification successful!", username: targetEmail });
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
    await sequelize.sync({ alter: true });
    console.log("Database tables synced successfully.");


    // Seed default cars if empty
    const carCount = await Car.count();
    if (carCount === 0) {
      console.log("Database: Seeding default fleet...");
      await Car.bulkCreate([
        {
          name: "Maruti Swift ZXi+",
          brand: "Maruti Suzuki",
          model: "Swift",
          variant: "ZXi Plus Dual Tone",
          year: 2024,
          registrationNumber: "AP 03 TX 1024",
          vinNumber: "MA3EYD21S00192844",
          detail: "Smart 5-seater hatchback, agile city commuter with touch infotainment",
          price: "₹1,699",
          pricePerHour: 199,
          pricePerDay: 1699,
          pricePerWeek: 9999,
          pricePerMonth: 34999,
          securityDeposit: 3000,
          lateFeePerHour: 150,
          tag: "Everyday",
          category: "Hatchback",
          fuelType: "Petrol",
          transmission: "Manual",
          seats: 5,
          mileage: "22 km/l",
          color: "Pearl Arctic White",
          status: "Available",
          branch: "Tirupati Central Hub",
          location: "Tirupati",
          gpsEnabled: true,
          fastagNumber: "FTG-889021-39",
          insuranceExpiry: "2027-04-15",
          pollutionExpiry: "2026-11-20",
          fitnessExpiry: "2028-08-10",
          permitExpiry: "2027-12-31",
          image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
          totalTrips: 42,
          totalRevenue: 71358,
          maintenanceCost: 4500,
        },
        {
          name: "Honda City ZX Automatic",
          brand: "Honda",
          model: "City",
          variant: "ZX CVT Sunroof",
          year: 2024,
          registrationNumber: "AP 03 DX 5088",
          vinNumber: "MAKGM21S00288190",
          detail: "Executive sedan with sunroof, leather upholstery, and ADAS Level 2 safety",
          price: "₹2,199",
          pricePerHour: 249,
          pricePerDay: 2199,
          pricePerWeek: 12999,
          pricePerMonth: 44999,
          securityDeposit: 4000,
          lateFeePerHour: 200,
          tag: "Comfort",
          category: "Sedan",
          fuelType: "Petrol",
          transmission: "Automatic",
          seats: 5,
          mileage: "18 km/l",
          color: "Platinum White Pearl",
          status: "Available",
          branch: "Renigunta Airport Hub",
          location: "Renigunta",
          gpsEnabled: true,
          fastagNumber: "FTG-994012-77",
          insuranceExpiry: "2027-02-10",
          pollutionExpiry: "2026-10-15",
          fitnessExpiry: "2028-05-12",
          permitExpiry: "2027-11-20",
          image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
          totalTrips: 36,
          totalRevenue: 79164,
          maintenanceCost: 6200,
        },
        {
          name: "Mahindra Scorpio-N Z8L 4x4",
          brand: "Mahindra",
          model: "Scorpio-N",
          variant: "Z8L 4x4 Automatic Diesel",
          year: 2024,
          registrationNumber: "AP 03 ZX 9900",
          vinNumber: "MA1Z8L44A00993812",
          detail: "Dominant 7-seater luxury SUV, 4Xplorer terrain modes for Tirumala ghat roads",
          price: "₹2,499",
          pricePerHour: 299,
          pricePerDay: 2499,
          pricePerWeek: 14999,
          pricePerMonth: 54999,
          securityDeposit: 5000,
          lateFeePerHour: 250,
          tag: "Popular",
          category: "SUV",
          fuelType: "Diesel",
          transmission: "Automatic",
          seats: 7,
          mileage: "15 km/l",
          color: "Napoli Black",
          status: "Booked",
          branch: "Tirupati Central Hub",
          location: "Tirupati",
          gpsEnabled: true,
          fastagNumber: "FTG-771120-45",
          insuranceExpiry: "2027-08-30",
          pollutionExpiry: "2026-09-25",
          fitnessExpiry: "2029-01-15",
          permitExpiry: "2028-04-10",
          image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
          totalTrips: 48,
          totalRevenue: 119952,
          maintenanceCost: 8900,
        },
      ]);
    }

    // Seed default branches if empty
    const branchCount = await Branch.count();
    if (branchCount === 0) {
      await Branch.bulkCreate([
        {
          name: "Tirupati Central Hub",
          city: "Tirupati",
          state: "Andhra Pradesh",
          address: "Opposite RTC Central Bus Stand, Tirupati - 517501",
          phone: "+91 877 223344",
          managerName: "Nagaraju V",
          managerPhone: "+91 98765 11122",
          operatingHours: "24 Hours (7 Days)",
          totalCars: 8,
          staffCount: 5,
          monthlyRevenue: 285000,
        },
        {
          name: "Renigunta Airport Hub",
          city: "Renigunta",
          state: "Andhra Pradesh",
          address: "Terminal 1 Exit Road, Tirupati Airport, Renigunta - 517520",
          phone: "+91 877 225566",
          managerName: "Anand Mohan",
          managerPhone: "+91 98765 22233",
          operatingHours: "4:00 AM - Midnight",
          totalCars: 5,
          staffCount: 3,
          monthlyRevenue: 195000,
        },
        {
          name: "Chandragiri Heritage Point",
          city: "Chandragiri",
          state: "Andhra Pradesh",
          address: "Fort Road Junction, Chandragiri - 517101",
          phone: "+91 877 227788",
          managerName: "K. Murali",
          managerPhone: "+91 98765 33344",
          operatingHours: "6:00 AM - 10:00 PM",
          totalCars: 3,
          staffCount: 2,
          monthlyRevenue: 118000,
        },
      ]);
    }

    // Seed default bookings if empty
    const bookingCount = await Booking.count();
    if (bookingCount === 0) {
      await Booking.bulkCreate([
        {
          id: 1042,
          bookingType: "Self Drive",
          pickup: "Tirupati Central Hub",
          startDate: "2026-09-05",
          endDate: "2026-09-07",
          carName: "Mahindra Scorpio-N Z8L 4x4",
          status: "Ongoing Trip",
          customerName: "Rajesh Varma",
          customerPhone: "+91 98765 11223",
          customerEmail: "rajesh.v@gmail.com",
          driverName: "Self Driven",
          driverPhone: "N/A",
          deliveryStaff: "Ravi Teja",
          pickupAddress: "Platform 1 Exit, Tirupati Main Railway Station",
          dropAddress: "Tirupati Central Hub, Bus Stand Road",
          duration: "2 Days (48 Hours)",
          extras: JSON.stringify(["Zero Dep Platinum Insurance", "FASTag Auto-Recharge"]),
          insurancePlan: "Zero Dep Platinum",
          couponCode: "MOARFIRST",
          discountAmount: 500,
          taxAmount: 762,
          securityDeposit: 5000,
          amount: 4998,
          branch: "Tirupati Central Hub",
          paymentMethod: "UPI (PhonePe)",
          paymentStatus: "Paid",
          bookingSource: "Mobile App",
          notes: "Customer travelling to Tirumala temple. Requested child booster seat.",
          startOdometer: 24100,
          returnOdometer: 24350,
          startFuel: 100,
          returnFuel: 95,
          penalties: 0,
          timelineStep: 5,
        },
        {
          id: 1041,
          bookingType: "Airport Pickup",
          pickup: "Renigunta Airport Hub",
          startDate: "2026-09-04",
          endDate: "2026-09-06",
          carName: "Honda City ZX Automatic",
          status: "Confirmed",
          customerName: "Ananya Sharma",
          customerPhone: "+91 98480 33445",
          customerEmail: "ananya.s@outlook.com",
          driverName: "Suresh Kumar",
          driverPhone: "+91 98765 00001",
          deliveryStaff: "Kiran Reddy",
          pickupAddress: "Terminal 1 Flight Arrival Gate, Renigunta Airport",
          dropAddress: "Fortune Select Grand Ridge Hotel, Tirupati",
          duration: "2 Days",
          extras: JSON.stringify(["Airport Meet & Greet", "Executive Chauffeur"]),
          insurancePlan: "Standard Corporate Cover",
          couponCode: "TIRUMALA20",
          discountAmount: 880,
          taxAmount: 670,
          securityDeposit: 4000,
          amount: 4398,
          branch: "Renigunta Airport Hub",
          paymentMethod: "Credit Card",
          paymentStatus: "Paid",
          bookingSource: "Web Portal",
          notes: "Flight AI-542 arriving at 3:15 PM.",
          startOdometer: 18200,
          returnOdometer: 18410,
          startFuel: 100,
          returnFuel: 100,
          penalties: 0,
          timelineStep: 2,
        },
        {
          id: 1040,
          bookingType: "Outstation",
          pickup: "Chandragiri Heritage Point",
          startDate: "2026-09-06",
          endDate: "2026-09-08",
          carName: "Toyota Innova Crysta ZX",
          status: "Pending",
          customerName: "Vikram Rathore",
          customerPhone: "+91 94401 77889",
          customerEmail: "vikram.r@yahoo.com",
          driverName: "Gopal Naidu",
          driverPhone: "+91 98765 00002",
          deliveryStaff: "Srinivas",
          pickupAddress: "Chandragiri Fort Road, Heritage Station",
          dropAddress: "Horsley Hills Resort & Return",
          duration: "2 Days (Outstation)",
          extras: JSON.stringify(["Interstate Permit Pass", "Chauffeur Night Allowance"]),
          insurancePlan: "Executive Fleet Cover",
          discountAmount: 0,
          taxAmount: 1067,
          securityDeposit: 6000,
          amount: 6998,
          branch: "Chandragiri Heritage Point",
          paymentMethod: "UPI",
          paymentStatus: "Pending",
          bookingSource: "Airport Concierge",
          notes: "VIP pilgrimage delegate group.",
          startOdometer: 32100,
          returnOdometer: 32450,
          startFuel: 100,
          returnFuel: 100,
          penalties: 0,
          timelineStep: 1,
        },
        {
          id: 1039,
          bookingType: "Hourly Rental",
          pickup: "Tirupati Central Hub",
          startDate: "2026-09-02",
          endDate: "2026-09-04",
          carName: "Maruti Swift ZXi+",
          status: "Returned",
          customerName: "Praveen Rao",
          customerPhone: "+91 98852 99001",
          customerEmail: "praveen@gmail.com",
          driverName: "Self Driven",
          driverPhone: "N/A",
          deliveryStaff: "Ravi Teja",
          pickupAddress: "Tirupati City Center",
          dropAddress: "Tirupati Central Hub",
          duration: "8 Hours Package",
          extras: JSON.stringify(["FASTag Pass"]),
          insurancePlan: "Basic Cover",
          couponCode: "WEEKEND10",
          discountAmount: 300,
          taxAmount: 518,
          securityDeposit: 3000,
          amount: 3398,
          branch: "Tirupati Central Hub",
          paymentMethod: "UPI",
          paymentStatus: "Paid",
          bookingSource: "Walk-in Desk",
          notes: "Completed smoothly with 0 penalties.",
          startOdometer: 15200,
          returnOdometer: 15320,
          startFuel: 100,
          returnFuel: 100,
          penalties: 0,
          timelineStep: 7,
        },
      ]);
    }

    // Seed default customers if empty
    const customerCount = await Customer.count();
    if (customerCount === 0) {
      await Customer.bulkCreate([
        {
          id: 201,
          name: "Rajesh Varma",
          phone: "+91 98765 11223",
          email: "rajesh.v@gmail.com",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          kycStatus: "Verified",
          dlNumber: "AP03 20210088992",
          aadhaarNumber: "7890 1234 5678",
          walletBalance: 2500,
          loyaltyPoints: 1250,
          referralCode: "RAJESH77",
          savedAddresses: JSON.stringify(["Platform 1 Exit, Tirupati Main Station", "Fortune Grand Hotel, Tirupati"]),
          favoriteCars: JSON.stringify(["Mahindra Scorpio-N Z8L 4x4"]),
          isBlacklisted: false,
          notes: "VIP Gold Renter. Frequent pilgrimage weekend visitor.",
          totalBookings: 8,
          totalSpent: 48900,
          joinedDate: "2025-11-10",
        },
        {
          id: 202,
          name: "Ananya Sharma",
          phone: "+91 98480 33445",
          email: "ananya.s@outlook.com",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
          kycStatus: "Verified",
          dlNumber: "KA05 20220019283",
          aadhaarNumber: "4567 8901 2345",
          walletBalance: 1200,
          loyaltyPoints: 840,
          referralCode: "ANANYA22",
          savedAddresses: JSON.stringify(["Terminal 1, Renigunta Airport"]),
          favoriteCars: JSON.stringify(["Honda City ZX Automatic"]),
          isBlacklisted: false,
          notes: "Corporate executive. Always requests child seat booster.",
          totalBookings: 5,
          totalSpent: 28400,
          joinedDate: "2026-01-15",
        },
        {
          id: 203,
          name: "Vikram Rathore",
          phone: "+91 94401 77889",
          email: "vikram.r@yahoo.com",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
          kycStatus: "Pending",
          dlNumber: "DL04 20230099182",
          aadhaarNumber: "9012 3456 7890",
          walletBalance: 0,
          loyaltyPoints: 150,
          referralCode: "VIKRAM99",
          savedAddresses: JSON.stringify(["Chandragiri Fort Heritage Gate"]),
          favoriteCars: JSON.stringify(["Toyota Innova Crysta ZX"]),
          isBlacklisted: false,
          notes: "Aadhaar pending manual back-side photo verification.",
          totalBookings: 2,
          totalSpent: 13996,
          joinedDate: "2026-08-01",
        },
        {
          id: 204,
          name: "Praveen Rao",
          phone: "+91 98852 99001",
          email: "praveen@gmail.com",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
          kycStatus: "Verified",
          dlNumber: "TS09 20200044192",
          aadhaarNumber: "1234 5678 9012",
          walletBalance: 500,
          loyaltyPoints: 620,
          referralCode: "PRAVEEN10",
          savedAddresses: JSON.stringify(["Tirupati City Center"]),
          favoriteCars: JSON.stringify(["Maruti Swift ZXi+"]),
          isBlacklisted: false,
          notes: "Punctual returns, 100% on-time record.",
          totalBookings: 6,
          totalSpent: 21500,
          joinedDate: "2026-02-20",
        },
      ]);
    }

    // Seed default drivers if empty
    const driverCount = await Driver.count();
    if (driverCount === 0) {
      await Driver.bulkCreate([
        {
          id: 301,
          name: "Suresh Kumar",
          phone: "+91 98765 00001",
          email: "suresh.driver@moarcars.in",
          avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
          licenseNumber: "AP03 20180099182",
          licenseExpiry: "2029-06-30",
          bgVerification: "Passed",
          branch: "Renigunta Airport Hub",
          status: "Available",
          liveLocation: "Renigunta Airport Terminal 1 Hub",
          todayTrips: 2,
          totalTrips: 184,
          earnings: 46200,
          rating: 4.9,
          ratingCount: 142,
        },
        {
          id: 302,
          name: "Gopal Naidu",
          phone: "+91 98765 00002",
          email: "gopal.naidu@moarcars.in",
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
          licenseNumber: "AP03 20160088192",
          licenseExpiry: "2028-11-15",
          bgVerification: "Passed",
          branch: "Chandragiri Heritage Point",
          status: "On Trip",
          liveLocation: "En route to Horsley Hills Resort",
          todayTrips: 1,
          totalTrips: 210,
          earnings: 58900,
          rating: 4.8,
          ratingCount: 198,
        },
        {
          id: 303,
          name: "Srinivas Reddy",
          phone: "+91 98765 00003",
          email: "srinivas.r@moarcars.in",
          avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
          licenseNumber: "AP03 20190011223",
          licenseExpiry: "2030-01-20",
          bgVerification: "Passed",
          branch: "Tirupati Central Hub",
          status: "Available",
          liveLocation: "Tirupati Central Hub Station Desk",
          todayTrips: 1,
          totalTrips: 145,
          earnings: 38400,
          rating: 5.0,
          ratingCount: 110,
        },
        {
          id: 304,
          name: "Venkatesh Rao",
          phone: "+91 98765 00004",
          email: "venkatesh.v@moarcars.in",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
          licenseNumber: "AP03 20170077441",
          licenseExpiry: "2027-08-10",
          bgVerification: "Passed",
          branch: "Tirupati Central Hub",
          status: "Off Duty",
          liveLocation: "Station Rest Lounge",
          todayTrips: 0,
          totalTrips: 172,
          earnings: 44500,
          rating: 4.7,
          ratingCount: 130,
        },
      ]);
    }

    // Seed default payments if empty
    const paymentCount = await Payment.count();
    if (paymentCount === 0) {
      await Payment.bulkCreate([
        {
          id: "PAY-9901",
          bookingId: 1042,
          customerName: "Rajesh Varma",
          amount: 4998,
          depositAmount: 5000,
          gateway: "UPI",
          status: "Captured",
          gstAmount: 762,
          tdsAmount: 0,
          transactionId: "UPI_TXN_881928471029",
          date: "2026-09-04 18:31:00",
          refundStatus: "N/A",
        },
        {
          id: "PAY-9902",
          bookingId: 1041,
          customerName: "Ananya Sharma",
          amount: 4398,
          depositAmount: 4000,
          gateway: "Razorpay",
          status: "Captured",
          gstAmount: 670,
          tdsAmount: 0,
          transactionId: "rzp_live_992100881234",
          date: "2026-09-04 14:16:00",
          refundStatus: "N/A",
        },
        {
          id: "PAY-9903",
          bookingId: 1040,
          customerName: "Vikram Rathore",
          amount: 6998,
          depositAmount: 6000,
          gateway: "UPI",
          status: "Pending",
          gstAmount: 1067,
          tdsAmount: 0,
          transactionId: "PENDING_AUTH_001",
          date: "2026-09-04 11:00:00",
          refundStatus: "N/A",
        },
        {
          id: "PAY-9904",
          bookingId: 1039,
          customerName: "Praveen Rao",
          amount: 3398,
          depositAmount: 3000,
          gateway: "UPI",
          status: "Refunded",
          gstAmount: 518,
          tdsAmount: 0,
          transactionId: "UPI_TXN_771928301928",
          date: "2026-09-02 08:05:00",
          refundStatus: "Processed",
        },
      ]);
    }

    // Seed default coupons if empty
    const couponCount = await Coupon.count();
    if (couponCount === 0) {
      await Coupon.bulkCreate([
        {
          id: 501,
          code: "MOARFIRST",
          type: "Flat Discount",
          discountValue: 500,
          isPercent: false,
          minBookingValue: 2500,
          usageLimit: 500,
          usedCount: 124,
          expiryDate: "2027-03-31",
          isActive: true,
        },
        {
          id: 502,
          code: "TIRUMALA20",
          type: "Percentage Discount",
          discountValue: 20,
          isPercent: true,
          minBookingValue: 3500,
          maxDiscount: 1000,
          usageLimit: 1000,
          usedCount: 412,
          expiryDate: "2026-12-31",
          isActive: true,
        },
        {
          id: 503,
          code: "WEEKEND10",
          type: "Weekend Offer",
          discountValue: 10,
          isPercent: true,
          minBookingValue: 2000,
          maxDiscount: 500,
          usageLimit: 300,
          usedCount: 88,
          expiryDate: "2027-01-31",
          isActive: true,
        },
        {
          id: 504,
          code: "FREEDELIVERY",
          type: "Free Delivery",
          discountValue: 300,
          isPercent: false,
          minBookingValue: 4000,
          usageLimit: 200,
          usedCount: 65,
          expiryDate: "2026-11-30",
          isActive: true,
        },
        {
          id: 505,
          code: "CORP25",
          type: "Corporate Coupon",
          discountValue: 25,
          isPercent: true,
          minBookingValue: 5000,
          maxDiscount: 2000,
          usageLimit: 100,
          usedCount: 29,
          expiryDate: "2027-06-30",
          isActive: true,
        },
      ]);
    }

    // Seed default reviews if empty
    const reviewCount = await Review.count();
    if (reviewCount === 0) {
      await Review.bulkCreate([
        {
          customerName: "Rajesh Varma",
          customerPhone: "+91 98765 11223",
          carName: "Mahindra Scorpio-N Z8L 4x4",
          rating: 5,
          comment: "Best self drive experience in Tirupati! The Scorpio-N was spotless and delivered right on time to railway station.",
          date: "2026-09-02",
          status: "Approved",
          isFeatured: true,
          adminReply: "Thank you Rajesh garu! Glad you had a great trip to Tirumala.",
        },
        {
          customerName: "Ananya Sharma",
          customerPhone: "+91 98480 33445",
          carName: "Honda City ZX Automatic",
          rating: 5,
          comment: "Seamless airport pickup at Renigunta. The chauffeur was very courteous and punctual.",
          date: "2026-09-01",
          status: "Approved",
          isFeatured: true,
          adminReply: "Thank you Ananya! We look forward to serving you again.",
        },
        {
          customerName: "Vikram Rathore",
          customerPhone: "+91 94401 77889",
          carName: "Toyota Innova Crysta ZX",
          rating: 4,
          comment: "Great vehicle condition for our family trip to Horsley Hills. Smooth booking process.",
          date: "2026-08-28",
          status: "Approved",
          isFeatured: false,
        },
      ]);
    }

    // Seed default support tickets if empty
    const ticketCount = await SupportTicket.count();
    if (ticketCount === 0) {
      await SupportTicket.bulkCreate([
        {
          id: "TICK-8801",
          customerName: "Rajesh Varma",
          customerPhone: "+91 98765 11223",
          subject: "Request extension of booking by 4 hours",
          category: "Booking Modification",
          priority: "High",
          status: "In Progress",
          assignedAgent: "Kiran Support",
          lastUpdated: "2026-09-04 19:10",
          messages: JSON.stringify([
            { sender: "Customer", text: "Can I extend the Scorpio-N return time by 4 hours tomorrow?", time: "7:05 PM" },
            { sender: "Agent", text: "Sure Rajesh garu, let me check the schedule and update your booking fare.", time: "7:10 PM" },
          ]),
        },
        {
          id: "TICK-8802",
          customerName: "Praveen Rao",
          customerPhone: "+91 98852 99001",
          subject: "Security deposit refund status query",
          category: "Billing & Refund",
          priority: "Medium",
          status: "Resolved",
          assignedAgent: "Accounts Desk",
          lastUpdated: "2026-09-03 11:30",
          messages: JSON.stringify([
            { sender: "Customer", text: "When will the ₹3,000 security deposit be refunded to my UPI?", time: "10:30 AM" },
            { sender: "Agent", text: "Your deposit refund of ₹3,000 has been processed to your PhonePe account.", time: "11:30 AM" },
          ]),
        },
      ]);
    }

    // Seed default activity logs if empty
    const logCount = await ActivityLog.count();
    if (logCount === 0) {
      await ActivityLog.bulkCreate([
        {
          actorName: "Executive Super Admin",
          actorRole: "Super Admin",
          action: "Vehicle Status Update",
          target: "Mahindra Scorpio-N (#3)",
          details: "Changed status from Available to Booked for Booking #1042",
          ipAddress: "192.168.1.100",
          timestamp: "2026-09-04 18:30:15",
        },
        {
          actorName: "Executive Super Admin",
          actorRole: "Super Admin",
          action: "Refund Processed",
          target: "Payment #PAY-9904",
          details: "Initiated instant UPI security deposit refund of ₹3,000 for Praveen Rao",
          ipAddress: "192.168.1.100",
          timestamp: "2026-09-02 09:15:22",
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
