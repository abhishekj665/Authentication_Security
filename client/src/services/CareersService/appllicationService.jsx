import { API } from "../AuthService/authService";

export const registerJobApplication = async (slug, data) => {
  try {
    const response = await API.post(
      `/recuirment/application/apply/${slug}`,
      data,
    );

    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};
