import { useEffect, useState, useRef, useCallback } from "react";
import { BsPerson } from "react-icons/bs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header.jsx";
import AxiosInstance from "../../Api/AxiosInstance.js";
import { AuthService } from "../../Api/AuthService.js";
import { toast } from "react-toastify";
import "./Principaldashboard.css";
import Allbuttons from '../../Components/Allbuttons/Allbuttons.jsx';
import Logout from '../../Assets/logout.svg';

function PrincipalDashboard() {
  const [principal, setPrincipal] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const principalEmail = location.state?.userId || localStorage.getItem("principalEmail");

  const profileRef = useRef(null);

  useEffect(() => {
    if (location.state?.userId) {
      localStorage.setItem("principalEmail", location.state.userId);
    }
  }, [location.state?.userId]);

  const fetchPrincipal = useCallback(async () => {
    if (!principalEmail) return;
    try {
      const response = await AxiosInstance.get(`/principal/getPrincipalByEmail/${principalEmail}`);
      setPrincipal(response.data?.data || response.data);
    } catch (error) {
      console.error("Error fetching principal:", error);
    } finally {
      setLoading(false);
    }
  }, [principalEmail]);

  useEffect(() => {
    fetchPrincipal();
  }, [fetchPrincipal]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    AuthService.logout();
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login-page");
    }, 1000);
  };

  if (loading) return <p>Loading principal data...</p>;
  if (!principal) return <p>No principal data available.</p>;

  return (
    <div>
      <Header />

      {/* Profile Icon Section */}
      <div className="principal-profile-container" ref={profileRef}>
        <div className="principal-profile-bar" onClick={() => setOpenProfile(!openProfile)}>
          <BsPerson size={30} className="profile-icon" />
        </div>

        {openProfile && (
          <div className="principal-profile-dropdown">
            <div className="principal-profile">
              <p className="field_background">
                {principal.firstName} {principal.lastName}
              </p>
              <p className="field_background">{principal.email}</p>
              <p className="field_background">{principal.mobileNumber}</p>
              <Allbuttons value="LogOut" image={Logout} target={() => handleLogoutClick()} />
            </div>
          </div>
        )}
      </div>

      {/* Main Outlet Content */}
      <div className="principal-dashboard-content">
        <Outlet context={{ role: "PRINCIPAL" }} />
      </div>
    </div>
  );
}

export default PrincipalDashboard;
