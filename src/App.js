import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import CreateAnnouncement from "./components/CreateAnnouncement"; // Import CreateAnnouncement component

const App = () => {
  const [user, setUser] = useState(() => {
    // Retrieve user from session storage if available
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const handleGoogleLogin = (event) => {
      const { credential } = event.detail;
      const userInfo = parseJwt(credential);
      if (userInfo) {
        setUser(userInfo);
        sessionStorage.setItem("user", JSON.stringify(userInfo)); // Persist user session
      }
    };

    window.addEventListener("google-login", handleGoogleLogin);

    return () => {
      window.removeEventListener("google-login", handleGoogleLogin);
    };
  }, []);

  // Function to decode Google JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    } catch (e) {
      return null;
    }
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user"); // Clear session on logout
  };

  return (
    <Router>
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
          element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="/create-announcement"
          element={user ? <CreateAnnouncement /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;