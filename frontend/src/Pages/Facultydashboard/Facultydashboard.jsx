import { useEffect, useState, useCallback, useRef } from "react";
import { FaFileAlt } from "react-icons/fa";
import { BsPeople, BsPerson } from "react-icons/bs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header.jsx";
import Logoutbtn from "../../Components/logoutbutton/Logoutbtn.jsx";
import BonafideCount from "../../Components/BonafideCounter/BonafideCount.jsx";
import AxiosInstance from "../../Api/AxiosInstance.js";
import { AuthService } from "../../Api/AuthService.js";
import { toast } from "react-toastify";
import previousBonafide from "../../Assets/previousbonafide.png";
import pendingbonafide from "../../Assets/pendingbonafide.png";
import "./Facultydashboard.css";
import "react-toastify/dist/ReactToastify.css";
import { Allbuttons } from "../../Components/index.js";
import Logout from '../../Assets/logout.svg';

function Facultydashboard() {
  const [faculty, setFaculty] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openAddClassModal, setOpenAddClassModal] = useState(false);
  const [openExcelUploadModal, setOpenExcelUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBonafideOpen, setIsBonafideOpen] = useState(false);
  const [active, setActive] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const facultyEmail = location.state?.userId || localStorage.getItem("facultyEmail");

  const profileRef = useRef(null);
  const bonafideRef = useRef(null);

  useEffect(() => {
    if (location.state?.userId) {
      localStorage.setItem("facultyEmail", location.state.userId);
    }
  }, [location.state?.userId]);

  const fetchFaculty = useCallback(async () => {
    if (!facultyEmail) return;
    try {
      const response = await AxiosInstance.get(`/faculty/${facultyEmail}`);
      setFaculty(response.data.data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    } finally {
      setLoading(false);
    }
  }, [facultyEmail]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
      if (bonafideRef.current && !bonafideRef.current.contains(e.target)) {
        setIsBonafideOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    AuthService.logout();
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login-page");
    }, 1000);
  };

  const handleViewClick = async (student) => {
    const registerNo = student.registerNo?.trim();
    try {
      setSelectedStudent(null);
      setOpenModal(true);
      setOpenProfile(false);

      const response = await AxiosInstance.get(`/student/${registerNo}`);
      setSelectedStudent(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setOpenAddClassModal(false);
    setOpenExcelUploadModal(false);
    setSelectedStudent(null);
    fetchFaculty();
  };

  if (loading) return <p>Loading faculty data...</p>;
  if (!faculty) return <p>No faculty data available.</p>;

  return (
    <div>
      <Header />
      <div className="parent">
        <div className="full-container">
          <p className="faculty-heading-tag">faculty dashboard</p>
          <div className="faculty-side">

            {/* Profile Section */}
            <div ref={profileRef} className="faculty-profile-bar" onClick={() => setOpenProfile(!openProfile)}>
              <BsPerson />
              <p>Profile</p>
              {openProfile && (
                <div className="dash-faculty_profile_details">
                  <div className="faculty-profile">
                    <p className="field_background">{faculty.firstName} {faculty.lastName}</p>
                    <p className="field_background">{faculty.discipline}</p>
                    <p className="field_background">{faculty.email}</p>
                    <p className="field_background">{faculty.mobileNumber}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Students Section */}
            <div
              className={`faculty-profile-bar ${active === "student" ? "active" : ""}`}
              onClick={() => {
                setActive("student");
                navigate("/faculty-dashboard", { state: { userId: facultyEmail } });
              }}
            >
              <BsPeople /> Students
            </div>

            {/* Bonafide Section */}
            <div ref={bonafideRef}>
              <div
                className={`bonafide-view ${active === "bonafide-fa" ? "active" : ""}`}
                onClick={() => {
                  setActive("pending");
                  setIsBonafideOpen(!isBonafideOpen);
                  navigate("faculty-bonafide", { state: { facultyEmail } });
                }}
              >
                <FaFileAlt /> <p>Bonafide
                  {facultyEmail && (
                    <BonafideCount
                      getIdApi={`/faculty`}
                      getBonafideApi={`/faculty/get-pending-bonafides`}
                      statusFilter="PENDING"
                      render={(count) =>
                        count > 0 && (
                          <span className="counter-bonafide">{count}</span>
                        )
                      }
                    />
                  )}
                </p>
              </div>

              {isBonafideOpen && (
                <div className="fa-bonafide-list">
                  <div
                    className={`fa-bonafide-view-item ${active === "pending" ? "active" : ""}`}
                    onClick={() => {
                      setActive("pending");
                      navigate("faculty-bonafide", { state: { facultyEmail } });
                    }}
                  >
                    <img className="img-pending" src={pendingbonafide} alt="" />
                    <p>Pending</p>
                  </div>

                  <div
                    className={`fa-bonafide-view-item ${active === "previous" ? "active" : ""}`}
                    onClick={() => {
                      setActive("previous");
                      navigate("previous-bonafide", { state: { facultyEmail } });
                    }}
                  >
                    <img className="img-previous" src={previousBonafide} alt="" />
                    Previous
                  </div>
                </div>
              )}
            </div>

            <Logoutbtn onClick={handleLogoutClick} />
          </div>
        </div>

        <div className="top-sidebox">
          <Outlet context={{ role: "FACULTY" }} />
        </div>
      </div>
    </div>
  );
}

export default Facultydashboard;
