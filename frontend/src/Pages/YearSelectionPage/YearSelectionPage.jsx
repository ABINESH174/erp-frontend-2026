import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../Components/Card/Card";
import "./YearSelectionPage.css";
import img from"../../Assets/Departments/img.jpg"
import BackButton from "../../Components/backbutton/BackButton";

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const YearSelectionPage = () => {
  const { department } = useParams();
  const navigate = useNavigate();

  const handleClick = (year) => {
    const formattedYear = year.toLowerCase().replace(" ", "-");
    navigate(`/principal-dashboard/Department/${department}/year/${formattedYear}/students`);
  };

  return (
    <div className="year-selection-container">
      <h2>{department.toUpperCase()} - Select Year</h2>
      <div className="cards-grid">
        {years.map((year, index) => (
          <Card
            key={index}
            text={year}
            image={img}
            onClick={() => handleClick(year)}
          />
        ))}
      </div>
    </div>
  );
};

export default YearSelectionPage;
