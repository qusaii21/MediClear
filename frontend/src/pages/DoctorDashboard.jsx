"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import { supabase } from "../supabaseClient"; // Ensure you have this client configured
import "../styles/Dashboard.css";

function DoctorDashboard() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  // Fetch the logged-in doctor's details
  const fetchDoctorDetails = async () => {
    try {
      const { data: user } = await supabase.auth.getUser(); // Get the logged-in user's details
      if (user) {
        const { data: doctor, error } = await supabase
          .from("doctors")
          .select("*")
          .eq("doctor_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching doctor details:", error);
        } else {
          setDoctorDetails(doctor);
        }
      }
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
    }
  };

  // Fetch upcoming appointments
  const fetchUpcomingAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", doctorDetails?.doctor_id)
        .order("scheduled_time", { ascending: true });

      if (error) {
        console.error("Error fetching appointments:", error);
      } else {
        setUpcomingAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Fetch pending reports
  const fetchPendingReports = async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("doctor_id", doctorDetails?.doctor_id)
        .eq("status", "pending");

      if (error) {
        console.error("Error fetching reports:", error);
      } else {
        setPendingReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, []);

  useEffect(() => {
    if (doctorDetails) {
      fetchUpcomingAppointments();
      fetchPendingReports();
    }
  }, [doctorDetails]);

  return (
    <div className="dashboard-container">
      <Sidebar userType="doctor" className={sidebarActive ? "active" : ""} />

      <div className="dashboard-content">
        <DashboardHeader userType="doctor" toggleSidebar={toggleSidebar} />

        <main className="main-content">
          <div className="page-header">
            <h1>Welcome, {doctorDetails?.name || "Doctor"}</h1>
            <div className="header-buttons">
              <button className="btn btn-secondary">
                <i className="fas fa-calendar-alt"></i> Schedule
              </button>
              <button className="btn btn-primary">
                <i className="fas fa-plus"></i> New Patient
              </button>
            </div>
          </div>

          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-card-header">
                <h3>Today's Appointments</h3>
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="stat-card-value">
                {upcomingAppointments.filter((a) =>
                  new Date(a.scheduled_time).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <div className="stat-card-info">
                Next:{" "}
                {upcomingAppointments.length > 0
                  ? new Date(upcomingAppointments[0].scheduled_time).toLocaleTimeString()
                  : "No appointments"}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <h3>Total Patients</h3>
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-card-value">{doctorDetails?.total_patients || 0}</div>
              <div className="stat-card-info">+12 this month</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <h3>Pending Reports</h3>
                <i className="fas fa-file-medical"></i>
              </div>
              <div className="stat-card-value">{pendingReports.length}</div>
              <div className="stat-card-info">Requires your review</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <h3>Patient Satisfaction</h3>
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="stat-card-value">92%</div>
              <div className="stat-card-progress">
                <div className="progress-bar" style={{ width: "92%" }}></div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Upcoming Appointments</h2>
                <p>Your scheduled appointments for today and tomorrow</p>
              </div>

              <div className="card-content">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="list-item">
                    <div className="list-item-content">
                      <h3>{appointment.patient_name}</h3>
                      <p>
                        {appointment.reason} •{" "}
                        {new Date(appointment.scheduled_time).toLocaleString()}
                      </p>
                    </div>
                    <button className="btn btn-sm btn-secondary">View</button>
                  </div>
                ))}
              </div>

              <div className="card-footer">
                <Link to="/dashboard/doctor/appointments" className="btn btn-secondary btn-block">
                  View All Appointments <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h2>Pending Reports</h2>
                <p>Medical reports awaiting your review</p>
              </div>

              <div className="card-content">
                {pendingReports.map((report) => (
                  <div key={report.id} className="list-item">
                    <div className="list-item-content">
                      <h3>{report.type}</h3>
                      <p>{report.patient_name}</p>
                      <div className="report-meta">
                        <span className="report-date">
                          {new Date(report.date).toLocaleDateString()}
                        </span>
                        <span className="report-status review">Pending Review</span>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-secondary">Review</button>
                  </div>
                ))}
              </div>

              <div className="card-footer">
                <Link to="/dashboard/doctor/reports" className="btn btn-secondary btn-block">
                  View All Reports <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboard;