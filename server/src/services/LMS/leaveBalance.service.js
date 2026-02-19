import { User } from "../../models/Associations.model.js";
import ExpressError from "../../utils/Error.utils.js";
import STATUS from "../../constants/Status.js";
import { sequelize } from "../../config/db.js";

export const assignLeaveBalance = async (userId, year) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) throw new Error("User not found");
    if (!user.leavePolicyId) throw new Error("User has no policy assigned");

    await sequelize.query(
      `
      INSERT INTO LeaveBalance
(id, userId, leaveTypeId, totalAllocated, used, balance, year, policyId, createdAt, updatedAt)

SELECT 
  UUID(),
  u.id,
  r.leaveTypeId,
  r.quotaPerYear,
  0,
  r.quotaPerYear,
  :year,
  r.policyId,
  NOW(),
  NOW()

FROM Users u
JOIN LeavePolicyRule r
  ON u.leavePolicyId = r.policyId

WHERE u.id = :userId

ON DUPLICATE KEY UPDATE
  totalAllocated = VALUES(totalAllocated),
  balance = GREATEST(0, VALUES(totalAllocated) - LeaveBalance.used),
  updatedAt = NOW();

    `,
      {
        replacements: { userId, year },
      },
    );

    return {
      success: true,
      message: "Leave balances assigned successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const assignLeaveBalanceBulk = async (policyId, year) => {
  try {
    const currentYear = Number(year) || new Date().getFullYear();

    await sequelize.query(`
      INSERT INTO LeaveBalance
      (id, userId, leaveTypeId, totalAllocated, used, balance, year, policyId, createdAt, updatedAt)

      SELECT 
        UUID(),
        u.id,
        r.leaveTypeId,
        r.quotaPerYear,
        0,
        r.quotaPerYear,
        :year,
        r.policyId,
        NOW(),
        NOW()

      FROM Users u
      JOIN LeavePolicyRule r
        ON u.leavePolicyId = r.policyId

      WHERE u.leavePolicyId = :policyId

      ON DUPLICATE KEY UPDATE
        totalAllocated = VALUES(totalAllocated),
        balance = GREATEST(0, VALUES(totalAllocated) - LeaveBalance.used),
        updatedAt = NOW();
    `, {
      replacements: { policyId, year: currentYear },
    });

    return {
      success: true,
      message: "Leave balances generated/updated successfully for policy",
    };

  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

