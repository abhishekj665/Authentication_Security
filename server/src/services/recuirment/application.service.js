
import { Application, Candidate, HiringStage } from "../../models/Associations.model";
import ExpressError from "../../utils/Error.utils";
import STATUS from "../../constants/Status";

export const registerApplication = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    let candidate = await Candidate.findOne(data.email);

    if (!candidate) {
      candidate = await Candidate.create(data, { transaction });
    }

    const application = await Application.findOne({
      where: {
        candidateId: candidate.id,
        jobPostingId: data.jobPostingId,
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
        jobPostingId,
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
        jobPostingId: data.jobPostingId,
        currentStageId: data.currentStageId,
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
    throw new ExpressError(STATUS.BAD_REQUEST, error.message)
  }
};
