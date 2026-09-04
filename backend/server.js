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
import { Admin } from "./models/Admin.js";
import { AdminOtp } from "./models/AdminOtp.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development server
app.use(
  cors({
    origin: ["http://localhost:5173", "https://moarcars.com", "http://moarcars.com"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.join(__dirname, "../frontend/dist");
const rootDist = path.join(__dirname, "..");

// Serve static frontend files
if (fs.existsSync(path.join(frontendDist, "index.html"))) {
  app.use(express.static(frontendDist));
} else {
  app.use(express.static(rootDist));
}

// GET /api/cars - Get all fleet vehicles from database
app.get("/api/cars", async (req, res) => {
  try {
    const cars = await Car.findAll();
    res.json({
      success: true,
      data: cars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error reading fleet database.",
    });
  }
});

// POST /api/bookings - Create a new booking in database
app.post("/api/bookings", async (req, res) => {
  try {
    const { pickup, startDate, endDate, carName } = req.body;

    if (!pickup || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all booking details (pickup, start date, and end date).",
      });
    }

    const newBooking = await Booking.create({
      pickup,
      startDate,
      endDate,
      carName: carName || "General Search Inquiry",
    });

    console.log("New database booking created:", newBooking.toJSON());

    res.status(201).json({
      success: true,
      message: "Booking reservation saved successfully!",
      data: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error saving booking details.",
    });
  }
});

// In-memory OTP storage fallback: email -> { otp, expiresAt, attempts }
const otpStore = new Map();

// Helper to configure Gmail SMTP Transporter with Hostinger SSL compatibility
const getTransporter = () => {
  const user = (process.env.ADMIN_EMAIL || "moarcars04@gmail.com").trim();
  const pass = (process.env.ADMIN_EMAIL_APP_PASSWORD || "giykjehrkoeeoqzc").replace(/\s+/g, "");
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// POST /api/admin/send-otp - Send 6-digit login OTP to Admin Email
app.post("/api/admin/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const targetEmail = (email || process.env.ADMIN_EMAIL || "moarcars04@gmail.com").trim().toLowerCase();
    const authorizedEmail = (process.env.ADMIN_EMAIL || "moarcars04@gmail.com").trim().toLowerCase();

    // Verify requested email is authorized admin
    if (targetEmail !== authorizedEmail) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized admin email address.",
      });
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Save in memory
    otpStore.set(targetEmail, { otp, expiresAt, attempts: 0 });

    // Save in database
    try {
      await AdminOtp.destroy({ where: { email: targetEmail } });
      await AdminOtp.create({ email: targetEmail, otp, expiresAt, attempts: 0 });
    } catch (dbErr) {
      console.warn("[AUTH] DB OTP store warning (falling back to memory):", dbErr.message);
    }

    const transporter = getTransporter();
    const mailOptions = {
      from: `"Moar Cars Admin" <${authorizedEmail}>`,
      to: targetEmail,
      subject: `🔑 Your Admin Login Code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b132b; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #48cae4; margin: 0; font-size: 24px;">Moar Cars Rental</h1>
            <p style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">Admin Control Panel</p>
          </div>
          <div style="background-color: #1c2541; padding: 25px; border-radius: 8px; border: 1px solid #3a506b; text-align: center;">
            <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 15px;">Your one-time verification code for admin login is:</p>
            <div style="background: linear-gradient(135deg, #00b4d8, #0077b6); color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 20px; border-radius: 8px; display: inline-block; margin: 10px 0;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 15px;">⏱️ This code is valid for <strong>10 minutes</strong>.</p>
          </div>
          <p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 20px;">
            If you did not request this login code, please secure your account immediately.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[AUTH] Admin OTP sent successfully to ${targetEmail}`);

    res.json({
      success: true,
      message: `Verification code sent to ${targetEmail}`,
    });
  } catch (error) {
    console.error("[AUTH] Error sending admin OTP:", error);
    res.status(500).json({
      success: false,
      message: `Failed to send email: ${error.message || "Please check email configuration"}`,
    });
  }
});

