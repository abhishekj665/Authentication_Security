import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const AttendanceRequest = sequelize.define(
  "AttendanceRequest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    attendanceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    requestedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    requestedTo: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("APPROVED", "REJECTED", "PENDING"),
      defaultValue: "PENDING",
    },
  },
  {
    timestamps: true,
    tableName: "AttendanceRequest",
    paranoid: true,
    indexes: [{ fields: ["attendanceId", "requestedBy", "requestedTo"] }],
  },
);

export default AttendanceRequest;
