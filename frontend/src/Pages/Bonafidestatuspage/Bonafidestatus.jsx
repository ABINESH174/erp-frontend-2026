import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Header/Header';
import './Bonafidestatus.css';

const BonafideStatus = () => {
  const location = useLocation();
  // eslint-disable-next-line 
  const [registerNo, setRegisterNo] = useState(location.state?.studentId || '');
  const [bonafideDetails, setBonafideDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBonafideDetails = async () => {
      try {
        const response = await axios.get(`/api/bonafide/getAllBonafidesByRegisterNo?registerNo=${registerNo}`);
        setBonafideDetails(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch bonafide details');
      } finally {
        setLoading(false);
      }
    };

    if (registerNo) {
      fetchBonafideDetails();
    }
  }, [registerNo]);

  const handleDownload = (filePath, status) => {
    if (status === 'PRINCIPAL_APPROVED') {
      // Construct the URL for downloading the file
      const url = `/api/bonafide/downloadFile?filePath=${encodeURIComponent(filePath)}`;
      window.open(url, '_blank');
    } else {
      alert('Your bonafide certificate is still pending approval.');
    }
  };

  return (
    <div className="bonafide-status">
      <Header />
      <h1>Bonafide Status</h1>
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : bonafideDetails.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Bonafide ID</th>
              <th>Register No</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {bonafideDetails.map((item) => (
              <tr key={item.bonafideId}>
                <td>{item.bonafideId}</td>
                <td>{item.registerNo}</td>
                <td>{item.purpose}</td>
                <td>{item.bonafideStatus}</td>
                <td>
                  {item.bonafideStatus === 'PRINCIPAL_APPROVED' ? (
                    <button onClick={() => handleDownload(item.filePath, item.status)}>Download</button>
                  ) : (
                    <button disabled>Pending Approval</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No Bonafide Records </div>
      )}
    </div>
  );
};

export default BonafideStatus;
