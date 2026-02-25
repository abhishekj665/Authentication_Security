import { sequelize } from "../../config/db.js";
import { DataTypes } from "sequelize";

const Interview = sequelize.define(
  "Interview",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    applicationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    interviewerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    interviewDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    interviewTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    roundName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mode: {
      type: DataTypes.ENUM("ONLINE", "OFFLINE"),
      allowNull: false,
    },
    meetingLInk: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED",
        "RESCHEDULED",
      ),
      allowNull: false,
      defaultValue: "SCHEDULED",
    },
    rescheduledBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    rescheduledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "Interview",
    paranoid: true,
  },
);

export default Interview;
