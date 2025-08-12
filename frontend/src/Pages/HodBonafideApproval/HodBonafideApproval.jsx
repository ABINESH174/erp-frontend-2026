import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
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
import AxiosInstance from '../../Api/AxiosInstance';

const HodBonafideApproval = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hodId, setHodId] = useState(null);
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
  const handleFetchBonafides = async () => {
    try {
      const bonafideRes = await AxiosInstance.get(
        `/hod/getFacultyApprovedBonafidesByHodId/${hodId}`,
        { headers: { Accept: 'application/json' } }
      );

      const bonafides = bonafideRes.data?.data || [];

      if (bonafides.length > 0) {
        setData(bonafides);
        setError(null);
      } else {
        setData([]);
        setError('No bonafide requests found.');
      }

    } catch (error) {
      console.error('Error fetching bonafides:', error);

      if (error.response?.status === 404) {
        // Backend returned 404 with no data
        setData([]);
        setError('No bonafide requests found.');
      } else {
        // Other errors like 500 or network
        setError('Error fetching bonafides');
      }
    }
  };

  if (hodId) {
    handleFetchBonafides();
  }
}, [hodId]);


  useEffect(() => {
    const fetchHodIdAndBonafides = async () => {
      setLoading(true);
      try {
        const email = localStorage.getItem('hodEmail');

        if (!email) {
          setError('User email not found. Please login again.');
          return;
        }

        const hodRes = await AxiosInstance.get(
          `/hod/getHodByEmail/${email}`,
          { headers: { Accept: 'application/json' } }
        );

        const fetchedHodId = hodRes.data.data.hodId;
        setHodId(fetchedHodId);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchHodIdAndBonafides();
  }, []);
const handleApprove = (bonafideId, registerNo) => {
  confirmAlert({
    title: 'Confirm',
    message: 'Are you sure you want to approve this bonafide?',
    buttons: [
      {
        label: 'Yes',
        onClick: async () => {
          try {
            await Promise.all([
              handleStatusUpdate(bonafideId, registerNo, 'HOD_APPROVED'),
              AxiosInstance.post(`/email/notify-approver`, {
                bonafideId,
                registerNo,
                status: 'HOD_APPROVED',
              }),
            ]);
            toast.success('Bonafide approved successfully.');
          } catch (err) {
            console.error('Approval failed:', err.response?.data || err.message || err);
            toast.error('Something went wrong.');
          }
        },
      },
      { label: 'No' },
    ],
  });
};


 const handleStatusUpdate = async (bonafideId, registerNo, status) => {
  try {
    setProcessingId(bonafideId);

    const res = await AxiosInstance.put(
      '/bonafide/updateBonafideWithBonafideStatus',
      null,
      {
        params: { bonafideId, registerNo, status },
      }
    );

    toast.success(res.data.message || 'Status updated!');
    setData(prev => prev.filter(item => item.bonafideId !== bonafideId));
    
  } catch (err) {
    console.error('Failed to update status:', err);

    if (err.response?.status === 404) {
      toast.error('Bonafide request not found.');
    } else if (err.response?.status === 400) {
      toast.error(err.response?.data?.message || 'Invalid request.');
    } else {
      toast.error('Failed to update status.');
    }

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
    if (!rejectionMessage.trim()) {
      return toast.error('Please enter a rejection reason.');
    }
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
            status: 'HOD_REJECTED',
            rejectionMessage: message,
          },
        }
      );
      toast.success(res.data.message || 'Bonafide rejected successfully!');
      setData(prev => prev.filter(item => item.bonafideId !== bonafideId));
    } catch (err) {
      toast.error('Failed to reject bonafide.');
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
      <div className="hod-bonafide-student">
        <div className="hod-topstud-container">
      
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
                          onClick={() => handleApprove(item.bonafideId, item.registerNo)}
                          disabled={processingId === item.bonafideId}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleRejectClick(item)}
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
