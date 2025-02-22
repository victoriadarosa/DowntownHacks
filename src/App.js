import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Home from "./components/Home";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/home");
    }
  }, [setUser, navigate]);

  // Function to handle Google login manually
  const handleGoogleLogin = async () => {
    try {
      const googleAuth = window.google?.accounts?.oauth2;
      if (!googleAuth) {
        console.error("Google Auth API not loaded.");
        return;
      }

      // Trigger Google login
      const response = await googleAuth.initTokenClient({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        scope: "profile email",
        callback: (response) => {
          if (response.access_token) {
            fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${response.access_token}` },
            })
              .then((res) => res.json())
              .then((userInfo) => {
                setUser(userInfo);
                localStorage.setItem("user", JSON.stringify(userInfo));
                navigate("/home"); // Redirect to home page
              });
          }
        },
      });

      response.requestAccessToken();
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div>
      <h1>Google Login</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;



// import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// // import GoogleLoginButton from "./components/GoogleLoginButton";
// import Home from "./components/Home"; // Import your Home component

// const App = () => {
//   const [user, setUser] = useState(null);

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             !user ? (
//               <div>
//                 <h1>Google Login</h1>
//                 {/* <GoogleLoginButton onLoginSuccess={setUser} /> */}
//               </div>
//             ) : (
//               <Navigate to="/home" />
//             )
//           }
//         />
//         <Route
//           path="/home"
//           element={
//             <Home /> 
//           }
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
