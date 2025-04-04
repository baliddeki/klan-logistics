import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [events, setEvents] = useState([]);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://cms.klanlogistics.com:8443/api/wylon-apis/protected?passcode=wylon2025access"
      )
      .then((res) => {
        console.log("API data:", res.data);
        setEvents(res.data.data); // Correct: res.data.data is the array
      })
      .catch((err) => console.error("Error fetching violations", err));
  }, []);

  const getActionForEvent = (eventId) => {
    const record = actions.find((a) => a.event_id === eventId);
    return record ? record.action_taken : "No action yet";
  };

  return (
    <div className="App" style={{ padding: "2rem" }}>
      <h1>Klan Logistics Violations</h1>
      <table border="1" cellPadding="10" style={{ marginTop: "2rem", width: "100%" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Vehicle</th>
            <th>Violation</th>
            <th>Time</th>
            <th>Location</th>
            <th>Value</th>
            <th>Avg Speed</th>
            <th>Actions Taken</th>
            <th>Add Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => {
            const violation = event.attributes;
            return (
              <tr key={event.id}>
                <td>{index + 1}</td>
                <td>{violation.vcode}</td>
                <td>{violation.violation}</td>
                <td>{violation.beginningtime}</td>
                <td>{violation.initiallocation}</td>
                <td>{violation.value}</td>
                <td>{violation.averagespeed}</td>
                <td>{getActionForEvent(event.id)}</td>
                <td>
                  <button onClick={() => alert(`Open modal for event ${event.id}`)}>
                    Add Action
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
