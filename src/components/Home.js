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
    const { eventType, location, startDate, endDate } = filters;
    // Create query string based on filters
    const query = new URLSearchParams({
      eventType,
      location,
      startDate,
      endDate,
    }).toString();

    // Fetch announcements with filters
    axios
      .get(`http://localhost:5001/api/announcements?${query}`)
      .then((response) => {
        setAnnouncements(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching announcements!", error);
      });
  }, [filters]); // Re-fetch when filters change

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

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={onLogout}>Logout</button>
      <button onClick={handleCreateAnnouncement}>Create Announcement</button>

      {/* Filter Form */}
      <div>
        <h2>Filter Announcements</h2>
        
        {/* Event Type Filter as a Select Dropdown */}
        <select
          name="eventType"
          value={filters.eventType}
          onChange={handleFilterChange}
        >
          <option value="">Select Event Type</option>
          <option value="Local Events">Local Events</option>
          <option value="Outdoor Activities">Outdoor Activities</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Health">Health</option>
          <option value="Family & Kids">Family & Kids</option>
          <option value="Networking">Networking</option>
          <option value="Other">Other</option>
          {/* Add more options as needed */}
        </select>

        {/* Location Filter */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        
        {/* Date Range Filter */}
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
      </div>

      {/* Display the filtered announcements */}
      <div>
        <h2>Announcements</h2>
        <ul>
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <li key={announcement._id}>
                <h3>{announcement.eventName}</h3>
                <p>{announcement.eventType}</p>
                <p>{announcement.location}</p>
                <p>
                  {new Date(announcement.startTime).toLocaleString()} -{" "}
                  {new Date(announcement.endTime).toLocaleString()}
                </p>
                {announcement.picture && (
                  <img src={announcement.picture} alt="event" width={100} />
                )}
                <p>{announcement.description}</p>
              </li>
            ))
          ) : (
            <p>No announcements found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
