"use client";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AuthPages.css";

function CreateProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get("type") || "patient";

  const [formData, setFormData] = useState({
    profilePicture: null,
    firstName: "",
    lastName: "",
    dob: "",
    gender: "male",
    phone: "",
    chronicConditions: "",
    allergies: "",
    currentMedications: "",
    familyHistory: "",
    smoking: "never",
    alcohol: "none",
    exercise: "moderate",
    diet: "no-restrictions",
    licenseNumber: "",
    hospital: "",
    specialization: "general",
    experience: "",
    education: "",
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/profile/${userType}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        navigate(`/dashboard/${userType}`);
      } else {
        console.error(data.error || "Profile creation failed.");
      }
    } catch (err) {
      console.error("Error during profile creation:", err);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h1>Complete Your Profile</h1>
        {/* Add fields based on userType */}
        {/* Example: */}
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        {/* Add other fields */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateProfilePage;