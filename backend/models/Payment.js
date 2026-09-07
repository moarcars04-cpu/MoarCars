import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
  },
  bookingId: {
    type: DataTypes.INTEGER,
    defaultValue: 1001,
  },
  customerName: {
    type: DataTypes.STRING,
    defaultValue: "Valued Customer",
  },
  amount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  advancePaid: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  partialPaid: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  balanceDue: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  cgstAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  sgstAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  tdsAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  refundStatus: {
    type: DataTypes.STRING,
    defaultValue: "Not Applicable",
  },
  refundAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export { Payment };
