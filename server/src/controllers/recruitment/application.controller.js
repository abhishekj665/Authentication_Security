import * as ApplicationService from "../../services/recuirment/application.service.js";
import { successResponse, errorResponse } from "../../utils/response.utils.js";
import cloudinary from "../../config/cloudinary.js";
import fs from "fs";

export const registerApplication = async (req, res, next) => {
  try {
    let resumeUrl = null;

    console.log(req.file);

    if (req.file) {
      try {
        const upload = await cloudinary.uploader.upload(req.file.path, {
          folder: "expense-bills",
        });
        resumeUrl = upload.secure_url;
      } finally {
        fs.unlinkSync(req.file.path);
      }
    }

    console.log(resumeUrl);
    req.body.resumeUrl = resumeUrl;

    console.log(req.body.resumeUrl);

    const response = await ApplicationService.registerApplication(
      req.params.slug,
      req.body,
    );

    if (response.success) {
      return successResponse(res, response.data, response.message);
    } else {
      return errorResponse(res, response.message);
    }
  } catch (error) {
    next(error);
  }
};
