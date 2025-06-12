import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './OfficeBearer.css';
import { Allbuttons, Header } from '../../Components';
import View from '../../Assets/eyewhite.svg';
import { ToastContainer, toast } from 'react-toastify';
import BackButton from '../../Components/backbutton/BackButton';
import BonafideViewModal from '../../Components/BonafideViewModal/BonafideViewModal';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';  // Don't forget to import this

const OfficeBearer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hodId, setHodId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBonafide, setSelectedBonafide] = useState(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionItem, setRejectionItem] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState("");

  useEffect(() => {
    const handleFetchBonafides = async () => {
      try {
        const bonafideRes = await axios.get(
          `http://localhost:8080/api/bonafide/getHodApproved`,
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
        setError('Failed to fetch bonafide requests.');
      } finally {
        setLoading(false);
      }
    };
    handleFetchBonafides();
  }, []);

  useEffect(() => {
    const fetchHodIdAndBonafides = async () => {
      setLoading(true);
      setError(null);
      try {
        const email = localStorage.getItem('officeBearerEmail');
        if (!email) {
          setError('User email not found. Please login again.');
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

  const refreshData = async () => {
    try {
      const refresh = await axios.get(`http://localhost:8080/api/bonafide/getHodApproved`);
      if (refresh.data?.data?.length > 0) {
        setData(refresh.data.data);
        setError(null);
      } else {
        setData([]);
        setError('No bonafide requests found.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const approveBonafide = async (bonafideId, registerNo) => {
    try {
      const res = await axios.put(
        'http://localhost:8080/api/bonafide/updateBonafideWithBonafideStatus',
        null,
        {
          params: { bonafideId, registerNo, status: 'OB_APPROVED' },
        }
      );

      toast.success(res.data.message || 'Bonafide approved successfully!');
      refreshData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to approve bonafide.');
    }
  };

  const rejectBonafide = async (bonafideId, registerNo, rejectionMessage) => {
    try {
      const res = await axios.put(
        'http://localhost:8080/api/bonafide/updateObRejectedBonafide',
        null,
        {
          params: { bonafideId, registerNo, rejectionMessage },
        }
      );

      toast.success(res.data.message || 'Bonafide rejected successfully!');
      refreshData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to reject bonafide.');
    }
  };

  const handleApproveClick = (item) => {
    confirmAlert({
      title: 'Confirm Approve',
      message: `Are you sure you want to approve bonafide for ${item.registerNo}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => approveBonafide(item.bonafideId, item.registerNo),
        },
        {
          label: 'Cancel',
        },
      ],
    });
  };

  const handleRejectClick = (item) => {
    setRejectionItem(item);
    setRejectionMessage('');
    setRejectionModalOpen(true);
  };

  const submitRejection = () => {
    if (!rejectionMessage.trim()) {
      toast.error('Please enter a rejection reason.');
      return;
    }

    // Close rejection modal before opening confirmation
    setRejectionModalOpen(false);

    confirmAlert({
      title: 'Confirm Rejection',
      message: `Are you sure you want to reject bonafide for ${rejectionItem.registerNo}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            rejectBonafide(rejectionItem.bonafideId, rejectionItem.registerNo, rejectionMessage);
            setRejectionItem(null);
            setRejectionMessage('');
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
            // Re-open rejection modal if user cancels
            setRejectionModalOpen(true);
          },
        },
      ],
    });
  };

  const handleViewClick = (item) => {
    setSelectedBonafide(item);
    setShowModal(true);
  };

  return (
    <div>
      <Header />
      <div className="ob-bonafide-student">
        <div className="ob-bonafide-sidebar-container">
          <ul className="ob-bonafide-sidebar-list" style={{ listStyleType: 'none' }}>
            <li className="ob-bonafide-sidebar-item">Bonafides</li>
            <li className="ob-bonafide-sidebar-item">Previous</li>
            <li className="ob-bonafide-sidebar-item">Approved</li>
            <li className="ob-bonafide-sidebar-item">Rejected</li>
          </ul>
        </div>
        <div className="ob-topstud-container">
          <div className="name-bar">
            <h3 className="name-bar-title">OB Bonafide Notification Page</h3>
          </div>

          <div className="bonafide-backbtn">
            <BackButton />
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="ob-bonafide-table-container">
              <table className="ob-bonafide-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Register Number</th>
                    <th>Purpose</th>
                    <th>Semester</th>
                    <th>Department</th>
                    <th>Date of Apply</th>
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
                      <td>{item.discipline}</td>
                      <td>{item.date}</td>
                      <td className="ob-action-buttons">
                        <button className="approve-btn" onClick={() => handleApproveClick(item)}>
                          Approve
                        </button>
                        <button className="reject-btn" onClick={() => handleRejectClick(item)}>
                          Reject
                        </button>
                      </td>
                      <td className="ob-view-btn">
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

      <BonafideViewModal showModal={showModal} setShowModal={setShowModal} selectedBonafide={selectedBonafide} />

      {/* Rejection Reason Modal */}
      {rejectionModalOpen && (
        <div className="rejection-popup">
          <div className="rejection-popup-content">
            <h3>Rejection Reason for {rejectionItem?.name}</h3>
            <textarea
              placeholder="Enter rejection reason"
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              rows="10"
              cols="80"
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

      <ToastContainer />
    </div>
  );
};

export default OfficeBearer;
