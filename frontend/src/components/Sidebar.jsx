"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "../styles/Sidebar.css"

function Sidebar({ userType }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const patientMenuItems = [
    {
      title: "Dashboard",
      icon: "fas fa-home",
      path: "/dashboard/patient",
    },
    {
      title: "Prescriptions",
      icon: "fas fa-prescription-bottle-alt",
      path: "/dashboard/patient/prescriptions",
    },
    {
      title: "Medical Reports",
      icon: "fas fa-file-medical",
      path: "/dashboard/patient/reports",
    },
    {
      title: "Appointments",
      icon: "fas fa-calendar-alt",
      path: "/dashboard/patient/appointments",
    },
    {
      title: "Chat",
      icon: "fas fa-comment-medical",
      path: "/dashboard/patient/chat",
    },
    {
      title: "Settings",
      icon: "fas fa-cog",
      path: "/dashboard/patient/settings",
    },
  ]

  const doctorMenuItems = [
    {
      title: "Dashboard",
      icon: "fas fa-home",
      path: "/dashboard/doctor",
    },
    {
      title: "Patients",
      icon: "fas fa-users",
      path: "/dashboard/doctor/patients",
    },
    {
      title: "Appointments",
      icon: "fas fa-calendar-alt",
      path: "/dashboard/doctor/appointments",
    },
    {
      title: "Upload Records",
      icon: "fas fa-upload",
      path: "/dashboard/doctor/upload",
    },
    {
      title: "Analytics",
      icon: "fas fa-chart-bar",
      path: "/dashboard/doctor/analytics",
    },
    {
      title: "Settings",
      icon: "fas fa-cog",
      path: "/dashboard/doctor/settings",
    },
  ]

  const menuItems = userType === "patient" ? patientMenuItems : doctorMenuItems

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-stethoscope"></i>
          <span>MediConnect</span>
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <i className={`fas ${collapsed ? "fa-angle-right" : "fa-angle-left"}`}></i>
        </button>
      </div>

      <div className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link to={item.path} className={location.pathname === item.path ? "active" : ""}>
                <i className={item.icon}></i>
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">
            <img src="/placeholder-avatar.jpg" alt="User" />
          </div>
          <div className="user-details">
            
            <p>{userType}</p>
          </div>
        </div>
        <Link to="/login" className="logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar

