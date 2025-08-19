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
import 'react-confirm-alert/src/react-confirm-alert.css';
import AxiosInstance from '../../Api/AxiosInstance';
import Logoutbtn from '../../Components/logoutbutton/Logoutbtn';

const OfficeBearer = () => {
  const [activeTab, setActiveTab] = useState('bonafides');
  const [data, setData] = useState([]);
  const [principalApprovedData, setPrincipalApprovedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBonafide, setSelectedBonafide] = useState(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionItem, setRejectionItem] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [downloadedBonafides, setDownloadedBonafides] = useState([]);
  const[active,setActive]=useState([]);

/*   // Map NOTIFIED enum to friendly message
  const statusMessages = {
    NOTIFIED: "Student notified to collect bonafide",
  }; */

  useEffect(() => {
    fetchHodApprovedBonafides();
    fetchNotifiedBonafides();
  }, []);

  const fetchHodApprovedBonafides = async () => {
  setLoading(true);
  try {
    const res = await AxiosInstance.get('/bonafide/getHodApproved');

    const bonafides = res.data?.data || [];

    if (bonafides.length === 0) {
      setData([]);
      setError('No bonafide requests found.');
    } else {
      setData(bonafides);
      setActiveTab("bonafides");
      setError(null);
    }

  } catch (err) {
    console.error('Error fetching HOD-approved bonafides:', err);

    if (err.response?.status === 404) {
      setError('No bonafide requests found.');
      setData([]);
    } else {
      setError('Failed to fetch bonafide requests.');
    }

  } finally {
    setLoading(false);
  }
};


  const fetchPrincipalApproved = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/bonafide/getPrincipalApproved');
      console.log('Principal Approved response:', res.data);
      setPrincipalApprovedData(res.data.data || []);
      setActiveTab('principalApproved');
    } catch { 
      toast.info("No approved bonafides.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifiedBonafides = async () => {
    setLoading(true);
    try{
      const res = await AxiosInstance.get('/bonafide/getNotifiedBonafides');
      console.log('Notified Bonafides response:', res.data);
      setPrincipalApprovedData(res.data.data || []);
      setActiveTab('notifiedBonafides');
    } catch {
      toast.info("No notified bonafides.");
    } finally {
      setLoading(false);
    }
  };

  const approveBonafide = async (bonafideId, registerNo) => {
    try {
      const res = await AxiosInstance.put('/bonafide/updateBonafideWithBonafideStatus', null, {
        params: { bonafideId, registerNo, status: 'PRINCIPAL_APPROVED' },
      });

      toast.success('Bonafide approved successfully!');
      fetchHodApprovedBonafides();
    } catch {
      toast.error('Failed to approve bonafide.');
    }
  };

  const rejectBonafide = async (bonafideId, registerNo, rejectionMessage) => {
    try {
      const res = await AxiosInstance.put('/bonafide/updateObRejectedBonafide', null, {
        params: { bonafideId, registerNo,status: 'OB_REJECTED',rejectionMessage },
      });
      toast.success(res.data.message || 'Bonafide rejected successfully!');
      fetchHodApprovedBonafides();
    } catch {
      toast.error('Failed to reject bonafide.');
    }
  };

  const handleNotifyStudent = async (bonafideId, registerNo) => {
    try {
      const statusMessage = "NOTIFIED";  // enum status string
      await AxiosInstance.put('/bonafide/updateBonafideWithBonafideStatus', null, {
        params: { bonafideId, registerNo, status: statusMessage },
      });
    try {
      await AxiosInstance.post('/email/notify-approver', {bonafideId, status: 'NOTIFIED', registerNo
      });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr);
    }
      toast.success("Student notified to collect bonafide.");
      fetchPrincipalApproved();
    } catch {
      toast.error("Failed to notify student.");
    }
  };

  const handleApproveClick = (item) => {
    confirmAlert({
      title: 'Confirm Approve',
      message: `Are you sure you want to approve bonafide for ${item.registerNo}?`,
      buttons: [
        { label: 'Yes', onClick: () => approveBonafide(item.bonafideId, item.registerNo) },
        { label: 'Cancel' }
      ],
    });
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
        { label: 'Yes', onClick: () => rejectBonafide(rejectionItem.bonafideId, rejectionItem.registerNo, rejectionMessage) },
        { label: 'Cancel', onClick: () => setRejectionModalOpen(true) },
      ],
    });
  };

  const handleViewClick = (item) => {
    setSelectedBonafide(item);
    setShowModal(true);
  };
