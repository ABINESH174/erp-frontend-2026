import AxiosInstance from "./AxiosInstance"

export const getStudentByRegisterNo = async (userId) => {
    try {
        const res = await AxiosInstance.get(`/student/${userId}`,{
            withCredentials:true,
        });
        return res.data.data;
    } catch (error) {
        return null;
    }
    
}