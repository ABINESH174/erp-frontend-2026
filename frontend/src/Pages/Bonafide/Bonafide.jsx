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
        fileUploads: {},
        academicYear: "",
        companyName: "",
        bankNameForEducationalLoan: ""
    });

    const options = [
        { title: "Bonafide for Post Matric Scholarships", id: "postMatricScholarship", image: "tinystudents.jpg", description: "Post Matric Scholarships for BC/ MBC/DNC and SC/ST/SCA students Only." },
        { title: "Bonafide for Pudhumai Penn Scheme", id: "pudhumaiPennScheme", image: "pudhumai.jpeg", description: "For Girl students Who had studied in Government School From 6th-12th std Only." },
        { title: "Bonafide for TamilPudhalvan Scheme", id: "tamilPudhalvanScheme", image: "tamilpudhalvan.jpg", description: "For Boy    students Who had studied in Government School From 6th-12th std Only." },
        { title: "Bonafide for Welfare Scholarship", id: "welfareScholarship", image: "welfare.jpeg", description: "Welfare Schemes for Labour, Tailor, Farmer ." },
        { title: "Bonafide for Educational Support", id: "educationalSupport", image: "scholarshiphands.jpg", description: "Educational support schemes for students." },
        { title: "Bonafide for Internship", id: "internship", image: "of.png", description: "Internship applications Bonafide for Students ." },
        { title: "Bonafide for Bus Pass", id: "busPass", image: "buspass.jpg", description: "Bus Pass applications Bonafide for Students Only ." },
        { title: "Bonafide for Passport", id: "passport", image: "passport.jpg", description: "Passport applications Bonafide for Students Only ." },
        { title: "Bonafide for Others", id: "others", image: "others.jpeg", description: "For other purposes." }
    ];

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
        if (Array.isArray(key)) return key.some(k => applicableBonafide[k]);
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
        if (!uploads.academicYear) {
            toast.error("Please enter Academic Year");
            return false;
        }

        if (uploads.selectedOption === "internship" && !uploads.companyName) {
            toast.error("Please enter Company Name");
            return false;
        }

        if (uploads.selectedOption === "educationalSupport" && !uploads.bankNameForEducationalLoan) {
            toast.error("Please enter Bank Name");
            return false;
        }

        return required.every(f => uploads.fileUploads[f]);
    };

    const handleSubmit = async () => {
  if (!validateFiles()) return;

  try {
    const formData = new FormData();
    formData.append('registerNo', userId);
    formData.append('purpose', uploads.selectedScholarship.toLowerCase().trim());
    formData.append('bonafideStatus', 'PENDING');
    formData.append('date', new Date().toISOString().split('T')[0]);

    formData.append('academicYear', uploads.academicYear);
    if (uploads.companyName) {
      formData.append('companyName', uploads.companyName);
    }
    if (uploads.bankNameForEducationalLoan) {
      formData.append('bankNameForEducationalLoan', uploads.bankNameForEducationalLoan);
    }

    Object.entries(uploads.fileUploads).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Debug: Log form data before sending
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    await axios.post('/api/bonafide/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    // Notify faculty about the new bonafide request via email
    await axios.post(`/api/email/notify-faculty/${userId}`);

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

                {/* Central Scholarship Modal */}
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

                {/* Scholarship Type Modal */}
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

                {/* Upload Modal */}
                {uploads.selectedScholarship && (
                    <div className="file-modal-overlay" onClick={() => setUploads(prev => ({ ...prev, selectedScholarship: "" }))}>
                        <div className="modal-content file-upload-modal" onClick={e => e.stopPropagation()}>
                            <h3>Upload required documents for {uploads.selectedScholarship}</h3>

                            {/* Student ID Card */}
                            <div className="file-upload">
                                <label>Student ID Card</label>
                                <input type="file" onChange={handleFileChange('studentIdCardFile')} />
                            </div>

                            {/* Welfare files */}
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

                            {/* Internship - Company Name */}
                            {uploads.selectedOption === "internship" && (
                                <div className="file-upload">
                                    <label>Company Name</label>
                                    <input type="text" value={uploads.companyName} onChange={e => setUploads(prev => ({ ...prev, companyName: e.target.value }))} />
                                </div>
                            )}

                            {/* Educational Support - Bank Name */}
                            {uploads.selectedOption === "educationalSupport" && (
                                <div className="file-upload">
                                    <label>Bank Name</label>
                                    <input type="text" value={uploads.bankNameForEducationalLoan} onChange={e => setUploads(prev => ({ ...prev, bankNameForEducationalLoan: e.target.value }))} />
                                </div>
                            )}

                            {/* Academic Year */}
                            <div className="file-upload">
                                <label>Academic Year</label>
                                <input type="text" placeholder="e.g. 2024-2025" value={uploads.academicYear} onChange={e => setUploads(prev => ({ ...prev, academicYear: e.target.value }))} />
                            </div>

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
