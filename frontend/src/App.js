import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landingpage, Loginpage, Registrationform, Profilepage, Bonafide, Facultyregistration, Facultydashboard, Headofthedepartmentdashboard,FacultyInfohod,StudentInfohod,Principaldashboard} from './Pages';
import BonafideStudent from './Components/Bonafidestudent/BonafideStudent';
import BonafideStatus from './Pages/Bonafidestatuspage/Bonafidestatus';
import HodBonafideApproval from './Pages/HodBonafideApproval/HodBonafideApproval';
import OfficeBearer from './Pages/OfficeBearer/OfficeBearer';
import BatchesPage from './Pages/batches/BatchesPage';
import BatchCards from './Components/batchcomponent/BatchCards';
import OfficeBearerDashboard from './Pages/officeBearerDashboard/OfficeBearerDashboard';



function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login-page" element={<Loginpage />} />
        <Route path="/registration-form" element={<Registrationform />} />
        <Route path="/profile-page" element={<Profilepage />} />
        <Route path="/faculty-dashboard" element={<Facultydashboard />} />
        <Route path="/hod-dashboard" element={<Headofthedepartmentdashboard />} >
          <Route index element={<BatchCards/>} />
          <Route path='batch-one' element={<BatchesPage/>}/>
        </Route>
        <Route path="/faculty-registration" element={<Facultyregistration />} />
        <Route path="/bonafide-page" element={<Bonafide />} />
        <Route path="/bonafide-status-page" element={<BonafideStatus />} />
        <Route path="/facultyinfohod-page" element={<FacultyInfohod />} />
        <Route path="/studentinfohod-page" element={<StudentInfohod />} />
        <Route path="/bonafide-student" element={<BonafideStudent/>} />
        <Route path="/hod-bonafide-approval" element={<HodBonafideApproval/>} />
        <Route path="/office-bearer-dashboard" element={<OfficeBearer/>} />
        <Route path="/principal-dashboard" element={<Principaldashboard/>} />



      </Routes>
    </div>
  );
}

export default App;