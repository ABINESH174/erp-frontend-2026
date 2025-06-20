import React from 'react';
import './BonafideViewModal.css';

const BonafideViewModal = ({ showModal, setShowModal, selectedBonafide }) => {
  if (!showModal || !selectedBonafide) return null;

  const handleDownload = async (filePath) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bonafide/downloadFile?filePath=${encodeURIComponent(filePath)}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('/').pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file.');
    }
  };

  const handlePreview = async (filePath) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bonafide/previewFile?filePath=${encodeURIComponent(filePath)}`);
      if (!response.ok) throw new Error(`Preview failed: ${response.statusText}`);

      const contentType = response.headers.get('content-type');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const previewableTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/gif', 'text/plain', 'text/html'];

      if (previewableTypes.includes(contentType)) {
        window.open(url, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filePath.split('/').pop());
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to preview file.');
    }
  };

  // Fields allowed to display
  const allowedFields = [
    'name',
    'registerNo',
    'purpose',
    'bonafideStatus',
    'date',
    'academicYear',
    'companyName',
    'bankNameForEducationalLoan',
    'mobileNumber',
    'emailId',
    'semester',
    'discipline',
    'welfareIdFilePath',
    'smartCardFilePath',
    'studentIdCardFilePath',
    'provisionalAllotmentFilePath',
    'aadharCardFilePath',
    'centralCommunityCertificateFilePath',
    'collegeFeeReceiptFilePath',
  ];

  // Friendly labels
  const fieldLabels = {
    name: 'Name',
    registerNo: 'Register Number',
    purpose: 'Purpose',
    bonafideStatus: 'Status',
    date: 'Date',
    academicYear: 'Academic Year',
    companyName: 'Company Name',
    bankNameForEducationalLoan: 'Bank Name for Educational Loan',
    mobileNumber: 'Mobile Number',
    emailId: 'Email ID',
    semester: 'Semester',
    discipline: 'Discipline',
    welfareIdFilePath: 'Welfare ID',
    smartCardFilePath: 'Smart Card',
    studentIdCardFilePath: 'Student ID Card',
    provisionalAllotmentFilePath: 'Provisional Allotment',
    aadharCardFilePath: 'Aadhar Card',
    centralCommunityCertificateFilePath: 'Community Certificate',
    collegeFeeReceiptFilePath: 'College Fee Receipt',
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={() => setShowModal(false)}>Close</button>
        <h3>Bonafide Request Details</h3>

        {allowedFields.map((field) => {
          const value = selectedBonafide[field];
          if (!value) return null;

          if (field.endsWith('FilePath')) {
            return (
              <div className="view-downloader" key={field}>
                <p><strong>{fieldLabels[field] || field}:</strong></p>
                <button onClick={() => handleDownload(value)} className="view-download-btn">Download</button>
                <button onClick={() => handlePreview(value)} className="view-preview-btn">Preview</button>
              </div>
            );
          }

          return (
            <p key={field}>
              <strong>{fieldLabels[field] || field}:</strong> {value}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default BonafideViewModal;
