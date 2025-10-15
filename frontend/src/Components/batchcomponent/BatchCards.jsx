import React, { useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './BatchCards.css';

import group from '../../Assets/group.png'; 

const BatchCards = () => {
  const navigate = useNavigate();
  const { discipline } = useOutletContext();

  const coreBranches = [
    'Computer Science and Engineering',
    'Electronics and Communication Engineering',
    'Civil Engineering',
  ];
  const years = ['I YEAR','II YEAR', 'III YEAR', 'IV YEAR'];
  const sections = ['A', 'B'];

  const renderCards = useMemo(() => {
    if (!discipline) return <p>No valid discipline provided.</p>;

    if (discipline === 'Science and Humanities') {
      const firstYear = "I YEAR"
      return [
        ...coreBranches.map(branch => (
          <div className="batch-card" key={`I-${branch}`}>
            <h3>{branch}</h3>
            <button
              className="batch-carry-btn"
              onClick={() =>
                navigate(`batch-one?year=${firstYear}&section=${encodeURIComponent(' ')}&discipline=${encodeURIComponent(branch)}`)
              }
            >
              View
            </button>
          </div>
        )),
        ...sections.map(sec => (
          <div className="batch-card" key={`I-MECH-${sec}`}>
            <h3>Mechanical Engineering – Section {sec}</h3>
            <button
              className="batch-carry-btn"
              onClick={() =>
                navigate(`batch-one?year=${firstYear}&discipline=${encodeURIComponent('Mechanical Engineering')}&section=${sec}`)
              }
            >
              View
            </button>
          </div>
        )),
        ...sections.map(sec => (
          <div className="batch-card" key={`I-EEE-${sec}`}>
            <h3>Electrical & Electronics Engineering – Section {sec}</h3>
            <button
              className="batch-carry-btn"
              onClick={() =>
                navigate(`batch-one?year=${firstYear}&discipline=${encodeURIComponent('Electrical and Electronics Engineering')}&section=${sec}`)
              }
            >
              View
            </button>
          </div>
        ))
      ];
    }

    if (
      discipline === 'Mechanical Engineering' ||
      discipline === 'Electrical and Electronics Engineering'
    ) {
      return years.flatMap(year =>
        sections.map(sec => (
          <div className="batch-card" key={`${year}-${sec}`}>
            {/* <img src={group} alt="icon" /> */}
            <h3>{`${year} – Section ${sec}`}</h3>
            <button
              className="batch-carry-btn"
              onClick={() =>
                navigate(`batch-one?year=${year}&section=${sec}&discipline=${encodeURIComponent(discipline)}`)
              }
            >
              View 
            </button>
          </div>
        ))
      );
    }

    return years.map(year => (
      <div className="batch-card" key={year}>
               {/* <img className="group-icon" src={group} alt="icon" /> */}

        <h3>{year}</h3>
        <button
          className="batch-carry-btn"
          onClick={() =>
            navigate(`batch-one?year=${encodeURIComponent(year)}&section=${encodeURIComponent(' ')}&discipline=${encodeURIComponent(discipline)}`)
          }
        >
          View
        </button>
      </div>
    ));
  }, [discipline, navigate]);

  return <div className="batchbox">{renderCards}</div>;
};

export default BatchCards;
