import React from "react";
import ReactModal from "react-modal";

const ActionForm = ({
  isOpen,
  onRequestClose,
  onSave,
  formData,
  onChange,
  formErrors,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          maxWidth: "500px",
          margin: "auto",
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <h2 style={{ color: "#4b0082", textAlign: "center" }}>Add Action for Event</h2>
      <form>
        <div>
          <label>Record Date:</label>
          <input
            type="date"
            name="recordDate"
            value={formData.recordDate}
            onChange={onChange}
            style={inputStyle}
          />
          {formErrors.recordDate && <p style={errorStyle}>{formErrors.recordDate}</p>}
        </div>
        <div>
          <label>Action Date:</label>
          <input
            type="date"
            name="actionDate"
            value={formData.actionDate}
            onChange={onChange}
            style={inputStyle}
          />
          {formErrors.actionDate && <p style={errorStyle}>{formErrors.actionDate}</p>}
        </div>
        <div>
          <label>Action Taken:</label>
          <input
            type="text"
            name="actionTaken"
            value={formData.actionTaken}
            onChange={onChange}
            style={inputStyle}
          />
          {formErrors.actionTaken && <p style={errorStyle}>{formErrors.actionTaken}</p>}
        </div>
        <div>
          <label>Remarks:</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={onChange}
            style={{ ...inputStyle, height: "100px" }}
          />
          {formErrors.remarks && <p style={errorStyle}>{formErrors.remarks}</p>}
        </div>
        <div style={{ textAlign: "center" }}>
          <button type="button" onClick={onSave} style={primaryBtn}>
            Save
          </button>
          <button type="button" onClick={onRequestClose} style={cancelBtn}>
            Cancel
          </button>
        </div>
      </form>
    </ReactModal>
  );
};

const inputStyle = {
  padding: "8px",
  width: "100%",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const errorStyle = { color: "red" };

const primaryBtn = {
  backgroundColor: "#4b0082",
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: "16px",
  margin: "10px",
};

const cancelBtn = {
  backgroundColor: "#f5f5f5",
  color: "#4b0082",
  border: "1px solid #4b0082",
  borderRadius: "5px",
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: "16px",
  margin: "10px",
};

export default ActionForm;
