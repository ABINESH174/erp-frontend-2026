import { useEffect, useState } from 'react';
import './Loginpage.css';
import { Link, useNavigate } from 'react-router-dom';
import { Loginbutton } from '../../Components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { AuthService } from '../../Api/AuthService';



function Loginpage() {
  const [email, setEmail] = useState('');  // Changed setuserId to setUserId for convention
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  }, [])

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
    document.getElementById("password").focus();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await AuthService.login(email, password);
      console.log(response);
      if (response.status === 202) {
        try {
          toast.info("Register Yourself");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          switch (response.data.data.role) {
            case "STUDENT":
              navigate('/registration-form', { state: { userId: response.data.data.userId } })
              break;
            case "FACULTY":
              navigate('/faculty-registration', { state: { userId: response.data.data.userId } })
              break;
            default:
              navigate('/')
          }
        } catch (error) {
          toast.error("Invalid User ID or Password");
          console.log(error);
        }
      }

      if (response.status === 200) {
        const user = AuthService.getCurrentUser();
        if (response.data.firstTimePasswordResetFlag) {
          toast.info("Update Your Password")
          setTimeout(() => {
            navigate('/new-password-after-login', { state: { userId: user.userId } })
          }, 1500)
        } else {
        toast.success("Login Successful");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Current User in login page", user);
        if (user && user.userRole) {
          let redirectPath = "/";
          switch (user.userRole) {
            case "ROLE_STUDENT":
              redirectPath = "/profile-page";
              break;
            case "ROLE_FACULTY":
              redirectPath = "/faculty-dashboard";
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

        }
      } else {
        toast.error("Login failed ");
      }

    } catch (err) {
      console.error(err);
      toast.error("Invalid User ID or Password");
    }
  }


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
