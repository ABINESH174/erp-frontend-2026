import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './BonafideStudent.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '../backbutton/BackButton';
import { Allbuttons } from '..';
import View from '../../Assets/eyewhite.svg';
import BonafideViewModal from '../BonafideViewModal/BonafideViewModal';

const BonafideStudent = () => {
  const navigate = useNavigate();
  const [facultyId, setFacultyId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBonafide, setSelectedBonafide] = useState(null);

  useEffect(() => {
    const fetchFacultyIdAndBonafides = async () => {
      try {
        setLoading(true);
        setError(null);

        const email = localStorage.getItem('facultyEmail');
        if (!email) {
          setError('User email not found. Please login again.');
          return;
        }

        const facultyRes = await axios.get(`http://localhost:8080/api/faculty/${email}`);
        const fetchedFacultyId = facultyRes.data.data.facultyId;
        setFacultyId(fetchedFacultyId);

        if (!fetchedFacultyId) {
          setError('Faculty ID not found for this email.');
          return;
        }

        const bonafideRes = await axios.get(
          `http://localhost:8080/api/faculty/get-pending-bonafides/${fetchedFacultyId}`
        );

        setData(bonafideRes.data?.data || []);
        if (bonafideRes.data?.data?.length === 0) {
          setError('No bonafide requests found.');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data from server.');
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
        { params: { bonafideId, registerNo, status } }
      );

      toast.success(res.data.message || 'Status updated!');

      const refresh = await axios.get(
        `http://localhost:8080/api/faculty/get-pending-bonafides/${facultyId}`
      );

      setData(refresh.data?.data || []);
      if (!refresh.data?.data?.length) {
        setError('No bonafide requests found.');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update status.');
    }
  };

  const handleViewClick = (item) => {
    setSelectedBonafide(item);
    setShowModal(true);
  };

  return (
    <div>
      <Header />
      <div className="bonafide-student">
        <div className="bonafide-sidebar-container">
          <ul className="bonafide-sidebar-list" style={{ listStyleType: 'none' }}>
            <li className="bonafide-sidebar-item">
              Bonafides 
            </li>
            <li className="bonafide-sidebar-item">Previous</li>
            <li className="bonafide-sidebar-item">Approved</li>
            <li className="bonafide-sidebar-item">Rejected</li>
          </ul>
        </div>

        <div className="topstud-container">
          <div className="name-bar">
            <h3 className="name-bar-title">Bonafide Notification Page</h3>
          </div>
           <div className="bonafide-backbtn">
                <BackButton />
              </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            
            <div className="bonafide-table-container">
             
              <table className="fa-bonafide-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Register Number</th>
                    <th>Purpose</th>
                    <th>Date of Apply</th>
                    <th>Mobile Number</th>
                    <th>Action</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.bonafideId}>
                      <td>{index + 1}</td>
                      <td>{item.registerNo}</td>
                      <td>{item.purpose}</td>
                      <td>{item.date}</td>
                      <td>{item.mobileNumber}</td>
                      <td className="fa-action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleBonafideStatus(item.bonafideId, item.registerNo, 'FACULTY_APPROVED')
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() =>
                            handleBonafideStatus(item.bonafideId, item.registerNo, 'REJECTED')
                          }
                        >
                          Reject
                        </button>
                      </td>
                      <td className="fa-view-btn">
                        <Allbuttons value="View" image={View} target={() => handleViewClick(item)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <BonafideViewModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedBonafide={selectedBonafide}
      />
      <ToastContainer />
    </div>
  );
};

export default BonafideStudent;
