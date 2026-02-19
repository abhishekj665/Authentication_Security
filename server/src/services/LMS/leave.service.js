import {
  LeaveBalance,
  LeaveRequest,
  LeaveType,
  User,
  LeavePolicy,
  LeavePolicyRule,
  LeaveAuditLog,
} from "../../models/Associations.model.js";
import ExpressError from "../../utils/Error.utils.js";
import STATUS from "../../constants/Status.js";
import { sequelize } from "../../config/db.js";
import { calculateLeaveDays } from "../../utils/calulateLeaveDays.utils.js";

export const registerLeaveRequest = async (data, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const dayRequested = calculateLeaveDays(
      data.startDate,
      data.endDate,
      data.isHalfDay,
    );

    data.daysRequested = dayRequested;

    const { leaveTypeId } = data;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: LeavePolicy,
          as: "leavePolicy",
          required: true,
          include: [
            {
              model: LeavePolicyRule,
              as: "rules",
              required: true,
              where: { leaveTypeId },
              include: [
                {
                  model: LeaveType,
                  as: "leaveType",
                  required: true,
                  attributes: ["isActive"],
                },
              ],
            },
          ],
        },
        {
          model: LeaveBalance,
          as: "leaveBalances",
          required: true,
          where: {
            leaveTypeId,
          },
        },
      ],
    });

    if (
      !user.leavePolicy.isActive ||
      !user.leavePolicy.rules ||
      !user.leavePolicy.rules[0].leaveType.isActive
    )
      throw new ExpressError(STATUS.BAD_REQUEST, "No active policy found");

    if (user.leaveBalances?.[0]?.balance < data.daysRequested)
      throw new ExpressError(STATUS.BAD_REQUEST, "Insufficient leave balance");

    const leaveData = await LeaveRequest.create(
      {
        ...data,
        userId: userId,
        status: "pending",
      },
      { transaction },
    );

    await LeaveAuditLog.create(
      {
        leaveRequestId: leaveData.id,
        newStatus: "PENDING",
        action: "APPLIED",
      },
      { transaction },
    );

    await transaction.commit();

    return {
      success: true,
      data: leaveData,
      messsage: "Leave Registered Successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const cancelLeaveRequest = async (id, data, userId) => {
  try {
    const leaveData = await LeaveRequest.findByPk(id);

    if (!leaveData || leaveData.userId !== userId) {
      return {
        success: false,
        messsage: "Leave Not Found",
      };
    }

    if (leaveData.status !== "Pending") {
      return {
        success: false,
        message: "You can't cancel this request",
      };
    }

    await leaveData.update(data);

    return {
      success: true,
      data: leaveData,
      messsage: "Leave Cancelled Successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const extendLeaveRequest = async (id, data, userId) => {
  try {
    const leaveData = await LeaveRequest.findByPk(id);

    const leaveType = LeaveType.findByPk(leaveData.leaveTypeId);

    if (!leaveType.carryForwardAllowed || leaveType.carryForwardLimit === 0) {
      return {
        success: false,
        message: "You can extend you request",
      };
    }
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};
