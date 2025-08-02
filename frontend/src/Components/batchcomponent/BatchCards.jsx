import React, { useMemo } from 'react';
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

  const renderCards = useMemo(() => {
    if (!discipline) return <p>No valid discipline provided.</p>;

    if (discipline === 'Science and Humanities') {
      return [
        ...coreBranches.map(branch => (
          <div className="batch-card" key={`I-${branch}`}>
            <h3>{branch}</h3>
            <button
              className="batch-carry-btn"
              onClick={() =>
                navigate(`/students?year=I YEAR&branch=${encodeURIComponent(branch)}`)
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
                navigate(`/students?year=I YEAR&branch=Mechanical Engineering&section=${sec}`)
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
                navigate(`/students?year=I YEAR&branch=Electrical and Electronics Engineering&section=${sec}`)
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
            <h3>{`${year} – Section ${sec}`}</h3>
            <button
              className="batch-carry-btn"
              onClick={() =>
                navigate(`/students?year=${year}&section=${sec}&branch=${encodeURIComponent(discipline)}`)
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
        <h3>{year}</h3>
        <button
          className="batch-carry-btn"
          onClick={() =>
            navigate(`batch-one?year=${encodeURIComponent(year)}&discipline=${encodeURIComponent(discipline)}`)
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
