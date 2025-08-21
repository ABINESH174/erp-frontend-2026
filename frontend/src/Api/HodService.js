import AxiosInstance from "./AxiosInstance";

export const getHodByEmail = async (userId) => {
  try {
    const response = await AxiosInstance.get(`/hod/getHodByEmail/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching HOD by email:", error);
    throw error;
  }
};
