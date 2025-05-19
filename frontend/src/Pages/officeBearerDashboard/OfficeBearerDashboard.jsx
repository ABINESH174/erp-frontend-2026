import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Headofthedepartmentdashboard.css';
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import Profileicon from '../../Assets/profile.svg';
import axios from 'axios';
import Allbuttons from '../../Components/Allbuttons/Allbuttons.jsx';
import Logout from '../../Assets/logout.svg';

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
        const response = await axios.get(`http://localhost:8080/api/hod/getHodByEmail/${userId}`);
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

      <div className="hod-whole">          <div className="hod-top-dashboard"> </div>

        <div className="hod-content">
          <div className="hod-bar">
            <h2>Office Bearer Dashboard</h2>
            <h4>profile</h4>
            <div className="bonafide-hod" onClick={() => navigate('/office-bearer-dashboard', { state: { userId: userId } })}>
            <h4>Bonafide</h4>
            
                        </div>
          </div>
          <div className="welcome-bar">welcome ! head of the CSE department</div>
          <div className="batchbox">
            <div class="batch-card">
              <h3>2022-2026</h3>
            </div>
            <div class="batch-card">
              <h3>2023-2027</h3>
            </div>
            <div class="batch-card">
              <h3>2024-2028</h3>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="Headofthedepartmentdashboard_footer">
        <Footer />
      </div> */}
    </div>
  );
}

export default OfficeBearerDashboard;