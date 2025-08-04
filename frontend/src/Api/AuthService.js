import AxiosInstance from "./AxiosInstance"

export const getCurrentUser = async () => {
  try {
    const res = await AxiosInstance.get("/authentication/current-user", {
        withCredentials: true, // send cookies
    });
    return res.data.data; // {userId, role}
  } catch (err) {
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const res = await AxiosInstance.post("/authentication/logout",{},{
      withCredentials:true,
    });
    return res.data;
  } catch (error) {
    return null;
  }
}

