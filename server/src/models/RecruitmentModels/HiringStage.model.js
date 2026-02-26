import { sequelize } from "../../config/db.js";
import { DataTypes } from "sequelize";

const HiringStage = sequelize.define(
  "HiringStage",
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
    jobPostingId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stageOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isFinal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isRejectStage: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isOfferStage: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    colorCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    autoMoveRule: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "HiringStage",
    paranoid: true,
  },
);

export default HiringStage;
