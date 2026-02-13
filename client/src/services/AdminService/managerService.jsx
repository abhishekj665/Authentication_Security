import { API } from "../AuthService/authService";

export const getManagers = async () => {
  try {
    const { data } = await API.get("/admin/manager");
    return data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
export const assignManager = async (payload) => {
  try {
    const { data } = await API.patch("/admin/manager/assign", payload);
    return data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const getManagersWithUsers = async () => {
  try {
    let response = await API.get("/admin/manager/users");

    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const registerNewManager = async (data) => {
  try {
    let response = await API.post("/admin/manager/register", {
      data: data,
    });

    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
