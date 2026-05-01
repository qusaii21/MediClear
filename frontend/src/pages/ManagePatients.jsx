"use client";

import { useState, useEffect } from "react";
import "../styles/ManagePatients.css";

function ManagePatients() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [approvedPatients, setApprovedPatients] = useState([]);

  // Fetch approved patients
  const fetchApprovedPatients = async () => {
    try {
      // Retrieve the logged-in doctor's ID from localStorage
      const doctorDetails = JSON.parse(localStorage.getItem("doctorDetails"));
      const doctorId = doctorDetails?.doctor_id;

      if (!doctorId) {
        setMessage("Doctor ID not found. Please log in again.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/access-requests/doctor/${doctorId}`);
      const data = await response.json();

      if (response.ok) {
        // Filter approved requests
        const approved = data.filter((request) => request.request_status === "approved");
        setApprovedPatients(approved);
      } else {
        setMessage(data.error || "Failed to fetch approved patients.");
      }
    } catch (error) {
      console.error("Error fetching approved patients:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  // Send access request
  const handleAddRequest = async () => {
    try {
      // Retrieve the logged-in doctor's ID from localStorage
      const doctorDetails = JSON.parse(localStorage.getItem("doctorDetails"));
      const doctorId = doctorDetails?.doctor_id;

      if (!doctorId) {
        setMessage("Doctor ID not found. Please log in again.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: doctorId,
          patient_phone: phoneNumber,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Access request sent successfully!");
        fetchApprovedPatients(); // Refresh the approved patients list
      } else {
        setMessage(data.error || "Failed to send access request.");
      }
    } catch (error) {
      console.error("Error sending access request:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchApprovedPatients();
  }, []);

  return (
    <div className="manage-patients">
      <h1>Request Patient Access</h1>
      <div className="patient-form">
        <input
          type="text"
          placeholder="Enter Patient's Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button onClick={handleAddRequest}>Send Request</button>
      </div>
      {message && <p>{message}</p>}

      <div className="approved-patients">
        <h2>Approved Patients</h2>
        {approvedPatients.length > 0 ? (
          approvedPatients.map((patient) => (
            <div key={patient.patient_id} className="patient-item">
              <h3>{patient.patient_name}</h3>
              <p>Patient ID: {patient.patient_id}</p>
              <p>Request Status: {patient.request_status}</p>
            </div>
          ))
        ) : (
          <p>No approved patients yet.</p>
        )}
      </div>
    </div>
  );
}

export default ManagePatients;