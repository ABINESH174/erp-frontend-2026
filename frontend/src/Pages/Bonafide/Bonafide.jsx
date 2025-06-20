// src/pages/Bonafide/Bonafide.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import './Bonafide.css';
import Header from '../../Components/Header/Header';
import axios from 'axios';

function Bonafide() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.studentId;

    const [applicableBonafide, setApplicableBonafide] = useState({});
    const [uploads, setUploads] = useState({
        selectedOption: "",
        showModal: false,
        showCentralScholarshipCheck: false,
        selectedScholarship: "",
        fileUploads: {}
    });

    const options = [
        { title: "Bonafide for Post Matric Scholarships", id: "postMatricScholarship", image: "tinystudents.jpg", description: "Post Matric Scholarships for BC/ MBC/DNC and SC/ST/SCA students." },
        { title: "Bonafide for Pudhumai Penn Scheme", id: "pudhumaiPennScheme", image: "pudhumai.jpeg", description: "For Pudhumai Penn." },
        { title: "Bonafide for TamilPudhalvan Scheme", id: "tamilPudhalvanScheme", image: "tamilpudhalvan.jpg", description: "For Tamil Pudhalvan." },
        { title: "Bonafide for Welfare Scholarship", id: "welfareScholarship", image: "welfare.jpeg", description: "For state-specific scholarships like Labour Welfare, Tailor Welfare, and Farmer Welfare." },
        { title: "Bonafide for Educational Support", id: "educationalSupport", image: "scholarshiphands.jpg", description: "For educational support." },
        { title: "Bonafide for Internship", id: "internship", image: "of.png", description: "For internship applications." },
        { title: "Bonafide for Bus Pass", id: "busPass", image: "buspass.jpg", description: "For bus pass applications." },
        { title: "Bonafide for Passport", id: "passport", image: "passport.jpg", description: "For passport applications." },
        { title: "Bonafide for Others", id: "others", image: "others.jpeg", description: "For other purposes." }
    ];

    // Map frontend option IDs to backend DTO keys
    const bonafideEligibilityKeyMap = {
        postMatricScholarship: ["bcMbcDncPostMatricScholarship", "scStScaPostMatricScholarship"],
        pudhumaiPennScheme: "pudhumaiPennScholarship",
        tamilPudhalvanScheme: "tamilPudhalvanScholarship",
        welfareScholarship: ["labourWelfareScholarship", "tailorWelfareScholarship", "farmerWelfareScholarship"],
        educationalSupport: "applyEducationSupport",
        internship: "applyInternship",
        busPass: "applyBusPass",
        passport: "applyPassport",
        others: true
    };

    const allWelfareTypes = ["Labour Welfare", "Tailor Welfare", "Farmer Welfare"];
    const allPostMatricTypes = [" BC/MBC/DNC Post Matric Scholarship", "SC/ST/SCA Post Matric Scholarship"];

    useEffect(() => {
        const fetchApplicableBonafide = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/bonafide/getApplicableBonafide/${userId}`);
                if (response.data?.data) {
                    setApplicableBonafide(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching bonafide eligibility", error);
                toast.error("Unable to fetch eligibility data.");
            }
        };

        if (userId) fetchApplicableBonafide();
    }, [userId]);

    const isEligible = (optionId) => {
        const key = bonafideEligibilityKeyMap[optionId];
        if (key === true) return true;
        if (Array.isArray(key)) {
            return key.some(k => applicableBonafide[k]);
        }
        return applicableBonafide[key];
    };

    const handleCardClick = (optionId) => {
        const title = options.find(option => option.id === optionId)?.title || "";

        if (optionId === "postMatricScholarship") {
            setUploads(prev => ({
                ...prev,
                selectedOption: optionId,
                showCentralScholarshipCheck: true,
                selectedScholarship: "",
            }));
        } else if (optionId === "welfareScholarship") {
            setUploads(prev => ({
                ...prev,
                selectedOption: optionId,
                selectedScholarship: "",
                showModal: true,
            }));
        } else {
            setUploads(prev => ({
                ...prev,
                selectedOption: optionId,
                selectedScholarship: title,
            }));
        }
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
        const required = ["studentIdCardFile"];
        if (allWelfareTypes.includes(uploads.selectedScholarship)) {
            required.push("aadharCardFile", "smartCardFile", "labourWelfareFile");
        }

        return required.every(f => uploads.fileUploads[f]);
    };

    const handleSubmit = async () => {
        if (!validateFiles()) {
            toast.error("Please upload all required files.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('registerNo', userId);
            formData.append('purpose', uploads.selectedScholarship.toLowerCase().trim());
            formData.append('bonafideStatus', 'PENDING');
            formData.append('date', new Date().toISOString().split('T')[0]);

            Object.entries(uploads.fileUploads).forEach(([key, value]) => {
                formData.append(key, value);
            });

            await axios.post('/api/bonafide/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success("Bonafide submitted successfully!");
            setTimeout(() => navigate('/profile-page', { state: { userId } }), 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed.");
        }
    };

    return (
        <div className="bonafide-container">
            <Header />
            <div className="bonafide-content">
                <div className="bonafide-heading-bar">
                    <h1>Bonafide Certificate Request</h1>
                </div>

                <div className="bonafide-display-container">
                    <h2>Select The Bonafide</h2>
                    <div className="bonafide-cards-container">
                        {options.map(option => (
                            <div className="bonafide-cards" key={option.id}>
                                <div
                                    className={`bonafide-card ${!isEligible(option.id) ? 'disabled' : ''}`}
                                    onClick={() => isEligible(option.id) && handleCardClick(option.id)}
                                >
                                    <img src={require(`../../Assets/${option.image}`)} alt={option.title} className="bonafide-card-image" />
                                    <h3>{option.title}</h3>
                                </div>
                                <div className="bonafide-card-description">
                                    <h4>{option.title}</h4>
                                    <p>{option.description}</p>
                                    {isEligible(option.id) ? (
                                        <div className='apply-here-btn' onClick={() => handleCardClick(option.id)}>Apply</div>
                                    ) : (
                                        <div className='apply-here-btn disabled'>Not Eligible</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Central Govt Scholarship Modal */}
                {uploads.showCentralScholarshipCheck && (
                    <div className="modal-overlay" onClick={() => setUploads(prev => ({ ...prev, showCentralScholarshipCheck: false }))}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>Are you receiving any Central Government Scholarship?</h3>
                            <div className="confirmation-buttons">
                                <button onClick={() => {
                                    toast.error("You are not eligible for State Scholarship.");
                                    setUploads(prev => ({
                                        ...prev,
                                        showCentralScholarshipCheck: false,
                                        selectedOption: ""
                                    }));
                                }}>Yes</button>
                                <button onClick={() => {
                                    setUploads(prev => ({
                                        ...prev,
                                        showCentralScholarshipCheck: false,
                                        selectedScholarship: "",
                                        showModal: true
                                    }));
                                }}>No</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal for selecting scholarship type */}
                {uploads.showModal && (
                    <div className="modal-overlay" onClick={() => setUploads(prev => ({ ...prev, showModal: false }))}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>Select Type of Scholarship</h3>
                            <ul>
                                {(uploads.selectedOption === "postMatricScholarship" ? allPostMatricTypes : allWelfareTypes).map(type => (
                                    <li key={type} onClick={() => handleScholarshipSelect(type)}>{type}</li>
                                ))}
                            </ul>
                            <button onClick={() => setUploads(prev => ({ ...prev, showModal: false }))}>Close</button>
                        </div>
                    </div>
                )}

                {/* File Upload Modal */}
                {uploads.selectedScholarship && (
                    <div className="file-modal-overlay" onClick={() => setUploads(prev => ({ ...prev, selectedScholarship: "" }))}>
                        <div className="modal-content file-upload-modal" onClick={e => e.stopPropagation()}>
                            <h3>Upload required documents for {uploads.selectedScholarship}</h3>
                            <div className="file-upload">
                                <label>Student ID Card</label>
                                <input type="file" onChange={handleFileChange('studentIdCardFile')} />
                            </div>
                            {allWelfareTypes.includes(uploads.selectedScholarship) && (
                                <>
                                    <div className="file-upload">
                                        <label>Aadhar Card</label>
                                        <input type="file" onChange={handleFileChange('aadharCardFile')} />
                                    </div>
                                    <div className="file-upload">
                                        <label>Smart Card</label>
                                        <input type="file" onChange={handleFileChange('smartCardFile')} />
                                    </div>
                                    <div className="file-upload">
                                        <label>Welfare Proof Document</label>
                                        <input type="file" onChange={handleFileChange('labourWelfareFile')} />
                                    </div>
                                </>
                            )}
                            <div className="file-upload-buttons">
                                <button className="submit-button" onClick={handleSubmit}>Submit</button>
                                <button className="close-button" onClick={() => setUploads(prev => ({ ...prev, selectedScholarship: "" }))}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
                <ToastContainer />
            </div>
        </div>
    );
}

export default Bonafide;
