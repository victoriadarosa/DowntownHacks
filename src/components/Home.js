import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = ({ user, onLogout }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [locations, setLocations] = useState({});
  const [filters, setFilters] = useState({
    eventType: "",
    startTime: "",
  });
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    axios
      .get("http://localhost:5001/api/announcements")
      .then(async (response) => {
        setAnnouncements(response.data);
        fetchLocations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching announcements:", error);
      });
  };

  const fetchLocations = async (announcements) => {
    const newLocations = {};
    const apiKey = "AIzaSyBaj1qQzL-Q9bTdWS_15_Cxr_3EYxGVU2A";
  
    for (const announcement of announcements) {
      if (announcement.longitude && announcement.latitude) {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${announcement.latitude},${announcement.longitude}&key=${apiKey}`
          );
  
          if (response.data.results.length > 0) {
            newLocations[announcement._id] = response.data.results[0].formatted_address;
          } else {
            newLocations[announcement._id] = "Unknown location";
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          newLocations[announcement._id] = "Location not found";
        }
      }
    }
  
    setLocations(newLocations);
  };
  

  const handleCreateAnnouncement = () => {
    navigate("/create-announcement");
  };

  const handleMapView = () => {
    navigate("/map");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterSubmit = () => {
    if (!filters.eventType && !filters.startTime) {
      alert("Please fill at least one filter to apply.");
      return;
    }

    const updatedFilters = { ...filters };
    if (updatedFilters.eventType === "All") {
      delete updatedFilters.eventType;
    }

    axios
      .get("http://localhost:5001/api/announcements", { params: updatedFilters })
      .then((response) => {
        setAnnouncements(response.data);
        fetchLocations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching filtered announcements:", error);
      });
  };

  const handleReportClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setReportModalVisible(true);
  };

  const handleReportSubmit = () => {
    console.log(`Reported Announcement ID: ${selectedAnnouncement._id}`);
    console.log(`Reason: ${reportReason}`);
    setReportModalVisible(false);
  };

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={onLogout}>Logout</button>
      <button onClick={handleCreateAnnouncement}>Create Announcement</button>
      <button onClick={handleMapView}>Map</button>

      {/* Filter Form */}
      <div>
        <h2>Filter Announcements</h2>
        <div>
          <label>Event Type:</label>
          <select name="eventType" value={filters.eventType} onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="Safety Hazard">Safety Hazard</option>
            <option value="Local Events">Local Events</option>
            <option value="Outdoor Activities">Outdoor Activities</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Health">Health</option>
            <option value="Family & Kids">Family & Kids</option>
            <option value="Networking">Networking</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Events Starting At or Later:</label>
          <input
            type="datetime-local"
            name="startTime"
            value={filters.startTime}
            onChange={handleFilterChange}
          />
        </div>
        <button onClick={handleFilterSubmit}>Filter</button>
      </div>

      {/* Display Announcements */}
      <div>
        <h2>Announcements</h2>
        <ul>
          {announcements.map((announcement) => (
            <li key={announcement._id}>
              <h3>{announcement.eventName}</h3>
              <p>{announcement.eventType}</p>
              <p>{announcement.location}</p>
              <p>📍 {locations[announcement._id] || "Fetching location..."}</p>
              <p>
                {new Date(announcement.startTime).toLocaleString()}
                {announcement.endTime ? ` - ${new Date(announcement.endTime).toLocaleString()}` : ""}
              </p>
              {announcement.picture && <img src={announcement.picture} alt="event" width={100} />}
              <p>{announcement.description}</p>
              <button onClick={() => handleReportClick(announcement)}>Report</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Report Modal */}
      {reportModalVisible && (
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
              <button onClick={handleReportSubmit}>Submit</button>
              <button onClick={() => setReportModalVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;