import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './BatchesPage.css';
import View from '../../Assets/eyewhite.svg';
import axios from 'axios';
import StudentDetailModal from '../../Components/StudentDetailModal/StudentDetailModal';
import Allbutton from '../../Components/Allbuttons/Allbuttons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from '../../Api/AxiosInstance';

const yearEnumMap = {
  'I YEAR': 'FIRST',
  'II YEAR': 'SECOND',
  'III YEAR': 'THIRD',
  'IV YEAR': 'FOURTH',
};

const BatchesPage = () => {
  const { search } = useLocation();
  const facultyListRef = useRef(null); // ⬅️ Added ref

  const queryParams = useMemo(() => new URLSearchParams(search), [search]);
  const rawYearFromQuery = queryParams.get('year');
  const disciplineFromQuery = queryParams.get('discipline');

  const rawYear = rawYearFromQuery || localStorage.getItem('year');
  const discipline = disciplineFromQuery || localStorage.getItem('discipline');
  const year = yearEnumMap[rawYear?.toUpperCase()] || null;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [defaultStudent, setDefaultStudent] = useState(null);
  const [assignedFaculty, setAssignedFaculty] = useState(null);
  const [unassignedFaculty, setUnassignedFaculty] = useState([]);
  const [showFacultyList, setShowFacultyList] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [classSection, setClassSection] = useState('A');

  const departmentsWithoutSection = [
    'Computer Science and Engineering',
    'Electronics and Communication Engineering',
    'Civil Engineering',
  ];

  useEffect(() => {
    if (!rawYear || !discipline) {
      setError('Missing or invalid year or discipline.');
      setLoading(false);
      return;
    }

    localStorage.setItem('year', rawYear);
    localStorage.setItem('discipline', discipline);

    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `/student/get/discipline/year?discipline=${encodeURIComponent(
          discipline
        )}&year=${year}`;

        const response = await AxiosInstance.get(url);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch students');
        }

        const studentList = result.data || [];
        setStudents(studentList);

        if (studentList.length > 0) {
          const defaultRegisterNo = studentList[0].registerNo;
          const defaultRes = await AxiosInstance.get(
            `/student/${encodeURIComponent(defaultRegisterNo)}`
          );
          setDefaultStudent(defaultRes.data);
        }
      } catch (err) {
        setError(err.message || 'Something went wrong while fetching students.');
        setError(err.message || 'Something went wrong while fetching students.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [rawYear, discipline, year]);

  useEffect(() => {
    const fetchAssignedFaculty = async () => {
      if (defaultStudent?.facultyId) {
        try {
          const res = await AxiosInstance.get(
            `/faculty/get-faculty/${defaultStudent.facultyId}`
          );
          setAssignedFaculty(res.data.data);
        } catch (err) {
          console.error('Error fetching assigned faculty:', err);
        }
      } else {
        setAssignedFaculty(null);
      }
    };

    fetchAssignedFaculty();
  }, [defaultStudent]);

  const handleViewClick = async (student) => {
    try {
      const response = await AxiosInstance.get(
        `/student/${encodeURIComponent(student.registerNo)}`
      );
      setSelectedStudent(response.data);
      setOpenModal(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to get student details.');
    } 
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
  };

  const handleAssignFaculty = async () => {
    try {
      const response = await AxiosInstance.get(`/faculty/unassigned-faculties`);
      const facultyList =
        Array.isArray(response.data) ? response.data : response.data.data || [];
      setUnassignedFaculty(facultyList);
      setShowFacultyList(true);
    } catch (error) {
      console.error('Error fetching unassigned faculties:', error);
      setError('Failed to fetch unassigned faculty.');
    }
  };

  const assignFacultyToBatch = async () => {
    if (!selectedFaculty || !discipline || !year) {
      toast.error('Missing required data for assignment.');
      return;
    }

    const sectionToSend = departmentsWithoutSection.includes(discipline) ? ' ' : classSection;

    const queryParams = {
      facultyEmail: selectedFaculty.email,
      discipline,
      year,
      classSection: sectionToSend,
    };

    try {
      const response = await AxiosInstance.put(
        `/faculty/assign-students`,
        {},
        {
          params: queryParams,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      toast.success(
        `Assigned ${selectedFaculty.firstName} to ${discipline} - ${rawYear}${
          !departmentsWithoutSection.includes(discipline) ? ` - Section ${classSection}` : ''
        }`
      );

      if (defaultStudent?.registerNo) {
        const updatedRes = await AxiosInstance.get(
          `/student/${encodeURIComponent(defaultStudent.registerNo)}`
        );
        setDefaultStudent(updatedRes.data);
      }

      setShowFacultyList(false);
      setSelectedFaculty(null);
    } catch (error) {
      console.error('Error assigning faculty to batch:', error);
      toast.error('Failed to assign faculty to batch.');
    }
  };

  const handleDismissFaculty = async () => {
    try {
      const facultyId = defaultStudent?.facultyId;
      if (!facultyId) {
        toast.error('No faculty ID found for this student.');
        return;
      }

      const response = await AxiosInstance.get(
        `/faculty/get-faculty/${facultyId}`
      );
      const facultyEmail = response.data?.data?.email;

      if (!facultyEmail) {
        toast.error('Unable to retrieve faculty email.');
        return;
      }

      await AxiosInstance.put(`/faculty/update-dismiss`, null, {
        params: { email: facultyEmail },
      });

      setDefaultStudent((prev) => ({
        ...prev,
        facultyId: null,
      }));

      toast.success('Faculty dismissed successfully.');
    } catch (error) {
      console.error('Error dismissing faculty:', error);
      toast.error('Failed to dismiss faculty.');
    }
  };

  // ⬇️ Add outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (facultyListRef.current && !facultyListRef.current.contains(event.target)) {
        setShowFacultyList(false);
        setSelectedFaculty(null);
      }
    };

    if (showFacultyList) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFacultyList]);

  return (
    <div className="batches-page-container">
      <div className="hod-student-batch-box">
        <div className="assign">
          <h2 className="faculty-details-header">Faculty Details</h2>

          <div className="faculty-prop">
            {defaultStudent?.facultyId !== null && assignedFaculty && (
              <div className="faculty-details">
                <p>
                  <strong>Faculty Name:</strong> {assignedFaculty.firstName}{' '}
                  {assignedFaculty.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {assignedFaculty.email}
                </p>
                <p>
                  <strong>Phone:</strong> {assignedFaculty.mobileNumber}
                </p>
                <p>
                  <strong>Discipline:</strong> {assignedFaculty.discipline}
                </p>
              </div>
            )}

            {defaultStudent ? (
              defaultStudent.facultyId === null && !showFacultyList ? (
                <button className="assign-faculty-btn" onClick={handleAssignFaculty}>
                  Assign Faculty
                </button>
              ) : (
                defaultStudent.facultyId !== null && (
                  <button className="dismiss-faculty-btn" onClick={handleDismissFaculty}>
                    Dismiss Faculty
                  </button>
                )
              )
            ) : (
              <p>Loading faculty status...</p>
            )}
          </div>

          {showFacultyList && (
            <div className="unassigned-faculty-list" ref={facultyListRef}>
              {!departmentsWithoutSection.includes(discipline) && (
                <>
                  <h4>Select Class Section</h4>
                  <select
                    value={classSection}
                    onChange={(e) => setClassSection(e.target.value)}
                    style={{ padding: '5px', marginBottom: '10px' }}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </>
              )}

              {unassignedFaculty.length === 0 && <p>No unassigned faculty available.</p>}
              <ul className="unassigned-faculty">
                {unassignedFaculty.map((faculty) => (
                  <li
                    key={faculty.facultyId}
                    style={{
                      width: 'fit-content',
                      cursor: 'pointer',
                      padding: '5px',
                      backgroundColor:
                        selectedFaculty?.facultyId === faculty.facultyId
                          ? 'rgb(176, 224, 254)'
                          : 'transparent',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      marginTop: '12px',
                      marginBottom: '10px',
                      color: '#234068',
                      fontWeight: '500',
                    }}
                    onClick={() => setSelectedFaculty(faculty)}
                  >
                    {faculty.firstName} {faculty.lastName}
                  </li>
                ))}
              </ul>

              {selectedFaculty && (
                <button className="assign-selected-faculty-btn" onClick={assignFacultyToBatch}>
                  Assign {selectedFaculty.firstName} {selectedFaculty.lastName} to{' '}
                  {defaultStudent.batch} - {rawYear}
                  {!departmentsWithoutSection.includes(discipline) &&
                    ` - Section ${classSection}`}
                </button>
              )}
            </div>
          )}
        </div>

        {loading && <p>Loading students...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && students.length === 0 && <p>No students found.</p>}
        {!loading && !error && students.length > 0 && (
          <table className="hod-student-tables">
            <thead>
              <tr>
                <th>Register No</th>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Semester</th>
                <th>Email ID</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.registerNo}>
                  <td>{student.registerNo}</td>
                  <td>{`${student.firstName} ${student.lastName}`}</td>
                  <td>{student.mobileNumber}</td>
                  <td>{student.semester}</td>
                  <td>{student.emailid}</td>
                  <td>
                    <Allbutton value="View" image={View} target={() => handleViewClick(student)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {openModal && selectedStudent && (
        <StudentDetailModal student={selectedStudent} onClose={closeModal} />
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default BatchesPage;
