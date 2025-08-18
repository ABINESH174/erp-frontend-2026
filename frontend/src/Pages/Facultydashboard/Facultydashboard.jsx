import { useEffect, useState, useCallback } from "react";
import "./Facultydashboard.css";
import { FaFileAlt } from "react-icons/fa";
import { BsPeople, BsPerson } from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import Header from "../../Components/Header/Header.jsx";
import Logoutbtn from "../../Components/logoutbutton/Logoutbtn.jsx";
import BonafideCount from "../../Components/BonafideCounter/BonafideCount.jsx";
import AxiosInstance from "../../Api/AxiosInstance.js";
import { AuthService } from "../../Api/AuthService.js";
import { toast } from "react-toastify";
import previousBonafide from "../../Assets/previousbonafide.png";
import pendingbonafide from "../../Assets/pendingbonafide.png";

function Facultydashboard() {
  const [faculty, setFaculty] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openAddClassModal, setOpenAddClassModal] = useState(false);
  const [openExcelUploadModal, setOpenExcelUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBonafideOpen, setIsBonafideOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Always get facultyEmail (from state or localStorage)
  const facultyEmail = location.state?.userId || localStorage.getItem("facultyEmail");

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
      setSelectedStudent(response.data); // full StudentDto from backend
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
            <div
              className="faculty-profile-bar"
              onClick={() => setOpenProfile(!openProfile)}
            >
              <BsPerson />
              <p>Profile</p>
            </div>

            <div
              className="faculty-profile-bar"
              onClick={() =>
                navigate("/faculty-dashboard", { state: { userId: facultyEmail } })
              }
            >
              <BsPeople /> Students
            </div>

            <div
              className="bonafide-view"
              onClick={() =>  {setIsBonafideOpen(!isBonafideOpen);navigate('faculty-bonafide', { state: { facultyEmail } })}}
            >
              <FaFileAlt /> Bonafide
            </div>

            {isBonafideOpen && (
              <div className="fa-bonafide-list">
                <div
                  className="fa-bonafide-view-item"
                  onClick={() =>
                    navigate("faculty-bonafide", { state: { facultyEmail } })
                  }
                >
                  <img src={pendingbonafide} alt="" />
                  <p>
                    Pending
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

                <div
                  className="fa-bonafide-view-item"
                  onClick={() =>
                    navigate("previous-bonafide", { state: { facultyEmail } })
                  }
                >
                  <img src={previousBonafide} alt="" />
                  Previous
                </div>
              </div>
            )}

            <Logoutbtn onClick={handleLogoutClick} />
          </div>
        </div>

        <div className="top-sidebox">
]          <Outlet context={{ role: "FACULTY" }} />
        </div>
      </div>
    </div>
  );
}

export default Facultydashboard;
