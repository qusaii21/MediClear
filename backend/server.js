const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = 5000;

// Supabase configuration
const SUPABASE_URL = "https://kzovbnxjiifsogvzimgv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6b3ZibnhqaWlmc29ndnppbWd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzc4NjM4MCwiZXhwIjoyMDU5MzYyMzgwfQ.vEoZbZfTm2jVqS34v4iXHeGUjvXWdjyj8OVmMqgNALQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(express.json());


app.post("/api/parse-pdf", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:4000/api/parse-pdf", req.body, {
      headers: req.headers,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error communicating with Flask service" });
  }
});

// Validate Database Connection
app.get("/api/health", async (req, res) => {
  const { data, error } = await supabase.from("patients").select("*").limit(1);
  if (error) {
    return res.status(500).json({ status: "error", message: "Database connection failed", error: error.message });
  }
  res.json({ status: "success", message: "Database connected successfully" });
});

// CRUD Operations for Patients
app.get("/api/patients", async (req, res) => {
  const { data, error } = await supabase.from("patients").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/patients", async (req, res) => {
  const { name, age, gender, medical_history } = req.body;
  const { data, error } = await supabase.from("patients").insert([{ name, age, gender, medical_history }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/patients/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, medical_history } = req.body;
  const { data, error } = await supabase.from("patients").update({ name, age, gender, medical_history }).eq("patient_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/patients/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("patients").delete().eq("patient_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Signup Endpoint for Patients
app.post("/api/signup/patient", async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    dob,
    phone_number,
    chronic_conditions,
    severe_allergies,
    current_medication,
    family_medical_history,
    smoking_habits,
    alcohol_consumption,
    exercise_frequency,
    dietary_preferences,
  } = req.body;

  // Validate input
  if (!email || !password || !first_name || !last_name || !dob || !phone_number) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Insert patient details into the database
    const { error: patientError } = await supabase.from("patients").insert([
      {
        first_name,
        last_name,
        dob,
        phone_number,
        chronic_conditions,
        severe_allergies,
        current_medication,
        family_medical_history,
        smoking_habits,
        alcohol_consumption,
        exercise_frequency,
        dietary_preferences,
      },
    ]);

    if (patientError) {
      return res.status(500).json({ error: patientError.message });
    }

    res.status(201).json({ message: "Patient signup successful", user: authData.user });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during signup" });
  }
});

app.post("/api/login/patient", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Authenticate the patient using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Fetch the patient's details from the "patients" table
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .eq("patient_id", authData.user.id)
      .single();

    if (patientError || !patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    // Return success response with patient details
    res.status(200).json({
      message: "Login successful",
      patient,
    });
  } catch (err) {
    console.error("Error during patient login:", err);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});


app.post("/api/signup/doctor", async (req, res) => {
  const { email, password, first_name, last_name, license_number, degree } = req.body;

  // Validate input
  if (!email || !password || !first_name || !last_name || !license_number || !degree) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Insert doctor details into the database
    const { error: doctorError } = await supabase.from("doctors").insert([
      {
        doctor_id: authData.user.id, // Use the Supabase Auth UID
        name: `${first_name} ${last_name}`,
        degree,
        license_number,
        is_active: true, // Default value
      },
    ]);

    if (doctorError) {
      return res.status(500).json({ error: doctorError.message });
    }

    res.status(201).json({ message: "Doctor signup successful", user: authData.user });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during signup" });
  }
});

