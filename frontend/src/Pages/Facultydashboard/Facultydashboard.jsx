import React, { useEffect, useState, useCallback } from 'react';
import './Facultydashboard.css';
import { FaFileAlt } from 'react-icons/fa';
import { BsPerson } from 'react-icons/bs';
import { Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';

import Header from '../../Components/Header/Header.jsx';
import Footer from '../../Components/Footer/Footer.jsx';
import Modal from '../../Components/Modal/Modal.jsx';
import Allbuttons from '../../Components/Allbuttons/Allbuttons.jsx';
import Facultyfields from '../../Components/Facultyfields/Facultyfields.jsx';
import Logoutbtn from '../../Components/logoutbutton/Logoutbtn.jsx';

import Profileicon from '../../Assets/profile.svg';
import View from '../../Assets/eyewhite.svg';
import Add from '../../Assets/add.svg';
import Logout from '../../Assets/logout.svg';
import stud from '../../Assets/studenticondash.svg';
import BonafideCount from '../../Components/BonafideCounter/BonafideCount.jsx';

function Facultydashboard() {
  const [faculty, setFaculty] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openAddClassModal, setOpenAddClassModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openExportPopup, setOpenExportPopup] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    firstName: true,
    registerNo: true,
    emailid: true,
    mobileNumber: false,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const facultyId = location.state.userId;

  const fetchFaculty = useCallback(async () => {
    try {
      const response = await axios.get(`/api/faculty/${facultyId}`);
      setFaculty(response.data.data);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setLoading(false);
    }
  }, [facultyId]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const handleLogoutClick = () => {
    navigate('/login-page');
  };

  const handleItemClick = useCallback(async (className, batchYear) => {
    try {
      const queryParams = new URLSearchParams({
        email: facultyId,
        className,
        batchYear,
      });

      const response = await axios.get(`/api/faculty/filter?${queryParams.toString()}`);
      setFaculty(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [facultyId]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFieldChange = (event) => {
    const { name, checked } = event.target;
    setSelectedFields((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleExport = () => {
    if (!faculty || !faculty.students) return;

    const filteredStudents = faculty.students.map(student => {
      return Object.keys(selectedFields).reduce((acc, field) => {
        if (selectedFields[field]) {
          acc[field] = student[field];
        }
        return acc;
      }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Student_Details.xlsx");
    setOpenExportPopup(false);
  };

  const Card = ({ title, items: [subject, dept, batchYear, semester] }) => (
    <div className="card" onClick={() => handleItemClick(dept, batchYear)}>
      <h3>{title}</h3><br />
      <div className="class_card_items">
        <ul className='carditem_container'>
          <div className='dept_batch'>
            <li id='dept'>{dept || 'N/A'}</li>
            <li id='batchYear'>{batchYear || 'N/A'}</li>
          </div><br />
          <div className='sub_sem'>
            <li id='subject'>{subject || 'N/A'}</li>
            <li id='semester'>{semester || 'N/A'}</li>
          </div>
        </ul>
      </div>
    </div>
  );

  const handleViewClick = (student) => {
    setSelectedStudent(student);
    setOpenModal(true);
    setOpenProfile(false);
  };

  const closeModal = () => {
    setOpenModal(false);
    setOpenAddClassModal(false);
    setSelectedStudent(null);
    fetchFaculty();
  };

  const toggleProfile = () => {
    setOpenProfile(!openProfile);
    setOpenModal(false);
  };

  if (loading) return <p>Loading faculty data...</p>;
  if (!faculty) return <p>No faculty data available.</p>;

  const subjectList = faculty.subject ? faculty.subject.split('#') : [];
  const semesterList = faculty.handlingSemester ? faculty.handlingSemester.split('#') : [];
  const deptList = faculty.handlingDept ? faculty.handlingDept.split('#') : [];
  const batchList = faculty.batch ? faculty.batch.split('#') : [];
  const maxLength = Math.max(subjectList.length, semesterList.length, deptList.length, batchList.length);

  return (
    <div>
      <Header />
      <div className="parent">
        <div className="full-container">
          <p className="faculty-heading-tag">faculty dashboard</p>
          <div className="faculty-side">
            <div className="faculty-profile-bar" onClick={toggleProfile}>
              <BsPerson /><p>profile</p>
            </div>

            <div className="bonafide-view" onClick={() => navigate('/bonafide-student', { state: { userId: facultyId } })}>
              <FaFileAlt />
              <p >Bonafide 
  {facultyId && (
    <BonafideCount 
      emailKey="facultyEmail"
      getIdApi={`http://localhost:8080/api/faculty`}
      getBonafideApi={`http://localhost:8080/api/faculty/get-pending-bonafides`}
      statusFilter="PENDING"
      render={(count) => count > 0 && (
        <span className='counter-bonafide'>{count}</span>
      )}
    />
  )}</p>
            </div>

            <div className="fa-logout">
              <Logoutbtn />
            </div>
          </div>
        </div>

        <div className="top-sidebox">
          <div className="nav">
            <div className="student-count">
              <img src={stud} alt="Student Icon" />
              <h3>Students</h3>
            </div>
            <div className="student-number">
              <p>{faculty.students ? faculty.students.length : 0}</p>
            </div>

            <div className="student-search-bar">
              <Search className="search-icon" />
              <input
                id="student_search"
                type="text"
                placeholder="Search Student..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <div className="class_add_button">
              <Allbuttons image={Add} value="Add Class" target={() => setOpenAddClassModal(true)} />
            </div>
            <div className="faculty_profile_icon" onClick={toggleProfile}>
              <img id="profile_icon" src={Profileicon} alt="Profile Icon" />
            </div>
          </div>

          {openProfile && (
            <div className="faculty_profile_details">
              <div className="faculty-profile">
                <p className="field_background">{faculty.firstName} {faculty.lastName}</p>
                <p className="field_background">{faculty.discipline}</p>
                <p className="field_background">{faculty.email}</p>
                <p className="field_background">{faculty.mobileNumber}</p>
                <Allbuttons value="Logout" image={Logout} target={handleLogoutClick} />
              </div>
            </div>
          )}

          {openAddClassModal && (
            <Facultyfields email={faculty.email} onClose={closeModal} />
          )}

          {openExportPopup && (
            <div className="export_option_popup">
              <h3 id="export_popup_title">Select Fields to Export:</h3>
              <label><input type="checkbox" name="firstName" checked={selectedFields.firstName} onChange={handleFieldChange} /> Name</label>
              <label><input type="checkbox" name="registerNo" checked={selectedFields.registerNo} onChange={handleFieldChange} /> Register No</label>
              <label><input type="checkbox" name="emailid" checked={selectedFields.emailid} onChange={handleFieldChange} /> Email ID</label>
              {faculty.students?.[0]?.mobileNumber && (
                <label><input type="checkbox" name="mobileNumber" checked={selectedFields.mobileNumber} onChange={handleFieldChange} /> Mobile Number</label>
              )}
              <div className="export_buttons">
                <button id="export_cancel" onClick={() => setOpenExportPopup(false)}>Cancel</button>
                <Allbuttons value="Submit" target={handleExport} />
              </div>
            </div>
          )}

          <div className="card-container">
            {[...Array(maxLength)].map((_, index) => (
              <Card
                key={index}
                title={`Class ${index + 1}`}
                items={[
                  subjectList[index] || 'N/A',
                  deptList[index] || 'N/A',
                  batchList[index] || 'N/A',
                  semesterList[index] || 'N/A'
                ]}
              />
            ))}
          </div>

          <div className="student_table_options">
            <button id="export_button" className="All-button" onClick={() => setOpenExportPopup(true)}>Export</button>
          </div>

          <div className="faculty_dashboard_container">
            {faculty.students && faculty.students.length > 0 ? (
              <table className="student_table">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Name</th>
                    <th>Register Number</th>
                    <th>Email ID</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.students.filter(student =>
                    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.registerNo.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((student, index) => (
                    <tr key={student.registerNo}>
                      <td>{index + 1}</td>
                      <td>{student.firstName} {student.lastName}</td>
                      <td>{student.registerNo}</td>
                      <td>{student.emailId}</td>
                      <td>
                        <Allbuttons value="View" image={View} target={() => handleViewClick(student)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p id='one'>No students available</p>
            )}
          </div>

          {openModal && (
            <Modal student={selectedStudent} onClose={closeModal} userId={selectedStudent.registerNo} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Facultydashboard;
