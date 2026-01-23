import { Attendance } from "../models/Associations.model.js";
import ExpressError from "../utils/Error.utils.js";
import { Op } from "sequelize";

export const registerInService = async (userId) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      where: {
        userId,
        punchInAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
      order: [["punchInAt", "DESC"]],
    });

    if (existingAttendance) {
      return {
        success: false,
        message: "You Already PunchIn",
      };
    }

    const data = await Attendance.create({
      userId,
      punchInAt: new Date(),
    });

    return {
      success: true,
      data,
      message: "PunchIn successfully",
    };
  } catch (error) {
    throw new ExpressError(400, error.message);
  }
};

export const registerOutService = async (userId) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const data = await Attendance.findOne({
      where: {
        userId: userId,
        punchInAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
      order: [["punchInAt", "DESC"]],
      limit: 1,
    });

    if (data) {
      data.punchOutAt = Date.now();
      await data.save();
    }

    let time = new Date(data.punchOutAt) - new Date(data.punchInAt);

    const workingHour = time / (1000 * 60 * 60);

    if (workingHour < 8) {
      data.totalLeaves += 1 / 2;
      data.presentDay += 1 / 2;
      await data.save();

      return {
        success: true,
        message: "You Successfully PunchOut, HalfDay Marked",
      };
    }

    if (workingHour >= 8) {
      data.totalLeaves += 1 / 2;
      data.presentDay += 1 / 2;
      await data.save();

      return {
        success: true,
        message: "You Successfully Punch Out, FullDay Marked",
      };
    }

    return {
      success: true,
      data: data,
      message: "You Successfully PunchOut",
    };
  } catch (error) {
    throw new ExpressError(400, error.message);
  }
};
