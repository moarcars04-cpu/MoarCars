import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.TEXT,
    defaultValue: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  kycStatus: {
    type: DataTypes.STRING,
    defaultValue: "Verified",
  },
  dlNumber: {
    type: DataTypes.STRING,
    defaultValue: "AP03 2024009182",
  },
  aadhaarNumber: {
    type: DataTypes.STRING,
    defaultValue: "1234 5678 9900",
  },
  passportNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dlDocUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  aadhaarDocUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  passportDocUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  walletBalance: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  loyaltyPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
  },
  referralCode: {
    type: DataTypes.STRING,
    defaultValue: "MOAR100",
  },
  savedAddresses: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  favoriteCars: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isBlacklisted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  blacklistReason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  totalBookings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  joinedDate: {
    type: DataTypes.STRING,
    defaultValue: "2026-09-04",
  },
});

export { Customer };
