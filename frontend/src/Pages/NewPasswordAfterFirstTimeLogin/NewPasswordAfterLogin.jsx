import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../Api/AxiosInstance';
import { toast } from 'react-toastify';
import { IoMdEyeOff } from 'react-icons/io';
import { FaRegEye } from 'react-icons/fa';
import './NewPasswordAfterLogin.css'; // <-- create and paste your CSS here

const NewPasswordAfterLogin = () => {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state.userId;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  async function generateNewPassword(e) {
    e.preventDefault();
    try {
      await AxiosInstance.put('/authentication/new-password', { userId, newPassword });
      toast.success('Password Updated Successfully');
    } catch (error) {
      toast.error('Failed to Update Password');
    } finally {
      setTimeout(() => {
        navigate('/login-page');
      }, 1000);
    }
  }

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <form onSubmit={generateNewPassword}>
          <h2>Update Password</h2>

          <label>User ID</label>
          <input type="text" value={userId} disabled />

          <label>New Password</label>
          <div className="password-box">
            <input
              type={showPassword ? 'text' : 'password'}
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

          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordAfterLogin;
