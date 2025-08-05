import React, { useEffect, useState } from 'react';
import './Modal.css';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import { toast, ToastContainer } from 'react-toastify'; 
import Nextwhite from '../../Assets/Nextwhite.svg'; 
import Previouswhite from '../../Assets/Previouswhite.svg'; 
import Allbuttons from '../../Components/Allbuttons/Allbuttons'; 

const Modal = ({ student, onClose , userId}) => {
    
    const navigate = useNavigate(); 
    const [activeSection, setActiveSection] = useState("personal");
    const [editableStudent, setEditableStudent] = useState(student);
    
    useEffect(() => {
      
      if (!student) {
        setActiveSection("personal");
      }
    }, [student]);
    if (!student) return null;
  
    const handleSectionClick = (section) => {
      setActiveSection(section);
    };
  
    const getLinkStyle = (section) => {
      return activeSection === section
        ? { backgroundColor: "#007bff", color: "#fff" }
        : {};
    };

    const onSubmit = async () => {
      const method = userId != null ? 'put' : 'post';
      const url = userId != null ? `/api/student/update/${userId}` : '/api/student';
      
      try {
          const response = await axios({
              method,
              url,
              data: editableStudent,
              headers: { 'Content-Type': 'multipart/form-data' }
          });
  
          // localStorage.clear();
          
          if (userId != null) {
            console.log(response.data);
            toast("Student details updated Successfully");
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } else {
              console.log('Form submitted successfully:', response.data);
              toast("Registration Successful");
              await new Promise((resolve) => setTimeout(resolve, 1000));
              navigate('/login-page');
          }
      } catch (error) {
          console.error('Error submitting form:', error);
          toast.error(error.response?.data?.message || 'Something went wrong');
      } finally {
          onClose();
      }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableStudent({ ...editableStudent, [name]: value });
  };
  
    return (
      <div className="modal">
        <div className="modal_content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <h3>{student.firstName} Details</h3>
          <div className="modal_sections">
            <div className="modal_sidebar">
              <ul className="model_sidebar_items">
                <li
                  className="profile_links"
                  style={getLinkStyle("personal")}
                  //onClick={() => handleSectionClick("personal")}
                >
                  Personal Details
                </li>
                <li
                  className="profile_links"
                  style={getLinkStyle("communication_bank")}
                  //onClick={() => handleSectionClick("communication")}
                >
                  Communication & Bank Details
                </li>
                
                <li
                  className="profile_links"
                  style={getLinkStyle("education")}
                  //onClick={() => handleSectionClick("education")}
                >
                  Educational Details
                </li>
                <li
                  className="profile_links"
                  style={getLinkStyle("academic")}
                  //onClick={() => handleSectionClick("academic")}
                >
                  Academic Details
                </li>
               
              </ul>
            </div>
            <div className="modal_content_area">
              {activeSection === "personal" && (
                <div className="student_detail_section">
                  <table className="student_detail_table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>First Name:</strong>
                        </td>
                        <td>
                          {student.firstName} 
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Last Name:</strong>
                        </td>
                        <td>
                           {student.lastName}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Date of Birth:</strong>
                        </td>
                        <td>{student.dateOfBirth}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Gender:</strong>
                        </td>
                        <td>{student.gender}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Aadhar Number:</strong>
                        </td>
                        <td>{student.aadharNumber}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Blood Group:</strong>
                        </td>
                        <td>{student.bloodGroup}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Nationality:</strong>
                        </td>
                        <td>{student.nationality}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Religion:</strong>
                        </td>
                        <td>{student.religion}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Community:</strong>
                        </td>
                        <td>{student.community}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Caste:</strong>
                        </td>
                        <td>{student.caste}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Income:</strong>
                        </td>
                        <td> <input type="text" name="income" value={editableStudent.income} onChange={handleChange} /> </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Parents Status:</strong>
                        </td>
                        <td><input type="text" name="parentsStatus" value={editableStudent.parentsStatus} onChange={handleChange} /></td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Father's Name:</strong>
                        </td>
                        <td>{student.fathersName}</td>
                      </tr>
                      {student.fathersOccupation &&(
                        <tr>
                        <td>
                          <strong>Father's Occupation:</strong>
                        </td>
                        <td>{student.fathersOccupation}</td>
                      </tr>
                      )}
                      {student.fathersMobileNumber &&(
                        <tr>
                        <td>
                          <strong>Father's Mobile Number:</strong>
                        </td>
                        <td>{student.fathersMobileNumber}</td>
                      </tr>
                      )}
                      <tr>
                        <td>
                          <strong>Mother's Name:</strong>
                        </td>
                        <td>{student.mothersName}</td>
                      </tr>
                      {student.mothersOccupation &&(
                        <tr>
                        <td>
                          <strong>Mother's Occupation:</strong>
                        </td>
                        <td>{student.mothersOccupation}</td>
                      </tr>
                      )}
                      {student.mothersMobileNumber &&(
                        <tr>
                        <td>
                          <strong>Mother's Mobile Number:</strong>
                        </td>
                        <td>{student.mothersMobileNumber}</td>
                      </tr>
                      )}
                      {student.guardianName &&(
                        <tr>
                        <td>
                          <strong>Guardian's Name:</strong>
                        </td>
                        <td>{student.guardianName}</td>
                      </tr>
                      )}
                      {student.guardianOccupation &&(
                        <tr>
                        <td>
                          <strong>Guardian's Occupation:</strong>
                        </td>
                        <td>{student.guardianOccupation}</td>
                      </tr>
                      )}
                      {student.guardianMobileNumber &&(
                        <tr>
                        <td>
                          <strong>Guardian's Mobile Number:</strong>
                        </td>
                        <td>{student.guardianMobileNumber}</td>
                      </tr>
                      )}
                        <tr>
                        <td>
                          <strong>Marital Status:</strong>
                        </td>
                        <td>{student.maritalStatus}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className='registration_form_buttons' id="navigate_button_next_personal" >
                       <Allbuttons  value="Next" image={Nextwhite} target={() => handleSectionClick("communication_bank")}/>
                </div>
                </div>
              )}
              {activeSection === "communication_bank" && (
                <div className="student_detail_section">
                  <table className="student_detail_table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Mobile Number:</strong>
                        </td>
                        <td>{student.mobileNumber}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Email ID:</strong>
                        </td>
                        <td>{student.emailid}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Residential Address:</strong>
                        </td>
                        <td>{student.residentialAddress}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Communication Address:</strong>
                        </td>
                        <td>{student.communicationAddress}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Hosteller:</strong>
                        </td>
                        <td>{student.hosteller}</td>
                      </tr>
                      {student.hosteller==="Yes" &&(
                        <tr>
                        <td>
                          <strong>Hostel Type:</strong>
                        </td>
                        <td>{student.hostelType}</td>
                      </tr>
                      )}
                      <tr>
                        <td>
                          <strong>Bank Name:</strong>
                        </td>
                        <td>{student.bankName}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Branch Name:</strong>
                        </td>
                        <td>{student.branchName}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Account Number:</strong>
                        </td>
                        <td>{student.accountNumber}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>IFSC Code:</strong>
                        </td>
                        <td>{student.ifscCode}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className='registration_form_buttons' id="navigate_button_next_personal" >
               <Allbuttons   value="Previous" image={Previouswhite} target={() => handleSectionClick("personal")}/>
               <Allbuttons  value="Next" image={Nextwhite} target={() => handleSectionClick("education")}/>
                </div>
                </div>
              )}
              
              {activeSection === "education" && (
                <div className="student_detail_section">
                  <table className="student_detail_table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>SSLC:</strong>
                        </td>
                        <td>{student.sslc}</td>
                      </tr>
                      {student.hsc1Year &&(
                        <tr>
                        <td>
                          <strong>HSC 1 Year:</strong>
                        </td>
                        <td>{student.hsc1Year}</td>
                      </tr>
                      )}
                      {student.hsc2Year &&(
                        <tr>
                        <td>
                          <strong>HSC 2 Year:</strong>
                        </td>
                        <td>{student.hsc2Year}</td>
                      </tr>
                      )}
                      {student.diploma &&(
                        <tr>
                        <td>
                          <strong>Diploma:</strong>
                        </td>
                        <td>{student.diploma}</td>
                      </tr>
                      )}
                      <tr>
                        <td>
                          <strong>First Graduate:</strong>
                        </td>
                        <td>{student.firstGraduate}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>EMIS Number:</strong>
                        </td>
                        <td>{student.emisNumber}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Special Category:</strong>
                        </td>
                        <td>{student.specialCategory}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className='registration_form_buttons' id="navigate_button_next_personal" >
              <Allbuttons   value="Previous" image={Previouswhite} target={() => handleSectionClick("communication_bank")}/>
              <Allbuttons  value="Next" image={Nextwhite} target={() => handleSectionClick("academic")}/>
                </div>
                </div>
              )}
              {activeSection === "academic" && (
                <div className="student_detail_section">
                  <table className="student_detail_table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Register Number:</strong>
                        </td>
                        <td>{student.registerNo}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Programme:</strong>
                        </td>
                        <td>{student.programme}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Discipline:</strong>
                        </td>
                        <td>{student.discipline}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Course Completion Year:</strong>
                        </td>
                        <td>{student.batch}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Semester:</strong>
                        </td>
                        <td><input type="text" name="semester" value={editableStudent.semester} onChange={handleChange} /></td>
                      </tr>
                      <tr>
                        <td>
                          <strong>ABC ID:</strong>
                        </td>
                        <td>{student.abcId}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>UMIS ID:</strong>
                        </td>
                        <td>{student.umisId}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Date of Admission:</strong>
                        </td>
                        <td>{student.dateOfAdmission}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Course Joined Date:</strong>
                        </td>
                        <td>{student.courseJoinedDate}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Course Type:</strong>
                        </td>
                        <td>{student.courseType}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Regulation:</strong>
                        </td>
                        <td>{student.regulation}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>CGPA:</strong>
                        </td>
                        <td>{student.cgpa}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Student Status:</strong>
                        </td>
                        <td><input type="text" name="studentStatus" value={editableStudent.studentStatus} onChange={handleChange} /></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className='registration_form_buttons' id="navigate_button_next_personal" >
              <Allbuttons   value="Previous" image={Previouswhite} target={() => handleSectionClick("education")}/>
              <Allbuttons  value="Submit" image={Nextwhite} target={   onSubmit}/>
              <ToastContainer />
              </div>
              </div>
                
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Modal;