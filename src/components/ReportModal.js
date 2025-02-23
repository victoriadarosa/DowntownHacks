import React from "react";

const ReportModal = ({ isVisible, onClose, onSubmit, reportReason, setReportReason }) => {
  if (!isVisible) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div style={{ padding: "20px", backgroundColor: "white", margin: "100px auto", width: "300px" }}>
        <h3>Report Reason</h3>
        <textarea
          placeholder="Enter your reason here"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          rows="4"
          style={{ width: "100%" }}
        ></textarea>
        <div>
          <button onClick={onSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;