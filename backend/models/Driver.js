import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Driver = sequelize.define("Driver", {
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
    defaultValue: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  branch: {
    type: DataTypes.STRING,
    defaultValue: "Tirupati Central Hub",
  },
  licenseNumber: {
    type: DataTypes.STRING,
    defaultValue: "DL-03-2019-9944",
  },
  licenseExpiry: {
    type: DataTypes.STRING,
    defaultValue: "2029-08-15",
  },
  bgVerification: {
    type: DataTypes.STRING,
    defaultValue: "Passed",
  },
  liveLocation: {
    type: DataTypes.STRING,
    defaultValue: "Alipiri Toll Gate",
  },
  totalTrips: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  todayTrips: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  earnings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 4.9,
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Available",
  },
  isHillCertified: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export { Driver };
