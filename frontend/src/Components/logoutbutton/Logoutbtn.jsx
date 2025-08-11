
import "./Logoutbtn.css";
import { useNavigate } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import { AuthService } from "../../Api/AuthService";

const Logoutbtn = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    toast.success("Logged out successfully");
    setTimeout(() => {
       navigate('/login-page');
    },1000)
  };

  return (
    <div>
      <button className="logout-Btn" onClick={handleLogout}>
        <RiLogoutCircleLine /> Logout
      </button>
      <ToastContainer />
    </div>


  );
};

export default Logoutbtn;
