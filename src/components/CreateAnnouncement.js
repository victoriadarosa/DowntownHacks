import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createAnnouncement } from "../utils/api";
import styles from "./styles/CreateAnnouncement.module.css";

const CreateAnnouncement = () => {
  const inputRef = useRef(null);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps API not loaded");
      return;
    }

    const center = { lat: 50.064192, lng: -130.605469 };
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };

    if (inputRef.current) {
      const options = {
        bounds: defaultBounds,
        componentRestrictions: { country: "us" },
        fields: ["address_components", "geometry", "icon", "name"],
        strictBounds: false,
      };

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, options);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setLocation({ lat, lng });
        }
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (endTime && end < start) {
      setError("End time cannot be before start time.");
      return;
    }

    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("eventType", eventType);
    formData.append("latitude", location.lat);
    formData.append("longitude", location.lng);
    formData.append("startTime", startTime);
    if (endTime) formData.append("endTime", endTime);
    if (description) formData.append("description", description);

    try {
      await createAnnouncement(formData);
      navigate("/home");
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2>Create Announcement</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Event Name:</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Event Type:</label>
            <select value={eventType} onChange={(e) => setEventType(e.target.value)} required>
              <option value="">Select event type</option>
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
          <div className={styles.formGroup}>
            <label>Location:</label>
            <input
              id="pac-input"
              ref={inputRef}
              type="text"
              placeholder="Enter a location"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Start Time:</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>End Time (Optional):</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className={styles.formGroup}>
            <label>Description (Optional):</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>Create Announcement</button>
            <button type="button" className={styles.backButton} onClick={() => navigate("/home")}>
              Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
