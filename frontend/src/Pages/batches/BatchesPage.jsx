import React, { useEffect, useState } from 'react';
import './BatchesPage.css';
import axios from 'axios';

const BatchesPage = () => {
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);

  // Default values
  const defaultDiscipline = "Computer Science and Engineering";
  const defaultBatch = 2026;

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const encodedDiscipline = encodeURIComponent(defaultDiscipline); // encode spaces
        const url = `http://localhost:8080/api/faculty/get-faculty-by-discipline-and-batch?discipline=${encodedDiscipline}&batch=${defaultBatch}`;

        const response = await axios.get(url);
        const data = response.data.data;

        setFaculty(data.faculty || []);
        setStudents(data.students || []);
      } catch (error) {
        console.error('Error fetching batch data:', error);
      }
    };

    fetchBatchDetails();
  }, []);

  return (
    <div className="batch-container">
      <div className="top-faculty-batchbox">
        <h2>Faculty - {defaultDiscipline}, Batch {defaultBatch}</h2>
        {faculty.length > 0 ? (
          <ul>
            {faculty.map((person, index) => (
              <li key={index}>{person.name}</li>
            ))}
          </ul>
        ) : (
          <p>No faculty found for this batch and discipline.</p>
        )}
      </div>

      <div className="student-down-batchbox">
        <h2>Students - {defaultDiscipline}, Batch {defaultBatch}</h2>
        {students.length > 0 ? (
          <ul>
            {students.map((student, index) => (
              <li key={index}>{student.name}</li>
            ))}
          </ul>
        ) : (
          <p>No students found for this batch and discipline.</p>
        )}
      </div>
    </div>
  );
};

export default BatchesPage;
