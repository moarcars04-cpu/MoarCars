import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bookingType: {
    type: DataTypes.STRING,
    defaultValue: "Self Drive",
  },
  pickup: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  carName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "General Search Inquiry",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Confirmed",
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Valued Customer",
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "+91 98765 43210",
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "customer@example.com",
  },
  driverName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  driverPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deliveryStaff: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pickupAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dropAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING,
    defaultValue: "2 Days",
  },
  extras: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  insurancePlan: {
    type: DataTypes.STRING,
    defaultValue: "Comprehensive Zero-Dep",
  },
  couponCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  discountAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  taxAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 360,
  },
  securityDeposit: {
    type: DataTypes.INTEGER,
    defaultValue: 3000,
  },
  amount: {
    type: DataTypes.INTEGER,
    defaultValue: 2000,
  },
  branch: {
    type: DataTypes.STRING,
    defaultValue: "Tirupati Central Hub",
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: "UPI",
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: "Paid",
  },
  bookingSource: {
    type: DataTypes.STRING,
    defaultValue: "Web Portal",
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  startOdometer: {
    type: DataTypes.INTEGER,
    defaultValue: 18450,
  },
  returnOdometer: {
    type: DataTypes.INTEGER,
    defaultValue: 18690,
  },
  startFuel: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
  },
  returnFuel: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
  },
  penalties: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  timelineStep: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
});

export { Booking };
