import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const SupportTicket = sequelize.define("SupportTicket", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
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
  date: {
    type: DataTypes.STRING,
    defaultValue: "2026-09-04",
  },
  lastMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  messages: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export { SupportTicket };
