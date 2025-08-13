import React, { useState } from 'react';
import './Facultyfields.css';
import { Allfields, Allbuttons } from '..';
import Nextwhite from '../../Assets/Nextwhite.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from '../../Api/AxiosInstance';
import { AuthService } from '../../Api/AuthService';

function Facultyfields({ onClose, fields = [], role }) {
  // Initialize form data
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.inputname] = '';
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Validation logic
  const validate = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.inputname].trim();

      if (!value) {
        newErrors[field.inputname] = `${field.label} should not be empty`;
      }
      if (field.inputname === 'AadharNumber' && !/^\d{12}$/.test(value)) {
        newErrors[field.inputname] = 'Aadhar Number should be 12 digits';
      }
      if (field.inputname === 'MobileNumber' && !/^\d{10}$/.test(value)) {
        newErrors[field.inputname] = 'Mobile Number should be 10 digits';
      }
      if (field.inputname === 'MailId') {
        if (!value.endsWith('@gmail.com') || !/^\S+@gmail\.com$/.test(value)) {
          newErrors[field.inputname] = 'Please enter a valid Gmail ID';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please correct the highlighted errors.');
      return;
    }

    try {
      const currentUser = AuthService.getCurrentUser();
      const userId =
        role === 'STUDENT'
          ? formData.RegisterNumber
          : formData.MailId;
      const password = formData.AadharNumber;
      const payload = { userId, password, role };

      let response;
      if (role === 'STUDENT') {
        response = await AxiosInstance.post(
          `/authentication/create/student/${currentUser.userId}`,
          payload
        );
      } else {
        response = await AxiosInstance.post(
          `/authentication/create`,
          payload
        );
      }

      toast.success(`${role} added successfully`);
      console.log('Data submitted successfully:', response.data);

      setFormData(initialFormData);

      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('Submission failed');
    }
  };

  return (
    <div className="faculty-fields-overlay">
    <div className="faculty_fields_containers">
      <div>
        <span className="close" onClick={onClose}>
          &times;
        </span>
      </div>

      {fields.map((field) => (
        <div key={field.inputname}>
          <Allfields
            fieldtype={field.fieldtype}
            value={field.label}
            inputname={field.inputname}
            formData={formData}
            setFormData={setFormData}
          />
          <div
            style={{
              color: 'red',
              fontSize: '12px',
              marginTop: '4px',
              minHeight: '16px',
              visibility: errors[field.inputname]
                ? 'visible'
                : 'hidden'
            }}
          >
            * {errors[field.inputname] || ''}
          </div>
        </div>
      ))}

      <div id="faculty_field_button">
        <Allbuttons
          value="Submit"
          image={Nextwhite}
          target={handleSubmit}
        />
      </div>

      <ToastContainer />
    </div>
    </div>
  );
}

export default Facultyfields;