app.post("/api/login/doctor", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Fetch the doctor from the database using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Fetch the doctor's details from the "doctors" table
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("*")
      .eq("doctor_id", authData.user.id)
      .single();

    if (doctorError || !doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    // Return success response with doctor details
    res.status(200).json({
      message: "Login successful",
      doctor,
    });
  } catch (err) {
    console.error("Error during doctor login:", err);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

app.get("/api/access-requests", async (req, res) => {
  const { patient_id } = req.query;

  if (!patient_id) {
    return res.status(400).json({ error: "Patient ID is required." });
  }

  try {
    const { data, error } = await supabase
      .from("record_access_requests")
      .select(`
        request_id,
        doctor_id,
        request_status,
        doctors (name)
      `)
      .eq("patient_id", patient_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching access requests:", err);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

// Doctor sends a request to access a patient's details
app.post("/api/access-requests", async (req, res) => {
    const { doctor_id, patient_phone } = req.body;
  
    // Find the patient by phone number
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("patient_id")
      .eq("phone_number", patient_phone)
      .single();
  
    if (patientError || !patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    app.get("/api/access-requests/doctor/:doctor_id", async (req, res) => {
      const { doctor_id } = req.params;
    
      try {
        const { data, error } = await supabase
          .from("record_access_requests")
          .select(`
            request_id,
            patient_id,
            request_status,
            patients (first_name, last_name)
          `)
          .eq("doctor_id", doctor_id);
    
        if (error) {
          return res.status(500).json({ error: error.message });
        }
    
        res.status(200).json(data);
      } catch (err) {
        console.error("Error fetching access requests:", err);
        res.status(500).json({ error: "An error occurred. Please try again." });
      }
    });

    app.get("/api/access-requests/doctor/:doctor_id", async (req, res) => {
      const { doctor_id } = req.params;
    
      console.log("Doctor ID:", doctor_id); // Debugging log
    
      try {
        const { data, error } = await supabase
          .from("record_access_requests")
          .select(`
            request_id,
            request_status,
            patient_id,
            patients (first_name, last_name)
          `)
          .eq("doctor_id", doctor_id);
    
        console.log("Query Result:", data); // Debugging log
    
        if (error) {
          console.error("Database Error:", error); // Debugging log
          return res.status(500).json({ error: error.message });
        }
    
        if (!data || data.length === 0) {
          return res.status(404).json({ error: "No access requests found for this doctor." });
        }
    
        const formattedData = data.map((request) => ({
          request_id: request.request_id,
          request_status: request.request_status,
          patient_id: request.patient_id,
          patient_name: `${request.patients.first_name} ${request.patients.last_name}`,
        }));
    
        res.status(200).json(formattedData);
      } catch (err) {
        console.error("Error fetching access requests:", err);
        res.status(500).json({ error: "An error occurred. Please try again." });
      }
    });

    

    app.get("/api/patients/:patient_id", async (req, res) => {
      const { patient_id } = req.params;
    
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .eq("patient_id", patient_id)
          .single();
    
        if (error) {
          return res.status(500).json({ error: error.message });
        }
    
        res.status(200).json(data);
      } catch (err) {
        console.error("Error fetching patient details:", err);
        res.status(500).json({ error: "An error occurred. Please try again." });
      }
    });
  
    // Create a new access request
    const { data, error } = await supabase.from("record_access_requests").insert([
      {
        doctor_id,
        patient_id: patient.patient_id,
      },
    ]);
  
    if (error) {
      return res.status(500).json({ error: error.message });
    }
  
    res.status(201).json({ message: "Access request sent successfully", request: data });
  });
  
  // Patient approves or denies the doctor's request
  app.put("/api/access-requests/:request_id", async (req, res) => {
    const { request_id } = req.params;
    const { request_status } = req.body;
  
    if (!["approved", "rejected"].includes(request_status)) {
      return res.status(400).json({ error: "Invalid request status" });
    }
  
    const { data, error } = await supabase
      .from("record_access_requests")
      .update({ request_status, responded_at: new Date() })
      .eq("request_id", request_id);
  
    if (error) {
      return res.status(500).json({ error: error.message });
    }
  
    // If approved, update the doctor's `is_active` column for the patient
    if (request_status === "approved") {
      const { data: doctorUpdateError } = await supabase
        .from("doctors")
        .update({ is_active: true })
        .eq("doctor_id", data[0].doctor_id);
  
      if (doctorUpdateError) {
        return res.status(500).json({ error: doctorUpdateError.message });
      }
    }
  
    res.status(200).json({ message: `Request ${request_status} successfully` });
  });

  app.post("/api/login/patient", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
  
    try {
      // Fetch the patient from the database
      const { data: patient, error } = await supabase
        .from("patients")
        .select("*")
        .eq("email", email)
        .single();
  
      if (error || !patient) {
        return res.status(404).json({ error: "Patient not found." });
      }
  
      // Verify the password (assuming passwords are hashed)
      const isPasswordValid = await bcrypt.compare(password, patient.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password." });
      }
  
      // Return success response
      res.status(200).json({
        message: "Login successful",
        patient_id: patient.patient_id,
      });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ error: "An error occurred. Please try again." });
    }
  });


// CRUD Operations for Doctors
app.get("/api/doctors", async (req, res) => {
  const { data, error } = await supabase.from("doctors").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/doctors", async (req, res) => {
  const { name, degree, license_number } = req.body;
  const { data, error } = await supabase.from("doctors").insert([{ name, degree, license_number }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/doctors/:id", async (req, res) => {
  const { id } = req.params;
  const { name, degree, license_number } = req.body;
  const { data, error } = await supabase.from("doctors").update({ name, degree, license_number }).eq("doctor_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/doctors/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("doctors").delete().eq("doctor_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// CRUD Operations for Appointments
app.get("/api/appointments", async (req, res) => {
  const { data, error } = await supabase.from("appointments").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/appointments", async (req, res) => {
  const { patient_id, doctor_id, appointment_type, status, scheduled_time, note } = req.body;
  const { data, error } = await supabase.from("appointments").insert([{ patient_id, doctor_id, appointment_type, status, scheduled_time, note }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const { data, error } = await supabase.from("appointments").update({ status, note }).eq("appointment_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("appointments").delete().eq("appointment_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// CRUD Operations for Reports
app.get("/api/reports", async (req, res) => {
  const { data, error } = await supabase.from("reports").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/reports", async (req, res) => {
  const { session_id, report_type, report_url, summary } = req.body;
  const { data, error } = await supabase.from("reports").insert([{ session_id, report_type, report_url, summary }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/reports/:id", async (req, res) => {
  const { id } = req.params;
  const { report_type, report_url, summary } = req.body;
  const { data, error } = await supabase.from("reports").update({ report_type, report_url, summary }).eq("report_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/reports/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("reports").delete().eq("report_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// CRUD Operations for Prescriptions
app.get("/api/prescriptions", async (req, res) => {
  const { data, error } = await supabase.from("prescriptions").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/prescriptions", async (req, res) => {
  const { session_id, notes, prescription_url } = req.body;
  const { data, error } = await supabase.from("prescriptions").insert([{ session_id, notes, prescription_url }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/prescriptions/:id", async (req, res) => {
  const { id } = req.params;
  const { notes, prescription_url } = req.body;
  const { data, error } = await supabase.from("prescriptions").update({ notes, prescription_url }).eq("prescription_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/prescriptions/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("prescriptions").delete().eq("prescription_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});