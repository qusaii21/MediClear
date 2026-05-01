import { Suspense } from "react";
import { Routes, Route } from "react-router-dom"
import "./i18n"; // Import i18n configuration
import LandingPage from "./pages/LandingPage"
import PatientSignupPage from "./pages/PatientSignupPage";
import DoctorSignupPage from "./pages/DoctorSignupPage";
import PatientLoginPage from "./pages/PatientLoginPage";
import DoctorLoginPage from "./pages/DoctorLoginPage";
import CreateProfilePage from "./pages/CreateProfilePage"
import PatientDashboard from "./pages/PatientDashboard"
import DoctorDashboard from "./pages/DoctorDashboard"
import ManagePatients from "./pages/ManagePatients";
import Prescrption from "./pages/Prescription"
import Reports from "./pages/Reports"
import LanguageSwitcher from "./components/LanguageSwitcher";
import "./styles/App.css"

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
       <LanguageSwitcher />
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup/patient" element={<PatientSignupPage />} />
      <Route path="/signup/doctor" element={<DoctorSignupPage />} />
      <Route path="/login/patient" element={<PatientLoginPage />} />
      <Route path="/login/doctor" element={<DoctorLoginPage />} />
        <Route path="/create-profile" element={<CreateProfilePage />} />
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
        <Route path="/dashboard/doctor/patients" element={<ManagePatients />} />
        <Route path="/dashboard/patient/prescriptions" element={<Prescrption />} />
        <Route path="/dashboard/patient/reports" element={<Reports />} />
      </Routes>
    </div>
    </Suspense>
  )
}

export default App

