// src/pages/Bonafide/Bonafide.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import './Bonafide.css';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import axios from 'axios';

function Bonafide() {
    const location = useLocation();
    const navigate = useNavigate();

    const options = [
        { title: "Bonafide for Central Scholarship", id: "centralScholarship" },
        { title: "Bonafide for State Scholarship", id: "stateScholarship" },
        { title: "Bonafide for Internship", id: "internship" },
        { title: "Bonafide for Bus Pass", id: "busPass" },
        { title: "Bonafide for Passport", id: "passport" }
    ];

    const stateScholarships = ["Labour Welfare", "Tailor Welfare", "Farmer Welfare", "Educational Support"];
    const centralScholarships = ["Pragati", "Saksham", "Swanath Scholarship"];

    const [uploads, setUploads] = useState({
        selectedOption: "",
        showModal: false,
        scholarshipTypes: [],
        selectedScholarship: "",
        fileUploads: {}
    });

    const handleCardClick = (optionId) => {
        const title = options.find(option => option.id === optionId)?.title || "";

        setUploads(prev => ({
            ...prev,
            selectedOption: optionId,
            selectedScholarship: (optionId === "stateScholarship" || optionId === "centralScholarship") ? "" : title,
            scholarshipTypes: optionId === "stateScholarship" ? stateScholarships :
                optionId === "centralScholarship" ? centralScholarships : [],
            showModal: optionId === "stateScholarship" || optionId === "centralScholarship"
        }));
    };

    const handleScholarshipSelect = (type) => {
        setUploads(prev => ({
            ...prev,
            selectedScholarship: type,
            showModal: false
        }));
    };

    const handleFileChange = (name) => (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploads(prev => ({
                ...prev,
                fileUploads: { ...prev.fileUploads, [name]: file }
            }));
        }
    };

    const validateFiles = () => {
        if (["Labour Welfare", "Farmer Welfare", "Tailor Welfare"].includes(uploads.selectedScholarship)) {
            const requiredFiles = ["aadharCard","welfareId", "smartCard", "studentIdCard"];
            return requiredFiles.every(fileType => uploads.fileUploads[fileType]);
        }
        return !!uploads.fileUploads["studentIdCard"];
    };

    const handleSubmit = async () => {
        if (!validateFiles()) {
            toast.error("Please upload all required files.");
            return;
        }

        try {
            const userId = location.state?.studentId || "12345";
            const formData = new FormData();
            formData.append('registerNo', userId);
            formData.append('purpose', uploads.selectedScholarship);

            if (uploads.fileUploads.welfareId) {
                formData.append('welfareId', uploads.fileUploads.welfareId);
            }

            Object.entries(uploads.fileUploads).forEach(([key, file]) => {
                formData.append(key, file);
            });

            await axios.post('/api/bonafide/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Files uploaded successfully!");
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/profile-page', { state: { userId } });
        } catch (error) {
            toast.error(error.response?.data?.message || "File upload failed. Please try again.");
        }
    };

    return (
        <div className="bonafide-container">
            <Header />
            <div className="bonafide-content">
                <h2>Select a Bonafide Option</h2>
                <div className="bonafide-cards">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="bonafide-card"
                            onClick={() => handleCardClick(option.id)}
                        >
                            <h3>{option.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {uploads.showModal && (
                <div className="modal-overlay" onClick={() => setUploads(prev => ({ ...prev, showModal: false }))}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Select Type of Scholarship</h3>
                        <ul>
                            {uploads.scholarshipTypes.map((type) => (
                                <li key={type} onClick={() => handleScholarshipSelect(type)}>{type}</li>
                            ))}
                        </ul>
                        <button onClick={() => setUploads(prev => ({ ...prev, showModal: false }))}>Close</button>
                    </div>
                </div>
            )}

            {uploads.selectedScholarship && (
                <div className="file-upload-section">
                    <h3>Upload required documents for {uploads.selectedScholarship}</h3>
                    <div className="file-upload">
                        <label>Student ID Card</label>
                        <input type="file" onChange={handleFileChange('studentIdCard')} />
                    </div>
                    {["Labour Welfare", "Farmer Welfare", "Tailor Welfare"].includes(uploads.selectedScholarship) && (
                        <>
                            <div className="file-upload">
                                <label>Aadhar Card</label>
                                <input type="file" onChange={handleFileChange('aadharCard')} />
                            </div>
                            <div className="file-upload">
                                <label>Smart Card</label>
                                <input type="file" onChange={handleFileChange('smartCard')} />
                            </div>
                            <div className="file-upload">
                                <label>Welfare Proof Document</label>
                                <input type="file" onChange={handleFileChange('welfareId')} />
                            </div>
                        </>
                    )}
                    <button onClick={handleSubmit}>Submit</button>
                    <ToastContainer />
                </div>
            )}
            {/* <Footer /> */}
        </div>
    );
}

export default Bonafide;
