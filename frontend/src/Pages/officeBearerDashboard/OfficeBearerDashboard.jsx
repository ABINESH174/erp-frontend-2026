import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import Profileicon from '../../Assets/profile.svg';
import axios from 'axios';
import Allbuttons from '../../Components/Allbuttons/Allbuttons.jsx';
import Logout from '../../Assets/logout.svg';
import BonafideCount from '../../Components/BonafideCounter/BonafideCount.jsx';
import './OfficeBearerDashboard.css';
import AxiosInstance from '../../Api/AxiosInstance.js';

function OfficeBearerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState('Headofthedepartment');
  const [open, setOpen] = useState(false);
  const [Headofthedepartment, setHeadofthedepartment] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeadofthedepartment = async () => {
      try {
        const { userId } = location.state || {};
        const response = await AxiosInstance.get(`/hod/getHodByEmail/${userId}`);
        setHeadofthedepartment(response.data.data);
        setUserId(userId);
      } catch (error) {
        console.error('Error fetching faculty:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchHeadofthedepartment();
  }, [location.state]);

  const handleLogoutClick = () => {
    navigate('/login-page');
  };

  const gotofacultyinfohod = () => {
    navigate('/facultyinfohod-page', { state: { userId } });
  };

  const gotostudentinfohod = () => {
    navigate('/studentinfohod-page', { state: { userId } });
  };

  return (
    <div>
      <Header />
      {/* <div className="nav">
        <div className="faculty_profile_icon" onClick={() => setOpen(!open)}>
          <img id="profile_icon" src={Profileicon} alt="Profile Icon" />
        </div>
      </div>

      {open && (
        <div className="faculty_profile_details">
          <div className="faculty-profile">
            <p className="field_background">{Headofthedepartment.firstName} {Headofthedepartment.lastName}</p>
            <p className="field_background">{Headofthedepartment.discipline}</p>
            <p className="field_background">{Headofthedepartment.email}</p>
            <p className="field_background">{Headofthedepartment.mobileNumber}</p>
            <Allbuttons value="Logout" image={Logout} target={handleLogoutClick} />
          </div>
        </div>
      )} */}

      {/* <button onClick={gotostudentinfohod}>Student</button>
      <button onClick={gotofacultyinfohod}>Faculty</button> */}

      <div className="ob-whole">        
       

        <div className="ob-navbar-content">
         
            <h2>Office Bearer Dashboard</h2>
            <p>profile</p>
            <p onClick={() => navigate('/office-bearer-dashboard', { state: { userId: userId } })}>Bonafide</p>
            
            
            
      
          </div>
          <div className="ob-top-dashboard">
          <div className="ob-welcome-bar"><p>Welcome!</p></div>
                   <h2>Office Bearer Dashboard</h2>


        </div>
          
      </div>

      {/* <div className="Headofthedepartmentdashboard_footer">
        <Footer />
      </div> */}
    </div>
  );
}

export default OfficeBearerDashboard;