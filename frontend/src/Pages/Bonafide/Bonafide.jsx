// src/pages/Bonafide/Bonafide.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import './Bonafide.css';
import Header from '../../Components/Header/Header';
// import Footer from '../../Components/Footer/Footer';
import axios from 'axios';

function Bonafide() {
    const location = useLocation();
    const navigate = useNavigate();

    const options = [
        { title: "Bonafide for Post Matric Scholarships", id: "postMatricScholarship",image: "tinystudents.jpg" ,discription: "Post Matric Scholarships for  BC/ MBC/DNC and SC/ST/SCA students." },
        { title: "Bonafide for Pudhumai Penn Scheme",id:"pudhumaiPennScheme",image:"pudhumai.jpeg",discription: "For Pudhumai Penn." },
        { title: "Bonafide for TamilPudhalvan Scheme",id:"tamilPudhalvanScheme",image:"tamilpudhalvan.jpg",discription: "For Tamil Pudhalvan." },
        { title: "Bonafide for Welfare Scholarship", id: "welfareScholarship", image: "welfare.jpeg", discription: "For state-specific scholarships like Labour Welfare, Tailor Welfare, and Farmer Welfare." },
        { title: "Bonafide for Educational Support",id:"educationalSupport",image:"scholarshiphands.jpg",discription: "For educational support." },
        { title: "Bonafide for Internship", id: "internship", image: "of.png", discription: "For internship applications." },
        { title: "Bonafide for Bus Pass", id: "busPass", image: "buspass.jpg", discription: "For bus pass applications." },
        { title: "Bonafide for Passport", id: "passport", image: "passport.jpg", discription: "For passport applications." },
        { title: "Bonafide for Others", id: "others", image: "others.jpeg", discription: "For other purposes." }
    ];

    const welfareScholarships = ["Labour Welfare", "Tailor Welfare", "Farmer Welfare"];
    const postMatricScholarships= [" BC/MBC/DNC Post Matric Scholarship","SC/ST/SCA Post Matric Scholarship"];

    const [uploads, setUploads] = useState({
        selectedOption: "",
        showModal: false,
        showCentralScholarshipCheck: false,
        scholarshipTypes: [],
        selectedScholarship: "",
        fileUploads: {}
    });

    const handleCardClick = (optionId) => {
    const title = options.find(option => option.id === optionId)?.title || "";

    if (optionId === "postMatricScholarship") {
        setUploads(prev => ({
            ...prev,
            selectedOption: optionId,
            showCentralScholarshipCheck: true, 
            selectedScholarship: "",
            scholarshipTypes: []
        }));
    } else {
        setUploads(prev => ({
            ...prev,
            selectedOption: optionId,
            selectedScholarship: optionId === "welfareScholarship" ? "" : title,
            scholarshipTypes: optionId === "welfareScholarship" ? welfareScholarships : [],
            showModal: optionId === "welfareScholarship"
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
        if (["Labour Welfare", "Farmer Welfare", "Tailor Welfare"].includes(uploads.selectedScholarship)) {
            const requiredFiles = ["aadharCardFile","labourWelfareFile", "smartCardFile", "studentIdCardFile"];
            return requiredFiles.every(fileType => uploads.fileUploads[fileType]);
        }
        return !!uploads.fileUploads["studentIdCardFile"];
    };

    const handleSubmit = async () => {
        if (!validateFiles()) {
            toast.error("Please upload all required files.");
            return;
        }

        try {
            const userId = location.state?.studentId;
            const formData = new FormData();
            formData.append('registerNo', userId);
            formData.append('purpose', uploads.selectedScholarship.toLowerCase().trim());

            if (uploads.fileUploads.companyName) {
                formData.append('companyName', uploads.fileUploads.companyName);
            }

            if (uploads.fileUploads.welfareId) {
                formData.append('welfareId', uploads.fileUploads.welfareId);
            }

            Object.entries(uploads.fileUploads).forEach(([key, file]) => {
                formData.append(key, file);
            });

            formData.append('bonafideStatus', 'PENDING');
            formData.append('date', new Date().toISOString().split('T')[0]);

            await axios.post('/api/bonafide/create', formData, {
                headers: {
                    'Content-Type': 'multipa    rt/form-data',
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
                <div className="bonafide-heading-bar">
                    <h1>Bonafide Certificate Request</h1>
                </div>
                <div className="details-on-bonafide">
                    <div className="eligibility-box">
                        <h2>Eligibility Criteria</h2>
                        <ul className='eligibility-list'>
                         <li>Must be a registered student of the institution</li>
                        <li>Must have a valid ID proof</li>
                        <li>Must be a registered student</li>   
                        <li>Valid ID proof is required</li>
                        <li>Application form must be filled completely</li>
                        <li>Must adhere to the submission deadlines</li>
                        <li>For state scholarships, additional documents may be required</li>
                        <li>For central scholarships, specific eligibility criteria apply</li>

                        </ul>
                    </div>
                    <div className="Requirements-box">
                        <h2>Requirements Details</h2>
                        <ul  className='requirements-list'>
                            <li>Valid Student ID Card</li>
                             
                        
                        </ul>
                    </div>
                </div>
                <div className="bonafide-display-container">
                <h2>Select The Bonafide</h2>
                <div className="bonafide-cards-container">
                    {options.map((option) => (
                        <div className="bonafide-cards">
                        <div
                            key={option.id}
                            className="bonafide-card"
                            onClick={() => handleCardClick(option.id)}
                        >   
                            <img src={require(`../../Assets/${option.image}`)} alt={option.title} className="bonafide-card-image" />
                            <h3>{option.title}</h3>
                               
                        </div>
                        <div className="bonafide-card-description">
                            <h4>{option.title}</h4>
                            <p>{option.discription}</p>

                         <div className='apply-here-btn' onClick={() => handleCardClick(option.id)}>Apply</div>
                        </div>
                        </div>
                    ))}
                </div>
                </div>
            </div>

            {uploads.showCentralScholarshipCheck && (
    <div className="modal-overlay" onClick={() => setUploads(prev => ({ ...prev, showCentralScholarshipCheck: false }))}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Are you receiving any Central Government Scholarship?(Like Pragati,Saksham,Swanath Schloarships)</h3>
            <div className="confirmation-buttons">
                <button
                    onClick={() => {
                        toast.error("You are not eligible for State Scholarship if receiving Central Scholarship.");
                        setUploads(prev => ({
                            ...prev,
                            showCentralScholarshipCheck: false,
                            selectedOption: "" 
                        }));
                    }}
                >
                    Yes
                </button>
                <button
                    onClick={() => {
                        // Proceed to show list of scholarships
                        setUploads(prev => ({
                            ...prev,
                            showCentralScholarshipCheck: false,
                            showModal: true,
                            scholarshipTypes: postMatricScholarships,
                            selectedScholarship: "" // allow choosing inside modal
                        }));
                    }}
                >
                    No
                </button>
            </div>
        </div>
    </div>
    
)}


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
    <div className="file-modal-overlay" onClick={() => setUploads(prev => ({ ...prev, selectedScholarship: "" }))}>
        <div className="modal-content  file-upload-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Upload required documents for {uploads.selectedScholarship}</h3>

            <div className="file-upload">
                <label>Student ID Card</label>
                <input type="file" onChange={handleFileChange('studentIdCardFile')} />
            </div>

            {["Labour Welfare", "Farmer Welfare", "Tailor Welfare"].includes(uploads.selectedScholarship) && (
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
             {/* Extra input if Educational Support is selected  */}
           {uploads.selectedScholarship === "Educational Support" && (
                 <div className="company-name-input">
        <label>Bank Name</label>
        <input
            type="text"
            placeholder="Enter Bank name"
            onChange={(e) => setUploads(prev => ({
                ...prev,
                fileUploads: { ...prev.fileUploads, companyName: e.target.value }
            }))}
               />
                 </div>
            )}

            {uploads.selectedScholarship === "Bonafide for Internship" && (
                <div className="company-name-input">
                    <label>Company Name</label>
                    <input
                        type="text"
                        placeholder="Enter Company name"
                        onChange={(e) => setUploads(prev => ({
                            ...prev,
                            fileUploads: { ...prev.fileUploads, companyName: e.target.value }
                        }))}
                    />
                </div>
            )}

            <div className="academic-year">
                <label>Academic Year</label>
                <input type="text" placeholder="Enter Academic Year *Like 2023-2024*" onChange={handleFileChange('academicYear')} />
            </div>
            <div className="file-upload-buttons">
                <button className="submit-button" onClick={handleSubmit}>Submit</button>
                <button className="close-button"  onClick={() => setUploads(prev => ({ ...prev, selectedScholarship: "" }))}>Close</button>
            </div>

           
        </div>
    </div>
)}
            <ToastContainer />
            {/* <Footer /> */}
        </div>
    );
}

export default Bonafide;
