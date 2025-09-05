import { useState } from 'react';
import './HodRegistration.css';
import { Allfields, Allbuttons } from '../../Components';
import { useNavigate, useLocation } from 'react-router-dom';
import Formtitle from '../../Components/Formtitle/Formtitle';
import { toast, ToastContainer } from 'react-toastify';
import Nextwhite from '../../Assets/Nextwhite.svg';
import AxiosInstance from '../../Api/AxiosInstance';
import { isValidAadharNumber, isValidAlphabets, isValidEmail, isValidMobileNumber } from '../../Utility/Validator';

function HodRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: location.state?.userId || '',
    mobileNumber: '',
    aadharNumber: '',
    discipline: ''
  });

  const handleOtherField = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateHodRegistration = () => {
    const requiredFields = [
      { field: formData.firstName, name: "First Name", validate: isValidAlphabets, errorMessage: "should contain only alphabets" },
      { field: formData.lastName, name: "Last Name", validate: isValidAlphabets, errorMessage: "should contain only alphabets" },
      { field: formData.email, name: "Email ID", validate: isValidEmail, errorMessage: "should be a valid email address" },
      { field: formData.aadharNumber, name: "Aadhar Number", validate: isValidAadharNumber, errorMessage: "should contain 12 digits " },
      { field: formData.mobileNumber, name: "Mobile Number", validate: isValidMobileNumber, errorMessage: "should contain only 10 digits and should be valid" },
      { field: formData.discipline, name: "Discipline"}
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

      if (!formData.discipline) {
        toast.error("Discipline is required.");
        return false;
      }

    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateHodRegistration()) {
      return;
    }
    try {
      await AxiosInstance.post('/hod/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success("Registration Successfull");
      setTimeout(() => {
        navigate("/login-page")
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    }
  };

  return (
    <div>
      <form className="hod_registration_form" onSubmit={handleSubmit}>
        <Formtitle />
        <div className="hod_registration_container">
          <Allfields fieldtype="text" value="First Name" inputname="firstName" req_flag={true} formData={formData} setFormData={setFormData} onlyUpperCase={true}/>
          <Allfields fieldtype="text" value="Last Name" inputname="lastName" formData={formData} setFormData={setFormData} onlyUpperCase={true}/>
          <label>Email</label>
          <input type="email" value={formData.email} disabled />
          <Allfields fieldtype="text" value="Aadhar Number" inputname="aadharNumber" req_flag={true} formData={formData} setFormData={setFormData} />
          <Allfields fieldtype="text" value="Mobile Number" inputname="mobileNumber" req_flag={true} formData={formData} setFormData={setFormData} />
          
          <div className="hod_discipline">
            <label htmlFor="discipline">Discipline</label>
            <select name="discipline" className='dropdown' value={formData.discipline} onChange={handleOtherField} required>
              <option value="">Select</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
              <option value="Electronics and communication Engineering">Electronics and communication Engineering</option>
              <option value="Computer Science and Engineering">Computer Science and Engineering</option>
              <option value="Department of Physics">Department of Physics</option>
              <option value="Department of Chemistry">Department of Chemistry</option>
              <option value="Department of Mathematics">Department of Mathematics</option>
              <option value="Department of English">Department of English</option>
              <option value="Department of Tamil">Department of Tamil</option>
              <option value="Department of Physical Education">Department of Physical Education</option>
            </select>
          </div>

          <div id="hod_form_submit_button">
            <Allbuttons value="submit" image={Nextwhite} type="submit" />
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default HodRegistration;
