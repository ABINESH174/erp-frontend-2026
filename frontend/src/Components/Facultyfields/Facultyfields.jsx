import React, { useState } from 'react';
import './Facultyfields.css'
import { Allfields, Allbuttons } from '..';
import Nextwhite from '../../Assets/Nextwhite.svg'; 
import axios from 'axios'; 

function Facultyfields({ onClose }) {

  const [formData, setFormData] = useState({
    Name: '',
    RegisterNumber: '',
    MobileNumber: '',
    MailId: '',
    AadharNumber: '',
  });

  const handleOtherField = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    localStorage.setItem('formData', JSON.stringify(updatedFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
/*       const response = await axios.put(`/api/faculty/update/${email}`, formData);
      console.log('Data submitted successfully:', response.data); */
      
      setFormData({
        Name: '',
        RegisterNumber: '',
        MobileNumber: '',
        MailId: '',
        AadharNumber: '',
      });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  return (
    <div className="faculty_fields_container">
      
     <div>
     <span className="close" onClick={onClose}>
            &times;
          </span>
     </div>

{/*      <div className="discipline">
              <label htmlFor="discipline">Department</label>
              <select className="dropdown" name="handlingDept"  value={formData.handlingDept || ''} onChange={handleOtherField}>
                <option value=''>Select</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Mechanical Engineering" >Mechanical Engineering</option>
                <option value="Electrical and Electronics Engineering" >Electrical and Electronics Engineering</option>
                <option value="Electronics and communication Engineering" >Electronics and communication Engineering</option>
                <option value="Computer Science and Engineering" >Computer Science and Engineering</option>
                <option value="Structural Engineering" >Structural Engineering</option>
                <option value="Environmental Engineering" >Environmental Engineering</option>
                <option value="Manufacturing Engineering" >Manufacturing Engineering</option>
                <option value="Computer Aided Design" >Computer Aided Design</option>
                <option value="Power Electronics and Drives" >Power Electronics and Drives</option>
                <option value="Microwave and Optical Communication" >Microwave and Optical Communication</option>
              </select>
            </div>
            <div className="semester">
              <label htmlFor="semester">Semester</label>
              <select className="dropdown" name="handlingSemester"  value={formData.handlingSemester || ''} onChange={handleOtherField}>
                <option value=''>Select</option>
                <option value="I" >I</option>
                <option value="II" >II</option>
                <option value="III" >III</option>
                <option value="IV" >IV</option>
                <option value="V" >V</option>
                <option value="VI" >VI</option>
                <option value="VII" >VII</option>
                <option value="VIII" >VIII</option>
              </select>
            </div> */}
      <div>
      <Allfields
        fieldtype="text"
        value="Name"
        inputname="Name"
        formData={formData}
        setFormData={setFormData}
      />
      </div>

      <div>
      <Allfields
        fieldtype="text"
        value="Register Number"
        inputname="RegisterNumber"
        formData={formData}
        setFormData={setFormData}
      />
      </div>
      <div>
      <Allfields
        fieldtype="text"
        value="Mobile Number"
        inputname="MobileNumber"
        formData={formData}
        setFormData={setFormData}
      />
      </div>
      <div>
      <Allfields
        fieldtype="text"
        value="Mail Id"
        inputname="MailId"
        formData={formData}
        setFormData={setFormData}
      />
      </div>
      <div>
      <Allfields
        fieldtype="text"
        value="Aadhar Number"
        inputname="AadharNumber"
        formData={formData}
        setFormData={setFormData}
      />
      </div>
      
      <div id="faculty_field_button">
      <Allbuttons  value="Submit" image={Nextwhite} target={handleSubmit}/>
      </div>
    </div>
  );
}
export default Facultyfields;