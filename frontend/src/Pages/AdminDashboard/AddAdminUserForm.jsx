import React, { useState } from "react";
import AxiosInstance from "../../Api/AxiosInstance";
import { toast, ToastContainer } from "react-toastify";


const AddAdminUserForm = ({ role, onUserAdded }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !password) {
      toast.warning("Please fill in all fields");
      return;
    }

    let createEndpoint = "";
    let fetchEndpoint = "";

    // if (role === "HOD") {
    //   createEndpoint = "/hod/create";
    //   fetchEndpoint = `/hod/getHodById/${userId}`;
    // } else if (role === "PRINCIPAL") {
    //   createEndpoint = "/principal/create";
    //   fetchEndpoint = `/principal/getPrincipalById/${userId}`;
    // } else if (role === "OB") {
    //   createEndpoint = "/office-bearer/create";
    //   fetchEndpoint = `/office-bearer/getOfficeBearerById/${userId}`;
    // }

    try {
      await AxiosInstance.post("/authentication/create", { userId, password, role });
    //   const response = await AxiosInstance.get(fetchEndpoint);
    //   onUserAdded(response.data);
      toast.success(`${role} added successfully`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to add ${role}`);
    }
  };

  return (
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
      <ToastContainer/>
    </form>
  );
};

export default AddAdminUserForm;
