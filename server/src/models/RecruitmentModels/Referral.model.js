import { sequelize } from "../../config/db.js";
import { DataTypes } from "sequelize";

const Referral = sequelize.define(
  "Referral",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    candidateId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    referredById: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    bonusAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "Referral",
    paranoid: true,
  },
);

export default Referral;
