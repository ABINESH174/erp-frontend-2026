import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Card from "../../Components/Card/Card";
import "./PrincipalStudentsPage.css";
import mech from "../../Assets/Departments/mech.jpg";
import civil from "../../Assets/Departments/civil.jpg";
import eee from "../../Assets/Departments/EEE.jpg";
import ece from "../../Assets/Departments/ECE.jpg";
import cse from "../../Assets/Departments/CSE.jpg";
import it from "../../Assets/Departments/IT.jpg";

const departments = [
  { id: 1, name: "MECH", image: mech},
  { id: 2, name: "CIVIL", image: civil },
  { id: 3, name: "EEE", image: eee },
  { id: 4, name: "ECE", image: ece },
  { id: 5, name: "CSE", image: cse },
  { id: 6, name: "IT", image: it },
];

const PrincipalStudentsPage = () => {
  const { PrincipalData } = useOutletContext();
  const navigate = useNavigate();

  const handleCardClick = (dept) => {
    navigate(`/principal-dashboard/Department/${dept.toLowerCase()}`);
  };

  return (
    <div className="principal-students-container">
      <h2>Welcome, {PrincipalData?.firstName || "Principal"} 👋</h2>
      <p className="select-text">Please select a department to view student details:</p>
      <div className="department-cards-grid">
        {departments.map((dept) => (
          <Card
            key={dept.id}
            text={dept.name}
            image={dept.image}
            onClick={() => handleCardClick(dept.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default PrincipalStudentsPage;
