import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAnnouncements } from "../utils/api";
import { fetchLocationAddress } from "../utils/geocode";
import AnnouncementList from "./AnnouncementList";
import ReportModal from "./ReportModal";

const Home = ({ user, onLogout, userLocation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [locations, setLocations] = useState({});
  const [filters, setFilters] = useState({ eventType: "", startTime: "" });
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userLocation) {
      fetchAnnouncements(filters).then((data) => {
        setAnnouncements(data);
        fetchLocations(data);
      });
    }
  }, [filters, userLocation]);

  const fetchLocations = async (announcements) => {
    const newLocations = {};
    for (const announcement of announcements) {
      if (announcement.longitude && announcement.latitude) {
        const address = await fetchLocationAddress(announcement.latitude, announcement.longitude);
        newLocations[announcement._id] = address;
      }
    }
    setLocations(newLocations);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleFilterSubmit = () => {
    if (!filters.eventType && !filters.startTime) {
      alert("Please fill at least one filter to apply.");
      return;
    }
    fetchAnnouncements(filters).then((data) => {
      setAnnouncements(data);
      fetchLocations(data);
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
      <button onClick={() => navigate("/create-announcement")}>Create Announcement</button>
      <button onClick={() => navigate("/map")}>Map</button>

      {/* Filter Form */}
      <div>
        <h2>Filter Announcements</h2>
        <div>
          <label>Event Type:</label>
          <select name="eventType" value={filters.eventType} onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="Safety Alerts">Safety Alerts</option>
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

      {/* Announcement List */}
      <AnnouncementList
        announcements={announcements}
        locations={locations}
        onReportClick={handleReportClick}
      />

      {/* Report Modal */}
      <ReportModal
        isVisible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={handleReportSubmit}
        reportReason={reportReason}
        setReportReason={setReportReason}
      />
    </div>
  );
};

export default Home;