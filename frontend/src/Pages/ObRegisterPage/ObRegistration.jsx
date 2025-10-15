import { useState } from 'react';
import './ObRegistration.css';
import { Allfields, Allbuttons } from '../../Components';
import { useLocation, useNavigate } from 'react-router-dom';
import Formtitle from '../../Components/Formtitle/Formtitle';
import { toast, ToastContainer } from 'react-toastify';
import Nextwhite from '../../Assets/Nextwhite.svg';
import AxiosInstance from '../../Api/AxiosInstance';
import { isValidAadharNumber, isValidAlphabets, isValidEmail, isValidMobileNumber } from '../../Utility/Validator';

function ObRegistration() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: location.state?.userId || '',
    aadharNumber: '',
    mobileNumber: '',
    handlingPurpose: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateObRegistration = () => {
    const requiredFields = [
      { field: formData.name, name: "Name", validate: isValidAlphabets, errorMessage: "should contain only alphabets" },
      { field: formData.email, name: "Email ID", validate: isValidEmail, errorMessage: "should be a valid email address" },
      { field: formData.aadharNumber, name: "Aadhar Number", validate: isValidAadharNumber, errorMessage: "should contain 12 digits " },
      { field: formData.mobileNumber, name: "Mobile Number", validate: isValidMobileNumber, errorMessage: "should contain only 10 digits and should be valid" },
      { field: formData.handlingPurpose, name: "HandlingPurpose"}
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

      if (!formData.handlingPurpose) {
        toast.error("Handling purpose is required.");
        return false;
      }

    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateObRegistration()) {
      return;
    }
    try {
      const response = await AxiosInstance.post('/office-bearer/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('OB Registered:', response.data);
      toast.success("Registration Successful");
      await new Promise((res) => setTimeout(res, 1000));
      navigate('/login-page');
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    }
  };

  return (
    <div>
      <form className="ob_registration_form" onSubmit={handleSubmit}>
        <Formtitle />
        <div className="ob_registration_container">
          <Allfields fieldtype="text" value="Name" inputname="name" req_flag={true} formData={formData} setFormData={setFormData} onlyUpperCase={true} />
          <Allfields fieldtype="text" value="Aadhar Number" inputname="aadharNumber" req_flag={true} formData={formData} setFormData={setFormData} />

          <label>Email</label>
          <input type="email" value={formData.email} disabled />
          <Allfields fieldtype="text" value="Mobile Number" inputname="mobileNumber" req_flag={true} formData={formData} setFormData={setFormData} />

          <div className="ob_purpose_field">
            <label htmlFor="handlingPurpose">Handling Purpose</label>
            {/* <input
              type="text"
              name="handlingPurpose"
              value={formData.handlingPurpose}
              onChange={handleChange}
              required
            />
          </div> */}
          <select name='handlingPurpose' className='dropdown' value={formData.handlingPurpose || ''} onChange={handleChange} required>
            <option value=''>Select</option>
            <option value='BONAFIDE_TYPE_SECTION_B'>Bonafide-Type B</option>
            <option value='BONAFIDE_TYPE_SECTION_S'>Bonafide-Type S</option>
          </select>
          </div>

          <div id="ob_form_submit_button">
            <Allbuttons value="submit" image={Nextwhite} />
          </div>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
}

export default ObRegistration;
