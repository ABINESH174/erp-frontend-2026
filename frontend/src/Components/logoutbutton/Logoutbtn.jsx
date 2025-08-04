import React from "react";
import "./Logoutbtn.css";
import { useNavigate } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import { logoutUser } from "../../Api/AuthService";

const Logoutbtn = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logoutUser();
    if (res) {
      toast.success("Logged out successfully");
      await new Promise((resolve) => setTimeout(resolve, 800));
      navigate("/login-page");
    } else {
      toast.error("Logout failed");
    }
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
