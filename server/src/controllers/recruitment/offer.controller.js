import * as OfferService from "../../services/recruitment/offer.service.js";
import { successResponse, errorResponse } from "../../utils/response.utils.js";

export const createOffer = async (req, res, next) => {
  try {
    const response = await OfferService.createOffer(
      req.params.id,
      req.body,
      req.user.id,
    );
    if (response.success) {
      return successResponse(res, response.data, response.message);
    } else {
      return errorResponse(res, response.message, response.status);
    }
  } catch (error) {
    next(error);
  }
};

export const validateOfferToken = async (req, res, next) => {
  try {
    const response = await OfferService.validateOfferToken(req.params.token); 
    if (response.success) {
      return successResponse(res, response.data, response.message);
    } else {
      return errorResponse(res, response.message, response.status);
    }
  } catch (error) {
    next(error);
  }
};

