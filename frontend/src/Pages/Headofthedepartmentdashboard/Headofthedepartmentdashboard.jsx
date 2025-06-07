import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Headofthedepartmentdashboard.css';
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import Profileicon from '../../Assets/profile.svg';
import axios from 'axios';
import BatchCards from '../../Components/batchcomponent/BatchCards.jsx';
import Logoutbtn from '../../Components/logoutbutton/Logoutbtn.jsx';
import { BsPerson } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import BonafideCount from '../../Components/BonafideCounter/BonafideCount.jsx';


function Headofthedepartmentdashboard() {
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
  const getAcademicYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const startMonth = 8; // August (0-indexed: Jan = 0, Aug = 8)

    if (now.getMonth() >= startMonth) {
      // Academic year starts this year
      return `${currentYear}-${currentYear + 1}`;
    } else {
      // Academic year started last year
      return `${currentYear - 1}-${currentYear}`;
    }
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
    <div className="hod-outer-container">
      <div className="hod-whole">          
        <div className="hod-nav-sidebar">
            <h2>HOD Dashboard</h2>
          <div className="hod-navigation-bar">
            <p><BsPerson />profile</p>
            <p onClick={() => navigate('/hod-bonafide-approval', { state: { userId: userId } })}><FaFileAlt />
            Bonafide 
            </p>
          </div> 
          <div > <Logoutbtn className='hod-logout' /></div>
        </div>
        <div className="hod-inner-content">
        <div className="welcome-bar"><p>welcome ! head of the CSE department</p> <p className='acadamic-year'>Academic Year: <p>{getAcademicYear()}</p>
</p></div> 
<div className="hod-content-space">
           <Outlet/>
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

export default Headofthedepartmentdashboard;