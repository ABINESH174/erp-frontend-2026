import React, { useState } from "react";
import AxiosInstance from "../../Api/AxiosInstance";
import { toast, ToastContainer } from "react-toastify";
import './AddAdminUserForm.css';

const AddAdminUserForm = ({ role, onUserAdded, onClose }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !password) {
      toast.warning("Please fill in all fields");
      return;
    }

    try {
      await AxiosInstance.post("/authentication/create", { userId, password, role });
      toast.success(`${role} added successfully`);
      if (onUserAdded) onUserAdded();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to add ${role}`);
    }
  };

  return (
    <div className="add-user-form-container">
      <form className="add-user-form" onSubmit={handleSubmit}>
    
        <h3>Add {role}</h3>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Add {role}</button>
        <ToastContainer />
      </form>
    </div>
  );
};

export default AddAdminUserForm;
