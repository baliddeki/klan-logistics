import React from "react";

const ActionList = ({
  events,
  fullEvents,
  getActionForEvent,
  handleModalOpen,
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  return (
    <>
      <table
        border="1"
        cellPadding="10"
        style={{
          marginTop: "2rem",
          width: "100%",
          borderColor: "#4b0082",
          borderRadius: "8px",
        }}
      >
        <thead style={{ backgroundColor: "#4b0082", color: "white" }}>
          <tr>
            {fullEvents.length > 0 &&
              Object.keys(fullEvents[0].attributes).map((key) => <th key={key}>{key}</th>)}
            <th>Actions Taken</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              {Object.values(event.attributes).map((val, i) => (
                <td key={i}>{val}</td>
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
            margin: "0 5px",
          }}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default ActionList;
