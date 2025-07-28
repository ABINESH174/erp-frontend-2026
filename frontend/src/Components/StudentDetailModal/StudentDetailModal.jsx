import React, { useState } from 'react';
import './StudentDetailModal.css';

function StudentDetailModal({ student, onClose }) {
  const [activeSection, setActiveSection] = useState('personal');

  if (!student) return null;

  const getLinkStyle = (section) =>
    activeSection === section ? { backgroundColor: '#007bff', color: '#fff' } : {};

  return (
    <div className="student-modal-overlay">
      <div className="student-modal-container">
        <div className="student-modal-header">
          <h2>{student.firstName}'s Details</h2>
          <button className="student-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="student-modal-body">
          <div className="student-modal-sidebar">
            <ul>
              <li style={getLinkStyle("personal")} onClick={() => setActiveSection('personal')}>Personal</li>
              <li style={getLinkStyle("communication")} onClick={() => setActiveSection('communication')}>Communication</li>
              <li style={getLinkStyle("education")} onClick={() => setActiveSection('education')}>Education</li>
              <li style={getLinkStyle("academic")} onClick={() => setActiveSection('academic')}>Academic</li>
            </ul>
          </div>

          <div className="student-modal-content-area">
            {activeSection === 'personal' && (
              <table>
                <tbody>
                  <tr><td>First Name:</td><td>{student.firstName}</td></tr>
                  <tr><td>Last Name:</td><td>{student.lastName}</td></tr>
                  <tr><td>Gender:</td><td>{student.gender}</td></tr>
                  <tr><td>Date of Birth:</td><td>{student.dateOfBirth}</td></tr>
                  <tr><td>Aadhar Number:</td><td>{student.aadharNumber}</td></tr>
                  <tr><td>Blood Group:</td><td>{student.bloodGroup}</td></tr>
                  <tr><td>Nationality:</td><td>{student.nationality}</td></tr>
                  <tr><td>Religion:</td><td>{student.religion}</td></tr>
                  <tr><td>Community:</td><td>{student.community}</td></tr>
                  <tr><td>Caste:</td><td>{student.caste}</td></tr>
                  <tr><td>Income:</td><td>{student.income}</td></tr>
                  <tr><td>Parents Status:</td><td>{student.parentsStatus}</td></tr>
                  <tr><td>Father's Name:</td><td>{student.fathersName}</td></tr>
                  <tr><td>Mother's Name:</td><td>{student.mothersName}</td></tr>
                  <tr><td>Marital Status:</td><td>{student.maritalStatus}</td></tr>
                </tbody>
              </table>
            )}

            {activeSection === 'communication' && (
              <table>
                <tbody>
                  <tr><td>Mobile:</td><td>{student.mobileNumber}</td></tr>
                  <tr><td>Email:</td><td>{student.emailid}</td></tr>
                  <tr><td>Residential Address:</td><td>{student.residentialAddress}</td></tr>
                  <tr><td>Communication Address:</td><td>{student.communicationAddress}</td></tr>
                  <tr><td>Hosteller:</td><td>{student.hosteller}</td></tr>
                  {student.hosteller === "Yes" && (
                    <tr><td>Hostel Type:</td><td>{student.hostelType}</td></tr>
                  )}
                  <tr><td>Bank Name:</td><td>{student.bankName}</td></tr>
                  <tr><td>Branch:</td><td>{student.branchName}</td></tr>
                  <tr><td>Account No:</td><td>{student.accountNumber}</td></tr>
                  <tr><td>IFSC:</td><td>{student.ifscCode}</td></tr>
                </tbody>
              </table>
            )}

            {activeSection === 'education' && (
              <table>
                <tbody>
                  <tr><td>SSLC:</td><td>{student.sslc}</td></tr>
                  {student.hsc1Year && <tr><td>HSC 1st Yr:</td><td>{student.hsc1Year}</td></tr>}
                  {student.hsc2Year && <tr><td>HSC 2nd Yr:</td><td>{student.hsc2Year}</td></tr>}
                  {student.diploma && <tr><td>Diploma:</td><td>{student.diploma}</td></tr>}
                  <tr><td>First Graduate:</td><td>{student.firstGraduate}</td></tr>
                  <tr><td>EMIS Number:</td><td>{student.emisNumber}</td></tr>
                  <tr><td>Special Category:</td><td>{student.specialCategory}</td></tr>
                </tbody>
              </table>
            )}

            {activeSection === 'academic' && (
              <table>
                <tbody>
                  <tr><td>Register No:</td><td>{student.registerNo}</td></tr>
                  <tr><td>Programme:</td><td>{student.programme}</td></tr>
                  <tr><td>Discipline:</td><td>{student.discipline}</td></tr>
                  <tr><td>Semester:</td><td>{student.semester}</td></tr>
                  <tr><td>Batch:</td><td>{student.batch}</td></tr>
                  <tr><td>Date of Admission:</td><td>{student.dateOfAdmission}</td></tr>
                  <tr><td>ABC ID:</td><td>{student.abcId}</td></tr>
                  <tr><td>UMIS ID:</td><td>{student.umisId}</td></tr>
                  <tr><td>Course Type:</td><td>{student.courseType}</td></tr>
                  <tr><td>Regulation:</td><td>{student.regulation}</td></tr>
                  <tr><td>CGPA:</td><td>{student.cgpa}</td></tr>
                  <tr><td>Status:</td><td>{student.studentStatus}</td></tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailModal;
