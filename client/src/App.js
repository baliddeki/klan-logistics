import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactModal from "react-modal";

// Modal component style configuration
ReactModal.setAppElement("#root");

function App() {
  const [events, setEvents] = useState([]);
  const [actions, setActions] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionForm, setActionForm] = useState({
    recordDate: "",
    actionDate: "",
    actionTaken: "",
    remarks: "",
  });
  const [formErrors, setFormErrors] = useState({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    axios
      .get("https://cms.klanlogistics.com:8443/api/wylon-apis/protected?passcode=wylon2025access")
      .then((res) => {
        setEvents(res.data.data);
      })
      .catch((err) => console.error("Error fetching violations", err));
  }, []);

  const handleModalOpen = (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    setActionForm({
      recordDate: "",
      actionDate: "",
      actionTaken: "",
      remarks: "",
    });
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActionForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let errors = {};

    // Validate Record Date and Action Date
    if (!actionForm.recordDate || isNaN(Date.parse(actionForm.recordDate))) {
      errors.recordDate = "Please enter a valid Record Date.";
    }

    if (!actionForm.actionDate || isNaN(Date.parse(actionForm.actionDate))) {
      errors.actionDate = "Please enter a valid Action Date.";
    }

    // Validate Action Taken
    if (!actionForm.actionTaken.trim()) {
      errors.actionTaken = "Action Taken cannot be empty.";
    }

    // Validate Remarks (Optional but max 500 characters)
    if (actionForm.remarks && actionForm.remarks.length > 500) {
      errors.remarks = "Remarks cannot exceed 500 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  const handleSave = () => {
    if (validateForm()) {
      const actionData = {
        eventId: selectedEvent.id,
        ...actionForm,
      };

      // Send data to backend API to save
      axios
        .post("http://localhost:5000/api/actions", actionData)
        .then((res) => {
          // Update events with the action taken
          setActions((prevActions) => [
            ...prevActions,
            { event_id: selectedEvent.id, action_taken: actionForm.actionTaken },
          ]);
          // Close modal
          handleModalClose();
        })
        .catch((err) => console.error("Error saving action:", err));
    }
  };

  const getActionForEvent = (eventId) => {
    const record = actions.find((a) => a.event_id === eventId);
    return record ? record.action_taken : "No action yet";
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = events.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(events.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
<h1 style={{ textAlign: "center", color: "#4b0082" }}>
  <div style={{ marginBottom: "15px" }}>
    <img
      src="/klanlogo.png"
      alt="Klan Logistics Logo"
      style={{
        width: "240px",  
        height: "120px",
        objectFit: "contain",
      }}
    />
  </div>
  Klan Logistics Violations
</h1>


      <table border="1" cellPadding="10" style={{ marginTop: "2rem", width: "100%", borderColor: "#4b0082", borderRadius: "8px" }}>
        <thead style={{ backgroundColor: "#4b0082", color: "white" }}>
          <tr>
            {events.length > 0 &&
              Object.keys(events[0].attributes).map((key) => (
                <th key={key}>{key}</th>
              ))}
            <th>Actions Taken</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((event, index) => (
            <tr key={index}>
              {Object.values(event.attributes).map((value, idx) => (
                <td key={idx}>{value}</td>
              ))}
              <td>{getActionForEvent(event.id)}</td>
              <td>
                <button
                  onClick={() => handleModalOpen(event)}
                  style={{
                    backgroundColor: "#4b0082",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Add Action
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          style={{
            backgroundColor: "#4b0082",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "14px",
            margin: "0 5px",
          }}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          style={{
            backgroundColor: "#4b0082",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "14px",
            margin: "0 5px",
          }}
        >
          Next
        </button>
      </div>

      {/* Modal for adding action */}
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        style={{
          content: {
            maxWidth: "500px",
            margin: "auto",
            padding: "2rem",
            backgroundColor: "#ffffff",
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
              value={actionForm.recordDate}
              onChange={handleChange}
              style={{
                padding: "8px",
                width: "100%",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {formErrors.recordDate && <p style={{ color: "red" }}>{formErrors.recordDate}</p>}
          </div>
          <div>
            <label>Action Date:</label>
            <input
              type="date"
              name="actionDate"
              value={actionForm.actionDate}
              onChange={handleChange}
              style={{
                padding: "8px",
                width: "100%",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {formErrors.actionDate && <p style={{ color: "red" }}>{formErrors.actionDate}</p>}
          </div>
          <div>
            <label>Action Taken:</label>
            <input
              type="text"
              name="actionTaken"
              value={actionForm.actionTaken}
              onChange={handleChange}
              style={{
                padding: "8px",
                width: "100%",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {formErrors.actionTaken && <p style={{ color: "red" }}>{formErrors.actionTaken}</p>}
          </div>
          <div>
            <label>Remarks:</label>
            <textarea
              name="remarks"
              value={actionForm.remarks}
              onChange={handleChange}
              style={{
                padding: "8px",
                width: "100%",
                height: "100px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {formErrors.remarks && <p style={{ color: "red" }}>{formErrors.remarks}</p>}
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={handleSave}
              style={{
                backgroundColor: "#4b0082",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: "16px",
                margin: "10px",
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleModalClose}
              style={{
                backgroundColor: "#f5f5f5",
                color: "#4b0082",
                border: "1px solid #4b0082",
                borderRadius: "5px",
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: "16px",
                margin: "10px",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </ReactModal>
    </div>
  );
}

export default App;
