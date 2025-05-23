import React from 'react'
import {useNavigate } from 'react-router-dom';
import './BatchCards.css';

const BatchCards = () => {
      const navigate = useNavigate();
    
  return (
    <div>  
          <div className="batchbox">

            <div class="batch-card">
              <h3>2022-2026   Batch</h3>
              <button className="batch-carry-btn" onClick={()=> navigate('batch-one')}>view</button>
            </div>
            <div class="batch-card">
              <h3>2023-2027   Batch</h3>
             <button className="batch-carry-btn" onClick={()=> navigate('batch-one')}>view</button>

            </div>
            <div class="batch-card">
              <h3>2024-2028   Batch</h3>
              <button className="batch-carry-btn" onClick={()=> navigate('batch-one')}>view</button>

            </div>
          </div> 
    </div>
  )
}

export default BatchCards