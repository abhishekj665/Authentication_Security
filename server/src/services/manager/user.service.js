import ExpressError from "../../utils/Error.utils.js";
import { UserIP } from "../../models/index.model.js";
import { User } from "../../models/index.model.js";
import { getPagination } from "../../utils/paginations.utils.js";
import STATUS from "../../config/constants/Status.js";
import { generateHash } from "../../utils/generateHash.utils.js";

export const getUsersService = async (page, limits) => {
  try {
    const { limit, offset } = getPagination(page, limits);

    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      attributes: { exclude: ["password"] },
      include: [
        {
          model: User,
          as: "manager",
          attributes: ["id", "email", "first_name", "last_name"],
        },
        {
          model: UserIP,
          required: false,
          attributes: ["ipAddress", "isBlocked", "createdAt", "updatedAt"],
        },
      ],
    });

    return {
      success: true,
      data: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  } catch (error) {
    throw new ExpressError(400, error.message);
  }
};


export const registerUserService = async ({ data }) => {
  try {
    if (!data.email || !data.password) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    let hashedPassword = await generateHash(data.password);

    let userData = await User.create({
      ...data,
      password: hashedPassword,
    });

    return {
      success: true,
      data: userData,
      message: "User Registered Successfully",
    };
  } catch (error) {
    throw new ExpressError(STATUS.BAD_REQUEST, error.message);
  }
};
