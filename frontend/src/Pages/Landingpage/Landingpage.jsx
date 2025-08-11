import './Landingpage.css';
import loginicon from '../../Assets/login1.svg';
import Footer from '../../Components/Footer/Footer';
import Allbuttons from '../../Components/Allbuttons/Allbuttons';
import Header from '../../Components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

function Landingpage() {
  const navigate = useNavigate();
  const goToLoginpage = () => navigate('/login-page');

  return (
    <div>
      <Header />

      <div className="landingpage-container">
        <div className="nav">
          <Allbuttons className="login-button" target={goToLoginpage} value="Login" image={loginicon} />
        </div>
      </div>

      <div className="hero-section">
        <h1>Empowering Education with Smart ERP</h1>
        <p className="subheading">
          Revolutionizing campus administration and academics with a centralized, efficient ERP system.
        </p>
      </div>

      <div className="sections-grid">
        <div className="section-block">
          <h2>About Us</h2>
          <p>
            Our ERP solution simplifies and automates daily institutional operations, enabling educators to teach and students to learn efficiently.
          </p>
        </div>

        <div className="section-block">
          <h2>Features to be Added</h2>
          <ul>
            <li>Student Attendance Management</li>
            <li>Fee Payment Tracking</li>
            <li>Assignment Uploads & Tracking</li>
            <li>Leave Applications</li>
            <li>Library Management</li>
            <li>Timetable Scheduling</li>
          </ul>
        </div>

        <div className="section-block">
          <h2>Contact Us</h2>
          <p><FaEnvelope /> erp@gmail.com</p>
          <p><FaPhoneAlt /> +91 8989787844 | 044 6874988</p>
          <div className="social-icons-in-block">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /> Facebook</a> 
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /> LinkedIn</a>
          </div>
        </div>

        <div className="section-block">
          <h2>Our Vision</h2>
          <p>
            To digitally transform educational institutions through innovation, making administrative tasks seamless and transparent.
          </p>
        </div>
      </div>

      <div className="empty"></div>

      <Footer />
    </div>
  );
}

export default Landingpage;