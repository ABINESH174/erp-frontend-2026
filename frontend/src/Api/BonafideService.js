import AxiosInstance from './AxiosInstance';

export const getAllBonafidesByRegisterNo = async(userId)=>{
    try{
        const response = await AxiosInstance.get(`/bonafide/getAllBonafidesByRegisterNo/${userId}`,{
            withCredentials: true,
        });
        return response.data.data;
    }catch(error){
        console.error("Error fetching all bonafides:", error);
        return null;
    }
};




