import { API } from "../AuthService/authService";

export const getCandidate = async (email) => {
  try {
    const response = await API.get("/recuirment/candidate/get-by-email", {
      params: { email },
    });
    console.log("Candidate response:", response.data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to fetch candidate details",
      status: error?.response?.status || 500,
    };
  }
};
