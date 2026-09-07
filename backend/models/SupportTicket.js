import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const SupportTicket = sequelize.define("SupportTicket", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
  },
  customerName: {
    type: DataTypes.STRING,
    defaultValue: "Valued Customer",
  },
  customerPhone: {
    type: DataTypes.STRING,
    defaultValue: "+91 90000 00000",
  },
  subject: {
    type: DataTypes.STRING,
    defaultValue: "Customer Support Inquiry",
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: "General",
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: "Medium",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Open",
  },
  assignedTo: {
    type: DataTypes.STRING,
    defaultValue: "Unassigned",
  },
  assignedAgent: {
    type: DataTypes.STRING,
    defaultValue: "Customer Support Desk",
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date: {
    type: DataTypes.STRING,
    defaultValue: "2026-09-04",
  },
  createdAt: {
    type: DataTypes.STRING,
    defaultValue: "Just now",
  },
  lastUpdated: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  messages: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});

export { SupportTicket };
