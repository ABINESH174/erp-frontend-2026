import { Routes, Route } from "react-router-dom";
import {
  Landingpage,
  Loginpage,
  Registrationform,
  Profilepage,
  Bonafide,
  Facultyregistration,
  Facultydashboard,
  Headofthedepartmentdashboard,
  FacultyInfohod,
  StudentInfohod,
  Principaldashboard,
} from "../Pages";
import BonafideStudent from "../Components/Bonafidestudent/BonafideStudent";
import BonafideStatus from "../Pages/Bonafidestatuspage/Bonafidestatus";
import HodBonafideApproval from "../Pages/HodBonafideApproval/HodBonafideApproval";
import BatchesPage from "../Pages/batches/BatchesPage";
import BatchCards from "../Components/batchcomponent/BatchCards";
import GetOtp from "../Pages/ForgotPassword/GetOtp";
import ResetPassword from "../Pages/ForgotPassword/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import OfficeBearer from "../Pages/OfficeBearer/OfficeBearer";
import NewPasswordAfterLogin from "../Pages/NewPasswordAfterFirstTimeLogin/NewPasswordAfterLogin";
import FacultyStudentPage from "../Components/FacultyStudent/FacultyStudentPage";
import PreviousBonafides from "../Components/PreviousBonafides/PreviousBonafides";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard";
import HodRegistration from "../Pages/HodRegistration/HodRegistration";
import ObRegistration from "../Pages/ObRegisterPage/ObRegistration";
import PrincipalRegistration from "../Pages/PrincipalRegistration/PrincipalRegistration";
import OfficeBearerDashboard from "../Pages/officeBearerDashboard/OfficeBearerDashboard";

const CustomRouter = () => {
  return (
    <Routes>
      {/*Public Routes */}
      <Route path="/" element={<Landingpage />} />
      <Route path="/login-page" element={<Loginpage />} />
      <Route path="/new-password-after-login" element={<NewPasswordAfterLogin/>}/>
      <Route path="/forgot-password" element={<GetOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/registration-form" element={<Registrationform />} />
      <Route path="/faculty-registration" element={<Facultyregistration />} />
      <Route path="/hod-registration" element={<HodRegistration />} />
      <Route path="/principal-registration" element={<PrincipalRegistration />} />
      <Route path="/ob-registration" element={<ObRegistration />} />      
      <Route path="/hod-previous-bonafide" element={<PreviousBonafides />}/>
      <Route path="/admin-dashboard" element={<AdminDashboard />}/>


      {/*STUDENT ROUTES */}
      {/* <Route
        path="/registration-form"
        element={
          <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
            <Registrationform />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/profile-page"
        element={
          <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
            <Profilepage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bonafide-page"
        element={
          <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
            <Bonafide />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bonafide-status-page"
        element={
          <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
            <BonafideStatus />
          </ProtectedRoute>
        }
      />

      {/* FACULTY ROUTES */}
      {/* <Route
        path="/faculty-registration"
        element={
          <ProtectedRoute allowedRoles={["ROLE_FACULTY"]}>
            <Facultyregistration />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/bonafide-student"
        element={
          <ProtectedRoute allowedRoles={["ROLE_FACULTY"]}>
            <BonafideStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty-dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_FACULTY"]}>
            <Facultydashboard />
          </ProtectedRoute>
        }
      >
      <Route index element={<FacultyStudentPage/>} />
      <Route path="faculty-bonafide" element={<BonafideStudent />} />
      <Route path="previous-bonafide" element={<PreviousBonafides />} />
      </Route>

      {/*HOD ROUTES */}
      <Route
        path="/hod-dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_HOD"]}>
            <Headofthedepartmentdashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<BatchCards />} />
        <Route path="batch-one" element={<BatchesPage />} />
        <Route path="bonafide-page" element={<HodBonafideApproval />}/>
        <Route path="previous-bonafide" element={<PreviousBonafides />} />
      </Route>

      <Route
        path="/hod-bonafide-approval"
        element={
          <ProtectedRoute allowedRoles={["ROLE_HOD"]}>
            <HodBonafideApproval />
          </ProtectedRoute>
        }
      />

      {/*OFFICE BEARER ROUTE */}
      <Route
        path="/office-bearer-dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_OB"]}>
            <OfficeBearerDashboard/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/office-bearer-dashboard/ob-bonafide"
        element={
          <ProtectedRoute allowedRoles={["ROLE_OB"]}>
            <OfficeBearer/>
          </ProtectedRoute>
        }
      />

      {/*PRINCIPAL ROUTE */}
      <Route
        path="/principal-dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_PRINCIPAL"]}>
            <Principaldashboard />
          </ProtectedRoute>
        }
      />

      {/*Optional Pages*/}
      <Route path="/facultyinfohod-page" element={<FacultyInfohod />} />
      <Route path="/studentinfohod-page" element={<StudentInfohod />} />
    </Routes>
  );
};

export default CustomRouter;
