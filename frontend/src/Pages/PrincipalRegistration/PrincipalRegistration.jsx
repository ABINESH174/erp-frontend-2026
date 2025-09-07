import { useState } from 'react';

import { Allfields, Allbuttons } from '../../Components';
import { useLocation, useNavigate } from 'react-router-dom';
import Formtitle from '../../Components/Formtitle/Formtitle';
import { toast, ToastContainer } from 'react-toastify';
import Nextwhite from '../../Assets/Nextwhite.svg';
import AxiosInstance from '../../Api/AxiosInstance';
import './PrincipalRegistration.css'
import { isValidAadharNumber, isValidAlphabets, isValidEmail, isValidMobileNumber } from '../../Utility/Validator';

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

  const validatePrincipalRegistration = () => {
    const requiredFields = [
      { field: formData.firstName, name: "First Name", validate: isValidAlphabets, errorMessage: "should contain only alphabets" },
      { field: formData.lastName, name: "Last Name", validate: isValidAlphabets, errorMessage: "should contain only alphabets" },
      { field: formData.email, name: "Email ID", validate: isValidEmail, errorMessage: "should be a valid email address" },
      { field: formData.aadharNumber, name: "Aadhar Number", validate: isValidAadharNumber, errorMessage: "should contain 12 digits " },
      { field: formData.mobileNumber, name: "Mobile Number", validate: isValidMobileNumber, errorMessage: "should contain only 10 digits and should be valid" }
    ];
    if (!validateFields(requiredFields)) {
      return false;
    }
    return true;
  };

  const validateFields = (fields) => {
    for (let { field, name, validate, errorMessage } of fields) {
      if (!field) {
        toast.error(`${name} is required.`);
        return false;
      }

      if (validate && !validate(field)) {
        toast.error(`${name} ${errorMessage}.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePrincipalRegistration()) {
      return;
    }
    try {
      await AxiosInstance.post('/principal/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success("Registration Successfull");
      setTimeout(() => {
        navigate("/login-page")
      }, 1500);
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  return (
    <div>
      <form className="principal_registration_form" onSubmit={handleSubmit}>
        <Formtitle />
        <div className="principal_registration_container">
          <Allfields fieldtype="text" value="First Name" inputname="firstName" req_flag={true} formData={formData} setFormData={setFormData} onlyUpperCase={true} />
          <Allfields fieldtype="text" value="Last Name" inputname="lastName" formData={formData} setFormData={setFormData} onlyUpperCase={true} />

          <label>Email</label>
          <input type="email" value={formData.email} disabled />

          <Allfields fieldtype="text" value="Aadhar Number" inputname="aadharNumber" req_flag={true} formData={formData} setFormData={setFormData} />
          <Allfields fieldtype="text" value="Mobile Number" inputname="mobileNumber" req_flag={true} formData={formData} setFormData={setFormData} />


          <div id="principal_form_submit_button">
            <Allbuttons value="submit" type="submit" image={Nextwhite} />
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}




export default PrincipalRegistration;
