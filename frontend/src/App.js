import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landingpage, Loginpage, Registrationform, Profilepage, Bonafide, Facultyregistration, Facultydashboard, Headofthedepartmentdashboard,FacultyInfohod,StudentInfohod,Principaldashboard} from './Pages';
import BonafideStudent from './Components/Bonafidestudent/BonafideStudent';
import BonafideStatus from './Pages/Bonafidestatuspage/Bonafidestatus';



function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login-page" element={<Loginpage />} />
        <Route path="/registration-form" element={<Registrationform />} />
        <Route path="/profile-page" element={<Profilepage />} />
        <Route path="/faculty-dashboard" element={<Facultydashboard />} />
        <Route path="/hod-dashboard" element={<Headofthedepartmentdashboard />} />
        <Route path="/principal-dashboard" element={<Principaldashboard />} />
        <Route path="/faculty-registration" element={<Facultyregistration />} />
        <Route path="/bonafide-page" element={<Bonafide />} />
        <Route path="/bonafide-status-page" element={<BonafideStatus />} />
        <Route path="/facultyinfohod-page" element={<FacultyInfohod />} />
        <Route path="/studentinfohod-page" element={<StudentInfohod />} />
        <Route path="/bonafide-student" element={<BonafideStudent/>} />

      </Routes>
    </div>
  );
}

export default App;