import STATUS from "../../constants/Status.js";
import ExpressError from "../../utils/Error.utils.js";
import {
  LeaveAuditLog,
  LeaveBalance,
  LeaveRequest,
  LeaveType,
  User,
} from "../../models/Associations.model.js";
import { sequelize } from "../../config/db.js";

export const approveLeaveRequest = async (id, managerId) => {
  const transaction = await sequelize.transaction();

  try {
    const leaveData = await LeaveRequest.findOne({
      where: { id },
      include: [
        { model: LeaveAuditLog, as: "auditLogs", required: false },
        {
          model: User,
          where: { role: "user", managerId: managerId },
          as: "employee",
          required: true,
          include: [
            {
              model: LeaveBalance,
              as: "leaveBalances",
              required: false,
            },
          ],
        },
      ],
    });

    if (!leaveData)
      throw new ExpressError(STATUS.BAD_REQUEST, "Leave Request Not Found");

    if (leaveData.status !== "PENDING" || leaveData.cancelRequest) {
      return {
        success: false,
        message: "You can't approve this request, the action is already done",
      };
    }

    const leaveBalanceData = await LeaveBalance.findOne({
      where: {
        userId: leaveData.userId,
        leaveTypeId: leaveData.leaveTypeId,
      },
    });

    const remainLeaveDay = leaveBalanceData.balance - leaveData.daysRequested;
    const used = leaveBalanceData.balance - remainLeaveDay;

    await leaveBalanceData.update(
      { balance: remainLeaveDay, used },
      { transaction },
    );

    await leaveData.update(
      { status: "APPROVED", reviewedBy: managerId, reviewedAt: new Date(), remark : "Approved By Manager"},
      { transaction },
    );

    await LeaveAuditLog.create(
      {
        leaveRequestId: leaveData.id,
        newStatus: "APPROVED",
        action: "APPROVED",
        reviewedAt: new Date(),
        reviewedBy: managerId,
      },
      { transaction },
    );

    await transaction.commit();

    return {
      success: true,
      data: {
        status: leaveData.status,
      },
      messsage: "Leave Approved Successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const rejectLeaveRequest = async (id,remark,  managerId) => {
  const transaction = await sequelize.transaction();
  try {
    const leaveData = await LeaveRequest.findOne({
      where: { id },
      include: [
        { model: LeaveAuditLog, as: "auditLogs", required: true },
        {
          model: User,
          where: { role: "user", managerId: managerId },
          as: "employee",
          required: true,
        },
      ],
    });

    if (!leaveData)
      throw new ExpressError(STATUS.BAD_REQUEST, "Leave Request Not Found");

    if (leaveData.status !== "PENDING" || leaveData.cancelRequest) {
      return {
        success: false,
        message: "You can't reject this request, the action is already done",
      };
    }

    await leaveData.update(
      {
        status: "REJECTED",
        reviewedBy: managerId,
        reviewedAt: new Date(),
        reviewedBy: managerId,
        remark : remark
      },
      { transaction },
    );

    await LeaveAuditLog.create(
      {
        leaveRequestId: leaveData.id,
        newStatus: "REJECTED",
        action: "REJECTED",
        reviewedAt: new Date(),
        reviewedBy: managerId,
      },
      { transaction },
    );

    await transaction.commit();

    return {
      success: true,
      data: {
        status: leaveData.status,
      },
      messsage: "Leave Rejected Successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};
