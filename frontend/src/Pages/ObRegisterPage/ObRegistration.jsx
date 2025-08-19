import { useState } from 'react';
import './ObRegistration.css';
import { Allfields, Allbuttons } from '../../Components';
import { useLocation, useNavigate } from 'react-router-dom';
import Formtitle from '../../Components/Formtitle/Formtitle';
import { toast } from 'react-toastify';
import Nextwhite from '../../Assets/Nextwhite.svg';
import AxiosInstance from '../../Api/AxiosInstance';

function ObRegistration() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: location.state?.userId || '',
    handlingPurpose: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.post('/office-bearer/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('OB Registered:', response.data);
      toast.success("Office Bearer Registered Successfully");
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
          <Allfields fieldtype="text" value="Name" inputname="name" req_flag={true} formData={formData} setFormData={setFormData} />

          <label>Email</label>
          <input type="email" value={formData.email} disabled />

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
            <select name="handlingPurpose" className='dropdown' value={formData.handlingPurpose || ''} onChange={handleChange} required>
              <option value=''>Select</option>
              <option value="Bonafide">Bonafide</option>
            </select>
          </div>

          <div id="ob_form_submit_button">
            <Allbuttons value="submit" image={Nextwhite} />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ObRegistration;
