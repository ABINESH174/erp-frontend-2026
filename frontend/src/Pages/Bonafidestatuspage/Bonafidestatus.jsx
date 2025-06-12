import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Header/Header';
import './Bonafidestatus.css';
import { FaDownload } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

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
    'Bonafide for Internship': ['studentIdCardFile'],
    'Bonafide for Bus Pass': ['studentIdCardFile'],
    'Bonafide for Passport': ['studentIdCardFile'],
    'Educational Support': ['studentIdCardFile'],
    'Pragati':['studentIdCardFile'],
    'Saksham':['studentIdCardFile'],
    'Swanath Scholarship':['studentIdCardFile'],
    'Labour Welfare': ['studentIdCardFile', 'aadharCardFile', 'smartCardFile', 'WelfareProofDocumentFile'],
    'Tailor Welfare': ['studentIdCardFile', 'aadharCardFile', 'smartCardFile', 'WelfareProofDocumentFile'],
    'Farmer Welfare': ['studentIdCardFile', 'aadharCardFile', 'smartCardFile', 'WelfareProofDocumentFile'],
  };

  const fetchBonafideDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/bonafide/getAllBonafidesByRegisterNo?registerNo=${registerNo}`);
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

  const handleDownload = (filePath, status) => {
    if (status === 'PRINCIPAL_APPROVED') {
      const url = `http://localhost:8080/api/bonafide/downloadFile?filePath=${encodeURIComponent(filePath)}`;
      const link = document.createElement('a');
      link.href = url;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Your bonafide certificate is still pending approval.');
    }
  };

  const handleFileChange = (e, fileKey) => {
    const file = e.target.files[0];
    if (file) {
      setFilesToUpload(prev => ({ ...prev, [fileKey]: file }));
    }
  };

  const handleReuploadClick = (item) => {
    setSelectedBonafide(item);
    setShowModal(true);
    setFilesToUpload({});
  };

  const handleSubmitReupload = async () => {
    if (!selectedBonafide || Object.keys(filesToUpload).length === 0) {
      toast.error("Please select files to reupload.");
      return;
    }

    const requiredFiles = purposeFileMap[selectedBonafide.purpose] || [];

    // Check if required files are provided
    const missingFiles = requiredFiles.filter(fileKey => !filesToUpload[fileKey]);
    if (missingFiles.length > 0) {
      toast.error(`Please upload: ${missingFiles.join(', ')}`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("bonafideId", selectedBonafide.bonafideId);
      formData.append("registerNo", selectedBonafide.registerNo);
      formData.append("purpose", selectedBonafide.purpose);
      formData.append("bonafideStatus", "HOD_APPROVED");

      Object.entries(filesToUpload).forEach(([key, file]) => {
        formData.append(key, file);
      });

      const res = await axios.post("http://localhost:8080/api/bonafide/create", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.status === 201) {
        toast.success("Files uploaded successfully!");

        setBonafideDetails(prev =>
          prev.map(item =>
            item.bonafideId === selectedBonafide.bonafideId
              ? { ...item, reuploadDone: true, bonafideStatus: "HOD_APPROVED" }
              : item
          )
        );

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
              <th>Download</th>
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
                  {item.bonafideStatus === 'PRINCIPAL_APPROVED' ? (
                    <button onClick={() => handleDownload(item.filePath, item.bonafideStatus)}>
                      <FaDownload style={{ marginRight: '5px' }} />Download
                    </button>
                  ) : item.bonafideStatus === 'OB_REJECTED' ? (
                    item.reuploadDone ? (
                      <button disabled>Files reuploaded</button>
                    ) : (
                      <div style={{ color: 'red' }}>
                        <p>Reason: {item.rejectionMessage}</p>
                        <button onClick={() => handleReuploadClick(item)}>Reupload</button>
                      </div>
                    )
                  ) : (
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
            {(purposeFileMap[selectedBonafide.purpose] || []).includes('studentIdCardFile') && (
              <div className="file-upload">
                <label>Student ID Card</label>
                <input type="file" onChange={e => handleFileChange(e, 'studentIdCardFile')} />
              </div>
            )}
            {(purposeFileMap[selectedBonafide.purpose] || []).includes('aadharCardFile') && (
              <div className="file-upload">
                <label>Aadhar Card</label>
                <input type="file" onChange={e => handleFileChange(e, 'aadharCardFile')} />
              </div>
            )}
            {(purposeFileMap[selectedBonafide.purpose] || []).includes('smartCardFile') && (
              <div className="file-upload">
                <label>Smart Card</label>
                <input type="file" onChange={e => handleFileChange(e, 'smartCardFile')} />
              </div>
            )}
            {(purposeFileMap[selectedBonafide.purpose] || []).includes('WelfareProofDocumentFile') && (
              <div className="file-upload">
                <label>Welfare Proof</label>
                <input type="file" onChange={e => handleFileChange(e, 'WelfareProofDocumentFile')} />
              </div>
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
