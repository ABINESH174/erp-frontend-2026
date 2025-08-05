import { useEffect, useState } from 'react'
import { AuthService } from '../Api/AuthService';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
            const data = AuthService.getCurrentUser();
            setUser(data);
            setLoading(false);
    },[]);
    
    return { user, loading }; 
};
