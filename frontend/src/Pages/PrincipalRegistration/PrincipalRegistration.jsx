import { useState } from 'react';

import { Allfields, Allbuttons } from '../../Components';
import { useLocation, useNavigate } from 'react-router-dom';
import Formtitle from '../../Components/Formtitle/Formtitle';
import { toast } from 'react-toastify';
import Nextwhite from '../../Assets/Nextwhite.svg';
import AxiosInstance from '../../Api/AxiosInstance';
import './PrincipalRegistration.css'

function PrincipalRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: location.state?.userId || '',
    aadharNumber: '',
    mobileNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.post('/principal/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Form submitted:', response.data);
      toast.success("Principal Registered Successfully");
      await new Promise((res) => setTimeout(res, 1000));
      navigate('/login-page');
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    }
  };

  return (
    <div>
      <form className="principal_registration_form" onSubmit={handleSubmit}>
        <Formtitle />
        <div className="principal_registration_container">
          <Allfields fieldtype="text" value="First Name" inputname="firstName" req_flag={true} formData={formData} setFormData={setFormData} />
          <Allfields fieldtype="text" value="Last Name" inputname="lastName" formData={formData} setFormData={setFormData} />
          
          <label>Email</label>
          <input type="email" value={formData.email} disabled />

          <Allfields fieldtype="text" value="Aadhar Number" inputname="aadharNumber" req_flag={true} formData={formData} setFormData={setFormData} />
          <Allfields fieldtype="text" value="Mobile Number" inputname="mobileNumber" req_flag={true} formData={formData} setFormData={setFormData} />


          <div id="principal_form_submit_button">
            <Allbuttons value="submit" image={Nextwhite} />
          </div>
        </div>
      </form>
    </div>
  );
}

export default PrincipalRegistration;
