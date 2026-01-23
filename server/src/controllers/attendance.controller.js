import STATUS from "../constants/Status.js";
import * as attendanceServices from "../services/attendance.service.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";

export const registerInController = async (req, res, next) => {
  try {
    let response = await attendanceServices.registerInService(req.user.id);

    if (response.success) {
      return successResponse(
        res,
        response.data,
        response.message,
        STATUS.ACCEPTED,
      );
    } else {
      return errorResponse(res, response.message);
    }
  } catch (error) {
    next(error);
  }
};

export const registerOutController = async (req, res, next) => {
  try {
    let response = await attendanceServices.registerOutService(req.user.id);

    if (response.success) {
      return successResponse(
        res,
        response.data,
        response.message,
        STATUS.ACCEPTED,
      );
    } else {
      return errorResponse(res, response.message);
    }
  } catch (error) {
    next(error);
  }
};
