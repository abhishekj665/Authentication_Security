import STATUS from "../../constants/Status.js";
import {
  Attendance,
  AttendanceRequest,
  User,
} from "../../models/Associations.model.js";
import ExpressError from "../../utils/Error.utils.js";

export const getAttendance = async (managerId) => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      where: { requestedTo: managerId },
    });

    if (!attendanceData) {
      throw new ExpressError(STATUS.BAD_REQUEST, "No Attendance Data Found");
    }

    return {
      success: true,
      data: attendanceData,
    };
  } catch (error) {
    throw error;
  }
};

export const pendingAttendanceRequests = async (managerId) => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      where: { status: "PENDING", requestedTo: managerId },
    });

    if (!attendanceData) {
      throw new ExpressError(
        STATUS.BAD_REQUEST,
        "No pending attendance record found",
      );
    }

    return {
      success: true,
      data: attendanceData,
      message: "Data Fetched Successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const approvedAttendanceRequest = async (managerId) => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      where: { status: "APPROVED", requestedTo: managerId },
    });

    if (!attendanceData) {
      throw new ExpressError(STATUS.BAD_REQUEST, "No Attendance Data Found");
    }

    return {
      success: true,
      data: attendanceData,
      message: "Attendance Data Found",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const rejectedAttendanceRequest = async (managerId) => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      where: { status: "REJECTED" },
    });

    if (!attendanceData) {
      throw new ExpressError(STATUS.BAD_REQUEST, "No Attendance Data Found");
    }

    return {
      success: true,
      data: attendanceData,
      message: "Attendance Data Found",
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

export const rejectAttendanceRequest = async (managerId, id) => {
  try {
    const attendanceData = await AttendanceRequest.findOne({
      where: { id: id, isApproved: "PENDING" },
      include: [{ model: Attendance, attributes: ["punchOutAt", "punchInAt"] }],
    });

    if (!attendanceData) {
      throw new ExpressError(STATUS.BAD_REQUEST, "No Data Found");
    }

    attendanceData.reviewedBy = managerId;
    attendanceData.reviewedAt = new Date();
    attendanceData.status = "REJECTED";

    await attendanceData.save();

    return {
      success: true,
      data: attendanceData,
      message: "Attendance Rejected Successfully ",
    };
  } catch (error) {
    n;
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};
