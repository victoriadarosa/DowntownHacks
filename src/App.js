import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import GoogleLoginButton from "./components/GoogleLoginButton";
import Home from "./components/Home"; // Import your Home component

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <div>
                <h1>Google Login</h1>
                <GoogleLoginButton onLoginSuccess={setUser} />
              </div>
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/home"
          element={
            <Home /> 
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
