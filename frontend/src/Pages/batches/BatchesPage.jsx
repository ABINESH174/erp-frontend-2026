import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './BatchesPage.css';
import { Allbuttons } from '../../Components';
import View from '../../Assets/eyewhite.svg';
import axios from 'axios';
import StudentDetailModal from '../../Components/StudentDetailModal/StudentDetailModal';

const yearEnumMap = {
  'I YEAR': 'FIRST',
  'II YEAR': 'SECOND',
  'III YEAR': 'THIRD',
  'IV YEAR': 'FOURTH',
};

const BatchesPage = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const rawYear = queryParams.get('year');
  const discipline = queryParams.get('discipline');
  const year = yearEnumMap[rawYear?.toUpperCase()] || null;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [defaultStudent, setDefaultStudent] = useState(null);

  useEffect(() => {
    if (!year || !discipline) {
      setError('Missing or invalid year or discipline.');
      setLoading(false);
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `http://localhost:8080/api/student/get/discipline/year?discipline=${encodeURIComponent(
          discipline
        )}&year=${year}`;

        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch students');
        }

        setStudents(result.data || []);

        // Automatically fetch details for the first student to get faculty status
        if (result.data && result.data.length > 0) {
          const defaultRegisterNo = result.data[0].registerNo;
          const defaultRes = await axios.get(
            `http://localhost:8080/api/student/${encodeURIComponent(defaultRegisterNo)}`
          );
          setDefaultStudent(defaultRes.data);
        }
      } catch (err) {
        setError(err.message || 'Something went wrong while fetching students.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [year, discipline]);

  const handleViewClick = async (student) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/student/${encodeURIComponent(student.registerNo)}`
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

  return (
    <div className="batches-page-container">
      <div className="hod-student-batch-box">
        <div className="assign">
          <h2>Faculty Assignment</h2>
          {defaultStudent ? (
            defaultStudent.faculty === null ? (
              <button className="assign-faculty-btn">Assign Faculty</button>
            ) : (
              <button className="dismiss-faculty-btn">Dismiss Faculty</button>
            )
          ) : (
            <p>Loading faculty status...</p>
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
                    <Allbuttons
                      value="View"
                      image={View}
                      target={() => handleViewClick(student)}
                    />
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
    </div>
  );
};

export default BatchesPage;
