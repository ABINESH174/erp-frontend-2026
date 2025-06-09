import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; 
import './OfficeBearer.css';
import { Allbuttons, Header } from '../../Components';
import View from '../../Assets/eyewhite.svg';
import { ToastContainer, toast } from 'react-toastify';
import BackButton from '../../Components/backbutton/BackButton';
import BonafideViewModal from '../../Components/BonafideViewModal/BonafideViewModal';


const OfficeBearer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hodId, setHodId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBonafide, setSelectedBonafide] = useState(null);
  

  useEffect(() => {
    const handleFetchBonafides = async () => {
    try {
        const bonafideRes = await axios.get(
        `http://localhost:8080/api/bonafide/getHodApproved`,
          {
            headers: { Accept: 'application/json' },
          }
        );

        if (bonafideRes.data?.data?.length > 0) {
          setData(bonafideRes.data.data);
        } else {
          setData([]);
          setError('No bonafide requests found.');
        }
        
    } catch (error) {
        
    }
}
    handleFetchBonafides();
  },[]);
    

  useEffect(() => {
    const fetchHodIdAndBonafides = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ Corrected key to match localStorage
        const email = localStorage.getItem('officeBearerEmail');


        if (!email) {
          setError('User email not found. Please login again.');
          setLoading(false);
          return;
        }

        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data from server.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHodIdAndBonafides();
  }, []);

  const handleBonafideStatus = async (bonafideId, registerNo, status) => {
    try {
      const res = await axios.put(
        'http://localhost:8080/api/bonafide/updateBonafideWithBonafideStatus',
        null,
        {
          params: { bonafideId, registerNo, status },
        }
      );

      toast.success(res.data.message || 'Status updated!');

      const refresh = await axios.get(
        `http://localhost:8080/api/bonafide/getHodApproved`
      );

      if (refresh.data?.data?.length > 0) {
        setData(refresh.data.data);
        setError(null);
      } else {
        setData([]);
        setError('No bonafide requests found.');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      // toast.error('Failed to update status.');
    }
  };
    const handleViewClick = (item) => {
    setSelectedBonafide(item);
    setShowModal(true);
  };

  return (
    <div>
      <Header/>
      <div className="ob-bonafide-student">
       <div className="ob-bonafide-sidebar-container">
            <ul className="ob-bonafide-sidebar-list" style={{ listStyleType: 'none' }}>
              <li className="ob-bonafide-sidebar-item">Bonafides</li>
              <li className="ob-bonafide-sidebar-item">Previous</li>
              <li className="ob-bonafide-sidebar-item">Approved</li>
              <li className="ob-bonafide-sidebar-item">Rejected</li>
            </ul>
          </div>
        <div className="ob-topstud-container">
          <div className="name-bar">
            <h3 className="name-bar-title">Bonafide Notification Page</h3>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="ob-bonafide-table-container">
               <div className="bonafide-backbtn">
                <BackButton />
              </div>
              <table className="ob-bonafide-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Register Number</th>
                    <th>Purpose</th>
                    <th>Semester</th>
                    <th>Departmennt</th>
                    <th>Date of Apply</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th>View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.bonafideId}>
                      <td>{index + 1}</td>
                      <td>{item.registerNo}</td>
                      <td>{item.purpose}</td>
                      <td>{item.semester}</td>
                      <td>{item.discipline}</td>
                      <td>{item.date}</td>
                      <td>{item.bonafideStatus}</td>
                      <td className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleBonafideStatus(
                              item.bonafideId,
                              item.registerNo,
                              'OB_APPROVED'
                            )
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() =>
                            handleBonafideStatus(
                              item.bonafideId,
                              item.registerNo,
                              'REJECTED'
                            )
                          }
                        >
                          Reject
                        </button>
                      </td>
                       <td className='fa-view-btn'>
                        <Allbuttons value="View" image={View} target={() => handleViewClick(item)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <BonafideViewModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedBonafide={selectedBonafide}
      />
        <ToastContainer />
    </div>
  );
};

export default OfficeBearer;
