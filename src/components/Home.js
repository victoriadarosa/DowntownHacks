import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = ({ user, onLogout }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [filters, setFilters] = useState({
    eventType: "",
    location: "",
    startDate: "",
    endDate: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    axios
      .get("http://localhost:5001/api/announcements")
      .then((response) => {
        setAnnouncements(response.data);
      })
      .catch((error) => {
        console.error("Error fetching announcements:", error);
      });
  };

  const handleCreateAnnouncement = () => {
    navigate("/create-announcement");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterSubmit = () => {
    if (!filters.eventType && !filters.location && !filters.startDate && !filters.endDate) {
      alert("Please fill at least one filter to apply.");
      return;
    }

    // If 'All' is selected for eventType, we don't need to include it in the filters
    const updatedFilters = { ...filters };
    if (updatedFilters.eventType === "All") {
      delete updatedFilters.eventType; // Exclude eventType filter
    }

    axios
      .get("http://localhost:5001/api/announcements", { params: updatedFilters })
      .then((response) => {
        setAnnouncements(response.data);
      })
      .catch((error) => {
        console.error("Error fetching filtered announcements:", error);
      });
  };

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={onLogout}>Logout</button>
      <button onClick={handleCreateAnnouncement}>Create Announcement</button>

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
          <label>Location:</label>
          <input type="text" name="location" value={filters.location} onChange={handleFilterChange} />
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
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
              <p>
                {new Date(announcement.startTime).toLocaleString()} -{" "}
                {new Date(announcement.endTime).toLocaleString()}
              </p>
              {announcement.picture && <img src={announcement.picture} alt="event" width={100} />}
              <p>{announcement.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
