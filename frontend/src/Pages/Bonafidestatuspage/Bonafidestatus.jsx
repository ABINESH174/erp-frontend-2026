import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Header/Header';
import './Bonafidestatus.css';
import { FaDownload } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import AxiosInstance from '../../Api/AxiosInstance';

const BonafideStatus = () => {
  const location = useLocation();
  const [registerNo] = useState(location.state?.studentId || '');
  const [bonafideDetails, setBonafideDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBonafide, setSelectedBonafide] = useState(null);
  const [filesToUpload, setFilesToUpload] = useState({});

 const purposeFileMap = {
  "bonafide for sc/st/sca post matric scholarship":['studentIdCardFile'],
  'bonafide for internship': ['studentIdCardFile'],
  'bonafide for bus pass': ['studentIdCardFile'],
  'bonafide for passport': ['studentIdCardFile'],
  'bonafide for educational support': ['studentIdCardFile'],
  'pragati': ['studentIdCardFile'],
  'saksham': ['studentIdCardFile'],
  'swanath scholarship': ['studentIdCardFile'],
  'bonafide for labour welfare': ['studentIdCardFile', 'aadharCardFile', 'smartCardFile'],
  'bonafide for tailor welfare': ['studentIdCardFile', 'aadharCardFile', 'smartCardFile'],
  'bonafide for farmer welfare': ['studentIdCardFile', 'aadharCardFile', 'smartCardFile'],
};

  const fetchBonafideDetails = async () => {
    try {
      const res = await AxiosInstance.get(`/bonafide/getAllBonafidesByRegisterNo?registerNo=${registerNo}`);
      const updatedData = (res.data.data || []).map(item => ({ ...item, reuploadDone: item.reuploadDone || false }));
      setBonafideDetails(updatedData);
    } catch (err) {
      if (err.response?.status !== 404) setError('Failed to fetch bonafide details');
      else setBonafideDetails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonafideDetails();
  }, [registerNo]);

  
  const handleFileChange = (e, fileKey) => {
    const file = e.target.files[0];
    if (file) {
      setFilesToUpload(prev => ({ ...prev, [fileKey]: file }));
    }
  };

  const handleReuploadClick = (item) => {
    setSelectedBonafide(item);
    console.log("item:",item);
    setShowModal(true);
    setFilesToUpload({});
  };

  const handleSubmitReupload = async () => {
    if (!selectedBonafide || Object.keys(filesToUpload).length === 0) return;

const requiredFiles = purposeFileMap[selectedBonafide.purpose?.toLowerCase()] || [];
    const missingFiles = requiredFiles.filter(fileKey => !filesToUpload[fileKey]);

    if (missingFiles.length > 0) {
      toast.error(`Please upload: ${missingFiles.join(', ')}`);
      return;
    }

    try {
      const formData = new FormData();
      const statusMap = {
      'FACULTY_REJECTED': 'PENDING',
  'HOD_REJECTED': 'FACULTY_APPROVED',
  'OB_REJECTED': 'HOD_APPROVED'
};

  const statusToSend = statusMap[selectedBonafide.bonafideStatus] || selectedBonafide.bonafideStatus;
  
      formData.append("registerNo", selectedBonafide.registerNo);
      formData.append("purpose", selectedBonafide.purpose);
      formData.append("date", selectedBonafide.date);
      console.log("Status being sent:", statusToSend);
      formData.append("bonafideStatus", statusToSend);

      Object.entries(filesToUpload).forEach(([key, file]) => {
        formData.append(key, file);
      });

      const res = await AxiosInstance.post("/bonafide/create", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.status === 201) {
        const deleteUrl = `/bonafide/deleteBonafide?registerNo=${selectedBonafide.registerNo}&bonafideId=${selectedBonafide.bonafideId}`;
        await AxiosInstance.delete(deleteUrl);

        await fetchBonafideDetails();

        setShowModal(false);
      } else {
        toast.error("Reupload failed.");
      }
    } catch (err) {
      toast.error("Error during reupload.");
    }
  };

  return (
    <div className="bonafide-status">
      <Header />
      <h1>Bonafide Status</h1>
      <ToastContainer />
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : bonafideDetails.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>SNo</th>
              <th>Register No</th>
              <th>Purpose</th>
              <th>Applied Date</th>
              <th>Status</th>
              <th>Download / Action</th>
            </tr>
          </thead>
          <tbody>
            {bonafideDetails.map((item, index) => (
              <tr key={item.bonafideId}>
                <td>{index + 1}</td>
                <td>{item.registerNo}</td>
                <td>{item.purpose}</td>
                <td>{item.date}</td>
                <td>{item.bonafideStatus}</td>
                <td>
                  {item.bonafideStatus === 'NOTIFIED' && (
                    <>
                      <p style={{ color: 'green', fontWeight: 'bold', marginBottom: '8px' }}>
                        Bonafide ready student is asked to come and collect the bonafide certification from the office
                      </p>
                    </>
                  )}

                  {(item.bonafideStatus === 'OB_REJECTED' || item.bonafideStatus === 'FACULTY_REJECTED' || item.bonafideStatus === 'HOD_REJECTED') && (
                    <div>
                      <p style={{ color: 'red' }}>Reason: {item.rejectionMessage}</p>
                      <button onClick={() => handleReuploadClick(item)}>Reupload</button>
                    </div>
                  )}

                  {
                   item.bonafideStatus !== 'NOTIFIED' &&
                   item.bonafideStatus !== 'OB_REJECTED' && item.bonafideStatus !== 'FACULTY_REJECTED' && item.bonafideStatus !== 'HOD_REJECTED' && (
                    <button disabled>Pending Approval</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No Bonafide Applied</div>
      )}

      {showModal && selectedBonafide && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <h3>Reupload Required Files</h3>
       {console.log("sel bon:",{selectedBonafide})};
      {(purposeFileMap[selectedBonafide.purpose?.toLowerCase()] || []).length > 0 ? (
        purposeFileMap[selectedBonafide.purpose?.toLowerCase()].map(fileKey => (
          <div className="file-upload" key={fileKey}>
            <label>{fileKey.replace(/([A-Z])/g, '$1')}</label>
            <input type="file" onChange={e => handleFileChange(e, fileKey)} />
          </div>
        ))
      ) : (
        <p style={{ color: 'red' }}>
          No upload fields found for purpose: {selectedBonafide.purpose}
        </p>
      )}

      <button onClick={handleSubmitReupload}>Submit</button>
      <button onClick={() => setShowModal(false)}>Cancel</button>
    </div>
  </div>
)}

    </div>
  );
};

export default BonafideStatus;
