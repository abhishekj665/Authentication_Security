import { sequelize } from "../../config/db.js";
import { DataTypes } from "sequelize";

const JobRequisition = sequelize.define(
  "JobRequisition",
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    employmentType: {
      type: DataTypes.ENUM("FULLTIME", "INTERN", "PARTTIME", "CONTRACT"),
    },
    headCount : {
      type : DataTypes.INTEGER,
      allowNull : false,
      defaultValue : 1
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experienceMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    experienceMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    budgetMin: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    budgetMax: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("HIGH", "MEDIUM", "LOW"),
      allowNull: false,
    },
    jobDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "DRAFT",
        "PENDING",
        "APPROVED",
        "REJECTED",
        "CLOSED",
      ),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    approvedAt: {
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
    tableName: "JobRequisition",
    paranoid: true,
  },
);

export default JobRequisition;
