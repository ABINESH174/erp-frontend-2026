import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import './ForgotPassword.css';
import AxiosInstance from '../../Api/AxiosInstance';

const GetOtp = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AxiosInstance.get('/authentication/get-otp', {
        params: { userEmail: email }
      });
      toast.success("OTP Sent to Email Successfully");
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1500);
    } catch {
      setTimeout(() => {
        navigate('/login-page');
      }, 1500);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <form onSubmit={getOtp}>
          <h2>Forgot Password</h2>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading} // disable input while loading
          />
          <button type="submit" disabled={loading}>
  {loading ? <span className="spinner"></span> : "Get OTP"}
</button>

        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GetOtp;
