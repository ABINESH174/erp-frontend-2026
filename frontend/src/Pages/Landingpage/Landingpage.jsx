import React from 'react';
import './Landingpage.css';
import loginicon from '../../Assets/login1.svg'
import Footer from '../../Components/Footer/Footer';
import Allbuttons from '../../Components/Allbuttons/Allbuttons';
import Header from '../../Components/Header/Header'
import {useNavigate } from 'react-router-dom';

function Landingpage() {
  const navigate = useNavigate();

  const goToLoginpage = () => {
    navigate('/login-page');
  };
  return (

    <div>
    <Header />
    
    <div class="landingpage-container">
        <div class="nav">
            <Allbuttons className="login-button" target={goToLoginpage} value="Login" image={loginicon}/>
        </div>
    </div>
    <div className="empty"></div>
    
    <Footer />
    
    </div>
  )
}

export default Landingpage