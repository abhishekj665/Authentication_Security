import {errorResponse, successResponse} from "../../utils/response.utils.js";
import * as intreviewFeedbackService from "../../services/recruitment/interviewFeedback.service.js";
import  STATUS from "../../constants/Status.js";

export const createInterviewFeedback = async (req, res, next) => {
  try {
    const response = await intreviewFeedbackService.createInterviewFeedback(req.params.interviewId,
      req.body,
      req.user.id
    );
    if(response.success){
        return successResponse(res, response.data, response.message, STATUS.CREATED);
    }else{
        return errorResponse(res, response.message, STATUS.BAD_REQUEST);
    }
  } catch (error) {
    next(error);
  }
};