import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../Components/Header/Header';
import './Principaldashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHome, FaUser } from 'react-icons/fa';
import Allbuttons from '../../Components/Allbuttons/Allbuttons';
import BonafideViewModal from '../../Components/BonafideViewModal/BonafideViewModal';
import Logoutbtn from '../../Components/logoutbutton/Logoutbtn.jsx';
import View from '../../Assets/eyewhite.svg';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

const Principaldashboard = () => {
  const [bonafides, setBonafides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBonafide, setSelectedBonafide] = useState(null);

  useEffect(() => {
    fetchBonafides();
  }, []);

  const fetchBonafides = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/principal/officeBearersApprovedBonafides');
      const data = response.data?.data || [];
      setBonafides(data);
      if (data.length === 0) {
        setError('No bonafide requests found.');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching bonafides:', err);
      setError('Failed to fetch bonafide requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bonafideId, registerNo, newStatus) => {
    try {
      await axios.put('/api/bonafide/updateBonafideWithBonafideStatus', null, {
        params: {
          bonafideId,
          registerNo,
          status: newStatus
        }
      });

      toast.success(
        newStatus === 'PRINCIPAL_APPROVED'
          ? 'Bonafide approved successfully.'
          : 'Bonafide rejected successfully.'
      );

      fetchBonafides();
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update bonafide status.');
    }
  };

  const confirmApprove = (item) => {
    confirmAlert({
      title: 'Confirm Approval',
      message: `Are you sure you want to approve bonafide for ${item.registerNo}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleUpdateStatus(item.bonafideId, item.registerNo, 'PRINCIPAL_APPROVED'),
        },
        {
          label: 'Cancel'
        }
      ]
    });
  };

  const confirmReject = (item) => {
    confirmAlert({
      title: 'Confirm Rejection',
      message: `Are you sure you want to reject bonafide for ${item.registerNo}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleUpdateStatus(item.bonafideId, item.registerNo, 'REJECTED'),
        },
        {
          label: 'Cancel'
        }
      ]
    });
  };

  const handleViewClick = (item) => {
    setSelectedBonafide(item);
    setShowModal(true);
  };

  return (
    <div>
      <Header />
      <ToastContainer />

      <div className="principal-dashboard-container">
        <div className="sidebar">
          <h2> Principal Panel</h2>
          <ul>
            <li><FaUser /> Profile</li>
            <li>Bonafides</li>
            <li>Approved</li>
            <li>Rejected</li>
          </ul>
          <div className="fa-logout">
            <Logoutbtn />
          </div>
        </div>

        <div className="content">
          <h1>Bonafide Requests</h1>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <table className="request-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Register No</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Date of Apply</th>
                  <th>Action</th>
                  <th>View Details</th>
                </tr>
              </thead>
              <tbody>
                {bonafides.map((item, index) => (
                  <tr key={item.bonafideId}>
                    <td>{index + 1}</td>
                    <td>{item.registerNo}</td>
                    <td>{item.name}</td>
                    <td>{item.discipline}</td>
                    <td>{item.semester}</td>
                    <td>{item.date}</td>
                    <td>
                      <button className="approve-btn" onClick={() => confirmApprove(item)}>
                        Approve
                      </button>
                      <button className="reject-btn" onClick={() => confirmReject(item)}>
                        Reject
                      </button>
                    </td>
                    <td>
                      <Allbuttons value="View" image={View} target={() => handleViewClick(item)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <BonafideViewModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedBonafide={selectedBonafide}
      />
    </div>
  );
};

export default Principaldashboard;