// POST /api/admin/verify-otp - Verify 6-digit OTP for login
app.post("/api/admin/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const targetEmail = (email || process.env.ADMIN_EMAIL || "moarcars04@gmail.com").trim().toLowerCase();

    if (!otp) {
      return res.status(400).json({ success: false, message: "Please enter the 6-digit OTP code." });
    }

    let record = otpStore.get(targetEmail);

    // Fallback to database check if in-memory missed
    if (!record) {
      try {
        const dbRecord = await AdminOtp.findOne({
          where: { email: targetEmail },
          order: [["createdAt", "DESC"]],
        });
        if (dbRecord) {
          record = {
            otp: dbRecord.otp,
            expiresAt: Number(dbRecord.expiresAt),
            attempts: dbRecord.attempts,
          };
        }
      } catch (dbErr) {
        console.warn("[AUTH] DB check error:", dbErr.message);
      }
    }

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "No active verification code found. Please request a new OTP.",
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(targetEmail);
      try { await AdminOtp.destroy({ where: { email: targetEmail } }); } catch {}
      return res.status(400).json({
        success: false,
        message: "The verification code has expired. Please request a new one.",
      });
    }

    if (record.otp !== otp.toString().trim()) {
      record.attempts += 1;
      try {
        await AdminOtp.update({ attempts: record.attempts }, { where: { email: targetEmail } });
      } catch {}

      if (record.attempts >= 5) {
        otpStore.delete(targetEmail);
        try { await AdminOtp.destroy({ where: { email: targetEmail } }); } catch {}
        return res.status(400).json({
          success: false,
          message: "Too many failed attempts. Please request a new OTP.",
        });
      }
      return res.status(400).json({
        success: false,
        message: `Invalid code. ${5 - record.attempts} attempt(s) remaining.`,
      });
    }

    // OTP matched successfully!
    otpStore.delete(targetEmail);
    try { await AdminOtp.destroy({ where: { email: targetEmail } }); } catch {}
    console.log(`[AUTH] Admin successfully authenticated via Email OTP: ${targetEmail}`);

    res.json({
      success: true,
      message: "Admin verification successful!",
      username: targetEmail,
    });
  } catch (error) {
    console.error("[AUTH] OTP Verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error during verification." });
  }
});

// POST /api/admin/login - Authenticate admin credentials (fallback)
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required." });
    }
    const admin = await Admin.findOne({ where: { username, password } });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid username or password." });
    }
    res.json({ success: true, message: "Login successful", username: admin.username });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// GET /api/admin/bookings - Fetch all user bookings
app.get("/api/admin/bookings", async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// POST /api/admin/cars - Add a new vehicle to the fleet
app.post("/api/admin/cars", async (req, res) => {
  try {
    const { name, detail, price, tag, imagePosition } = req.body;
    if (!name || !detail || !price) {
      return res.status(400).json({ success: false, message: "Name, detail, and price are required." });
    }
    const newCar = await Car.create({ name, detail, price, tag, imagePosition });
    res.status(201).json({ success: true, message: "Car added successfully!", data: newCar });
  } catch (error) {
    console.error("Add car error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// DELETE /api/admin/cars/:id - Remove a vehicle from the fleet
app.delete("/api/admin/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Car.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Car not found." });
    }
    res.json({ success: true, message: "Car deleted successfully!" });
  } catch (error) {
    console.error("Delete car error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Serve index.html for all other routes (SPA fallback)
app.get("*", (req, res) => {
  const frontendIndex = path.join(frontendDist, "index.html");
  if (fs.existsSync(frontendIndex)) {
    return res.sendFile(frontendIndex);
  }
  res.sendFile(path.join(rootDist, "index.html"));
});

// Start listening immediately so web server reverse proxies never get 503
const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// Sync database and seed tables asynchronously in the background
(async () => {
  try {
    await sequelize.sync();
    console.log("Database tables synced successfully.");

    // Seed default vehicles if database is empty
    const carCount = await Car.count();
    if (carCount === 0) {
      console.log("Database: Seeding default vehicles...");
      await Car.bulkCreate([
        {
          name: "City Hatchbacks",
          detail: "Smart, efficient and easy to park",
          price: "₹1,699",
          tag: "Everyday",
          imagePosition: "left",
        },
        {
          name: "Executive Sedans",
          detail: "A smoother way to go further",
          price: "₹2,199",
          tag: "Comfort",
          imagePosition: "center",
        },
        {
          name: "Adventure SUVs",
          detail: "More room for the road ahead",
          price: "₹2,499",
          tag: "Popular",
          imagePosition: "right",
        },
      ]);
      console.log("Database: Seeding complete.");
    }

    // Seed default admin if database is empty
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      console.log("Database: Seeding default admin credentials...");
      await Admin.create({
        username: "admin",
        password: "adminpassword",
      });
      console.log("Database: Seeding default admin complete.");
    }
  } catch (err) {
    console.warn("Database initialization warning (DB offline/connecting):", err.message);
  }
})();

export default app;
export { app };
