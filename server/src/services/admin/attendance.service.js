import STATUS from "../../constants/Status.js";
import {
  Attendance,
  AttendanceRequest,
  User,
} from "../../models/Associations.model.js";
import ExpressError from "../../utils/Error.utils.js";

export const getAllAttendance = async () => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      attributes: ["id", "reviewedBy", "status"],
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
        { model: User, attributes: ["id", "role", "email"], as: "requester" },
      ],
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

export const getUserAttendance = async () => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      include: [
        {
          model: User,
          where: { role: "user" },
          attributes: ["id", "role", "isVerified"],
          as: "requester",
        },
      ],
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

export const getManagerAttendance = async () => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      include: [{ model: User, where: { role: "manager" }, as: "requester" }],
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

export const pendingUserAttendanceRequests = async () => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      where: { status: "PENDING" },
      include: [
        {
          model: User,
          where: { role: "user" },
          attributes: ["id", "role", "isVerified"],
          as: "requester",
        },
      ],
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

export const pendingManagerAttendanceRequests = async () => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      where: { status: "PENDING" },
      include: [
        {
          model: User,
          where: { role: "manager" },
          attributes: ["id", "role", "isVerified"],
          as: "requester",
        },
      ],
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

export const approvedUserAttendanceRequest = async () => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      where: { status: "APPROVED" },
      include: [{ model: User, where: { role: "user" }, as: "requester" }],
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

export const approvedManagerAttendanceRequest = async () => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      where: { status: "APPROVED" },
      include: [{ model: User, where: { role: "manager" }, as: "requester" }],
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

export const rejectedUserAttendanceRequest = async () => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      where: { status: "REJECTED" },
      include: [{ model: User, where: { role: "user" }, as: "requester" }],
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

export const rejectedManagerAttendanceRequest = async () => {
  try {
    const attendanceData = await AttendanceRequest.findAll({
      where: { status: "REJECTED" },
      include: [{ model: User, where: { role: "manager" }, as: "requester" }],
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

export const approveAttendanceRequest = async (adminId, id) => {
  try {
    const attendanceData = await AttendanceRequest.findOne({
      where: {
        id: id,
        status: "PENDING",
        requestedTo: adminId,
        as: "approver",
      },
    });

    if (!attendanceData) {
      throw new ExpressError(STATUS.BAD_REQUEST, "Data Not Found");
    }

    attendanceData.status = "APPROVED";
    attendanceData.reviewedBy = adminId;
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

export const rejectAttendanceRequest = async (adminId, id) => {
  try {
    const attendanceData = await AttendanceRequest.findOne({
      where: {
        id: id,
        isApproved: "PENDING",
        requestedTo: adminId,
        as: "approver",
      },
    });

    if (!attendanceData) {
      throw new ExpressError(STATUS.BAD_REQUEST, "No Data Found");
    }

    attendanceData.status = "REJECTED";
    attendanceData.reviewedBy = adminId;
    attendanceData.reviewedAt = new Date();

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
