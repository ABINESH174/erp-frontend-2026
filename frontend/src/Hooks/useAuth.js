import React, { useEffect, useState } from 'react'
import { getCurrentUser } from '../Api/AuthService';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchUser = async () => {
            const data = await getCurrentUser();
            setUser(data);
            setLoading(false);
        };
        fetchUser();
    },[]);
    
    return { user, loading }; 
};
