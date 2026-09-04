import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Coupon = sequelize.define("Coupon", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: "Flat Discount",
  },
  discountValue: {
    type: DataTypes.INTEGER,
    defaultValue: 500,
  },
  isPercent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  minBookingValue: {
    type: DataTypes.INTEGER,
    defaultValue: 2000,
  },
  maxDiscountCap: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 500,
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  expiryDate: {
    type: DataTypes.STRING,
    defaultValue: "2027-12-31",
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export { Coupon };
