import React, { useState, useEffect, useRef } from "react"; 

const loadGoogleMaps = (callback) => {
  const tryLoadScript = (retryCount = 0) => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      callback(window.google.maps);
      return;
    }

    // Maximum retry count to avoid infinite retries
    if (retryCount > 3) {
      console.error("Google Maps API failed to load after several attempts.");
      return;
    }

    // Check if the Google Maps script is already present in the DOM
    const existingScript = document.querySelector("script[src*='maps.googleapis.com']");
    if (existingScript) {
      // If already loading, wait for it to load
      existingScript.addEventListener("load", () => tryLoadScript(retryCount + 1));
      return;
    }

    // Create the script element to load Google Maps API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`; // Make sure to use your own API key here
    script.async = true;
    script.defer = true;

    // Attempt to load the script
    script.onload = () => {
      // Check if Maps API loaded correctly
      if (window.google && window.google.maps && window.google.maps.places) {
        callback(window.google.maps);
      } else {
        console.error("Google Maps API failed to load.");
        setTimeout(() => tryLoadScript(retryCount + 1), 3000); // Retry after 3 seconds
      }
    };

    script.onerror = () => {
      console.error("Failed to load Google Maps script.");
      setTimeout(() => tryLoadScript(retryCount + 1), 3000); // Retry on error
    };

    document.body.appendChild(script);
  };

  // Start loading the script and checking if it's ready
  tryLoadScript();
};

const CreateAnnouncement = () => {
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadGoogleMaps((google) => {
      if (!google || !google.maps || !google.maps.places) {
        setError("Google Maps API is unavailable. Please try again later.");
        return;
      }

      if (inputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["geocode"],
          componentRestrictions: { country: "us" },
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            setLocation(place.formatted_address);
          }
        });
      }
    });
  }, []); // Empty dependency array to load only once

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Announcement created for location: ${location}`);
  };

  return (
    <div>
      <h2>Create Announcement</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Location:
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter a location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateAnnouncement;





// import React, { useState, useEffect } from "react";

// const loadGooglePlaces = (callback) => {
//   // Check if Google Maps API is already loaded
//   if (window.google && window.google.maps && window.google.maps.places) {
//     callback(window.google.maps);
//     return;
//   }

//   // Check if the script is already in the DOM to avoid multiple loads
//   if (document.querySelector("script[src*='maps.googleapis.com']")) {
//     document
//       .querySelector("script[src*='maps.googleapis.com']")
//       .addEventListener("load", () => {
//         if (window.google && window.google.maps && window.google.maps.places) {
//           callback(window.google.maps);
//         }
//       });
//     return;
//   }

//   // Create and load the Google Maps script
//   const script = document.createElement("script");
//   script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
//   script.async = true;
//   script.defer = true;
//   script.onload = () => {
//     if (window.google && window.google.maps && window.google.maps.places) {
//       callback(window.google.maps);
//     } else {
//       console.error("Google Maps API failed to load.");
//     }
//   };

//   document.body.appendChild(script);
// };

// const CreateAnnouncement = () => {
//   const [location, setLocation] = useState("");

//   useEffect(() => {
//     loadGooglePlaces((google) => {
//       if (!google || !google.maps || !google.maps.places) {
//         console.error("Google Maps API is not available.");
//         return;
//       }

//       setTimeout(() => {
//         const input = document.getElementById("location-input");
//         if (!input) {
//           console.error("Location input field not found.");
//           return;
//         }

//         const autocomplete = new google.maps.places.Autocomplete(input, {
//           types: ["geocode"],
//         });

//         autocomplete.addListener("place_changed", () => {
//           const place = autocomplete.getPlace();
//           if (place && place.formatted_address) {
//             setLocation(place.formatted_address);
//           }
//         });
//       }, 1000); // Adding a slight delay
//     });
//   }, []);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     alert(`Announcement created for location: ${location}`);
//   };

//   return (
//     <div>
//       <h2>Create Announcement</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Location:
//           <input
//             type="text"
//             id="location-input"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             placeholder="Enter a location"
//           />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default CreateAnnouncement;
