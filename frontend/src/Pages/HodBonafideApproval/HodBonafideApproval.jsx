import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Header from '../../Components/Header/Header';
import './HodBonafideApproval.css';
import BackButton from '../../Components/backbutton/BackButton';
import { Allbuttons } from '../../Components';
import View from '../../Assets/eyewhite.svg';
import BonafideViewModal from '../../Components/BonafideViewModal/BonafideViewModal';

const HodBonafideApproval = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hodId, setHodId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBonafide, setSelectedBonafide] = useState(null);
  const [processingId, setProcessingId] = useState(null);  // NEW: to track currently processing row

  useEffect(() => {
    const handleFetchBonafides = async () => {
      try {
        const bonafideRes = await axios.get(
          `http://localhost:8080/api/hod/getFacultyApprovedBonafidesByHodId/${hodId}`,
          { headers: { Accept: 'application/json' } }
        );

        if (bonafideRes.data?.data?.length > 0) {
          setData(bonafideRes.data.data);
          setError(null);
        } else {
          setData([]);
          setError('No bonafide requests found.');
        }
      } catch (error) {
        console.error('Error fetching bonafides:', error);
        setError('Error fetching bonafides');
      }
    };

    if (hodId) {
      handleFetchBonafides();
    }
  }, [hodId]);

  useEffect(() => {
    const fetchHodIdAndBonafides = async () => {
      setLoading(true);
      setError(null);

      try {
        const email = localStorage.getItem('hodEmail');

        if (!email) {
          setError('User email not found. Please login again.');
          setLoading(false);
          return;
        }

        const hodRes = await axios.get(
          `http://localhost:8080/api/hod/getHodByEmail/${email}`,
          { headers: { Accept: 'application/json' } }
        );

        const fetchedHodId = hodRes.data.data.hodId;
        setHodId(fetchedHodId);

        if (!fetchedHodId) {
          setError('Faculty ID not found for this email.');
          setLoading(false);
          return;
        }
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

  const handleConfirmStatusChange = (bonafideId, registerNo, status) => {
    confirmAlert({
      title: 'Confirm',
      message: `Are you sure you want to ${status === 'HOD_APPROVED' ? 'approve' : 'reject'} this bonafide?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleBonafideStatus(bonafideId, registerNo, status)
        },
        {
          label: 'Cancel',
          onClick: () => { /* do nothing */ }
        }
      ]
    });
  };

  const handleBonafideStatus = async (bonafideId, registerNo, status) => {
    setProcessingId(bonafideId);  // disable buttons for this record

    try {
      const res = await axios.put(
        'http://localhost:8080/api/bonafide/updateBonafideWithBonafideStatus',
        null,
        {
          params: { bonafideId, registerNo, status },
        }
      );

      toast.success(res.data.message || 'Status updated!');

      // Remove updated bonafide from list immediately for better UX
      setData(prevData => prevData.filter(item => item.bonafideId !== bonafideId));

    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update status.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewClick = (item) => {
    setSelectedBonafide(item);
    setShowModal(true);
  };

  return (
    <div>
      <Header />
      <div className="hod-bonafide-student">
        <div className="hod-bonafide-navbar">
          <ul className="hod-navlist" style={{ listStyleType: 'none' }}>
            <li className="hodbonafide-navitem">Bonafides</li>
            <li className="hodbonafide-navitem">Previous</li>
            <li className="hodbonafide-navitem">Approved</li>
            <li className="hodbonafide-navitem">Rejected</li>
          </ul>
        </div>
        <div className="hod-topstud-container">
          <div className="bonafide-header-bar">
            <h3 className="name-bar-title">HOD Bonafide Approval Page</h3>
          </div>
          <div className="bonafide-backbtn">
            <BackButton />
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="hod-bonafide-table-container">
              <table className="hod-bonafide-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Register Number</th>
                    <th>Purpose</th>
                    <th>Semester</th>
                    <th>Date of Apply</th>
                    <th>Mobile Number</th>
                    <th>Action</th>
                    <th>View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.bonafideId}>
                      <td>{index + 1}</td>
                      <td>{item.registerNo}</td>
                      <td>{item.purpose}</td>
                      <td>{item.semester}</td>
                      <td>{item.date}</td>
                      <td>{item.mobileNumber}</td>
                      <td className="hod-action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleConfirmStatusChange(item.bonafideId, item.registerNo, 'HOD_APPROVED')
                          }
                          disabled={processingId === item.bonafideId}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() =>
                            handleConfirmStatusChange(item.bonafideId, item.registerNo, 'REJECTED')
                          }
                          disabled={processingId === item.bonafideId}
                        >
                          Reject
                        </button>
                      </td>
                      <td className="hod-view-btn">
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

export default HodBonafideApproval;
