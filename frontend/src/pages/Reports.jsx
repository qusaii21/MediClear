import React, { useState } from "react";
import axios from "axios";
import "../styles/Reports.css";

function Reports() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadAndSummarize = async () => {
    if (!selectedFile) {
      alert("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:4001/api/parse-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSummary(response.data);
    } catch (error) {
      console.error("Error uploading and summarizing the report:", error);
      alert("Failed to summarize the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-container">
      <h1>Medical Report Summarizer</h1>
      <div className="upload-section">
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleUploadAndSummarize} disabled={loading}>
          {loading ? "Processing..." : "Upload & Summarize"}
        </button>
      </div>

      {summary && (
        <div className="summary-section">
          <h2>Summary</h2>
          <div className="summary-item">
            <h3>Main Problem</h3>
            <p>{summary.main_problem || "No data available"}</p>
          </div>
          <div className="summary-item">
            <h3>Medical Terms Made Simple</h3>
            <p>{summary.terms_made_simple || "No data available"}</p>
          </div>
          <div className="summary-item">
            <h3>Doctor Recommends</h3>
            <p>{summary.doctor_recommends || "No data available"}</p>
          </div>
          <div className="summary-item">
            <h3>What It Means for You</h3>
            <p>{summary.what_it_means || "No data available"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;