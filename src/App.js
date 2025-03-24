/**
 * Main entry point for the application.
 * 
 * This React app allows users to log in, view announcements, create new announcements, and view them on a map. 
 * It includes routing, authentication, and location fetching features.
 * 
 * Components:
 * - Home: Displays a homepage with user details and logout option.
 * - Map: Displays a map of announcements based on the user's location.
 * - CreateAnnouncement: Form to create a new announcement.
 * - NavBar: A navigation bar that is shown only when the user is logged in.
 * - Login: Login screen for user authentication.
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Map from "./components/Map";
import CreateAnnouncement from "./components/CreateAnnouncement";
import axios from "axios";
import NavBar from "./components/Navbar";
import Login from "./components/Login";

const App = () => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [announcements, setAnnouncements] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/announcements");
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const fetchUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  useEffect(() => {
    if (user) {
      fetchAnnouncements();
      fetchUserLocation();
    }
  }, [user]);

  return (
    <Router>
      {user && <NavBar user={user} onLogout={handleLogout} />} {/* Show NavBar only when logged in */}
      <Routes>
        <Route
          path="/"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/home" />}
        />
        <Route
          path="/home"
          element={user ? <Home user={user} onLogout={handleLogout} userLocation={userLocation} /> : <Navigate to="/" />}
        />
        <Route
          path="/create-announcement"
          element={user ? <CreateAnnouncement /> : <Navigate to="/" />}
        />
        <Route
          path="/map"
          element={user ? <Map announcements={announcements} userLocation={userLocation} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
