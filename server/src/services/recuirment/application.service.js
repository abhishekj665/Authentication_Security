import {
  Application,
  Candidate,
  HiringStage,
  JobPosting,
  JobRequisition,
} from "../../models/Associations.model.js";
import ExpressError from "../../utils/Error.utils.js";
import STATUS from "../../constants/Status.js";
import { sequelize } from "../../config/db.js";
import { Op } from "sequelize";
import { jobApplicationReceivedEmailTemplate } from "../../utils/mailTemplate.utils.js";
import { sendMail } from "../../config/otpService.js";

export const registerApplication = async (slug, data) => {
  const transaction = await sequelize.transaction();
  try {
    let candidate = await Candidate.findOne({
      where: { email: data.email },
      transaction,
    });

    if (!candidate) {
      candidate = await Candidate.create(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          contact: Number(data.contact),
          currentCompany: data.currentCompany,
          totalExperience: data.totalExperience,
          expectedCTC: data.expectedCTC,
          linkedInUrl: data.linkedInUrl,
          resumeUrl: data.resumeUrl,
        },
        { transaction },
      );
    }

    data.contact = Number(data.contact);
    data.totalExperience = Number(data.totalExperience);
    data.expectedCTC = Number(data.expectedCTC);

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        candidate.set(key, data[key]);
      }
    });

    if (candidate.changed()) {
      await candidate.save();
    }

    const jobPosting = await JobPosting.findOne({
      where: { slug: slug },
      transaction,
    });

    if (
      !jobPosting ||
      jobPosting.expiresAt < new Date() ||
      jobPosting.isActive === false
    ) {
      throw new ExpressError(STATUS.NOT_FOUND, "No job posting found");
    }

    const id = jobPosting.id;

    const application = await Application.findOne({
      where: {
        candidateId: candidate.id,
        jobPostingId: id,
      },
      transaction,
    });

    if (application) {
      return {
        success: false,
        message: "You have already applied for this job",
        status: STATUS.NOT_ACCEPTABLE,
      };
    }

    const firstStage = await HiringStage.findOne({
      where: {
        jobPostingId: id,
        isDefault: true,
      },
      transaction,
    });

    if (!firstStage) {
      throw new Error("Hiring stage not configured.");
    }

    const newApplication = await Application.create(
      {
        candidateId: candidate.id,
        jobPostingId: id,
        currentStageId: firstStage.id,
        status: "ACTIVE",
      },
      { transaction },
    );

    await transaction.commit();

    const html = jobApplicationReceivedEmailTemplate({
      firstName: candidate.firstName,
      companyName: "Orvane Digitals",
      jobTitle: jobPosting.title,
    });

    sendMail(candidate.email, "Application Received - Orvane Digitals", html);

    return {
      success: true,
      data: newApplication.jobPostingId,
      message: "Application created successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const getApplications = async (query) => {
  try {
    const { jobId, stageId, status, search } = query;

    const pageNumber = Math.max(parseInt(query.page) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);

    const offset = (pageNumber - 1) * pageSize;
    const whereClause = {};

    if (jobId) whereClause.jobPostingId = jobId;
    const stageFilter = stageId ? { name: stageId } : null;
    if (status) whereClause.status = status;

    const candidateFilter = search
      ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : null;

    const jobFilter = search
      ? {
          slug: { [Op.like]: `%${search}%` },
        }
      : null;

    const applications = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Candidate,
          as: "candidate",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "contact",
            "resumeUrl",
          ],
          ...(candidateFilter && { where: candidateFilter }),
        },
        {
          model: HiringStage,
          as: "currentStage",
          attributes: ["id", "name", "stageOrder"],
          ...(stageFilter && { where: stageFilter }),
        },
        {
          model: JobPosting,
          as: "jobPosting",
          attributes: ["id", "title", "slug"],
          ...(jobFilter && { where: jobFilter }),
        },
      ],
      offset,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    return {
      success: true,
      data: {
        rows: applications.rows,
        total: applications.count,
        page: pageNumber,
        totalPages: Math.ceil(applications.count / pageSize),
      },
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const getApplicationById = async (id) => {
  try {
    const application = await Application.findOne({
      where: { id: id },
      include: [
        {
          model: Candidate,
          as: "candidate",
        },
        {
          model: JobPosting,
          as: "jobPosting",
          include: [
            {
              model: HiringStage,
              as: "stages",
            },
            {
              model: JobRequisition,
              as: "requisition",
              attributes: [
                "id",
                "experienceMin",
                "experienceMax",
                "budgetMin",
                "budgetMax",
                "employmentType",
                "location",
                "headCount",
              ],
            },
          ],
        },
      ],
    });

    if (!application) {
      throw new ExpressError(STATUS.NOT_FOUND, "Application not found");
    }

    return {
      success: true,
      data: application,
      message: "Application fetched successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};
