import STATUS from "../../constants/Status.js";
import {
  Attendance,
  AttendanceRequest,
  User,
} from "../../models/Associations.model.js";
import ExpressError from "../../utils/Error.utils.js";

export const getAllAttendance = async (filters = {}, managerId) => {
  try {
    const { status, role, page = 1, limit = 10 } = filters;

    const where = { requestedTo: managerId };
    if (status) where.status = status.toUpperCase();

    const requesterWhere = {};
    if (role) requesterWhere.role = role;

    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await AttendanceRequest.findAndCountAll({
      where,
      attributes: ["id", "reviewedBy", "requestedTo", "status", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
      distinct: true,
      include: [
        {
          model: Attendance,
          attributes: [
            "id",
            "punchInAt",
            "punchOutAt",
            "workedMinutes",
            "breakMinutes",
          ],
        },
        {
          model: User,
          as: "requester",
          attributes: ["id", "role", "email"],
          required: true,
          where: Object.keys(requesterWhere).length
            ? requesterWhere
            : undefined,
        },
      ],
    });

    return {
      success: true,
      data: rows,
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const getAttendance = async (filters = {}, managerId) => {
  try {
    const { status, role, page = 1, limit = 10 } = filters;

    const where = { requestedBy: managerId };
    if (status) where.status = status.toUpperCase();

    const requesterWhere = {};
    if (role) requesterWhere.role = role;

    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await AttendanceRequest.findAndCountAll({
      where,
      attributes: ["id", "reviewedBy", "requestedTo", "status", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
      distinct: true,
      include: [
        {
          model: Attendance,
          attributes: [
            "id",
            "punchInAt",
            "punchOutAt",
            "workedMinutes",
            "breakMinutes",
          ],
        },
        {
          model: User,
          as: "requester",
          attributes: ["id", "role", "email"],
          required: true,
          where: Object.keys(requesterWhere).length
            ? requesterWhere
            : undefined,
        },
        {
          model: User,
          as: "approver",
          attributes: ["id", "email", "role"],
          required: false,
        },
      ],
    });

    return {
      success: true,
      data: rows,
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const approveAttendanceRequest = async (managerId, id) => {
  try {
    const attendanceData = await AttendanceRequest.findOne({
      where: { id: id, status: "PENDING" },
      include: [{ model: Attendance, attributes: ["punchOutAt", "punchInAt"] }],
    });

    if (!attendanceData) {
      throw new ExpressError(STATUS.BAD_REQUEST, "Data Not Found");
    }

    if (
      !attendanceData.Attendance.punchOutAt ||
      !attendanceData.Attendance.punchInAt
    ) {
      throw new ExpressError(
        STATUS.BAD_REQUEST,
        "You can't approved attendance before punch out",
      );
    }

    attendanceData.status = "APPROVED";
    attendanceData.reviewedBy = managerId;
    attendanceData.reviewedAt = new Date();

    await attendanceData.save();

    return {
      success: true,
      data: attendanceData,
      message: "Attendance Approved Succussfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const rejectAttendanceRequest = async (managerId, id, data) => {
  try {
    const attendanceData = await AttendanceRequest.findOne({
      where: { id: id, status: "PENDING" },
      include: [{ model: Attendance, attributes: ["punchOutAt", "punchInAt"] }],
    });

    if (!attendanceData) {
      throw new ExpressError(STATUS.BAD_REQUEST, "No Data Found");
    }

    if (
      !attendanceData.Attendance.punchOutAt ||
      !attendanceData.Attendance.punchInAt
    ) {
      throw new ExpressError(
        STATUS.BAD_REQUEST,
        "You can't reject attendance before punch out",
      );
    }

    attendanceData.reviewedBy = managerId;
    attendanceData.reviewedAt = new Date();
    attendanceData.status = "REJECTED";
    attendanceData.remark = data.remark;

    await attendanceData.save();

    return {
      success: true,
      data: attendanceData,
      message: "Attendance Rejected Successfully ",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const bulkAttendanceRequestReject = async (
  { ids, remark },
  managerId,
) => {
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ExpressError(
        STATUS.BAD_REQUEST,
        "You have to select at least one request",
      );
    }

    if (!remark?.trim()) {
      throw new ExpressError(STATUS.BAD_REQUEST, "Remark is required");
    }

    const requests = await AttendanceRequest.findAll({
      where: { id: ids, status: "PENDING" },
      include: [
        {
          model: Attendance,
          attributes: ["id", "punchOutAt"],
        },
      ],
    });

    if (requests.length !== ids.length) {
      throw new ExpressError(
        STATUS.BAD_REQUEST,
        "Some requests not found or not pending",
      );
    }

    const hasIncomplete = requests.some((r) => !r.Attendance?.punchOutAt);

    if (hasIncomplete) {
      throw new ExpressError(
        STATUS.BAD_REQUEST,
        "Cannot reject — some records have no punch out",
      );
    }

    await AttendanceRequest.update(
      {
        status: "REJECTED",
        remark,
        reviewedBy: managerId,
      },
      {
        where: { id: ids, status: "PENDING" },
      },
    );

    return {
      success: true,
      message: "Rejected successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const bulkAttendanceRequestApprove = async ({ ids }, managerId) => {
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ExpressError(
        STATUS.BAD_REQUEST,
        "You have to select at least one request",
      );
    }

    const requests = await AttendanceRequest.findAll({
      where: { id: ids, status: "PENDING" },
      include: [
        {
          model: Attendance,
          attributes: ["id", "punchOutAt"],
        },
      ],
    });

    if (requests.length !== ids.length) {
      throw new ExpressError(
        STATUS.BAD_REQUEST,
        "Some requests not found or not pending",
      );
    }

    const hasIncomplete = requests.some((r) => !r.Attendance?.punchOutAt);

    if (hasIncomplete) {
      throw new ExpressError(
        STATUS.BAD_REQUEST,
        "Cannot approve — some records have no punch out",
      );
    }

    await AttendanceRequest.update(
      {
        status: "APPROVED",
        reviewedBy: managerId,
      },
      {
        where: { id: ids, status: "PENDING" },
      },
    );

    return {
      success: true,
      message: "Approved successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};
