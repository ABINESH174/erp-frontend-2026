import axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FaRegEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../../Api/AxiosInstance';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const generateNewPassword = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.put('/authentication/set-password', { email, otp, newPassword });
      toast.success("Password Changed Successfully");
    } catch (error) {
      toast.error("Failed to Reset Password");
    } finally {
      setTimeout(() => {
        navigate('/login-page')
      }, 1500)
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Reset Password</h2>
        <form onSubmit={generateNewPassword}>
          <label>Email:</label>
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>OTP:</label>
          <input type='text' value={otp} onChange={(e) => setOtp(e.target.value)} required />

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

          <button type='submit'>Reset Password</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ResetPassword;
