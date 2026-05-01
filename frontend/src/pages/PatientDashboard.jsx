"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import DashboardHeader from "../components/DashboardHeader"
import Chatbot from "../components/Chatbot"
import "../styles/Dashboard.css"

function PatientDashboard() {
  const [accessRequests, setAccessRequests] = useState([]);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  // Fetch access requests for the logged-in patient
  const fetchAccessRequests = async () => {
    try {
      // Retrieve the logged-in patient's details from localStorage
      const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));
  
      if (!patientDetails || !patientDetails.patient_id) {
        console.error("Patient ID not found in localStorage.");
        return;
      }
  
      const patientId = patientDetails.patient_id;
  
      const response = await fetch(`http://localhost:5000/api/access-requests?patient_id=${patientId}`);
      const data = await response.json();
      setAccessRequests(data);
    } catch (error) {
      console.error("Error fetching access requests:", error);
    }
  };

  // Handle approval or rejection of access requests
  const handleRequestAction = async (requestId, action) => {
    try {
      const response = await fetch(`http://localhost:5000/api/access-requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_status: action }),
      });

      if (response.ok) {
        fetchAccessRequests(); // Refresh the list
      }
    } catch (error) {
      console.error(`Error ${action} request:`, error);
    }
  };

  useEffect(() => {
    fetchAccessRequests();
  }, []);

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "Today",
      time: "3:00 PM",
      image: "",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "Tomorrow",
      time: "10:30 AM",
      image: "",
    },
  ];

  const recentPrescriptions = [
    {
      id: 1,
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily",
      doctor: "Dr. Sarah Johnson",
      date: "May 15, 2025",
    },
    {
      id: 2,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      doctor: "Dr. Sarah Johnson",
      date: "May 10, 2025",
    },
    {
      id: 3,
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      doctor: "Dr. Michael Chen",
      date: "May 5, 2025",
    },
  ];

  const recentReports = [
    {
      id: 1,
      name: "Blood Test Results",
      doctor: "Dr. Sarah Johnson",
      date: "May 12, 2025",
      status: "normal",
    },
    {
      id: 2,
      name: "Chest X-Ray",
      doctor: "Dr. Robert Williams",
      date: "May 8, 2025",
      status: "review",
    },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar userType="patient" className={sidebarActive ? "active" : ""} />

      <div className="dashboard-content">
        <DashboardHeader userType="patient" toggleSidebar={toggleSidebar} />

        <main className="main-content">
          <div className="page-header">
            <h1>Patient Dashboard</h1>
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> Book Appointment
            </button>
          </div>

          {/* Access Requests Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Access Requests</h2>
              <p>Manage requests from doctors to access your medical records</p>
            </div>

            <div className="card-content">
              {accessRequests.length > 0 ? (
                accessRequests.map((request) => (
                  <div key={request.request_id} className="list-item">
                    <div className="list-item-content">
                    <h3>Doctor: {request.doctors?.name || "Unknown"}</h3>
                      <p>Status: {request.request_status}</p>
                    </div>
                    {request.request_status === "pending" && (
                      <div className="list-item-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleRequestAction(request.request_id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleRequestAction(request.request_id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No access requests at the moment.</p>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-card-header">
                <h3>Upcoming Appointments</h3>
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="stat-card-value">{upcomingAppointments.length}</div>
              <div className="stat-card-info">Next: Today at 3:00 PM</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <h3>Active Prescriptions</h3>
                <i className="fas fa-prescription-bottle-alt"></i>
              </div>
              <div className="stat-card-value">{recentPrescriptions.length}</div>
              <div className="stat-card-info">Last updated: May 15, 2025</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <h3>Medical Reports</h3>
                <i className="fas fa-file-medical"></i>
              </div>
              <div className="stat-card-value">{recentReports.length}</div>
              <div className="stat-card-info">Last updated: May 12, 2025</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <h3>Health Score</h3>
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="stat-card-value">85%</div>
              <div className="stat-card-progress">
                <div className="progress-bar" style={{ width: "85%" }}></div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Chatbot Button */}
      <button className="chatbot-btn pulse-animation" onClick={() => setChatbotOpen(!chatbotOpen)}>
        <i className="fas fa-comment-medical"></i>
      </button>

      {/* Chatbot Component */}
      <Chatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </div>
  );
}

export default PatientDashboard;