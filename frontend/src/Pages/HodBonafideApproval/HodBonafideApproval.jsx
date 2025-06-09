import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; 
import { use } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../Components/Header/Header';
import './HodBonafideApproval.css'; 
import BackButton from '../../Components/backbutton/BackButton';
import { Allbuttons } from '../../Components';
import View from '../../Assets/eyewhite.svg';
import BonafideViewModal from '../../Components/BonafideViewModal/BonafideViewModal';


const HodBonafideApproval = () => {
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
        console.log('HOD ID:', hodId);
        const bonafideRes = await axios.get(
        `http://localhost:8080/api/hod/getFacultyApprovedBonafidesByHodId/${hodId}`,
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
  },[hodId]);
    

  useEffect(() => {
    const fetchHodIdAndBonafides = async () => {
      setLoading(true);
      setError(null);

      try {
        const email = localStorage.getItem('hodEmail');


        if (!email) {
          setError('User email not found. Please login again.');
          setLoading(false);
          return;
        }

        // Step 1: Get hodId by email
        const hodRes = await axios.get(`http://localhost:8080/api/hod/getHodByEmail/${email}`, {
          headers: { Accept: 'application/json' },
        });
        console.log(hodRes.data.data);

        const fetchedHodId = hodRes.data.data.hodId;
        setHodId(fetchedHodId);

        if (!fetchedHodId) {
          setError('Faculty ID not found for this email.');
          setLoading(false);
          return;
        }

        // Step 2: Get pending bonafides
        
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

      // Refresh bonafide list
      if (!hodId) {
        setError('Faculty ID not found. Please login again.');
        return;
      }

      const refresh = await axios.get(
        `http://localhost:8080/api/hod/getFacultyApprovedBonafidesByHodId/${hodId}`
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
      alert('Failed to update status.');
    }
  };

    const handleViewClick = (item) => {
    setSelectedBonafide(item);
    setShowModal(true);
  };

  return (
    <div>
      <Header />
      <div className="hod-bonafide-student">
        <div className="hod-bonafide-navbar"> 
           <ul className="hod-navlist" style={{ listStyleType: 'none' }}>
              <li className="hodbonafide-navitem">
                Bonafides
              </li>
              <li className="hodbonafide-navitem" >
                Previous
              </li>
              <li className="hodbonafide-navitem">
                Approved
              </li>
              <li className="hodbonafide-navitem">
               Rejected
              </li>
            </ul>
          </div>
        <div className="hod-topstud-container">
          <div className="bonafide-header-bar">
            
            <h3 className="name-bar-title">HOD Bonafide Approval Page</h3>
          </div>
           <div className="bonafide-backbtn">
                  <BackButton/>
              </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="hod-bonafide-table-container">
               
              <table className="hod-bonafide-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Register Number</th>
                    <th>Purpose</th>
                    <th>Semester</th>
                    <th>Date of Apply</th>
                    <th>Mobile Number</th>
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
                      <td>{item.date}</td>
                      <td>{item.mobileNumber}</td>
                      <td className="hod-action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleBonafideStatus(
                              item.bonafideId,
                              item.registerNo,
                              'HOD_APPROVED'
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
                      <td className='hod-view-btn'>
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

export default HodBonafideApproval;
