import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BonafideCount = ({
  emailKey = '',
  getIdApi,
  getBonafideApi,
  statusFilter = '',
  render = null,   // <- NEW
}) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError(null);

        const email = localStorage.getItem(emailKey);
        if (!email) throw new Error(`Email not found for key: ${emailKey}`);

        const idRes = await axios.get(`${getIdApi}/${email}`);
        const userData = idRes.data?.data || {};
        const userId = userData.facultyId || userData.hodId;
        if (!userId) throw new Error('User ID not found');

        const bonafideRes = await axios.get(`${getBonafideApi}/${userId}`);
        const bonafides = Array.isArray(bonafideRes.data?.data) ? bonafideRes.data.data : [];

        const filtered = statusFilter
          ? bonafides.filter(b => b.bonafideStatus?.toLowerCase() === statusFilter.toLowerCase())
          : bonafides;

        setCount(filtered.length);
      } catch (err) {
        console.error('Error fetching bonafide count:', err);
        setError(err.message || 'Something went wrong');
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [emailKey, getIdApi, getBonafideApi, statusFilter]);

  if (loading || error) return null;

  // 👇 if render prop exists, use it
  if (render) return render(count);

  return <div className='countOfBonafide'><p>{count}</p></div>;
};

export default BonafideCount;
