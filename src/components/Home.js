import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Home = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleCreateAnnouncement = () => {
    navigate("/create-announcement"); // Redirect to the create announcement page
  };

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={onLogout}>Logout</button>
      <button onClick={handleCreateAnnouncement}>Create Announcement</button>
    </div>
  );
};

export default Home;
