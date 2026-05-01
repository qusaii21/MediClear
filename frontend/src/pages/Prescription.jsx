import { useState } from "react";
import axios from "axios";
import "../styles/Prescription.css";

function Prescription() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prescriptions, setPrescriptions] = useState([{ medicine: "", dosage: "", instructions: "", refills: "" }]);
  const [summary, setSummary] = useState([]); // Ensure it's an array
  const [explanation, setExplanation] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, { medicine: "", dosage: "", instructions: "", refills: "" }]);
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handleGetInfo = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/medicine-info", {
        medicines: prescriptions.map((p) => ({
          name: p.medicine,
          dosage: p.dosage,
          instructions: p.instructions,
          refills: p.refills,
        })),
      });
      setSummary(Array.isArray(response.data) ? response.data : []); // Ensure response is an array
    } catch (error) {
      console.error("Error fetching medicine info:", error);
      setSummary([]); // Reset summary on error
    }
  };

  const handleKnowWhyPrescribed = async (medicineName) => {
    try {
      const response = await axios.post("http://localhost:4000/api/explain-medicine", {
        medicineName,
        patientSummary: summary,
      });
      setExplanation(response.data.explanation);
    } catch (error) {
      console.error("Error fetching explanation:", error);
    }
  };

  const handleUploadReport = async () => {
    if (!selectedFile) return alert("Please upload a PDF file.");
    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      const response = await axios.post("http://localhost:4000/api/parse-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Ensure the response is an array
      setSummary(Array.isArray(response.data.summary) ? response.data.summary : []);
    } catch (error) {
      console.error("Error uploading report:", error);
      setSummary([]); // Reset summary on error
    }
  };

  return (
    <div className="fullscreen-container">
      <div className="prescription-card">
        <div className="prescription-header">
          <h1>Prescriptions</h1>
          <p>Manage and upload your prescriptions</p>
        </div>

        

        <div className="form-group">
          <label>Prescriptions</label>
          {prescriptions.map((prescription, index) => (
            <div key={index} className="form-group">
              <input
                type="text"
                placeholder="Medicine Name"
                value={prescription.medicine}
                onChange={(e) => handlePrescriptionChange(index, "medicine", e.target.value)}
              />
              <input
                type="text"
                placeholder="Dosage"
                value={prescription.dosage}
                onChange={(e) => handlePrescriptionChange(index, "dosage", e.target.value)}
              />
              <input
                type="text"
                placeholder="Instructions"
                value={prescription.instructions}
                onChange={(e) => handlePrescriptionChange(index, "instructions", e.target.value)}
              />
              <input
                type="text"
                placeholder="Refills"
                value={prescription.refills}
                onChange={(e) => handlePrescriptionChange(index, "refills", e.target.value)}
              />
              
            </div>
          ))}
          <button className="btn-primary" onClick={handleAddPrescription}>
            Add Prescription
          </button>
          <button className="btn-primary" onClick={handleGetInfo}>
            Get Info
          </button>
        </div>

        {Array.isArray(summary) && summary.length > 0 ? (
          <div className="summary-section">
            <h2>Summary</h2>
            {summary.map((item, index) => (
              <div key={index} className="summary-item">
                <h3>{item.name}</h3>
                <p>{item.summary}</p>
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}

        {explanation && (
          <div className="summary-section">
            <h2>Explanation</h2>
            <p>{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Prescription;