import { AttendancePolicy } from "../../models/Associations.model.js";
import OvertimePolicy from "../../models/OvertimePolicy.js";
import ExpressError from "../../utils/Error.utils.js";
import STATUS from "../../constants/Status.js";
import { sequelize } from "../../config/db.js";

export const createAttendancePolicy = async (userId, data) => {
  const t = await sequelize.transaction();
  try {
    const { overtimePolicy, ...attendancePolicy } = data;

    const attendance = await AttendancePolicy.create(
      {
        ...attendancePolicy,
        createdBy: userId,
      },
      {
        transaction: t,
      },
    );

    if (overtimePolicy) {
      await OvertimePolicy.create(
        {
          ...overtimePolicy,
          attendancePolicyId: attendance.id,
        },
        { transaction: t },
      );
    }

    await t.commit();

    const policyData = await AttendancePolicy.findByPk(attendance.id, {
      include: [OvertimePolicy],
    });

    return {
      success: true,
      data: policyData,
      message: "Attendance and Overtime Policy Created",
    };
  } catch (error) {
    await t.rollback();
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const getAttendancePolicies = async () => {
  try {
    const policyData = await AttendancePolicy.findAll({
      include: [OvertimePolicy],
    });

    if (!policyData.length) {
      return { success: false, message: "Attendance Policy Data Not Found" };
    }

    return {
      success: true,
      data: policyData,
      message: "Data Found Successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const getAttendancePolicyById = async (id) => {
  try {
    const policyData = await AttendancePolicy.findByPk(id, {
      include: [OvertimePolicy],
    });

    if (!policyData) {
      return { success: false, message: "Attendance Policy Data Not Found" };
    }

    return {
      success: true,
      data: policyData,
      message: "Attendance Policy Data Fetched Successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const updateAttendancePolicy = async (id, data) => {
  const t = await sequelize.transaction();
  try {
    const { overtimePolicy, ...attendanceData } = data;

    const [affectedRows] = await AttendancePolicy.update(attendanceData, {
      where: { id },
      transaction: t,
    });

    if (!affectedRows) {
      await t.rollback();
      return { success: false, message: "Data Not Found" };
    }

    if (overtimePolicy) {
      const existingOTP = await OvertimePolicy.findOne({
        where: { attendancePolicyId: id },
        transaction: t,
      });

      if (existingOTP) {
        await existingOTP.update(overtimePolicy, { transaction: t });
      } else {
        await OvertimePolicy.create(
          { ...overtimePolicy, attendancePolicyId: id },
          { transaction: t },
        );
      }
    }

    await t.commit();

    const updated = await AttendancePolicy.findByPk(id, {
      include: [OvertimePolicy],
    });

    return {
      success: true,
      data: updated,
      message: "Policy Updated",
    };
  } catch (error) {
    await t.rollback();
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const deleteAttendancePolicy = async (id) => {
  try {
    const policy = await AttendancePolicy.findByPk(id);

    if (!policy) {
      return { success: false, message: "Policy Data Not Found" };
    }

    await policy.destroy();

    return {
      success: true,
      message: "Attendance Policy Deleted Successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};
