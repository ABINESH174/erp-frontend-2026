import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './BonafideStudent.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '../backbutton/BackButton';


const BonafideStudent = () => {
  const navigate = useNavigate();

  const [facultyId, setFacultyId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacultyIdAndBonafides = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ Corrected key to match localStorage
        const email = localStorage.getItem('facultyEmail');

        if (!email) {
          setError('User email not found. Please login again.');
          setLoading(false);
          return;
        }

        //  Get facultyId by email
        const facultyRes = await axios.get(`http://localhost:8080/api/faculty/${email}`, {
          headers: { Accept: 'application/json' },
        });

        const fetchedFacultyId = facultyRes.data.data.facultyId;
        setFacultyId(fetchedFacultyId);

        if (!fetchedFacultyId) {
          setError('Faculty ID not found for this email.');
          setLoading(false);
          return;
        }

        // Get pending bonafides
        const bonafideRes = await axios.get(
          `http://localhost:8080/api/faculty/get-pending-bonafides/${fetchedFacultyId}`,
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
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data from server.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyIdAndBonafides();
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

      toast.success(res.data.message || 'Status updated!');

      // Refresh bonafide list
      if (!facultyId) {
        setError('Faculty ID not found. Please login again.');
        return;
      }

      const refresh = await axios.get(
        `http://localhost:8080/api/faculty/get-pending-bonafides/${facultyId}`
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
      <Header />
      <div className="bonafide-student">
        <div className="bonafide-sidebar">
          <div className="bonafide-sidebar-container">
            <ul className="bonafide-sidebar-list" style={{ listStyleType: 'none' }}>
              <li className="bonafide-sidebar-item">
                Bonafides
              </li>
              <li className="bonafide-sidebar-item" >
                Previous
              </li>
              <li className="bonafide-sidebar-item">
                Approved
              </li>
              <li className="bonafide-sidebar-item">
               Rejected
              </li>
            </ul>
          </div>
        </div>
        <div className="topstud-container">
          <div className="name-bar">
            <h3 className="name-bar-title">Bonafide Notification Page</h3>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="bonafide-table-container">
              <BackButton/>
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
                              'FACULTY_APPROVED'
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
            <ToastContainer />
    </div>
  );
};

export default BonafideStudent;
