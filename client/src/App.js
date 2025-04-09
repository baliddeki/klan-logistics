import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactModal from "react-modal";
import ActionForm from "./components/ActionForm";
import ActionList from "./components/ActionList";

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
      .then((res) => setEvents(res.data.data))
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
    setActionForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (!actionForm.recordDate || isNaN(Date.parse(actionForm.recordDate)))
      errors.recordDate = "Please enter a valid Record Date.";

    if (!actionForm.actionDate || isNaN(Date.parse(actionForm.actionDate)))
      errors.actionDate = "Please enter a valid Action Date.";

    if (!actionForm.actionTaken.trim())
      errors.actionTaken = "Action Taken cannot be empty.";

    if (actionForm.remarks && actionForm.remarks.length > 500)
      errors.remarks = "Remarks cannot exceed 500 characters.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const actionData = {
      eventId: selectedEvent.id,
      ...actionForm,
    };

    axios
      .post("http://localhost:5000/api/actions", actionData)
      .then(() => {
        setActions((prev) => [
          ...prev,
          { event_id: selectedEvent.id, action_taken: actionForm.actionTaken },
        ]);
        handleModalClose();
      })
      .catch((err) => console.error("Error saving action:", err));
  };

  const getActionForEvent = (eventId) => {
    const record = actions.find((a) => a.event_id === eventId);
    return record ? record.action_taken : "No action yet";
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const currentRecords = events.slice(indexOfLastRecord - recordsPerPage, indexOfLastRecord);
  const totalPages = Math.ceil(events.length / recordsPerPage);

  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#4b0082" }}>
        <div style={{ marginBottom: "15px" }}>
          <img
            src="/klanlogo.png"
            alt="Klan Logistics Logo"
            style={{ width: "240px", height: "120px", objectFit: "contain" }}
          />
        </div>
        Klan Logistics Violations
      </h1>

      <ActionList
        events={currentRecords}
        fullEvents={events}
        getActionForEvent={getActionForEvent}
        handleModalOpen={handleModalOpen}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={setCurrentPage}
      />

      <ActionForm
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        onSave={handleSave}
        formData={actionForm}
        onChange={handleChange}
        formErrors={formErrors}
      />
    </div>
  );
}

export default App;
