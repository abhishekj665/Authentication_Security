import { sequelize } from "../../config/db.js";
import { DataTypes, UUIDV4 } from "sequelize";

const OvertimePolicy = sequelize.define(
  "OvertimePolicy",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    overtimeStartTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    overtimeMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    enable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    attendancePolicyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "OvertimePolicy",
    paranoid: true,
  },
);

export default OvertimePolicy;