const handleDownload = async (bonafideId, registerNo) => {
  console.log('Downloading bonafide ID:', bonafideId, 'Register No:', registerNo);

  try {
    const response = await AxiosInstance.get(
      `/bonafide/getCertificate/${bonafideId}`,
      {
        params: { registerNo }, 
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf',
        },
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bonafide_${bonafideId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    if (error.response) {
      console.error('Download error:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error('Download error:', error.message);
    }
    toast.error('Failed to download certificate.');
  }
  setDownloadedBonafides(prev => [...prev, bonafideId]);
};


  return (
    <div>
      <Header />
      <div className="ob-bonafide-student">
        <div className="ob-bonafide-sidebar-container">
          <h2>Office Bearer DashBoard</h2>
          <ul className="ob-bonafide-sidebar-list">
            <li  className={`ob-bonafide-sidebar-item ${active === "ob-bonafide" ? "active" : ""}`}
             onClick={(e) => { 
                setActive("ob-bonafide");
                setActiveTab('bonafides');
                }} >
               Pending Bonafides</li>
            <li  className={`ob-bonafide-sidebar-item ${active === "principalapproved" ? "active" : ""}`} 
            onClick={(e) => { 
                setActive("principalapproved")
                fetchPrincipalApproved();
                }}>
              Approved Bonafides</li>
            <li  className={`ob-bonafide-sidebar-item ${active === "notifiedbonafide" ? "active" : ""}`} 
            onClick={(e) => { 
                setActive("notifiedbonafide")
                fetchNotifiedBonafides();
                }}
            >
              Notified Bonafides</li>
          </ul>
          <div className="ob-logout">
            <Logoutbtn/>
          </div>
          
        </div>

        <div className="ob-topstud-container">
          <div className="name-bar">
            <h3 className="name-bar-title">OB Bonafide Notification Page</h3>
          </div>

          {activeTab === 'bonafides' && (
            <div className='ob-bonafide-fullbox '
           >
              {loading ? <p>Loading...</p> : error ? <p className="error-message">{error}</p> : (
                <div className="ob-bonafide-table-container">
                  <table className="ob-bonafide-table" >
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Register No.</th>
                        <th>Purpose</th>
                        <th>Semester</th>
                        <th>Department</th>
                        <th>Date of Apply</th>
                        <th>Action</th>
                        <th>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={item.bonafideId}>
                          <td>{index + 1}</td>
                          <td data-label="Register No">{item.registerNo}</td>
                          <td data-label="Purpose">{item.purpose}</td>
                          <td data-label="Semester">{item.semester}</td>
                          <td data-label="Department">{item.discipline}</td>
                          <td data-label="Date">{item.date}</td>
                          <td className="ob-action-buttons">
                            <button className="approve-btn" onClick={() => handleApproveClick(item)}>Approve</button>
                            <button className="reject-btn" onClick={() => handleRejectClick(item)}>Reject</button>
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
          )}

          {activeTab === 'principalApproved' && (
            <div className="ob-bonafide-table-container">
              <table className="ob-bonafide-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Register No</th>
                    <th>Name</th>
                    <th>Purpose</th>
                    <th>Semester</th>
                    <th>Department</th>
                    <th>Date of Apply</th>
                    <th>Download</th>
                    <th>Notify</th>
                  </tr>
                </thead>
                <tbody>
                  {principalApprovedData.map((item, index) => (
                    <tr key={item.bonafideId}>
                      <td>{index + 1}</td>
                      <td>{item.registerNo}</td>
                      <td>{item.name}</td>
                      <td>{item.purpose}</td>
                      <td>{item.semester}</td>
                      <td>{item.discipline}</td>
                      <td>{item.date}</td>
                      <td>
                        <button
                          onClick={() => handleDownload(item.bonafideId, item.registerNo)}
                          style={{
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Download
                        </button>
                      </td>
                      <td>
                      <button
                        onClick={() => handleNotifyStudent(item.bonafideId, item.registerNo)}
                        disabled={!downloadedBonafides.includes(item.bonafideId)}
                        style={{
                          backgroundColor: downloadedBonafides.includes(item.bonafideId) ? '#87cefa' : '#d3d3d3',
                          color: '#000',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: downloadedBonafides.includes(item.bonafideId) ? 'pointer' : 'not-allowed',
                        }}
                      >
                        Notify
                      </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'notifiedBonafides' && (
          <div className="principal-table-container">
            <table className="ob-bonafide-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Register No</th>
                  <th>Name</th>
                  <th>Purpose</th>
                  <th>Semester</th>
                  <th>Discipline</th>
                  <th>Date</th>
                  
                </tr>
              </thead>
              <tbody>
                {principalApprovedData.map((item, index) => (
                  <tr key={item.bonafideId}>
                    <td>{index + 1}</td>
                    <td>{item.registerNo}</td>
                    <td>{item.name}</td>
                    <td>{item.purpose}</td>
                    <td>{item.semester}</td>
                    <td>{item.discipline}</td>
                    <td>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        </div>
      </div>

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

      <BonafideViewModal showModal={showModal} setShowModal={setShowModal} selectedBonafide={selectedBonafide} />
      <ToastContainer />
    </div>
  );
};

export default OfficeBearer;
