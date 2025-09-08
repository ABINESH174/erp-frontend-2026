import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { toast } from "react-toastify";
import AxiosInstance from "../../Api/AxiosInstance";
import { BsPerson } from "react-icons/bs";
import { FaChalkboardTeacher, FaUserTie } from "react-icons/fa";
import Header from "../../Components/Header/Header";
import Logoutbtn from "../../Components/logoutbutton/Logoutbtn";
import AddAdminUserForm from "./AddAdminUserForm";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("hods");
  const [userType, setUserType] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);

  // Map section to API endpoint
  const sectionEndpoints = {
    students: "/student",
    facultys: "/faculty/get-all",
    hods: "/hod/getAllHods",
    principals: "/principal/all",
    officeBearers: "/office-bearer/all"

  };

  const fetchUsers = async (section) => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(sectionEndpoints[section]);
      setUserList(response.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("No users found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(activeSection);
  }, [activeSection]);

  const handleAddClick = (role) => {
    setUserType(role);
    setShowForm(true);
  };

  const handleDelete = async (type, userId) => {
    try {
      const endpoint = `/${type}/delete/${userId}`;
      await AxiosInstance.delete(endpoint);
      toast.success(`${type.toUpperCase()} deleted`);
      fetchUsers(activeSection); // Refresh list
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const renderTable = () => {
    if (loading) return <p>Loading {activeSection}...</p>;
    if (!userList.length) return <p>No users found.</p>;

    return (
      <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>S.no</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Discipline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.mobileNumber}</td>
              <td>{user.discipline || "-"}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(activeSection.slice(0, -1), user.userId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <div className="admin-parent">
        {/* Sidebar */}
        <div className="admin-full-container">
          <p className="admin-heading-tag">Admin Dashboard</p>
          <div className="admin-side">
            <div className="admin-profile-bar">
              <BsPerson />
              <p>Profile</p>
            </div>
            <div className="admin-profile-bar" onClick={() => setActiveSection("students")}>
              <FaUserTie />
              <p>STUDENTS</p>
            </div>
            <div className="admin-profile-bar" onClick={() => setActiveSection("facultys")}>
              <FaChalkboardTeacher />
              <p>FACULTYS</p>
            </div>
            <div className="admin-profile-bar" onClick={() => setActiveSection("hods")}>
              <FaChalkboardTeacher />
              <p>HODs</p>
            </div>
            <div className="admin-profile-bar" onClick={() => setActiveSection("principals")}>
              <FaUserTie />
              <p>Principals</p>
            </div>
            <div className="admin-profile-bar" onClick={() => setActiveSection("officeBearers")}>
              <FaUserTie />
              <p>Office Bearers</p>
            </div>
            <div className="admin-logout">
              <Logoutbtn onClick={() => {
                localStorage.clear();
                toast.success("Logged out");
                setTimeout(() => (window.location.href = "/login-page"), 1000);
              }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="admin-top-sidebox">
          <div className="admin-topbar">
            <button onClick={() => handleAddClick("HOD")}>Add HOD</button>
            <button onClick={() => handleAddClick("PRINCIPAL")}>Add Principal</button>
            <button onClick={() => handleAddClick("OB")}>Add OB</button>
            <button onClick={() => handleAddClick("STUDENT")}>Add Student</button>
            <button onClick={() => handleAddClick("FACULTY")}>Add Faculty</button>
          </div>

          {showForm && (
            <AddAdminUserForm
              role={userType}
              onUserAdded={() => {
                fetchUsers(activeSection);
                setShowForm(false);
              }}
            />
          )}

          <h2 className="admin-section-title">{activeSection.toUpperCase()}</h2>
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
