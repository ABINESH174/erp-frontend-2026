import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './BatchCards.css';

const BatchCards = () => {
  const navigate = useNavigate();
  const { discipline } = useOutletContext();

  const coreBranches = [
    'Computer Science and Engineering',
    'Electronics and Communication Engineering',
    'Civil Engineering',
  ];
  const years = ['II YEAR', 'III YEAR', 'IV YEAR'];
  const sections = ['A', 'B'];

  const renderCards = () => {
    if (!discipline) return <p>No valid discipline provided.</p>;

    if (discipline === 'Science and Humanities') {
      const cards = [];

      coreBranches.forEach((branch) => {
        cards.push(
          <div className="batch-card" key={`I-${branch}`}>
            <h3>{`${branch}`}</h3>
            <button
              className="batch-carry-btn"
              onClick={() =>
                navigate(`/students?year=I YEAR&branch=${encodeURIComponent(branch)}`)
              }
            >
              View
            </button>
          </div>
        );
      });

      sections.forEach((section) => {
        cards.push(
          <div className="batch-card" key={`I-MECH-${section}`}>
            <h3>{` Mechanical Engineering - Section ${section}`}</h3>
            <button
              className="batch-carry-btn"
              onClick={() =>
                navigate(
                  `/students?year=I YEAR&branch=Mechanical Engineering&section=${section}`
                )
              }
            >
              View
            </button>
          </div>
        );
      });

      sections.forEach((section) => {
        cards.push(
          <div className="batch-card" key={`I-EEE-${section}`}>
            <h3>{`Electrical and Electronics Engineering - Section ${section}`}</h3>
            <button
              className="batch-carry-btn"
              onClick={() =>
                navigate(
                  `/students?year=I YEAR&branch=Electrical and Electronics Engineering&section=${section}`
                )
              }
            >
              View
            </button>
          </div>
        );
      });

      return cards;
    }

    if (
      discipline === 'Mechanical Engineering' ||
      discipline === 'Electrical and Electronics Engineering'
    ) {
      return years.flatMap((year) =>
        sections.map((section) => (
          <div className="batch-card" key={`${year}-${section}`}>
            <h3>{`${year} - Section ${section}`}</h3>
            <button
              className="batch-carry-btn"
              onClick={() =>
                navigate(`/students?year=${year}&section=${section}`)
              }
            >
              View
            </button>
          </div>
        ))
      );
    }

    return years.map((year) => (
  <div className="batch-card" key={year}>
    <h3>{year}</h3>
    <button
      className="batch-carry-btn"
      onClick={() =>
        navigate(`/hod-dashboard/batch-one?year=${year}&discipline=${discipline}`)
      }
    >
      View
    </button>
  </div>
));


  };

  return <div className="batchbox">{renderCards()}</div>;
};

export default BatchCards;
