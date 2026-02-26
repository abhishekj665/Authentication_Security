import STATUS from "../../constants/Status.js";
import ExpressError from "../../utils/Error.utils.js";
import {
  JobRequisition,
  JobPosting,
  HiringStage,
} from "../../models/Associations.model.js";
import { sequelize } from "../../config/db.js";
import { stages } from "../../utils/hiringStages.utils.js";

export const registerJobRequisition = async (data, userId) => {
  try {
    if (
      !data.title ||
      !data.employmentType ||
      data.budgetMin > data.budgetMax ||
      data.experienceMin > data.experienceMax ||
      data.headCount < 1
    )
      throw new ExpressError(
        STATUS.BAD_REQUEST,
        "You have to send valid job requisition data",
      );
    const jobRequisition = await JobRequisition.create({
      ...data,
      createdBy: userId,
    });

    return {
      success: true,
      data: jobRequisition,
      message: "Job requisition created successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const getJobRequisitions = async () => {
  try {
    const jobRequisitions = await JobRequisition.findAll();

    if (!jobRequisitions)
      throw new ExpressError(STATUS.NOT_FOUND, "No job requisitions found");

    return {
      success: true,
      data: jobRequisitions,
      message: "Job requisitions fetched successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const getJobRequisition = async (id) => {
  try {
    const jobRequisition = await JobRequisition.findByPk(id);

    if (!jobRequisition)
      throw new ExpressError(STATUS.NOT_FOUND, "No job requisition found");

    return {
      success: true,
      data: jobRequisition,
      message: "Job requisition fetched successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const updateJobRequisition = async (id, data) => {
  try {
    const jobRequisition = await JobRequisition.findByPk(id);

    if (!jobRequisition)
      throw new ExpressError(STATUS.NOT_FOUND, "No job requisition found");

    await jobRequisition.update(data);

    return {
      success: true,
      data: jobRequisition,
      message: "Job requisition updated successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const approveJobRequisition = async (id, remark, userId) => {
  const transaction = await sequelize.transaction();
  try {
    const jobRequisition = await JobRequisition.findByPk(id);

    if (!jobRequisition || jobRequisition.status != "PENDING")
      throw new ExpressError(STATUS.NOT_FOUND, "No job requisition found");

    await JobRequisition.update(
      {
        status: "APPROVED",
        approvedBy: userId,
        approvedAt: new Date(),
        remark: remark,
      },
      { where: { id }, transaction },
    );

    const jobPosting = await JobPosting.create(
      {
        tenantId: jobRequisition.tenantId,
        requisitionId: jobRequisition.id,
        title: jobRequisition.title,
        description: jobRequisition.jobDescription,
        visibility: "INTERNAL",
        isActive: false,
        createdBy: userId,
      },
      { transaction },
    );

    const stage = stages.map((stage) => ({
      tenantId: jobPosting.tenantId,
      jobPostingId: jobPosting.id,
      name: stage.name,
      stageOrder: stage.stageOrder,
      isFinal: stage.isFinal,
      isRejectStage: stage.isRejectStage,
      isOfferStage: stage.isOfferStage,
      colorCode: stage.colorCode,
      autoMoveRule: stage.autoMoveRule,
      isDefault: stage.isDefault,
    }));


    await HiringStage.bulkCreate(stage, { transaction });

    await transaction.commit();

    return {
      success: true,
      data: jobRequisition,
      message: "Job requisition approved and Job posting created successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};

export const rejectJobRequisition = async (id, remark, userId) => {
  try {
    const jobRequisition = await JobRequisition.findByPk(id);

    if (!jobRequisition || jobRequisition.status != "PENDING")
      throw new ExpressError(STATUS.NOT_FOUND, "No job requisition found");

    await JobRequisition.update(
      {
        status: "REJECTED",
        approvedBy: userId,
        approvedAt: new Date(),
        remark: remark,
      },
      { where: { id } },
    );

    return {
      success: true,
      data: jobRequisition,
      message: "Job requisition rejected successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};
