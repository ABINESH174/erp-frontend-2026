import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Principaldashboard.css';
import Header from '../../Components/Header/Header.jsx';
import Profileicon from '../../Assets/profile.svg';
import Logoutbtn from '../../Components/logoutbutton/Logoutbtn.jsx';
import { BsPeople, BsPerson } from "react-icons/bs";
import Logout from '../../Assets/logout.svg';
import Allbuttons from '../../Components/Allbuttons/Allbuttons.jsx';
import AxiosInstance from '../../Api/AxiosInstance.js';
import { UtilityService } from '../../Utility/UtilityService.js';
import { ToastContainer } from 'react-toastify';

function Principaldashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [open, setOpen] = useState(false);
  const [PrincipalData, setPrincipalData] = useState(null);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetchBonafides();
  }, []);

  const fetchBonafides = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get('/principal/officeBearersApprovedBonafides');
      const data = response.data?.data || [];
      setBonafides(data);
      if (data.length === 0) {
        setError('No bonafide requests found.');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching bonafides:', err);
      setError('No Bonafide Requests');
    } finally { 
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bonafideId, registerNo, newStatus) => {
    try {
      await AxiosInstance.put('/bonafide/updateBonafideWithBonafideStatus', null, {
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
}

export default PrincipalDashboard;
