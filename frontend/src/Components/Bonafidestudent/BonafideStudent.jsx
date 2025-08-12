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
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AuthService } from '../../Api/AuthService';
import AxiosInstance from '../../Api/AxiosInstance';

const BonafideStudent = () => {
  const navigate = useNavigate();
  const [facultyId, setFacultyId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBonafide, setSelectedBonafide] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Rejection modal states
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionItem, setRejectionItem] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState('');

useEffect(() => {
  const fetchFacultyIdAndBonafides = async () => {
    setLoading(true);
    setError(null);

    try {
      const email = AuthService.getCurrentUser().userId;
      if (!email) {
        setError('User email not found. Please login again.');
        return;
      }

      const facultyRes = await AxiosInstance.get(`/faculty/${email}`);
      const fetchedFacultyId = facultyRes.data?.data?.facultyId;
      if (!fetchedFacultyId) {
        setError('Faculty ID not found for this email.');
        return;
      }

      setFacultyId(fetchedFacultyId);

      const bonafideRes = await AxiosInstance.get(
        `/faculty/get-pending-bonafides/${fetchedFacultyId}`
      );

      const bonafides = bonafideRes.data?.data || [];

      const filtered = bonafides.filter(item =>
        item.bonafideStatus !== 'FACULTY_REJECTED' &&
        item.bonafideStatus !== 'REJECTED'
      );

      setData(filtered);

      if (filtered.length === 0) {
        setError('No bonafide requests found.');
      }

    } catch (err) {
      console.error('Error fetching data:', err);

      if (err.response?.status === 404) {
        setError('No bonafide requests found.'); // ❗ specifically for 404 from backend
      } else {
        setError('Failed to fetch data from servers.');
      }

    } finally {
      setLoading(false);
    }
  };

  fetchFacultyIdAndBonafides();
}, []);



  const handleApprove = (bonafideId, registerNo) => {
    confirmAlert({
      title: 'Confirm',
      message: `Are you sure you want to approve this bonafide?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
                try {
                await handleApproveRequest(bonafideId, registerNo);
                await AxiosInstance.post(`/email/notify-approver`, { bonafideId, registerNo, status: 'FACULTY_APPROVED' });
                } catch (err) {
                console.error(err);
                toast.error('Something went wrong.');
                }
        }
        },
        {
          label: 'Cancel',
        },
      ],
    });
  };

  const handleApproveRequest = async (bonafideId, registerNo) => {
    try {
      setProcessingId(bonafideId);
      const res = await AxiosInstance.put(
        '/bonafide/updateBonafideWithBonafideStatus',
        null,
        { params: { bonafideId, registerNo, status: 'FACULTY_APPROVED' } }
      );
      toast.success(res.data.message || 'Status updated!');
      setData(prev => prev.filter(item => item.bonafideId !== bonafideId));
      if (data.length === 1) setError('No bonafide requests found.');
    } catch (err) {
      toast.error('Failed to update status.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (item) => {
    setRejectionItem(item);
    setRejectionMessage('');
    setRejectionModalOpen(true);
  };

  const submitRejection = () => {
    if (!rejectionMessage.trim()) return toast.error('Please enter a rejection reason.');
    setRejectionModalOpen(false);

    confirmAlert({
      title: 'Confirm Rejection',
      message: `Reject bonafide for ${rejectionItem.registerNo}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => rejectBonafide(rejectionItem.bonafideId, rejectionItem.registerNo, rejectionMessage),
        },
        {
          label: 'Cancel',
          onClick: () => setRejectionModalOpen(true),
        },
      ],
    });
  };

 const rejectBonafide = async (bonafideId, registerNo, message) => {
  try {
    setProcessingId(bonafideId);

    const res = await AxiosInstance.put(
      '/bonafide/updateObRejectedBonafide',
      null,
      {
        params: {
          bonafideId,
          registerNo,
          status: 'FACULTY_REJECTED', //Added to match backend expectation
          rejectionMessage: message,
        },
      }
    );

    toast.success(res.data.message || 'Bonafide rejected successfully!');
    setData(prev => prev.filter(item => item.bonafideId !== bonafideId));

    if (data.length === 1) setError('No bonafide requests found.');
  } catch (err) {
    toast.error('Failed to reject bonafide.');
    console.error(err);
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
                          onClick={() => handleApprove(item.bonafideId, item.registerNo)}
                          disabled={processingId === item.bonafideId}
                        >
                          {processingId === item.bonafideId ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleRejectClick(item)}
                          disabled={processingId === item.bonafideId}
                        >
                          {processingId === item.bonafideId ? 'Processing...' : 'Reject'}
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
     

      {/* Rejection Modal */}
      {rejectionModalOpen && (
        <div className="rejection-popup">
          <div className="rejection-popup-content">
            <h3>Rejection Reason for {rejectionItem?.registerNo}</h3>
            <textarea
              placeholder="Enter rejection reason"
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              rows="6"
              cols="60"
            />
            <div className="rejection-popup-actions">
              <button className="submit-reject-btn" onClick={submitRejection}>
                Submit Rejection
              </button>
              <button
                className="cancel-reject-btn"
                onClick={() => {
                  setRejectionModalOpen(false);
                  setRejectionMessage('');
                  setRejectionItem(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <BonafideViewModal showModal={showModal} setShowModal={setShowModal} selectedBonafide={selectedBonafide} />
      <ToastContainer />
    </div>
  );
};

export default BonafideStudent;
