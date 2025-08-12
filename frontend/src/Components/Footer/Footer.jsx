import React from 'react';
import './Footer.css';
import { FaFacebookF, FaLinkedinIn, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h4>Address</h4>
          <p>College Road,<br />Karaikudi-636003,<br />Sivagangai.</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p><FaEnvelope /> erp@gmail.com</p>
          <p><FaPhoneAlt /> +91 8989787844</p>
          <p><FaPhoneAlt /> 044 6874988</p>
        </div>
        <div>
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF /> Facebook
            </a><br />
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn /> LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 Your ERP. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
