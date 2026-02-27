import {
  Application,
  Candidate,
  HiringStage,
} from "../../models/Associations.model.js";
import ExpressError from "../../utils/Error.utils.js";
import STATUS from "../../constants/Status.js";
import { JobPosting } from "../../models/Associations.model.js";
import { sequelize } from "../../config/db.js";

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

    const jobPosting = await JobPosting.findOne({
      where: { slug: slug },
      transaction,
    });

    if (!jobPosting) {
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
      throw new ExpressError(
        STATUS.BAD_REQUEST,
        "You have already applied for this job",
      );
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

    return {
      success: true,
      data: newApplication.jobPostingId,
      message: "Application created successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};
