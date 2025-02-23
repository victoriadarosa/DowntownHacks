import React from "react";
import styles from "./styles/Home.module.css";

const AnnouncementList = ({ announcements, locations, onReportClick }) => {
  return (
    <div className={styles.announcementGrid}>
      {announcements.map((announcement) => (
        <div key={announcement._id} className={styles.announcementCard}>
          <h3>{announcement.title}</h3>
          <p>{announcement.description}</p>
          <p>
            Location: {locations[announcement._id] || "Unknown"}
          </p>
          <button onClick={() => onReportClick(announcement)}>Report</button>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementList;
