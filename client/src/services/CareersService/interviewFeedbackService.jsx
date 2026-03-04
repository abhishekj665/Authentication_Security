import { API } from "../AuthService/authService";

export const submitInterviewFeedback = async (interviewId, feedbackData) => {
  try {
    const response = await API.post(
      `/recruitment/interview-feedback/${interviewId}`,
      feedbackData,
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      status: error.response?.status || 500,
    };
  }
};
