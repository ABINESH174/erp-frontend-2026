import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Principaldashboard.css';
import Header from '../../Components/Header/Header.jsx';
import Profileicon from '../../Assets/profile.svg';
import Logoutbtn from '../../Components/logoutbutton/Logoutbtn.jsx';
import { BsPeople, BsPerson } from "react-icons/bs";
import Logout from '../../Assets/logout.svg';
import Allbuttons from '../../Components/Allbuttons/Allbuttons.jsx';
import AxiosInstance from '../../Api/AxiosInstance.js';
import { UtilityService } from '../../Utility/UtilityService.js';
import { ToastContainer } from 'react-toastify';

function Principaldashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [open, setOpen] = useState(false);
  const [PrincipalData, setPrincipalData] = useState(null);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const idFromState = location.state?.userId;
    const storedId = localStorage.getItem('principalEmail');

    if (idFromState) {
      setUserId(idFromState);
      localStorage.setItem('principalEmail', idFromState);
    } else if (storedId) {
      setUserId(storedId);
    } else {
      setError('No user ID found.');
    }
  }, [location.state]);

  // Fetch principal data using userId
  useEffect(() => {
    if (!userId) return;

    const fetchPrincipal = async () => {
      try {
        const res = await AxiosInstance.get(`/principal/getPrincipalByEmail/${encodeURIComponent(userId)}`);
        setPrincipalData(res.data.data);
        console.log("Principal:", res.data.data);
      } catch (err) {
        console.error('Error fetching Principal data:', err);
        setError('Failed to fetch Principal data.');
      }
    };

    fetchPrincipal();
  }, [userId]);

  useEffect(() => {
    if (location.pathname === '/principal-dashboard') {
      navigate('/principal-dashboard/Department', { state: { userId } });
    }
  }, [location.pathname, navigate, userId]);

  const handleLogoutClick = () => {
    localStorage.removeItem('principalEmail');
    navigate('/login-page');
  };

  return (
    <div>
      <Header />
      <div className="principal-outer-container">
        <div className="principal-whole">
          <div className="principal-nav-sidebar">
            <h2>Principal Dashboard</h2>

            <div className="principal-navigation-bar">
              <p
                className={`principal-nav-item ${active === "PrincipalProfile" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActive("PrincipalProfile");
                  setOpen(!open);
                }}
              >
                <BsPerson /> Profile
              </p>

              <p
                className={`principal-nav-item ${active === "Students" ? "active" : ""}`}
                onClick={() => {
                  setActive("Students");
                  navigate('/principal-dashboard/Department', { state: { userId } });
                }}
              >
                <BsPeople /> Students
              </p>
            </div>

            <Logoutbtn className='principal-logout' />
          </div>

          <div className="principal-inner-content">
            <div className="headbar">
              <div className="welcome-bar">
                <p>Welcome!</p>
                <p className="acadamic-year">Academic Year: {UtilityService.getAcademicYear()}</p>
              </div>

              <div className="principal_profile_icon" onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}>
                <img id="profile_icon" src={Profileicon} alt="Profile Icon" />
                {open && (
                  <div className="principal_profile_details" onClick={(e) => e.stopPropagation()}>
                    <div className="principal-profile">
                      <p className="field_background">{PrincipalData?.firstName} {PrincipalData?.lastName}</p>
                      <p className="field_background">{PrincipalData?.email}</p>
                      <p className="field_background">{PrincipalData?.mobileNumber}</p>
                      <Allbuttons value="Logout" image={Logout} target={handleLogoutClick} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="principal-content-space">
              <Outlet context={{ PrincipalData }} />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Principaldashboard;
