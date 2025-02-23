import React, { useEffect, useRef, useCallback } from "react";
// import jwtDecode from 'jwt-decode';
import * as jwtDecode from 'jwt-decode';
// import jwtDecode from 'jwt-decode';

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const buttonRef = useRef(null);

  const handleCredentialResponse = useCallback((response) => {
    try {
      const decodedToken = jwtDecode(response.credential);
      console.log("User Info:", decodedToken);
      onLoginSuccess(decodedToken);
    } catch (error) {
      console.error("JWT Decode Error:", error);
    }
  }, [onLoginSuccess]);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "522157024179-3et3elsqm7djosravtlcm11j5c7774vr.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
          });
        }
      } else {
        console.error("Google API not loaded");
      }
    };

    // Ensure Google script is loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    }
  }, [handleCredentialResponse]);

  return <div ref={buttonRef}></div>;
};

export default GoogleLoginButton;
