
import AxiosInstance from "./AxiosInstance"

export const AuthService = {

  login: async (email, password) => {
   
    const response = await AxiosInstance.post('/authentication/authenticate', {
      email,
      password
    });
    const token = response.data.token;
    if(token) {
      localStorage.setItem('token',token);
      const payload = JSON.parse(atob(token.split('.')[1]))

      const userRole = payload.role;
      localStorage.setItem('userRole',userRole);

      const userId = payload.sub // username(email || register Number)
      localStorage.setItem('userId',userId);

    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.clear();
  },

  getCurrentUser: () => {
    return {
      userId : localStorage.getItem('userId'),
      userRole : localStorage.getItem('userRole')
    }
  }
  
}

