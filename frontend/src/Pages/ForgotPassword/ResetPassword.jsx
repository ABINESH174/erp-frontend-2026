import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FaRegEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import './ForgotPassword.css';
import { useLocation, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../Api/AxiosInstance';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state.email;

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

   const validateStrongPassword = (password) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

   const generateNewPassword = async (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }

    try {

    // Validate strong password
    if (!validateStrongPassword(newPassword)) {
      toast.error(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

 try {
      await AxiosInstance.put('/authentication/set-password', { email, otp, newPassword });
      toast.success("Password Changed Successfully");
      setTimeout(() => {
        navigate('/login-page')
      }, 1500);
    } catch (error) {
      if (error.response) {
      const status = error.response.status;
      if (status === 412) {
        toast.error("OTP has expired. Please request a new one.");
      setTimeout(() => {
        navigate('/login-page')
      }, 1500);
      } else if (status === 406) {
        toast.error("Invalid OTP. Please check and try again.");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      setTimeout(() => {
        navigate('/login-page')
      }, 1500);
      }
    } else {
      toast.error("Network error or server is unreachable.");
      setTimeout(() => {
        navigate('/login-page')
      }, 1500);
    }
    }
  }

 

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Reset Password</h2>
        <form onSubmit={generateNewPassword}>
          <label>Email:</label>
          <input type='email' value={email} disabled />

          <label>
            OTP (10 mins Exp):
            {timeLeft > 0 ? (
              <span className="otp-timer"> {formatTime(timeLeft)}</span>
            ) : (
              <span className="otp-timer expired"> Expired</span>
            )}
          </label>
          <input
            type='text'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            disabled={timeLeft <= 0}
          />

          <label>New Password:</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <IoMdEyeOff className="eye-icon" onClick={handleTogglePassword} />
            ) : (
              <FaRegEye className="eye-icon" onClick={handleTogglePassword} />
            )}
          </div>

          <button type='submit' disabled={timeLeft <= 0}>Reset Password</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
