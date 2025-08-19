import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import AxiosInstance from "../../Api/AxiosInstance";
import notFound from "../../Assets/not found.png";
import "./PreviousBonafides.css";

const PreviousBonafides = () => {
  const { role } = useOutletContext(); //  "HOD" or "FACULTY"
  const [userId, setUserId] = useState(null);
  const [previousBonafides, setPreviousBonafides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      setLoading(true);
      try {
        if (!role) return;

        const emailKey = `${role.toLowerCase()}Email`; //  "hodEmail" or "facultyEmail"
        const email = localStorage.getItem(emailKey);

        if (!email) {
          setError("User email not found. Please login again.");
          return;
        }

        console.log(`Fetching ${role} userId for email:`, email);

        if (role.toLowerCase() === "hod") {
          const hodRes = await AxiosInstance.get(`/hod/getHodByEmail/${email}`);
          setUserId(hodRes.data?.data?.hodId || null);
        } else if (role.toLowerCase() === "faculty") {
          const facultyRes = await AxiosInstance.get(`/faculty/${email}`);
          setUserId(facultyRes.data?.data?.facultyId || null);
        }
      } catch (err) {
        console.error("Error fetching userId:", err);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, [role]);

  useEffect(() => {
    if (!userId) return;

    const fetchPreviousBonafides = async () => {
      setLoading(true);
      try {
        let url = "";

        if (role.toLowerCase() === "hod") {
          url = `/bonafide/hod/previousBonafide/${userId}`;
        } else if (role.toLowerCase() === "faculty") {
          url = `/bonafide/faculty/previousBonafide/${userId}`;
        }

        if (!url) return;

        const response = await AxiosInstance.get(url, {
          headers: { Accept: "application/json" },
        });

        setPreviousBonafides(
          Array.isArray(response.data?.data) ? response.data.data : []
        );
      } catch (err) {
        console.error("Error fetching previous bonafides:", err);
        setError("Failed to fetch bonafides.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousBonafides();
  }, [userId, role]);

  return (
    <div className="prev-bonafide-student">
      <div className="prev-topstud-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="not-found-message">
            <p>{error}</p>
            <img src={notFound} alt="Not Found" />
          </div>
        ) : previousBonafides.length === 0 ? (
          <div className="not-found-message">
            <p>No Bonafides have Applied yet❕</p>
            <img src={notFound} alt="Not Found" />
          </div>
        ) : (
          <div className="prev-bonafide-table-container">
            <h3>Previous Bonafides</h3>
            <table className="prev-bonafide-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Register Number</th>
                  <th>Purpose</th>
                  <th>Semester</th>
                  <th>Date of Apply</th>
                  <th>Mobile Number</th>
                </tr>
              </thead>
              <tbody>
                {previousBonafides.map((item, index) => (
                  <tr key={item.bonafideId || index}>
                    <td>{index + 1}</td>
                    <td>{item.registerNo}</td>
                    <td>{item.purpose}</td>
                    <td>{item.semester}</td>
                    <td>{item.date}</td>
                    <td>{item.mobileNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousBonafides;
