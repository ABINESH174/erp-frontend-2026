import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import './Bonafide.css';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import axios from 'axios';

function Bonafide() {
    const location = useLocation();
    
    const options = [
        { title: "Bonafide for Central Scholarship", id: "centralScholarship" },
        { title: "Bonafide for State Scholarship", id: "stateScholarship" },
        { title: "Bonafide for Internship", id: "internship" },
        { title: "Bonafide for Bus Pass", id: "busPass" },
        { title: "Bonafide for Passport", id: "passport" }
    ];

    const stateScholarships = [
        "Labour Welfare",
        "Tailor Welfare",
        "Farmer Welfare",
        "Educational Support"
    ];

    const centralScholarships = [
        "Pragati",
        "Saksham",
        "Swanath Scholarship"
    ];

    const [uploads, setUploads] = useState({
        selectedOption: "",
        showModal: false,
        scholarshipTypes: [],
        selectedScholarship: "",
        fileUploads: {}
    });

    const handleCardClick = (optionId) => {
        setUploads(prev => ({
            ...prev,
            selectedOption: optionId,
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
        const { target: { files } } = e;
        const file = files[0];

        if (file) {
            convertFileToBase64(file).then(base64 => {
                setUploads(prev => ({
                    ...prev,
                    fileUploads: { ...prev.fileUploads, [name]: base64 }
                }));
            });
        }
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const validateFiles = () => {
        const requiredFiles = uploads.selectedScholarship === "Labour Welfare" 
            ? ["studentIdCard", "aadharCard", "labourWelfareId", "smartCard"] 
            : ["file"];

        return requiredFiles.every(fileType => uploads.fileUploads[fileType]);
    };

    const handleSubmit = async () => {
        if (!validateFiles()) {
            alert("Please upload all required files.");
            return;
        }

        const updatedFilesDto = { ...uploads.fileUploads };

        try {
            // Replace with actual student ID from location state if needed
            const studentId = location.state.studentId;
            console.log("Fetching data for Student ID:", studentId);
            
            const response = await axios.post(
                `/api/student/${studentId}/update-files`,
                updatedFilesDto,
                { headers: { "Content-Type": "application/json" } }
            );
            
            alert("Files uploaded successfully!");
        } catch (error) {
            console.error("Error uploading files:", error);
            alert(error.response?.data?.message || "File upload failed. Please try again.");
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
                                <li key={type} onClick={() => handleScholarshipSelect(type)}>
                                    {type}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setUploads(prev => ({ ...prev, showModal: false }))}>Close</button>
                    </div>
                </div>
            )}

            {uploads.selectedScholarship && (
                <div className="file-upload-section">
                    <h3>Upload required documents for {uploads.selectedScholarship}</h3>
                    {uploads.selectedScholarship === "Labour Welfare" && (
                        <>
                            <div className="file-upload">
                                <label>Student ID Card</label>
                                <input type="file" onChange={handleFileChange('studentIdCard')} />
                            </div>
                            <div className="file-upload">
                                <label>Aadhar Card</label>
                                <input type="file" onChange={handleFileChange('aadharCard')} />
                            </div>
                            <div className="file-upload">
                                <label>Labour Welfare Document</label>
                                <input type="file" onChange={handleFileChange('labourWelfareId')} />
                            </div>
                            <div className="file-upload">
                                <label>Smart Card</label>
                                <input type="file" onChange={handleFileChange('smartCard')} />
                            </div>
                        </>
                    )}
                    {(uploads.selectedScholarship === "busPass" || uploads.selectedScholarship === "passport") && (
                        <div className="file-upload">
                            <label>Upload File</label>
                            <input type="file" onChange={handleFileChange('file')} />
                        </div>
                    )}
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            )}
            
            {/* Uncomment Footer if needed */}
            {/* <Footer /> */}
        </div>
    );
}

export default Bonafide;