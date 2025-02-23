import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css"; // Import the CSS file for styling

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleLogin = (event) => {
      const { credential } = event.detail;
      const userInfo = parseJwt(credential);
      if (userInfo) {
        setUser(userInfo);
        sessionStorage.setItem("user", JSON.stringify(userInfo));
        navigate("/home"); // Redirect to Home after login
      }
    };

    window.addEventListener("google-login", handleGoogleLogin);
    return () => {
      window.removeEventListener("google-login", handleGoogleLogin);
    };
  }, [setUser, navigate]);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-header">Community Board</h1>
      <h3 className="login-h3">Stay Updated, Stay Engaged.</h3>
      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div>
      <p className="login-paragraph"> A digital notice board </p>
      <p className="login-paragraph"> Post and discover local events, volunteer opportunities, and neighborhood news. </p>
    </div>
  );
};

export default Login;
