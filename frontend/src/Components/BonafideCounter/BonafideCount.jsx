import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BonafideCount.css'

const BonafideCount = () => {
  const [counts, setCounts] = useState({ pending: 0 });
  const [loading, setLoading] = useState(true);

  const facultyEmail = localStorage.getItem('facultyEmail'); 

  useEffect(() => {
    const fetchCounts = async () => {
      if (!facultyEmail) {
        console.warn('facultyEmail not found in localStorage');
        return;
      }

      try {
        const facultyRes = await axios.get(`http://localhost:8080/api/faculty/${facultyEmail}`);
        const facultyData = facultyRes.data?.data;

        if (!facultyData || !facultyData.facultyId) {
          console.error('facultyId not found');
          return;
        }

        const facultyId = facultyData.facultyId;

        const bonafideRes = await axios.get(
          `http://localhost:8080/api/faculty/get-pending-bonafides/${facultyId}`
        );

        const bonafides = Array.isArray(bonafideRes.data?.data) ? bonafideRes.data.data : [];

        const pending = bonafides.filter(
          (b) => b.bonafideStatus?.toLowerCase() === 'pending'
        ).length;

        setCounts({ pending });
        localStorage.setItem('bonafideCounts', JSON.stringify({ pending }));
      } catch (err) {
        console.error('Error fetching bonafide count:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [facultyEmail]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="count-of-bonafide">
      <p>{counts.pending}</p>
    </div>
  );
};

export default BonafideCount;
