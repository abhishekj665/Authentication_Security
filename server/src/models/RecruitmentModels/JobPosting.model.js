import { sequelize } from "../../config/db.js";
import { DataTypes } from "sequelize";

const JobPosting = sequelize.define(
  "JobPosting",
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
    requisitionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.ENUM("INTERNAL", "EXTERNAL"),
      allowNull: false,
      defaultValue: "INTERNAL",
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    publishedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    externalUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    editedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "JobPosting",
    paranoid: true,
  },
);

export default JobPosting;
