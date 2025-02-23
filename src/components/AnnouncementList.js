import React, { useState, useEffect } from "react";
import styles from "./styles/Home.module.css";
import { FaExclamationTriangle } from "react-icons/fa";

const colors = ["#f0adb0", "#fec9dc", "rgb(232, 243, 206)", "#f2dfb9", "#c3deb6", "#fee9e7", "#ffd8e7"];

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return new Date(date).toLocaleString('en-US', options);
};

const AnnouncementList = ({ announcements, locations, onReportClick }) => {
  // State to hold the background colors for announcements
  const [backgroundColors, setBackgroundColors] = useState({});

  useEffect(() => {
    const colorMap = {};
    announcements.forEach((announcement) => {
      colorMap[announcement._id] = colors[Math.floor(Math.random() * colors.length)];
    });
    setBackgroundColors(colorMap);
  }, [announcements]); // This effect runs only when `announcements` change

  return (
    <div className={styles.announcementGrid}>
      {announcements.map((announcement) => {
        const startTime = formatDate(announcement.startTime);
        const endTime = announcement.endTime ? formatDate(announcement.endTime) : null;
        const backgroundColor = backgroundColors[announcement._id]; // Use the color from the state

        return (
          <div key={announcement._id} className={styles.announcementCard} style={{ backgroundColor }}>
            <h3>{announcement.eventName}</h3>
            <p className={styles.announcementLocation}> 📍
                {locations[announcement._id] || "Unknown"}
            </p>
            <p className={styles.announcementDate}>
              Date: {startTime}{endTime ? ` - ${endTime}` : ''}
            </p>
            <p className={styles.announcementDescription}>{announcement.description}</p>
            <div
              onClick={() => onReportClick(announcement)}
              className={styles.reportFlag}
            >
              <FaExclamationTriangle />
              </div> 
          </div>
        );
      })}
    </div>
  );
};

export default AnnouncementList;
