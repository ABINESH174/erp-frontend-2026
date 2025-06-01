import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../Components/Header/Header';
import './Principaldashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHome, FaClipboardList, FaUser } from 'react-icons/fa';

const Principaldashboard = () => {
  const [bonafides, setBonafides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('all');

  useEffect(() => {
    fetchBonafides();
  }, []);

  const fetchBonafides = async () => {
    try {
      const response = await axios.get('/api/principal/officeBearersApprovedBonafides');
      setBonafides(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bonafides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bonafideId, registerNo, newStatus) => {
    // Optimistically update UI
    setBonafides(prev =>
      prev.map(b =>
        b.bonafideId === bonafideId ? { ...b, bonafideStatus: newStatus } : b
      )
    );

    toast.info(
      newStatus === 'PRINCIPAL_APPROVED' ? 'Approving bonafide...' : 'Rejecting bonafide...'
    );

    try {
      const url = `/api/bonafide/updateBonafideWithBonafideStatus?bonafideId=${bonafideId}&registerNo=${registerNo}&status=${newStatus}`;
      await axios.put(url);

      toast.success(
        newStatus === 'PRINCIPAL_APPROVED'
          ? 'Bonafide approved successfully ✅'
          : 'Bonafide rejected ❌'
      );
    } catch (error) {
      toast.error('Failed to update status. Please try again.');
      fetchBonafides(); // Revert optimistic update
    }
  };

  const approvedCount = bonafides.filter(b => b.bonafideStatus === 'PRINCIPAL_APPROVED').length;
  const rejectedCount = bonafides.filter(b => b.bonafideStatus === 'REJECTED').length;
  const pendingCount = bonafides.filter(
    b => b.bonafideStatus !== 'PRINCIPAL_APPROVED' && b.bonafideStatus !== 'REJECTED'
  ).length;

  const filteredBonafides = bonafides.filter(b => {
    if (section === 'approved') return b.bonafideStatus === 'PRINCIPAL_APPROVED';
    if (section === 'rejected') return b.bonafideStatus === 'REJECTED';
    if (section === 'previousBonafides') return b.bonafideStatus === 'PRINCIPAL_APPROVED';
    if (section === 'profile') return false;
    return true;
  });

  return (
    <div>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="principal-dashboard-container">
        <div className="sidebar">
          <h2><FaHome /> Principal Panel</h2>
          <ul>
            <li onClick={() => setSection('profile')}><FaUser /> Profile</li>
            <li onClick={() => setSection('previousBonafides')}><FaClipboardList /> Previous Bonafides</li>
            <li onClick={() => setSection('approved')}><FaClipboardList /> Approved ({approvedCount})</li>
            <li onClick={() => setSection('rejected')}><FaClipboardList /> Rejected ({rejectedCount})</li>
            <li onClick={() => setSection('all')}><FaClipboardList /> All Requests ({bonafides.length})</li>
          </ul>
        </div>

        <div className="content">
          <h1>
            {section === 'profile' && 'Profile'}
            {section === 'previousBonafides' && 'Previous Bonafides'}
            {section === 'approved' && 'Approved Bonafides'}
            {section === 'rejected' && 'Rejected Bonafides'}
            {section === 'all' && 'All Bonafide Requests'}
          </h1>

          {section === 'profile' ? (
            <div className="profile-section">
              <p>Welcome Principal. This section will display your profile details.</p>
            </div>
          ) : loading ? (
            <p>Loading...</p>
          ) : filteredBonafides.length === 0 ? (
            <p className="no-requests">No bonafide requests available.</p>
          ) : (
            <table className="request-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Register No</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  {section === 'all' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredBonafides.map((b, index) => (
                  <tr key={b.bonafideId}>
                    <td>{index + 1}</td>
                    <td>{b.registerNo}</td>
                    <td>{b.purpose}</td>
                    <td
                      className={
                        b.bonafideStatus === 'PRINCIPAL_APPROVED'
                          ? 'approved'
                          : b.bonafideStatus === 'REJECTED'
                          ? 'rejected'
                          : 'pending'
                      }
                    >
                      {b.bonafideStatus === 'PRINCIPAL_APPROVED'
                        ? 'Approved ✅'
                        : b.bonafideStatus === 'REJECTED'
                        ? 'Rejected ❌'
                        : 'Pending'}
                    </td>
                    {section === 'all' && (
                      <td>
                        {b.bonafideStatus === 'PRINCIPAL_APPROVED' ? (
                          <span className="status-fixed">✅ Approved</span>
                        ) : b.bonafideStatus === 'REJECTED' ? (
                          <span className="status-fixed">❌ Rejected</span>
                        ) : (
                          <>
                            <button
                              className="approve-btn"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to approve this bonafide?')) {
                                  handleUpdateStatus(b.bonafideId, b.registerNo, 'PRINCIPAL_APPROVED');
                                }
                              }}
                            >
                              Approve
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to reject this bonafide?')) {
                                  handleUpdateStatus(b.bonafideId, b.registerNo, 'REJECTED');
                                }
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Principaldashboard;
