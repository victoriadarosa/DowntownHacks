import React from "react";

const AnnouncementList = ({ announcements, locations, onReportClick }) => {
  return (
    <ul>
      {announcements.map((announcement) => (
        <li key={announcement._id}>
          <h3>{announcement.eventName}</h3>
          <p>{announcement.eventType}</p>
          <p>{announcement.location}</p>
          <p>
            <span role="img" aria-label="location">
              📍
            </span>
            {locations[announcement._id] || "Fetching location..."}
          </p>
          <p>
            {new Date(announcement.startTime).toLocaleString()}
            {announcement.endTime ? ` - ${new Date(announcement.endTime).toLocaleString()}` : ""}
          </p>
          <p>{announcement.description}</p>
          <button onClick={() => onReportClick(announcement)}>Report</button>
        </li>
      ))}
    </ul>
  );
};

export default AnnouncementList;