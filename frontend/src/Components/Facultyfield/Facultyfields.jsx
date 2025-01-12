import React, { useState } from 'react';
import { Allfields, Allbuttons } from '..';
import Nextwhite from '../../Assets/Nextwhite.svg'; 
import axios from 'axios'; // Import axios to handle the submission

function Facultyfields({ email, onClose }) {
  // Step 1: Initialize the formData state
  const [formData, setFormData] = useState({
    subject: '',
    handlingSemester: '',
    handlingDept: '',
    batch: ''
  });

  // Step 3: Submit the form data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Example API endpoint (replace with your backend endpoint)
      const response = await axios.put(`/api/faculty/update/${email}`, formData);
      console.log('Data submitted successfully:', response.data);

      // Optionally reset form
      setFormData({
        subject: '',
        handlingSemester: '',
        handlingDept: '',
        batch: ''
      });

      // Call the onClose function to close the form/modal
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div>
      {/* Step 4: Pass handleInputChange to update formData on input changes */}
      <Allfields
        fieldtype="text"
        value="Subject"
        inputname="subject"
        formData={formData}
        setFormData={setFormData}
      />
      <Allfields
        fieldtype="text"
        value="Semester"
        inputname="handlingSemester"
        formData={formData}
        setFormData={setFormData}
      />
      <Allfields
        fieldtype="text"
        value="Department"
        inputname="handlingDept"
        formData={formData}
        setFormData={setFormData}
      />
      <Allfields
        fieldtype="text"
        value="Batch"
        inputname="batch"
        formData={formData}
        setFormData={setFormData}
      />
      
      {/* Step 5: Add a submit button */}
      <Allbuttons  value="Submit" image={Nextwhite} target={handleSubmit}/>

    </div>
  );
}

export default Facultyfields;
