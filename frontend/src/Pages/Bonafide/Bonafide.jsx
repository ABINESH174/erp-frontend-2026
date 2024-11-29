import React, { useState } from 'react';
import './Bonafide.css';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import axios from 'axios';

function Bonafide() {
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

    const [selectedOption, setSelectedOption] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [scholarshipTypes, setScholarshipTypes] = useState([]);
    const [selectedScholarship, setSelectedScholarship] = useState("");
    const [fileUploads, setFileUploads] = useState({});

    const handleCardClick = (optionId) => {
        setSelectedOption(optionId);

        if (optionId === "stateScholarship") {
            setScholarshipTypes(stateScholarships);
            setShowModal(true);
        } else if (optionId === "centralScholarship") {
            setScholarshipTypes(centralScholarships);
            setShowModal(true);
        } else if (optionId === "busPass" || optionId === "passport"||  optionId === "internship") {
            setSelectedScholarship(optionId);
        } else {
            console.log(`Selected option: ${optionId}`);
        }
    };

    const handleScholarshipSelect = (type) => {
        setSelectedScholarship(type);
        setShowModal(false);
    };

    const handleFileChange = (event, fileType) => {
        setFileUploads(prev => ({ ...prev, [fileType]: event.target.files[0] }));
    };

    const handleSubmit = async () => {
        const requiredFiles = selectedScholarship === "Labour Welfare" 
            ? ["studentIdCard", "aadharCard", "labourWelfare", "smartCard"] 
            : ["file"];
        
        for (const fileType of requiredFiles) {
            if (!fileUploads[fileType]) {
                alert(`Please upload ${fileType.replace(/([A-Z])/g, ' $1')}`);
                return;
            }
        }

        const formData = new FormData();
        requiredFiles.forEach(fileType => formData.append(fileType, fileUploads[fileType]));

        try {
            // await axios.post("http://localhost:5000/upload", formData);
            alert("Files uploaded successfully!");
        } catch (error) {
            console.error("Error uploading files:", error);
            alert("File upload failed. Please try again.");
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

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Select Type of Scholarship</h3>
                        <ul>
                            {scholarshipTypes.map((type) => (
                                <li key={type} onClick={() => handleScholarshipSelect(type)}>
                                    {type}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {selectedScholarship && (
                <div className="file-upload-section">
                    <h3>Upload required documents for {selectedScholarship}</h3>
                    {selectedScholarship === "Labour Welfare" && (
                        <>
                            <div className="file-upload">
                                <label>Student ID Card</label>
                                <input type="file" onChange={(e) => handleFileChange(e, 'studentIdCard')} />
                            </div>
                            <div className="file-upload">
                                <label>Aadhar Card</label>
                                <input type="file" onChange={(e) => handleFileChange(e, 'aadharCard')} />
                            </div>
                            <div className="file-upload">
                                <label>Labour Welfare Document</label>
                                <input type="file" onChange={(e) => handleFileChange(e, 'labourWelfare')} />
                            </div>
                            <div className="file-upload">
                                <label>Smart Card</label>
                                <input type="file" onChange={(e) => handleFileChange(e, 'smartCard')} />
                            </div>
                        </>
                    )}
                    {(selectedScholarship === "busPass" || selectedScholarship === "passport") && (
                        <div className="file-upload">
                            <label>Upload File</label>
                            <input type="file" onChange={(e) => handleFileChange(e, 'file')} />
                        </div>
                    )}
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default Bonafide;
