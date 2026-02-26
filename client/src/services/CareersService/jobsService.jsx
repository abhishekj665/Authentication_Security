import { API } from "../AuthService/authService";

export const getAllJobs = async () => {
  try {
    const response = await API.get("/recuirment/jobs");
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.message || response?.message,
    };
  }
};

export const getJobDetail = async (slug) => {
  try {
    const response = await API.get(`/recuirment/job/${slug}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.message || response?.message,
    };
  }
};
