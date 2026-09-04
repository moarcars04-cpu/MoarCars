import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  depositAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 3000,
  },
  gstAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 360,
  },
  gateway: {
    type: DataTypes.STRING,
    defaultValue: "Razorpay",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Captured",
  },
  date: {
    type: DataTypes.STRING,
    defaultValue: "2026-09-04",
  },
  partialPaid: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  balanceDue: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  refundStatus: {
    type: DataTypes.STRING,
    defaultValue: "Not Applicable",
  },
});

export { Payment };
