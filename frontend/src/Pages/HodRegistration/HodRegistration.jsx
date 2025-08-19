import { useState } from 'react';
import './HodRegistration.css';
import { Allfields, Allbuttons } from '../../Components';
import { useNavigate, useLocation } from 'react-router-dom';
import Formtitle from '../../Components/Formtitle/Formtitle';
import { toast } from 'react-toastify';
import Nextwhite from '../../Assets/Nextwhite.svg';
import AxiosInstance from '../../Api/AxiosInstance';

function HodRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: location.state?.userId || '',
    mobileNumber: '',
    discipline: ''
  });

  const handleOtherField = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.post('/hod/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Form submitted:', response.data);
      toast.success("HOD Registered Successfully");
      await new Promise((res) => setTimeout(res, 1000));
      navigate('/login-page');
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
          <Allfields fieldtype="text" value="First Name" inputname="firstName" req_flag={true} formData={formData} setFormData={setFormData} />
          <Allfields fieldtype="text" value="Last Name" inputname="lastName" formData={formData} setFormData={setFormData} />
          <label>Email</label>
          <input type="email" value={formData.email} disabled />
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
            <Allbuttons value="submit" image={Nextwhite} />
          </div>
        </div>
      </form>
    </div>
  );
}

export default HodRegistration;
