import ExpressError from "../../utils/Error.utils.js";
import { sequelize } from "../../config/db.js";
import {
  HiringStage,
  JobPosting,
  JobRequisition,
} from "../../models/Associations.model.js";
import STATUS from "../../constants/Status.js";
import { Op } from "sequelize";

export const updateJobPosting = async (id, data, userId) => {
  const transaction = await sequelize.transaction();
  try {
    const jobPosting = await JobPosting.findByPk(id);

    if (!jobPosting)
      throw new ExpressError(STATUS.NOT_FOUND, "No job posting found");

    await jobPosting.update({ ...data, editedBy: userId }, { transaction });

    await transaction.commit();

    return {
      success: true,
      data: jobPosting,
      message: "Job posting updated successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const getJobPosting = async (id) => {
  try {
    const jobPosting = await JobPosting.findByPk(id);

    if (!jobPosting)
      throw new ExpressError(STATUS.NOT_FOUND, "No job posting found");

    return {
      success: true,
      data: jobPosting,
      message: "Job posting fetched successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const getJobPostings = async () => {
  try {
    const jobPostings = await JobPosting.findAll({
      order: [["createdAt", "DESC"]],
    });
    if (!jobPostings)
      throw new ExpressError(STATUS.NOT_FOUND, "No job postings found");

    return {
      success: true,
      data: jobPostings,
      message: "Job postings fetched successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const activeJobPosting = async (id, userId) => {
  try {
    const jobPosting = await JobPosting.findByPk(id);

    if (!jobPosting)
      throw new ExpressError(STATUS.NOT_FOUND, "No job posting found");

    if (jobPosting.isActive) {
      throw new ExpressError(
        STATUS.BAD_REQUEST,
        "Job posting is already active",
      );
    }

    await jobPosting.update({ isActive: true, editedBy: userId });

    return {
      success: true,
      data: jobPosting,
      message: "Job posting activated successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const getJobs = async () => {
  try {
    const jobs = await JobPosting.findAll({
      where: {
        isActive: true,
        visibility: "EXTERNAL",
        [Op.or]: [
          { expiresAt: { [Op.gt]: new Date() } },
          { expiresAt: { [Op.is]: null } },
        ],
      },
      attributes: [
        "id",
        "title",
        "slug",
        "description",
        "publishedAt",
        "expiresAt",
      ],
      order: [["publishedAt", "DESC"]],

      include: [
        {
          model: JobRequisition,
          as: "requisition",
          attributes: [
            "employmentType",
            "location",
            "experienceMin",
            "experienceMax",
            "budgetMin",
            "budgetMax",
            "priority",
            "title",
            "headCount",
            "departmentId",
          ],
        },
      ],
    });

    if (!jobs) throw new ExpressError(STATUS.NOT_FOUND, "No jobs found");

    return {
      success: true,
      data: jobs,
      message: "Jobs fetched successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const getJob = async (slug) => {
  try {
    const job = await JobPosting.findOne({
      where: {
        slug: slug,
        isActive: true,
        visibility: "EXTERNAL",
        [Op.or]: [
          { expiresAt: { [Op.gt]: new Date() } },
          { expiresAt: { [Op.is]: null } },
        ],
      },
      attributes: [
        "id",
        "title",
        "slug",
        "description",
        "publishedAt",
        "externalUrl",
        "expiresAt",
      ],
      include: [
        {
          model: JobRequisition,
          as: "requisition",
          attributes: [
            "id",
            "employmentType",
            "location",
            "experienceMin",
            "experienceMax",
            "budgetMin",
            "budgetMax",
            "priority",
            "title",
            "headCount",
            "departmentId",
          ],
        },
        {
          model: HiringStage,
          as: "stages",
          attributes: [
            "stageOrder",
            "name",
            "isFinal",
            "isRejectStage",
            "isOfferStage",
            "isDefault",
          ],
        },
      ],
      order: [[{ model: HiringStage, as: "stages" }, "stageOrder", "ASC"]],
    });

    if (!job) throw new ExpressError(STATUS.NOT_FOUND, "No job found");

    return {
      success: true,
      data: job,
      message: "Job fetched successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};
