import { API } from "../AuthService/authService";

export const getAllAttendanceData = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const res = await API.get(`/admin/attendance/all/?${params}`);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const approveAttendance = async (id) => {
  try {
    let response = await API.patch(`/admin/attendance/approve/${id}`);

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

export const rejectAttendance = async (id) => {
  try {
    console.log(id);
    let response = await API.patch(`/admin/attendance/reject/${id}`);

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
