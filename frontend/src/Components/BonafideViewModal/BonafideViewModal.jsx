// src/components/BonafideDetailsModal.jsx

import React from 'react';
import './BonafideViewModal.css'; // Assuming you have styles for the modal in this file

const BonafideViewModal = ({ showModal, setShowModal, selectedBonafide }) => {
  if (!showModal || !selectedBonafide) return null;

  const handleDownload = async (filePath) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bonafide/downloadFile?filePath=${encodeURIComponent(filePath)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('File download error:', error);
      alert('Failed to download file.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={() => setShowModal(false)}>Close</button>
        <h3>Bonafide Request Details</h3>
        {Object.entries(selectedBonafide).map(([key, value]) => {
          if (
            value !== null &&
            value !== '' &&
            key !== 'bonafideId' &&
            key !== 'studentId'
          ) {
            if (key.endsWith('FilePath')) {
              const label = key
                .replace(/FilePath$/, '')
                .replace(/([A-Z])/g, ' $1')
                .trim();

              return (
                <div className='view-downloader' key={key}>
                  <p><strong>{label}:</strong></p>
                  <button
                    className="view-download-btn "
                    onClick={() => handleDownload(value)}
                  >
                    Download File
                  </button>
                </div>
              );
            } else {
              const label = key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <p key={key}>
                  <strong>{label}:</strong> {value}
                </p>
              );
            }
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default BonafideViewModal;
