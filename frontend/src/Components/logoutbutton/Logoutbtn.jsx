import React from 'react'
import './Logoutbtn.css';
import { useNavigate } from 'react-router-dom';
import { RiLogoutCircleLine } from "react-icons/ri";


const Logoutbtn = () => {
    const navigate = useNavigate();
  return (
    <div>
        
<button class="logout-Btn"  onClick={()=> navigate('/Login-page')}> 
  
 <RiLogoutCircleLine /> Logout 
</button>



    </div>
  )
}

export default Logoutbtn