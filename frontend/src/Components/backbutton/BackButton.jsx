import React from 'react'

import './BackButton.css';



const BackButton = () => {
  return (
    <div>
        <button className="back-button" onClick={() => window.history.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 5 5 12 12 19"></polyline>
            </svg>
            Back
        </button>
    </div>
  )
}

export default BackButton