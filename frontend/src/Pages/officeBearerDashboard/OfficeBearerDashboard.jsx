import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header.jsx';
import './OfficeBearerDashboard.css';
import AxiosInstance from '../../Api/AxiosInstance.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { AuthService } from '../../Api/AuthService.js';

function OfficeBearerDashboard() {
  const navigate = useNavigate();
  const [officeBearer, setOfficeBearer] = useState(null);

  useEffect(() => {
    const fetchOfficeBearer = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        const email = currentUser?.userId;

        if (!email) {
          toast.error('You must be logged in');
          navigate('/login-page');
          return;
        }

        const response = await AxiosInstance.get('/office-bearer/get/email', {
          params: { email }
        });

        setOfficeBearer(response.data.data);
      } catch (err) {
        console.error('Error fetching office bearer:', err);
        toast.error('Failed to load office bearer data');
      }
    };

    fetchOfficeBearer();
  }, []);

  const handlePurposeAccess = (purpose) => {
  if (officeBearer?.handlingPurpose === purpose) {
    if (purpose === "BONAFIDE_TYPE_SECTION_B") {
      navigate('/office-bearer-dashboard/ob-bonafide', {state: { bonafideType : "BONAFIDE_TYPE_SECTION_B" }});
    } else {
      navigate('/office-bearer-dashboard/ob-bonafide', {state: { bonafideType : "BONAFIDE_TYPE_SECTION_S" }});
    }
  } else {
    toast.error('You are not allowed to handle this purpose', {
      position: 'top-right',
      autoClose: 3000,
    });
  }
}


  return (
    <div>
      <Header />
      <div className="hod-student-batch-box ob-whole">
        <div className="ob-welcome-bar">
          <h2>Welcome! Office Bearer Dashboard</h2>
        </div>

        <div className="batchbox">
          <div className="batch-card">

            <h3>Bonafide Section - B</h3>
            <button className="batch-carry-btn" onClick={() => handlePurposeAccess("BONAFIDE_TYPE_SECTION_B")}>
              View
            </button>
          </div>

          <div className="batch-card">

            <h3>Bonafide Section - S</h3>
            <button className="batch-carry-btn" onClick={() => handlePurposeAccess("BONAFIDE_TYPE_SECTION_S")}>
              View
            </button>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
      <ToastContainer />
    </div>
  );
}

export default OfficeBearerDashboard;
