import React, { useState } from 'react';
import './excelupload.css';
import Allbuttons from '../../Components/Allbuttons/Allbuttons.jsx';
import Nextwhite from '../../Assets/Nextwhite.svg';
import axios from 'axios';
import { toast } from 'react-toastify';
import AxiosInstance from '../../Api/AxiosInstance.js';

function ExcelFileUpload({ onClose }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await AxiosInstance.post('/authentication/upload-students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
        console.log('File uploaded successfully:', response.data);
        toast.success("File uploaded successfully ");

      // Reset file after upload
      setFile(null);
      if (onClose) onClose();

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div className="excel_upload_modal_container">
      <span className="close" onClick={onClose}>&times;</span>

      <div className="file_upload_field">
        <label htmlFor="excelFile">Select Excel File</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          id="excelFile"
          onChange={handleFileChange}
        />
      </div>

      <div id="excel_upload_button">
        <Allbuttons value="Upload" image={Nextwhite} target={handleUpload} />
      </div>
    </div>
  );
}

export default ExcelFileUpload;
