import React, { useEffect, useState } from 'react';
import axios from "axios";
import './Loginpage.css';
import { Link, useNavigate } from 'react-router-dom';
import { Loginbutton } from '../../Components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { clgimage } from '../../Assets/clgimage.jpg';
import AxiosInstance from '../../Api/AxiosInstance';
import { getCurrentUser, logoutUser } from '../../Api/AuthService';
import { getStudentByRegisterNo } from '../../Api/StudentService';
import { getFacultyByEmail } from '../../Api/FacultyService';



function Loginpage() {
  const [email, setEmail] = useState('');  // Changed setuserId to setUserId for convention
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function resetCookie() {
      try {
        const res = await logoutUser();
      } catch(err) {
        console.log(err);
      }
    }
    resetCookie();
  } ,[])

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
    document.getElementById("password").focus();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await AxiosInstance.post(`/authentication/authenticate`, { email, password });
      console.log(res);
      if (res.status === 202) {
        try {
          toast.info("Register Yourself");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        switch (res.data.data.role) {
          case "STUDENT":
            navigate('/registration-form', { state: { userId : res.data.data.userId } })
            break;
          case "FACULTY":
            navigate('/faculty-registration', { state: { userId : res.data.data.userId } })
            break;
          default:
            navigate('/')
        }
        } catch (error) {
            toast.error("Invalid User ID or Password");
            console.log(error);
        }
      }

      if (res.status === 200) {
        toast.success("Login Successful");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const user = await getCurrentUser();

        if(user && user.role) {
          let redirectPath = "/";
          switch (user.role) {
            case "ROLE_STUDENT":
              const student = await getStudentByRegisterNo(user.userId);
              if(student===null || student.firstName === null ) {
                redirectPath = "/registration-form"
              } else {
                redirectPath = "/profile-page";
              }
              break;
            case "ROLE_FACULTY":
              redirectPath = (await getFacultyByEmail(user.userId) === null)? "/faculty-registration":"/faculty-dashboard";
              break;
            case "ROLE_HOD":
              redirectPath = "/hod-dashboard";
              break;
            case "ROLE_OB":
              redirectPath = "/office-bearer-dashboard";
              break;
            case "ROLE_PRINCIPAL":
              redirectPath = "/principal-dashboard";
              break;
            default:
              redirectPath = "/";
          }
          navigate(redirectPath, { state: { userId: user.userId } });
        } else {
          toast.error("Unable to fetch user details ");
        }
      } else {
        toast.error("Login failed ");
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid User ID or Password");
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
                value={email}   // Added value to userId input
                onChange={e => setEmail(e.target.value)}
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
              <p className="forgot-link">
                <Link to="/forgot-password">Forgot Password?</Link>
              </p>

            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Loginpage;
