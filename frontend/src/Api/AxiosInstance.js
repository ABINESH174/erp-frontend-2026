
import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: "http://192.168.137.1:8080/api",
});

AxiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] =`Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default AxiosInstance