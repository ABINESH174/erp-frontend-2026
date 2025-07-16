import React, { useState } from 'react';
import axios from "axios";
import './Loginpage.css';
import { useNavigate } from 'react-router-dom';
import { Loginbutton } from '../../Components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import {clgimage}from '../../Assets/clgimage.jpg';

function Loginpage() {
  const [userId, setUserId] = useState('');  // Changed setuserId to setUserId for convention
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
    document.getElementById("password").focus();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/authentication/authenticate`, { userId, password });
      console.log(res);
      if (res.data === "Student Authentication Successful") {
        toast.success("Login Successful");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate('/profile-page', { state: { userId } });
      } 
      else if (res.data === "Form not filled") {
        toast.info("Login Successful");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate('/registration-form', { state: { userId } });
      }
      else if (res.data === "Invalid Register Number") {
        toast.error("Invalid Register Number or Password");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      else if (res.data === "Faculty Registration Not Successful") {
        toast.info("Login Successful");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate('/faculty-registration', { state: { userId } });
      }
      else if (res.data === "Faculty Authentication Successful") {
        toast.success("Login Successful");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        localStorage.setItem('facultyId', userId);
        localStorage.setItem('facultyEmail', userId);

      console.log("Saved facultyId and facultyEmail to localStorage:", userId);
        navigate('/faculty-dashboard', { state: { userId } });
      }
      else if (res.data === "HOD Authentication Successful") {
        toast.success("Login Successful");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        localStorage.setItem('hodEmail', userId);
      console.log("Saved hod email to localStorage:", userId);
        navigate('/hod-dashboard', { state: { userId } });
      }
      else if (res.data === "Office Bearer Authentication Successful") {
        toast.success("Login Successful");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        localStorage.setItem('officeBearerEmail', userId);
        navigate('/office-bearer-dashboard', { state: { userId } });
      }
      else if(res.data === "Principal Authentication Successful"){
        toast("Login Successful");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate('/principal-dashboard',{state: {userId}})
        }
      else {
        toast.error("Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid Register Number or Password");
    }
  };

  return (
    <div>
      <div className="logincontainer">
        <div className="Loginform">
          <div className="form">
            <h1 id='login-title'>Login</h1>
            <form id="login" onSubmit={handleSubmit}>
              <label className='login-mailid' htmlFor="userId" >User Id</label>
              <input
                type="text"
                id='input-mail'
                value={userId}   // Added value to userId input
                onChange={e => setUserId(e.target.value)}
                required
              />
              <label className='login-password' htmlFor="password">Password</label>
              <div className="password-box">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <IoMdEyeOff className="eye-icon" onClick={handleTogglePassword} />
                ) : (
                  <FaRegEye className="eye-icon" onClick={handleTogglePassword} />
                )}
              </div>

              {/* Submit button should have type="submit" to trigger form submit */}
              <div className='login-button-space'>
                <Loginbutton type="submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Loginpage;
