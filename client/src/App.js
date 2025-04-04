// client/src/App.js

import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [events, setEvents] = useState([]);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    // Fetch events from external API
    axios
      .get("https://cms.klanlogistics.com:8443/api/wylon-apis/protected?passcode=wylon2025access")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching violations", err));

    // Fetch saved actions from local DB
    axios
      .get("http://localhost:5000/api/actions")
      .then((res) => setActions(res.data))
      .catch((err) => console.error("Error fetching actions", err));
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
            {events.length > 0 &&
              Object.keys(events[0]).map((key) => <th key={key}>{key}</th>)}
            <th>Actions Taken</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              {Object.values(event).map((value, idx) => (
                <td key={idx}>{value}</td>
              ))}
              <td>{getActionForEvent(event.id)}</td>
              <td>
                <button onClick={() => alert(`Open modal for ${event.id}`)}>
                  Add Action
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
