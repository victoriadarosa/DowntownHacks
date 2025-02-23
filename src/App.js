import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Map from "./components/Map";
import CreateAnnouncement from "./components/CreateAnnouncement"; 
import axios from "axios"; 
import NavBar from "./components/Navbar";

const App = () => {
  
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [announcements, setAnnouncements] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const handleGoogleLogin = (event) => {
      const { credential } = event.detail;
      const userInfo = parseJwt(credential);
      if (userInfo) {
        setUser(userInfo);
        sessionStorage.setItem("user", JSON.stringify(userInfo));
      }
    };

    window.addEventListener("google-login", handleGoogleLogin);

    return () => {
      window.removeEventListener("google-login", handleGoogleLogin);
    };
  }, []);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

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
      <NavBar user={user} onLogout={handleLogout} /> {/* Show NavBaronly when user is logged in */}
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <div>
                <h1>Google Login</h1>
                <div
                  className="g_id_signin"
                  data-type="standard"
                  data-size="large"
                  data-theme="outline"
                  data-text="sign_in_with"
                  data-shape="rectangular"
                  data-logo_alignment="left"
                ></div>
              </div>
            ) : (
              <Navigate to="/home" />
            )
          }
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
          element={
            user ? (
              <Map 
                announcements={announcements}
                userLocation={userLocation}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;