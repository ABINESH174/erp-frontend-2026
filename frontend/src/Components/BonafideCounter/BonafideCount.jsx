import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BonafideCount = ({
  emailKey = '',   // key in localStorage to get email
  getIdApi,                    // API to get ID from email
  getBonafideApi,              // API to get bonafides using ID
  statusFilter = '',           // optional status filter (pending, approved, rejected)
}) => {
  const [count, setCount] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const email = localStorage.getItem(emailKey);
      if (!email) {
        console.warn(`${emailKey} not found in localStorage`);
        return;
      }

      try {
        // Get facultyId or hodId using email
        const idRes = await axios.get(`${getIdApi}/${email}`);
        const userId = idRes.data?.data?.facultyId || idRes.data?.data?.hodId;
       

        if (!userId) {
          console.error('User ID not found');
          return;
        }

        // Get bonafide requests using ID
        const bonafideRes = await axios.get(`${getBonafideApi}/${userId}`);
        const bonafides = Array.isArray(bonafideRes.data?.data) ? bonafideRes.data.data : [];

        // Optional status filtering
        const filtered = statusFilter
          ? bonafides.filter(
              (b) => b.bonafideStatus?.toLowerCase() === statusFilter.toLowerCase()
            )
          : bonafides;

        setCount(filtered.length);
        console.log(`Count of bonafides with status '${statusFilter}':`, filtered.length);
      } catch (err) {
        console.error('Error fetching bonafide count:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [emailKey, getIdApi, getBonafideApi, statusFilter]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='countOfBonafide'>
      <p> {count}</p>
    </div>
  );
};

export default BonafideCount;
