import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profilepage.css";
import { useLocation,useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header.jsx";
import Allbuttons from "../../Components/Allbuttons/Allbuttons.jsx";
import Logout from '../../Assets/logout.svg';
import Menu from '../../Assets/menu.svg';
import bonafide from '../../Assets/bonafide.svg';
import bonafidestatus from '../../Assets/bonafidestatus.svg';
import AxiosInstance from "../../Api/AxiosInstance.js";


function StudentDisplay() {

  const location = useLocation();
  const navigate = useNavigate();

  console.log(location);

  const [studentWithFiles, setStudentWithFiles] = useState();
  const [studentId, setStudentId] = useState(location.state.userId);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [displaySection, setDisplaySection] = useState("personal");
  const handleLogoutClick = () => {
    navigate('/login-page');
  };
  const handleBonafideClick = () => {
    navigate('/bonafide-page',{state: {studentId}});
  };
  const handleBonafideStatusClick = () => {
    navigate('/bonafide-status-page', { state: {studentId} });
  };
  
  const handleMenuClick = () => {
    setIsVisible(!isVisible);
  };


  const getLinkStyle = (section) => {
    return displaySection === section
      ? {
          borderRadius: "6px",
          opacity: "1",
          padding: "5px",
          background: "rgba(255, 255, 255, 0.4)",
          boxSizing: "border-box",
          border: "1px solid rgba(255, 255, 255, 0.68)",
          backdropFilter: " blur(5px)",
          transition: "all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        }
      : {};
  };
  const getMimeType = (base64) => {
    if (base64.startsWith("/9j/")) {
      return "image/jpeg"; // JPEG image
    } else if (base64.startsWith("iVBORw0KGgo")) {
      return "image/png"; // PNG image
    } else if (base64.startsWith("JVBERi0")) {
      return "application/pdf"; // PDF document
    }
    return "";
  };

  const getExtension = (mimeType) => {
    if (mimeType === "image/jpeg") {
      return "jpeg";
    } else if (mimeType === "application/pdf") {
      return "pdf";
    }
    return "";
  };
  useEffect(() => {
    const fetchStudentWithFiles = async () => {
        try {
            console.log("Fetching data for Student ID:", studentId);
            
            const response = await AxiosInstance.get(
                `/student/${studentId}`
            );
            console.log("Response data:", response.data);
            setStudentWithFiles(response.data);
            setLoading(false); 
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error);
            setLoading(false);
        }
    };

    fetchStudentWithFiles();
}, [location.state.userId]);

  const handleSectionClick = (section) => {
    setDisplaySection(section);
    setIsVisible(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !studentWithFiles) {
    return <div>Error: {error ? error.message : "Student data not found"}</div>;
  }
  const profilePhotoMimeType = studentWithFiles.profilePhotoContent
    ? getMimeType(studentWithFiles.profilePhotoContent)
    : "";
  const communityCertificateMimeType = studentWithFiles.communityCertificateContent
    ? getMimeType(studentWithFiles.communityCertificateContent)
    : "";
  const passbookMimeType = studentWithFiles.passbookcontent
    ? getMimeType(studentWithFiles.passbookcontent)
    : "";
  const sslcMimeType = studentWithFiles.sslcFileContent
    ? getMimeType(studentWithFiles.sslcFileContent)
    : "";
  const hsc1MimeType = studentWithFiles.hsc1YearFileContent
    ? getMimeType(studentWithFiles.hsc1YearFileContent)
    : "";
  const hsc2MimeType = studentWithFiles.hsc2YearFileContent
    ? getMimeType(studentWithFiles.hsc2YearFileContent)
    : "";
  const diplomaMimeType = studentWithFiles.diplomaFileContent
    ? getMimeType(studentWithFiles.diplomaFileContent)
    : "";
  const firstGraduateFileMimeType = studentWithFiles.firstGraduateFileContent
    ? getMimeType(studentWithFiles.firstGraduateFileContent)
    : "";
  const specialCategoryFileMimeType = studentWithFiles.specialCategoryFileContent
    ? getMimeType(studentWithFiles.specialCategoryFileContent)
    : "";

  const passbookExtension = getExtension(passbookMimeType);
  const communityCertificateExtension = getExtension(passbookMimeType);
  const sslcExtension = getExtension(sslcMimeType);
  const hsc1Extension = getExtension(hsc1MimeType);
  const hsc2Extension = getExtension(hsc2MimeType);
  const diplomaExtension = getExtension(diplomaMimeType);
  const firstGraduateFileExtension = getExtension(firstGraduateFileMimeType);
  const specialCategoryFileExtension = getExtension(specialCategoryFileMimeType);
  console.log(profilePhotoMimeType)
  return (
    <div>
      <Header />
      <div className="nav">
     
        {/* <button classN ame="bonafide_button" onClick={handleBonafideClick}>Bonafide</button> */}
        <button className="menu" onClick={handleMenuClick}>
          <img src={Menu} alt="" />
        </button>
      </div>

    <div className="profile_display">

      <div className="profile-links-desktop">
          <ul>
            <li
              className="profile_links"
              style={getLinkStyle("personal")}
              onClick={() => handleSectionClick("personal")}
            >
              Personal Details
            </li>
            <li
              className="profile_links"
              style={getLinkStyle("communication")}
              onClick={() => handleSectionClick("communication_bank")}
            >
              Communication & Bank Details
            </li>
            <li
              className="profile_links"
              style={getLinkStyle("education")}
              onClick={() => handleSectionClick("education")}
            >
              Educational Details
            </li>
            <li
              className="profile_links"
              style={getLinkStyle("academic")}
              onClick={() => handleSectionClick("academic")}
            >
              Academic Details
            </li>
          </ul>

          <Allbuttons value="Logout" image={Logout} target={handleLogoutClick}/>
          <Allbuttons value="Bonafide" image={bonafide} target={handleBonafideClick}/>
          <Allbuttons value="Bonafide Status" image={bonafidestatus} target={handleBonafideStatusClick} />
        </div>
        
      <div className="profile">
      {isVisible && (
       <div className="hi">
       <div className="profile-links">
          <ul>
            <li
              className="profile_links"
              style={getLinkStyle("personal")}
              onClick={() => handleSectionClick("personal")}
            >
              Personal Details
            </li>
            <li
              className="profile_links"
              style={getLinkStyle("communication")}
              onClick={() => handleSectionClick("communication_bank")}
            >
              Communication & Bank Details
            </li>
            <li
              className="profile_links"
              style={getLinkStyle("education")}
              onClick={() => handleSectionClick("education")}
            >
              Educational Details
            </li>
            <li
              className="profile_links"
              style={getLinkStyle("academic")}
              onClick={() => handleSectionClick("academic")}
            >
              Academic Details
            </li>
          </ul>

          <Allbuttons value="Logout" image={Logout} target={handleLogoutClick}/>
        </div>
       </div>
      )
    }

        {displaySection === "personal" && (
          <div className="profile-personal-display">
            <div className="profile_name">
              <p className="profile_lables">Name </p>
              <p className="field_bckground">
                {studentWithFiles.firstName} {studentWithFiles.lastName}
              </p>
            </div>
        

            <div className="profile_date_of_birth">
              <p className="profile_lables">Date of Birth</p>
              <p className="field_bckground">
                {studentWithFiles.dateOfBirth}
              </p>
            </div>
            <div className="profile_profile_photo">
              {profilePhotoMimeType && studentWithFiles.profilePhotoContent && (
                <img
                  id="user_profile_photo"
                  src={`data:${profilePhotoMimeType};base64,${studentWithFiles.profilePhotoContent}`}
                  alt="Profile"
                />
              )}
            </div>
            <div className="profile_gender">
              <p className="profile_lables">Gender</p>
              <p className="field_bckground">{studentWithFiles.gender}</p>
            </div>
            <div className="profile_aadhar_number">
              <p className="profile_lables">Aadhar Number</p>
              <p className="field_bckground">
                {studentWithFiles.aadharNumber}
              </p>
            </div>
            <div className="profile_gender">
              <p className="profile_lables">Blood Group</p>
              <p className="field_bckground">{studentWithFiles.bloodGroup}</p>
            </div>
            <div className="profile_nationality">
              <p className="profile_lables">Nationality</p>
              <p className="field_bckground"> {studentWithFiles.nationality}</p>
            </div>
            <div className="profile_religion">
              <p className="profile_lables">Religion</p>
              <p className="field_bckground"> {studentWithFiles.religion}</p>
            </div>
            <div className="profile_community">
              <p className="profile_lables">Community</p>
              <p className="field_bckground"> {studentWithFiles.community}</p>
            </div>
            <div className="profile_caste">
              <p className="profile_lables">Caste</p>
              <p className="field_bckground"> {studentWithFiles.caste}</p>
            </div>
            <div className="profile_fathers_name">
              <p className="profile_lables">Father's Name</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.fathersName}
              </p>
            </div>
            <div className="profile_fathers_occupation">
              <p className="profile_lables">Father's Occupation</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.fathersOccupation || "NA" }
              </p>
            </div>
            <div className="profile_fathers_mobile_number">
              <p className="profile_lables">Father's Mobile Number</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.fathersMobileNumber || "NA" }
              </p>
            </div>
            <div className="profile_mothers_name">
              <p className="profile_lables">Mother's Name</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.mothersName}
              </p>
            </div>
            <div className="profile_mothers_occupation">
              <p className="profile_lables">Mother's Occupation</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.mothersOccupation || "NA" }
              </p>
            </div>
            <div className="profile_mothers_mobile_number">
              <p className="profile_lables">Mother's Mobile Number</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.mothersMobileNumber || "NA" }
              </p>
            </div>
            <div className="profile_guardians_name">
              <p className="profile_lables">Guardian's Name</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.guardiansName || "NA" }
              </p>
            </div>
            <div className="profile_guardians_occupation">
              <p className="profile_lables">Guardian's Occupation</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.guardiansOccupation || "NA" }
              </p>
            </div>
            <div className="profile_guardian_mobile_number">
              <p className="profile_lables">Guardian's Mobile Number</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.guardiansMobileNumber || "NA" }
              </p>
            </div>
            <div className="profile_parents_status">
              <p className="profile_lables">Parents Status</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.parentsStatus}
              </p>
            </div>
            <div className="profile_income">
              <p className="profile_lables">Income</p>
              <p className="field_bckground"> {studentWithFiles.income}</p>
            </div>
            <div className="profile_marital_status">
              <p className="profile_lables">Marital Status</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.maritalStatus}
              </p>
            </div>

            <div className="file_download community_certifibate_download">
              {communityCertificateMimeType && studentWithFiles.communityCertificateContent && (
                <a
                  className="marksheet_download_links"
                  href={`data:${communityCertificateMimeType};base64,${studentWithFiles.communityCertificateContent}`}
                  download={`communityCertificate.${communityCertificateExtension}`}
                >
                  Download Community Certificate
                </a>
              )}
            </div>
          </div>
        )}

        {displaySection === "communication_bank" && (
          <div className="profile-communication-display">
            <div className="profile_mobile_number">
              <p className="profile_lables">Mobile Number</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.mobileNumber}
              </p>
            </div>
            <div className="profile_email_id">
              <p className="profile_lables">Email ID</p>
              <p className="field_bckground"> {studentWithFiles.emailid}</p>
            </div>
            <div className="profile_residential_address">
              <p className="profile_lables">Residential Address</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.residentialAddress}
              </p>
            </div>
            <div className="profile_communication_address">
              <p className="profile_lables">Communication Address</p>
              <p className="field_bckground">
                {studentWithFiles.communicationAddress}
              </p>
            </div>
            <div className="profile_hosteller">
              <p className="profile_lables">Hosteller</p>
              <p className="field_bckground">{studentWithFiles.hosteller}</p>
            </div>
            <div className="profile_hostel_type">
              <p className="profile_lables">Hostel Type</p>
              <p className="field_bckground">{studentWithFiles.hostelType}</p>
            </div>
            <div className="profile_bank_name">
              <p className="profile_lables">Bank Name</p>
              <p className="field_bckground"> {studentWithFiles.bankName}</p>
            </div>

            <div className="profile_ifsc_code">
              <p className="profile_lables">IFSC Code</p>
              <p className="field_bckground"> {studentWithFiles.ifscCode}</p>
            </div>

            <div className="profile_branch_name">
              <p className="profile_lables">Branch Name</p>
              <p className="field_bckground">{studentWithFiles.branchName}</p>
            </div>

            <div className="profile_account_number">
              <p className="profile_lables">Account Number</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.accountNumber}
              </p>
            </div>
            <div className="file_download">
              {passbookMimeType && studentWithFiles.passbookcontent && (
                <a
                  className="marksheet_download_links"
                  href={`data:${passbookMimeType};base64,${studentWithFiles.passbookcontent}`}
                  download={`passbook.${passbookExtension}`}
                >
                  Download Passbook
                </a>
              )}
            </div>
          </div>
        )}

        {displaySection === "education" && (
          <div className="profile-education-display">
            <div className="profile_sslc">
              <p className="profile_lables">SSLC</p>
              <p className="field_bckground">{studentWithFiles.sslc}</p>
              <div className="file_download">
                {sslcMimeType && studentWithFiles.sslcFileContent && (
                  <a
                    className="marksheet_download_links"
                    href={`data:${sslcMimeType};base64,${studentWithFiles.sslcFileContent}`}
                    download={`sslcfile.${sslcExtension}`}
                  >
                    Download SSLC File
                  </a>
                )}
              </div>
            </div>
            <div className="profile_hsc_1_year">
              <p className="profile_lables">HSC 1 Year</p>
              <p className="field_bckground">{studentWithFiles.hsc1Year || "NA" }</p>
              <div className="file_download">
                {hsc1MimeType && studentWithFiles.hsc1YearFileContent && (
                  <a
                    className="marksheet_download_links"
                    href={`data:${hsc1MimeType};base64,${studentWithFiles.hsc1YearFileContent}`}
                    download={`hsc1yearfile.${hsc1Extension}`}
                  >
                    Download HSC 1 Year File
                  </a>
                )}
              </div>
            </div>
            <div className="profile_hsc_2_year">
              <p className="profile_lables">HSC 2 Year</p>
              <p className="field_bckground">{studentWithFiles.hsc2Year || "NA" }</p>
              <div className="file_download">
                {hsc2MimeType && studentWithFiles.hsc2YearFileContent && (
                  <a
                    className="marksheet_download_links"
                    href={`data:${hsc2MimeType};base64,${studentWithFiles.hsc2YearFileContent}`}
                    download={`hsc2yearfile.${hsc2Extension}`}
                  >
                    Download HSC 2 Year File
                  </a>
                )}
              </div>
            </div>
            <div className="profile_diploma">
              <p className="profile_lables">Diploma</p>
              <p className="field_bckground">{studentWithFiles.diploma || "NA" }</p>
              <div className="file_download">
                {diplomaMimeType && studentWithFiles.diplomaFileContent && (
                  <a
                    className="marksheet_download_links"
                    href={`data:${diplomaMimeType};base64,${studentWithFiles.diplomaFileContent}`}
                    download={`diplomafile.${diplomaExtension}`}
                  >
                    Download Diploma File
                  </a>
                )}
              </div>
            </div>
            <div className="profile_emis_number">
              <p className="profile_lables">EMIS Number</p>
              <p className="field_bckground">{studentWithFiles.emisNumber}</p>
            </div>
            <div className="profile_first_graduate">
              <p className="profile_lables">First Graduate</p>
              <p className="field_bckground">
                {studentWithFiles.firstGraduate}
              </p>
            </div>
            <div className="profile_special_category">
              <p className="profile_lables">Special Category</p>
              <p className="field_bckground">
                {studentWithFiles.specialCategory}
              </p>
            </div>
            <div className="file_download">
                {firstGraduateFileMimeType && studentWithFiles.firstGraduateFileContent && (
                  <a
                    className="marksheet_download_links"
                    href={`data:${firstGraduateFileMimeType};base64,${studentWithFiles.firstGraduateFileContent}`}
                    download={`firstgraduatefile.${firstGraduateFileExtension}`}
                  >
                    Download First Graduate File
                  </a>
                )}
              </div>
            <div className="file_download">
                {specialCategoryFileMimeType && studentWithFiles.specialCategoryFileContent && (
                  <a
                    className="marksheet_download_links"
                    href={`data:${specialCategoryFileMimeType};base64,${studentWithFiles.specialCategoryFileContent}`}
                    download={`specialcategoryfile.${specialCategoryFileExtension}`}
                  >
                    Download Special Category File
                  </a>
                )}
              </div>
          </div>
        )}

        {displaySection === "academic" && (
          <div className="profile-academic-display">
            <div className="profile_register_number">
              <p className="profile_lables">Register Number </p>
              <p className="field_bckground">{studentWithFiles.registerNo}</p>
            </div>

            <div className="profile_programme">
              <p className="profile_lables">Programme</p>
              <p className="field_bckground">{studentWithFiles.programme}</p>
            </div>
            <div className="profile_discipline">
              <p className="profile_lables">Discipline</p>
              <p className="field_bckground">{studentWithFiles.discipline}</p>
            </div>
            <div className="profile_batch">
              <p className="profile_lables">Course Completion Year</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.batch}
              </p>
            </div>
            <div className="profile_semester">
              <p className="profile_lables">Semester</p>
              <p className="field_bckground"> {studentWithFiles.semester}</p>
            </div>
            <div className="profile_abc_id">
              <p className="profile_lables">ABC ID</p>
              <p className="field_bckground"> {studentWithFiles.abcId}</p>
            </div>
            <div className="profile_umis_id">
              <p className="profile_lables">UMIS ID</p>
              <p className="field_bckground"> {studentWithFiles.umisId}</p>
            </div>
            <div className="profile_date_of_admission">
              <p className="profile_lables">Date of Admission</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.dateOfAdmission}
              </p>
            </div>
            <div className="profile_course_joined_date">
              <p className="profile_lables">Course Joined Date</p>
              <p className="field_bckground">
                {studentWithFiles.courseJoinedDate}
              </p>
            </div>
            <div className="profile_course_type">
              <p className="profile_lables">Course Type</p>
              <p className="field_bckground"> {studentWithFiles.courseType}</p>
            </div>
            <div className="profile__regulation">
              <p className="profile_lables">Regulation</p>
              <p className="field_bckground"> {studentWithFiles.regulation}</p>
            </div>
            <div className="profile_cgpa">
              <p className="profile_lables">CGPA</p>
              <p className="field_bckground"> {studentWithFiles.cgpa}</p>
            </div>
            <div className="profile_student_status">
              <p className="profile_lables">Student Status</p>
              <p className="field_bckground">
                {" "}
                {studentWithFiles.studentStatus}
              </p>
            </div>
          </div>
        )}
      </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default StudentDisplay;
