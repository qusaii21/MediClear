"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/DashboardHeader.css"

function DashboardHeader({ userType, toggleSidebar }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const notifications = [
    {
      id: 1,
      title: "New appointment",
      description: "You have a new appointment scheduled for tomorrow at 10:00 AM",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Prescription updated",
      description: "Dr. Johnson has updated your prescription",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Medical report available",
      description: "Your blood test results are now available",
      time: "2 hours ago",
      read: true,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen)
    setProfileOpen(false)
  }

  const toggleProfile = () => {
    setProfileOpen(!profileOpen)
    setNotificationsOpen(false)
  }

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>

        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder={
              userType === "patient" ? "Search prescriptions, reports..." : "Search patients, appointments..."
            }
          />
        </div>
      </div>

      <div className="header-right">
        <div className="header-icon-wrapper">
          <button className="header-icon" onClick={toggleNotifications}>
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>

          {notificationsOpen && (
            <div className="dropdown-menu notifications-menu">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && <button className="mark-all-read">Mark all as read</button>}
              </div>

              <div className="dropdown-content">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className={`notification-item ${!notification.read ? "unread" : ""}`}>
                      <div className="notification-header">
                        <h4>{notification.title}</h4>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                      <p>{notification.description}</p>
                      {!notification.read && <span className="new-badge">New</span>}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="header-icon-wrapper">
          <Link to={`/dashboard/${userType}/chat`} className="header-icon">
            <i className="fas fa-comment-dots"></i>
          </Link>
        </div>

        <div className="header-icon-wrapper">
          <button className="user-profile" onClick={toggleProfile}>
            <img src="/placeholder-avatar.jpg" alt="User" />
          </button>

          {profileOpen && (
            <div className="dropdown-menu profile-menu">
              <div className="dropdown-header">
                <h3>My Account</h3>
              </div>

              <div className="dropdown-content">
                <Link to={`/dashboard/${userType}/profile`} className="dropdown-item">
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </Link>
                <Link to={`/dashboard/${userType}/settings`} className="dropdown-item">
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </Link>
                <div className="dropdown-divider"></div>
                <Link to="/login" className="dropdown-item">
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Log out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader

