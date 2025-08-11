import AxiosInstance from "./AxiosInstance"

export const getFacultyByEmail =async (userId) => {
    try {
        return await AxiosInstance.get(`/faculty/${userId}`, {
            withCredentials:true,
        }).data.data;
    } catch(err) {
        return null;
    }
}

