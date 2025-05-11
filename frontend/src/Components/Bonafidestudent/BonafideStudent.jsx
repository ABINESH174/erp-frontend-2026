import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import './BonafideStudent.css';

const BonafideStudent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const facultyId = localStorage.getItem('facultyId') || '1'; // Default to '1' if no facultyId in localStorage

  useEffect(() => {
    const fetchBonafideData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/faculty/get-pending-bonafides/${facultyId}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (response.data && response.data.data) {
          setData(response.data.data); // Use the data from the response
        } else {
          setError('No data available.');
        }
      } catch (err) {
        console.error('Error fetching bonafide data:', err);
        setError('Failed to fetch bonafide data.');
      } finally {
        setLoading(false);
      }
    };

    if (facultyId) {
      fetchBonafideData();
    } else {
      setError('Faculty ID not found in localStorage.');
      setLoading(false);
    }
  }, [facultyId]);

  return (
    <div>
      <Header />
      <div className="bonafide-student">
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
              <table className="bonafide-table">
                <thead>
                  <tr>
                    <th>Register Number</th>
                    <th>Purpose</th>
                    <th>Date of Apply</th>
                    <th>Bonafide Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>{item.registerNo}</td>
                        <td>{item.purpose}</td>
                        <td>{item.date}</td>
                        <td>{item.bonafideStatus}</td>
                        <td>
                          <button
            // onClick={() => handleApprove(item.bonafideId)}
            className="approve-btn"
          >
            Approve
          </button>
          <button
            // onClick={() => handleReject(item.bonafideId)}
            className="reject-btn"
          >
            Reject
          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No bonafide requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BonafideStudent;
