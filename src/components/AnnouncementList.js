import React from "react";
import styles from "./styles/Home.module.css";

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return new Date(date).toLocaleString('en-US', options);
};

const AnnouncementList = ({ announcements, locations, onReportClick }) => {
  return (
    <div className={styles.announcementGrid}>
      {announcements.map((announcement) => {
        const startTime = formatDate(announcement.startTime);
        const endTime = announcement.endTime ? formatDate(announcement.endTime) : null;

        return (
          <div key={announcement._id} className={styles.announcementCard}>
            <h3>{announcement.eventName}</h3>
            <p>{announcement.description}</p>
            <p>
              Location: {locations[announcement._id] || "Unknown"}
            </p>
            <p>
              Date: {startTime}{endTime ? ` - ${endTime}` : ''}
            </p>
            <button onClick={() => onReportClick(announcement)}>Report</button>
          </div>
        );
      })}
    </div>
  );
};

export default AnnouncementList;