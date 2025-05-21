import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; 
import { use } from 'react';
// import Header from '../Header/Header';

const HodBonafideApproval = () => {
  const navigate = useNavigate();
    const location = useLocation();
  const [hodId, setHodId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleFetchBonafides = async () => {
    try {
        console.log('HOD ID:', hodId);
        const bonafideRes = await axios.get(
        `http://localhost:8080/api/hod/getFacultyApprovedBonafidesByHodId/${hodId}`,
          {
            headers: { Accept: 'application/json' },
          }
        );

        if (bonafideRes.data?.data?.length > 0) {
          setData(bonafideRes.data.data);
        } else {
          setData([]);
          setError('No bonafide requests found.');
        }
        
    } catch (error) {
        
    }
}
    handleFetchBonafides();
  },[hodId]);
    

  useEffect(() => {
    const fetchHodIdAndBonafides = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ Corrected key to match localStorage
        const email = localStorage.getItem('hodEmail');


        if (!email) {
          setError('User email not found. Please login again.');
          setLoading(false);
          return;
        }

        // Step 1: Get hodId by email
        const hodRes = await axios.get(`http://localhost:8080/api/hod/getHodByEmail/${email}`, {
          headers: { Accept: 'application/json' },
        });
        console.log(hodRes.data.data);

        const fetchedHodId = hodRes.data.data.hodId;
        setHodId(fetchedHodId);

        if (!fetchedHodId) {
          setError('Faculty ID not found for this email.');
          setLoading(false);
          return;
        }

        // Step 2: Get pending bonafides
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data from server.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHodIdAndBonafides();
  }, []);

  const handleBonafideStatus = async (bonafideId, registerNo, status) => {
    try {
      const res = await axios.put(
        'http://localhost:8080/api/bonafide/updateBonafideWithBonafideStatus',
        null,
        {
          params: { bonafideId, registerNo, status },
        }
      );

      alert(res.data.message || 'Status updated!');

      // Refresh bonafide list
      if (!hodId) {
        setError('Faculty ID not found. Please login again.');
        return;
      }

      const refresh = await axios.get(
        `http://localhost:8080/api/hod/getFacultyApprovedBonafidesByHodId/${hodId}`
      );

      if (refresh.data?.data?.length > 0) {
        setData(refresh.data.data);
        setError(null);
      } else {
        setData([]);
        setError('No bonafide requests found.');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status.');
    }
  };

  return (
    <div>
      {/* <Header /> */}
      <div className="hod-bonafide-student">
        <div className="hod-topstud-container">
          <div className="name-bar">
            <h3 className="name-bar-title">Bonafide Notification Page</h3>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="bonafide-table-container">
              <table className="bonafide-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Register Number</th>
                    <th>Purpose</th>
                    <th>Date of Apply</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.bonafideId}>
                      <td>{index + 1}</td>
                      <td>{item.registerNo}</td>
                      <td>{item.purpose}</td>
                      <td>{item.date}</td>
                      <td>{item.bonafideStatus}</td>
                      <td className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleBonafideStatus(
                              item.bonafideId,
                              item.registerNo,
                              'HOD_APPROVED'
                            )
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() =>
                            handleBonafideStatus(
                              item.bonafideId,
                              item.registerNo,
                              'REJECTED'
                            )
                          }
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HodBonafideApproval
;
