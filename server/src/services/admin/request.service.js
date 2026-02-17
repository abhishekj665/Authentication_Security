import {
  AssetRequest,
  User,
  Asset,
  UserAsset,
} from "../../models/Associations.model.js";
import ExpressError from "../../utils/Error.utils.js";

import { sequelize } from "../../config/db.js";
import {
  assetApprovedMailTemplate,
  assetRejectedMailTemplate,
} from "../../utils/mailTemplate.utils.js";
import { sendMail } from "../../config/otpService.js";

export const getRequestDataService = async () => {
  try {
    const requests = await AssetRequest.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["email", "role"],
        },
        {
          model: Asset,
          attributes: ["id", "title", "price", "status", "availableQuantity"],
        },
        {
          model: User,
          as: "reviewer",
          attributes: ["email", "role"],
        },
      ],
    });

    return {
      success: true,
      message: "Requests fetched successfully",
      data: requests,
    };
  } catch (error) {
    throw new ExpressError(400, error.message);
  }
};

export const rejectRequestService = async (id, remark, adminId) => {
  const request = await AssetRequest.findByPk(id, {
    include: [
      { model: User },
      {
        model: Asset,
        as: "Asset",
        attributes: [
          "id",
          "title",
          "price",
          "status",
          "availableQuantity",
          "category",
        ],
      },
    ],
  });

  

  if (!request || request.status !== "pending") {
    throw new ExpressError(400, "Invalid request");
  }

  request.status = "rejected";
  request.adminRemark = remark;
  request.reviewedBy = adminId;
  await request.save();

  const adminData = await User.findByPk(adminId, {
    attributes: ["email"],
  });

  const html = assetRejectedMailTemplate({
    userName: request.User.first_name || request.User.email.split("@")[0],
    userEmail: request.User.email,
    assetName: request.Asset.title,
    quantity: request.quantity,
    assetType: request.Asset.category,
    requestDate: request.createdAt.toLocaleString("en-IN"),
    reason: remark,
    managerName: adminData.email.split("@")[0],
  });

  sendMail(request.User.email, "Asset Request Rejected", html);

  return {
    success: true,
    userId: request.userId,
    message: "Request rejected successfully",
  };
};

export const approveRequestService = async (id, adminId) => {
  const t = await sequelize.transaction();
  let committed = false;

  try {
    const request = await AssetRequest.findByPk(id, {
      include: [
        { model: User, as: "User" },
        {
          model: Asset,
          as: "Asset",
          attributes: [
            "id",
            "title",
            "price",
            "status",
            "availableQuantity",
            "category",
          ],
        },
      ],
      transaction: t,
    });

    if (!request || request.status !== "pending") {
      throw new ExpressError(400, "Invalid request");
    }

    const asset = await Asset.findByPk(request.assetId, { transaction: t });

    if (!asset || asset.availableQuantity < request.quantity) {
      throw new ExpressError(400, "Not enough quantity available");
    }

    if (asset.status !== "available") {
      throw new ExpressError(400, "Asset not available yet");
    }

    const totalCredited = await UserAsset.sum("quantity", {
      where: { userId: request.userId },
      transaction: t,
    });

    if ((totalCredited || 0) + request.quantity > 5) {
      throw new ExpressError(400, "User credit limit exceeded");
    }

    asset.availableQuantity -= request.quantity;
    await asset.save({ transaction: t });

    await UserAsset.create(
      {
        userId: request.userId,
        assetId: request.assetId,
        quantity: request.quantity,
      },
      { transaction: t },
    );

    request.status = "approved";
    request.adminRemark = `Approved by admin`;
    request.reviewedBy = adminId;
    await request.save({ transaction: t });

    await t.commit();
    committed = true;

    const adminData = await User.findByPk(adminId, {
      attributes: ["email"],
    });

    const html = assetApprovedMailTemplate({
      userName: request.User.first_name || request.User.email.split("@")[0],
      userEmail: request.User.email,
      assetName: request.Asset.title,
      quantity: request.quantity,
      assetType: request.Asset.category,
      requestDate: request.createdAt.toLocaleString("en-IN"),
      remark: "Approved by admin",
      managerName: adminData.email.split("@")[0],
    });

    sendMail(request.User.email, "Asset Request Approved", html);

    return {
      success: true,
      userId: request.userId,
      message: "Request approved and asset credited",
    };
  } catch (error) {
    if (!committed) {
      await t.rollback();
    }
    throw error;
  }
};
