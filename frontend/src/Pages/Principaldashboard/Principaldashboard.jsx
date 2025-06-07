import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../Components/Header/Header';
import './Principaldashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHome, FaClipboardList } from 'react-icons/fa';

const Principaldashboard = () => {
  const [bonafides, setBonafides] = useState([]);
  const [loading, setLoading] = useState(true);

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
      // Revert the optimistic UI update on error
      fetchBonafides();
    }
  };

  const approvedCount = bonafides.filter(b => b.bonafideStatus === 'PRINCIPAL_APPROVED').length;
  const pendingCount = bonafides.filter(
    b => b.bonafideStatus !== 'PRINCIPAL_APPROVED' && b.bonafideStatus !== 'REJECTED'
  ).length;

  return (
    <div>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="principal-dashboard-container">
        <div className="sidebar">
          <h2><FaHome /> Principal Panel</h2>
          <ul>
            <li><FaClipboardList /> Total Requests: {bonafides.length}</li>
            <li><FaClipboardList /> Approved: {approvedCount}</li>
            <li><FaClipboardList /> Pending: {pendingCount}</li>
          </ul>
        </div>

        <div className="content">
          <h1>Bonafide Requests</h1>
          {loading ? (
            <p>Loading...</p>
          ) : bonafides.length === 0 ? (
            <p className="no-requests">No bonafide requests available.</p>
          ) : (
            <table className="request-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Register No</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bonafides.map(b => (
                  <tr key={b.bonafideId}>
                    <td>{b.bonafideId}</td>
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
                    <td>
                      {b.bonafideStatus === 'PRINCIPAL_APPROVED' ? (
                        <span className="status-fixed">✅ Approved</span>
                      ) : b.bonafideStatus === 'REJECTED' ? (
                        <span className="status-fixed">❌ Rejected</span>
                      ) : (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleUpdateStatus(b.bonafideId, b.registerNo, 'PRINCIPAL_APPROVED')
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleUpdateStatus(b.bonafideId, b.registerNo, 'REJECTED')
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
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
