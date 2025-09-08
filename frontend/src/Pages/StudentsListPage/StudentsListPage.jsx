import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AxiosInstance from '../../Api/AxiosInstance';
import './StudentsListPage.css';
import notFound from '../../Assets/nostudnet.png';

const departmentFullNameMap = {
  CSE: 'Computer Science and Engineering',
  CIVIL: 'Civil Engineering',
  MECH: 'Mechanical Engineering',
  EEE: 'Electrical and Electronics Engineering',
  ECE: 'Electronics and communication Engineering',
};

const yearMap = {
  '1st-year': 'FIRST',
  '2nd-year': 'SECOND',
  '3rd-year': 'THIRD',
  '4th-year': 'FOURTH',
};

function StudentListPage() {
  const { department, year } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mappedDiscipline = departmentFullNameMap[department?.toUpperCase()];
  const mappedYear = yearMap[year?.toLowerCase()];

  useEffect(() => {
    if (!mappedDiscipline || !mappedYear) {
      setError('Missing or invalid discipline/year.');
      setLoading(false);
      return;
    }

    const fetchStudents = async () => {
      try {
        const response = await AxiosInstance.get(
          `/student/get/discipline/year?discipline=${encodeURIComponent(mappedDiscipline)}&year=${mappedYear}`
        );
        setStudents(response?.data?.data || []);
        console.log(response.data.data);
      } catch (err) {
        console.error(err);
        setError('No students registered');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [mappedDiscipline, mappedYear]);

  return (
    <div className="student-list-container">
      <h2>
        {mappedDiscipline?.toUpperCase()} - {mappedYear} YEAR STUDENTS
      </h2>

      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : students.length === 0 ? (
        <div className="no-students">
          <img src={notFound} alt="No Students Found" />
          <p>No students found</p>
        </div>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Register No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id || index}>
                <td>{index + 1}</td>
                <td>{student.registerNo || 'N/A'}</td>
                <td>{student.firstName || 'N/A'}</td>
                <td>{student.emailid || 'N/A'}</td>
                <td>{student.mobileNumber || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentListPage;
