import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Headofthedepartmentdashboard.css';
import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import Profileicon from '../../Assets/profile.svg';
import axios from 'axios';
import Logoutbtn from '../../Components/logoutbutton/Logoutbtn.jsx';
import { BsPerson } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import Logout from '../../Assets/logout.svg';
import Allbuttons from '../../Components/Allbuttons/Allbuttons.jsx';
import BonafideCount from '../../Components/BonafideCounter/BonafideCount.jsx';
import AxiosInstance from '../../Api/AxiosInstance.js';
import { Facultyfields } from '../../Components/index.js';
import Add from '../../Assets/add.svg';

function Headofthedepartmentdashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [open, setOpen] = useState(false);
  const [hodData, setHodData] = useState(null);
  const [openAddFacultyModal, setOpenAddFacultyModal] = useState(false);
  const [error, setError] = useState(null);

  // Step 1: Set userId from location.state or localStorage
  useEffect(() => {
    const idFromState = location.state?.userId;
    const storedId = localStorage.getItem('hodEmail');

    if (idFromState) {
      setUserId(idFromState);
      localStorage.setItem('hodEmail', idFromState);
    } else if (storedId) {
      setUserId(storedId);
    } else {
      setError('No user ID found.');
    }
  }, [location.state]);

  // Step 2: Fetch HOD data once userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchHod = async () => {
      try {
        const res = await AxiosInstance.get(`/hod/getHodByEmail/${encodeURIComponent(userId)}`);
        setHodData(res.data.data);
      } catch (err) {
        console.error('Error fetching HOD data:', err);
        setError('Failed to fetch HOD data.');
      }
    };

    fetchHod();
  }, [userId]);

  const handleLogoutClick = () => {
    localStorage.removeItem('hodEmail');
    navigate('/login-page');
  };

  const getAcademicYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    return now.getMonth() >= 7 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  };

  const goToFacultyInfo = () => navigate('/facultyinfohod-page', { state: { userId } });
  const goToStudentInfo = () => navigate('/studentinfohod-page', { state: { userId } });

  return (
    <div>
      <Header />
      <div className="hod-outer-container">
        <div className="hod-whole">
          <div className="hod-nav-sidebar">
            <h2>HOD Dashboard</h2>
            <div className="hod-navigation-bar">
              <p className='hod-nav-item' onClick={(e) => { e.stopPropagation(); setOpen(!open); }}><BsPerson /> Profile</p>
              <p className='hod-bonafide-nav-item' onClick={() => navigate('/hod-bonafide-approval', { state: { userId } })}>
                <FaFileAlt /> Bonafide
                {userId && (
                  <BonafideCount
                    getIdApi="/hod/getHodByEmail"
                    getBonafideApi="/hod/getFacultyApprovedBonafidesByHodId"
                    statusFilter="FACULTY_APPROVED"
                    render={(count) => count > 0 && (
                      <span className='hod-bonafide-count'>{count}</span>
                    )}
                  />
                )}
              </p>
            </div>
            <Logoutbtn className='hod-logout' />
          </div>

          <div className="hod-inner-content">
            <div className="headbar">
              <div className="welcome-bar">
                <p>Welcome! Head of the {hodData?.discipline || '...'} Department</p>
                <p className="acadamic-year">Academic Year: {getAcademicYear()}</p>
              </div>
              <div className="">
                <Allbuttons image={Add} value="Add Faculty" target={() => setOpenAddFacultyModal(true)} />
              </div>
              <div className="nav">
                <div className="faculty_profile_icon" onClick={(e) => {e.stopPropagation();setOpen(!open)}}>
                  <img id="profile_icon" src={Profileicon} alt="Profile Icon"/>
                </div>
              </div>
              {open && (
                <div className="faculty_profile_details" onClick={(e) => e.stopPropagation()}>
                  <div className="faculty-profile">
                    <p className="field_background">{hodData?.firstName} {hodData?.lastName}</p>
                    <p className="field_background">{hodData?.discipline}</p>
                    <p className="field_background">{hodData?.email}</p>
                    <p className="field_background">{hodData?.mobileNumber}</p>
                    <Allbuttons value="Logout" image={Logout} target={handleLogoutClick} />
                  </div>
                </div>
              )}

              {open && (document.onclick = () => setOpen(false))}

              {openAddFacultyModal && (
            <Facultyfields
              onClose={()=>{setOpenAddFacultyModal(false)}}
              role="FACULTY"
              fields={[
                { label: 'Name', inputname: 'Name', fieldtype: 'text' },
                // { label: 'Register Number', inputname: 'RegisterNumber', fieldtype: 'text' },
                { label: 'Mobile Number', inputname: 'MobileNumber', fieldtype: 'text' },
                { label: 'Mail Id', inputname: 'MailId', fieldtype: 'text' },
                { label: 'Aadhar Number', inputname: 'AadharNumber', fieldtype: 'text' }
              ]}
            />
          )}
            </div>

            <div className="hod-content-space">
              <Outlet context={{ discipline: hodData?.discipline }} />
            </div>
          </div>
        </div>
      </div>

      {/* Uncomment if you want footer */}
      {/* <div className="Headofthedepartmentdashboard_footer">
        <Footer />
      </div> */}
    </div>
  );
}

export default Headofthedepartmentdashboard;
