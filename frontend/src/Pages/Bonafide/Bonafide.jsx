import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import './Bonafide.css';
import Header from '../../Components/Header/Header';
import AxiosInstance from '../../Api/AxiosInstance';
import { UtilityService } from '../../Utility/UtilityService';
import BackButton from '../../Components/backbutton/BackButton'

function Bonafide() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.studentId;
    const [applicableBonafide, setApplicableBonafide] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        { title: "Bonafide for TamilPudhalvan Scheme", id: "tamilPudhalvanScheme", image: "tamilpudhalvan.jpg", description: "For Boy students Who had studied in Government School From 6th-12th std Only." },
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

    const allWelfareTypes = ["Bonafide for Labour Welfare", "Bonafide for Tailor Welfare", "Bonafide for Farmer Welfare"];
    const allPostMatricTypes = ["Bonafide for BC/MBC/DNC Post Matric Scholarship", "Bonafide for SC/ST/SCA Post Matric Scholarship"];
    const typeToKeyMap = {
        "Bonafide for BC/MBC/DNC Post Matric Scholarship": "bcMbcDncPostMatricScholarship",
        "Bonafide for SC/ST/SCA Post Matric Scholarship": "scStScaPostMatricScholarship",
    };

    const bonafideTypeSection_B_Purposes = ["Bonafide for Welfare Scholarship","Bonafide for TamilPudhalvan Scheme","Bonafide for Pudhumai Penn Scheme","Bonafide for Post Matric Scholarships"];

    useEffect(() => {
        const fetchApplicableBonafide = async () => {
            try {
                const response = await AxiosInstance.get(`/bonafide/getApplicableBonafide/${userId}`);
                if (response.data?.data) {
                    setApplicableBonafide(response.data.data);
                    console.log("Received eligibility data:", response.data.data);

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

        if (!key) return false;

        if (Array.isArray(key)) {
            return key.some(k => applicableBonafide[k] === true);
        }

        return applicableBonafide[key] === true;
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
        // if (!uploads.academicYear) {
        //     toast.error("Please enter Academic Year");
        //     return false;
        // }

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFiles() || isSubmitting) return;

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('registerNo', userId);
        formData.append('purpose', uploads.selectedScholarship.toLowerCase().trim());
        console.log("Purpose being sent to backend:", uploads.selectedScholarship.toLowerCase().trim());
        formData.append('bonafideStatus', 'PENDING');
        formData.append('date', new Date().toISOString().split('T')[0]);
        formData.append('academicYear', UtilityService.getAcademicYear().toString());

        if(bonafideTypeSection_B_Purposes.includes(uploads.selectedScholarship)) {
            formData.append('bonafideType', 'BONAFIDE_TYPE_SECTION_B');
        } else {
            formData.append('bonafideType', 'BONAFIDE_TYPE_SECTION_S');
        }

        console.log("acadamic year:", formData.academicYear);

        if (uploads.companyName) {
            formData.append('companyName', uploads.companyName);
        }

        if (uploads.bankNameForEducationalLoan) {
            formData.append('bankNameForEducationalLoan', uploads.bankNameForEducationalLoan);
        }

        Object.entries(uploads.fileUploads).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            await AxiosInstance.post('/bonafide/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Bonafide submitted successfully!');
            console.log("Bonafide submitted successfully!");
            setUploads(prev => ({ ...prev, selectedScholarship: "" }));
            setTimeout(() => {
                navigate('/profile-page', { state: { userId } });
            }, 1500);

        } catch (err) {
            toast.error("Failed to submit Bonafide request.");
            console.error(err);
        }

        try {
            await AxiosInstance.post(`/email/notify-faculty/${userId}`);
        } catch (notifyErr) {
            toast.info("Failed to notify Faculty");
        }
        setIsSubmitting(false);
    };


    const instructions = [
        "You must be a student of this institution to apply for a bonafide certificate.",
        "For Post Matric Scholarships, you must not be receiving any Central Government Scholarship.",
        "As students who are benefitted by CENTRAL SCHOLARSHIP are not eligible for State Scholarship.",
        "The PUDHUMAI PENN SCHEME is exclusively for GIRL students who have studied in Government Schools from 6th to 12th standard.",
        "The TAMIL PUDHALVAN SCHEME is exclusively for BOY students who have studied in Government Schools from 6th to 12th standard.",
        "For Welfare Scholarships, you must provide relevant documents such as Aadhar Card, Smart Card, and Welfare Proof Document.",
        "To apply for bonafide Educational Support, you must provide your Student ID Card and Bank details ,where you had your account for Educational Loan.",
        "For Internship Bonafide, you must provide your Student ID Card and required details of the Company.",
        "For Bus Pass Bonafide, you must provide your Student ID Card and relevant documents.",
        "And if you are applying bonafide for bus pass to get it from TNSTC (Transport Corporation of Tamil Nadu), you must provide your Student ID Card along with your parent's ID proof.",
        "For all types of bonafide certificates, ensure that you have all the required documents ready for submission.",
        "If you didn't find your required bonafide certificate in the list, You may apply for 'Others' bonafide certificate.And kindly contact the administration for further assistance.",
    ];

    return (
        <div className="bonafide-container">
            <Header />
            <div className="bonafide-content">
            <div className="header-container">
            <BackButton />
            <h1>Bonafide Certificate Request</h1>
            </div>

                {/* <div className="bonafide-eligibility-container">

                   <div className="eligibility-box">
  <ul className="scrolling-list">
    {[...instructions, ...instructions].map((instruction, index) => (
      <li key={index}>{instruction}</li>
    ))}
  </ul>
</div>
                   <div className="events-list-box">
                    <h1 className='events-head'>Ongoing Events</h1>
                   </div>
                </div> */}
                <div className="bonafide-display-container">
                    {/* <BackButton /> */}
                    <h2>Select The Bonafide</h2>
                    {/* <BackButton /> */}
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

                {/* Modals */}
                {uploads.showCentralScholarshipCheck && (
                    <div className="modal-overlay" onClick={() => setUploads(prev => ({ ...prev, showCentralScholarshipCheck: false }))}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>Are you receiving any Central Government Scholarship?</h3>
                            <div className="confirmation-buttons">
                                <button
                                    onClick={() => {
                                        if (uploads.selectedOption === "postMatricScholarship") {
                                            toast.error("You are not eligible for State Scholarship.");
                                            setUploads(prev => ({
                                                ...prev,
                                                showCentralScholarshipCheck: false,
                                                selectedOption: "",
                                            }));
                                        } else {
                                            setUploads(prev => ({
                                                ...prev,
                                                showCentralScholarshipCheck: false
                                            }));
                                        }
                                    }}
                                >
                                    Yes
                                </button>

                                <button
                                    onClick={() => {
                                        setUploads(prev => ({
                                            ...prev,
                                            showCentralScholarshipCheck: false,
                                            selectedScholarship: "",
                                            showModal: true
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
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>Select Type of Scholarship</h3>
                            <ul>
                                {(uploads.selectedOption === "postMatricScholarship" ? allPostMatricTypes : allWelfareTypes).map((type) => {
                                    const eligible =
                                        uploads.selectedOption === "postMatricScholarship"
                                            ? applicableBonafide[typeToKeyMap[type]] === true
                                            : true;

                                    console.log(`Checking type "${type}" → Eligible:`, eligible);

                                    return (
                                        <li
                                            key={type}
                                            onClick={() => eligible && handleScholarshipSelect(type)}
                                            style={{
                                                color: eligible ? "#ffffff" : "gray",
                                                cursor: eligible ? "pointer" : "not-allowed",
                                                pointerEvents: eligible ? "auto" : "none"
                                            }}
                                        >
                                            {type} {!eligible && "(Not Eligible)"}
                                        </li>
                                    );
                                })}
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

                            {uploads.selectedOption === "internship" && (
                                <div className="file-upload">
                                    <label>Company Name</label>
                                    <input type="text" value={uploads.companyName} onChange={e => setUploads(prev => ({ ...prev, companyName: e.target.value }))} />
                                </div>
                            )}

                            {uploads.selectedOption === "educationalSupport" && (
                                <div className="file-upload">
                                    <label>Bank Name</label>
                                    <input type="text" value={uploads.bankNameForEducationalLoan} onChange={e => setUploads(prev => ({ ...prev, bankNameForEducationalLoan: e.target.value }))} />
                                </div>
                            )}
                            {/* 
                            <div className="file-upload">
                                <label>Academic Year</label>
                                <input type="text" placeholder="e.g. 2024-2025" value={uploads.academicYear} onChange={e => setUploads(prev => ({ ...prev, academicYear: e.target.value }))} />
                            </div> */}

                            <div className="file-upload-buttons">
                                <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </button>
                                <button className="close-button" onClick={() => setUploads(prev => ({ ...prev, selectedScholarship: "" }))}>Close</button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
            <ToastContainer />
        </div>
    );
}

export default Bonafide;
